import { encodeFunctionData, zeroAddress, type Address, type Hash, type Hex } from "viem";
import { describe, expect, it } from "vitest";

import { dtfAdminProposalAbi } from "@/index-dtf/abis/dtf-admin-proposal";
import { selectorRegistryAbi } from "@/index-dtf/abis/selector-registry";
import { assertDisposableForkRpcUrl, parseForkSmokeManifest } from "@/index-dtf/fork-smoke-fixture";

const FOLIOS = {
  control: "0x0000000000000000000000000000000000000001",
  optimistic: "0x0000000000000000000000000000000000000002",
  legacy: "0x0000000000000000000000000000000000000003",
  native: "0x0000000000000000000000000000000000000004",
} as const satisfies Record<string, Address>;
const PROXY_ADMINS = {
  control: "0x0000000000000000000000000000000000000011",
  optimistic: "0x0000000000000000000000000000000000000012",
  legacy: "0x0000000000000000000000000000000000000013",
  native: "0x0000000000000000000000000000000000000014",
} as const satisfies Record<string, Address>;
const GOVERNANCES = {
  optimistic: "0x0000000000000000000000000000000000000021",
  legacy: "0x0000000000000000000000000000000000000022",
  native: "0x0000000000000000000000000000000000000023",
} as const satisfies Record<string, Address>;
const TIMELOCK = "0x0000000000000000000000000000000000000031";
const STAKING_VAULT = "0x0000000000000000000000000000000000000032";
const SELECTOR_REGISTRY = "0x0000000000000000000000000000000000000033";
const NATIVE_SELECTOR_REGISTRY = "0x0000000000000000000000000000000000000034";
const UPGRADE_SPELL = "0x0000000000000000000000000000000000000041";
const V5_START_REBALANCE_SELECTOR = "0x207c8eed";
const V6_START_REBALANCE_SELECTOR = "0xc1e54b89";

const upgradeSpellEvidenceAbi = [
  {
    type: "function",
    name: "cast",
    inputs: [
      { name: "folio", type: "address" },
      { name: "proxyAdmin", type: "address" },
      { name: "selectorRegistry", type: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;

function createManifest() {
  const optimisticCalldatas = [
    encodeFunctionData({
      abi: selectorRegistryAbi,
      functionName: "registerSelectors",
      args: [[{ target: FOLIOS.optimistic, selectors: [V6_START_REBALANCE_SELECTOR] }]],
    }),
    encodeFunctionData({
      abi: selectorRegistryAbi,
      functionName: "unregisterSelectors",
      args: [[{ target: FOLIOS.optimistic, selectors: [V5_START_REBALANCE_SELECTOR] }]],
    }),
    encodeFunctionData({
      abi: dtfAdminProposalAbi,
      functionName: "transferOwnership",
      args: [UPGRADE_SPELL],
    }),
    encodeFunctionData({
      abi: upgradeSpellEvidenceAbi,
      functionName: "cast",
      args: [FOLIOS.optimistic, PROXY_ADMINS.optimistic, SELECTOR_REGISTRY],
    }),
  ] as const;
  const legacyCalldatas = [
    encodeFunctionData({
      abi: dtfAdminProposalAbi,
      functionName: "transferOwnership",
      args: [UPGRADE_SPELL],
    }),
    encodeFunctionData({
      abi: upgradeSpellEvidenceAbi,
      functionName: "cast",
      args: [FOLIOS.legacy, PROXY_ADMINS.legacy, zeroAddress],
    }),
  ] as const;

  return {
    schemaVersion: 1,
    rpcUrl: "http://127.0.0.1:8545",
    chainId: 1,
    forkBlock: "1",
    stateBlock: "50",
    stateTimestamp: "1000",
    writePaths: { deadline: "2000", auctionLength: 300 },
    protocol: {
      v5Deployer: FOLIOS.control,
      v6Deployer: FOLIOS.native,
      v6Implementation: PROXY_ADMINS.native,
      versionRegistry: GOVERNANCES.native,
      upgradeSpell: UPGRADE_SPELL,
      upgradeSpellSourceCommit: "33c315690a71c826b5bcd01b69110f478ccd865d",
      startRebalanceSelectors: { v5: V5_START_REBALANCE_SELECTOR, v6: V6_START_REBALANCE_SELECTOR },
    },
    scenarios: {
      v5Control: {
        folio: FOLIOS.control,
        proxyAdmin: PROXY_ADMINS.control,
        governance: zeroAddress,
        governanceKind: "standard",
        creationBlock: "10",
        execution: {
          actor: GOVERNANCES.optimistic,
          roleAuthority: "direct-admin",
          tokens: [FOLIOS.optimistic, FOLIOS.legacy],
          rebalanceNonce: 1,
          rebalanceTxHash: transactionHash(1),
          rebalanceBlock: 41,
          auctionId: 0,
          auctionTxHash: transactionHash(2),
          auctionBlock: 42,
          auctionLength: 300,
        },
      },
      v5OptimisticUpgrade: {
        address: FOLIOS.optimistic,
        proxyAdmin: PROXY_ADMINS.optimistic,
        governance: GOVERNANCES.optimistic,
        governanceKind: "optimistic",
        governanceAddresses: governanceAddresses(GOVERNANCES.optimistic, SELECTOR_REGISTRY),
        creationBlock: 20,
        upgradeBlock: "30",
        proposalCallCount: 4,
        proposal: proposalEvidence(
          25,
          30,
          [SELECTOR_REGISTRY, SELECTOR_REGISTRY, PROXY_ADMINS.optimistic, UPGRADE_SPELL],
          optimisticCalldatas,
        ),
      },
      v5LegacyUpgrade: {
        folio: FOLIOS.legacy,
        proxyAdmin: PROXY_ADMINS.legacy,
        governance: GOVERNANCES.legacy,
        governanceKind: "standard",
        governanceAddresses: governanceAddresses(GOVERNANCES.legacy, zeroAddress),
        creationBlock: "21",
        upgradeBlock: 31,
        proposalCallCount: 2,
        proposal: proposalEvidence(26, 31, [PROXY_ADMINS.legacy, UPGRADE_SPELL], legacyCalldatas),
      },
      v6Native: {
        folio: FOLIOS.native,
        proxyAdmin: PROXY_ADMINS.native,
        governance: GOVERNANCES.native,
        governanceKind: "optimistic",
        governanceAddresses: governanceAddresses(GOVERNANCES.native, NATIVE_SELECTOR_REGISTRY),
        creationBlock: "40",
        execution: {
          actor: GOVERNANCES.optimistic,
          roleAuthority: "optimistic-governance",
          governanceMechanism: "optimistic",
          authority: executionProposal("standard", false, 3, 41, 4, 42),
          rebalanceProposal: {
            ...executionProposal("optimistic", true, 5, 43, 6, 44),
            deadline: 2000,
          },
          tokens: [FOLIOS.optimistic, FOLIOS.legacy],
          rebalanceNonce: 1,
          deadline: 2000,
          rebalanceTxHash: transactionHash(6),
          rebalanceBlock: 44,
          auctionId: 0,
          auctionTxHash: transactionHash(7),
          auctionBlock: 45,
          auctionLength: 300,
        },
      },
    },
  };
}

describe("assertDisposableForkRpcUrl", () => {
  it("refuses the shared indexed sandbox and non-loopback RPCs", () => {
    for (const url of ["http://127.0.0.1:8545", "http://localhost:8545/", "http://[::1]:8545"]) {
      expect(() => assertDisposableForkRpcUrl(url)).toThrow("port 8545 is the shared indexed sandbox");
    }
    expect(() => assertDisposableForkRpcUrl("https://base.gateway.tenderly.co")).toThrow("must use HTTP on localhost");
    expect(() => assertDisposableForkRpcUrl("http://10.0.0.2:8549")).toThrow("must use HTTP on localhost");
  });

  it("refuses the manifest's indexed RPC on any port and accepts a separate disposable fork", () => {
    expect(() =>
      assertDisposableForkRpcUrl("http://localhost:9545", { indexedRpcUrl: "http://127.0.0.1:9545" }),
    ).toThrow("indexed sandbox RPC");
    expect(() =>
      assertDisposableForkRpcUrl("http://127.0.0.1:8546", { indexedRpcUrl: "http://127.0.0.1:8545" }),
    ).not.toThrow();
  });
});

describe("parseForkSmokeManifest", () => {
  it("normalizes four distinct scenarios and documented address alias", () => {
    const config = parseForkSmokeManifest(createManifest());

    expect(config).toMatchObject({
      chainId: 1,
      forkBlock: 1n,
      stateBlock: 50n,
      stateTimestamp: 1000n,
      writePaths: { deadline: 2000n, auctionLength: 300n },
      rpcUrl: "http://127.0.0.1:8545",
      protocol: {
        v5Deployer: FOLIOS.control,
        v6Deployer: FOLIOS.native,
        v6Implementation: PROXY_ADMINS.native,
        versionRegistry: GOVERNANCES.native,
        upgradeSpell: UPGRADE_SPELL,
        upgradeSpellSourceCommit: "33c315690a71c826b5bcd01b69110f478ccd865d",
      },
    });
    expect(config.scenarios.map((scenario) => scenario.label)).toEqual([
      "v5Control",
      "v5OptimisticUpgrade",
      "v5LegacyUpgrade",
      "v6Native",
    ]);
    expect(config.scenarios.map((scenario) => scenario.expectedVersion)).toEqual(["5.0.0", "6.0.0", "6.0.0", "6.0.0"]);
    expect(config.scenarios[0].governance).toBeUndefined();
    expect(config.scenarios[0].execution).toMatchObject({
      roleAuthority: "direct-admin",
      rebalanceNonce: 1n,
      auctionId: 0n,
    });
    expect(config.scenarios[1]).toMatchObject({
      governance: GOVERNANCES.optimistic,
      governanceKind: "optimistic",
      proposalCallCount: 4,
      proposal: { proposalBlock: 25n, executeBlock: 30n },
    });
    expect(config.scenarios[3].execution).toMatchObject({
      roleAuthority: "optimistic-governance",
      governanceMechanism: "optimistic",
      authority: { kind: "standard", optimistic: false, proposalId: 3n },
      rebalanceProposal: { kind: "optimistic", optimistic: true, proposalId: 5n },
      deadline: 2000n,
    });
  });

  it("allows only a loopback RPC override", () => {
    expect(parseForkSmokeManifest(createManifest(), "http://localhost:9545").rpcUrl).toBe("http://localhost:9545");
    expect(() => parseForkSmokeManifest(createManifest(), "https://eth-mainnet.example")).toThrow(
      "rpcUrl must use HTTP on localhost",
    );
  });

  it("rejects unsupported schemas and incoherent transition blocks", () => {
    expect(() => parseForkSmokeManifest({ ...createManifest(), schemaVersion: 2 })).toThrow("schemaVersion must be 1");
    expect(() => parseForkSmokeManifest({ ...createManifest(), forkBlock: 10 })).toThrow(
      "every scenario creationBlock must be after forkBlock",
    );
    const { v6Deployer: _v6Deployer, ...incompleteProtocol } = createManifest().protocol;
    expect(() => parseForkSmokeManifest({ ...createManifest(), protocol: incompleteProtocol })).toThrow(
      "protocol.v6Deployer",
    );
    expect(() =>
      parseForkSmokeManifest({
        ...createManifest(),
        scenarios: {
          ...createManifest().scenarios,
          v5Control: { ...createManifest().scenarios.v5Control, execution: undefined },
        },
      }),
    ).toThrow("scenarios.v5Control.execution must be an object");
    expect(() =>
      parseForkSmokeManifest({
        ...createManifest(),
        scenarios: {
          ...createManifest().scenarios,
          v5LegacyUpgrade: {
            ...createManifest().scenarios.v5LegacyUpgrade,
            creationBlock: "31",
            upgradeBlock: "31",
          },
        },
      }),
    ).toThrow("creationBlock must be before its upgradeBlock");
    expect(() =>
      parseForkSmokeManifest({
        ...createManifest(),
        scenarios: {
          ...createManifest().scenarios,
          v6Native: { ...createManifest().scenarios.v6Native, folio: zeroAddress },
        },
      }),
    ).toThrow("must be a non-zero Ethereum address");
  });

  it("rejects duplicate Folios and path evidence that does not match the scenario", () => {
    expect(() =>
      parseForkSmokeManifest({
        ...createManifest(),
        scenarios: {
          ...createManifest().scenarios,
          v6Native: { ...createManifest().scenarios.v6Native, folio: FOLIOS.control },
        },
      }),
    ).toThrow("four distinct Folio addresses");

    const manifest = createManifest();
    expect(() =>
      parseForkSmokeManifest({
        ...manifest,
        scenarios: {
          ...manifest.scenarios,
          v5LegacyUpgrade: {
            ...manifest.scenarios.v5LegacyUpgrade,
            proposal: {
              ...manifest.scenarios.v5LegacyUpgrade.proposal,
              targets: [UPGRADE_SPELL, UPGRADE_SPELL],
            },
          },
        },
      }),
    ).toThrow("targets do not match the standard upgrade path");
  });

  it("rejects execution evidence that collapses direct and optimistic mechanisms", () => {
    const manifest = createManifest();
    expect(() =>
      parseForkSmokeManifest({
        ...manifest,
        scenarios: {
          ...manifest.scenarios,
          v5Control: {
            ...manifest.scenarios.v5Control,
            execution: {
              ...manifest.scenarios.v5Control.execution,
              roleAuthority: "optimistic-governance",
            },
          },
        },
      }),
    ).toThrow("standard-topology direct-admin path");

    expect(() =>
      parseForkSmokeManifest({
        ...manifest,
        scenarios: {
          ...manifest.scenarios,
          v6Native: {
            ...manifest.scenarios.v6Native,
            execution: {
              ...manifest.scenarios.v6Native.execution,
              rebalanceTxHash: transactionHash(8),
            },
          },
        },
      }),
    ).toThrow("transaction linkage is inconsistent");
  });
});

function governanceAddresses(governor: Address, selectorRegistry: Address) {
  return { governor, timelock: TIMELOCK, stakingVault: STAKING_VAULT, selectorRegistry };
}

function executionProposal(
  kind: "standard" | "optimistic",
  optimistic: boolean,
  proposalTx: number,
  proposalBlock: number,
  executeTx: number,
  executeBlock: number,
) {
  return {
    kind,
    optimistic,
    state: "executed",
    description: `${kind} execution evidence`,
    proposalId: String(proposalTx),
    proposalTxHash: transactionHash(proposalTx),
    proposalBlock,
    executeTxHash: transactionHash(executeTx),
    executeBlock,
  };
}

function transactionHash(value: number): Hash {
  return `0x${value.toString(16).padStart(64, "0")}`;
}

function proposalEvidence(
  proposalBlock: number,
  executeBlock: number,
  targets: readonly Address[],
  calldatas: readonly Hex[],
) {
  return {
    proposalId: "1",
    entityId: "governance-1",
    kind: "standard",
    optimistic: false,
    state: "executed",
    proposalBlock,
    executeBlock,
    targets,
    values: targets.map(() => 0),
    calldatas,
    selectors: calldatas.map((calldata) => calldata.slice(0, 10) as Hex),
  };
}
