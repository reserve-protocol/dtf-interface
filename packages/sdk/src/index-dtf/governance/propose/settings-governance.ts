import { Decimal } from "decimal.js-light";
import { parseEther, type Address } from "viem";
import { prepareContractCall } from "../../../contract-call.js";
import type { SupportedChainId } from "../../../defaults.js";
import { SdkError } from "../../../errors.js";
import type { IndexDtfCall } from "../../../types/governance.js";
import { dtfIndexGovernanceAbi } from "../../abis/dtf-index-governance.js";
import { timelockAbi } from "../../abis/timelock.js";
import type { IndexDtfGovernanceChanges } from "./settings-types.js";

export function buildGovernanceCalls({
  changes,
  chainId,
  governance,
  quorumDenominator,
  timelock,
}: {
  readonly governance: Address | undefined;
  readonly chainId: SupportedChainId;
  readonly timelock: Address | undefined;
  readonly quorumDenominator: number | undefined;
  readonly changes: IndexDtfGovernanceChanges | undefined;
}): IndexDtfCall[] {
  if (!changes) return [];
  if (!governance) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "governance is required to build governance settings calls",
    });
  }

  validateGovernanceChanges(changes);

  const calls: IndexDtfCall[] = [];
  if (changes.votingDelay !== undefined) {
    calls.push(
      prepareContractCall({
        chainId,
        address: governance,
        abi: dtfIndexGovernanceAbi,
        functionName: "setVotingDelay",
        args: [changes.votingDelay],
      }),
    );
  }
  if (changes.votingPeriod !== undefined) {
    calls.push(
      prepareContractCall({
        chainId,
        address: governance,
        abi: dtfIndexGovernanceAbi,
        functionName: "setVotingPeriod",
        args: [changes.votingPeriod],
      }),
    );
  }
  if (changes.proposalThreshold !== undefined) {
    calls.push(
      prepareContractCall({
        chainId,
        address: governance,
        abi: dtfIndexGovernanceAbi,
        functionName: "setProposalThreshold",
        args: [encodePercent(changes.proposalThreshold)],
      }),
    );
  }
  if (changes.quorumPercent !== undefined) {
    if (quorumDenominator === undefined) {
      throw new SdkError({
        code: "INVALID_INPUT",
        message: "quorumDenominator is required to build a quorum proposal",
      });
    }
    calls.push(
      prepareContractCall({
        chainId,
        address: governance,
        abi: dtfIndexGovernanceAbi,
        functionName: "updateQuorumNumerator",
        args: [getQuorumNumerator(changes.quorumPercent, quorumDenominator)],
      }),
    );
  }
  if (changes.executionDelay !== undefined) {
    if (!timelock) {
      throw new SdkError({
        code: "INVALID_INPUT",
        message: "timelock is required to build an execution delay proposal",
      });
    }
    const functionName = "updateDelay";
    const args = [BigInt(Math.round(changes.executionDelay))] as const;

    calls.push(
      prepareContractCall({
        chainId,
        address: timelock,
        abi: timelockAbi,
        functionName,
        args,
      }),
    );
  }

  return calls;
}

function validateGovernanceChanges(changes: IndexDtfGovernanceChanges) {
  if (changes.votingDelay !== undefined) {
    assertNumberRange(changes.votingDelay, "votingDelay", 0);
  }
  if (changes.votingPeriod !== undefined) {
    assertNumberRange(changes.votingPeriod, "votingPeriod", 0);
  }
  if (changes.proposalThreshold !== undefined) {
    assertNumberRange(changes.proposalThreshold, "proposalThreshold", 0, 100);
  }
  if (changes.quorumPercent !== undefined) {
    assertNumberRange(changes.quorumPercent, "quorumPercent", 0, 100);
  }
  if (changes.executionDelay !== undefined) {
    assertNumberRange(changes.executionDelay, "executionDelay", 0);
  }
}

export function assertNumberRange(
  value: number,
  field: string,
  min: number,
  max?: number,
) {
  if (
    !Number.isFinite(value) ||
    value < min ||
    (max !== undefined && value > max)
  ) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: max === undefined
        ? `${field} must be greater than or equal to ${min}`
        : `${field} must be between ${min} and ${max}`,
      meta: { [field]: value },
    });
  }
}

function encodePercent(percentage: number): bigint {
  return parseEther(new Decimal(percentage).div(100).toFixed());
}

function getQuorumNumerator(percent: number, denominator: number): bigint {
  const basisPoints = Math.round(percent * 100);

  return (BigInt(basisPoints) * BigInt(denominator)) / 10_000n;
}
