import type { WalletClient } from "viem";
import type { SupportedChainId } from "../../defaults.js";
import type { IndexDtfGovernanceWriter } from "../../types/governance.js";
import { writeAccountDelegate } from "./delegation-actions.js";
import {
  writeProposal,
  writeProposalCancel,
  writeProposalExecute,
  writeProposalQueue,
  writeProposalVote,
} from "./proposal-actions.js";

export * from "./delegates.js";
export * from "./delegation-actions.js";
export * from "./guardians.js";
export * from "./proposal-actions.js";
export * from "./propose/index.js";
export * from "./proposals.js";
export * from "./utils.js";
export * from "./voting.js";

export function createIndexDtfRefGovernanceWriter(
  walletClient: WalletClient,
  chainId: SupportedChainId,
): IndexDtfGovernanceWriter {
  return {
    delegate: (params) =>
      writeAccountDelegate(walletClient, { ...params, chainId }),
    vote: (params) => writeProposalVote(walletClient, { ...params, chainId }),
    queue: (proposal, options) =>
      writeProposalQueue(walletClient, { ...options, chainId, proposal }),
    execute: (proposal, options) =>
      writeProposalExecute(walletClient, { ...options, chainId, proposal }),
    cancel: (proposal, options) =>
      writeProposalCancel(walletClient, { ...options, chainId, proposal }),
    propose: (params) => writeProposal(walletClient, { ...params, chainId }),
  };
}
