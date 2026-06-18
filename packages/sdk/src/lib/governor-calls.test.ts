import { describe, expect, it } from "vitest";

import {
  hashProposalDescription,
  prepareGovernorCancel,
  prepareGovernorExecute,
  prepareGovernorPropose,
  prepareGovernorQueue,
  prepareGovernorVote,
} from "@/lib/governor-calls";

const GOVERNOR = "0x1111111111111111111111111111111111111111";
const TARGET = "0x2222222222222222222222222222222222222222";

const proposal = {
  governor: GOVERNOR,
  targets: [TARGET],
  calldatas: ["0x1234"],
  description: "Test proposal",
} as const;

describe("shared governor calls", () => {
  it("encodes exact castVote calldata (same as the index fixture)", () => {
    const call = prepareGovernorVote({ chainId: 1, governor: GOVERNOR, proposalId: 42n, support: 1 });

    expect(call.data).toBe(
      "0x56781388" +
        "000000000000000000000000000000000000000000000000000000000000002a" +
        "0000000000000000000000000000000000000000000000000000000000000001",
    );
  });

  it("accepts very large proposal id strings without precision loss", () => {
    const proposalId = "114143694312255605278636846982278574633125503103201258989783472858643695239364";
    const call = prepareGovernorVote({ chainId: 1, governor: GOVERNOR, proposalId, support: 0 });

    expect(call.contract.args[0]).toBe(BigInt(proposalId));
  });

  it("encodes propose with zero values and the literal description", () => {
    const call = prepareGovernorPropose({ chainId: 1, proposal });

    expect(call.data.startsWith("0x7d5e81e2")).toBe(true);
    expect(call.contract.args).toEqual([[TARGET], [0n], ["0x1234"], "Test proposal"]);
  });

  it("encodes queue/execute/cancel against the description hash", () => {
    const descriptionHash = hashProposalDescription(proposal.description);
    const queue = prepareGovernorQueue({ chainId: 1, proposal });
    const execute = prepareGovernorExecute({ chainId: 1, proposal });
    const cancel = prepareGovernorCancel({ chainId: 1, proposal });

    expect(queue.data.startsWith("0x160cbed7")).toBe(true);
    expect(execute.data.startsWith("0x2656227d")).toBe(true);
    expect(cancel.data.startsWith("0x452115d6")).toBe(true);
    for (const call of [queue, execute, cancel]) {
      expect(call.contract.args).toEqual([[TARGET], [0n], ["0x1234"], descriptionHash]);
      expect(call.to).toBe(GOVERNOR);
    }
  });

  it("rejects invalid vote support values", () => {
    expect(() => prepareGovernorVote({ chainId: 1, governor: GOVERNOR, proposalId: 42n, support: 3 })).toThrow(
      "support must be 0, 1, or 2",
    );
  });

  it("rejects proposal payloads with mismatched targets and calldatas", () => {
    const invalid = { ...proposal, calldatas: [] };

    expect(() => prepareGovernorPropose({ chainId: 1, proposal: invalid })).toThrow(
      "proposal targets and calldatas must have the same length",
    );
    expect(() => prepareGovernorQueue({ chainId: 1, proposal: invalid })).toThrow(
      "proposal targets and calldatas must have the same length",
    );
  });
});
