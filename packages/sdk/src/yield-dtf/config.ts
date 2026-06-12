import type { Address } from "viem";

import type { SupportedChainId } from "@/config";

import { SdkError } from "@/lib/errors";

/** Chains with deployed Yield DTF protocol + subgraph coverage. */
export type YieldDtfChainId = 1 | 8453;

export const FACADE_READ_ADDRESS: Record<YieldDtfChainId, Address> = {
  1: "0x2C7ca56342177343A2954C250702Fd464f4d0613",
  8453: "0xeb2071e9b542555e90e6e4e1f83fa17423583991",
};

export const FACADE_ACT_ADDRESS: Record<YieldDtfChainId, Address> = {
  1: "0xCa60954E8819827B0C56e1ec313175fE68712d98",
  8453: "0x72Be467048a4D9CbcC599251243f3eD9F46a42f5",
};

export const RSR_ADDRESS: Record<YieldDtfChainId, Address> = {
  1: "0x320623b8E4fF03373931769A31Fc52A4E78B5d70",
  8453: "0xaB36452DbAC151bE02b16Ca17d8919826072f64a",
};

export function requireYieldDtfChainId(chainId: SupportedChainId): YieldDtfChainId {
  if (chainId === 1 || chainId === 8453) {
    return chainId;
  }

  throw new SdkError({
    code: "INVALID_INPUT",
    message: `Yield DTFs are not deployed on chain ${chainId}.`,
    meta: { chainId, product: "yield" },
  });
}
