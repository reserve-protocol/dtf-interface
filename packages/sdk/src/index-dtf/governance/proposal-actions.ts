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
  VoteIndexDtfProposalParams,
} from "@/types/governance";

import { prepareContractCall } from "@/contract-call";
import { SdkError } from "@/errors";
import { dtfIndexGovernanceAbi } from "@/index-dtf/abis/dtf-index-governance";
import { timelockAbi } from "@/index-dtf/abis/timelock";
import { getZeroValues } from "@/index-dtf/governance/utils";

const TIMELOCK_OPERATION_PARAMS = parseAbiParameters("address[], uint256[], bytes[], bytes32, bytes32");

export function prepareIndexDtfVote(params: VoteIndexDtfProposalParams) {
  return prepareContractCall({
    chainId: params.chainId,
    address: params.governance,
    abi: dtfIndexGovernanceAbi,
    functionName: "castVote",
    args: [BigInt(params.proposalId), params.support] as const,
  });
}

export function prepareIndexDtfQueueProposal(params: QueueIndexDtfProposalParams) {
  const [targets, values, calldatas, descriptionHash] = getProposalTxArgs(params.proposal);

  return prepareContractCall({
    chainId: params.chainId,
    address: params.proposal.governance,
    abi: dtfIndexGovernanceAbi,
    functionName: "queue",
    args: [targets, values, calldatas, descriptionHash] as const,
  });
}

export function prepareIndexDtfExecuteProposal(params: ExecuteIndexDtfProposalParams) {
  const [targets, values, calldatas, descriptionHash] = getProposalTxArgs(params.proposal);

  return prepareContractCall({
    chainId: params.chainId,
    address: params.proposal.governance,
    abi: dtfIndexGovernanceAbi,
    functionName: "execute",
    args: [targets, values, calldatas, descriptionHash] as const,
  });
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

export function prepareIndexDtfSubmitProposal(params: ProposeIndexDtfProposalParams) {
  const targets = params.proposal.targets.map(getAddress);
  const calldatas = [...params.proposal.calldatas];
  const values = getZeroValues(targets.length);

  return prepareContractCall({
    chainId: params.chainId,
    address: params.proposal.governance,
    abi: dtfIndexGovernanceAbi,
    functionName: "propose",
    args: [targets, values, calldatas, params.proposal.description] as const,
  });
}

function getProposalTxArgs(
  proposal: IndexDtfProposalPayload,
): [readonly Address[], readonly bigint[], readonly Hex[], Hex] {
  const targets = proposal.targets.map(getAddress);

  return [targets, getZeroValues(targets.length), [...proposal.calldatas], keccak256(toBytes(proposal.description))];
}

function getTimelockOperationId(proposal: IndexDtfProposalPayload): Hex {
  if (proposal.timelockId) {
    return proposal.timelockId;
  }

  return calculateLegacyTimelockOperationId(proposal);
}

function calculateLegacyTimelockOperationId(proposal: IndexDtfProposalPayload): Hex {
  const targets = proposal.targets.map(getAddress);

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
