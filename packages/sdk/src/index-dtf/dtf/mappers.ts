import { getAddress } from "viem";

import type {
  ReserveApiIndexDtfBasketSnapshot,
  ReserveApiIndexDtfPrice,
  ReserveApiIndexDtfPriceHistory,
} from "@/client/api";
import type { SupportedChainId } from "@/defaults";
import type { GetIndexDtfQuery } from "@/index-dtf/subgraph/dtf.generated";
import type {
  Authority,
  DtfParams,
  Governance,
  OptimisticGovernanceSettings,
  Token,
  TokenSnapshot,
  TokenWithSnapshot,
} from "@/types/common";
import type {
  FeeRecipients,
  IndexDtfBrand,
  IndexDtfBrandProfile,
  IndexDtfBrandSocials,
  IndexDtf,
  PriceControl,
  IndexDtfPrice,
  IndexDtfBasketSnapshot,
  IndexDtfPricePoint,
} from "@/types/index-dtf";

import { SdkError } from "@/errors";
import { mapAmount } from "@/lib/utils";

type SubgraphIndexDtf = NonNullable<GetIndexDtfQuery["dtf"]>;
type NullableSubgraphGovernance = SubgraphIndexDtf["ownerGovernance"];
type SubgraphGovernance = NonNullable<NullableSubgraphGovernance>;
type SubgraphStToken = NonNullable<SubgraphIndexDtf["stToken"]>;
type SubgraphToken = SubgraphIndexDtf["token"];
type SubgraphVoteLockToken = SubgraphStToken["token"];

export type IndexDtfBrandResponse = {
  readonly status: string;
  readonly parsedData?: {
    readonly hidden: boolean;
    readonly dtf?: {
      readonly icon?: string | null;
      readonly cover?: string | null;
      readonly mobileCover?: string | null;
      readonly description?: string | null;
      readonly notesFromCreator?: string | null;
      readonly prospectus?: string | null;
      readonly tags?: readonly string[] | null;
      readonly basketType?: string | null;
    };
    readonly creator?: IndexDtfBrandResponseProfile;
    readonly curator?: IndexDtfBrandResponseProfile;
    readonly socials?: {
      readonly twitter?: string | null;
      readonly telegram?: string | null;
      readonly discord?: string | null;
      readonly website?: string | null;
    };
  };
};

type IndexDtfBrandResponseProfile = {
  readonly name: string;
  readonly icon: string;
  readonly link: string;
};

export function mapIndexDtf(dtf: SubgraphIndexDtf, chainId: SupportedChainId): IndexDtf {
  const adminAuthority = mapAuthority(dtf.ownerAddress, dtf.ownerGovernance);
  const rebalanceAuthorities = dtf.tradingGovernance
    ? [mapAuthority(dtf.tradingGovernance.id, dtf.tradingGovernance)]
    : dtf.auctionApprovers.map((address) => mapAuthority(address));
  const voteLockAuthority = dtf.stToken?.governance
    ? mapAuthority(dtf.stToken.governance.id, dtf.stToken.governance)
    : undefined;
  const allAuthorities = dedupeAuthorities([
    adminAuthority,
    ...rebalanceAuthorities,
    ...(voteLockAuthority ? [voteLockAuthority] : []),
  ]);

  return {
    id: getAddress(dtf.id),
    chainId,
    token: mapTokenWithSnapshot(dtf.token),
    mandate: dtf.mandate,
    createdAt: Number(dtf.timestamp),
    roles: {
      admin: {
        primary: getAddress(dtf.ownerAddress),
        all: dtf.admins.map((address) => getAddress(address)),
        legacy: dtf.legacyAdmins.map((address) => getAddress(address)),
      },
      rebalance: {
        auctionApprovers: dtf.auctionApprovers.map((address) => getAddress(address)),
        legacyAuctionApprovers: dtf.legacyAuctionApprovers.map((address) => getAddress(address)),
        auctionLaunchers: dtf.auctionLaunchers.map((address) => getAddress(address)),
      },
      metadata: {
        brandManagers: dtf.brandManagers.map((address) => getAddress(address)),
      },
      deployment: {
        proxyAdmin: getAddress(dtf.proxyAdmin),
        deployer: getAddress(dtf.deployer),
      },
    },
    governance: {
      admin: {
        primary: adminAuthority,
        all: [adminAuthority],
      },
      rebalance: {
        all: rebalanceAuthorities,
        ...(rebalanceAuthorities[0] ? { primary: rebalanceAuthorities[0] } : {}),
      },
      ...(voteLockAuthority ? { voteLock: voteLockAuthority } : {}),
      all: allAuthorities,
    },
    ...(dtf.stToken
      ? {
          voteLockVault: {
            token: mapVoteLockToken(dtf.stToken.token, dtf.stToken.id),
            underlying: dtf.stToken.underlying ? mapToken(dtf.stToken.underlying) : mapToken(dtf.token),
            ...(dtf.stToken.governance ? { governance: mapGovernance(dtf.stToken.governance) } : {}),
            legacyGovernance: dtf.stToken.legacyGovernance.map((address) => getAddress(address)),
            rewardTokens: dtf.stToken.rewards.map(({ rewardToken }) => mapToken(rewardToken)),
            delegation: {
              currentDelegates: Number(dtf.stToken.currentDelegates),
              totalDelegates: Number(dtf.stToken.totalDelegates),
              delegatedVotes: mapAmount(dtf.stToken.delegatedVotesRaw),
              currentOptimisticDelegates: Number(dtf.stToken.currentOptimisticDelegates),
              totalOptimisticDelegates: Number(dtf.stToken.totalOptimisticDelegates),
              optimisticDelegatedVotes: mapAmount(dtf.stToken.optimisticDelegatedVotesRaw),
            },
          },
        }
      : {}),
    rebalance: {
      auctionDelay: Number(dtf.auctionDelay),
      auctionLength: Number(dtf.auctionLength),
      ...(dtf.bidsEnabled === null || dtf.bidsEnabled === undefined ? {} : { bidsEnabled: dtf.bidsEnabled }),
      ...(dtf.trustedFillerRegistry ? { trustedFillerRegistry: getAddress(dtf.trustedFillerRegistry) } : {}),
      ...(dtf.trustedFillerEnabled === null || dtf.trustedFillerEnabled === undefined
        ? {}
        : { trustedFillerEnabled: dtf.trustedFillerEnabled }),
      weightControl: dtf.weightControl,
      priceControl: mapPriceControl(dtf.priceControl),
    },
    fees: {
      mintingFee: mapAmount(dtf.mintingFee, 18),
      tvlFee: mapAmount(dtf.tvlFee, 18),
      annualizedTvlFee: Number(mapAmount(dtf.annualizedTvlFee, 18).formatted),
      recipients: mapFeeRecipients(dtf.feeRecipients),
    },
    financials: {
      totalRevenue: Number(dtf.totalRevenue),
      protocolRevenue: Number(dtf.protocolRevenue),
      governanceRevenue: Number(dtf.governanceRevenue),
      externalRevenue: Number(dtf.externalRevenue),
    },
  };
}

export function mapIndexDtfBrand(response: IndexDtfBrandResponse): IndexDtfBrand | undefined {
  if (!response.parsedData) {
    return undefined;
  }

  const { curator, creator, dtf, hidden, socials } = response.parsedData;
  const mappedCreator = mapBrandProfile(creator);
  const mappedCurator = mapBrandProfile(curator);
  const icon = nonEmpty(dtf?.icon);
  const cover = nonEmpty(dtf?.cover);
  const mobileCover = nonEmpty(dtf?.mobileCover);
  const description = nonEmpty(dtf?.description);
  const notesFromCreator = nonEmpty(dtf?.notesFromCreator);
  const prospectus = nonEmpty(dtf?.prospectus);
  const basketType = nonEmpty(dtf?.basketType);

  return {
    hidden,
    tags: dtf?.tags ?? [],
    socials: mapBrandSocials(socials),
    ...(icon ? { icon } : {}),
    ...(cover ? { cover } : {}),
    ...(mobileCover ? { mobileCover } : {}),
    ...(description ? { description } : {}),
    ...(notesFromCreator ? { notesFromCreator } : {}),
    ...(prospectus ? { prospectus } : {}),
    ...(basketType ? { basketType } : {}),
    ...(mappedCreator ? { creator: mappedCreator } : {}),
    ...(mappedCurator ? { curator: mappedCurator } : {}),
  };
}

export function mapIndexDtfPrice(response: ReserveApiIndexDtfPrice, params: DtfParams, timestamp: number): IndexDtfPrice {
  return {
    address: getAddress(params.address),
    chainId: params.chainId,
    price: response.price,
    marketCap: response.marketCap,
    totalSupply: response.totalSupply,
    basket: response.basket.map((asset) => {
      return {
        token: {
          address: getAddress(asset.address),
          decimals: asset.decimals,
        },
        amount: mapAmount(asset.amountRaw, asset.decimals),
        weight: asset.weight,
        price: asset.price,
        ...(asset.priceSource ? { priceSource: asset.priceSource } : {}),
      };
    }),
    timestamp,
  };
}

export function mapIndexDtfPriceHistory(response: ReserveApiIndexDtfPriceHistory): readonly IndexDtfPricePoint[] {
  return response.timeseries.map((point) => ({
    timestamp: point.timestamp,
    price: point.price,
    marketCap: point.marketCap,
    totalSupply: point.totalSupply,
    basket: point.basket.map((asset) => ({
      address: getAddress(asset.address),
      price: asset.price,
      amount: asset.amount,
    })),
  }));
}

export function mapIndexDtfBasketSnapshot(response: ReserveApiIndexDtfBasketSnapshot): IndexDtfBasketSnapshot {
  return {
    price: response.price,
    basket: response.basket.map((asset) => ({
      address: getAddress(asset.address),
      symbol: asset.symbol,
      decimals: asset.decimals,
      price: asset.price,
      weight: asset.weight,
    })),
  };
}

function mapAuthority(address: string, governance?: NullableSubgraphGovernance): Authority {
  return governance
    ? {
        address: getAddress(governance.id),
        type: "governance",
        governance: mapGovernance(governance),
      }
    : {
        address: getAddress(address),
        type: "address",
      };
}

function mapGovernance(governance: SubgraphGovernance): Governance {
  const isOptimistic = governance.isOptimistic === true;

  return {
    address: getAddress(governance.id),
    name: governance.name,
    version: governance.version,
    votingDelay: Number(governance.votingDelay),
    votingPeriod: Number(governance.votingPeriod),
    proposalThreshold: mapD18Percentage(governance.proposalThreshold),
    ...(governance.quorumVotes === null || governance.quorumVotes === undefined
      ? {}
      : { quorumVotes: mapAmount(governance.quorumVotes) }),
    quorumNumerator: Number(governance.quorumNumerator ?? 0),
    quorumDenominator: Number(governance.quorumDenominator ?? 0),
    quorum: calculateQuorum(governance.quorumNumerator, governance.quorumDenominator),
    isOptimistic,
    ...(isOptimistic ? { optimistic: mapOptimisticGovernanceSettings(governance) } : {}),
    timelock: {
      address: getAddress(governance.timelock.id),
      guardians: governance.timelock.guardians.map((address) => getAddress(address)),
      optimisticProposers: (governance.timelock.optimisticProposers ?? []).map((address) => getAddress(address)),
      executionDelay: Number(governance.timelock.executionDelay),
      type: governance.timelock.type,
    },
  };
}

function mapOptimisticGovernanceSettings(governance: SubgraphGovernance): OptimisticGovernanceSettings {
  if (
    !governance.optimisticVetoDelay ||
    !governance.optimisticVetoPeriod ||
    !governance.optimisticVetoThreshold ||
    !governance.optimisticProposalThrottleCapacity ||
    !governance.optimisticSelectorRegistry
  ) {
    throw new SdkError({
      code: "INVALID_RESPONSE",
      message: `Optimistic governance is missing required settings: ${governance.id}`,
      meta: { governance: governance.id },
    });
  }

  return {
    vetoDelay: Number(governance.optimisticVetoDelay),
    vetoPeriod: Number(governance.optimisticVetoPeriod),
    vetoThreshold: mapD18Percentage(governance.optimisticVetoThreshold),
    proposalThrottleCapacity: BigInt(governance.optimisticProposalThrottleCapacity),
    selectorRegistry: getAddress(governance.optimisticSelectorRegistry),
    proposers: (governance.optimisticProposers ?? []).map((address) => getAddress(address)),
  };
}

function mapToken(token: {
  readonly address?: unknown;
  readonly id?: string;
  readonly name: string;
  readonly symbol: string;
  readonly decimals: number;
}): Token {
  return {
    address: getAddress(String(token.address ?? token.id)),
    name: token.name,
    symbol: token.symbol,
    decimals: token.decimals,
  };
}

function mapTokenWithSnapshot(token: SubgraphToken): TokenWithSnapshot {
  return {
    ...mapToken(token),
    snapshot: mapTokenSnapshot(token),
  };
}

function mapVoteLockToken(token: SubgraphVoteLockToken, vaultAddress: string): TokenWithSnapshot {
  return {
    ...mapToken({ ...token, id: vaultAddress }),
    snapshot: mapTokenSnapshot(token),
  };
}

function mapTokenSnapshot(token: {
  readonly decimals: number;
  readonly currentHolderCount: unknown;
  readonly cumulativeHolderCount: unknown;
  readonly transferCount: unknown;
  readonly mintCount: unknown;
  readonly burnCount: unknown;
  readonly totalSupply: unknown;
  readonly totalBurned: unknown;
  readonly totalMinted: unknown;
}): TokenSnapshot {
  return {
    currentHolderCount: Number(token.currentHolderCount),
    cumulativeHolderCount: Number(token.cumulativeHolderCount),
    transferCount: Number(token.transferCount),
    mintCount: Number(token.mintCount),
    burnCount: Number(token.burnCount),
    totalSupply: mapAmount(token.totalSupply, token.decimals),
    totalBurned: mapAmount(token.totalBurned, token.decimals),
    totalMinted: mapAmount(token.totalMinted, token.decimals),
  };
}

function mapBrandProfile(profile: IndexDtfBrandResponseProfile | undefined): IndexDtfBrandProfile | undefined {
  if (!profile) {
    return undefined;
  }

  const name = nonEmpty(profile.name);
  const icon = nonEmpty(profile.icon);
  const link = nonEmpty(profile.link);

  return name || icon || link
    ? {
        ...(name ? { name } : {}),
        ...(icon ? { icon } : {}),
        ...(link ? { link } : {}),
      }
    : undefined;
}

function mapBrandSocials(socials?: {
  readonly twitter?: string | null;
  readonly telegram?: string | null;
  readonly discord?: string | null;
  readonly website?: string | null;
}): IndexDtfBrandSocials {
  if (!socials) {
    return {};
  }

  const twitter = nonEmpty(socials.twitter);
  const telegram = nonEmpty(socials.telegram);
  const discord = nonEmpty(socials.discord);
  const website = nonEmpty(socials.website);

  return {
    ...(twitter ? { twitter } : {}),
    ...(telegram ? { telegram } : {}),
    ...(discord ? { discord } : {}),
    ...(website ? { website } : {}),
  };
}

function mapFeeRecipients(raw: string): FeeRecipients {
  if (!raw) {
    return [];
  }

  return raw.split(",").flatMap((recipient) => {
    const [address, percentage] = recipient.split(":");

    if (!address || !percentage) {
      return [];
    }

    return [
      {
        address: getAddress(address),
        percentage: mapAmount(BigInt(percentage) * 100n, 18).formatted,
      },
    ];
  });
}

function dedupeAuthorities(authorities: readonly Authority[]): readonly Authority[] {
  const seen = new Set<string>();

  return authorities.filter((authority) => {
    const key = authority.address.toLowerCase();
    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function calculateQuorum(numerator: unknown | null | undefined, denominator: unknown | null | undefined): number {
  const quorumDenominator = Number(denominator ?? 0);

  return quorumDenominator === 0 ? 0 : (Number(numerator ?? 0) / quorumDenominator) * 100;
}

function mapD18Percentage(value: unknown): number {
  return Number(mapAmount(value, 18).formatted) * 100;
}

function mapPriceControl(value: number): PriceControl {
  if (value === 0 || value === 1 || value === 2) {
    return value;
  }

  throw new SdkError({
    code: "INVALID_RESPONSE",
    message: `Unknown Index DTF price control value: ${value}`,
    meta: { field: "priceControl", value },
  });
}

function nonEmpty(value: string | null | undefined): string | undefined {
  if (!value) {
    return undefined;
  }

  const trimmed = value.trim();

  return trimmed ? trimmed : undefined;
}
