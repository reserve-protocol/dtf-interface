import { formatEther, formatUnits, getAddress } from "viem";
import type { SupportedChainId } from "../../defaults.js";
import { SdkError } from "../../errors.js";
import type { DtfParams } from "../../types/common.js";
import type {
  Amount,
  Authority,
  FeeRecipients,
  Governance,
  IndexDtfBrand,
  IndexDtfBrandProfile,
  IndexDtfBrandSocials,
  IndexDtf,
  PriceControl,
  IndexDtfPrice,
  Token,
  TokenSnapshot,
  TokenWithSnapshot,
} from "../../types/index-dtf.js";
import type { GetIndexDtfQuery } from "./subgraph/dtf.generated.js";

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
    readonly dtf: {
      readonly icon: string;
      readonly cover: string;
      readonly mobileCover: string;
      readonly description: string;
      readonly notesFromCreator: string;
      readonly prospectus: string;
      readonly tags: readonly string[];
      readonly basketType: string;
    };
    readonly creator: IndexDtfBrandResponseProfile;
    readonly curator: IndexDtfBrandResponseProfile;
    readonly socials: {
      readonly twitter: string;
      readonly telegram: string;
      readonly discord: string;
      readonly website: string;
    };
  };
};

type IndexDtfBrandResponseProfile = {
  readonly name: string;
  readonly icon: string;
  readonly link: string;
};

export type IndexDtfPriceResponse = {
  readonly price: number;
  readonly marketCap: number;
  readonly totalSupply: number;
  readonly basket: readonly {
    readonly address: string;
    readonly amount: number;
    readonly amountRaw: string;
    readonly decimals: number;
    readonly price: number;
    readonly weight: string;
    readonly priceSource?: string;
  }[];
};

export function mapIndexDtf(
  dtf: SubgraphIndexDtf,
  chainId: SupportedChainId,
): IndexDtf {
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
        all: dtf.admins.map(getAddress),
        legacy: dtf.legacyAdmins.map(getAddress),
      },
      rebalance: {
        auctionApprovers: dtf.auctionApprovers.map(getAddress),
        legacyAuctionApprovers: dtf.legacyAuctionApprovers.map(getAddress),
        auctionLaunchers: dtf.auctionLaunchers.map(getAddress),
      },
      metadata: {
        brandManagers: dtf.brandManagers.map(getAddress),
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
        ...(rebalanceAuthorities[0]
          ? { primary: rebalanceAuthorities[0] }
          : {}),
      },
      ...(voteLockAuthority ? { voteLock: voteLockAuthority } : {}),
      all: allAuthorities,
    },
    ...(dtf.stToken
      ? {
          voteLockVault: {
            token: mapVoteLockToken(dtf.stToken.token, dtf.stToken.id),
            underlying: dtf.stToken.underlying
              ? mapToken(dtf.stToken.underlying)
              : mapToken(dtf.token),
            ...(dtf.stToken.governance
              ? { governance: mapGovernance(dtf.stToken.governance) }
              : {}),
            legacyGovernance: dtf.stToken.legacyGovernance.map(getAddress),
            rewardTokens: dtf.stToken.rewards.map(({ rewardToken }) =>
              mapToken(rewardToken),
            ),
          },
        }
      : {}),
    rebalance: {
      auctionDelay: Number(dtf.auctionDelay),
      auctionLength: Number(dtf.auctionLength),
      ...(dtf.bidsEnabled === null || dtf.bidsEnabled === undefined
        ? {}
        : { bidsEnabled: dtf.bidsEnabled }),
      ...(dtf.trustedFillerRegistry
        ? { trustedFillerRegistry: getAddress(dtf.trustedFillerRegistry) }
        : {}),
      ...(dtf.trustedFillerEnabled === null ||
      dtf.trustedFillerEnabled === undefined
        ? {}
        : { trustedFillerEnabled: dtf.trustedFillerEnabled }),
      weightControl: dtf.weightControl,
      priceControl: mapPriceControl(dtf.priceControl),
    },
    fees: {
      mintingFee: mapD18Amount(dtf.mintingFee),
      tvlFee: mapD18Amount(dtf.tvlFee),
      annualizedTvlFee: Number(formatEther(toBigInt(dtf.annualizedTvlFee))),
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

export function mapIndexDtfBrand(
  response: IndexDtfBrandResponse,
): IndexDtfBrand | undefined {
  if (!response.parsedData) {
    return undefined;
  }

  const { curator, creator, dtf, hidden, socials } = response.parsedData;
  const mappedCreator = mapBrandProfile(creator);
  const mappedCurator = mapBrandProfile(curator);

  return {
    hidden,
    tags: dtf.tags,
    socials: mapBrandSocials(socials),
    ...(nonEmpty(dtf.icon) ? { icon: dtf.icon } : {}),
    ...(nonEmpty(dtf.cover) ? { cover: dtf.cover } : {}),
    ...(nonEmpty(dtf.mobileCover) ? { mobileCover: dtf.mobileCover } : {}),
    ...(nonEmpty(dtf.description) ? { description: dtf.description } : {}),
    ...(nonEmpty(dtf.notesFromCreator)
      ? { notesFromCreator: dtf.notesFromCreator }
      : {}),
    ...(nonEmpty(dtf.prospectus) ? { prospectus: dtf.prospectus } : {}),
    ...(nonEmpty(dtf.basketType) ? { basketType: dtf.basketType } : {}),
    ...(mappedCreator ? { creator: mappedCreator } : {}),
    ...(mappedCurator ? { curator: mappedCurator } : {}),
  };
}

export function mapIndexDtfPrice(
  response: IndexDtfPriceResponse,
  params: DtfParams,
): IndexDtfPrice {
  return {
    address: getAddress(params.address),
    chainId: params.chainId,
    price: response.price,
    marketCap: response.marketCap,
    totalSupply: response.totalSupply,
    basket: response.basket.map((asset) => {
      const raw = toBigInt(asset.amountRaw);

      return {
        token: {
          address: getAddress(asset.address),
          decimals: asset.decimals,
        },
        amount: {
          raw,
          formatted: formatUnits(raw, asset.decimals),
        },
        weight: asset.weight,
        price: asset.price,
        ...(asset.priceSource ? { priceSource: asset.priceSource } : {}),
      };
    }),
    timestamp: Date.now(),
  };
}

function mapAuthority(
  address: string,
  governance?: NullableSubgraphGovernance,
): Authority {
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
  return {
    address: getAddress(governance.id),
    votingDelay: Number(governance.votingDelay),
    votingPeriod: Number(governance.votingPeriod),
    proposalThreshold: Number(governance.proposalThreshold) * 100,
    quorumNumerator: Number(governance.quorumNumerator ?? 0),
    quorumDenominator: Number(governance.quorumDenominator ?? 0),
    quorum: calculateQuorum(
      governance.quorumNumerator,
      governance.quorumDenominator,
    ),
    timelock: {
      address: getAddress(governance.timelock.id),
      guardians: governance.timelock.guardians.map(getAddress),
      executionDelay: Number(governance.timelock.executionDelay),
    },
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

function mapVoteLockToken(
  token: SubgraphVoteLockToken,
  vaultAddress: string,
): TokenWithSnapshot {
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
    totalSupply: mapTokenAmount(token.totalSupply, token.decimals),
    totalBurned: mapTokenAmount(token.totalBurned, token.decimals),
    totalMinted: mapTokenAmount(token.totalMinted, token.decimals),
  };
}

function mapD18Amount(value: unknown): Amount {
  const raw = toBigInt(value);

  return {
    raw,
    formatted: formatEther(raw),
  };
}

function mapTokenAmount(value: unknown, decimals: number): Amount {
  const raw = toBigInt(value);

  return {
    raw,
    formatted: formatUnits(raw, decimals),
  };
}

function mapBrandProfile(
  profile: IndexDtfBrandResponseProfile,
): IndexDtfBrandProfile | undefined {
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

function mapBrandSocials(socials: {
  readonly twitter: string;
  readonly telegram: string;
  readonly discord: string;
  readonly website: string;
}): IndexDtfBrandSocials {
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
        percentage: formatEther(toBigInt(percentage) * 100n),
      },
    ];
  });
}

function dedupeAuthorities(
  authorities: readonly Authority[],
): readonly Authority[] {
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

function calculateQuorum(
  numerator: unknown | null | undefined,
  denominator: unknown | null | undefined,
): number {
  const quorumDenominator = Number(denominator ?? 0);

  return quorumDenominator === 0
    ? 0
    : (Number(numerator ?? 0) / quorumDenominator) * 100;
}

function mapPriceControl(value: number): PriceControl {
  if (value === 0 || value === 1 || value === 2) {
    return value;
  }

  throw new SdkError({
    code: "UNKNOWN_INDEX_DTF_PRICE_CONTROL",
    message: `Unknown Index DTF price control value: ${value}`,
    meta: { value },
  });
}

function toBigInt(value: unknown): bigint {
  return typeof value === "bigint" ? value : BigInt(String(value));
}

function nonEmpty(value: string): string | undefined {
  const trimmed = value.trim();

  return trimmed ? trimmed : undefined;
}
