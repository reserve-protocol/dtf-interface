import type { DocumentTypeDecoration } from '@graphql-typed-document-node/core';
type Maybe<T> = T | null;
type InputMaybe<T> = Maybe<T>;
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  BigDecimal: { input: string; output: string };
  BigInt: { input: string; output: string };
  Bytes: { input: string; output: string };
  Int8: { input: string; output: string };
  Timestamp: { input: string; output: string };
};

export type GetIndexDtfQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetIndexDtfQuery = { dtf?: { id: string, proxyAdmin: string, timestamp: string, deployer: string, ownerAddress: string, admins: Array<string>, mintingFee: string, tvlFee: string, annualizedTvlFee: string, mandate: string, auctionDelay: string, auctionLength: string, auctionApprovers: Array<string>, auctionLaunchers: Array<string>, brandManagers: Array<string>, totalRevenue: string, protocolRevenue: string, governanceRevenue: string, externalRevenue: string, feeRecipients: string, bidsEnabled?: boolean | null, trustedFillerRegistry?: string | null, trustedFillerEnabled?: boolean | null, weightControl: boolean, priceControl: number, legacyAdmins: Array<string>, legacyAuctionApprovers: Array<string>, ownerGovernance?: { id: string, votingDelay: string, votingPeriod: string, proposalThreshold: string, quorumNumerator?: string | null, quorumDenominator?: string | null, timelock: { id: string, guardians: Array<string>, executionDelay: string } } | null, tradingGovernance?: { id: string, votingDelay: string, votingPeriod: string, proposalThreshold: string, quorumNumerator?: string | null, quorumDenominator?: string | null, timelock: { id: string, guardians: Array<string>, executionDelay: string } } | null, token: { id: string, address: string, name: string, symbol: string, decimals: number, totalSupply: string, currentHolderCount: string, cumulativeHolderCount: string, transferCount: string, mintCount: string, burnCount: string, totalBurned: string, totalMinted: string }, stToken?: { id: string, legacyGovernance: Array<string>, token: { id: string, address: string, name: string, symbol: string, decimals: number, totalSupply: string, currentHolderCount: string, cumulativeHolderCount: string, transferCount: string, mintCount: string, burnCount: string, totalBurned: string, totalMinted: string }, underlying?: { name: string, symbol: string, address: string, decimals: number } | null, governance?: { id: string, votingDelay: string, votingPeriod: string, proposalThreshold: string, quorumNumerator?: string | null, quorumDenominator?: string | null, timelock: { id: string, guardians: Array<string>, executionDelay: string } } | null, rewards: Array<{ rewardToken: { address: string, name: string, symbol: string, decimals: number } }> } | null } | null };

export class TypedDocumentString<TResult, TVariables>
  extends String
  implements DocumentTypeDecoration<TResult, TVariables>
{
  __apiType?: NonNullable<DocumentTypeDecoration<TResult, TVariables>['__apiType']>;
  private value: string;
  public __meta__?: Record<string, any> | undefined;

  constructor(value: string, __meta__?: Record<string, any> | undefined) {
    super(value);
    this.value = value;
    this.__meta__ = __meta__;
  }

  override toString(): string & DocumentTypeDecoration<TResult, TVariables> {
    return this.value;
  }
}

export const GetIndexDtfDocument = new TypedDocumentString(`
    query GetIndexDTF($id: ID!) {
  dtf(id: $id) {
    id
    proxyAdmin
    timestamp
    deployer
    ownerAddress
    admins
    mintingFee
    tvlFee
    annualizedTvlFee
    mandate
    auctionDelay
    auctionLength
    auctionApprovers
    auctionLaunchers
    brandManagers
    totalRevenue
    protocolRevenue
    governanceRevenue
    externalRevenue
    feeRecipients
    bidsEnabled
    trustedFillerRegistry
    trustedFillerEnabled
    weightControl
    priceControl
    ownerGovernance {
      id
      votingDelay
      votingPeriod
      proposalThreshold
      quorumNumerator
      quorumDenominator
      timelock {
        id
        guardians
        executionDelay
      }
    }
    legacyAdmins
    tradingGovernance {
      id
      votingDelay
      votingPeriod
      proposalThreshold
      quorumNumerator
      quorumDenominator
      timelock {
        id
        guardians
        executionDelay
      }
    }
    legacyAuctionApprovers
    token {
      id
      address
      name
      symbol
      decimals
      totalSupply
      currentHolderCount
      cumulativeHolderCount
      transferCount
      mintCount
      burnCount
      totalBurned
      totalMinted
    }
    stToken {
      id
      token {
        id
        address
        name
        symbol
        decimals
        totalSupply
        currentHolderCount
        cumulativeHolderCount
        transferCount
        mintCount
        burnCount
        totalBurned
        totalMinted
      }
      underlying {
        name
        symbol
        address
        decimals
      }
      governance {
        id
        votingDelay
        votingPeriod
        proposalThreshold
        quorumNumerator
        quorumDenominator
        timelock {
          id
          guardians
          executionDelay
        }
      }
      legacyGovernance
      rewards(where: {active: true}) {
        rewardToken {
          address
          name
          symbol
          decimals
        }
      }
    }
  }
}
    `) as unknown as TypedDocumentString<GetIndexDtfQuery, GetIndexDtfQueryVariables>;