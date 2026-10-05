import { getAbiItem, getAddress, toFunctionSelector, zeroAddress, type Address, type Hex } from "viem";

import type { DtfClient } from "@/client";
import type { SupportedChainId } from "@/config";
import type { BuiltIndexDtfProposal } from "@/index-dtf/governance/propose/settings-types";
import type { DtfParams } from "@/types/common";
import type { IndexDtfCall } from "@/types/governance";
import type { IndexDtf } from "@/types/index-dtf";

import { dtfAdminProposalAbi } from "@/index-dtf/abis/dtf-admin-proposal";
import { upgradeSpell600Abi } from "@/index-dtf/abis/upgrade-spell-6-0-0";
import { getVersion } from "@/index-dtf/dtf/index";
import {
  buildCallPayload,
  buildSettingsProposal,
  getAuthorityGovernance,
  getDtfIfNeeded,
} from "@/index-dtf/governance/propose/settings-shared";
import {
  prepareSelectorRegistryRegisterSelectors,
  prepareSelectorRegistryUnregisterSelectors,
} from "@/index-dtf/governance/selector-registry";
import { getIndexDtfWriteAbi } from "@/index-dtf/write-version";
import { prepareContractCall } from "@/lib/contract-call";
import { SdkError } from "@/lib/errors";

/** `startRebalance` selectors: the optimistic selector registry must swap v5 for v6 in the same proposal. */
export const INDEX_DTF_START_REBALANCE_SELECTOR = {
  "5.0.0": toFunctionSelector(getAbiItem({ abi: getIndexDtfWriteAbi("5.0.0"), name: "startRebalance" })),
  "6.0.0": toFunctionSelector(getAbiItem({ abi: getIndexDtfWriteAbi("6.0.0"), name: "startRebalance" })),
} as const satisfies Record<"5.0.0" | "6.0.0", Hex>;

export type BuildIndexDtfUpgradeToV6CallsParams = {
  readonly chainId: SupportedChainId;
  readonly address: Address;
  readonly proxyAdmin: Address;
  /** The deployed `UpgradeSpell_6_0_0` (`INDEX_DTF_UPGRADE_SPELL_6_0_0_ADDRESS`). */
  readonly spell: Address;
  /** The optimistic governor's selector registry; omit (or pass the zero address) for standard governance. */
  readonly selectorRegistry?: Address;
};

export type BuildIndexDtfUpgradeToV6ProposalParams = DtfParams & {
  readonly spell: Address;
  readonly description?: string;
  /** Skip the subgraph read when the caller already holds the DTF. */
  readonly dtf?: IndexDtf;
  readonly version?: string;
  readonly proxyAdmin?: Address;
  /** Overriding the governor is identity-only: pass `selectorRegistry` too when it is optimistic. */
  readonly governance?: Address;
  readonly timelock?: Address;
  readonly selectorRegistry?: Address;
};

/**
 * The exact call sequence the 5.0.0 → 6.0.0 spell needs from the admin timelock: hand the ProxyAdmin to the
 * spell, then cast. An optimistic governor first swaps the registered `startRebalance` selector, because the
 * v6 signature differs and the registry gates optimistic proposals by selector.
 */
export function buildIndexDtfUpgradeToV6Calls(params: BuildIndexDtfUpgradeToV6CallsParams): IndexDtfCall[] {
  const folio = getAddress(params.address);
  const proxyAdmin = getAddress(params.proxyAdmin);
  const spell = getAddress(params.spell);
  const selectorRegistry = resolveSelectorRegistry(params.selectorRegistry);
  const calls: IndexDtfCall[] = [];

  if (selectorRegistry !== zeroAddress) {
    calls.push(
      prepareSelectorRegistryRegisterSelectors({
        chainId: params.chainId,
        registry: selectorRegistry,
        selectorData: [{ target: folio, selectors: [INDEX_DTF_START_REBALANCE_SELECTOR["6.0.0"]] }],
      }),
      prepareSelectorRegistryUnregisterSelectors({
        chainId: params.chainId,
        registry: selectorRegistry,
        selectorData: [{ target: folio, selectors: [INDEX_DTF_START_REBALANCE_SELECTOR["5.0.0"]] }],
      }),
    );
  }

  calls.push(
    prepareContractCall({
      chainId: params.chainId,
      address: proxyAdmin,
      abi: dtfAdminProposalAbi,
      functionName: "transferOwnership",
      args: [spell] as const,
    }),
    prepareContractCall({
      chainId: params.chainId,
      address: spell,
      abi: upgradeSpell600Abi,
      functionName: "cast",
      args: [folio, proxyAdmin, selectorRegistry] as const,
    }),
  );

  return calls;
}

/**
 * Builds the upgrade proposal against the DTF's admin governance; only a 5.0.0 DTF can be upgraded. It is a
 * standard proposal even for an optimistic governor: the registry calls are not allowlisted selectors.
 */
export async function buildIndexDtfUpgradeToV6Proposal(
  client: DtfClient,
  params: BuildIndexDtfUpgradeToV6ProposalParams,
): Promise<BuiltIndexDtfProposal> {
  const needsDtf = params.proxyAdmin === undefined || params.governance === undefined || params.timelock === undefined;
  const [version, dtf] = await Promise.all([
    params.version ?? getVersion(client, params),
    getDtfIfNeeded(client, params, needsDtf),
  ]);
  if (version !== "5.0.0") {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: `Only Index DTF 5.0.0 can be upgraded to 6.0.0; this DTF is ${version}`,
      meta: { version },
    });
  }

  const adminGovernance = getAuthorityGovernance(dtf?.governance.admin.primary);
  const governance = params.governance ?? adminGovernance?.address;
  const timelock = params.timelock ?? adminGovernance?.timelock.address;
  // An explicit governor says nothing about its kind; only the indexed admin governance can imply optimistic.
  const selectorRegistry =
    params.governance !== undefined
      ? params.selectorRegistry
      : (params.selectorRegistry ??
        (adminGovernance?.isOptimistic ? adminGovernance.optimistic?.selectorRegistry : undefined));

  if (
    params.governance === undefined &&
    adminGovernance?.isOptimistic &&
    resolveSelectorRegistry(selectorRegistry) === zeroAddress
  ) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "selectorRegistry is required to upgrade an optimistically governed Index DTF",
      meta: { governance },
    });
  }

  const calls = buildIndexDtfUpgradeToV6Calls({
    chainId: params.chainId,
    address: params.address,
    proxyAdmin: params.proxyAdmin ?? requireProxyAdmin(dtf),
    spell: params.spell,
    ...(selectorRegistry ? { selectorRegistry } : {}),
  });

  return buildSettingsProposal({
    ...buildCallPayload({ governance, timelock, calls }),
    description: params.description ?? "Upgrade to Folio 6.0.0",
  });
}

function resolveSelectorRegistry(registry: Address | undefined): Address {
  return registry === undefined ? zeroAddress : getAddress(registry);
}

function requireProxyAdmin(dtf: IndexDtf | undefined): Address {
  if (!dtf) {
    throw new SdkError({ code: "INVALID_INPUT", message: "proxyAdmin is required to build an upgrade proposal" });
  }
  return dtf.roles.deployment.proxyAdmin;
}
