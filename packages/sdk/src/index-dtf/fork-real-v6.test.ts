import {
  createPublicClient,
  createWalletClient,
  encodeAbiParameters,
  encodeFunctionData,
  erc20Abi,
  getAddress,
  http,
  keccak256,
  parseAbi,
  parseEther,
  parseEventLogs,
  parseUnits,
  toBytes,
  toHex,
  zeroAddress,
  zeroHash,
  type Address,
  type Hex,
  type PublicClient,
  type TransactionReceipt,
  type WalletClient,
} from "viem";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import type { SupportedChainId } from "@/config";
import type { IndexDtfCall } from "@/types/governance";

import { SUPPORTED_CHAINS } from "@/config";
import { createDtfSdk, type DtfSdk } from "@/create-dtf-sdk";
import { folioDeployerV6Abi } from "@/index-dtf/abis/folio-deployer-v6.generated";
import { folioV6Abi } from "@/index-dtf/abis/folio-v6.generated";
import { folioVersionRegistryAbi } from "@/index-dtf/abis/folio-version-registry.generated";
import {
  DEFAULT_INDEX_DTF_DEPLOY_FLAGS,
  extractIndexDtfDeployedAddress,
  getIndexDtfDeployerAddress,
  INDEX_DTF_DEPLOYER_ADDRESS,
  INDEX_DTF_V6_DEPLOYER_ADDRESS,
} from "@/index-dtf/deploy";
import { assertDisposableForkRpcUrl } from "@/index-dtf/fork-smoke-fixture";
import { INDEX_DTF_START_REBALANCE_SELECTOR } from "@/index-dtf/governance/propose/upgrade-v6";
import { getIndexDtfVersionHash, INDEX_DTF_VERSION_REGISTRY_ADDRESS } from "@/index-dtf/version-registry";

/**
 * Real-address Folio 6.0 evidence: the SDK's default v6 deployer on disposable, unindexed Anvil forks of
 * mainnet, Base and BSC. Every write is impersonated and the whole chain run sits inside one
 * `evm_snapshot`/`evm_revert`, so a fork can be reused. Start the forks first (see the SDK README).
 */
const runtimeEnv =
  (globalThis as unknown as { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {};
const forkDescribe = runtimeEnv.RUN_INDEX_DTF_FORK_REAL_V6 === "1" ? describe : describe.skip;
// Cold forks fetch every touched slot from the upstream RPC; BSC public endpoints are the slowest.
const forkTestTimeout = 300_000;
const D18 = 10n ** 18n;
const D27 = 10n ** 27n;
const FORK_TRANSACTION_GAS = 12_000_000n;

// Loopback ports for the three disposable forks; 8545 is the shared, indexed sandbox and is refused.
const REAL_FORKS = [
  {
    chainId: 1,
    rpcUrl: runtimeEnv.INDEX_DTF_FORK_REAL_V6_RPC_URL_1 ?? "http://127.0.0.1:8546",
    wrappedNative: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    stable: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    nativePrice: 2500,
  },
  {
    chainId: 8453,
    rpcUrl: runtimeEnv.INDEX_DTF_FORK_REAL_V6_RPC_URL_8453 ?? "http://127.0.0.1:8547",
    wrappedNative: "0x4200000000000000000000000000000000000006",
    stable: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    nativePrice: 2500,
  },
  {
    chainId: 56,
    rpcUrl: runtimeEnv.INDEX_DTF_FORK_REAL_V6_RPC_URL_56 ?? "http://127.0.0.1:8548",
    wrappedNative: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
    stable: "0x55d398326f99059fF775485246999027B3197955",
    nativePrice: 600,
  },
] as const satisfies readonly {
  readonly chainId: SupportedChainId;
  readonly rpcUrl: string;
  readonly wrappedNative: Address;
  readonly stable: Address;
  // Fixture USD price. The actor is the only bidder, so prices only need to be self-consistent.
  readonly nativePrice: number;
}[];

const ACTOR = getAddress("0x00000000000000000000000000000000000a11ce");
const EXTRA_GUARDIAN = getAddress("0x00000000000000000000000000000000000b0b00");
const IMMUTABLE_RECIPIENT = getAddress("0x000000000000000000000000000000000000bEEF");
const MAX_AUCTION_LENGTH = 1800n;
const SELF_FEE = parseEther("0.1");
const ERC1967_IMPLEMENTATION_SLOT = "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc";
const DEFAULT_ADMIN_ROLE = zeroHash;
const REBALANCE_MANAGER = keccak256(toBytes("REBALANCE_MANAGER"));
const AUCTION_LAUNCHER = keccak256(toBytes("AUCTION_LAUNCHER"));
const PROPOSER_ROLE = keccak256(toBytes("PROPOSER_ROLE"));
const EXECUTOR_ROLE = keccak256(toBytes("EXECUTOR_ROLE"));
const CANCELLER_ROLE = keccak256(toBytes("CANCELLER_ROLE"));
const OPTIMISTIC_PARAMS = { vetoDelay: 60n, vetoPeriod: 300n, vetoThreshold: parseEther("0.05") } as const;

// The SDK has no builders for these: wrapping native, the vote-lock vault from the optimistic governor
// deployer (the v6 governed deploy needs an existing optimistic vault), and registry administration.
const wrappedNativeAbi = parseAbi(["function deposit() payable"]);
const accessControlAbi = parseAbi([
  "function hasRole(bytes32 role, address account) view returns (bool)",
  "function getRoleMemberCount(bytes32 role) view returns (uint256)",
  "function getRoleMember(bytes32 role, uint256 index) view returns (address)",
  "function isOwner(address account) view returns (bool)",
  "function owner() view returns (address)",
]);
const optimisticGovernorDeployerAbi = parseAbi([
  "struct OptimisticGovernanceParams { uint48 vetoDelay; uint32 vetoPeriod; uint256 vetoThreshold; }",
  "struct StandardGovernanceParams { uint48 votingDelay; uint32 votingPeriod; uint48 voteExtension; uint256 proposalThreshold; uint256 quorumNumerator; }",
  "struct SelectorData { address target; bytes4[] selectors; }",
  "struct BaseDeploymentParams { OptimisticGovernanceParams optimisticParams; StandardGovernanceParams standardParams; SelectorData[] selectorData; address[] optimisticProposers; address[] additionalGuardians; uint256 timelockDelay; uint256 proposalThrottleCapacity; }",
  "struct NewStakingVaultParams { address underlying; address[] rewardTokens; uint256 rewardHalfLife; uint256 unstakingDelay; }",
  "function deployWithNewStakingVault(BaseDeploymentParams baseParams, NewStakingVaultParams newStakingVaultParams, bytes32 deploymentNonce) returns (address stakingVault, address governor, address timelock, address selectorRegistry)",
  "function version() view returns (string)",
  "function guardian() view returns (address)",
  "event ReserveOptimisticGovernorSystemDeployed(address indexed stakingVault, address indexed governor, address indexed timelock, address optimisticSelectorRegistry)",
]);

forkDescribe.each(REAL_FORKS)("Folio 6.0 real deployer fork on chain $chainId", (fork) => {
  const chainId = fork.chainId;
  const chain = SUPPORTED_CHAINS[chainId];
  const deployer = INDEX_DTF_V6_DEPLOYER_ADDRESS[chainId];
  const wrappedNative = getAddress(fork.wrappedNative);
  const stable = getAddress(fork.stable);
  let publicClient: PublicClient;
  let wallet: WalletClient;
  let sdk: DtfSdk;
  let snapshot: Hex | undefined;
  let stableDecimals: number;
  let folioImplementation: Address;
  let optimisticGovernorDeployer: Address;
  let forkBlock: bigint;
  let folio: Address;
  const impersonated = new Set<Address>();

  beforeAll(async () => {
    assertDisposableForkRpcUrl(fork.rpcUrl);
    publicClient = createPublicClient({ chain, transport: http(fork.rpcUrl, { timeout: 120_000 }) });
    wallet = createWalletClient({ chain, transport: http(fork.rpcUrl, { timeout: 120_000 }) });
    sdk = createDtfSdk({ chains: { [chainId]: { publicClient } } });

    const clientVersion = await publicClient.request({ method: "web3_clientVersion" });
    if (!clientVersion.toLowerCase().startsWith("anvil")) {
      throw new Error(`${fork.rpcUrl} is not an Anvil fork (${clientVersion})`);
    }
    expect(await publicClient.getChainId()).toBe(chainId);
    forkBlock = await publicClient.getBlockNumber();
    snapshot = (await publicClient.request({ method: "evm_snapshot" as never, params: [] as never })) as Hex;

    await impersonate(ACTOR);
    await send(ACTOR, {
      chainId,
      to: wrappedNative,
      data: encodeFunctionData({ abi: wrappedNativeAbi, functionName: "deposit" }),
      value: parseEther("10"),
    });
    stableDecimals = await publicClient.readContract({ address: stable, abi: erc20Abi, functionName: "decimals" });
    await dealErc20(stable, ACTOR, parseUnits("1000000", stableDecimals));
  }, forkTestTimeout);

  afterAll(async () => {
    if (!publicClient) return;
    for (const account of impersonated) {
      await publicClient.request({ method: "anvil_stopImpersonatingAccount" as never, params: [account] as never });
    }
    if (snapshot) await publicClient.request({ method: "evm_revert" as never, params: [snapshot] as never });
  }, forkTestTimeout);

  it(
    "defaults the v6 target to the chain's real 6.0.0 deployer and reads its production wiring",
    async ({ annotate }) => {
      const v5Deployer = INDEX_DTF_DEPLOYER_ADDRESS[chainId];
      expect(getIndexDtfDeployerAddress({ chainId, version: "6.0.0" })).toBe(deployer);

      const [version, implementation, versionRegistry, daoFeeRegistry, trustedFillerRegistry, governorDeployer] =
        await publicClient.multicall({
          allowFailure: false,
          contracts: [
            { address: deployer, abi: folioDeployerV6Abi, functionName: "version" },
            { address: deployer, abi: folioDeployerV6Abi, functionName: "folioImplementation" },
            { address: deployer, abi: folioDeployerV6Abi, functionName: "versionRegistry" },
            { address: deployer, abi: folioDeployerV6Abi, functionName: "daoFeeRegistry" },
            { address: deployer, abi: folioDeployerV6Abi, functionName: "trustedFillerRegistry" },
            { address: deployer, abi: folioDeployerV6Abi, functionName: "optimisticGovernorDeployer" },
          ],
        });
      // The v5 deployer shares the registry wiring; its ABI has the same getters.
      const [v5DaoFeeRegistry, v5TrustedFillerRegistry] = await publicClient.multicall({
        allowFailure: false,
        contracts: [
          { address: v5Deployer, abi: folioDeployerV6Abi, functionName: "daoFeeRegistry" },
          { address: v5Deployer, abi: folioDeployerV6Abi, functionName: "trustedFillerRegistry" },
        ],
      });
      folioImplementation = getAddress(implementation);
      optimisticGovernorDeployer = getAddress(governorDeployer);

      expect(version).toBe("6.0.0");
      expect(getAddress(versionRegistry)).toBe(INDEX_DTF_VERSION_REGISTRY_ADDRESS[chainId]);
      expect(getAddress(daoFeeRegistry)).toBe(getAddress(v5DaoFeeRegistry));
      expect(getAddress(trustedFillerRegistry)).toBe(getAddress(v5TrustedFillerRegistry));
      expect(
        await publicClient.readContract({
          address: optimisticGovernorDeployer,
          abi: optimisticGovernorDeployerAbi,
          functionName: "version",
        }),
      ).toBe("1.1.0");
      await annotate(
        `chain ${chainId} fork head ${forkBlock}: deployer ${deployer}, implementation ${folioImplementation}, daoFeeRegistry ${daoFeeRegistry}, trustedFillerRegistry ${trustedFillerRegistry}, OGD 1.1.0 ${optimisticGovernorDeployer}`,
      );
    },
    forkTestTimeout,
  );

  it(
    "deploys an ungoverned Folio through the default deployer and reads the v6 state back through the SDK",
    async ({ annotate }) => {
      const basicDetails = getBasicDetails("Real v6 fork", "RV6F");
      const plan = sdk.index.prepareDeployPlan({
        chainId,
        version: "6.0.0",
        basicDetails,
        additionalDetails: {
          maxAuctionLength: MAX_AUCTION_LENGTH,
          feeRecipients: [{ recipient: ACTOR, portion: parseEther("0.6") }],
          immutableFeeRecipients: [{ recipient: IMMUTABLE_RECIPIENT, portion: parseEther("0.4") }],
          tvlFee: 0n,
          mintFee: 0n,
          selfFee: SELF_FEE,
          mandate: "Real v6 deployer fork evidence",
        },
        flags: DEFAULT_INDEX_DTF_DEPLOY_FLAGS,
        owner: ACTOR,
        basketManagers: [ACTOR],
        auctionLaunchers: [ACTOR],
        deploymentNonce: keccak256(toBytes(`fork-real-v6-ungoverned-${chainId}`)),
        approvals: basicDetails.assets.map((token, index) => ({ token, amount: basicDetails.amounts[index]! })),
      });
      if (plan.type !== "approval-required") throw new Error("expected an approval plan");
      expect(plan.call.to).toBe(deployer);
      expect(plan.approvals.map((approval) => approval.contract.args[0])).toEqual([deployer, deployer]);

      for (const approval of plan.approvals) await send(ACTOR, approval);
      const receipt = await send(ACTOR, plan.call);
      folio = extractIndexDtfDeployedAddress(receipt.logs, { chainId, version: "6.0.0" });
      const [deployed] = parseEventLogs({
        abi: folioDeployerV6Abi,
        eventName: "FolioDeployed",
        logs: receipt.logs.filter((log) => getAddress(log.address) === deployer),
      });
      const params = { address: folio, chainId } as const;

      expect(deployed?.args).toMatchObject({ folioOwner: ACTOR, folio });
      expect(await sdk.index.getVersion(params)).toBe("6.0.0");
      expect(await getImplementation(folio)).toBe(folioImplementation);
      expect(await sdk.index.getMaxAuctionLength(params)).toBe(MAX_AUCTION_LENGTH);
      expect(await sdk.index.getSelfFee(params)).toEqual({ raw: SELF_FEE, formatted: "0.1" });
      expect(await sdk.index.getImmutableFeeRecipients(params)).toEqual([
        { recipient: IMMUTABLE_RECIPIENT, portion: parseEther("0.4") },
      ]);
      // The mutable table has no SDK RPC read (it comes from the subgraph), so it is read from the contract.
      expect(await readMutableFeeRecipients(folio)).toEqual([{ recipient: ACTOR, portion: parseEther("0.6") }]);
      expect(await sdk.index.getTradeAllowlist(params)).toEqual({ enabled: false, tokens: [] });
      expect(await sdk.index.getIsTokenAllowlisted({ ...params, token: wrappedNative })).toBe(false);
      expect(await sdk.index.getRebalanceNonce(params)).toBe(0n);
      expect(await sdk.index.getRebalanceControl(params)).toEqual({ weightControl: true, priceControl: 1 });
      expect(await sdk.index.getBidsEnabled(params)).toBe(true);
      expect((await sdk.index.getTotalAssets(params)).balanceByToken).toEqual({
        [wrappedNative]: basicDetails.amounts[0],
        [stable]: basicDetails.amounts[1],
      });
      expect(await hasRoles(folio, DEFAULT_ADMIN_ROLE, [ACTOR, deployer])).toEqual([true, false]);
      expect(await hasRoles(folio, REBALANCE_MANAGER, [ACTOR])).toEqual([true]);
      expect(await hasRoles(folio, AUCTION_LAUNCHER, [ACTOR])).toEqual([true]);
      await annotate(`chain ${chainId} ungoverned folio ${folio} (proxy admin ${deployed?.args.folioAdmin})`);
    },
    forkTestTimeout,
  );

  it(
    "runs startRebalance, openAuction and a bid with SDK builders and settles the exact independent amounts",
    async ({ annotate }) => {
      const params = { address: folio, chainId } as const;
      const latest = await publicClient.getBlock();
      const basketProposal = await sdk.index.buildBasketProposal({
        ...params,
        version: "6.0.0",
        // Ungoverned: the basket manager sends the built startRebalance call itself.
        governance: ACTOR,
        weightControl: true,
        prices: { [wrappedNative]: fork.nativePrice, [stable]: 1 },
        priceErrors: { [wrappedNative]: 0.1, [stable]: 0.1 },
        basket: {
          type: "shares",
          tokens: [
            { address: wrappedNative, share: 20 },
            { address: stable, share: 80 },
          ],
        },
        auctionLauncherWindow: 3600,
        ttl: 7200,
        deadline: latest.timestamp + 3600n,
      });
      expect(basketProposal.targets).toEqual([folio]);
      await send(ACTOR, { chainId, to: folio, data: basketProposal.calldatas[0]!, value: 0n });
      expect(await sdk.index.getRebalanceNonce(params)).toBe(1n);

      const current = await sdk.index.getCurrentRebalance(params);
      // Direction from the on-chain rebalance: at spot, the targets hold less native and more stable than the
      // Folio does. {tok} = D18{BU/share} * D27{tok/BU} * {share} / (1e18 * 1e27).
      const spotTarget = (token: Address) => {
        const details = current.rebalance.tokens.find((entry) => getAddress(entry.token) === token);
        if (!details) throw new Error(`${token} is not in the rebalance`);
        return (current.rebalance.limits.spot * details.weight.spot * current.totalSupply) / (D18 * D27);
      };
      expect(spotTarget(wrappedNative)).toBeLessThan(current.totalAssets.balanceByToken[wrappedNative]!);
      expect(spotTarget(stable)).toBeGreaterThan(current.totalAssets.balanceByToken[stable]!);
      const tokens = await Promise.all(
        current.rebalance.tokens.map(async ({ token }) => {
          const address = getAddress(token);
          const [symbol, name, decimals] = await publicClient.multicall({
            allowFailure: false,
            contracts: [
              { address, abi: erc20Abi, functionName: "symbol" },
              { address, abi: erc20Abi, functionName: "name" },
              { address, abi: erc20Abi, functionName: "decimals" },
            ],
          });
          return { address, symbol, name, decimals };
        }),
      );
      const assets = Object.fromEntries(
        current.totalAssets.tokens.map((token, index) => [token.toLowerCase(), current.totalAssets.balances[index]!]),
      );
      const usdPrices = { [wrappedNative.toLowerCase()]: fork.nativePrice, [stable.toLowerCase()]: 1 };
      const auctionLength = await sdk.index.getMaxAuctionLength(params);
      const built = sdk.index.prepareOpenAuctionArgs({
        version: "6.0.0",
        auctionLength,
        rebalance: current.rebalance,
        tokens,
        supply: current.totalSupply,
        initialSupply: current.totalSupply,
        currentAssets: assets,
        initialAssets: assets,
        initialPrices: usdPrices,
        initialWeights: Object.fromEntries(
          current.rebalance.tokens.map(({ token, weight }) => [token.toLowerCase(), weight]),
        ),
        prices: Object.fromEntries(
          Object.entries(usdPrices).map(([token, price]) => [token, { currentPrice: price, snapshotPrice: price }]),
        ),
        tokenPriceVolatility: { [wrappedNative.toLowerCase()]: 0.1, [stable.toLowerCase()]: 0.1 },
        rebalancePercent: 95,
        isTrackingDtf: false,
      });
      await send(ACTOR, sdk.index.prepareOpenAuction({ ...params, version: "6.0.0", args: built.args }));

      const auction = await sdk.index.getLatestAuction(params);
      if (!auction) throw new Error("openAuction left no auction");
      expect(auction).toMatchObject({ auctionId: 0n, rebalanceNonce: 1n, currentRebalanceNonce: 1n });
      expect(auction.endTime - auction.startTime).toBe(auctionLength);

      // Independent arithmetic from contract reads: at `endTime` Folio prices the pair at
      // ceil(sell.low * 1e27 / buy.high) and charges ceil(sellAmount * price / 1e27).
      const [sellPrices, buyPrices, sellBefore, buyBefore, actorSellBefore, actorBuyBefore] =
        await publicClient.multicall({
          allowFailure: false,
          contracts: [
            { address: folio, abi: folioV6Abi, functionName: "getAuctionPrice", args: [0n, wrappedNative] },
            { address: folio, abi: folioV6Abi, functionName: "getAuctionPrice", args: [0n, stable] },
            { address: wrappedNative, abi: erc20Abi, functionName: "balanceOf", args: [folio] },
            { address: stable, abi: erc20Abi, functionName: "balanceOf", args: [folio] },
            { address: wrappedNative, abi: erc20Abi, functionName: "balanceOf", args: [ACTOR] },
            { address: stable, abi: erc20Abi, functionName: "balanceOf", args: [ACTOR] },
          ],
        });
      // The prices the SDK built are the ones the auction stored.
      const builtPrice = (token: Address) =>
        built.args.newPrices[built.args.tokens.findIndex((entry) => getAddress(entry) === token)];
      expect(sellPrices).toEqual(builtPrice(wrappedNative));
      expect(buyPrices).toEqual(builtPrice(stable));
      const endPrice = ceilDiv(sellPrices.low * D27, buyPrices.high);
      const sellAmount = sellBefore / 20n;
      const bidAmount = ceilDiv(sellAmount * endPrice, D27);
      expect(bidAmount).toBeGreaterThan(0n);

      await send(ACTOR, {
        chainId,
        to: stable,
        data: encodeFunctionData({ abi: erc20Abi, functionName: "approve", args: [folio, bidAmount] }),
        value: 0n,
      });
      await publicClient.request({
        method: "evm_setNextBlockTimestamp" as never,
        params: [toHex(auction.endTime)] as never,
      });
      const bidReceipt = await send(
        ACTOR,
        sdk.index.prepareBid({
          ...params,
          version: "6.0.0",
          auctionId: auction.auctionId,
          sellToken: wrappedNative,
          buyToken: stable,
          sellAmount,
          maxBuyAmount: bidAmount,
        }),
      );
      const [bidEvent] = parseEventLogs({ abi: folioV6Abi, eventName: "AuctionBid", logs: bidReceipt.logs });
      const [sellAfter, buyAfter, actorSellAfter, actorBuyAfter] = await publicClient.multicall({
        allowFailure: false,
        contracts: [
          { address: wrappedNative, abi: erc20Abi, functionName: "balanceOf", args: [folio] },
          { address: stable, abi: erc20Abi, functionName: "balanceOf", args: [folio] },
          { address: wrappedNative, abi: erc20Abi, functionName: "balanceOf", args: [ACTOR] },
          { address: stable, abi: erc20Abi, functionName: "balanceOf", args: [ACTOR] },
        ],
      });

      expect((await publicClient.getBlock({ blockNumber: bidReceipt.blockNumber })).timestamp).toBe(auction.endTime);
      expect(bidEvent?.args).toMatchObject({ auctionId: 0n, sellAmount, buyAmount: bidAmount });
      expect(sellBefore - sellAfter).toBe(sellAmount);
      expect(buyAfter - buyBefore).toBe(bidAmount);
      expect(actorSellAfter - actorSellBefore).toBe(sellAmount);
      expect(actorBuyBefore - actorBuyAfter).toBe(bidAmount);
      await annotate(
        `chain ${chainId} bid: auction 0 [${auction.startTime}, ${auction.endTime}], sold ${sellAmount} native for ${bidAmount} stable at D27 price ${endPrice}`,
      );
    },
    forkTestTimeout,
  );

  it(
    "deploys a governed Folio through the default deployer, which wires optimistic governance through OGD 1.1.0",
    async ({ annotate }) => {
      const vault = await deployOptimisticStakingVault();
      const basicDetails = getBasicDetails("Real v6 governed fork", "RV6G");
      const plan = sdk.index.prepareDeployGovernedPlan({
        chainId,
        version: "6.0.0",
        stToken: vault,
        basicDetails,
        additionalDetails: {
          maxAuctionLength: MAX_AUCTION_LENGTH,
          feeRecipients: [{ recipient: vault, portion: parseEther("0.5") }],
          immutableFeeRecipients: [{ recipient: IMMUTABLE_RECIPIENT, portion: parseEther("0.5") }],
          tvlFee: 0n,
          mintFee: 0n,
          selfFee: 0n,
          mandate: "Real v6 governed deployer fork evidence",
        },
        flags: DEFAULT_INDEX_DTF_DEPLOY_FLAGS,
        governance: {
          optimistic: OPTIMISTIC_PARAMS,
          standard: {
            votingDelay: 60,
            votingPeriod: 300,
            voteExtension: 0,
            proposalThreshold: parseEther("0.01"),
            quorumNumerator: parseEther("0.01"),
          },
          optimisticSelectors: [INDEX_DTF_START_REBALANCE_SELECTOR["6.0.0"]],
          optimisticProposers: [ACTOR],
          additionalGuardians: [EXTRA_GUARDIAN],
          timelockDelay: 2n,
          proposalThrottleCapacity: 10n,
        },
        roles: { auctionLaunchers: [ACTOR] },
        deploymentNonce: keccak256(toBytes(`fork-real-v6-governed-${chainId}`)),
        approvals: basicDetails.assets.map((token, index) => ({ token, amount: basicDetails.amounts[index]! })),
      });
      if (plan.type !== "approval-required") throw new Error("expected an approval plan");
      expect(plan.call.to).toBe(deployer);
      for (const approval of plan.approvals) await send(ACTOR, approval);
      const receipt = await send(ACTOR, plan.call);

      const governedFolio = extractIndexDtfDeployedAddress(receipt.logs, { chainId, version: "6.0.0" });
      const [governed] = parseEventLogs({
        abi: folioDeployerV6Abi,
        eventName: "GovernedFolioDeployed",
        logs: receipt.logs.filter((log) => getAddress(log.address) === deployer),
      });
      const [folioDeployed] = parseEventLogs({
        abi: folioDeployerV6Abi,
        eventName: "FolioDeployed",
        logs: receipt.logs.filter((log) => getAddress(log.address) === deployer),
      });
      const systemLogs = parseEventLogs({
        abi: optimisticGovernorDeployerAbi,
        eventName: "ReserveOptimisticGovernorSystemDeployed",
        logs: receipt.logs,
      });
      if (!governed || !folioDeployed) throw new Error("governed deploy events are missing");
      const { ownerGovernor: governor, ownerTimelock: timelock } = governed.args;

      expect(governed.args).toMatchObject({ stToken: vault, folio: governedFolio, tradingGovernor: governor });
      expect(governed.args.tradingTimelock).toBe(timelock);
      expect(systemLogs).toHaveLength(1);
      expect(getAddress(systemLogs[0]!.address)).toBe(optimisticGovernorDeployer);
      expect(systemLogs[0]!.args).toMatchObject({ stakingVault: zeroAddress, governor, timelock });
      const selectorRegistry = systemLogs[0]!.args.optimisticSelectorRegistry;

      const governance = await sdk.index.getOptimisticGovernance({ chainId, governance: governor });
      const guardian = await publicClient.readContract({
        address: optimisticGovernorDeployer,
        abi: optimisticGovernorDeployerAbi,
        functionName: "guardian",
      });
      expect(governance).toMatchObject({
        token: vault,
        timelock,
        selectorRegistry,
        proposalThrottleCapacity: 10n,
        lateQuorumVoteExtension: 0n,
        optimisticParams: OPTIMISTIC_PARAMS,
        optimisticProposers: [ACTOR],
      });
      // `guardians` lists every timelock CANCELLER_ROLE member, like the subgraph: that includes the governor.
      expect([...governance.guardians].sort()).toEqual([getAddress(guardian), EXTRA_GUARDIAN, governor].sort());
      expect(await sdk.index.getOptimisticSelectors({ chainId, registry: selectorRegistry })).toEqual([
        { target: governedFolio, selector: INDEX_DTF_START_REBALANCE_SELECTOR["6.0.0"] },
      ]);
      expect(await sdk.index.getVersion({ address: governedFolio, chainId })).toBe("6.0.0");
      expect(await getImplementation(governedFolio)).toBe(folioImplementation);
      expect(await readRoleMembers(governedFolio, DEFAULT_ADMIN_ROLE)).toEqual([timelock]);
      expect(await readRoleMembers(governedFolio, REBALANCE_MANAGER)).toEqual([timelock]);
      expect(await readRoleMembers(governedFolio, AUCTION_LAUNCHER)).toEqual([ACTOR]);
      expect(
        await publicClient.readContract({
          address: folioDeployed.args.folioAdmin,
          abi: accessControlAbi,
          functionName: "owner",
        }),
      ).toBe(timelock);
      expect(await hasRoles(timelock, PROPOSER_ROLE, [governor])).toEqual([true]);
      expect(await hasRoles(timelock, EXECUTOR_ROLE, [governor])).toEqual([true]);
      expect(await hasRoles(timelock, CANCELLER_ROLE, [governor, getAddress(guardian), EXTRA_GUARDIAN])).toEqual([
        true,
        true,
        true,
      ]);
      expect(await hasRoles(timelock, DEFAULT_ADMIN_ROLE, [optimisticGovernorDeployer, deployer])).toEqual([
        false,
        false,
      ]);
      await annotate(
        `chain ${chainId} governed folio ${governedFolio}: governor ${governor}, timelock ${timelock}, selector registry ${selectorRegistry}, vault ${vault}`,
      );
    },
    forkTestTimeout,
  );

  it(
    "registers the real deployer on the fork and reads 6.0.0 back through the SDK version registry reads",
    async ({ annotate }) => {
      const registry = INDEX_DTF_VERSION_REGISTRY_ADDRESS[chainId];
      // Once production registers 6.0.0 this only checks that the registered deployer is the pinned one.
      const registered = await sdk.index.getVersionDeployment({ chainId, version: "6.0.0" });
      if (!registered) {
        expect(await sdk.index.getLatestVersion({ chainId })).toMatchObject({
          version: "5.0.0",
          deployer: INDEX_DTF_DEPLOYER_ADDRESS[chainId],
        });
        const roleRegistry = await publicClient.readContract({
          address: registry,
          abi: folioVersionRegistryAbi,
          functionName: "roleRegistry",
        });
        const owner = await findRoleRegistryOwner(roleRegistry);
        await impersonate(owner);
        await send(owner, {
          chainId,
          to: registry,
          data: encodeFunctionData({ abi: folioVersionRegistryAbi, functionName: "registerVersion", args: [deployer] }),
          value: 0n,
        });
        await annotate(
          `chain ${chainId} registry ${registry}: registered as role registry ${roleRegistry} owner ${owner}`,
        );
      }

      expect(await sdk.index.getLatestVersion({ chainId })).toEqual({
        versionHash: getIndexDtfVersionHash("6.0.0"),
        version: "6.0.0",
        deployer,
        deprecated: false,
      });
      expect(await sdk.index.getVersionDeployment({ chainId, version: "6.0.0" })).toEqual({
        version: "6.0.0",
        versionHash: getIndexDtfVersionHash("6.0.0"),
        deployer,
        implementation: folioImplementation,
        deprecated: false,
      });
      expect((await sdk.index.getVersionDeployment({ chainId, version: "5.0.0" }))?.deployer).toBe(
        INDEX_DTF_DEPLOYER_ADDRESS[chainId],
      );
    },
    forkTestTimeout,
  );

  function getBasicDetails(name: string, symbol: string) {
    // 0.2 native and its value in the stable at the fixture price: a 50/50 basket the rebalance moves to 20/80.
    const nativeAmount = parseEther("0.2");
    const stableAmount = parseUnits(String(fork.nativePrice), stableDecimals) / 5n;

    return {
      name,
      symbol,
      assets: [wrappedNative, stable],
      amounts: [nativeAmount, stableAmount],
      initialShares: parseEther("1"),
    };
  }

  async function deployOptimisticStakingVault(): Promise<Address> {
    const receipt = await send(ACTOR, {
      chainId,
      to: optimisticGovernorDeployer,
      data: encodeFunctionData({
        abi: optimisticGovernorDeployerAbi,
        functionName: "deployWithNewStakingVault",
        args: [
          {
            optimisticParams: { vetoDelay: 60, vetoPeriod: 300, vetoThreshold: parseEther("0.05") },
            standardParams: {
              votingDelay: 60,
              votingPeriod: 300,
              voteExtension: 0,
              proposalThreshold: parseEther("0.01"),
              quorumNumerator: parseEther("0.01"),
            },
            selectorData: [],
            optimisticProposers: [],
            additionalGuardians: [],
            timelockDelay: 2n,
            proposalThrottleCapacity: 10n,
          },
          { underlying: wrappedNative, rewardTokens: [], rewardHalfLife: 604_800n, unstakingDelay: 604_800n },
          keccak256(toBytes(`fork-real-v6-vault-${chainId}`)),
        ],
      }),
      value: 0n,
    });
    const [system] = parseEventLogs({
      abi: optimisticGovernorDeployerAbi,
      eventName: "ReserveOptimisticGovernorSystemDeployed",
      logs: receipt.logs,
    });
    if (!system) throw new Error("vote-lock vault deployment emitted no system event");

    return getAddress(system.args.stakingVault);
  }

  async function findRoleRegistryOwner(roleRegistry: Address): Promise<Address> {
    for (const member of await readRoleMembers(roleRegistry, DEFAULT_ADMIN_ROLE)) {
      const isOwner = await publicClient.readContract({
        address: roleRegistry,
        abi: accessControlAbi,
        functionName: "isOwner",
        args: [member],
      });
      if (isOwner) return member;
    }
    throw new Error(`no role registry owner found on chain ${chainId}`);
  }

  async function readMutableFeeRecipients(address: Address) {
    const recipients: { recipient: Address; portion: bigint }[] = [];
    for (let index = 0n; ; index++) {
      try {
        const [recipient, portion] = await publicClient.readContract({
          address,
          abi: folioV6Abi,
          functionName: "feeRecipients",
          args: [index],
        });
        recipients.push({ recipient: getAddress(recipient), portion });
      } catch {
        return recipients;
      }
    }
  }

  async function readRoleMembers(address: Address, role: Hex): Promise<readonly Address[]> {
    const count = await publicClient.readContract({
      address,
      abi: accessControlAbi,
      functionName: "getRoleMemberCount",
      args: [role],
    });
    const members: Address[] = [];
    for (let index = 0n; index < count; index++) {
      members.push(
        getAddress(
          await publicClient.readContract({
            address,
            abi: accessControlAbi,
            functionName: "getRoleMember",
            args: [role, index],
          }),
        ),
      );
    }
    return members;
  }

  async function hasRoles(address: Address, role: Hex, accounts: readonly Address[]): Promise<readonly boolean[]> {
    return publicClient.multicall({
      allowFailure: false,
      contracts: accounts.map((account) => ({
        address,
        abi: accessControlAbi,
        functionName: "hasRole" as const,
        args: [role, account] as const,
      })),
    });
  }

  async function getImplementation(proxy: Address): Promise<Address> {
    const slot = await publicClient.getStorageAt({ address: proxy, slot: ERC1967_IMPLEMENTATION_SLOT });
    if (!slot) throw new Error(`${proxy} has no ERC-1967 implementation`);

    return getAddress(`0x${slot.slice(-40)}`);
  }

  /** Finds the `balanceOf` mapping slot by probing, like forge's `deal`, and writes the balance there. */
  async function dealErc20(token: Address, account: Address, amount: bigint) {
    for (let slot = 0n; slot < 64n; slot++) {
      const key = keccak256(encodeAbiParameters([{ type: "address" }, { type: "uint256" }], [account, slot]));
      const previous = (await publicClient.getStorageAt({ address: token, slot: key })) ?? zeroHash;
      await publicClient.request({
        method: "anvil_setStorageAt" as never,
        params: [token, key, toHex(amount, { size: 32 })] as never,
      });
      const balance = await publicClient.readContract({
        address: token,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [account],
      });
      if (balance === amount) return;
      await publicClient.request({ method: "anvil_setStorageAt" as never, params: [token, key, previous] as never });
    }
    throw new Error(`no balanceOf slot found for ${token} on chain ${chainId}`);
  }

  async function impersonate(account: Address) {
    impersonated.add(account);
    await publicClient.request({ method: "anvil_impersonateAccount" as never, params: [account] as never });
    await publicClient.request({
      method: "anvil_setBalance" as never,
      params: [account, toHex(parseEther("1000"))] as never,
    });
  }

  async function send(
    from: Address,
    call: Pick<IndexDtfCall, "chainId" | "to" | "data" | "value">,
  ): Promise<TransactionReceipt> {
    // Anvil estimates gas at one timestamp and can mine a second later. Folio's `sync` always writes
    // `lastFolioFeePoke = block.timestamp`: a no-op SSTORE in the estimate, a real one when mined, so a tight
    // estimate starves the delegatecall into RebalancingLib and reverts with empty data (startRebalance reverts
    // under a 590k limit while its success uses 587k). A fixed ceiling removes that flake.
    const hash = await wallet.sendTransaction({
      account: from,
      chain,
      to: call.to,
      data: call.data,
      value: call.value,
      gas: FORK_TRANSACTION_GAS,
    });
    const receipt = await publicClient.waitForTransactionReceipt({ hash, pollingInterval: 250 });
    if (receipt.status !== "success") {
      // The whole run is reverted in afterAll, so keep the revert data now: it is the only diagnosis left.
      const trace = (await publicClient.request({
        method: "debug_traceTransaction" as never,
        params: [hash, { tracer: "callTracer" }] as never,
      })) as { readonly output?: Hex; readonly error?: string };
      throw new Error(
        `transaction reverted on chain ${chainId}: ${hash} (${trace.error ?? "revert"} ${trace.output ?? "0x"})`,
      );
    }

    return receipt;
  }
});

function ceilDiv(numerator: bigint, denominator: bigint): bigint {
  return (numerator + denominator - 1n) / denominator;
}
