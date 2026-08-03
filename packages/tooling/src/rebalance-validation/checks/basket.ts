import type { DtfSdk } from "@reserve-protocol/sdk";
import type { Address } from "viem";

import { getAddress } from "viem";

import type { ProposalContext } from "@/rebalance-validation/context";
import type { Report } from "@/rebalance-validation/report";

import { ordersOfMagnitude } from "@/rebalance-validation/checks/prices";
import { decodeStartRebalance, recoverTokenInputs } from "@/rebalance-validation/start-rebalance";

/** Weight changes past this are the mispriced-asset / wrong-decimals signature, not a rebalance. */
export const WEIGHT_MAGNITUDE_FAIL = 0.5;

/**
 * Membership diff against the live basket. Additions are the entire scam-token
 * risk surface and removals move the whole position, so both are always
 * surfaced; an existing asset missing from the calldata is worse — it is
 * excluded from the rebalance and silently stranded.
 */
export function checkBasketMembership(report: Report, context: ProposalContext): void {
  const proposed = new Map(context.tokens.map((token) => [token.address, token]));
  const held = [...context.currentBalances.entries()].filter(([, balance]) => balance > 0n).map(([address]) => address);
  const additions = context.tokens.filter((token) => !context.currentBalances.has(token.address));
  const stranded = held.filter((address) => !proposed.has(address));
  const exits = context.rebalance.tokens.filter(
    (token) => token.weight.spot === 0n && (context.currentBalances.get(token.token) ?? 0n) > 0n,
  );

  report.record(
    "disasters",
    stranded.length === 0 ? "pass" : "fail",
    stranded.length === 0
      ? `every held asset appears in the calldata (${held.length} held, ${context.tokens.length} proposed)`
      : "held assets are missing from the calldata and would be stranded",
    stranded.join(", ") || undefined,
  );

  if (additions.length > 0 || exits.length > 0) {
    report.record(
      "disasters",
      "warn",
      "basket membership changes in this rebalance",
      [
        additions.length > 0 ? `added: ${additions.map((token) => `${token.symbol} ${token.address}`).join(", ")}` : "",
        exits.length > 0
          ? `exited to zero weight: ${exits.map((token) => symbolOf(context, token.token)).join(", ")}`
          : "",
      ]
        .filter(Boolean)
        .join(" · "),
    );
  }
}

export type PreviousRebalance = {
  readonly title: string;
  readonly unitsPerShare: ReadonlyMap<Address, number>;
};

/**
 * Loads the most recent executed rebalance for the same DTF, so the new weights
 * can be sanity-checked against weights that already survived execution.
 */
export async function fetchPreviousRebalance(
  sdk: DtfSdk,
  context: ProposalContext,
): Promise<PreviousRebalance | undefined> {
  const address = getAddress(context.dtf.id);
  const candidates = await sdk.index.getProposals({ address, chainId: context.chainId, limit: 20 });

  for (const candidate of candidates) {
    if (candidate.id === context.proposal.id || candidate.votingState.state !== "EXECUTED") continue;
    const detail = await sdk.index.getProposal({ address, chainId: context.chainId, proposalId: candidate.id });
    const decoded = detail.targets.flatMap((target, index) => {
      const callData = detail.calldatas[index];
      const action = callData ? decodeStartRebalance(target, callData) : undefined;

      return action ? [action] : [];
    })[0];
    if (!decoded) continue;
    const decimalsByToken = new Map(context.tokens.map((token) => [token.address, token.decimals]));

    return {
      title: detail.description.split("\n")[0]?.replace(/^#+\s*/, "") ?? candidate.id,
      unitsPerShare: new Map(
        decoded.tokens.flatMap((token) => {
          const decimals = decimalsByToken.get(token.token);

          return decimals === undefined
            ? []
            : [[token.token, recoverTokenInputs(token, decimals).wholeTokensPerShare] as const];
        }),
      ),
    };
  }

  return undefined;
}

/**
 * Compares per-share units with the last executed rebalance. Real rebalances
 * move weights by percent; an order-of-magnitude move means the model of the
 * world changed, not the target.
 */
export function checkWeightHistory(
  report: Report,
  context: ProposalContext,
  previous: PreviousRebalance | undefined,
): void {
  if (!previous) {
    report.record("disasters", "warn", "no previous executed rebalance to compare weights against");

    return;
  }

  const jumps: string[] = [];
  let worst = { symbol: "-", magnitudes: 0 };

  for (const [index, token] of context.rebalance.tokens.entries()) {
    const meta = context.tokens[index]!;
    const before = previous.unitsPerShare.get(token.token);
    if (before === undefined) continue;
    const after = recoverTokenInputs(token, meta.decimals).wholeTokensPerShare;
    const magnitudes = ordersOfMagnitude(after, before);
    if (magnitudes > worst.magnitudes) worst = { symbol: meta.symbol, magnitudes };
    if (magnitudes >= WEIGHT_MAGNITUDE_FAIL) {
      jumps.push(`${meta.symbol}: ${before} -> ${after} units/share (${magnitudes.toFixed(2)} orders)`);
    }
  }

  report.record(
    "disasters",
    jumps.length === 0 ? "pass" : "fail",
    jumps.length === 0
      ? `per-share units in line with "${previous.title}" (worst ${worst.symbol} ${worst.magnitudes.toFixed(2)} orders)`
      : `per-share units jump by an order of magnitude vs "${previous.title}"`,
    jumps.join(" · ") || undefined,
  );
}

const symbolOf = (context: ProposalContext, address: Address): string =>
  context.tokens.find((token) => token.address === address)?.symbol ?? address;
