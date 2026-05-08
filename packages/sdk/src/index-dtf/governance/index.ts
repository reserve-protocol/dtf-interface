import type { WalletClient } from "viem";
import type { SupportedChainId } from "../../defaults.js";
import type { IndexDtfGovernanceWriter } from "../../types/governance.js";
import { delegate } from "./delegation-actions.js";
import {
  cancel,
  execute,
  propose,
  queue,
  vote,
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
    delegate: (params) => delegate(walletClient, { ...params, chainId }),
    vote: (params) => vote(walletClient, { ...params, chainId }),
    queue: (params) => queue(walletClient, { ...params, chainId }),
    execute: (params) => execute(walletClient, { ...params, chainId }),
    cancel: (params) => cancel(walletClient, { ...params, chainId }),
    propose: (params) => propose(walletClient, { ...params, chainId }),
  };
}
