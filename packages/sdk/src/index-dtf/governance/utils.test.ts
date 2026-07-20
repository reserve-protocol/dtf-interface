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
