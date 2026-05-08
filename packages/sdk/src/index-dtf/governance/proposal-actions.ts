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
  type WalletClient,
} from "viem";
import { writeContract } from "../../client/viem.js";
import { SdkError } from "../../errors.js";
import type {
  CancelIndexDtfProposalParams,
  ExecuteIndexDtfProposalParams,
  IndexDtfProposalPayload,
  ProposeIndexDtfProposalParams,
  QueueIndexDtfProposalParams,
  VoteIndexDtfProposalParams,
} from "../../types/governance.js";
import { dtfIndexGovernanceAbi } from "../abis/dtf-index-governance.js";
import { timelockAbi } from "../abis/timelock.js";
import { getZeroValues } from "./utils.js";

const TIMELOCK_OPERATION_PARAMS = parseAbiParameters(
  "address[], uint256[], bytes[], bytes32, bytes32",
);

export async function vote(
  walletClient: WalletClient,
  params: VoteIndexDtfProposalParams,
): Promise<Hex> {
  return writeContract(walletClient, params.chainId, {
    account: getAddress(params.account),
    address: getAddress(params.governance),
    abi: dtfIndexGovernanceAbi,
    functionName: "castVote",
    args: [BigInt(params.proposalId), params.support],
  });
}

export async function queue(
  walletClient: WalletClient,
  params: QueueIndexDtfProposalParams,
): Promise<Hex> {
  const [targets, values, calldatas, descriptionHash] = getProposalTxArgs(
    params.proposal,
  );

  return writeContract(walletClient, params.chainId, {
    account: getAddress(params.account),
    address: getAddress(params.proposal.governance),
    abi: dtfIndexGovernanceAbi,
    functionName: "queue",
    args: [targets, values, calldatas, descriptionHash],
  });
}

export async function execute(
  walletClient: WalletClient,
  params: ExecuteIndexDtfProposalParams,
): Promise<Hex> {
  const [targets, values, calldatas, descriptionHash] = getProposalTxArgs(
    params.proposal,
  );

  return writeContract(walletClient, params.chainId, {
    account: getAddress(params.account),
    address: getAddress(params.proposal.governance),
    abi: dtfIndexGovernanceAbi,
    functionName: "execute",
    args: [targets, values, calldatas, descriptionHash],
  });
}

export async function cancel(
  walletClient: WalletClient,
  params: CancelIndexDtfProposalParams,
): Promise<Hex> {
  if (!params.proposal.timelock) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "timelock is required to cancel a proposal",
    });
  }

  return writeContract(walletClient, params.chainId, {
    account: getAddress(params.account),
    address: getAddress(params.proposal.timelock),
    abi: timelockAbi,
    functionName: "cancel",
    args: [getTimelockOperationId(params.proposal)],
  });
}

export async function propose(
  walletClient: WalletClient,
  params: ProposeIndexDtfProposalParams,
): Promise<Hex> {
  const targets = params.proposal.targets.map(getAddress);
  const calldatas = [...params.proposal.calldatas];
  const values = getZeroValues(targets.length);

  return writeContract(walletClient, params.chainId, {
    account: getAddress(params.account),
    address: getAddress(params.proposal.governance),
    abi: dtfIndexGovernanceAbi,
    functionName: "propose",
    args: [targets, values, calldatas, params.proposal.description],
  });
}

function getProposalTxArgs(
  proposal: IndexDtfProposalPayload,
): [readonly Address[], readonly bigint[], readonly Hex[], Hex] {
  const targets = proposal.targets.map(getAddress);

  return [
    targets,
    getZeroValues(targets.length),
    [...proposal.calldatas],
    keccak256(toBytes(proposal.description)),
  ];
}

function getTimelockOperationId(proposal: IndexDtfProposalPayload): Hex {
  if (proposal.timelockId) {
    return proposal.timelockId;
  }

  return calculateLegacyTimelockOperationId(proposal);
}

function calculateLegacyTimelockOperationId(
  proposal: IndexDtfProposalPayload,
): Hex {
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
