import { formatEther, formatUnits, getAddress } from "viem";
import type { SupportedChainId } from "../defaults.js";
import type { GetIndexDtfQuery } from "../graphql/index-dtf/dtf.generated.js";
import type {
  Amount,
  Authority,
  FeeRecipients,
  Governance,
  IndexDTF,
  PriceControl,
  Token,
  TokenSnapshot,
  TokenWithSnapshot,
} from "../types/index-dtf.js";

type SubgraphIndexDTF = NonNullable<GetIndexDtfQuery["dtf"]>;
type NullableSubgraphGovernance = SubgraphIndexDTF["ownerGovernance"];
type SubgraphGovernance = NonNullable<NullableSubgraphGovernance>;
type SubgraphStToken = NonNullable<SubgraphIndexDTF["stToken"]>;
type SubgraphToken = SubgraphIndexDTF["token"];
type SubgraphVoteLockToken = SubgraphStToken["token"];

export function mapIndexDTF(
  dtf: SubgraphIndexDTF,
  chainId: SupportedChainId,
): IndexDTF {
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

  throw new Error(`Unknown Index DTF price control value: ${value}`);
}

function toBigInt(value: unknown): bigint {
  return typeof value === "bigint" ? value : BigInt(String(value));
}
