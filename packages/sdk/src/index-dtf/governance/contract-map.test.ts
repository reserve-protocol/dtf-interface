import { describe, expect, it } from "vitest";

import { buildProposalContractMap, getContractAliases } from "@/index-dtf/governance/contract-map";

describe("Index DTF proposal contract map", () => {
  it("labels shared owner and basket governance without losing the timelock", () => {
    const contractMap = buildProposalContractMap({
      chainId: 1,
      dtf: {
        address: "0x0000000000000000000000000000000000000003",
        proxyAdmin: "0x0000000000000000000000000000000000000008",
        legacyAdminGovernance: [],
        legacyTradingGovernance: [],
        ownerGovernance: {
          address: "0x0000000000000000000000000000000000000001",
          timelock: "0x0000000000000000000000000000000000000006",
        },
        tradingGovernance: {
          address: "0x0000000000000000000000000000000000000001",
          timelock: "0x0000000000000000000000000000000000000006",
        },
        stakingToken: {
          address: "0x0000000000000000000000000000000000000007",
          legacyGovernance: [],
        },
      },
    });

    expect(getContractAliases(contractMap)).toMatchObject({
      "0x0000000000000000000000000000000000000001": "Owner/Basket Governance",
      "0x0000000000000000000000000000000000000006": "Owner/Basket Governance Timelock",
    });
  });
});
