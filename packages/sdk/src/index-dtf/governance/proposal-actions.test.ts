import {
  bytesToHex,
  encodeAbiParameters,
  hexToBytes,
  keccak256,
  pad,
  parseAbiParameters,
  toBytes,
  zeroHash,
} from "viem";
import { describe, expect, it } from "vitest";

import {
  hashIndexDtfProposalDescription,
  prepareIndexDtfCancelProposal,
  prepareIndexDtfGovernorCancelProposal,
  prepareIndexDtfQueueProposal,
  prepareIndexDtfSubmitOptimisticProposal,
  prepareIndexDtfSubmitProposal,
  prepareIndexDtfVote,
  prepareIndexDtfVoteWithReason,
  prepareIndexDtfVoteWithReasonAndParams,
} from "@/index-dtf/governance/proposal-actions";

const timelockOperationParams = parseAbiParameters("address[], uint256[], bytes[], bytes32, bytes32");

describe("Index DTF proposal actions", () => {
  it("prepares propose calls from a proposal payload", () => {
    const call = prepareIndexDtfSubmitProposal({
      chainId: 1,
      proposal: {
        governance: "0x0000000000000000000000000000000000000001",
        targets: ["0x0000000000000000000000000000000000000003"],
        calldatas: ["0x1234"],
        description: "Proposal description",
      },
    });

    expect(call.chainId).toBe(1);
    expect(call.to).toBe("0x0000000000000000000000000000000000000001");
    expect(call.value).toBe(0n);
    expect(call.contract.functionName).toBe("propose");
    expect(call.contract.args).toEqual([
      ["0x0000000000000000000000000000000000000003"],
      [0n],
      ["0x1234"],
      "Proposal description",
    ]);
  });

  it("prepares optimistic propose calls from a proposal payload", () => {
    const call = prepareIndexDtfSubmitOptimisticProposal({
      chainId: 8453,
      proposal: {
        governance: "0x0000000000000000000000000000000000000001",
        targets: ["0x0000000000000000000000000000000000000003"],
        calldatas: ["0x1234"],
        description: "Optimistic proposal",
      },
    });

    expect(call.chainId).toBe(8453);
    expect(call.to).toBe("0x0000000000000000000000000000000000000001");
    expect(call.contract.functionName).toBe("proposeOptimistic");
    expect(call.contract.args).toEqual([
      ["0x0000000000000000000000000000000000000003"],
      [0n],
      ["0x1234"],
      "Optimistic proposal",
    ]);
  });

  it("rejects optimistic proposal payloads with mismatched targets and calldatas", () => {
    expect(() =>
      prepareIndexDtfSubmitOptimisticProposal({
        chainId: 8453,
        proposal: {
          governance: "0x0000000000000000000000000000000000000001",
          targets: ["0x0000000000000000000000000000000000000003"],
          calldatas: [],
          description: "Optimistic proposal",
        },
      }),
    ).toThrow("proposal targets and calldatas must have the same length");
  });

  it("prepares vote calls with reason params", () => {
    const reasonCall = prepareIndexDtfVoteWithReason({
      chainId: 1,
      governance: "0x0000000000000000000000000000000000000001",
      proposalId: 42n,
      support: 1,
      reason: "Looks good",
    });
    const paramsCall = prepareIndexDtfVoteWithReasonAndParams({
      chainId: 1,
      governance: "0x0000000000000000000000000000000000000001",
      proposalId: "42",
      support: 0,
      reason: "No",
      voteParams: "0x1234",
    });

    expect(reasonCall.contract.functionName).toBe("castVoteWithReason");
    expect(reasonCall.contract.args).toEqual([42n, 1, "Looks good"]);
    expect(paramsCall.contract.functionName).toBe("castVoteWithReasonAndParams");
    expect(paramsCall.contract.args).toEqual([42n, 0, "No", "0x1234"]);
  });

  it("encodes exact castVote calldata", () => {
    const call = prepareIndexDtfVote({
      chainId: 1,
      governance: "0x0000000000000000000000000000000000000001",
      proposalId: 42n,
      support: 1,
    });

    // castVote(uint256,uint8) selector + padded proposalId + padded support.
    expect(call.data).toBe(
      "0x56781388" +
        "000000000000000000000000000000000000000000000000000000000000002a" +
        "0000000000000000000000000000000000000000000000000000000000000001",
    );
  });

  it("prepares vote calls for very large proposal id strings without precision loss", () => {
    const proposalId = "114143694312255605278636846982278574633125503103201258989783472858643695239364";
    const call = prepareIndexDtfVote({
      chainId: 1,
      governance: "0x0000000000000000000000000000000000000001",
      proposalId,
      support: 1,
    });

    expect(call.contract.args).toEqual([BigInt(proposalId), 1]);
  });

  it("prepares proposal queue and cancel calls with required timelock", () => {
    const proposal = {
      governance: "0x0000000000000000000000000000000000000001",
      timelock: "0x0000000000000000000000000000000000000006",
      timelockId: "0x0000000000000000000000000000000000000000000000000000000000000042",
      targets: ["0x0000000000000000000000000000000000000003"],
      calldatas: ["0x1234"],
      description: "Proposal description",
    } as const;

    const queueCall = prepareIndexDtfQueueProposal({ chainId: 1, proposal });
    const cancelCall = prepareIndexDtfCancelProposal({
      chainId: 1,
      proposal,
    });

    expect(queueCall.chainId).toBe(1);
    expect(queueCall.contract.address).toBe("0x0000000000000000000000000000000000000001");
    expect(queueCall.contract.functionName).toBe("queue");
    expect(queueCall.contract.args).toEqual([
      ["0x0000000000000000000000000000000000000003"],
      [0n],
      ["0x1234"],
      keccak256(toBytes("Proposal description")),
    ]);

    expect(cancelCall.chainId).toBe(1);
    expect(cancelCall.contract.address).toBe("0x0000000000000000000000000000000000000006");
    expect(cancelCall.contract.functionName).toBe("cancel");
    expect(cancelCall.contract.args).toEqual(["0x0000000000000000000000000000000000000000000000000000000000000042"]);
  });

  it("prepares governor cancel calls", () => {
    const proposal = {
      governance: "0x0000000000000000000000000000000000000001",
      targets: ["0x0000000000000000000000000000000000000003"],
      calldatas: ["0x1234"],
      description: "Proposal description",
    } as const;
    const call = prepareIndexDtfGovernorCancelProposal({ chainId: 1, proposal });

    expect(call.contract.address).toBe(proposal.governance);
    expect(call.contract.functionName).toBe("cancel");
    expect(call.contract.args).toEqual([
      proposal.targets,
      [0n],
      proposal.calldatas,
      hashIndexDtfProposalDescription(proposal.description),
    ]);
  });

  it("rejects cancel calls without a timelock", () => {
    expect(() =>
      prepareIndexDtfCancelProposal({
        chainId: 1,
        proposal: {
          governance: "0x0000000000000000000000000000000000000001",
          targets: ["0x0000000000000000000000000000000000000003"],
          calldatas: ["0x1234"],
          description: "Proposal description",
        },
      }),
    ).toThrow("timelock is required to cancel a proposal");
  });

  it("derives a timelock operation id when legacy proposals lack one", () => {
    const proposal = {
      governance: "0x0000000000000000000000000000000000000001",
      timelock: "0x0000000000000000000000000000000000000006",
      targets: ["0x0000000000000000000000000000000000000003", "0x0000000000000000000000000000000000000004"],
      calldatas: ["0x1234", "0x5678"],
      description: "Legacy proposal",
    } as const;

    const call = prepareIndexDtfCancelProposal({
      chainId: 1,
      proposal,
    });

    expect(call.contract.functionName).toBe("cancel");
    expect(call.contract.args).toEqual([getLegacyOperationId(proposal)]);
  });
});

function getLegacyOperationId(proposal: {
  readonly governance: `0x${string}`;
  readonly targets: readonly `0x${string}`[];
  readonly calldatas: readonly `0x${string}`[];
  readonly description: string;
}) {
  return keccak256(
    encodeAbiParameters(timelockOperationParams, [
      proposal.targets,
      [0n, 0n],
      proposal.calldatas,
      zeroHash,
      getTimelockSalt(proposal.governance, proposal.description),
    ]),
  );
}

function getTimelockSalt(governance: `0x${string}`, description: string) {
  const governorBytes = hexToBytes(
    pad(governance.toLowerCase() as `0x${string}`, {
      size: 32,
      dir: "right",
    }),
  );
  const descriptionHashBytes = hexToBytes(keccak256(toBytes(description)));
  const saltBytes = new Uint8Array(32);

  for (let i = 0; i < saltBytes.length; i++) {
    saltBytes[i] = governorBytes[i]! ^ descriptionHashBytes[i]!;
  }

  return bytesToHex(saltBytes);
}
