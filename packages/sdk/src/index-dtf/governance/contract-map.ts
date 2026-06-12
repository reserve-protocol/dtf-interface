import { getAddress, type Abi, type Address } from "viem";

import type { SupportedChainId } from "@/config";

import {
  dtfAdminProposalAbi,
  dtfIndexProposalAbi,
  dtfIndexGovernanceProposalAbi,
  dtfIndexStakingVaultProposalAbi,
  timelockProposalAbi,
  upgradeSpellProposalAbi,
} from "@/index-dtf/abis/proposal-decoder";
import { sameAddress } from "@/lib/utils";

export type ProposalContractDecoder = {
  readonly target: Address;
  readonly contract: string;
  readonly abi: Abi;
};

export type ProposalContractDecoderMap = Map<string, ProposalContractDecoder | readonly ProposalContractDecoder[]>;

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
  {
    contract: "Reserve Optimistic Governance Spell",
    abi: upgradeSpellProposalAbi,
    addresses: {
      1: "0xd7238463494fdd4b103c2ad9d229b3985b5bc6f1",
      8453: "0xe9ae2cb2b5e5658035617f92efa1878429f9cd3f",
      56: "0x3dde17cfd36e740cb7452cb2f59fc925eacb91ab",
    },
  },
];

export function buildProposalContractMap({
  chainId,
  dtf,
  proposalGovernance,
}: BuildProposalContractMapParams): ProposalContractDecoderMap {
  const contracts: ProposalContractDecoderMap = new Map();

  addContract(contracts, dtf.address, "Index DTF", dtfIndexProposalAbi);
  addContract(contracts, dtf.proxyAdmin, "ProxyAdmin", dtfAdminProposalAbi);

  const hasSharedOwnerAndBasketGovernance =
    dtf.ownerGovernance &&
    dtf.tradingGovernance &&
    sameAddress(dtf.ownerGovernance.address, dtf.tradingGovernance.address);

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
    addContract(contracts, extraContract.addresses[chainId], extraContract.contract, extraContract.abi, true);
  }

  return contracts;
}

export function getContractAliases(contractMap: ProposalContractDecoderMap): Record<Address, string> {
  const aliases: Record<Address, string> = {};

  for (const entry of contractMap.values()) {
    const decoders = getContractDecoders(entry);
    const contract = decoders[0];
    if (!contract) {
      continue;
    }

    aliases[contract.target] = contract.contract;
  }

  return aliases;
}

function addContract(
  contracts: ProposalContractDecoderMap,
  target: Address | undefined,
  contract: string,
  abi: Abi,
  prefer = false,
) {
  if (!target) {
    return;
  }

  const address = getAddress(target);
  const key = address.toLowerCase();

  const decoder = {
    target: address,
    contract,
    abi,
  };
  const existing = getContractDecoders(contracts.get(key));

  contracts.set(key, existing ? (prefer ? [decoder, ...existing] : [...existing, decoder]) : [decoder]);
}

function getContractDecoders(
  entry: ProposalContractDecoder | readonly ProposalContractDecoder[] | undefined,
): readonly ProposalContractDecoder[] {
  if (!entry) {
    return [];
  }

  return "abi" in entry ? [entry] : entry;
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
