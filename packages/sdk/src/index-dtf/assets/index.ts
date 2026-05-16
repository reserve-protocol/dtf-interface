import type { Address } from "viem";

import type { DtfClient } from "@/client";
import type { SupportedChainId } from "@/config";
import type { TokenVolatility } from "@/types/common";

export type GetAssetListParams = {
  chainId: SupportedChainId;
  unfiltered: boolean;
};

export type Asset = {
  chainId: SupportedChainId;
  decimals: number;
  volatility: TokenVolatility;
  address: Address;
  name: string;
  symbol: string;
};

export async function getAssetList(client: DtfClient, params: GetAssetListParams): Promise<Readonly<Asset[]>> {
  const { chainId, unfiltered } = params;

  return client.api.get<readonly Asset[]>({
    path: "/zapper/tokens",
    query: {
      chainId,
      unfiltered,
    },
  });
}
