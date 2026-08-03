import type { SupportedChainId } from "@reserve-protocol/sdk";

const CHAIN_BY_SLUG: Record<string, SupportedChainId> = {
  ethereum: 1,
  base: 8453,
  bsc: 56,
};

export type ParsedProposalUrl = {
  readonly chainId: SupportedChainId;
  readonly dtf: string;
  readonly proposalId: string;
};

/** Parses an app.reserve.org governance proposal URL: /<chain>/index-dtf/<dtf>/governance/proposal/<id>. */
export function parseProposalUrl(input: string): ParsedProposalUrl {
  const match = /\/(ethereum|base|bsc)\/index-dtf\/([^/]+)\/governance\/proposal\/(\d+)/.exec(input);
  if (!match) {
    throw new Error(`not a governance proposal url: ${input}`);
  }
  const [, slug, dtf, proposalId] = match as unknown as [string, string, string, string];
  const chainId = CHAIN_BY_SLUG[slug];
  if (chainId === undefined) {
    throw new Error(`unsupported chain in url: ${slug}`);
  }

  return { chainId, dtf, proposalId };
}
