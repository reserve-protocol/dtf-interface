import type { Address, PublicClient } from "viem";
import { erc20Abi } from "viem";
import { SdkError } from "../errors.js";
import type { Token } from "../types/common.js";

export { getTokenPrices, getTokenVolatilities } from "./prices.js";

export async function getTokenData(
  publicClient: PublicClient,
  address: Address,
): Promise<Token> {
  const [token] = await getTokensData(publicClient, [address]);

  if (!token) {
    throw new SdkError({
      code: "RECORD_NOT_FOUND",
      message: `Token metadata not found: ${address}`,
      meta: {
        address,
        entity: "token",
      },
    });
  }

  return token;
}

export async function getTokensData(
  publicClient: PublicClient,
  addresses: Address[],
): Promise<readonly Token[]> {
  if (addresses.length === 0) {
    return [];
  }

  const results = await publicClient.multicall({
    allowFailure: false,
    contracts: addresses.flatMap((address) => [
      {
        address,
        abi: erc20Abi,
        functionName: "name",
      },
      {
        address,
        abi: erc20Abi,
        functionName: "symbol",
      },
      {
        address,
        abi: erc20Abi,
        functionName: "decimals",
      },
    ]),
  });

  return addresses.map((address, index) => {
    const offset = index * 3;

    return {
      address,
      name: results[offset] as string,
      symbol: results[offset + 1] as string,
      decimals: results[offset + 2] as number,
    };
  });
}
