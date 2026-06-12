import { describe, expect, it } from "vitest";

import type { IndexDtfProposalDetail, IndexDtfProposalVotingSnapshot } from "@/types/governance";

import { mergeProposalVotingSnapshot } from "@/index-dtf/governance/proposals";

const amount = (value: bigint) => ({ raw: value, formatted: value.toString() });

const baseProposal = {
  id: "42",
  state: "PENDING",
  voteStart: 100,
  voteEnd: 200,
  quorumVotes: amount(10n),
  forWeightedVotes: amount(0n),
  againstWeightedVotes: amount(0n),
  abstainWeightedVotes: amount(0n),
  votes: [],
  votingState: { state: "PENDING", threshold: 5n, deadline: 50 },
  isOptimistic: false,
} as unknown as IndexDtfProposalDetail;

const snapshot = {
  id: "42",
  state: "ACTIVE",
  voteStart: 100,
  voteEnd: 200,
  quorumVotes: amount(20n),
  forWeightedVotes: amount(7n),
  againstWeightedVotes: amount(1n),
  abstainWeightedVotes: amount(2n),
  votes: [{ voter: "0x0000000000000000000000000000000000000001", choice: "FOR", weight: amount(7n) }],
  votingState: { state: "ACTIVE", threshold: 9n, deadline: 40 },
} as unknown as IndexDtfProposalVotingSnapshot;

describe("mergeProposalVotingSnapshot", () => {
  it("returns the proposal untouched without a snapshot", () => {
    expect(mergeProposalVotingSnapshot(baseProposal, undefined)).toBe(baseProposal);
  });

  it("overlays snapshot voting data onto the detail", () => {
    const merged = mergeProposalVotingSnapshot(baseProposal, snapshot);

    expect(merged.state).toBe("ACTIVE");
    expect(merged.quorumVotes).toEqual(amount(20n));
    expect(merged.forWeightedVotes).toEqual(amount(7n));
    expect(merged.votes).toHaveLength(1);
    expect(merged.votingState).toEqual(snapshot.votingState);
    // Detail-only fields survive the merge.
    expect(merged.id).toBe("42");
  });

  it("keeps the detail thresholds for optimistic proposals with no votes yet", () => {
    const optimisticProposal = {
      ...baseProposal,
      isOptimistic: true,
      vetoThreshold: 123n,
      optimistic: { vetoThreshold: 123n },
    } as unknown as IndexDtfProposalDetail;
    const emptySnapshot = {
      ...snapshot,
      votes: [],
      vetoThreshold: 1n,
      optimistic: { vetoThreshold: 1n },
    } as unknown as IndexDtfProposalVotingSnapshot;

    const merged = mergeProposalVotingSnapshot(optimisticProposal, emptySnapshot);

    expect(merged.quorumVotes).toEqual(baseProposal.quorumVotes);
    expect(merged.vetoThreshold).toBe(123n);
    expect(merged.optimistic).toEqual({ vetoThreshold: 123n });
    expect(merged.votingState.threshold).toBe(5n);
    // Live tallies still come from the snapshot.
    expect(merged.forWeightedVotes).toEqual(amount(7n));
  });

  it("uses snapshot thresholds for optimistic proposals once votes exist", () => {
    const optimisticProposal = {
      ...baseProposal,
      isOptimistic: true,
      vetoThreshold: 123n,
      optimistic: { vetoThreshold: 123n },
    } as unknown as IndexDtfProposalDetail;
    const votedSnapshot = {
      ...snapshot,
      isOptimistic: true,
      vetoThreshold: 1n,
      optimistic: { vetoThreshold: 1n },
    } as unknown as IndexDtfProposalVotingSnapshot;

    const merged = mergeProposalVotingSnapshot(optimisticProposal, votedSnapshot);

    expect(merged.vetoThreshold).toBe(1n);
    expect(merged.optimistic).toEqual({ vetoThreshold: 1n });
    expect(merged.votingState.threshold).toBe(9n);
  });
});
