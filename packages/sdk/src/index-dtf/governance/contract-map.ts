import { getAddress, type Abi, type Address } from "viem";

import type { SupportedChainId } from "@/defaults";

import {
  dtfAdminProposalAbi,
  dtfIndexProposalAbi,
  dtfIndexGovernanceProposalAbi,
  dtfIndexStakingVaultProposalAbi,
  timelockProposalAbi,
  upgradeSpellProposalAbi,
} from "@/index-dtf/abis/proposal-decoder";

export type ProposalContractDecoder = {
  readonly target: Address;
  readonly contract: string;
  readonly abi: Abi;
};

export type IndexDtfProposalGovernanceContractContext = {
  readonly address: Address;
  readonly timelock: {
    readonly address: Address;
    readonly type?: string | null;
  };
};

export type IndexDtfProposalDtfContractContext = {
  readonly address: Address;
  readonly proxyAdmin: Address;
  readonly legacyAdminGovernance: readonly Address[];
  readonly legacyTradingGovernance: readonly Address[];
  readonly ownerGovernance?: {
    readonly address: Address;
    readonly timelock: Address;
  };
  readonly tradingGovernance?: {
    readonly address: Address;
    readonly timelock: Address;
  };
  readonly stakingToken: {
    readonly address: Address;
    readonly legacyGovernance: readonly Address[];
    readonly governance?: {
      readonly address: Address;
      readonly timelock: Address;
    };
  };
};

type BuildProposalContractMapParams = {
  readonly chainId: SupportedChainId;
  readonly dtf: IndexDtfProposalDtfContractContext;
  readonly proposalGovernance?: IndexDtfProposalGovernanceContractContext;
};

type ChainAddressMap = Partial<Record<SupportedChainId, Address>>;

const EXTRA_PROPOSAL_CONTRACTS: readonly {
  readonly contract: string;
  readonly abi: Abi;
  readonly addresses: ChainAddressMap;
}[] = [
  {
    contract: "GovernanceSpell_31_03_2025",
    abi: upgradeSpellProposalAbi,
    addresses: {
      1: "0x4491b242f15f8dc9c6dfbb9a08edbbaae2623199",
      8453: "0x587cefb69473ad467993c6dd3a8f202bf1ef5e2a",
    },
  },
  {
    contract: "V4 Upgrade Spell",
    abi: upgradeSpellProposalAbi,
    addresses: {
      1: "0x7498c6aB0669A09DE7B9185ba72A98fa3Ca39cC9",
      8453: "0x4720dbCAEEF5834AEf590781F93d70fD1e3AcADB",
    },
  },
  {
    contract: "V5 Upgrade Spell",
    abi: upgradeSpellProposalAbi,
    addresses: {
      1: "0x044B6F685FB8D0c3fd56D92FCBE5F0Ad947d2D53",
      8453: "0x04B3eD311C68dfB0649D9faf695115F23DcbB540",
      56: "0xe8e67a366e5166c442B6D376ADc772b93CdE7825",
    },
  },
];

export function buildProposalContractMap({
  chainId,
  dtf,
  proposalGovernance,
}: BuildProposalContractMapParams): Map<string, ProposalContractDecoder> {
  const contracts = new Map<string, ProposalContractDecoder>();

  addContract(contracts, dtf.address, "Index DTF", dtfIndexProposalAbi);
  addContract(contracts, dtf.proxyAdmin, "ProxyAdmin", dtfAdminProposalAbi);

  const hasSharedOwnerAndBasketGovernance =
    dtf.ownerGovernance &&
    dtf.tradingGovernance &&
    dtf.ownerGovernance.address.toLowerCase() === dtf.tradingGovernance.address.toLowerCase();

  for (const governance of dtf.legacyAdminGovernance) {
    addContract(contracts, governance, "Legacy Owner Governance", dtfIndexGovernanceProposalAbi);
  }

  for (const governance of dtf.legacyTradingGovernance) {
    addContract(contracts, governance, "Legacy Basket Governance", dtfIndexGovernanceProposalAbi);
  }

  if (hasSharedOwnerAndBasketGovernance) {
    addContract(contracts, dtf.ownerGovernance!.address, "Owner/Basket Governance", dtfIndexGovernanceProposalAbi);
    addContract(contracts, dtf.ownerGovernance!.timelock, "Owner/Basket Governance Timelock", timelockProposalAbi);
  } else if (dtf.ownerGovernance) {
    addContract(contracts, dtf.ownerGovernance.address, "Owner Governance", dtfIndexGovernanceProposalAbi);
    addContract(contracts, dtf.ownerGovernance.timelock, "Owner Governance Timelock", timelockProposalAbi);
  }

  if (!hasSharedOwnerAndBasketGovernance && dtf.tradingGovernance) {
    addContract(contracts, dtf.tradingGovernance.address, "Basket Governance", dtfIndexGovernanceProposalAbi);
    addContract(contracts, dtf.tradingGovernance.timelock, "Basket Governance Timelock", timelockProposalAbi);
  }

  addContract(contracts, dtf.stakingToken.address, "Lock Vault", dtfIndexStakingVaultProposalAbi);

  for (const governance of dtf.stakingToken.legacyGovernance) {
    addContract(contracts, governance, "Legacy Lock Governance", dtfIndexGovernanceProposalAbi);
  }

  if (dtf.stakingToken.governance) {
    addContract(contracts, dtf.stakingToken.governance.address, "Lock Governance", dtfIndexGovernanceProposalAbi);
    addContract(contracts, dtf.stakingToken.governance.timelock, "Lock Governance Timelock", timelockProposalAbi);
  }

  if (proposalGovernance) {
    addContract(
      contracts,
      proposalGovernance.address,
      getGovernanceContractName(proposalGovernance.timelock.type),
      dtfIndexGovernanceProposalAbi,
    );
    addContract(
      contracts,
      proposalGovernance.timelock.address,
      getTimelockContractName(proposalGovernance.timelock.type),
      timelockProposalAbi,
    );
  }

  for (const extraContract of EXTRA_PROPOSAL_CONTRACTS) {
    addContract(contracts, extraContract.addresses[chainId], extraContract.contract, extraContract.abi);
  }

  return contracts;
}

export function getContractAliases(contractMap: Map<string, ProposalContractDecoder>): Record<Address, string> {
  const aliases: Record<Address, string> = {};

  for (const contract of contractMap.values()) {
    aliases[contract.target] = contract.contract;
  }

  return aliases;
}

function addContract(
  contracts: Map<string, ProposalContractDecoder>,
  target: Address | undefined,
  contract: string,
  abi: Abi,
) {
  if (!target) {
    return;
  }

  const address = getAddress(target);
  const key = address.toLowerCase();

  if (contracts.has(key)) {
    return;
  }

  contracts.set(key, {
    target: address,
    contract,
    abi,
  });
}

function getGovernanceContractName(type: string | null | undefined): string {
  if (type === "OWNER") {
    return "Owner Governance";
  }
  if (type === "TRADING") {
    return "Basket Governance";
  }
  if (type === "VOTE_LOCKING") {
    return "Lock Governance";
  }

  return "Governance";
}

function getTimelockContractName(type: string | null | undefined): string {
  if (type === "OWNER") {
    return "Owner Governance Timelock";
  }
  if (type === "TRADING") {
    return "Basket Governance Timelock";
  }
  if (type === "VOTE_LOCKING") {
    return "Lock Governance Timelock";
  }

  return "Governance Timelock";
}
