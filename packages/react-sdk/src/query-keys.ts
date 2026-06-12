import type {
  BuildIndexDtfBasketProposalParams,
  BuildIndexDtfBasketSettingsProposalParams,
  BuildIndexDtfDaoSettingsProposalParams,
  BuildIndexDtfSettingsProposalParams,
  DtfParams,
  GetDiscoverDtfsOptions,
  GetIndexDtfParams,
  GetIndexDtfBasketParams,
  DecodeIndexDtfProposalParams,
  GetIndexDtfDelegatesParams,
  GetIndexDtfGuardiansParams,
  GetIndexDtfPriceHistoryParams,
  GetIndexDtfPriceParams,
  GetIndexDtfVersionParams,
  GetIndexDtfOptimisticProposalVoterStateParams,
  GetIndexDtfProposalParams,
  GetIndexDtfProposalVoterStateParams,
  GetIndexDtfProposalVotingSnapshotParams,
  GetIndexDtfProposalVotesParams,
  GetIndexDtfProposalsParams,
  GetIndexDtfProposerStateParams,
  GetIndexDtfVoterStateParams,
  IndexDtf,
  ListIndexDtfsParams,
} from "@reserve-protocol/sdk";

import { getIndexDtfProposalGovernanceAddresses } from "@reserve-protocol/sdk";

import { normalizeQueryKeyValue } from "@/normalize-query-key";

const defaultKey = "default";

import type { IndexMethodParams, PortfolioMethodParams } from "@/sdk-methods";

type PastOptimisticVotesQueryKeyParams = Omit<IndexMethodParams<"getPastOptimisticVotes">, "timepoint"> & {
  readonly timepoint: bigint;
};

function keyParams(params: unknown): unknown {
  return params === undefined ? defaultKey : normalizeQueryKeyValue(params);
}

function indexDtfProposalsKeyParams(params: GetIndexDtfProposalsParams | undefined): unknown {
  if (!params) {
    return params;
  }

  if ("dtf" in params && params.dtf) {
    return {
      dtf: {
        address: params.dtf.id,
        chainId: params.dtf.chainId,
        governanceAddresses: sortedAddressSet(getIndexDtfProposalGovernanceAddresses(params.dtf)),
      },
      limit: params.limit,
    };
  }

  if ("governanceAddresses" in params && params.governanceAddresses) {
    return {
      ...params,
      governanceAddresses: sortedAddressSet(params.governanceAddresses),
    };
  }

  return params;
}

function indexDtfGuardiansKeyParams(params: GetIndexDtfGuardiansParams | undefined): unknown {
  if (!params) {
    return params;
  }

  if ("dtf" in params) {
    return {
      dtf: {
        address: params.dtf.id,
        chainId: params.dtf.chainId,
        guardians: getGuardianKeyAddresses(params.dtf),
      },
    };
  }

  return params;
}

function proposalVoterStateKeyParams(params: GetIndexDtfProposalVoterStateParams | undefined): unknown {
  if (!params) {
    return params;
  }

  const vote = params.proposal.votes.find(
    (proposalVote) => proposalVote.voter.toLowerCase() === params.account.toLowerCase(),
  );

  return {
    account: params.account,
    chainId: params.chainId,
    governance: params.governance,
    proposal: {
      id: params.proposal.id,
      isOptimistic: params.proposal.isOptimistic === true,
      optimisticSnapshot: params.proposal.optimistic?.snapshot ?? null,
      vote: vote?.choice ?? null,
      voteStart: params.proposal.voteStart,
      voteToken: params.proposal.optimistic?.voteToken ?? params.proposal.voteToken,
    },
  };
}

function optimisticProposalVoterStateKeyParams(
  params: GetIndexDtfOptimisticProposalVoterStateParams | undefined,
): unknown {
  if (!params) {
    return params;
  }

  const vote = params.proposal.votes.find(
    (proposalVote) => proposalVote.voter.toLowerCase() === params.account.toLowerCase(),
  );

  return {
    account: params.account,
    chainId: params.chainId,
    governance: params.governance,
    proposal: {
      id: params.proposal.id,
      optimisticSnapshot: params.proposal.optimistic?.snapshot ?? null,
      vote: vote?.choice ?? null,
      voteStart: params.proposal.voteStart,
      voteToken: params.proposal.optimistic?.voteToken ?? params.proposal.voteToken,
    },
  };
}

function selectorRegistryIsAllowedKeyParams(
  params: IndexMethodParams<"getSelectorRegistryIsAllowed"> | undefined,
): unknown {
  if (!params) {
    return params;
  }

  return {
    ...params,
    selector: params.selector.toLowerCase(),
  };
}

function sortedAddressSet(addresses: string | readonly string[]): readonly string[] {
  const values = Array.isArray(addresses) ? addresses : [addresses];

  return [...new Set(values.map((address) => address.toLowerCase()))].sort();
}

function getGuardianKeyAddresses(dtf: IndexDtf): readonly string[] {
  return sortedAddressSet([
    ...getAuthorityKeyAddresses(dtf.governance.admin.primary),
    ...getAuthorityKeyAddresses(dtf.governance.rebalance.primary),
    ...getAuthorityKeyAddresses(dtf.governance.voteLock),
  ]);
}

function getAuthorityKeyAddresses(authority: IndexDtf["governance"]["admin"]["primary"]): readonly string[] {
  if (!authority) {
    return [];
  }

  if (authority.type === "address") {
    return [authority.address];
  }

  return [authority.address, authority.governance.timelock.address, ...authority.governance.timelock.guardians];
}

export const dtfQueryKeys = {
  all: ["dtf"] as const,
  discover: (params?: GetDiscoverDtfsOptions) => [...dtfQueryKeys.all, "discover", keyParams(params)] as const,
  index: {
    all: () => [...dtfQueryKeys.all, "index"] as const,
    list: (params?: ListIndexDtfsParams) => [...dtfQueryKeys.index.all(), "list", keyParams(params)] as const,
    dtf: (params?: GetIndexDtfParams) => [...dtfQueryKeys.index.all(), "dtf", keyParams(params)] as const,
    full: (params?: GetIndexDtfParams) => [...dtfQueryKeys.index.all(), "full", keyParams(params)] as const,
    basket: (params?: GetIndexDtfBasketParams) => [...dtfQueryKeys.index.all(), "basket", keyParams(params)] as const,
    version: (params?: GetIndexDtfVersionParams) =>
      [...dtfQueryKeys.index.all(), "version", keyParams(params)] as const,
    brand: (params?: DtfParams) => [...dtfQueryKeys.index.all(), "brand", keyParams(params)] as const,
    price: (params?: GetIndexDtfPriceParams) => [...dtfQueryKeys.index.all(), "price", keyParams(params)] as const,
    priceHistory: (params?: GetIndexDtfPriceHistoryParams) =>
      [...dtfQueryKeys.index.all(), "price-history", keyParams(params)] as const,
    status: (params?: IndexMethodParams<"getStatus">) =>
      [...dtfQueryKeys.index.all(), "status", keyParams(params)] as const,
    exposure: (params?: IndexMethodParams<"getExposure">) =>
      [...dtfQueryKeys.index.all(), "exposure", keyParams(params)] as const,
    transactions: (params?: IndexMethodParams<"getTransactions">) =>
      [...dtfQueryKeys.index.all(), "transactions", keyParams(params)] as const,
    revenue: (params?: IndexMethodParams<"getRevenue">) =>
      [...dtfQueryKeys.index.all(), "revenue", keyParams(params)] as const,
    platformFee: (params?: IndexMethodParams<"getPlatformFee">) =>
      [...dtfQueryKeys.index.all(), "platform-fee", keyParams(params)] as const,
    pendingFeeShares: (params?: IndexMethodParams<"getPendingFeeShares">) =>
      [...dtfQueryKeys.index.all(), "pending-fee-shares", keyParams(params)] as const,
    approvedRevenueTokens: (params?: IndexMethodParams<"getApprovedRevenueTokens">) =>
      [...dtfQueryKeys.index.all(), "approved-revenue-tokens", keyParams(params)] as const,
    issuanceState: (params?: IndexMethodParams<"getIssuanceState">) =>
      [...dtfQueryKeys.index.all(), "issuance-state", keyParams(params)] as const,
    rebalances: (params?: IndexMethodParams<"getRebalances">) =>
      [...dtfQueryKeys.index.all(), "rebalances", keyParams(params)] as const,
    currentRebalance: (params?: IndexMethodParams<"getCurrentRebalance">) =>
      [...dtfQueryKeys.index.all(), "current-rebalance", keyParams(params)] as const,
    rebalanceAuctions: (params?: IndexMethodParams<"getRebalanceAuctions">) =>
      [...dtfQueryKeys.index.all(), "rebalance-auctions", keyParams(params)] as const,
    completedRebalance: (params?: IndexMethodParams<"getCompletedRebalance">) =>
      [...dtfQueryKeys.index.all(), "completed-rebalance", keyParams(params)] as const,
    completedRebalances: (params?: IndexMethodParams<"getCompletedRebalances">) =>
      [...dtfQueryKeys.index.all(), "completed-rebalances", keyParams(params)] as const,
    voteLockState: (params?: IndexMethodParams<"getVoteLockState">) =>
      [...dtfQueryKeys.index.all(), "vote-lock-state", keyParams(params)] as const,
    voteLockVaultState: (params?: IndexMethodParams<"getVoteLockVaultState">) =>
      [...dtfQueryKeys.index.all(), "vote-lock-vault-state", keyParams(params)] as const,
    governance: {
      all: () => [...dtfQueryKeys.index.all(), "governance"] as const,
      proposalList: (params?: GetIndexDtfProposalsParams) =>
        [
          ...dtfQueryKeys.index.governance.all(),
          "proposal-list",
          keyParams(indexDtfProposalsKeyParams(params)),
        ] as const,
      proposals: (params?: GetIndexDtfProposalsParams) => dtfQueryKeys.index.governance.proposalList(params),
      proposal: (params?: GetIndexDtfProposalParams) =>
        [...dtfQueryKeys.index.governance.all(), "proposal", keyParams(params)] as const,
      proposalDecode: (params?: DecodeIndexDtfProposalParams) =>
        [...dtfQueryKeys.index.governance.all(), "proposal-decode", keyParams(params)] as const,
      proposalVotingSnapshot: (params?: GetIndexDtfProposalVotingSnapshotParams) =>
        [...dtfQueryKeys.index.governance.all(), "proposal-voting-snapshot", keyParams(params)] as const,
      optimisticGovernance: (params?: IndexMethodParams<"getOptimisticGovernance">) =>
        [...dtfQueryKeys.index.governance.all(), "optimistic-governance", keyParams(params)] as const,
      optimisticProposalContext: (params?: IndexMethodParams<"getOptimisticProposalContext">) =>
        [...dtfQueryKeys.index.governance.all(), "optimistic-proposal-context", keyParams(params)] as const,
      optimisticTimelockRoles: (params?: IndexMethodParams<"getOptimisticTimelockRoles">) =>
        [...dtfQueryKeys.index.governance.all(), "optimistic-timelock-roles", keyParams(params)] as const,
      optimisticVotes: (params?: IndexMethodParams<"getOptimisticVotes">) =>
        [...dtfQueryKeys.index.governance.all(), "optimistic-votes", keyParams(params)] as const,
      pastOptimisticVotes: (params?: PastOptimisticVotesQueryKeyParams) =>
        [...dtfQueryKeys.index.governance.all(), "past-optimistic-votes", keyParams(params)] as const,
      proposalThrottleCharges: (params?: IndexMethodParams<"getProposalThrottleCharges">) =>
        [...dtfQueryKeys.index.governance.all(), "proposal-throttle-charges", keyParams(params)] as const,
      selectorRegistryTargets: (params?: IndexMethodParams<"getSelectorRegistryTargets">) =>
        [...dtfQueryKeys.index.governance.all(), "selector-registry-targets", keyParams(params)] as const,
      selectorRegistryAllowedSelectors: (params?: IndexMethodParams<"getSelectorRegistryAllowedSelectors">) =>
        [...dtfQueryKeys.index.governance.all(), "selector-registry-allowed-selectors", keyParams(params)] as const,
      selectorRegistryIsAllowed: (params?: IndexMethodParams<"getSelectorRegistryIsAllowed">) =>
        [
          ...dtfQueryKeys.index.governance.all(),
          "selector-registry-is-allowed",
          keyParams(selectorRegistryIsAllowedKeyParams(params)),
        ] as const,
      buildBasketProposal: (params?: BuildIndexDtfBasketProposalParams) =>
        [...dtfQueryKeys.index.governance.all(), "build-basket-proposal", keyParams(params)] as const,
      buildBasketSettingsProposal: (params?: BuildIndexDtfBasketSettingsProposalParams) =>
        [...dtfQueryKeys.index.governance.all(), "build-basket-settings-proposal", keyParams(params)] as const,
      buildDaoSettingsProposal: (params?: BuildIndexDtfDaoSettingsProposalParams) =>
        [...dtfQueryKeys.index.governance.all(), "build-dao-settings-proposal", keyParams(params)] as const,
      buildSettingsProposal: (params?: BuildIndexDtfSettingsProposalParams) =>
        [...dtfQueryKeys.index.governance.all(), "build-settings-proposal", keyParams(params)] as const,
      delegates: (params?: GetIndexDtfDelegatesParams) =>
        [...dtfQueryKeys.index.governance.all(), "delegates", keyParams(params)] as const,
      guardians: (params?: GetIndexDtfGuardiansParams) =>
        [...dtfQueryKeys.index.governance.all(), "guardians", keyParams(indexDtfGuardiansKeyParams(params))] as const,
      voterState: (params?: GetIndexDtfVoterStateParams) =>
        [...dtfQueryKeys.index.governance.all(), "voter-state", keyParams(params)] as const,
      proposerState: (params?: GetIndexDtfProposerStateParams) =>
        [...dtfQueryKeys.index.governance.all(), "proposer-state", keyParams(params)] as const,
      proposalVotes: (params?: GetIndexDtfProposalVotesParams) =>
        [...dtfQueryKeys.index.governance.all(), "proposal-votes", keyParams(params)] as const,
      proposalVoterState: (params?: GetIndexDtfProposalVoterStateParams) =>
        [
          ...dtfQueryKeys.index.governance.all(),
          "proposal-voter-state",
          keyParams(proposalVoterStateKeyParams(params)),
        ] as const,
      optimisticProposalVoterState: (params?: GetIndexDtfOptimisticProposalVoterStateParams) =>
        [
          ...dtfQueryKeys.index.governance.all(),
          "optimistic-proposal-voter-state",
          keyParams(optimisticProposalVoterStateKeyParams(params)),
        ] as const,
    },
  },
  portfolio: {
    all: () => [...dtfQueryKeys.all, "portfolio"] as const,
    account: (params?: PortfolioMethodParams<"get">) =>
      [...dtfQueryKeys.portfolio.all(), "account", keyParams(params)] as const,
    history: (params?: PortfolioMethodParams<"getHistory">) =>
      [...dtfQueryKeys.portfolio.all(), "history", keyParams(params)] as const,
    transactions: (params?: PortfolioMethodParams<"getTransactions">) =>
      [...dtfQueryKeys.portfolio.all(), "transactions", keyParams(params)] as const,
  },
} as const;
