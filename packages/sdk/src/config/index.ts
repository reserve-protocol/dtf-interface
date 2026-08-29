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

// Keyless endpoints, ordered by measured reliability under concurrent load
// (register's validate-rpcs skill, 2026-08-28). Undocumented hosts stay second.
export const DEFAULT_RPC_URLS: Record<SupportedChainId, readonly string[]> = {
  [mainnet.id]: [
    "https://eth.drpc.org",
    "https://mainnet.rpc.sentio.xyz",
    "https://ethereum-rpc.publicnode.com",
    "https://eth-mainnet.public.blastapi.io",
  ],
  [base.id]: [
    "https://base.rpc.sentio.xyz",
    "https://base-rpc.publicnode.com",
    "https://base-mainnet.public.blastapi.io",
    "https://base.public.blockpi.network/v1/rpc/public",
  ],
  [bsc.id]: [
    "https://bsc-rpc.publicnode.com",
    "https://bsc.rpc.sentio.xyz",
    "https://bsc-dataseed.bnbchain.org",
    "https://bsc-dataseed2.binance.org",
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
