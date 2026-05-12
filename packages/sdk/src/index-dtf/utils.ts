import { getAddress, type Address } from "viem";

import type { IndexDtf, IndexDtfInput } from "@/types/index-dtf";

export function getIndexDtfIdentity(input: IndexDtfInput): {
  readonly address: Address;
  readonly chainId: IndexDtf["chainId"];
} {
  if ("id" in input) {
    return { address: getAddress(input.id), chainId: input.chainId };
  }

  return { address: getAddress(input.address), chainId: input.chainId };
}
