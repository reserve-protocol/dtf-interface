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

import type { SupportedChainId } from "@/config";

import { prepareContractCall } from "@/lib/contract-call";

/**
 * Standard OZ Governor write surface. Index and Yield DTF governors share
 * these exact signatures, so both domains encode through this one ABI.
 */
export const governorWriteAbi = [
  {
    inputs: [
      { internalType: "uint256", name: "proposalId", type: "uint256" },
      { internalType: "uint8", name: "support", type: "uint8" },
    ],
    name: "castVote",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "proposalId", type: "uint256" },
      { internalType: "uint8", name: "support", type: "uint8" },
      { internalType: "string", name: "reason", type: "string" },
    ],
    name: "castVoteWithReason",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "proposalId", type: "uint256" },
      { internalType: "uint8", name: "support", type: "uint8" },
      { internalType: "string", name: "reason", type: "string" },
      { internalType: "bytes", name: "params", type: "bytes" },
    ],
    name: "castVoteWithReasonAndParams",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address[]", name: "targets", type: "address[]" },
      { internalType: "uint256[]", name: "values", type: "uint256[]" },
      { internalType: "bytes[]", name: "calldatas", type: "bytes[]" },
      { internalType: "string", name: "description", type: "string" },
    ],
    name: "propose",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address[]", name: "targets", type: "address[]" },
      { internalType: "uint256[]", name: "values", type: "uint256[]" },
      { internalType: "bytes[]", name: "calldatas", type: "bytes[]" },
      { internalType: "bytes32", name: "descriptionHash", type: "bytes32" },
    ],
    name: "queue",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address[]", name: "targets", type: "address[]" },
      { internalType: "uint256[]", name: "values", type: "uint256[]" },
      { internalType: "bytes[]", name: "calldatas", type: "bytes[]" },
      { internalType: "bytes32", name: "descriptionHash", type: "bytes32" },
    ],
    name: "execute",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address[]", name: "targets", type: "address[]" },
      { internalType: "uint256[]", name: "values", type: "uint256[]" },
      { internalType: "bytes[]", name: "calldatas", type: "bytes[]" },
      { internalType: "bytes32", name: "descriptionHash", type: "bytes32" },
    ],
    name: "cancel",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export type GovernorVoteParams = {
  readonly chainId: SupportedChainId;
  readonly governor: Address;
  readonly proposalId: bigint | string;
  /** 0 = against, 1 = for, 2 = abstain. */
  readonly support: number;
};

/** Targets/calldatas of a proposal; values are always zero in DTF governance. */
export type GovernorProposalPayload = {
  readonly governor: Address;
  readonly targets: readonly Address[];
  readonly calldatas: readonly Hex[];
  readonly description: string;
};

export type GovernorProposalParams = {
  readonly chainId: SupportedChainId;
  readonly proposal: GovernorProposalPayload;
};

export function prepareGovernorVote(params: GovernorVoteParams) {
  return prepareContractCall({
    chainId: params.chainId,
    address: params.governor,
    abi: governorWriteAbi,
    functionName: "castVote",
    args: [BigInt(params.proposalId), params.support] as const,
  });
}

export function prepareGovernorVoteWithReason(params: GovernorVoteParams & { readonly reason: string }) {
  return prepareContractCall({
    chainId: params.chainId,
    address: params.governor,
    abi: governorWriteAbi,
    functionName: "castVoteWithReason",
    args: [BigInt(params.proposalId), params.support, params.reason] as const,
  });
}

export function prepareGovernorVoteWithReasonAndParams(
  params: GovernorVoteParams & { readonly reason: string; readonly voteParams: Hex },
) {
  return prepareContractCall({
    chainId: params.chainId,
    address: params.governor,
    abi: governorWriteAbi,
    functionName: "castVoteWithReasonAndParams",
    args: [BigInt(params.proposalId), params.support, params.reason, params.voteParams] as const,
  });
}

export function prepareGovernorPropose(params: GovernorProposalParams) {
  const { targets, calldatas, description } = params.proposal;

  return prepareContractCall({
    chainId: params.chainId,
    address: params.proposal.governor,
    abi: governorWriteAbi,
    functionName: "propose",
    args: [targets, zeroValues(targets.length), [...calldatas], description] as const,
  });
}

export function prepareGovernorQueue(params: GovernorProposalParams) {
  return prepareContractCall({
    chainId: params.chainId,
    address: params.proposal.governor,
    abi: governorWriteAbi,
    functionName: "queue",
    args: proposalHashArgs(params.proposal),
  });
}

export function prepareGovernorExecute(params: GovernorProposalParams) {
  return prepareContractCall({
    chainId: params.chainId,
    address: params.proposal.governor,
    abi: governorWriteAbi,
    functionName: "execute",
    args: proposalHashArgs(params.proposal),
  });
}

export function prepareGovernorCancel(params: GovernorProposalParams) {
  return prepareContractCall({
    chainId: params.chainId,
    address: params.proposal.governor,
    abi: governorWriteAbi,
    functionName: "cancel",
    args: proposalHashArgs(params.proposal),
  });
}

export function hashProposalDescription(description: string): Hex {
  return keccak256(toBytes(description));
}

const TIMELOCK_OPERATION_PARAMS = parseAbiParameters("address[], uint256[], bytes[], bytes32, bytes32");

const timelockCancelAbi = [
  {
    inputs: [{ internalType: "bytes32", name: "id", type: "bytes32" }],
    name: "cancel",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

/**
 * Timelock operation id for an OZ 5.x GovernorTimelockControl (Index DTF):
 * the batch hash with the governor-XOR-description salt.
 */
export function getGovernorTimelockOperationId(proposal: GovernorProposalPayload): Hex {
  return keccak256(
    encodeAbiParameters(TIMELOCK_OPERATION_PARAMS, [
      proposal.targets,
      zeroValues(proposal.targets.length),
      [...proposal.calldatas],
      zeroHash,
      getGovernorTimelockSalt(proposal.governor, proposal.description),
    ]),
  );
}

/**
 * Timelock operation id for an OZ 4.x GovernorTimelockControl (Yield DTF):
 * 4.x schedules with salt = descriptionHash directly, no governor XOR.
 */
export function getGovernorTimelockOperationIdV4(proposal: GovernorProposalPayload): Hex {
  return keccak256(
    encodeAbiParameters(TIMELOCK_OPERATION_PARAMS, [
      proposal.targets,
      zeroValues(proposal.targets.length),
      [...proposal.calldatas],
      zeroHash,
      hashProposalDescription(proposal.description),
    ]),
  );
}

/** Guardian cancellation of a queued proposal, straight on the timelock. */
export function prepareTimelockCancel(params: {
  readonly chainId: SupportedChainId;
  readonly timelock: Address;
  readonly operationId: Hex;
}) {
  return prepareContractCall({
    chainId: params.chainId,
    address: params.timelock,
    abi: timelockCancelAbi,
    functionName: "cancel",
    args: [params.operationId] as const,
  });
}

function getGovernorTimelockSalt(governor: Address, description: string): Hex {
  const governorBytes = hexToBytes(pad(getAddress(governor).toLowerCase() as Hex, { size: 32, dir: "right" }));
  const descriptionHashBytes = hexToBytes(keccak256(toBytes(description)));
  const saltBytes = new Uint8Array(32);

  for (let i = 0; i < saltBytes.length; i++) {
    saltBytes[i] = governorBytes[i]! ^ descriptionHashBytes[i]!;
  }

  return bytesToHex(saltBytes);
}

function proposalHashArgs(
  proposal: GovernorProposalPayload,
): readonly [readonly Address[], readonly bigint[], readonly Hex[], Hex] {
  return [
    proposal.targets,
    zeroValues(proposal.targets.length),
    [...proposal.calldatas],
    hashProposalDescription(proposal.description),
  ] as const;
}

function zeroValues(length: number): readonly bigint[] {
  return new Array<bigint>(length).fill(0n);
}
