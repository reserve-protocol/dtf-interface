import { encodeFunctionData, zeroAddress } from "viem";
import { describe, expect, it } from "vitest";

import {
  governanceSpell09182026Abi,
  INDEX_DTF_GOVERNANCE_SPELL_09_18_2026_ADDRESS,
  ownableTransferOwnershipAbi,
} from "@/index-dtf/abis/governance-spell-09-18-2026";
import { INDEX_DTF_UPGRADE_SPELL_6_0_0_ADDRESS } from "@/index-dtf/abis/upgrade-spell-6-0-0";
import { buildProposalContractMap } from "@/index-dtf/governance/contract-map";
import { decodeIndexDtfProposalCalldatas } from "@/index-dtf/governance/decoder";
import { buildIndexDtfUpgradeToV6Calls } from "@/index-dtf/governance/propose/upgrade-v6";

const DTF = "0x0000000000000000000000000000000000000001";
const PROXY_ADMIN = "0x0000000000000000000000000000000000000002";
const ST_TOKEN = "0x0000000000000000000000000000000000000003";
const REGISTRY = "0x00000000000000000000000000000000000000aa";
const OLD_VAULT = "0x00000000000000000000000000000000000000bb";

const contractMap = () =>
  buildProposalContractMap({
    chainId: 8453,
    dtf: {
      address: DTF,
      proxyAdmin: PROXY_ADMIN,
      legacyAdminGovernance: [],
      legacyTradingGovernance: [],
      stakingToken: { address: ST_TOKEN, legacyGovernance: [] },
    },
  });

const decodeCalls = (calls: ReturnType<typeof buildIndexDtfUpgradeToV6Calls>) =>
  decodeIndexDtfProposalCalldatas({
    targets: calls.map((call) => call.contract.address),
    calldatas: calls.map((call) =>
      encodeFunctionData({
        abi: call.contract.abi,
        functionName: call.contract.functionName,
        args: call.contract.args,
      } as never),
    ),
    contractMap: contractMap(),
  });

describe("spell proposal decoding", () => {
  it("names every call of an optimistic 5.0.0 → 6.0.0 upgrade proposal", () => {
    const decoded = decodeCalls(
      buildIndexDtfUpgradeToV6Calls({
        chainId: 8453,
        address: DTF,
        proxyAdmin: PROXY_ADMIN,
        spell: INDEX_DTF_UPGRADE_SPELL_6_0_0_ADDRESS[8453],
        selectorRegistry: REGISTRY,
      }),
    );

    expect(decoded.unknownCalls).toEqual([]);
    expect(decoded.calls.map(({ contract, functionName }) => [contract, functionName])).toEqual([
      ["Selector Registry", "registerSelectors"],
      ["Selector Registry", "unregisterSelectors"],
      ["ProxyAdmin", "transferOwnership"],
      ["Upgrade Spell 6.0.0", "cast"],
    ]);
  });

  it("names both calls of a legacy 5.0.0 → 6.0.0 upgrade proposal", () => {
    const decoded = decodeCalls(
      buildIndexDtfUpgradeToV6Calls({
        chainId: 8453,
        address: DTF,
        proxyAdmin: PROXY_ADMIN,
        spell: INDEX_DTF_UPGRADE_SPELL_6_0_0_ADDRESS[8453],
      }),
    );

    expect(decoded.calls.map(({ contract, functionName }) => [contract, functionName])).toEqual([
      ["ProxyAdmin", "transferOwnership"],
      ["Upgrade Spell 6.0.0", "cast"],
    ]);
    expect(decoded.calls[1]?.params).toEqual([DTF, PROXY_ADMIN, zeroAddress]);
  });

  it("names the old vault hand-off and retirement of a vault retire proposal", () => {
    const spell = INDEX_DTF_GOVERNANCE_SPELL_09_18_2026_ADDRESS[8453];
    const decoded = decodeIndexDtfProposalCalldatas({
      targets: [OLD_VAULT, spell],
      calldatas: [
        encodeFunctionData({ abi: ownableTransferOwnershipAbi, functionName: "transferOwnership", args: [spell] }),
        encodeFunctionData({
          abi: governanceSpell09182026Abi,
          functionName: "retireOldStakingVault",
          args: [OLD_VAULT],
        }),
      ],
      contractMap: contractMap(),
    });

    expect(decoded.unknownCalls).toEqual([]);
    expect(decoded.calls.map(({ contract, functionName }) => [contract, functionName])).toEqual([
      ["Ownable Contract", "transferOwnership"],
      ["Governance Spell 09_18_2026", "retireOldStakingVault"],
    ]);
  });

  // Later deployments of the same spell (2% and 1% thresholds) and OPEN's 10_21_2026 spell share its ABI.
  it.each([
    [8453, "0x24a4B37F9c40fB0E80ec436Df2e9989FBAFa8bB7", "Governance Spell 09_18_2026"],
    [8453, "0x971c890ACb9EeB084f292996Be667bB9A2889AE9", "Governance Spell 09_18_2026"],
    [1, "0xeE6066Df6E27F142b921FD38e6766a9D6aF35c2f", "Governance Spell 09_18_2026"],
    [56, "0x281EDD83b9b3C7cD05E260EF7E17A9734731A52B", "Governance Spell 09_18_2026"],
    [1, "0xaf029ad44Cc44fB2AefFF84029dd0c29D5Ea8D87", "Governance Spell 10_21_2026"],
  ] as const)("names a retire call to the spell at %s %s", (chainId, spell, name) => {
    const decoded = decodeIndexDtfProposalCalldatas({
      targets: [spell],
      calldatas: [
        encodeFunctionData({
          abi: governanceSpell09182026Abi,
          functionName: "retireOldStakingVault",
          args: [OLD_VAULT],
        }),
      ],
      contractMap: buildProposalContractMap({
        chainId,
        dtf: {
          address: DTF,
          proxyAdmin: PROXY_ADMIN,
          legacyAdminGovernance: [],
          legacyTradingGovernance: [],
          stakingToken: { address: ST_TOKEN, legacyGovernance: [] },
        },
      }),
    });

    expect(decoded.unknownCalls).toEqual([]);
    expect(decoded.calls.map(({ contract, functionName }) => [contract, functionName])).toEqual([
      [name, "retireOldStakingVault"],
    ]);
  });
});
