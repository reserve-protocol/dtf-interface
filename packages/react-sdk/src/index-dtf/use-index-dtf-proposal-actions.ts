import { useMemo } from "react";

import type {
  CancelIndexDtfProposalParams,
  ExecuteIndexDtfProposalParams,
  IndexDtfCall,
  QueueIndexDtfProposalParams,
  VoteIndexDtfProposalParams,
} from "@reserve-protocol/sdk";

import { useDtfSdk } from "@/provider";

export function useIndexDtfVoteCall(params: VoteIndexDtfProposalParams | undefined): IndexDtfCall | undefined {
  const sdk = useDtfSdk();
  const chainId = params?.chainId;
  const governance = params?.governance;
  const proposalId = params?.proposalId;
  const support = params?.support;

  return useMemo(() => {
    if (chainId === undefined || !governance || proposalId === undefined || support === undefined) {
      return undefined;
    }

    return sdk.index.prepareVote({ chainId, governance, proposalId, support });
  }, [chainId, governance, proposalId, support, sdk]);
}

export function useIndexDtfQueueProposalCall(
  params: QueueIndexDtfProposalParams | undefined,
): IndexDtfCall | undefined {
  const sdk = useDtfSdk();
  const proposal = params?.proposal;
  const chainId = params?.chainId;
  const governance = proposal?.governance;
  const timelock = proposal?.timelock;
  const timelockId = proposal?.timelockId;
  const targets = proposal?.targets;
  const calldatas = proposal?.calldatas;
  const description = proposal?.description;

  return useMemo(() => {
    if (chainId === undefined || !governance || !targets || !calldatas || description === undefined) {
      return undefined;
    }

    return sdk.index.prepareQueueProposal({
      chainId,
      proposal: {
        governance,
        targets,
        calldatas,
        description,
        ...(timelock === undefined ? {} : { timelock }),
        ...(timelockId === undefined ? {} : { timelockId }),
      },
    });
  }, [chainId, governance, timelock, timelockId, targets, calldatas, description, sdk]);
}

export function useIndexDtfExecuteProposalCall(
  params: ExecuteIndexDtfProposalParams | undefined,
): IndexDtfCall | undefined {
  const sdk = useDtfSdk();
  const proposal = params?.proposal;
  const chainId = params?.chainId;
  const governance = proposal?.governance;
  const timelock = proposal?.timelock;
  const timelockId = proposal?.timelockId;
  const targets = proposal?.targets;
  const calldatas = proposal?.calldatas;
  const description = proposal?.description;

  return useMemo(() => {
    if (chainId === undefined || !governance || !targets || !calldatas || description === undefined) {
      return undefined;
    }

    return sdk.index.prepareExecuteProposal({
      chainId,
      proposal: {
        governance,
        targets,
        calldatas,
        description,
        ...(timelock === undefined ? {} : { timelock }),
        ...(timelockId === undefined ? {} : { timelockId }),
      },
    });
  }, [chainId, governance, timelock, timelockId, targets, calldatas, description, sdk]);
}

export function useIndexDtfCancelProposalCall(
  params: CancelIndexDtfProposalParams | undefined,
): IndexDtfCall | undefined {
  const sdk = useDtfSdk();
  const proposal = params?.proposal;
  const chainId = params?.chainId;
  const governance = proposal?.governance;
  const timelock = proposal?.timelock;
  const timelockId = proposal?.timelockId;
  const targets = proposal?.targets;
  const calldatas = proposal?.calldatas;
  const description = proposal?.description;

  return useMemo(() => {
    if (chainId === undefined || !governance || !timelock || !targets || !calldatas || description === undefined) {
      return undefined;
    }

    return sdk.index.prepareCancelProposal({
      chainId,
      proposal: {
        governance,
        timelock,
        targets,
        calldatas,
        description,
        ...(timelockId === undefined ? {} : { timelockId }),
      },
    });
  }, [chainId, governance, timelock, timelockId, targets, calldatas, description, sdk]);
}
