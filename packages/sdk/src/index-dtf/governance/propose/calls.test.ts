import { decodeFunctionData } from "viem";
import { describe, expect, it } from "vitest";

import {
  indexDtfV5WriteAbi,
  prepareIndexDtfDeprecate,
  prepareIndexDtfRevokeOptimisticProposer,
  prepareIndexDtfSetAuctionLength,
  prepareIndexDtfSetFeeRecipients,
  prepareIndexDtfSetLateQuorumVoteExtension,
  prepareIndexDtfSetMandate,
  prepareIndexDtfSetOptimisticParams,
  prepareIndexDtfSetProposalThrottle,
} from "@/index-dtf/governance/propose/calls";
import { dtfIndexGovernanceOptimisticAbi } from "@/index-dtf/abis/dtf-index-governance-optimistic";
import { timelockAbi } from "@/index-dtf/abis/timelock";
import { OPTIMISTIC_PROPOSER_ROLE } from "@/index-dtf/governance/optimistic";

const DTF = "0x0000000000000000000000000000000000000001";
const ACCOUNT = "0x0000000000000000000000000000000000000002";

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

  it("rejects non-v5 call builder versions", () => {
    expect(() =>
      prepareIndexDtfSetAuctionLength({
        address: DTF,
        chainId: 1,
        auctionLength: 1800,
        version: "6.0.0" as never,
      }),
    ).toThrow("v5 only");
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
});
