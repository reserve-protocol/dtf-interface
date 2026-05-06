import { FolioVersion as RebalanceLibVersion } from "@reserve-protocol/dtf-rebalance-lib";
import { encodeFunctionData, getAddress, type Address, type Hex } from "viem";
import type { DtfClient } from "../../../client.js";
import { SdkError } from "../../../errors.js";
import type { DtfParams } from "../../../types/common.js";
import type { IndexDtfCall } from "../../../types/governance.js";
import type { IndexDtf } from "../../../types/index-dtf.js";
import {
  buildIndexDtfBasketRebalance,
  indexDtfBasketSchema,
  indexDtfBasketSharesSchema,
  indexDtfBasketTokenSchema,
  indexDtfBasketUnitsSchema,
  type BuildIndexDtfBasketRebalanceParams,
  type BuiltIndexDtfBasketRebalance,
  type IndexDtfBasketBuildAsset,
  type IndexDtfBasketBuildVersion,
  type IndexDtfBasketInput,
  type IndexDtfBasketSharesInput,
  type IndexDtfBasketTokenInput,
  type IndexDtfBasketUnitsInput,
  type StartRebalanceArgsV4,
  type StartRebalanceArgsV5,
} from "../../dtf/basket/index.js";
import {
  dtfIndexProposalAbiV4,
  dtfIndexProposalAbiV5,
} from "../../abis/dtf-index-proposal.js";
import { getIndexDtf } from "../../dtf/index.js";

export {
  indexDtfBasketSchema as indexDtfBasketProposalSchema,
  indexDtfBasketSharesSchema as indexDtfBasketSharesProposalSchema,
  indexDtfBasketTokenSchema as indexDtfBasketProposalTokenSchema,
  indexDtfBasketUnitsSchema as indexDtfBasketUnitsProposalSchema,
};

export type IndexDtfBasketProposalVersion = IndexDtfBasketBuildVersion;
export type IndexDtfBasketProposalBaseToken = IndexDtfBasketTokenInput;
export type IndexDtfBasketProposalSharesInput = IndexDtfBasketSharesInput;
export type IndexDtfBasketProposalUnitsInput = IndexDtfBasketUnitsInput;
export type IndexDtfBasketProposalInput = IndexDtfBasketInput;
export type IndexDtfBasketProposalAsset = IndexDtfBasketBuildAsset;

export type BuildIndexDtfBasketProposalParams =
  BuildIndexDtfBasketRebalanceParams & {
    readonly description?: string;
    readonly governance?: Address;
  };

export type BuiltIndexDtfBasketProposal = {
  readonly governance: Address;
  readonly targets: readonly Address[];
  readonly calldatas: readonly Hex[];
  readonly description: string;
  readonly context: BuiltIndexDtfBasketRebalance;
};

export async function buildIndexDtfBasketProposal(
  client: DtfClient,
  params: BuildIndexDtfBasketProposalParams,
): Promise<BuiltIndexDtfBasketProposal> {
  const dtf = await getDtfForProposal(client, params);
  const context = await buildIndexDtfBasketRebalance(client, {
    ...params,
    ...(dtf ? { dtf } : {}),
  });
  const authority = getProposalAuthority(params, dtf);

  return {
    governance: authority.governance,
    targets: [context.address],
    calldatas: [buildIndexDtfBasketRebalanceCall(context).calldata],
    description: params.description ?? "",
    context,
  };
}

function buildIndexDtfBasketRebalanceCall(
  context: BuiltIndexDtfBasketRebalance,
): IndexDtfCall {
  return {
    target: context.address,
    calldata: encodeStartRebalanceCalldata(context),
  };
}

async function getDtfForProposal(
  client: DtfClient,
  params: DtfParams & {
    readonly dtf?: IndexDtf;
    readonly governance?: Address;
    readonly weightControl?: boolean;
  },
): Promise<IndexDtf | undefined> {
  if (params.dtf || (params.governance && params.weightControl !== undefined)) {
    return params.dtf;
  }

  return getIndexDtf(client, params);
}

function encodeStartRebalanceCalldata(
  context: BuiltIndexDtfBasketRebalance,
): Hex {
  if (context.version === RebalanceLibVersion.V5) {
    const args = context.startRebalanceArgs as StartRebalanceArgsV5;

    return encodeFunctionData({
      abi: dtfIndexProposalAbiV5,
      functionName: "startRebalance",
      args: [
        args.tokens.map((token) => ({
          ...token,
          token: getAddress(token.token),
        })),
        args.limits,
        context.auctionLauncherWindow,
        context.ttl,
      ],
    });
  }

  const args = context.startRebalanceArgs as StartRebalanceArgsV4;

  return encodeFunctionData({
    abi: dtfIndexProposalAbiV4,
    functionName: "startRebalance",
    args: [
      context.tokenOrder,
      args.weights,
      args.prices,
      args.limits,
      context.auctionLauncherWindow,
      context.ttl,
    ],
  });
}

function getProposalAuthority(
  params: { readonly governance?: Address },
  dtf: IndexDtf | undefined,
): { governance: Address } {
  const authority = dtf?.governance.rebalance.primary;
  const resolvedGovernance =
    params.governance ??
    (authority?.type === "governance" ? authority.address : undefined);

  if (!resolvedGovernance) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "governance is required to build an Index DTF basket proposal",
      meta: { governance: resolvedGovernance },
    });
  }

  return { governance: resolvedGovernance };
}
