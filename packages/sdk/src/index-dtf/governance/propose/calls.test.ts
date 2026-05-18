import { decodeFunctionData } from "viem";
import { describe, expect, it } from "vitest";

import { dtfIndexGovernanceOptimisticAbi } from "@/index-dtf/abis/dtf-index-governance-optimistic";
import { timelockAbi } from "@/index-dtf/abis/timelock";
import { OPTIMISTIC_PROPOSER_ROLE } from "@/index-dtf/governance/optimistic";
import {
  indexDtfV5WriteAbi,
  indexDtfV6WriteAbi,
  prepareIndexDtfDeprecate,
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
