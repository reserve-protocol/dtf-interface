import { getAddress, type Address } from "viem";
import type { DtfParams } from "../types/common.js";
import type { IndexDtf, IndexDtfInput } from "../types/index-dtf.js";

export type IndexDtfIdentity = {
  readonly address: Address;
  readonly chainId: DtfParams["chainId"];
};

export function getIndexDtfIdentity(input: IndexDtfInput): IndexDtfIdentity {
  if ("id" in input) {
    return {
      address: getAddress(input.id),
      chainId: input.chainId,
    };
  }

  return {
    address: getAddress(input.address),
    chainId: input.chainId,
  };
}

export function getOptionalIndexDtfIdentity(
  input: IndexDtf | DtfParams | undefined,
): IndexDtfIdentity | undefined {
  return input ? getIndexDtfIdentity(input) : undefined;
}

export function sameAddress(a: string, b: string): boolean {
  return a.toLowerCase() === b.toLowerCase();
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
