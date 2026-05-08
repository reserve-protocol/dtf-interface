import { Decimal } from "decimal.js-light";
import { encodeFunctionData, parseEther, type Address } from "viem";
import { SdkError } from "../../../errors.js";
import type { IndexDtfCall } from "../../../types/governance.js";
import { dtfIndexGovernanceAbi } from "../../abis/dtf-index-governance.js";
import { timelockAbi } from "../../abis/timelock.js";
import type { IndexDtfGovernanceChanges } from "./settings-types.js";

export function buildGovernanceCalls({
  changes,
  governance,
  quorumDenominator,
  timelock,
}: {
  readonly governance: Address | undefined;
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
    calls.push(encodeGovernanceCall(governance, "setVotingDelay", [changes.votingDelay]));
  }
  if (changes.votingPeriod !== undefined) {
    calls.push(encodeGovernanceCall(governance, "setVotingPeriod", [changes.votingPeriod]));
  }
  if (changes.proposalThreshold !== undefined) {
    calls.push(encodeGovernanceCall(governance, "setProposalThreshold", [encodePercent(changes.proposalThreshold)]));
  }
  if (changes.quorumPercent !== undefined) {
    if (quorumDenominator === undefined) {
      throw new SdkError({
        code: "INVALID_INPUT",
        message: "quorumDenominator is required to build a quorum proposal",
      });
    }
    calls.push(encodeGovernanceCall(governance, "updateQuorumNumerator", [
      getQuorumNumerator(changes.quorumPercent, quorumDenominator),
    ]));
  }
  if (changes.executionDelay !== undefined) {
    if (!timelock) {
      throw new SdkError({
        code: "INVALID_INPUT",
        message: "timelock is required to build an execution delay proposal",
      });
    }
    calls.push({
      target: timelock,
      calldata: encodeFunctionData({
        abi: timelockAbi,
        functionName: "updateDelay",
        args: [BigInt(Math.round(changes.executionDelay))],
      }),
    });
  }

  return calls;
}

function encodeGovernanceCall(target: Address, functionName: string, args: readonly unknown[]): IndexDtfCall {
  return {
    target,
    calldata: encodeFunctionData({
      abi: dtfIndexGovernanceAbi,
      functionName,
      args,
    } as never),
  };
}

function validateGovernanceChanges(changes: IndexDtfGovernanceChanges) {
  if (changes.votingDelay !== undefined) assertNumberRange(changes.votingDelay, "votingDelay", 0);
  if (changes.votingPeriod !== undefined) assertNumberRange(changes.votingPeriod, "votingPeriod", 0);
  if (changes.proposalThreshold !== undefined) assertNumberRange(changes.proposalThreshold, "proposalThreshold", 0, 100);
  if (changes.quorumPercent !== undefined) assertNumberRange(changes.quorumPercent, "quorumPercent", 0, 100);
  if (changes.executionDelay !== undefined) assertNumberRange(changes.executionDelay, "executionDelay", 0);
}

export function assertNumberRange(value: number, field: string, min: number, max?: number) {
  if (!Number.isFinite(value) || value < min || (max !== undefined && value > max)) {
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
