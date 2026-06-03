import { createDtfClientApi, type DtfClientApi } from "@/client/api";
import { createDtfClientExplorer, type DtfClientExplorer } from "@/client/explorer";
import { createDtfClientSubgraph, type DtfClientSubgraph, type DtfClientSubgraphChainConfig } from "@/client/subgraph";
import { createDtfClientViem, type DtfClientViem, type DtfClientViemChainConfig } from "@/client/viem";
import {
  DEFAULT_API_BASE_URL,
  DEFAULT_RPC_URLS,
  INDEX_DTF_SUBGRAPH_URL,
  SUPPORTED_CHAINS,
  YIELD_DTF_SUBGRAPH_URL,
  supportedChainIds,
  type SupportedChainId,
} from "@/config";

export type DtfChainConfig = DtfClientSubgraphChainConfig & DtfClientViemChainConfig;

export type DtfClientConfig = {
  readonly apiBaseUrl?: string;
  readonly chains?: Partial<Record<SupportedChainId, DtfChainConfig>>;
  readonly etherscanApiKey?: string | undefined;
};

export type DtfClient = {
  readonly api: DtfClientApi;
  readonly explorer: DtfClientExplorer;
  readonly subgraph: DtfClientSubgraph;
  readonly viem: DtfClientViem;
};

export function createDtfClient(config: DtfClientConfig = {}): DtfClient {
  const apiBaseUrl = trimTrailingSlash(config.apiBaseUrl ?? DEFAULT_API_BASE_URL);
  const chains = createChainConfig(config.chains);

  return {
    api: createDtfClientApi({ baseUrl: apiBaseUrl }),
    explorer: createDtfClientExplorer({ etherscanApiKey: config.etherscanApiKey }),
    subgraph: createDtfClientSubgraph({ chains }),
    viem: createDtfClientViem({ chains }),
  };
}

function createChainConfig(
  overrides: Partial<Record<SupportedChainId, DtfChainConfig>> = {},
): Partial<Record<SupportedChainId, DtfChainConfig>> {
  return Object.fromEntries(
    supportedChainIds.map((chainId) => {
      const override = overrides[chainId];

      return [
        chainId,
        {
          chain: SUPPORTED_CHAINS[chainId],
          indexSubgraphUrl: INDEX_DTF_SUBGRAPH_URL[chainId],
          ...(chainId in YIELD_DTF_SUBGRAPH_URL
            ? {
                yieldSubgraphUrl: YIELD_DTF_SUBGRAPH_URL[chainId],
              }
            : {}),
          ...override,
          rpcUrls: dedupeRpcUrls([...(override?.rpcUrls ?? []), ...DEFAULT_RPC_URLS[chainId]]),
        },
      ];
    }),
  ) as Partial<Record<SupportedChainId, DtfChainConfig>>;
}

function dedupeRpcUrls(rpcUrls: readonly string[]): readonly string[] {
  return [...new Set(rpcUrls)];
}

function trimTrailingSlash(value: string): string {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}
