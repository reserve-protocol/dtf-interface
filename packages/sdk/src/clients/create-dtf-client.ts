import {
  createPublicClient,
  fallback,
  http as viemHttp,
  type Chain,
  type PublicClient,
  type Transport,
} from "viem";
import {
  DEFAULT_API_BASE_URL,
  INDEX_DTF_SUBGRAPH_URL,
  SUPPORTED_CHAINS,
  YIELD_DTF_SUBGRAPH_URL,
  type SupportedChainId,
} from "../defaults.js";
import type {
  IndexBrandProvider,
  IndexPricingProvider,
} from "../sdk/index/index.js";

export type DtfChainConfig = {
  readonly chain?: Chain;
  readonly indexSubgraphUrl?: string;
  readonly publicClient?: PublicClient;
  readonly rpcUrls?: readonly string[];
  readonly yieldSubgraphUrl?: string;
};

export type DtfClientConfig = {
  readonly apiBaseUrl?: string;
  readonly chains?: Partial<Record<SupportedChainId, DtfChainConfig>>;
  readonly indexBrandProvider?: IndexBrandProvider;
  readonly indexPricingProvider?: IndexPricingProvider;
};

export type DtfClient = {
  readonly apiBaseUrl: string;
  readonly chains: Partial<Record<SupportedChainId, DtfChainConfig>>;
  readonly indexBrandProvider: IndexBrandProvider | undefined;
  readonly indexPricingProvider: IndexPricingProvider | undefined;
  readonly getIndexSubgraphUrl: (chainId: SupportedChainId) => string;
  readonly getPublicClient: (chainId: SupportedChainId) => PublicClient;
  readonly getYieldSubgraphUrl: (chainId: SupportedChainId) => string;
};

export type DtfClientOptions = {
  readonly client?: DtfClient | undefined;
};

export function createDtfClient(config: DtfClientConfig = {}): DtfClient {
  const chains = createChainConfig(config.chains);
  const publicClients = getConfiguredPublicClients(chains);

  return {
    apiBaseUrl: trimTrailingSlash(config.apiBaseUrl ?? DEFAULT_API_BASE_URL),
    chains,
    indexBrandProvider: config.indexBrandProvider,
    indexPricingProvider: config.indexPricingProvider,
    getIndexSubgraphUrl(chainId: SupportedChainId) {
      const url = chains[chainId]?.indexSubgraphUrl;

      if (!url) {
        throw new Error(`No Index DTF subgraph configured for chain id: ${chainId}`);
      }

      return url;
    },
    getPublicClient(chainId: SupportedChainId) {
      const chainConfig = chains[chainId];
      if (!chainConfig) {
        throw new Error(`Unsupported chain id: ${chainId}`);
      }

      publicClients[chainId] ??= createDefaultPublicClient(
        chainId,
        chainConfig.chain,
        chainConfig.rpcUrls,
      );

      return publicClients[chainId];
    },
    getYieldSubgraphUrl(chainId: SupportedChainId) {
      const url = chains[chainId]?.yieldSubgraphUrl;

      if (!url) {
        throw new Error(`No Yield DTF subgraph configured for chain id: ${chainId}`);
      }

      return url;
    },
  };
}

export function resolveDtfClient(client?: DtfClient): DtfClient {
  return client ?? createDtfClient();
}

function createDefaultPublicClient(
  chainId: SupportedChainId,
  chain: Chain | undefined,
  rpcUrls: readonly string[] | undefined,
): PublicClient {
  if (!chain) {
    throw new Error(`Unsupported chain id: ${chainId}`);
  }

  const transport: Transport =
    rpcUrls && rpcUrls.length > 0
      ? fallback(rpcUrls.map((url) => viemHttp(url)))
      : viemHttp();

  return createPublicClient({ chain, transport });
}

function createChainConfig(
  overrides: Partial<Record<SupportedChainId, DtfChainConfig>> = {},
): Partial<Record<SupportedChainId, DtfChainConfig>> {
  return Object.fromEntries(
    supportedChainEntries().map(([chainId, chain]) => [
      chainId,
      {
        chain,
        indexSubgraphUrl: INDEX_DTF_SUBGRAPH_URL[chainId],
        yieldSubgraphUrl: YIELD_DTF_SUBGRAPH_URL[chainId],
        ...overrides[chainId],
      },
    ]),
  ) as Partial<Record<SupportedChainId, DtfChainConfig>>;
}

function getConfiguredPublicClients(
  chains: Partial<Record<SupportedChainId, DtfChainConfig>>,
): Partial<Record<SupportedChainId, PublicClient>> {
  const publicClients: Partial<Record<SupportedChainId, PublicClient>> = {};

  for (const [chainId, chainConfig] of Object.entries(chains)) {
    if (chainConfig.publicClient) {
      publicClients[Number(chainId) as SupportedChainId] =
        chainConfig.publicClient;
    }
  }

  return publicClients;
}

function supportedChainEntries(): readonly (readonly [SupportedChainId, Chain])[] {
  return Object.entries(SUPPORTED_CHAINS).map(([chainId, chain]) => [
    Number(chainId) as SupportedChainId,
    chain,
  ]);
}

function trimTrailingSlash(value: string): string {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}
