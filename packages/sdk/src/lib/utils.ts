import { formatUnits, getAddress, type Address } from "viem";

import type { Amount } from "@/types/common";

import { SdkError } from "@/lib/errors";

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

export function toUint(value: number | bigint, field: string): bigint {
  if (typeof value === "bigint") {
    if (value < 0n) {
      throw new SdkError({ code: "INVALID_INPUT", message: `${field} must be non-negative`, meta: { [field]: value } });
    }

    return value;
  }

  if (!Number.isFinite(value) || !Number.isInteger(value) || value < 0) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: `${field} must be a non-negative integer`,
      meta: { [field]: value },
    });
  }

  return BigInt(value);
}

export function toUintNumber(value: number | bigint, field: string): number {
  const integer = toUint(value, field);

  if (integer > BigInt(Number.MAX_SAFE_INTEGER)) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: `${field} is too large to encode safely`,
      meta: { [field]: value },
    });
  }

  return Number(integer);
}
