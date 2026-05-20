import type { DtfClient } from "@/client";
import type {
  BuildIndexDtfBasketProposalParams,
  BuildIndexDtfBasketSettingsProposalParams,
  BuildIndexDtfDaoSettingsProposalParams,
  BuildIndexDtfSettingsProposalParams,
} from "@/index-dtf/governance/propose/index";
import type {
  GetAllIndexDtfProposalsParams,
  GetIndexDtfDelegatesParams,
  GetIndexDtfGuardiansParams,
  GetIndexDtfLegacyVoteLocksParams,
  GetIndexDtfOptimisticGovernanceParams,
  GetIndexDtfOptimisticProposalContextParams,
  GetIndexDtfOptimisticProposalVoterStateParams,
  GetIndexDtfProposalParams,
  GetIndexDtfProposalThrottleChargesParams,
  GetIndexDtfProposalVoterStateParams,
  GetIndexDtfProposalVotesParams,
  GetIndexDtfProposalsParams,
  GetIndexDtfProposerStateParams,
  GetIndexDtfVoterStateParams,
} from "@/types/governance";

import {
  getAllProposals,
  getDelegates,
  getGuardians,
  getLegacyVoteLocks,
  getOptimisticGovernance,
  getOptimisticProposalContext,
  getOptimisticProposalVoterState,
  getOptimisticTimelockRoles,
  getOptimisticVotes,
  getPastOptimisticVotes,
  getProposal,
  getProposalList,
  getProposalThrottleCharges,
  getProposalVoterState,
  getProposalVotes,
  getProposals,
  getProposerState,
  getVoterState,
  prepareIndexDtfCancelProposal,
  prepareIndexDtfExecuteProposal,
  prepareIndexDtfGovernorCancelProposal,
  prepareIndexDtfQueueProposal,
  prepareIndexDtfSubmitOptimisticProposal,
  prepareIndexDtfSubmitProposal,
  prepareIndexDtfVote,
  prepareIndexDtfVoteWithReason,
  prepareIndexDtfVoteWithReasonAndParams,
  getSelectorRegistryAllowedSelectors,
  getSelectorRegistryIsAllowed,
  getSelectorRegistryTargets,
  prepareSelectorRegistryRegisterSelectors,
  prepareSelectorRegistryUnregisterSelectors,
} from "@/index-dtf/governance/index";
import {
  prepareIndexDtfRelay,
  prepareIndexDtfTimelockDelay,
  prepareIndexDtfTimelockExecuteBatch,
  prepareIndexDtfTimelockGrantRole,
  prepareIndexDtfTimelockRevokeRole,
  prepareIndexDtfUpdateTimelock,
} from "@/index-dtf/governance/propose/calls";
import {
  buildIndexDtfBasketProposal,
  buildIndexDtfBasketSettingsProposal,
  buildIndexDtfDaoSettingsProposal,
  buildIndexDtfSettingsProposal,
} from "@/index-dtf/governance/propose/index";

/** Creates the direct Index DTF governance methods for the flat root namespace. */
export function createIndexDtfGovernanceNamespace(client: DtfClient) {
  return {
    getProposals: (params: GetIndexDtfProposalsParams) => getProposals(client, params),
    getProposalList: (params: GetIndexDtfProposalsParams) => getProposalList(client, params),
    getProposal: (params: GetIndexDtfProposalParams) => getProposal(client, params),
    getAllProposals: (params: GetAllIndexDtfProposalsParams) => getAllProposals(client, params),
    getDelegates: (params: GetIndexDtfDelegatesParams) => getDelegates(client, params),
    getGuardians: (params: GetIndexDtfGuardiansParams) => getGuardians(client, params),
    getLegacyVoteLocks: (params: GetIndexDtfLegacyVoteLocksParams) => getLegacyVoteLocks(client, params),
    getVoterState: (params: GetIndexDtfVoterStateParams) => getVoterState(client, params),
    getOptimisticGovernance: (params: GetIndexDtfOptimisticGovernanceParams) => getOptimisticGovernance(client, params),
    getOptimisticProposalContext: (params: GetIndexDtfOptimisticProposalContextParams) =>
      getOptimisticProposalContext(client, params),
    getOptimisticTimelockRoles: (params: Parameters<typeof getOptimisticTimelockRoles>[1]) =>
      getOptimisticTimelockRoles(client, params),
    getOptimisticVotes: (params: Parameters<typeof getOptimisticVotes>[1]) => getOptimisticVotes(client, params),
    getPastOptimisticVotes: (params: Parameters<typeof getPastOptimisticVotes>[1]) =>
      getPastOptimisticVotes(client, params),
    getProposalThrottleCharges: (params: GetIndexDtfProposalThrottleChargesParams) =>
      getProposalThrottleCharges(client, params),
    getProposerState: (params: GetIndexDtfProposerStateParams) => getProposerState(client, params),
    getProposalVotes: (params: GetIndexDtfProposalVotesParams) => getProposalVotes(client, params),
    getProposalVoterState: (params: GetIndexDtfProposalVoterStateParams) => getProposalVoterState(client, params),
    getOptimisticProposalVoterState: (params: GetIndexDtfOptimisticProposalVoterStateParams) =>
      getOptimisticProposalVoterState(client, params),
    prepareVote: prepareIndexDtfVote,
    prepareVoteWithReason: prepareIndexDtfVoteWithReason,
    prepareVoteWithReasonAndParams: prepareIndexDtfVoteWithReasonAndParams,
    prepareQueueProposal: prepareIndexDtfQueueProposal,
    prepareExecuteProposal: prepareIndexDtfExecuteProposal,
    prepareCancelProposal: prepareIndexDtfCancelProposal,
    prepareGovernorCancelProposal: prepareIndexDtfGovernorCancelProposal,
    prepareSubmitProposal: prepareIndexDtfSubmitProposal,
    prepareSubmitOptimisticProposal: prepareIndexDtfSubmitOptimisticProposal,
    prepareUpdateTimelock: prepareIndexDtfUpdateTimelock,
    prepareRelay: prepareIndexDtfRelay,
    prepareTimelockDelay: prepareIndexDtfTimelockDelay,
    prepareTimelockGrantRole: prepareIndexDtfTimelockGrantRole,
    prepareTimelockRevokeRole: prepareIndexDtfTimelockRevokeRole,
    prepareTimelockExecuteBatch: prepareIndexDtfTimelockExecuteBatch,
    getSelectorRegistryTargets: (params: Parameters<typeof getSelectorRegistryTargets>[1]) =>
      getSelectorRegistryTargets(client, params),
    getSelectorRegistryAllowedSelectors: (params: Parameters<typeof getSelectorRegistryAllowedSelectors>[1]) =>
      getSelectorRegistryAllowedSelectors(client, params),
    getSelectorRegistryIsAllowed: (params: Parameters<typeof getSelectorRegistryIsAllowed>[1]) =>
      getSelectorRegistryIsAllowed(client, params),
    prepareSelectorRegistryRegisterSelectors,
    prepareSelectorRegistryUnregisterSelectors,
    buildBasketProposal: (params: BuildIndexDtfBasketProposalParams) => buildIndexDtfBasketProposal(client, params),
    buildBasketSettingsProposal: (params: BuildIndexDtfBasketSettingsProposalParams) =>
      buildIndexDtfBasketSettingsProposal(client, params),
    buildDaoSettingsProposal: (params: BuildIndexDtfDaoSettingsProposalParams) =>
      buildIndexDtfDaoSettingsProposal(client, params),
    buildSettingsProposal: (params: BuildIndexDtfSettingsProposalParams) =>
      buildIndexDtfSettingsProposal(client, params),
  };
}
