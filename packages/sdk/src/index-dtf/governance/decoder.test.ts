import { encodeFunctionData } from "viem";
import { describe, expect, it } from "vitest";

import { dtfIndexProposalAbiCatalog } from "@/index-dtf/abis/dtf-index-proposal";
import { folioArtifactAbi } from "@/index-dtf/abis/folio-artifact";
import { dtfIndexGovernanceProposalAbi, dtfIndexProposalAbi } from "@/index-dtf/abis/proposal-decoder";
import { selectorRegistryAbi } from "@/index-dtf/abis/selector-registry";
import { decodeIndexDtfProposalCalldatas } from "@/index-dtf/governance/decoder";
import { indexDtfV5WriteAbi } from "@/index-dtf/governance/propose/calls";

const DTF = "0x0000000000000000000000000000000000000001";

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
});
