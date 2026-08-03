import type { DtfSdk, IndexDtf, IndexDtfProposalDetail, SupportedChainId } from "@reserve-protocol/sdk";
import type { Address } from "viem";

import { erc20Abi, getAddress } from "viem";

import type { ParsedProposalUrl } from "@/rebalance-validation/proposal-url";
import type { DecodedStartRebalance } from "@/rebalance-validation/start-rebalance";

import { decodeStartRebalance } from "@/rebalance-validation/start-rebalance";

export type BasketToken = { readonly address: Address; readonly symbol: string; readonly decimals: number };

export type ProposalContext = {
  readonly chainId: SupportedChainId;
  readonly dtf: IndexDtf;
  readonly proposal: IndexDtfProposalDetail;
  readonly rebalance: DecodedStartRebalance;
  readonly otherActions: readonly { readonly target: Address; readonly functionName: string }[];
  readonly version: string;
  readonly supply: bigint;
  readonly currentBalances: ReadonlyMap<Address, bigint>;
  readonly tokens: readonly BasketToken[];
};

export async function loadProposalContext(sdk: DtfSdk, url: ParsedProposalUrl): Promise<ProposalContext> {
  const { chainId, proposalId } = url;
  const resolved = sdk.index.resolveAlias({ input: url.dtf, chainId });
  if (!resolved || !("address" in resolved)) {
    throw new Error(`could not resolve a single DTF for "${url.dtf}" on chain ${chainId}`);
  }
  const address = getAddress(resolved.address);
  const [dtf, proposal, version, supply, totalAssets] = await Promise.all([
    sdk.index.getDtf({ address, chainId }),
    sdk.index.getProposal({ address, chainId, proposalId }),
    sdk.index.getVersion({ address, chainId }),
    sdk.index.getTotalSupply({ address, chainId }),
    sdk.index.getTotalAssets({ address, chainId }),
  ]);

  const rebalanceActions = proposal.targets.flatMap((target, index) => {
    const callData = proposal.calldatas[index];
    const decoded = callData ? decodeStartRebalance(target, callData) : undefined;

    return decoded ? [decoded] : [];
  });
  const rebalance = rebalanceActions[0];
  if (!rebalance) {
    throw new Error(`proposal ${proposalId} contains no startRebalance action`);
  }
  const otherActions = proposal.decoded.calls
    .filter((call) => call.functionName !== "startRebalance")
    .map((call) => ({ target: call.target, functionName: call.functionName }))
    .concat(
      proposal.decoded.unknownCalls.map((call) => ({ target: call.target, functionName: "UNDECODABLE CALLDATA" })),
      rebalanceActions.slice(1).map((extra) => ({ target: extra.target, functionName: "startRebalance (extra)" })),
    );

  return {
    chainId,
    dtf,
    proposal,
    rebalance,
    otherActions,
    version,
    supply,
    currentBalances: new Map(totalAssets.tokens.map((token, index) => [token, totalAssets.balances[index] ?? 0n])),
    tokens: await fetchTokenMetadata(
      sdk,
      chainId,
      rebalance.tokens.map((token) => token.token),
    ),
  };
}

async function fetchTokenMetadata(
  sdk: DtfSdk,
  chainId: SupportedChainId,
  addresses: readonly Address[],
): Promise<readonly BasketToken[]> {
  const client = sdk.client.viem.getPublicClient(chainId);
  const metadata = await client.multicall({
    allowFailure: false,
    contracts: addresses.flatMap((address) => [
      { address, abi: erc20Abi, functionName: "symbol" } as const,
      { address, abi: erc20Abi, functionName: "decimals" } as const,
    ]),
  });

  return addresses.map((address, index) => ({
    address,
    symbol: metadata[index * 2] as string,
    decimals: metadata[index * 2 + 1] as number,
  }));
}
