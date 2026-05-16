import type { DtfClient } from "@/client";
import type {
  BuildIndexDtfBasketProposalParams,
  BuildIndexDtfBasketSettingsProposalParams,
  BuildIndexDtfDaoSettingsProposalParams,
  BuildIndexDtfSettingsProposalParams,
} from "@/index-dtf/governance/propose/index";
import type { DtfParams } from "@/types/common";
import type {
  GetIndexDtfDelegatesParams,
  GetIndexDtfOptimisticGovernanceParams,
  GetIndexDtfOptimisticProposalContextParams,
  GetIndexDtfOptimisticProposalVoterStateParams,
  GetIndexDtfProposalThrottleChargesParams,
  GetIndexDtfProposalVoterStateParams,
  GetIndexDtfProposalVotesParams,
  GetIndexDtfProposalsOptions,
  GetIndexDtfProposerStateParams,
  GetIndexDtfVoterStateParams,
} from "@/types/governance";

import {
  getDelegates,
  getGuardians,
  getLegacyVoteLocks,
  getOptimisticGovernance,
  getOptimisticProposalContext,
  getOptimisticProposalVoterState,
  getProposal,
  getProposalThrottleCharges,
  getProposalVoterState,
  getProposalVotes,
  getProposals,
  getProposerState,
  getVoterState,
  prepareIndexDtfCancelProposal,
  prepareIndexDtfExecuteProposal,
  prepareIndexDtfQueueProposal,
  prepareIndexDtfSubmitOptimisticProposal,
  prepareIndexDtfSubmitProposal,
  prepareIndexDtfVote,
} from "@/index-dtf/governance/index";
import {
  buildIndexDtfBasketProposal,
  buildIndexDtfBasketSettingsProposal,
  buildIndexDtfDaoSettingsProposal,
  buildIndexDtfSettingsProposal,
} from "@/index-dtf/governance/propose/index";

/** Creates address-bound Index DTF governance methods for the flat ref. */
export function createIndexDtfGovernanceRef(client: DtfClient, params: DtfParams) {
  const address = params.address;
  const chainId = params.chainId;

  return {
    getProposals: (options: GetIndexDtfProposalsOptions = {}) =>
      getProposals(client, { ...options, address, chainId }),
    getProposal: (proposalId: string) =>
      getProposal(client, { proposalId, address, chainId }),
    getDelegates: (
      options: Pick<GetIndexDtfDelegatesParams, "stToken" | "limit">,
    ) => getDelegates(client, { ...options, chainId }),
    getGuardians: () => getGuardians(client, { address, chainId }),
    getLegacyVoteLocks: () => getLegacyVoteLocks(client, { address, chainId }),
    getVoterState: (
      voter: Pick<GetIndexDtfVoterStateParams, "account" | "stToken">,
    ) => getVoterState(client, { ...voter, chainId }),
    getOptimisticGovernance: (
      governance: Pick<GetIndexDtfOptimisticGovernanceParams, "governance">,
    ) => getOptimisticGovernance(client, { ...governance, chainId }),
    getOptimisticProposalContext: (
      proposal: Pick<
        GetIndexDtfOptimisticProposalContextParams,
        "governance" | "proposalId"
      >,
    ) => getOptimisticProposalContext(client, { ...proposal, chainId }),
    getProposalThrottleCharges: (
      charges: Pick<
        GetIndexDtfProposalThrottleChargesParams,
        "account" | "governance"
      >,
    ) => getProposalThrottleCharges(client, { ...charges, chainId }),
    getProposerState: (
      proposer: Pick<
        GetIndexDtfProposerStateParams,
        "account" | "governance" | "timepoint"
      >,
    ) => getProposerState(client, { ...proposer, chainId }),
    getProposalVotes: (
      votes: Pick<GetIndexDtfProposalVotesParams, "governance" | "proposalId">,
    ) => getProposalVotes(client, { ...votes, chainId }),
    getProposalVoterState: (
      voter: Pick<
        GetIndexDtfProposalVoterStateParams,
        "account" | "governance" | "proposal"
      >,
    ) => getProposalVoterState(client, { ...voter, chainId }),
    getOptimisticProposalVoterState: (
      voter: Pick<
        GetIndexDtfOptimisticProposalVoterStateParams,
        "account" | "governance" | "proposal"
      >,
    ) => getOptimisticProposalVoterState(client, { ...voter, chainId }),
    buildBasketProposal: (
      proposal: Omit<BuildIndexDtfBasketProposalParams, "address" | "chainId">,
    ) => buildIndexDtfBasketProposal(client, { ...proposal, address, chainId }),
    buildBasketSettingsProposal: (
      proposal: Omit<
        BuildIndexDtfBasketSettingsProposalParams,
        "address" | "chainId"
      >,
    ) =>
      buildIndexDtfBasketSettingsProposal(client, {
        ...proposal,
        address,
        chainId,
      }),
    buildDaoSettingsProposal: (proposal: Omit<BuildIndexDtfDaoSettingsProposalParams, "address" | "chainId">) =>
      buildIndexDtfDaoSettingsProposal(client, {
        ...proposal,
        address,
        chainId,
      }),
    buildSettingsProposal: (proposal: Omit<BuildIndexDtfSettingsProposalParams, "address" | "chainId">) =>
      buildIndexDtfSettingsProposal(client, { ...proposal, address, chainId }),
    prepareVote: (
      call: Omit<
        Parameters<typeof prepareIndexDtfVote>[0],
        "chainId"
      >,
    ) => prepareIndexDtfVote({ ...call, chainId }),
    prepareQueueProposal: (
      call: Omit<
        Parameters<typeof prepareIndexDtfQueueProposal>[0],
        "chainId"
      >,
    ) => prepareIndexDtfQueueProposal({ ...call, chainId }),
    prepareExecuteProposal: (
      call: Omit<
        Parameters<typeof prepareIndexDtfExecuteProposal>[0],
        "chainId"
      >,
    ) => prepareIndexDtfExecuteProposal({ ...call, chainId }),
    prepareCancelProposal: (
      call: Omit<
        Parameters<typeof prepareIndexDtfCancelProposal>[0],
        "chainId"
      >,
    ) => prepareIndexDtfCancelProposal({ ...call, chainId }),
    prepareSubmitProposal: (
      call: Omit<
        Parameters<typeof prepareIndexDtfSubmitProposal>[0],
        "chainId"
      >,
    ) => prepareIndexDtfSubmitProposal({ ...call, chainId }),
    prepareSubmitOptimisticProposal: (
      call: Omit<
        Parameters<typeof prepareIndexDtfSubmitOptimisticProposal>[0],
        "chainId"
      >,
    ) => prepareIndexDtfSubmitOptimisticProposal({ ...call, chainId }),
  };
}
