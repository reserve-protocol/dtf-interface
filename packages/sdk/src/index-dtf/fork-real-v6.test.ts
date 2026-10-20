import {
  BaseError,
  createPublicClient,
  createWalletClient,
  decodeErrorResult,
  encodeAbiParameters,
  encodeFunctionData,
  erc20Abi,
  getAddress,
  http,
  keccak256,
  maxUint256,
  parseAbi,
  parseEther,
  parseEventLogs,
  parseUnits,
  toBytes,
  toFunctionSelector,
  toFunctionSignature,
  toHex,
  zeroAddress,
  zeroHash,
  type Abi,
  type AbiFunction,
  type AbiParameter,
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
import { readExplorerAbiFixture } from "@/index-dtf/abis/explorer-fixture";
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

type PriceRange = { readonly low: bigint; readonly high: bigint };
type TokenBalances = { readonly native: bigint; readonly stable: bigint };
type BidCheck = {
  readonly label: string;
  readonly timestamp: bigint;
  readonly sellAmount: bigint;
  readonly bidAmount: bigint;
  readonly price: bigint;
  readonly remainingSellAvailable: bigint;
};

/**
 * Real-address Folio 6.0 evidence: the SDK's default v6 deployer and the deployed 6.0.0 bytecode on disposable,
 * unindexed Anvil forks of mainnet, Base and BSC, through a complete rebalance (launcher and community auctions,
 * closeAuction, endRebalance by nonce) with independently recomputed prices and sizes. Every write is impersonated
 * and the whole chain run sits inside one `evm_snapshot`/`evm_revert`, so a fork can be reused. Start the forks first
 * (see the SDK README).
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
// Holds no Folio role: proves openAuctionUnrestricted is permissionless after restrictedUntil.
const COMMUNITY = getAddress("0x00000000000000000000000000000000000c0de0");
const EXTRA_GUARDIAN = getAddress("0x00000000000000000000000000000000000b0b00");
const IMMUTABLE_RECIPIENT = getAddress("0x000000000000000000000000000000000000bEEF");
const MAX_AUCTION_LENGTH = 1800n;
const AUCTION_LAUNCHER_WINDOW = 3600n;
const REBALANCE_TTL = 7200n;
const TARGET_NATIVE_SHARE_PERCENT = 20;
// Folio constants (contracts/utils/Constants.sol) the independent arithmetic needs.
const AUCTION_WARMUP = 30n;
const MAX_TOKEN_BUY_AMOUNT = 10n ** 36n;
// Mid-auction prices come from PRBMath ln/exp; the closed-form curve agrees to well within 1e-9.
const PRICE_TOLERANCE = 1e-9;
const PRICE_TOLERANCE_PARTS = 1_000_000_000n;
const FOLIO_6_0_0 = readExplorerAbiFixture("folio-6.0.0.base.json");
const FOLIO_DEPLOYER_6_0_0 = readExplorerAbiFixture("folio-deployer-6.0.0.base.json");
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
  let rebalanceNonce: bigint;
  let initialBalances: TokenBalances;
  const tradedByAuction = new Map<bigint, { sold: bigint; bought: bigint }>();
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
    await impersonate(COMMUNITY);
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
      // The implementation is the explorer-verified 6.0.0 the SDK ABIs are checked against, byte for byte.
      const runtimeCode = await publicClient.getCode({ address: folioImplementation });
      expect(runtimeCode && keccak256(runtimeCode)).toBe(FOLIO_6_0_0.runtimeCodeKeccak256);
      if (chainId === FOLIO_6_0_0.chainId) {
        expect(folioImplementation).toBe(FOLIO_6_0_0.address);
        // The deployer's runtime code carries chain-specific immutables, so its verified hash only pins Base.
        const deployerCode = await publicClient.getCode({ address: deployer });
        expect(deployer).toBe(FOLIO_DEPLOYER_6_0_0.address);
        expect(deployerCode && keccak256(deployerCode)).toBe(FOLIO_DEPLOYER_6_0_0.runtimeCodeKeccak256);
      }

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
    "dispatches every function in the SDK v6 Folio ABI on the deployed implementation",
    async ({ annotate }) => {
      // Probed through the deployed proxy, whose ERC-1967 slot is the chain's folioImplementation(): an initialized
      // Folio answers the fee-registry and token reads an uninitialized implementation reverts on without data.
      expect(await getImplementation(folio)).toBe(folioImplementation);
      // Control: an unknown selector falls through Folio's dispatcher and reverts with empty data, and so does the
      // pre-audit `endRebalance()` the SDK used to encode.
      expect(await probeCall(folio, "0xdeadbeef")).toEqual({ reverted: true, data: "0x" });
      expect(await probeCall(folio, toFunctionSelector("endRebalance()"))).toEqual({ reverted: true, data: "0x" });

      const functions = (folioV6Abi as Abi).filter((item): item is AbiFunction => item.type === "function");
      const results = await Promise.all(
        functions.map(async (item) => {
          const data = encodeFunctionData({
            abi: [item],
            functionName: item.name,
            args: item.inputs.map((input) => probeArgument(input, wrappedNative)),
          });
          return { signature: toFunctionSignature(item), result: await probeCall(folio, data) };
        }),
      );
      const undispatched = results.filter(({ result }) => result.reverted && result.data === "0x");
      // Every revert carries an error the Folio ABI (or Error/Panic) decodes: the call ran past the dispatcher.
      const errors = results.flatMap(({ signature, result }) =>
        result.reverted && result.data !== "0x"
          ? [
              `${signature.slice(0, signature.indexOf("("))}: ${decodeErrorResult({ abi: folioV6Abi, data: result.data }).errorName}`,
            ]
          : [],
      );

      expect(undispatched.map(({ signature }) => signature)).toEqual([]);
      await annotate(
        `chain ${chainId}: all ${functions.length} SDK v6 Folio functions dispatch on ${folioImplementation}; ${functions.length - errors.length} returned, ${errors.length} reverted with decoded errors (${errors.join(", ")})`,
      );
    },
    forkTestTimeout,
  );

  it(
    "starts a rebalance with the SDK basket builder at the expected nonce",
    async ({ annotate }) => {
      const params = { address: folio, chainId } as const;
      const latest = await publicClient.getBlock();
      initialBalances = await readFolioBalances();
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
            { address: wrappedNative, share: TARGET_NATIVE_SHARE_PERCENT },
            { address: stable, share: 100 - TARGET_NATIVE_SHARE_PERCENT },
          ],
        },
        auctionLauncherWindow: Number(AUCTION_LAUNCHER_WINDOW),
        ttl: Number(REBALANCE_TTL),
        deadline: latest.timestamp + 3600n,
      });
      expect(basketProposal.targets).toEqual([folio]);
      expect(basketProposal.context.rebalanceNonce).toBe(1n);
      const receipt = await send(
        ACTOR,
        { chainId, to: folio, data: basketProposal.calldatas[0]!, value: 0n },
        { syncedFolioCall: true },
      );
      const [started] = parseEventLogs({ abi: folioV6Abi, eventName: "RebalanceStarted", logs: receipt.logs });
      rebalanceNonce = await sdk.index.getRebalanceNonce(params);

      expect(rebalanceNonce).toBe(1n);
      expect(started?.args.nonce).toBe(1n);
      const { timestamps } = await readRebalance();
      expect(timestamps.restrictedUntil - timestamps.startedAt).toBe(AUCTION_LAUNCHER_WINDOW);
      expect(timestamps.availableUntil - timestamps.startedAt).toBe(REBALANCE_TTL);
      // Direction from the on-chain rebalance: at spot, the targets hold less native and more stable than the
      // Folio does. {tok} = D18{BU/share} * D27{tok/BU} * {share} / (1e18 * 1e27).
      const current = await sdk.index.getCurrentRebalance(params);
      const spotTarget = (token: Address) => {
        const details = current.rebalance.tokens.find((entry) => getAddress(entry.token) === token);
        if (!details) throw new Error(`${token} is not in the rebalance`);
        return (current.rebalance.limits.spot * details.weight.spot * current.totalSupply) / (D18 * D27);
      };
      // Independently: 20% of the basket's value at the fixture prices in native, 80% in the stable.
      const stableUnit = 10n ** BigInt(stableDecimals);
      const nativePrice = BigInt(fork.nativePrice);
      const valueInStable = (initialBalances.native * nativePrice * stableUnit) / D18 + initialBalances.stable;
      const targetShare = BigInt(TARGET_NATIVE_SHARE_PERCENT);
      expect(spotTarget(wrappedNative)).toBe((valueInStable * targetShare * D18) / (100n * nativePrice * stableUnit));
      expect(spotTarget(stable)).toBe((valueInStable * (100n - targetShare)) / 100n);
      expect(spotTarget(wrappedNative)).toBeLessThan(initialBalances.native);
      expect(spotTarget(stable)).toBeGreaterThan(initialBalances.stable);
      await annotate(
        `chain ${chainId} rebalance 1 from ${initialBalances.native} native / ${initialBalances.stable} stable; spot targets ${spotTarget(wrappedNative)} / ${spotTarget(stable)}`,
      );
    },
    forkTestTimeout,
  );

  it(
    "launcher auction: bids at start, mid and end settle at independently computed prices and limits",
    async ({ annotate }) => {
      const params = { address: folio, chainId } as const;
      const current = await sdk.index.getCurrentRebalance(params);
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
      expect(built.args.rebalanceNonce).toBe(rebalanceNonce);
      // The actor is the only bidder; the balance deltas below check each payment exactly.
      await send(ACTOR, {
        chainId,
        to: stable,
        data: encodeFunctionData({ abi: erc20Abi, functionName: "approve", args: [folio, maxUint256] }),
        value: 0n,
      });
      await send(ACTOR, sdk.index.prepareOpenAuction({ ...params, version: "6.0.0", args: built.args }), {
        syncedFolioCall: true,
      });

      const auction = await sdk.index.getLatestAuction(params);
      if (!auction) throw new Error("openAuction left no auction");
      expect(auction).toMatchObject({ auctionId: 0n, rebalanceNonce, currentRebalanceNonce: rebalanceNonce });
      expect(auction.endTime - auction.startTime).toBe(auctionLength);
      // The prices the SDK built are the ones the auction stored.
      const builtPrice = (token: Address) =>
        built.args.newPrices[built.args.tokens.findIndex((entry) => getAddress(entry) === token)];
      expect(await readAuctionPrice(0n, wrappedNative)).toEqual(builtPrice(wrappedNative));
      expect(await readAuctionPrice(0n, stable)).toEqual(builtPrice(stable));
      expectPricesBracketFairPrice(builtPrice(wrappedNative)!, builtPrice(stable)!);

      const midpoint = auction.startTime + auctionLength / 2n;
      const bids = [
        await bidAndCheck({ auctionId: 0n, timestamp: auction.startTime, take: [1n, 4n], label: "start" }),
        await bidAndCheck({ auctionId: 0n, timestamp: midpoint, take: [1n, 3n], label: "mid" }),
        await bidAndCheck({ auctionId: 0n, timestamp: auction.endTime, take: [1n, 2n], label: "end" }),
      ];
      // The Dutch auction descends: the bidder pays less buy token per sell token as time passes.
      expect(bids[0]!.price).toBeGreaterThan(bids[1]!.price);
      expect(bids[1]!.price).toBeGreaterThan(bids[2]!.price);

      // closeAuction after endTime is a no-op by design (no revert, so it cannot be griefed): no event, same window.
      await setNextBlockTimestamp(auction.endTime + 1n);
      const closeReceipt = await send(
        ACTOR,
        sdk.index.prepareCloseAuction({ ...params, version: "6.0.0", auctionId: 0n }),
      );
      expect(parseEventLogs({ abi: folioV6Abi, eventName: "AuctionClosed", logs: closeReceipt.logs })).toEqual([]);
      expect(await readAuctionWindow(0n)).toEqual({ startTime: auction.startTime, endTime: auction.endTime });
      await annotate(
        `chain ${chainId} launcher auction 0 [${auction.startTime}, ${auction.endTime}]: ${bids.map(describeBid).join("; ")}`,
      );
    },
    forkTestTimeout,
  );

  it(
    "community auction: openAuctionUnrestricted only after restrictedUntil, closed mid-auction by the launcher",
    async ({ annotate }) => {
      const params = { address: folio, chainId } as const;
      const openUnrestricted = sdk.index.prepareOpenAuctionUnrestricted({
        ...params,
        version: "6.0.0",
        rebalanceNonce,
      });
      const { timestamps, limits, tokens } = await readRebalance();
      expect((await publicClient.getBlock()).timestamp).toBeLessThan(timestamps.restrictedUntil);
      await expectFolioRevert(COMMUNITY, openUnrestricted, "Folio__AuctionCannotBeOpenedWithoutRestriction");

      // Anyone may open it from restrictedUntil on: the community member holds no Folio role.
      expect(await hasRoles(folio, AUCTION_LAUNCHER, [COMMUNITY])).toEqual([false]);
      await setNextBlockTimestamp(timestamps.restrictedUntil);
      const openReceipt = await send(COMMUNITY, openUnrestricted, { syncedFolioCall: true });
      const [opened] = parseEventLogs({ abi: folioV6Abi, eventName: "AuctionOpened", logs: openReceipt.logs });
      expect(opened?.args).toMatchObject({ rebalanceNonce, auctionId: 1n });

      // Unrestricted auctions run on the rebalance's spot limits and weights and its initial prices.
      const window = await readAuctionWindow(1n);
      const maxAuctionLength = await sdk.index.getMaxAuctionLength(params);
      expect(window).toEqual({
        startTime: timestamps.restrictedUntil + AUCTION_WARMUP,
        endTime: timestamps.restrictedUntil + AUCTION_WARMUP + maxAuctionLength,
      });
      const afterOpen = await readRebalance();
      expect(afterOpen.limits).toEqual({ low: limits.spot, spot: limits.spot, high: limits.spot });
      for (const token of [wrappedNative, stable]) {
        const before = tokens.find((entry) => getAddress(entry.token) === token)!;
        const after = afterOpen.tokens.find((entry) => getAddress(entry.token) === token)!;
        expect(after.weight).toEqual({ low: before.weight.spot, spot: before.weight.spot, high: before.weight.spot });
        expect(await readAuctionPrice(1n, token)).toEqual(before.price);
      }
      expectPricesBracketFairPrice(await readAuctionPrice(1n, wrappedNative), await readAuctionPrice(1n, stable));

      // One bid for everything available at the exact start price takes the basket to the spot target on the
      // binding side; the auction stays open (a zero-size quote still prices it) until the launcher closes it.
      const bid = await bidAndCheck({
        auctionId: 1n,
        timestamp: window.startTime,
        take: [1n, 1n],
        label: "start, all available",
      });
      expect(bid.remainingSellAvailable).toBe(0n);
      const midpoint = window.startTime + maxAuctionLength / 2n;
      await setNextBlockTimestamp(midpoint - 1n);
      await publicClient.request({ method: "evm_mine" as never, params: [] as never });
      expect((await readBid(1n, 0n, await publicClient.getBlockNumber({ cacheTime: 0 })))[0]).toBe(0n);

      await setNextBlockTimestamp(midpoint);
      const closeReceipt = await send(
        ACTOR,
        sdk.index.prepareCloseAuction({ ...params, version: "6.0.0", auctionId: 1n }),
      );
      const [closed] = parseEventLogs({ abi: folioV6Abi, eventName: "AuctionClosed", logs: closeReceipt.logs });
      const closedAt = (await publicClient.getBlock({ blockNumber: closeReceipt.blockNumber })).timestamp;
      expect(closed?.args.auctionId).toBe(1n);
      expect(closedAt).toBe(midpoint);
      expect(await readAuctionWindow(1n)).toEqual({ startTime: window.startTime, endTime: closedAt - 1n });
      // A zero-size quote prices any open auction; after the close the pair is no longer on sale at all.
      await expectFolioRevert(
        COMMUNITY,
        {
          to: folio,
          data: encodeFunctionData({
            abi: folioV6Abi,
            functionName: "getBid",
            args: [1n, wrappedNative, stable, 0n],
          }),
        },
        "Folio__AuctionNotOngoing",
      );
      await annotate(
        `chain ${chainId} community auction 1 [${window.startTime}, ${window.endTime}] opened by ${COMMUNITY} at restrictedUntil ${timestamps.restrictedUntil}: ${describeBid(bid)}; closed at ${closedAt}`,
      );
    },
    forkTestTimeout,
  );

  it(
    "ends the rebalance by nonce, rejects a stale nonce, and leaves the basket moved toward the target within limits",
    async ({ annotate }) => {
      const params = { address: folio, chainId } as const;
      await expectFolioRevert(
        ACTOR,
        sdk.index.prepareEndRebalance({ ...params, version: "6.0.0", rebalanceNonce: rebalanceNonce + 1n }),
        "Folio__InvalidRebalanceNonce",
      );
      await expectFolioRevert(
        ACTOR,
        sdk.index.prepareEndRebalance({ ...params, version: "6.0.0", rebalanceNonce: rebalanceNonce - 1n }),
        "Folio__InvalidRebalanceNonce",
      );
      // Only the admin, rebalance manager or auction launcher may end it.
      await expectFolioRevert(
        COMMUNITY,
        sdk.index.prepareEndRebalance({ ...params, version: "6.0.0", rebalanceNonce }),
        "Folio__Unauthorized",
      );

      const receipt = await send(ACTOR, sdk.index.prepareEndRebalance({ ...params, version: "6.0.0", rebalanceNonce }));
      const [ended] = parseEventLogs({ abi: folioV6Abi, eventName: "RebalanceEnded", logs: receipt.logs });
      const endedAt = (await publicClient.getBlock({ blockNumber: receipt.blockNumber })).timestamp;
      const final = await readRebalance();
      expect(ended?.args.nonce).toBe(rebalanceNonce);
      expect(final.nonce).toBe(rebalanceNonce);
      expect(final.timestamps.availableUntil).toBe(endedAt);
      await expectFolioRevert(
        COMMUNITY,
        sdk.index.prepareOpenAuctionUnrestricted({ ...params, version: "6.0.0", rebalanceNonce }),
        "Folio__NotRebalancing",
      );

      // Within limits: never sold below the sell limit nor bought past the buy limit of the spot target.
      const supply = await readTotalSupply();
      const balances = await readFolioBalances();
      const nativeDetails = final.tokens.find((entry) => getAddress(entry.token) === wrappedNative)!;
      const stableDetails = final.tokens.find((entry) => getAddress(entry.token) === stable)!;
      const nativeFloor = ceilDiv(ceilDiv(final.limits.high * nativeDetails.weight.high, D18) * supply, D27);
      const stableCeiling = (((final.limits.low * stableDetails.weight.low) / D18) * supply) / D27;
      expect(balances.native).toBeGreaterThanOrEqual(nativeFloor);
      expect(balances.stable).toBeLessThanOrEqual(stableCeiling);
      // And moved from 50% native by value to within two points of the 20% target (the spot amounts are pinned
      // exactly at startRebalance). Bidders pay above or below the fixture price, so the first side to bind leaves the
      // other a little off its own spot amount.
      const initialShare = nativeValueShare(initialBalances);
      const finalShare = nativeValueShare(balances);
      expect(initialShare).toBeCloseTo(0.5, 6);
      expect(Math.abs(finalShare - TARGET_NATIVE_SHARE_PERCENT / 100)).toBeLessThan(0.02);
      await annotate(
        `chain ${chainId} rebalance ${rebalanceNonce} ended at ${endedAt}: native ${initialBalances.native} -> ${balances.native} (floor ${nativeFloor}), stable ${initialBalances.stable} -> ${balances.stable} (ceiling ${stableCeiling}); native value share ${initialShare.toFixed(4)} -> ${finalShare.toFixed(4)} (target ${TARGET_NATIVE_SHARE_PERCENT / 100})`,
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

  /**
   * One bid with every number derived independently from contract reads: the price from the stored auction prices
   * and window (exact at start and end, the exponential curve within PRICE_TOLERANCE in between), the size from the
   * rebalance limits, weights, supply and balances exactly as Folio's getBid caps it. The pre-bid state is read one
   * second earlier in the same fee day, so the supply is the one the bid sees.
   */
  async function bidAndCheck(input: {
    readonly auctionId: bigint;
    readonly timestamp: bigint;
    readonly take: readonly [bigint, bigint];
    readonly label: string;
  }): Promise<BidCheck> {
    const { auctionId, timestamp, label } = input;
    const window = await readAuctionWindow(auctionId);
    const sellPrices = await readAuctionPrice(auctionId, wrappedNative);
    const buyPrices = await readAuctionPrice(auctionId, stable);
    const expected = expectedAuctionPrice(sellPrices, buyPrices, window, timestamp);

    if ((await publicClient.getBlock()).timestamp < timestamp - 1n) {
      await setNextBlockTimestamp(timestamp - 1n);
      await publicClient.request({ method: "evm_mine" as never, params: [] as never });
    }
    const supply = await readTotalSupply();
    const rebalance = await readRebalance();
    const before = await readFolioBalances();
    const actorBefore = await readActorBalances();
    const traded = tradedByAuction.get(auctionId) ?? { sold: 0n, bought: 0n };
    const available = expectedSellAvailable({ balances: before, supply, rebalance, price: expected.price, traded });
    const sellAmount = (available * input.take[0]) / input.take[1];
    expect(sellAmount, `${label}: nothing left to sell`).toBeGreaterThan(0n);
    const maxBuyAmount = expected.exact
      ? ceilDiv(sellAmount * expected.price, D27)
      : ceilDiv(sellAmount * expected.price * (PRICE_TOLERANCE_PARTS + 1n), D27 * PRICE_TOLERANCE_PARTS);

    await setNextBlockTimestamp(timestamp);
    const receipt = await send(
      ACTOR,
      sdk.index.prepareBid({
        address: folio,
        chainId,
        version: "6.0.0",
        auctionId,
        sellToken: wrappedNative,
        buyToken: stable,
        sellAmount,
        maxBuyAmount,
      }),
      { syncedFolioCall: true },
    );
    const blockNumber = receipt.blockNumber;
    const [event] = parseEventLogs({ abi: folioV6Abi, eventName: "AuctionBid", logs: receipt.logs });
    if (!event) throw new Error(`${label}: no AuctionBid event`);
    const [, , price] = await readBid(auctionId, 0n, blockNumber);
    const [remainingSellAvailable] = await readBid(auctionId, maxUint256, blockNumber);
    const after = await readFolioBalances(blockNumber);
    const actorAfter = await readActorBalances(blockNumber);
    const sold = event.args.sellAmount;
    const bought = event.args.buyAmount;

    expect((await publicClient.getBlock({ blockNumber })).timestamp).toBe(timestamp);
    expect(await readTotalSupply(blockNumber), `${label}: the fee day changed between the read and the bid`).toBe(
      supply,
    );
    if (expected.exact) {
      expect(price).toBe(expected.price);
      expect(bought).toBe(maxBuyAmount);
    } else {
      expect(Math.abs(Number(price) / expected.ideal - 1)).toBeLessThan(PRICE_TOLERANCE);
      expect(bought).toBeLessThanOrEqual(maxBuyAmount);
    }
    expect(event.args).toMatchObject({ auctionId, sellToken: wrappedNative, buyToken: stable });
    expect(sold).toBe(sellAmount);
    expect(bought).toBe(ceilDiv(sold * price, D27));
    expect(before.native - after.native).toBe(sold);
    expect(after.stable - before.stable).toBe(bought);
    expect(actorAfter.native - actorBefore.native).toBe(sold);
    expect(actorBefore.stable - actorAfter.stable).toBe(bought);

    const tradedAfter = { sold: traded.sold + sold, bought: traded.bought + bought };
    tradedByAuction.set(auctionId, tradedAfter);
    expect(remainingSellAvailable).toBe(
      expectedSellAvailable({ balances: after, supply, rebalance, price, traded: tradedAfter }),
    );

    return {
      label,
      timestamp,
      sellAmount: sold,
      bidAmount: bought,
      price,
      remainingSellAvailable,
    };
  }

  /** Folio's getBid cap (RebalancingLib.getBid) for selling the native token for the stable one. */
  function expectedSellAvailable(input: {
    readonly balances: TokenBalances;
    readonly supply: bigint;
    readonly rebalance: Awaited<ReturnType<typeof readRebalance>>;
    readonly price: bigint;
    readonly traded: { readonly sold: bigint; readonly bought: bigint };
  }): bigint {
    const { limits, tokens } = input.rebalance;
    const sell = tokens.find((entry) => getAddress(entry.token) === wrappedNative)!;
    const buy = tokens.find((entry) => getAddress(entry.token) === stable)!;
    // Buy up to the low limit and low weight, within the auction's max size.
    const buyLimitBalance = (((limits.low * buy.weight.low) / D18) * input.supply) / D27;
    let buyAvailable = input.balances.stable < buyLimitBalance ? buyLimitBalance - input.balances.stable : 0n;
    buyAvailable = minBigInt(
      buyAvailable,
      buy.maxAuctionSize > input.traded.bought ? buy.maxAuctionSize - input.traded.bought : 0n,
      MAX_TOKEN_BUY_AMOUNT,
    );
    // Sell down to the high limit and high weight, no more than the buy side can absorb at the price.
    const sellLimitBalance = ceilDiv(ceilDiv(limits.high * sell.weight.high, D18) * input.supply, D27);
    const sellAvailable = input.balances.native > sellLimitBalance ? input.balances.native - sellLimitBalance : 0n;

    return minBigInt(
      sellAvailable,
      (buyAvailable * D27) / input.price,
      sell.maxAuctionSize > input.traded.sold ? sell.maxAuctionSize - input.traded.sold : 0n,
    );
  }

  async function readRebalance(blockNumber?: bigint) {
    const [nonce, , tokens, limits, timestamps] = await publicClient.readContract({
      address: folio,
      abi: folioV6Abi,
      functionName: "getRebalance",
      blockNumber,
    });

    return { nonce, tokens, limits, timestamps };
  }

  async function readAuctionWindow(auctionId: bigint) {
    const [, startTime, endTime] = await publicClient.readContract({
      address: folio,
      abi: folioV6Abi,
      functionName: "auctions",
      args: [auctionId],
    });

    return { startTime, endTime };
  }

  async function readAuctionPrice(auctionId: bigint, token: Address): Promise<PriceRange> {
    const { low, high } = await publicClient.readContract({
      address: folio,
      abi: folioV6Abi,
      functionName: "getAuctionPrice",
      args: [auctionId, token],
    });

    return { low, high };
  }

  async function readBid(auctionId: bigint, maxSellAmount: bigint, blockNumber: bigint) {
    return publicClient.readContract({
      address: folio,
      abi: folioV6Abi,
      functionName: "getBid",
      args: [auctionId, wrappedNative, stable, maxSellAmount],
      blockNumber,
    });
  }

  async function readTotalSupply(blockNumber?: bigint): Promise<bigint> {
    return publicClient.readContract({ address: folio, abi: folioV6Abi, functionName: "totalSupply", blockNumber });
  }

  async function readFolioBalances(blockNumber?: bigint): Promise<TokenBalances> {
    return readBalances(folio, blockNumber);
  }

  async function readActorBalances(blockNumber?: bigint): Promise<TokenBalances> {
    return readBalances(ACTOR, blockNumber);
  }

  async function readBalances(account: Address, blockNumber?: bigint): Promise<TokenBalances> {
    const [native, stableBalance] = await publicClient.multicall({
      allowFailure: false,
      blockNumber,
      contracts: [
        { address: wrappedNative, abi: erc20Abi, functionName: "balanceOf", args: [account] },
        { address: stable, abi: erc20Abi, functionName: "balanceOf", args: [account] },
      ],
    });

    return { native, stable: stableBalance };
  }

  /** The fixture's fair price lies strictly inside the auction curve: above the end price, below the start price. */
  function expectPricesBracketFairPrice(sell: PriceRange, buy: PriceRange) {
    // D27{stable/native} = {USD/native} * 10^stableDecimals * 1e27 / 1e18
    const fairPrice = (BigInt(fork.nativePrice) * 10n ** BigInt(stableDecimals) * D27) / D18;

    expect(ceilDiv(sell.high * D27, buy.low)).toBeGreaterThan(fairPrice);
    expect(ceilDiv(sell.low * D27, buy.high)).toBeLessThan(fairPrice);
  }

  function nativeValueShare(balances: TokenBalances): number {
    const nativeValue = (Number(balances.native) / 1e18) * fork.nativePrice;
    const stableValue = Number(balances.stable) / 10 ** stableDecimals;

    return nativeValue / (nativeValue + stableValue);
  }

  /** eth_call outcome: returned, or reverted with its raw revert data ("0x" when the contract gave none). */
  async function probeCall(
    to: Address,
    data: Hex,
    from: Address = ACTOR,
  ): Promise<{ readonly reverted: false } | { readonly reverted: true; readonly data: Hex }> {
    try {
      await publicClient.call({ account: from, to, data });
      return { reverted: false };
    } catch (error) {
      const raw =
        error instanceof BaseError
          ? (error.walk((cause) => typeof (cause as { data?: unknown }).data === "string") as { data?: Hex } | null)
          : null;
      if (!raw?.data) throw error;

      return { reverted: true, data: raw.data };
    }
  }

  async function expectFolioRevert(from: Address, call: Pick<IndexDtfCall, "to" | "data">, errorName: string) {
    const result = await probeCall(call.to, call.data, from);
    if (!result.reverted) throw new Error(`expected ${errorName}, but the call succeeded`);
    expect(decodeErrorResult({ abi: folioV6Abi, data: result.data }).errorName).toBe(errorName);
  }

  async function setNextBlockTimestamp(timestamp: bigint) {
    await publicClient.request({ method: "evm_setNextBlockTimestamp" as never, params: [toHex(timestamp)] as never });
  }

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
    options: { readonly syncedFolioCall?: boolean } = {},
  ): Promise<TransactionReceipt> {
    // Only Folio calls behind the `sync` modifier (startRebalance, openAuction, openAuctionUnrestricted, bid) get a
    // fixed gas limit. Anvil estimates at one timestamp and can mine a second later; `sync` writes
    // `lastFolioFeePoke = block.timestamp`, a no-op SSTORE in the estimate and a real one when mined, so a tight
    // estimate starves the delegatecall into RebalancingLib and the call reverts with empty data (startRebalance
    // reverts under a 590k limit while its success uses 587k). Everything else runs on the node's estimate.
    const hash = await wallet.sendTransaction({
      account: from,
      chain,
      to: call.to,
      data: call.data,
      value: call.value,
      ...(options.syncedFolioCall ? { gas: FORK_TRANSACTION_GAS } : {}),
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

/** Folio's auction price at `timestamp` (RebalancingLib._price): exact at start and end, exponential decay between. */
function expectedAuctionPrice(
  sell: PriceRange,
  buy: PriceRange,
  window: { readonly startTime: bigint; readonly endTime: bigint },
  timestamp: bigint,
): { readonly exact: boolean; readonly price: bigint; readonly ideal: number } {
  const startPrice = ceilDiv(sell.high * D27, buy.low);
  const endPrice = ceilDiv(sell.low * D27, buy.high);
  if (timestamp === window.startTime) return { exact: true, price: startPrice, ideal: Number(startPrice) };
  if (timestamp === window.endTime) return { exact: true, price: endPrice, ideal: Number(endPrice) };

  const progress = Number(timestamp - window.startTime) / Number(window.endTime - window.startTime);
  const ideal = Number(startPrice) * Math.exp(Math.log(Number(endPrice) / Number(startPrice)) * progress);

  return { exact: false, price: BigInt(Math.ceil(ideal)), ideal };
}

/** A well-formed argument for a dispatch probe: every address is a real basket token, so token reads succeed. */
function probeArgument(parameter: AbiParameter, token: Address): unknown {
  const arrayMatch = parameter.type.match(/^(.*)\[(\d*)\]$/);
  if (arrayMatch) {
    const element = { ...parameter, type: arrayMatch[1]! } as AbiParameter;
    return arrayMatch[2] ? Array.from({ length: Number(arrayMatch[2]) }, () => probeArgument(element, token)) : [];
  }
  if (parameter.type === "tuple") {
    const components = (parameter as { readonly components: readonly AbiParameter[] }).components;
    return Object.fromEntries(components.map((component) => [component.name, probeArgument(component, token)]));
  }
  if (parameter.type === "address") return token;
  if (parameter.type === "bool") return false;
  if (parameter.type === "string") return "";
  if (parameter.type === "bytes") return "0x";
  if (parameter.type.startsWith("bytes")) return toHex(0, { size: Number(parameter.type.slice(5)) });
  if (/^u?int\d*$/.test(parameter.type)) return 0n;
  throw new Error(`no probe argument for ${parameter.type}`);
}

function describeBid(bid: BidCheck): string {
  return `${bid.label} t=${bid.timestamp}: sold ${bid.sellAmount} native for ${bid.bidAmount} stable at D27 ${bid.price}`;
}

function minBigInt(...values: readonly bigint[]): bigint {
  return values.reduce((min, value) => (value < min ? value : min));
}
