import { isAddress } from "viem";

export function normalizeQueryKeyValue(value: unknown): unknown {
  if (typeof value === "bigint") {
    return value.toString();
  }

  if (typeof value === "string") {
    return isAddress(value) ? value.toLowerCase() : value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => normalizeQueryKeyValue(item));
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  const normalized: Record<string, unknown> = {};

  for (const key of Object.keys(value).sort()) {
    const normalizedValue = normalizeQueryKeyValue((value as Record<string, unknown>)[key]);

    if (normalizedValue !== undefined) {
      normalized[key] = normalizedValue;
    }
  }

  return normalized;
}
