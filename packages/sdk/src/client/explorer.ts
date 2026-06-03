import { getAddress, type Abi, type Address } from "viem";

import type { SupportedChainId } from "@/config";

const EXPLORER_REQUEST_TIMEOUT_MS = 5_000;

export type DtfClientExplorerContractMetadata = {
  readonly abi: Abi;
  readonly contractName: string;
};

export type DtfClientExplorer = {
  readonly getContractMetadata: (params: {
    readonly chainId: SupportedChainId;
    readonly address: Address;
  }) => Promise<DtfClientExplorerContractMetadata | null>;
};

type EtherscanSourceCodeResponse = {
  readonly status?: string;
  readonly message?: string;
  readonly result?:
    | readonly {
        readonly ABI?: string;
        readonly ContractName?: string;
      }[]
    | string;
};

export function createDtfClientExplorer({ etherscanApiKey }: { readonly etherscanApiKey?: string | undefined }): DtfClientExplorer {
  const metadataCache = new Map<string, DtfClientExplorerContractMetadata>();
  const requestCache = new Map<string, Promise<DtfClientExplorerContractMetadata | null>>();

  return {
    getContractMetadata(params) {
      if (!etherscanApiKey) {
        return Promise.resolve(null);
      }

      const address = getAddress(params.address);
      const cacheKey = `${params.chainId}:${address.toLowerCase()}`;
      const cached = metadataCache.get(cacheKey);

      if (cached) {
        return Promise.resolve(cached);
      }

      const pending = requestCache.get(cacheKey);
      if (pending) {
        return pending;
      }

      const request = fetchContractMetadata({
        chainId: params.chainId,
        address,
        etherscanApiKey,
      })
        .catch(() => null)
        .then((metadata) => {
          if (metadata) {
            metadataCache.set(cacheKey, metadata);
          }

          return metadata;
        })
        .finally(() => {
          requestCache.delete(cacheKey);
        });

      requestCache.set(cacheKey, request);

      return request;
    },
  };
}

async function fetchContractMetadata({
  chainId,
  address,
  etherscanApiKey,
}: {
  readonly chainId: SupportedChainId;
  readonly address: Address;
  readonly etherscanApiKey: string;
}): Promise<DtfClientExplorerContractMetadata | null> {
  const url = new URL("https://api.etherscan.io/v2/api");
  url.searchParams.set("chainid", String(chainId));
  url.searchParams.set("module", "contract");
  url.searchParams.set("action", "getsourcecode");
  url.searchParams.set("address", address);
  url.searchParams.set("apikey", etherscanApiKey);

  const response = await fetch(url, {
    signal: AbortSignal.timeout(EXPLORER_REQUEST_TIMEOUT_MS),
  });
  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as EtherscanSourceCodeResponse;
  if (data.status !== "1" || !Array.isArray(data.result)) {
    return null;
  }

  const metadata = data.result[0];
  if (!metadata?.ABI || !metadata.ContractName || metadata.ABI === "Contract source code not verified") {
    return null;
  }

  try {
    const abi = JSON.parse(metadata.ABI) as Abi;

    if (!Array.isArray(abi)) {
      return null;
    }

    return {
      abi,
      contractName: metadata.ContractName,
    };
  } catch {
    return null;
  }
}
