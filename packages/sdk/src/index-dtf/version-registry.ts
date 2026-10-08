import { getAddress, keccak256, toBytes, zeroAddress, type Address, type Hex } from "viem";

import type { DtfClient } from "@/client";
import type { SupportedChainId } from "@/config";

import { folioVersionRegistryAbi } from "@/index-dtf/abis/folio-version-registry.generated";

/** `FolioVersionRegistry` per chain, as returned by each chain's `FolioDeployer.versionRegistry()`. */
export const INDEX_DTF_VERSION_REGISTRY_ADDRESS = {
  1: "0xA665b273997F70b647B66fa7Ed021287544849dB",
  8453: "0xA665b273997F70b647B66fa7Ed021287544849dB",
  56: "0x79A4E963378AE34fC6c796a24c764322fC6c9390",
} as const satisfies Record<SupportedChainId, Address>;

export type IndexDtfLatestVersion = {
  readonly versionHash: Hex;
  readonly version: string;
  readonly deployer: Address;
  readonly deprecated: boolean;
};

export type IndexDtfVersionDeployment = {
  readonly version: string;
  readonly versionHash: Hex;
  readonly deployer: Address;
  readonly implementation: Address;
  readonly deprecated: boolean;
};

export type GetIndexDtfLatestVersionParams = {
  readonly chainId: SupportedChainId;
  readonly registry?: Address;
  readonly blockNumber?: bigint;
};

export type GetIndexDtfVersionDeploymentParams = GetIndexDtfLatestVersionParams & {
  readonly version: string;
};

/** The registry keys versions by `keccak256(abi.encodePacked(version))`. */
export function getIndexDtfVersionHash(version: string): Hex {
  return keccak256(toBytes(version));
}

/** Reads `getLatestVersion()`: the newest registered Folio release and its deployer. */
export async function getIndexDtfLatestVersion(
  client: DtfClient,
  params: GetIndexDtfLatestVersionParams,
): Promise<IndexDtfLatestVersion> {
  const [versionHash, version, deployer, deprecated] = await client.viem.readContract({
    address: getRegistryAddress(params),
    abi: folioVersionRegistryAbi,
    functionName: "getLatestVersion",
    chainId: params.chainId,
    blockNumber: params.blockNumber,
  });

  return { versionHash, version, deployer: getAddress(deployer), deprecated };
}

/**
 * Reads one registered release: deployer, Folio implementation and deprecation flag.
 * Returns `null` when the version was never registered on that chain.
 */
export async function getIndexDtfVersionDeployment(
  client: DtfClient,
  params: GetIndexDtfVersionDeploymentParams,
): Promise<IndexDtfVersionDeployment | null> {
  const registry = getRegistryAddress(params);
  const versionHash = getIndexDtfVersionHash(params.version);
  const [deployer, implementation, deprecated] = await client.viem.getPublicClient(params.chainId).multicall({
    allowFailure: true,
    blockNumber: params.blockNumber,
    contracts: [
      { address: registry, abi: folioVersionRegistryAbi, functionName: "deployments", args: [versionHash] },
      {
        address: registry,
        abi: folioVersionRegistryAbi,
        functionName: "getImplementationForVersion",
        args: [versionHash],
      },
      { address: registry, abi: folioVersionRegistryAbi, functionName: "isDeprecated", args: [versionHash] },
    ],
  });

  // `deployments` is a mapping getter and cannot revert on a real registry; a failure is a bad registry, not an absence.
  if (deployer.status !== "success") {
    throw deployer.error;
  }
  if (deployer.result === zeroAddress) {
    return null;
  }
  if (implementation.status !== "success") {
    throw implementation.error;
  }
  if (deprecated.status !== "success") {
    throw deprecated.error;
  }

  return {
    version: params.version,
    versionHash,
    deployer: getAddress(deployer.result),
    implementation: getAddress(implementation.result),
    deprecated: deprecated.result,
  };
}

function getRegistryAddress(params: { readonly chainId: SupportedChainId; readonly registry?: Address }): Address {
  return getAddress(params.registry ?? INDEX_DTF_VERSION_REGISTRY_ADDRESS[params.chainId]);
}
