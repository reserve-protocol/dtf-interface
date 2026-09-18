import { decodeFunctionData } from "viem";
import { describe, expect, it } from "vitest";

import { dtfIndexGovernanceOptimisticAbi } from "@/index-dtf/abis/dtf-index-governance-optimistic";
import { timelockAbi } from "@/index-dtf/abis/timelock";
import { OPTIMISTIC_PROPOSER_ROLE } from "@/index-dtf/governance/optimistic";
import {
  indexDtfV5WriteAbi,
  indexDtfV6WriteAbi,
  prepareIndexDtfAddToAllowlist,
  prepareIndexDtfDeprecate,
  prepareIndexDtfRemoveFromAllowlist,
  prepareIndexDtfSetSelfFee,
  prepareIndexDtfSetTradeAllowlistEnabled,
  prepareIndexDtfRelay,
  prepareIndexDtfRevokeOptimisticProposer,
  prepareIndexDtfSetAuctionLength,
  prepareIndexDtfSetFeeRecipients,
  prepareIndexDtfSetLateQuorumVoteExtension,
  prepareIndexDtfSetMandate,
  prepareIndexDtfSetOptimisticParams,
  prepareIndexDtfSetProposalThrottle,
  prepareIndexDtfTimelockDelay,
  prepareIndexDtfTimelockExecuteBatch,
  prepareIndexDtfTimelockGrantRole,
  prepareIndexDtfUpdateTimelock,
} from "@/index-dtf/governance/propose/calls";

const DTF = "0x0000000000000000000000000000000000000001";
const ACCOUNT = "0x0000000000000000000000000000000000000002";
const IMMUTABLE_ACCOUNT = "0x0000000000000000000000000000000000000003";

describe("Index DTF call builders", () => {
  it("encodes simple setter calls", () => {
    const mandateCall = prepareIndexDtfSetMandate({
      address: DTF,
      chainId: 1,
      mandate: "New mandate",
      version: "5.0.0",
    });

    expect(mandateCall.to).toBe(DTF);
    expect(decodeFunctionData({ abi: indexDtfV5WriteAbi, data: mandateCall.data })).toMatchObject({
      functionName: "setMandate",
      args: ["New mandate"],
    });
  });

  it("encodes v5 version-sensitive call names", () => {
    const oldCall = prepareIndexDtfSetAuctionLength({
      address: DTF,
      chainId: 1,
      auctionLength: 1800,
      version: "5.0.0",
    });

    expect(decodeFunctionData({ abi: indexDtfV5WriteAbi, data: oldCall.data }).functionName).toBe("setAuctionLength");
  });

  it("encodes unchanged v5 call interfaces", () => {
    const oldCall = prepareIndexDtfSetFeeRecipients({
      address: DTF,
      chainId: 1,
      version: "5.0.0",
      recipients: [{ recipient: ACCOUNT, portion: 1n }],
    });

    expect(decodeFunctionData({ abi: indexDtfV5WriteAbi, data: oldCall.data }).functionName).toBe("setFeeRecipients");
  });

  it("encodes v6 version-sensitive call names", () => {
    const newCall = prepareIndexDtfSetAuctionLength({
      address: DTF,
      chainId: 1,
      auctionLength: 1800,
      version: "6.0.0",
    });

    expect(decodeFunctionData({ abi: indexDtfV6WriteAbi, data: newCall.data }).functionName).toBe(
      "setMaxAuctionLength",
    );
  });

  it("encodes v6 mutable and immutable fee recipient tables", () => {
    const call = prepareIndexDtfSetFeeRecipients({
      address: DTF,
      chainId: 1,
      version: "6.0.0",
      recipients: [{ recipient: ACCOUNT, portion: 600000000000000000n }],
      immutableRecipients: [{ recipient: IMMUTABLE_ACCOUNT, portion: 400000000000000000n }],
    });
    const decoded = decodeFunctionData({ abi: indexDtfV6WriteAbi, data: call.data });

    expect(decoded.functionName).toBe("setFeeRecipients");
    expect(decoded.args).toEqual([
      [{ recipient: ACCOUNT, portion: 600000000000000000n }],
      [{ recipient: IMMUTABLE_ACCOUNT, portion: 400000000000000000n }],
    ]);
  });

  it("sorts v6 fee tables and rejects tables that do not total 100%", () => {
    const call = prepareIndexDtfSetFeeRecipients({
      address: DTF,
      chainId: 1,
      version: "6.0.0",
      recipients: [
        { recipient: IMMUTABLE_ACCOUNT, portion: 300000000000000000n },
        { recipient: ACCOUNT, portion: 300000000000000000n },
      ],
      immutableRecipients: [{ recipient: "0x0000000000000000000000000000000000000004", portion: 400000000000000000n }],
    });
    expect(decodeFunctionData({ abi: indexDtfV6WriteAbi, data: call.data }).args).toEqual([
      [
        { recipient: ACCOUNT, portion: 300000000000000000n },
        { recipient: IMMUTABLE_ACCOUNT, portion: 300000000000000000n },
      ],
      [{ recipient: "0x0000000000000000000000000000000000000004", portion: 400000000000000000n }],
    ]);
    expect(() =>
      prepareIndexDtfSetFeeRecipients({
        address: DTF,
        chainId: 1,
        version: "6.0.0",
        recipients: [{ recipient: DTF, portion: 1000000000000000000n }],
        immutableRecipients: [],
      }),
    ).toThrow("not the Folio itself");
    expect(() =>
      prepareIndexDtfSetFeeRecipients({
        address: DTF,
        chainId: 1,
        version: "6.0.0",
        recipients: [{ recipient: ACCOUNT, portion: 600000000000000000n }],
        immutableRecipients: [{ recipient: IMMUTABLE_ACCOUNT, portion: 300000000000000000n }],
      }),
    ).toThrow("must total 100%");
  });

  it("encodes v6 self-fee and allowlist calls and rejects them on v5", () => {
    const selfFee = prepareIndexDtfSetSelfFee({ address: DTF, chainId: 1, version: "6.0.0", percentage: 5 });
    const enable = prepareIndexDtfSetTradeAllowlistEnabled({
      address: DTF,
      chainId: 1,
      version: "6.0.0",
      enabled: true,
    });
    const add = prepareIndexDtfAddToAllowlist({ address: DTF, chainId: 1, version: "6.0.0", tokens: [ACCOUNT] });
    const remove = prepareIndexDtfRemoveFromAllowlist({
      address: DTF,
      chainId: 1,
      version: "6.0.0",
      tokens: [ACCOUNT],
    });

    expect(
      [selfFee, enable, add, remove].map((call) => decodeFunctionData({ abi: indexDtfV6WriteAbi, data: call.data })),
    ).toEqual([
      { functionName: "setFolioSelfFee", args: [50000000000000000n] },
      { functionName: "setTradeAllowlistEnabled", args: [true] },
      { functionName: "addToAllowlist", args: [[ACCOUNT]] },
      { functionName: "removeFromAllowlist", args: [[ACCOUNT]] },
    ]);
    expect([selfFee, enable, add, remove].every((call) => call.to === DTF && call.value === 0n)).toBe(true);
    expect(() => prepareIndexDtfSetSelfFee({ address: DTF, chainId: 1, version: "6.0.0", percentage: 101 })).toThrow(
      "between 0 and 100",
    );
    expect(() => prepareIndexDtfSetSelfFee({ address: DTF, chainId: 1, version: "5.0.0", percentage: 5 })).toThrow(
      "setFolioSelfFee is not supported by Index DTF 5.0.0",
    );
    expect(() =>
      prepareIndexDtfAddToAllowlist({ address: DTF, chainId: 1, version: "5.0.0", tokens: [ACCOUNT] }),
    ).toThrow("addToAllowlist is not supported by Index DTF 5.0.0");
  });

  it("requires the immutable fee recipient table for v6", () => {
    expect(() =>
      prepareIndexDtfSetFeeRecipients({
        address: DTF,
        chainId: 1,
        version: "6.0.0",
        recipients: [{ recipient: ACCOUNT, portion: 1n }],
      }),
    ).toThrow("immutableRecipients is required");
  });

  it("keeps unchanged no-arg calls available on older versions", () => {
    const call = prepareIndexDtfDeprecate({
      address: DTF,
      chainId: 1,
      version: "5.0.0",
    });

    expect(decodeFunctionData({ abi: indexDtfV5WriteAbi, data: call.data }).functionName).toBe("deprecateFolio");
  });

  it("encodes optimistic governance settings calls", () => {
    const governance = "0x0000000000000000000000000000000000000003";
    const paramsCall = prepareIndexDtfSetOptimisticParams({
      chainId: 1,
      governance,
      vetoDelay: 60n,
      vetoPeriod: 86_400,
      vetoThreshold: 500000000000000000n,
    });
    const throttleCall = prepareIndexDtfSetProposalThrottle({
      chainId: 1,
      governance,
      capacity: 1000000000000000000n,
    });
    const extensionCall = prepareIndexDtfSetLateQuorumVoteExtension({
      chainId: 1,
      governance,
      extension: 600,
    });

    expect(
      decodeFunctionData({
        abi: dtfIndexGovernanceOptimisticAbi,
        data: paramsCall.data,
      }),
    ).toMatchObject({
      functionName: "setOptimisticParams",
      args: [
        {
          vetoDelay: 60,
          vetoPeriod: 86_400,
          vetoThreshold: 500000000000000000n,
        },
      ],
    });
    expect(
      decodeFunctionData({
        abi: dtfIndexGovernanceOptimisticAbi,
        data: throttleCall.data,
      }),
    ).toMatchObject({
      functionName: "setProposalThrottle",
      args: [1000000000000000000n],
    });
    expect(
      decodeFunctionData({
        abi: dtfIndexGovernanceOptimisticAbi,
        data: extensionCall.data,
      }),
    ).toMatchObject({
      functionName: "setLateQuorumVoteExtension",
      args: [600],
    });
  });

  it("encodes optimistic proposer role revocation", () => {
    const timelock = "0x0000000000000000000000000000000000000004";
    const call = prepareIndexDtfRevokeOptimisticProposer({
      chainId: 1,
      timelock,
      proposer: ACCOUNT,
    });

    expect(call.to).toBe(timelock);
    expect(decodeFunctionData({ abi: timelockAbi, data: call.data })).toMatchObject({
      functionName: "revokeRole",
      args: [OPTIMISTIC_PROPOSER_ROLE, ACCOUNT],
    });
  });

  it("encodes governor and timelock utility calls", () => {
    const governance = "0x0000000000000000000000000000000000000003";
    const timelock = "0x0000000000000000000000000000000000000004";
    const updateTimelock = prepareIndexDtfUpdateTimelock({ chainId: 1, governance, timelock });
    const relay = prepareIndexDtfRelay({ chainId: 1, governance, target: DTF, data: "0x1234" });
    const delay = prepareIndexDtfTimelockDelay({ chainId: 1, timelock, delay: 86_400 });
    const grant = prepareIndexDtfTimelockGrantRole({
      chainId: 1,
      timelock,
      role: OPTIMISTIC_PROPOSER_ROLE,
      account: ACCOUNT,
    });
    const batch = prepareIndexDtfTimelockExecuteBatch({
      chainId: 1,
      timelock,
      targets: [DTF],
      calldatas: ["0x1234"],
    });

    expect(updateTimelock.contract.functionName).toBe("updateTimelock");
    expect(updateTimelock.contract.args).toEqual([timelock]);
    expect(relay.contract.functionName).toBe("relay");
    expect(relay.contract.args).toEqual([DTF, 0n, "0x1234"]);
    expect(delay.contract.functionName).toBe("updateDelay");
    expect(delay.contract.args).toEqual([86_400n]);
    expect(grant.contract.functionName).toBe("grantRole");
    expect(grant.contract.args).toEqual([OPTIMISTIC_PROPOSER_ROLE, ACCOUNT]);
    expect(batch.contract.functionName).toBe("executeBatch");
    expect(batch.contract.args[0]).toEqual([DTF]);
    expect(batch.contract.args[1]).toEqual([0n]);
  });
});

describe("settings builders reject unsupported write versions", () => {
  it.each(["4.0.0", "5.1.0", undefined])("setAuctionLength / setFeeRecipients reject %s", (version) => {
    const base = { address: "0x0000000000000000000000000000000000000001", chainId: 1 } as const;
    expect(() =>
      prepareIndexDtfSetAuctionLength({ ...base, version: version as never, auctionLength: 1800n } as never),
    ).toThrow(/Unsupported Index DTF version/);
    expect(() =>
      prepareIndexDtfSetFeeRecipients({ ...base, version: version as never, recipients: [] } as never),
    ).toThrow(/Unsupported Index DTF version/);
  });
});
