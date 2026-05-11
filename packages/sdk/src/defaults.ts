import type { Chain } from "viem";

import { base, bsc, mainnet } from "viem/chains";

export const DEFAULT_API_BASE_URL = "https://api.reserve.org";

export type SupportedChainId = 1 | 8453 | 56;

export const SUPPORTED_CHAINS: Record<SupportedChainId, Chain> = {
  [mainnet.id]: mainnet,
  [base.id]: base,
  [bsc.id]: bsc,
};

export const supportedChainIds = [mainnet.id, base.id, bsc.id] as const satisfies readonly SupportedChainId[];

export const DEFAULT_RPC_URLS: Record<SupportedChainId, readonly string[]> = {
  [mainnet.id]: ["https://ethereum-rpc.publicnode.com/", "https://mainnet.gateway.tenderly.co/"],
  [base.id]: ["https://base-rpc.publicnode.com", "https://base.gateway.tenderly.co"],
  [bsc.id]: [
    "https://bsc-dataseed2.binance.org",
    "https://bsc-dataseed3.ninicoin.io",
    "https://bsc-dataseed4.defibit.io",
    "https://bsc-rpc.publicnode.com",
  ],
};

export const YIELD_DTF_SUBGRAPH_URL: Partial<Record<SupportedChainId, string>> = {
  [mainnet.id]:
    "https://api.goldsky.com/api/public/project_cmgzim3e100095np2gjnbh6ry/subgraphs/dtf-yield-mainnet/4.2.0-v2/gn",
  [base.id]:
    "https://api.goldsky.com/api/public/project_cmgzim3e100095np2gjnbh6ry/subgraphs/dtf-yield-base/4.2.0-v2/gn",
};

export const INDEX_DTF_SUBGRAPH_URL: Record<SupportedChainId, string> = {
  [mainnet.id]:
    "https://api.goldsky.com/api/public/project_cmgzim3e100095np2gjnbh6ry/subgraphs/dtf-index-mainnet/prod/gn",
  [base.id]: "https://api.goldsky.com/api/public/project_cmgzim3e100095np2gjnbh6ry/subgraphs/dtf-index-base/prod/gn",
  [bsc.id]: "https://api.goldsky.com/api/public/project_cmgzim3e100095np2gjnbh6ry/subgraphs/dtf-index-bsc/prod/gn",
};
