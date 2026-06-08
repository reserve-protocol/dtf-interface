import { encodeFunctionData, type Abi, type Address } from "viem";
import { describe, expect, it } from "vitest";

import type { DtfClient } from "@/client";

import { dtfIndexProposalAbiCatalog } from "@/index-dtf/abis/dtf-index-proposal";
import { folioArtifactAbi } from "@/index-dtf/abis/folio-artifact";
import { dtfIndexGovernanceProposalAbi, dtfIndexProposalAbi } from "@/index-dtf/abis/proposal-decoder";
import { selectorRegistryAbi } from "@/index-dtf/abis/selector-registry";
import { upgradeSpellProposalAbi } from "@/index-dtf/abis/upgrade-spell-proposal";
import { buildProposalContractMap, type IndexDtfProposalDtfContractContext } from "@/index-dtf/governance/contract-map";
import { decodeIndexDtfProposal, decodeIndexDtfProposalCalldatas } from "@/index-dtf/governance/decoder";
import { indexDtfV5WriteAbi } from "@/index-dtf/governance/propose/calls";

const DTF = "0x0000000000000000000000000000000000000001";
const PROXY_ADMIN = "0x0000000000000000000000000000000000000002";
const ST_TOKEN = "0x0000000000000000000000000000000000000003";
const BSC_OPTIMISTIC_SPELL = "0x3DDe17cfd36e740CB7452cb2F59FC925eACb91aB";

describe("Index DTF proposal calldata decoder", () => {
  it("keeps Index DTF decoder ABIs ordered latest to oldest", () => {
    expect(dtfIndexProposalAbiCatalog.map((entry) => entry.version)).toEqual([
      "6.0.0",
      "5.0.0",
      "4.0.0",
      "2.0.0",
      "1.0.0",
    ]);
  });

  it("decodes Index DTF proposal calldata across versions", () => {
    const oldAuctionLengthCalldata = encodeFunctionData({
      abi: indexDtfV5WriteAbi,
      functionName: "setAuctionLength",
      args: [1800n],
    });
    const latestAuctionLengthCalldata = encodeFunctionData({
      abi: folioArtifactAbi,
      functionName: "setMaxAuctionLength",
      args: [1800n],
    });

    const decoded = decodeIndexDtfProposalCalldatas({
      targets: [DTF, DTF],
      calldatas: [oldAuctionLengthCalldata, latestAuctionLengthCalldata],
      contractMap: new Map([
        [
          DTF.toLowerCase(),
          {
            target: DTF,
            contract: "Index DTF",
            abi: dtfIndexProposalAbi,
          },
        ],
      ]),
    });

    expect(decoded.calls.map((call) => call.functionName)).toEqual(["setAuctionLength", "setMaxAuctionLength"]);
    expect(decoded.unknownCalls).toEqual([]);
  });

  it("decodes optimistic governance and selector registry proposal calls", () => {
    const governance = "0x0000000000000000000000000000000000000002";
    const selectorRegistry = "0x0000000000000000000000000000000000000003";
    const optimisticCalldata = encodeFunctionData({
      abi: dtfIndexGovernanceProposalAbi,
      functionName: "setProposalThrottle",
      args: [100n],
    });
    const selectorCalldata = encodeFunctionData({
      abi: selectorRegistryAbi,
      functionName: "registerSelectors",
      args: [
        [
          {
            target: DTF,
            selectors: ["0x12345678"],
          },
        ],
      ],
    });

    const decoded = decodeIndexDtfProposalCalldatas({
      targets: [governance, selectorRegistry],
      calldatas: [optimisticCalldata, selectorCalldata],
      contractMap: new Map([
        [
          governance.toLowerCase(),
          {
            target: governance,
            contract: "Owner Governance",
            abi: dtfIndexGovernanceProposalAbi,
          },
        ],
      ]),
    });

    expect(decoded.calls.map((call) => call.functionName)).toEqual(["setProposalThrottle", "registerSelectors"]);
    expect(decoded.calls.map((call) => call.contract)).toEqual(["Owner Governance", "Selector Registry"]);
    expect(decoded.unknownCalls).toEqual([]);
  });

  it("decodes the Register optimistic governance upgrade spell when it is also a legacy owner", () => {
    const calldata = encodeFunctionData({
      abi: upgradeSpellProposalAbi,
      functionName: "upgradeFolio",
      args: [
        DTF,
        PROXY_ADMIN,
        ST_TOKEN,
        "0x0000000000000000000000000000000000000004",
        "0x0000000000000000000000000000000000000005",
        { vetoDelay: 1, vetoPeriod: 2, vetoThreshold: 3n },
        ["0x0000000000000000000000000000000000000006"],
        ["0x0000000000000000000000000000000000000007"],
        "0x0000000000000000000000000000000000000008",
        "0x0000000000000000000000000000000000000000000000000000000000000009",
      ],
    });
    const decoded = decodeIndexDtfProposalCalldatas({
      targets: [BSC_OPTIMISTIC_SPELL],
      calldatas: [calldata],
      contractMap: buildProposalContractMap({
        chainId: 56,
        dtf: {
          ...getDtfContractContext(),
          legacyAdminGovernance: [BSC_OPTIMISTIC_SPELL],
        },
      }),
    });

    expect(decoded.calls[0]).toMatchObject({
      contract: "Reserve Optimistic Governance Spell",
      functionName: "upgradeFolio",
      target: BSC_OPTIMISTIC_SPELL,
    });
    expect(decoded.unknownCalls).toEqual([]);
  });

  it("fetches verified ABI metadata for unknown proposal targets", async () => {
    const externalTarget = "0x0000000000000000000000000000000000000009";
    const externalAbi = [
      {
        type: "function",
        name: "setFoo",
        inputs: [{ name: "value", type: "uint256" }],
        outputs: [],
        stateMutability: "nonpayable",
      },
    ] as const satisfies Abi;
    const calldata = encodeFunctionData({
      abi: externalAbi,
      functionName: "setFoo",
      args: [123n],
    });
    const client = getClientWithExplorer(externalTarget, externalAbi, "ExternalConfigurator");

    const decoded = await decodeIndexDtfProposal(client, {
      chainId: 1,
      targets: [externalTarget],
      calldatas: [calldata],
      dtf: getDtfContractContext(),
    });

    expect(decoded.calls[0]).toMatchObject({
      contract: "ExternalConfigurator",
      functionName: "setFoo",
      params: [123n],
    });
    expect(decoded.unknownCalls).toEqual([]);
  });

  it("keeps known aliases when fetched ABI fills a missing selector", async () => {
    const externalAbi = [
      {
        type: "function",
        name: "customFolioCall",
        inputs: [{ name: "account", type: "address" }],
        outputs: [],
        stateMutability: "nonpayable",
      },
    ] as const satisfies Abi;
    const calldata = encodeFunctionData({
      abi: externalAbi,
      functionName: "customFolioCall",
      args: ["0x0000000000000000000000000000000000000009"],
    });
    const client = getClientWithExplorer(DTF, externalAbi, "Explorer Folio Name");

    const decoded = await decodeIndexDtfProposal(client, {
      chainId: 1,
      targets: [DTF],
      calldatas: [calldata],
      dtf: getDtfContractContext(),
    });

    expect(decoded.calls[0]).toMatchObject({
      contract: "Index DTF",
      functionName: "customFolioCall",
    });
  });

  it("rejects mismatched target and calldata lengths", () => {
    expect(() =>
      decodeIndexDtfProposalCalldatas({
        targets: [DTF],
        calldatas: [],
        contractMap: new Map(),
      }),
    ).toThrow("Index DTF proposal targets and calldatas length mismatch");
  });
});

function getDtfContractContext(): IndexDtfProposalDtfContractContext {
  return {
    address: DTF,
    proxyAdmin: PROXY_ADMIN,
    legacyAdminGovernance: [],
    legacyTradingGovernance: [],
    stakingToken: {
      address: ST_TOKEN,
      legacyGovernance: [],
    },
  };
}

function getClientWithExplorer(target: Address, abi: Abi, contractName: string): DtfClient {
  return {
    explorer: {
      getContractMetadata: async ({ address }: { readonly address: Address }) =>
        address.toLowerCase() === target.toLowerCase()
          ? {
              abi,
              contractName,
            }
          : null,
    },
  } as unknown as DtfClient;
}
