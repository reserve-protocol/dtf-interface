import { zeroAddress } from "viem";
import { describe, expect, it, vi } from "vitest";

import type { DtfClient } from "@/client";
import type { IndexDtf } from "@/types/index-dtf";

import {
  buildIndexDtfUpgradeToV6Calls,
  buildIndexDtfUpgradeToV6Proposal,
  INDEX_DTF_START_REBALANCE_SELECTOR,
} from "@/index-dtf/governance/propose/upgrade-v6";
import { SdkError } from "@/lib/errors";

// Recorded by the mainnet Anvil sandbox (index-subgraph/.fork/fixture.json, spell commit 33c31569).
const SPELL = "0x6f0921A2F9c7da5F579f0Fc83873E52f6352B994";
const OPTIMISTIC = {
  folio: "0x512A93643Ae35F895Ec02BEE94670aF77c9021BE",
  proxyAdmin: "0xD67a34848dB699670052B8a81220C6c71d371150",
  selectorRegistry: "0x3dAFc73Ca466fd7A392535Fc80bd66C5792403c2",
  governor: "0xc8454a2E7966E1602346d494b1e2aB526C819B1C",
  timelock: "0xC64761bCE2aB9464AcC128414ee3af5Bc6837158",
  calldatas: [
    "0x39535e96000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000020000000000000000000000000512a93643ae35f895ec02bee94670af77c9021be00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000001c1e54b8900000000000000000000000000000000000000000000000000000000",
    "0x3bb9e672000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000020000000000000000000000000512a93643ae35f895ec02bee94670af77c9021be00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000001207c8eed00000000000000000000000000000000000000000000000000000000",
    "0xf2fde38b0000000000000000000000006f0921a2f9c7da5f579f0fc83873e52f6352b994",
    "0x2aa6b211000000000000000000000000512a93643ae35f895ec02bee94670af77c9021be000000000000000000000000d67a34848db699670052b8a81220c6c71d3711500000000000000000000000003dafc73ca466fd7a392535fc80bd66c5792403c2",
  ],
} as const;
const LEGACY = {
  folio: "0x6a473eB2FfAf3EFD14E136C72Ee94C2c6a7c3087",
  proxyAdmin: "0x22FaE17D5832f661A6d6d4bdA7222B7A1b55aCF6",
  governor: "0xb3a1CFF3BB783382c0D31F5AB5077e7D1F4Ed339",
  timelock: "0x72d25CEe4888Eb26599Dcb20FB71FF2FB747DAa4",
  calldatas: [
    "0xf2fde38b0000000000000000000000006f0921a2f9c7da5f579f0fc83873e52f6352b994",
    "0x2aa6b2110000000000000000000000006a473eb2ffaf3efd14e136c72ee94c2c6a7c308700000000000000000000000022fae17d5832f661a6d6d4bda7222b7a1b55acf60000000000000000000000000000000000000000000000000000000000000000",
  ],
} as const;

function dtfContext(input: {
  readonly proxyAdmin: string;
  readonly governor: string;
  readonly timelock: string;
  readonly selectorRegistry?: string;
}): IndexDtf {
  return {
    roles: { deployment: { proxyAdmin: input.proxyAdmin } },
    governance: {
      admin: {
        primary: {
          type: "governance",
          address: input.governor,
          governance: {
            address: input.governor,
            isOptimistic: input.selectorRegistry !== undefined,
            ...(input.selectorRegistry ? { optimistic: { selectorRegistry: input.selectorRegistry } } : {}),
            timelock: { address: input.timelock },
          },
        },
      },
    },
  } as unknown as IndexDtf;
}

function clientWithVersion(version: string): DtfClient {
  return {
    viem: { getPublicClient: vi.fn(() => ({ readContract: vi.fn(async () => version) })) },
  } as unknown as DtfClient;
}

describe("Folio 6.0 upgrade proposal", () => {
  it("derives the startRebalance selectors from the two ABIs", () => {
    expect(INDEX_DTF_START_REBALANCE_SELECTOR).toEqual({ "5.0.0": "0x207c8eed", "6.0.0": "0xc1e54b89" });
  });

  it("reproduces the sandbox's optimistic upgrade proposal byte for byte", () => {
    const calls = buildIndexDtfUpgradeToV6Calls({
      chainId: 1,
      address: OPTIMISTIC.folio,
      proxyAdmin: OPTIMISTIC.proxyAdmin,
      spell: SPELL,
      selectorRegistry: OPTIMISTIC.selectorRegistry,
    });

    expect(calls.map((call) => call.to)).toEqual([
      OPTIMISTIC.selectorRegistry,
      OPTIMISTIC.selectorRegistry,
      OPTIMISTIC.proxyAdmin,
      SPELL,
    ]);
    expect(calls.map((call) => call.data)).toEqual([...OPTIMISTIC.calldatas]);
    expect(calls.every((call) => call.value === 0n && call.chainId === 1)).toBe(true);
  });

  it("reproduces the sandbox's standard-governance upgrade proposal byte for byte, zero registry included", () => {
    const base = { chainId: 1, address: LEGACY.folio, proxyAdmin: LEGACY.proxyAdmin, spell: SPELL } as const;
    const calls = buildIndexDtfUpgradeToV6Calls(base);

    expect(calls.map((call) => call.to)).toEqual([LEGACY.proxyAdmin, SPELL]);
    expect(calls.map((call) => call.data)).toEqual([...LEGACY.calldatas]);
    expect(calls.every((call) => call.value === 0n && call.chainId === 1)).toBe(true);
    expect(buildIndexDtfUpgradeToV6Calls({ ...base, selectorRegistry: zeroAddress }).map((call) => call.data)).toEqual([
      ...LEGACY.calldatas,
    ]);
  });

  it("builds the proposal from an injected optimistic admin governance and rejects non-5.0.0 DTFs", async () => {
    const dtf = dtfContext(OPTIMISTIC);
    const proposal = await buildIndexDtfUpgradeToV6Proposal(clientWithVersion("5.0.0"), {
      address: OPTIMISTIC.folio,
      chainId: 1,
      spell: SPELL,
      dtf,
    });

    expect(proposal).toMatchObject({
      governance: OPTIMISTIC.governor,
      timelock: OPTIMISTIC.timelock,
      description: "Upgrade to Folio 6.0.0",
    });
    expect(proposal.targets).toEqual([
      OPTIMISTIC.selectorRegistry,
      OPTIMISTIC.selectorRegistry,
      OPTIMISTIC.proxyAdmin,
      SPELL,
    ]);
    expect(proposal.calldatas).toEqual([...OPTIMISTIC.calldatas]);

    const rejection = buildIndexDtfUpgradeToV6Proposal(clientWithVersion("6.0.0"), {
      address: OPTIMISTIC.folio,
      chainId: 1,
      spell: SPELL,
      dtf,
    });
    await expect(rejection).rejects.toBeInstanceOf(SdkError);
    await expect(rejection).rejects.toMatchObject({ code: "INVALID_INPUT", meta: { version: "6.0.0" } });
  });

  it("builds the standard proposal without any read when every address is explicit", async () => {
    const client = { viem: { getPublicClient: vi.fn() }, subgraph: vi.fn() } as unknown as DtfClient;
    const proposal = await buildIndexDtfUpgradeToV6Proposal(client, {
      address: LEGACY.folio,
      chainId: 1,
      spell: SPELL,
      version: "5.0.0",
      proxyAdmin: LEGACY.proxyAdmin,
      governance: LEGACY.governor,
      timelock: LEGACY.timelock,
      description: "Upgrade",
    });

    expect(proposal).toMatchObject({ governance: LEGACY.governor, timelock: LEGACY.timelock, description: "Upgrade" });
    expect(proposal.calldatas).toEqual([...LEGACY.calldatas]);
    expect(client.viem.getPublicClient).not.toHaveBeenCalled();
  });

  it("treats an explicit governor as standard unless its selector registry is passed", async () => {
    const dtf = dtfContext(OPTIMISTIC);
    const standard = await buildIndexDtfUpgradeToV6Proposal(clientWithVersion("5.0.0"), {
      address: OPTIMISTIC.folio,
      chainId: 1,
      spell: SPELL,
      dtf,
      governance: LEGACY.governor,
      timelock: LEGACY.timelock,
    });
    expect(standard.calldatas).toHaveLength(2);

    const optimistic = await buildIndexDtfUpgradeToV6Proposal(clientWithVersion("5.0.0"), {
      address: OPTIMISTIC.folio,
      chainId: 1,
      spell: SPELL,
      dtf,
      governance: OPTIMISTIC.governor,
      timelock: OPTIMISTIC.timelock,
      selectorRegistry: OPTIMISTIC.selectorRegistry,
    });
    expect(optimistic.calldatas).toEqual([...OPTIMISTIC.calldatas]);
  });

  it("requires a selector registry for an indexed optimistic admin and a governance for address authorities", async () => {
    const missingRegistry = buildIndexDtfUpgradeToV6Proposal(clientWithVersion("5.0.0"), {
      address: OPTIMISTIC.folio,
      chainId: 1,
      spell: SPELL,
      dtf: dtfContext({ ...OPTIMISTIC, selectorRegistry: zeroAddress }),
    });
    await expect(missingRegistry).rejects.toThrow("selectorRegistry is required");

    const addressAuthority = {
      roles: { deployment: { proxyAdmin: LEGACY.proxyAdmin } },
      governance: { admin: { primary: { type: "address", address: LEGACY.governor } } },
    } as unknown as IndexDtf;
    await expect(
      buildIndexDtfUpgradeToV6Proposal(clientWithVersion("5.0.0"), {
        address: LEGACY.folio,
        chainId: 1,
        spell: SPELL,
        dtf: addressAuthority,
      }),
    ).rejects.toThrow("governance is required");
  });
});
