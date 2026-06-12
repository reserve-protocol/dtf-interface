import {
  bytesToHex,
  encodeAbiParameters,
  getAddress,
  hexToBytes,
  keccak256,
  pad,
  parseAbiParameters,
  toBytes,
  zeroHash,
  type Address,
  type Hex,
} from "viem";

import type {
  CancelIndexDtfProposalParams,
  ExecuteIndexDtfProposalParams,
  IndexDtfProposalPayload,
  ProposeIndexDtfProposalParams,
  QueueIndexDtfProposalParams,
  SubmitOptimisticIndexDtfProposalParams,
  VoteIndexDtfProposalParams,
} from "@/types/governance";

import { dtfIndexGovernanceOptimisticAbi } from "@/index-dtf/abis/dtf-index-governance-optimistic";
import { timelockAbi } from "@/index-dtf/abis/timelock";
import { getZeroValues } from "@/index-dtf/governance/utils";
import { prepareContractCall } from "@/lib/contract-call";
import { SdkError } from "@/lib/errors";
import {
  hashProposalDescription,
  prepareGovernorCancel,
  prepareGovernorExecute,
  prepareGovernorPropose,
  prepareGovernorQueue,
  prepareGovernorVote,
  prepareGovernorVoteWithReason,
  prepareGovernorVoteWithReasonAndParams,
} from "@/lib/governor-calls";

const TIMELOCK_OPERATION_PARAMS = parseAbiParameters("address[], uint256[], bytes[], bytes32, bytes32");

export function prepareIndexDtfVote(params: VoteIndexDtfProposalParams) {
  return prepareGovernorVote({
    chainId: params.chainId,
    governor: params.governance,
    proposalId: params.proposalId,
    support: params.support,
  });
}

export function prepareIndexDtfVoteWithReason(params: VoteIndexDtfProposalParams & { readonly reason: string }) {
  return prepareGovernorVoteWithReason({
    chainId: params.chainId,
    governor: params.governance,
    proposalId: params.proposalId,
    support: params.support,
    reason: params.reason,
  });
}

export function prepareIndexDtfVoteWithReasonAndParams(
  params: VoteIndexDtfProposalParams & { readonly reason: string; readonly voteParams: Hex },
) {
  return prepareGovernorVoteWithReasonAndParams({
    chainId: params.chainId,
    governor: params.governance,
    proposalId: params.proposalId,
    support: params.support,
    reason: params.reason,
    voteParams: params.voteParams,
  });
}

export function prepareIndexDtfQueueProposal(params: QueueIndexDtfProposalParams) {
  return prepareGovernorQueue({ chainId: params.chainId, proposal: toGovernorPayload(params.proposal) });
}

export function prepareIndexDtfExecuteProposal(params: ExecuteIndexDtfProposalParams) {
  return prepareGovernorExecute({ chainId: params.chainId, proposal: toGovernorPayload(params.proposal) });
}

export function prepareIndexDtfCancelProposal(params: CancelIndexDtfProposalParams) {
  if (!params.proposal.timelock) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "timelock is required to cancel a proposal",
    });
  }

  return prepareContractCall({
    chainId: params.chainId,
    address: params.proposal.timelock,
    abi: timelockAbi,
    functionName: "cancel",
    args: [getTimelockOperationId(params.proposal)] as const,
  });
}

export function prepareIndexDtfGovernorCancelProposal(params: CancelIndexDtfProposalParams) {
  return prepareGovernorCancel({ chainId: params.chainId, proposal: toGovernorPayload(params.proposal) });
}

export function prepareIndexDtfSubmitProposal(params: ProposeIndexDtfProposalParams) {
  return prepareGovernorPropose({ chainId: params.chainId, proposal: toGovernorPayload(params.proposal) });
}

export function prepareIndexDtfSubmitOptimisticProposal(params: SubmitOptimisticIndexDtfProposalParams) {
  const targets = params.proposal.targets;
  const calldatas = [...params.proposal.calldatas];
  const values = getZeroValues(targets.length);

  return prepareContractCall({
    chainId: params.chainId,
    address: params.proposal.governance,
    abi: dtfIndexGovernanceOptimisticAbi,
    functionName: "proposeOptimistic",
    args: [targets, values, calldatas, params.proposal.description] as const,
  });
}

export function hashIndexDtfProposalDescription(description: string): Hex {
  return hashProposalDescription(description);
}

function toGovernorPayload(proposal: IndexDtfProposalPayload) {
  return {
    governor: proposal.governance,
    targets: proposal.targets,
    calldatas: proposal.calldatas,
    description: proposal.description,
  };
}

function getTimelockOperationId(proposal: IndexDtfProposalPayload): Hex {
  if (proposal.timelockId) {
    return proposal.timelockId;
  }

  return calculateLegacyTimelockOperationId(proposal);
}

function calculateLegacyTimelockOperationId(proposal: IndexDtfProposalPayload): Hex {
  const targets = proposal.targets;

  return keccak256(
    encodeAbiParameters(TIMELOCK_OPERATION_PARAMS, [
      targets,
      getZeroValues(targets.length),
      [...proposal.calldatas],
      zeroHash,
      getTimelockSalt(proposal.governance, proposal.description),
    ]),
  );
}

function getTimelockSalt(governance: Address, description: string): Hex {
  const governorBytes = hexToBytes(
    pad(getAddress(governance).toLowerCase() as Hex, {
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
