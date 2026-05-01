import type { Address } from "viem";
import type { DtfClient } from "../../client.js";
import { SdkError } from "../../errors.js";
import { dedupeAddresses } from "../../lib/utils.js";
import type {
  GetIndexDtfProposalParams,
  GetIndexDtfProposalsParams,
  IndexDtf,
  IndexDtfProposalDetail,
  IndexDtfProposalSummary,
} from "../../types/index-dtf.js";

export function getIndexDtfProposalGovernanceAddresses(
  dtf: IndexDtf,
): readonly Address[] {
  return dedupeAddresses([
    ...dtf.governance.all.flatMap((authority) =>
      authority.type === "governance" ? [authority.address] : [],
    ),
    ...(dtf.governance.voteLock?.type === "governance"
      ? [dtf.governance.voteLock.address]
      : []),
    ...dtf.roles.admin.legacy,
    ...dtf.roles.rebalance.legacyAuctionApprovers,
    ...(dtf.voteLockVault?.legacyGovernance ?? []),
  ]);
}

export async function getIndexDtfProposals(
  _client: DtfClient,
  _params: GetIndexDtfProposalsParams,
): Promise<readonly IndexDtfProposalSummary[]> {
  throw new SdkError({
    code: "NOT_IMPLEMENTED",
    message: "getIndexDtfProposals is not implemented yet.",
    meta: { method: "getIndexDtfProposals" },
  });
}

export async function getIndexDtfProposal(
  _client: DtfClient,
  _params: GetIndexDtfProposalParams,
): Promise<IndexDtfProposalDetail> {
  throw new SdkError({
    code: "NOT_IMPLEMENTED",
    message: "getIndexDtfProposal is not implemented yet.",
    meta: { method: "getIndexDtfProposal" },
  });
}
