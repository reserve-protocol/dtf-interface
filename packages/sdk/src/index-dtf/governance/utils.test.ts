import { describe, expect, it } from "vitest";

import { getProposalState } from "@/index-dtf/governance/utils";

const ENDED_STANDARD_PROPOSAL = {
  state: "ACTIVE",
  voteStart: 100,
  voteEnd: 200,
  forWeightedVotes: { raw: 0n, formatted: "0" },
  againstWeightedVotes: { raw: 0n, formatted: "0" },
  abstainWeightedVotes: { raw: 0n, formatted: "0" },
  quorumVotes: { raw: 100n, formatted: "100" },
} as const;

describe("getProposalState standard vote outcomes", () => {
  it("defeats a tie even when quorum is met", () => {
    expect(
      getProposalState(
        {
          ...ENDED_STANDARD_PROPOSAL,
          forWeightedVotes: { raw: 150n, formatted: "150" },
          againstWeightedVotes: { raw: 150n, formatted: "150" },
        },
        201,
      ),
    ).toMatchObject({ state: "DEFEATED" });
  });

  it("succeeds when for votes are one wei over against votes", () => {
    expect(
      getProposalState(
        {
          ...ENDED_STANDARD_PROPOSAL,
          forWeightedVotes: { raw: 151n, formatted: "151" },
          againstWeightedVotes: { raw: 150n, formatted: "150" },
        },
        201,
      ),
    ).toMatchObject({ state: "SUCCEEDED" });
  });

  it("defeats ended proposals with zero for votes", () => {
    expect(getProposalState(ENDED_STANDARD_PROPOSAL, 201)).toMatchObject({ state: "DEFEATED" });
  });

  it("keeps proposals active at the vote end boundary", () => {
    expect(
      getProposalState(
        {
          ...ENDED_STANDARD_PROPOSAL,
          forWeightedVotes: { raw: 150n, formatted: "150" },
          againstWeightedVotes: { raw: 150n, formatted: "150" },
        },
        200,
      ),
    ).toMatchObject({ state: "ACTIVE" });
  });

  it("marks winning votes under quorum as quorum not reached", () => {
    expect(
      getProposalState(
        {
          ...ENDED_STANDARD_PROPOSAL,
          forWeightedVotes: { raw: 50n, formatted: "50" },
          againstWeightedVotes: { raw: 10n, formatted: "10" },
        },
        201,
      ),
    ).toMatchObject({ state: "QUORUM_NOT_REACHED" });
  });
});

const STALE_PENDING_PROPOSAL = {
  ...ENDED_STANDARD_PROPOSAL,
  state: "PENDING",
} as const;

describe("getProposalState stale PENDING past the deadline", () => {
  it("keeps a stale pending proposal active at the vote end boundary", () => {
    expect(
      getProposalState(
        {
          ...STALE_PENDING_PROPOSAL,
          forWeightedVotes: { raw: 150n, formatted: "150" },
          againstWeightedVotes: { raw: 150n, formatted: "150" },
        },
        200,
      ),
    ).toMatchObject({ state: "ACTIVE" });
  });

  it("succeeds after the deadline when for votes win and quorum is met", () => {
    expect(
      getProposalState(
        {
          ...STALE_PENDING_PROPOSAL,
          forWeightedVotes: { raw: 150n, formatted: "150" },
          againstWeightedVotes: { raw: 10n, formatted: "10" },
        },
        201,
      ),
    ).toMatchObject({ state: "SUCCEEDED" });
  });

  it("defeats a tie after the deadline", () => {
    expect(
      getProposalState(
        {
          ...STALE_PENDING_PROPOSAL,
          forWeightedVotes: { raw: 150n, formatted: "150" },
          againstWeightedVotes: { raw: 150n, formatted: "150" },
        },
        201,
      ),
    ).toMatchObject({ state: "DEFEATED" });
  });

  it("marks winning votes under quorum as quorum not reached after the deadline", () => {
    expect(
      getProposalState(
        {
          ...STALE_PENDING_PROPOSAL,
          forWeightedVotes: { raw: 50n, formatted: "50" },
          againstWeightedVotes: { raw: 10n, formatted: "10" },
        },
        201,
      ),
    ).toMatchObject({ state: "QUORUM_NOT_REACHED" });
  });
});

describe("getProposalState vote token decimals", () => {
  const SIX_DECIMAL_PROPOSAL = {
    state: "ACTIVE",
    voteStart: 100,
    voteEnd: 200,
    voteTokenDecimals: 6,
    forWeightedVotes: { raw: 10000n, formatted: "0.01" },
    againstWeightedVotes: { raw: 0n, formatted: "0" },
    abstainWeightedVotes: { raw: 0n, formatted: "0" },
    quorumVotes: { raw: 30000n, formatted: "0.03" },
  } as const;

  it("formats the quorum threshold in the vote token decimals", () => {
    expect(getProposalState(SIX_DECIMAL_PROPOSAL, 150).threshold).toEqual({
      currentVotes: { raw: 10000n, formatted: "0.01" },
      targetVotes: { raw: 30000n, formatted: "0.03" },
      progress: expect.any(Number),
      reached: false,
      hasTarget: true,
    });
  });

  it("formats the optimistic veto threshold in the vote token decimals", () => {
    const state = getProposalState(
      {
        ...SIX_DECIMAL_PROPOSAL,
        isOptimistic: true,
        vetoThreshold: 50000000000000000n,
        againstWeightedVotes: { raw: 20000n, formatted: "0.02" },
        optimistic: {
          snapshotSupply: { raw: 1000000n, formatted: "1" },
          vetoThreshold: 50000000000000000n,
          vetoThresholdVotes: { raw: 50000n, formatted: "0.05" },
        },
      },
      150,
    );

    expect(state.threshold).toMatchObject({
      currentVotes: { raw: 20000n, formatted: "0.02" },
      targetVotes: { raw: 50000n, formatted: "0.05" },
      hasTarget: true,
    });
  });

  it("keeps 18 decimals when the proposal does not carry vote token decimals", () => {
    const { voteTokenDecimals: _, ...proposal } = SIX_DECIMAL_PROPOSAL;

    expect(getProposalState(proposal, 150).threshold.targetVotes).toEqual({
      raw: 30000n,
      formatted: "0.00000000000003",
    });
  });
});
