import { formatUnits, type Address } from "viem";
import type { Amount } from "../types/index-dtf.js";

export function dedupeAddresses(
  addresses: readonly Address[],
): readonly Address[] {
  return [...new Set(addresses)];
}

export function getCurrentTime(): number {
  return Math.floor(Date.now() / 1000);
}

export function mapAmount(value: unknown, decimals: number): Amount {
  const raw = typeof value === "bigint" ? value : BigInt(String(value));

  return {
    raw,
    formatted: formatUnits(raw, decimals),
  };
}
