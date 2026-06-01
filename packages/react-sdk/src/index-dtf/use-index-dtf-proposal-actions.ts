import type {
  CancelIndexDtfProposalParams,
  ExecuteIndexDtfProposalParams,
  IndexDtfCall,
  QueueIndexDtfProposalParams,
  VoteIndexDtfProposalParams,
} from "@reserve-protocol/sdk";
import { useMemo } from "react";

import { useDtfSdk } from "@/provider";

export function useIndexDtfVoteCall(params: VoteIndexDtfProposalParams | undefined): IndexDtfCall | undefined {
  const sdk = useDtfSdk();

  return useMemo(() => (params ? sdk.index.prepareVote(params) : undefined), [
    params?.chainId,
    params?.governance,
    params?.proposalId,
    params?.support,
    sdk,
  ]);
}

export function useIndexDtfQueueProposalCall(
  params: QueueIndexDtfProposalParams | undefined,
): IndexDtfCall | undefined {
  const sdk = useDtfSdk();
  const proposal = params?.proposal;

  return useMemo(() => (params ? sdk.index.prepareQueueProposal(params) : undefined), [
    params?.chainId,
    proposal?.governance,
    proposal?.timelock,
    proposal?.timelockId,
    proposal?.targets,
    proposal?.calldatas,
    proposal?.description,
    sdk,
  ]);
}

export function useIndexDtfExecuteProposalCall(
  params: ExecuteIndexDtfProposalParams | undefined,
): IndexDtfCall | undefined {
  const sdk = useDtfSdk();
  const proposal = params?.proposal;

  return useMemo(() => (params ? sdk.index.prepareExecuteProposal(params) : undefined), [
    params?.chainId,
    proposal?.governance,
    proposal?.timelock,
    proposal?.timelockId,
    proposal?.targets,
    proposal?.calldatas,
    proposal?.description,
    sdk,
  ]);
}

export function useIndexDtfCancelProposalCall(
  params: CancelIndexDtfProposalParams | undefined,
): IndexDtfCall | undefined {
  const sdk = useDtfSdk();
  const proposal = params?.proposal;

  return useMemo(() => (params && proposal?.timelock ? sdk.index.prepareCancelProposal(params) : undefined), [
    params?.chainId,
    proposal?.governance,
    proposal?.timelock,
    proposal?.timelockId,
    proposal?.targets,
    proposal?.calldatas,
    proposal?.description,
    sdk,
  ]);
}
