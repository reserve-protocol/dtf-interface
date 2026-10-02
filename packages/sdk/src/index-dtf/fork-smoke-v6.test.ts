import { createPublicClient, http, type PublicClient } from "viem";
import { beforeAll, describe, expect, it } from "vitest";

import type { ForkScenario, ForkSmokeConfig } from "@/index-dtf/fork-smoke-fixture";

import { SUPPORTED_CHAINS } from "@/config";
import { createDtfSdk, type DtfSdk } from "@/create-dtf-sdk";
import { readForkSmokeConfig } from "@/index-dtf/fork-smoke-fixture";

const runtimeEnv =
  (globalThis as unknown as { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {};
const forkDescribe = runtimeEnv.RUN_INDEX_DTF_FORK_SMOKE === "1" ? describe : describe.skip;
const forkSmokeTestTimeout = 120_000;
const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

/**
 * Read-only v6 checks against the sandbox's indexed Anvil (8545): no transactions, snapshots, reverts or time warps,
 * so it is safe while a fork Graph Node indexes the chain. The writing v6 cases live in
 * `fork-smoke-v6-mutating.test.ts` and run on a disposable fork.
 */
forkDescribe("Index DTF v6 completion fork smoke (read-only)", () => {
  let config: ForkSmokeConfig;
  let sdk: DtfSdk;

  beforeAll(() => {
    config = readForkSmokeConfig(runtimeEnv);
    const publicClient: PublicClient = createPublicClient({
      chain: SUPPORTED_CHAINS[config.chainId],
      transport: http(config.rpcUrl),
    });
    sdk = createDtfSdk({ chains: { [config.chainId]: { publicClient } } });
  });

  it(
    "reads the sandbox's version registry: 6.0.0 registered with the fixture's deployer and implementation",
    async () => {
      const registry = config.protocol.versionRegistry;
      const at = { chainId: config.chainId, registry, blockNumber: config.stateBlock } as const;
      const latest = await sdk.index.getLatestVersion(at);
      const v6 = await sdk.index.getVersionDeployment({ ...at, version: "6.0.0" });
      const v5 = await sdk.index.getVersionDeployment({ ...at, version: "5.0.0" });

      expect(latest).toMatchObject({ version: "6.0.0", deployer: config.protocol.v6Deployer, deprecated: false });
      expect(v6).toMatchObject({
        deployer: config.protocol.v6Deployer,
        implementation: config.protocol.v6Implementation,
      });
      expect(v5?.deployer).toBe(config.protocol.v5Deployer);
      await expect(sdk.index.getVersionDeployment({ ...at, version: "9.9.9" })).resolves.toBeNull();
    },
    forkSmokeTestTimeout,
  );

  it(
    "reads native v6 state through the SDK and rejects the immutable-table read on a v5 folio",
    async () => {
      const v6 = getScenario("v6Native");
      const v5 = getScenario("v5Control");
      if (!v6.execution) throw new Error("v6Native execution evidence is missing");
      // Pinned to the fixture's state block: the indexed lane appends rebalances after the fixture is recorded.
      const params = { address: v6.folio, chainId: config.chainId, blockNumber: config.stateBlock } as const;

      expect(await sdk.index.getMaxAuctionLength(params)).toBe(config.writePaths.auctionLength);
      expect(await sdk.index.getRebalanceNonce(params)).toBe(BigInt(v6.execution.rebalanceNonce));
      expect(await sdk.index.getSelfFee(params)).toEqual({ raw: 0n, formatted: "0" });
      expect(await sdk.index.getImmutableFeeRecipients(params)).toEqual([]);
      expect(await sdk.index.getTradeAllowlist(params)).toEqual({ enabled: false, tokens: [] });
      expect(await sdk.index.getIsTokenAllowlisted({ ...params, token: WETH })).toBe(false);
      await expect(
        sdk.index.getImmutableFeeRecipients({
          address: v5.folio,
          chainId: config.chainId,
          blockNumber: config.stateBlock,
        }),
      ).rejects.toThrow();
    },
    forkSmokeTestTimeout,
  );

  function getScenario(label: ForkScenario["label"]): ForkScenario {
    const scenario = config.scenarios.find((candidate) => candidate.label === label);
    if (!scenario) throw new Error(`Missing scenario ${label}`);
    return scenario;
  }
});
