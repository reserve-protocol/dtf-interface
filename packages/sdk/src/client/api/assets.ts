import { getAddress } from "viem";

import type { DtfClient } from "@/client";
import type { Asset, GetAssetListParams } from "@/types/api";

export async function getAssetList(client: DtfClient, params: GetAssetListParams): Promise<Readonly<Asset[]>> {
  const { chainId, unfiltered } = params;

  const assets = await client.api.get<readonly Asset[]>({
    path: "/zapper/tokens",
    query: {
      chainId,
      unfiltered,
    },
  });

  return assets.map((asset) => ({
    ...asset,
    address: getAddress(asset.address),
  }));
}
