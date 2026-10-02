import { keccak256, toBytes, zeroAddress } from "viem";
import { describe, expect, it, vi } from "vitest";

import type { DtfClient } from "@/client";

import { folioVersionRegistryAbi } from "@/index-dtf/abis/folio-version-registry.generated";
import {
  getIndexDtfLatestVersion,
  getIndexDtfVersionDeployment,
  getIndexDtfVersionHash,
  INDEX_DTF_VERSION_REGISTRY_ADDRESS,
} from "@/index-dtf/version-registry";

const DEPLOYER = "0x4D201a6e5BF975E2CEE9e5cbDfc803C0Ff122073";
const IMPLEMENTATION = "0x10E8ADc336e9D3d18E52567ecd0B151A54ac8E3D";
const V5_HASH = keccak256(toBytes("5.0.0"));

describe("Folio version registry reads", () => {
  it("hashes versions the way the registry does", () => {
    expect(getIndexDtfVersionHash("5.0.0")).toBe(V5_HASH);
  });

  it("reads getLatestVersion from the chain's registry by default", async () => {
    const readContract = vi.fn(async () => [V5_HASH, "5.0.0", DEPLOYER.toLowerCase(), false]);
    const client = { viem: { readContract } } as unknown as DtfClient;

    await expect(getIndexDtfLatestVersion(client, { chainId: 56 })).resolves.toEqual({
      versionHash: V5_HASH,
      version: "5.0.0",
      deployer: DEPLOYER,
      deprecated: false,
    });
    expect(readContract).toHaveBeenCalledWith({
      address: INDEX_DTF_VERSION_REGISTRY_ADDRESS[56],
      abi: folioVersionRegistryAbi,
      functionName: "getLatestVersion",
      chainId: 56,
      blockNumber: undefined,
    });
  });

  it("reads one registered version's deployer, implementation and deprecation", async () => {
    const multicall = vi.fn(async (_request: { readonly contracts: readonly unknown[] }) => [
      { status: "success", result: DEPLOYER },
      { status: "success", result: IMPLEMENTATION },
      { status: "success", result: true },
    ]);
    const client = { viem: { getPublicClient: vi.fn(() => ({ multicall })) } } as unknown as DtfClient;

    await expect(
      getIndexDtfVersionDeployment(client, { chainId: 1, version: "5.0.0", registry: DEPLOYER, blockNumber: 3n }),
    ).resolves.toEqual({
      version: "5.0.0",
      versionHash: V5_HASH,
      deployer: DEPLOYER,
      implementation: IMPLEMENTATION,
      deprecated: true,
    });
    expect(multicall.mock.calls[0]?.[0]).toMatchObject({
      allowFailure: true,
      blockNumber: 3n,
      contracts: [
        { address: DEPLOYER, functionName: "deployments", args: [V5_HASH] },
        { address: DEPLOYER, functionName: "getImplementationForVersion", args: [V5_HASH] },
        { address: DEPLOYER, functionName: "isDeprecated", args: [V5_HASH] },
      ],
    });
  });

  it("returns null for a version that was never registered", async () => {
    const multicall = vi.fn(async () => [
      { status: "success", result: zeroAddress },
      { status: "failure", error: new Error("revert") },
      { status: "success", result: false },
    ]);
    const client = { viem: { getPublicClient: vi.fn(() => ({ multicall })) } } as unknown as DtfClient;

    await expect(getIndexDtfVersionDeployment(client, { chainId: 8453, version: "9.9.9" })).resolves.toBeNull();
  });
});
