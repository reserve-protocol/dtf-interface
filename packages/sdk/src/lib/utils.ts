import { formatUnits, getAddress, type Address } from "viem";

import type { Amount } from "../types/common.js";

export function dedupeAddresses(addresses: readonly Address[]): readonly Address[] {
  return [...new Set(addresses)];
}

export function getCurrentTime(): number {
  return Math.floor(Date.now() / 1000);
}

export function mapAmount(value: unknown, decimals = 18): Amount {
  const raw = typeof value === "bigint" ? value : BigInt(String(value));

  return {
    raw,
    formatted: formatUnits(raw, decimals),
  };
}

export function uniqueAddresses(addresses: readonly Address[]): Address[] {
  const seen = new Set<string>();
  const result: Address[] = [];

  for (const address of addresses) {
    const normalized = getAddress(address);
    const key = normalized.toLowerCase();

    if (!seen.has(key)) {
      seen.add(key);
      result.push(normalized);
    }
  }

  return result;
}

export function sameAddress(a: string, b: string): boolean {
  return a.toLowerCase() === b.toLowerCase();
}
