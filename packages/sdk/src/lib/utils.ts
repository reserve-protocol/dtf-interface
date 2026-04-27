import type { Address } from "viem";

export function dedupeAddresses(
  addresses: readonly Address[],
): readonly Address[] {
  return [...new Set(addresses)];
}
