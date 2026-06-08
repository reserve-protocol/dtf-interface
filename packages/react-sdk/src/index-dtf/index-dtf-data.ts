import type {
  Amount,
  Authority,
  Governance,
  IndexDtfFull,
  Timelock,
  Token,
  TokenWithSnapshot,
} from "@reserve-protocol/sdk";
import type { Address } from "viem";

type IndexDtfGovernanceData = Omit<Governance, "timelock"> & {
  readonly id: Address;
  readonly timelock: Omit<Timelock, "guardians" | "optimisticProposers"> & {
    readonly id: Address;
    readonly guardians: Address[];
    readonly optimisticProposers: Address[];
  };
};

type IndexDtfTokenData = TokenWithSnapshot & {
  readonly id: Address;
  readonly totalSupply: Amount;
  readonly currentHolderCount: number;
};

type IndexDtfVoteLockData = {
  readonly id: Address;
  readonly chainId: number;
  readonly token: {
    readonly id?: Address;
    readonly address?: Address;
    readonly symbol: string;
    readonly name: string;
    readonly decimals: number;
    readonly totalSupply: Amount;
    readonly currentHolderCount?: number;
    readonly snapshot?: TokenWithSnapshot["snapshot"];
  };
  readonly underlying: Token;
  readonly governance?: IndexDtfGovernanceData;
  readonly legacyGovernance: Address[];
  readonly rewardTokens: Token[];
  readonly totalDelegates: number;
  readonly currentDelegates: number;
  readonly totalOptimisticDelegates: number;
  readonly currentOptimisticDelegates: number;
};

export type IndexDtfData = Omit<IndexDtfFull, "token"> & {
  readonly token: IndexDtfTokenData;
  readonly proxyAdmin: Address;
  readonly timestamp: number;
  readonly deployer: Address;
  readonly ownerAddress: Address;
  readonly mintingFee: number;
  readonly tvlFee: number;
  readonly annualizedTvlFee: number;
  readonly auctionDelay: number;
  readonly auctionLength: number;
  readonly auctionApprovers: Address[];
  readonly auctionLaunchers: Address[];
  readonly brandManagers: Address[];
  readonly feeRecipients: IndexDtfFull["fees"]["recipients"];
  readonly ownerGovernance?: IndexDtfGovernanceData;
  readonly tradingGovernance?: IndexDtfGovernanceData;
  readonly legacyAdmins: Address[];
  readonly legacyAuctionApprovers: Address[];
  readonly stToken?: IndexDtfVoteLockData;
  readonly totalRevenue: number;
  readonly protocolRevenue: number;
  readonly governanceRevenue: number;
  readonly externalRevenue: number;
};

export function mapIndexDtfData(dtf: IndexDtfFull): IndexDtfData {
  const ownerGovernance = getAuthorityGovernance(dtf.governance.admin.primary);
  const tradingGovernance = getAuthorityGovernance(dtf.governance.rebalance.primary);

  return {
    ...dtf,
    token: {
      ...dtf.token,
      id: dtf.token.address,
      totalSupply: dtf.token.snapshot.totalSupply,
      currentHolderCount: dtf.token.snapshot.currentHolderCount,
    },
    proxyAdmin: dtf.roles.deployment.proxyAdmin,
    timestamp: dtf.createdAt,
    deployer: dtf.roles.deployment.deployer,
    ownerAddress: dtf.roles.admin.primary,
    mintingFee: Number(dtf.fees.mintingFee.formatted),
    tvlFee: Number(dtf.fees.tvlFee.formatted),
    annualizedTvlFee: dtf.fees.annualizedTvlFee,
    auctionDelay: dtf.rebalance.auctionDelay,
    auctionLength: dtf.rebalance.auctionLength,
    auctionApprovers: [...dtf.roles.rebalance.auctionApprovers],
    auctionLaunchers: [...dtf.roles.rebalance.auctionLaunchers],
    brandManagers: [...dtf.roles.metadata.brandManagers],
    feeRecipients: dtf.fees.recipients,
    ...(ownerGovernance ? { ownerGovernance } : {}),
    ...(tradingGovernance ? { tradingGovernance } : {}),
    legacyAdmins: [...dtf.roles.admin.legacy],
    legacyAuctionApprovers: [...dtf.roles.rebalance.legacyAuctionApprovers],
    ...(dtf.voteLockVault
      ? {
          stToken: {
            id: dtf.voteLockVault.token.address,
            chainId: dtf.chainId,
            token: {
              ...dtf.voteLockVault.token,
              id: dtf.voteLockVault.token.address,
              totalSupply: dtf.voteLockVault.token.snapshot.totalSupply,
            },
            underlying: dtf.voteLockVault.underlying,
            ...(dtf.voteLockVault.governance ? { governance: mapGovernanceData(dtf.voteLockVault.governance) } : {}),
            legacyGovernance: [...dtf.voteLockVault.legacyGovernance],
            rewardTokens: [...dtf.voteLockVault.rewardTokens],
            totalDelegates: dtf.voteLockVault.delegation.totalDelegates,
            currentDelegates: dtf.voteLockVault.delegation.currentDelegates,
            totalOptimisticDelegates: dtf.voteLockVault.delegation.totalOptimisticDelegates,
            currentOptimisticDelegates: dtf.voteLockVault.delegation.currentOptimisticDelegates,
          },
        }
      : {}),
    totalRevenue: dtf.financials.totalRevenue,
    protocolRevenue: dtf.financials.protocolRevenue,
    governanceRevenue: dtf.financials.governanceRevenue,
    externalRevenue: dtf.financials.externalRevenue,
  };
}

function getAuthorityGovernance(authority: Authority | undefined): IndexDtfGovernanceData | undefined {
  if (authority?.type !== "governance") {
    return undefined;
  }

  return mapGovernanceData(authority.governance);
}

function mapGovernanceData(governance: Governance): IndexDtfGovernanceData {
  return {
    ...governance,
    id: governance.address,
    timelock: {
      ...governance.timelock,
      id: governance.timelock.address,
      guardians: [...governance.timelock.guardians],
      optimisticProposers: [...governance.timelock.optimisticProposers],
    },
  };
}
