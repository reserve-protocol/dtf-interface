import { base, bsc, mainnet } from "viem/chains";

export const DEFAULT_API_BASE_URL = "https://api.reserve.org";

export const SUPPORTED_CHAINS = {
  [mainnet.id]: mainnet,
  [base.id]: base,
  [bsc.id]: bsc,
} as const;

export type SupportedChainId = keyof typeof SUPPORTED_CHAINS;

export const supportedChainIds = Object.keys(SUPPORTED_CHAINS).map(
  Number,
) as SupportedChainId[];

export const YIELD_DTF_SUBGRAPH_URL = {
  [mainnet.id]:
    "https://api.goldsky.com/api/public/project_cmgzim3e100095np2gjnbh6ry/subgraphs/dtf-yield-mainnet/4.2.0-v2/gn",
  [base.id]:
    "https://api.goldsky.com/api/public/project_cmgzim3e100095np2gjnbh6ry/subgraphs/dtf-yield-base/4.2.0-v2/gn",
  [bsc.id]:
    "https://api.goldsky.com/api/public/project_cmgzim3e100095np2gjnbh6ry/subgraphs/reserve-arbitrum/prod/gn",
} as const satisfies Partial<Record<SupportedChainId, string>>;

export const INDEX_DTF_SUBGRAPH_URL = {
  [mainnet.id]:
    "https://api.goldsky.com/api/public/project_cmgzim3e100095np2gjnbh6ry/subgraphs/dtf-index-mainnet/prod/gn",
  [base.id]:
    "https://api.goldsky.com/api/public/project_cmgzim3e100095np2gjnbh6ry/subgraphs/dtf-index-base/prod/gn",
  [bsc.id]:
    "https://api.goldsky.com/api/public/project_cmgzim3e100095np2gjnbh6ry/subgraphs/dtf-index-bsc/prod/gn",
} as const satisfies Partial<Record<SupportedChainId, string>>;

export const DEFAULT_SUBGRAPH_URLS = INDEX_DTF_SUBGRAPH_URL;
