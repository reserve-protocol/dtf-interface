import { getAddress, isAddressEqual } from "viem";

import type { ProposalContext } from "@/rebalance-validation/context";
import type { Report } from "@/rebalance-validation/report";

/**
 * A routine rebalance is exactly one `startRebalance` on the DTF, submitted
 * through the trading governor whose timelock holds REBALANCE_MANAGER. A wrong
 * governor produces a proposal that can pass and then revert on execution;
 * anything bundled alongside the rebalance is a different review entirely.
 */
export function checkGovernanceRouting(report: Report, context: ProposalContext): void {
  const { proposal, rebalance, dtf, otherActions } = context;

  if (otherActions.length > 0) {
    report.record(
      "disasters",
      "fail",
      "proposal bundles actions other than startRebalance",
      otherActions.map((action) => `${action.target} -> ${action.functionName}`).join(" · "),
    );
  } else {
    report.record("disasters", "pass", `single startRebalance action (${rebalance.abiLabel} ABI)`);
  }

  if (!isAddressEqual(rebalance.target, getAddress(dtf.id))) {
    report.record("disasters", "fail", "startRebalance targets another contract", rebalance.target);
  }

  const approvers = [...dtf.roles.rebalance.auctionApprovers].map((address) => getAddress(address));
  const timelock = getAddress(proposal.timelock);
  const isRebalanceGovernor = approvers.some((approver) => isAddressEqual(approver, timelock));
  report.record(
    "disasters",
    isRebalanceGovernor ? "pass" : "fail",
    isRebalanceGovernor
      ? "routed through the trading governor whose timelock is REBALANCE_MANAGER"
      : "proposal governor's timelock does not hold REBALANCE_MANAGER",
    `governor ${proposal.governance} -> timelock ${timelock} · approvers ${approvers.join(", ") || "none"}`,
  );
}

/**
 * `ttl > auctionLauncherWindow` leaves a tail in which anyone can open the
 * auction. That is a deliberate choice per DTF, so it is reported rather than
 * judged — but a TTL shorter than the window is always wrong.
 */
export function checkAuctionTiming(report: Report, context: ProposalContext): void {
  const { auctionLauncherWindow, ttl } = context.rebalance;
  const hours = (seconds: bigint) => `${Number(seconds) / 3600}h`;
  const openWindow = ttl - auctionLauncherWindow;

  report.record(
    "outcomes",
    ttl < auctionLauncherWindow ? "fail" : openWindow > 0n ? "warn" : "pass",
    ttl < auctionLauncherWindow
      ? "ttl expires before the auction launcher window closes"
      : openWindow > 0n
        ? "permissionless tail: anyone can open the auction after the launcher window"
        : "auction launcher has the whole rebalance window",
    `launcher window ${hours(auctionLauncherWindow)} · ttl ${hours(ttl)} · permissionless tail ${hours(openWindow)}`,
  );
}
