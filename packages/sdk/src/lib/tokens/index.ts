import type { Address, PublicClient } from "viem";

import { encodeFunctionData, erc20Abi, hexToBytes } from "viem";

import type { Token } from "@/types/common";

import { SdkError } from "@/lib/errors";
export { getTokenPrices, getTokenVolatilities } from "@/lib/tokens/prices";

export async function getTokenData(publicClient: PublicClient, address: Address): Promise<Token> {
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
  addresses: readonly Address[],
): Promise<readonly Token[]> {
  if (addresses.length === 0) {
    return [];
  }

  const results = await publicClient.multicall({
    allowFailure: true,
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

  const metadata = await Promise.all(
    results.map(async (result, index) => {
      if (result.status === "success") return result.result;
      if (index % 3 === 2) throw result.error;

      // Legacy ERC20s can return bytes32 instead of string for name/symbol.
      const { data } = await publicClient.call({
        to: addresses[Math.floor(index / 3)]!,
        data: encodeFunctionData({ abi: erc20Abi, functionName: index % 3 === 0 ? "name" : "symbol" }),
      });
      if (!data || data.length !== 66) throw result.error;
      const bytes = hexToBytes(data);
      let end = bytes.length;
      while (end > 0 && bytes[end - 1] === 0) end--;
      return new TextDecoder("utf-8", { fatal: true }).decode(bytes.subarray(0, end));
    }),
  );

  return addresses.map((address, index) => {
    const offset = index * 3;

    return {
      address,
      name: metadata[offset] as string,
      symbol: metadata[offset + 1] as string,
      decimals: metadata[offset + 2] as number,
    };
  });
}
