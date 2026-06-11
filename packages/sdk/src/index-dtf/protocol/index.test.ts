import { indexDtfs as indexDtfCatalog } from "@reserve-protocol/dtf-catalog";
import { describe, expect, it } from "vitest";

import { createDtfClient } from "@/client";
import { getIndexDtfCatalogEntries, listIndexDtfs, resolveIndexDtfAlias } from "@/index-dtf/protocol/index";

const NEW_INDEX_DTF_DEPLOYMENTS = [
  {
    address: "0x5039ece83dc4e0621ebec391128339bd859a84d0",
    chainId: 1,
    name: "Reserve Photonics DTF (ETH)",
    symbol: "PHOTON",
  },
  {
    address: "0xa0fe4e0aeca5479705ce996615b2eacb6b6a10fb",
    chainId: 56,
    name: "Reserve Photonics DTF (BSC)",
    symbol: "PHOTON",
  },
  {
    address: "0x1ec1d815488936ec8add5cb76ac4563ceef09de3",
    chainId: 1,
    name: "Reserve AI Infrastructure DTF (ETH)",
    symbol: "BUILDOUT",
  },
  {
    address: "0xd7ce7a841310982acd976d1a6fe7bb6063c5689d",
    chainId: 56,
    name: "Reserve AI Infrastructure DTF (BSC)",
    symbol: "BUILDOUT",
  },
  {
    address: "0x09A823930FAB5b1FdA6e519b1EE33e7DA9bdA0E5",
    chainId: 1,
    name: "Reserve Robotics DTF (ETH)",
    symbol: "ROBOTS",
  },
  {
    address: "0x75617e7653f86f074cc30b9fd4ebf52ba9b62247",
    chainId: 56,
    name: "Reserve Robotics DTF (BSC)",
    symbol: "ROBOTS",
  },
  {
    address: "0x3CE752A0EB838084562c9d7A0e1dF24A8aE9542D",
    chainId: 1,
    name: "Reserve AI Power DTF (ETH)",
    symbol: "POWER",
  },
  {
    address: "0x290bCc0Fd5096cC3261AE2021841c7BC67Cb0f51",
    chainId: 56,
    name: "Reserve AI Power DTF (BSC)",
    symbol: "POWER",
  },
  {
    address: "0x9429a7332B5a3bCDE2781b65aC1A9EBd9f466e12",
    chainId: 1,
    name: "Reserve AI NeoCloud DTF (ETH)",
    symbol: "NEOCLOUD",
  },
  {
    address: "0xf571Fe3F0d74521Bc7310B111Faea931C748f27B",
    chainId: 56,
    name: "Reserve AI NeoCloud DTF (BSC)",
    symbol: "NEOCLOUD",
  },
  {
    address: "0xB394C76A9404b7Eb65841e1551952B97AAE7FD5C",
    chainId: 1,
    name: "Reserve AI Energy Generation DTF (ETH)",
    symbol: "ENERGY",
  },
  {
    address: "0xdBd6bc5e04B5Fd627E0AA67740b06537800fE7DB",
    chainId: 56,
    name: "Reserve AI Energy Generation DTF (BSC)",
    symbol: "ENERGY",
  },
  {
    address: "0x9beFcdDdC831198d5805c1690a2Fd3Bbd587845E",
    chainId: 1,
    name: "Reserve Quantum DTF (ETH)",
    symbol: "QUANTUM",
  },
  {
    address: "0xf51E0e1Fdd6EA5967a4Ea72fBdAA37C1e3Ba1369",
    chainId: 56,
    name: "Reserve Quantum DTF (BSC)",
    symbol: "QUANTUM",
  },
  {
    address: "0x8fc660a20b55BE94E7Ded6f47f8e17a2c7813383",
    chainId: 1,
    name: "Reserve AI Compute DTF (ETH)",
    symbol: "COMPUTE",
  },
  {
    address: "0xc561439bd5b6a279f61EA2F8a3f0d25D70ff57ad",
    chainId: 56,
    name: "Reserve AI Compute DTF (BSC)",
    symbol: "COMPUTE",
  },
] as const;

describe("Index DTF catalog list", () => {
  const client = createDtfClient();

  it("returns a flat list of catalog Index DTFs", async () => {
    const dtfs = await listIndexDtfs(client);

    expect(dtfs.length).toBeGreaterThan(0);
    expect(dtfs.every((dtf) => typeof dtf.address === "string")).toBe(true);
    expect(dtfs.every((dtf) => typeof dtf.chainId === "number")).toBe(true);
    expect(dtfs.every((dtf) => typeof dtf.status === "string")).toBe(true);
  });

  it("filters by chain id and status", async () => {
    const dtfs = await listIndexDtfs(client, {
      chainId: 8453,
      status: "active",
    });

    expect(dtfs.length).toBeGreaterThan(0);
    expect(dtfs.every((dtf) => dtf.chainId === 8453)).toBe(true);
    expect(dtfs.every((dtf) => dtf.status === "active")).toBe(true);
  });

  it("resolves Index DTF aliases from the catalog only", () => {
    const [dtf] = getIndexDtfCatalogEntries({ chainId: 8453, status: "active" });

    expect(dtf).toBeDefined();
    expect(resolveIndexDtfAlias({ input: dtf!.symbol, chainId: dtf!.chainId })).toMatchObject({
      address: dtf!.address,
      chainId: dtf!.chainId,
      symbol: dtf!.symbol,
    });
    expect(resolveIndexDtfAlias({ input: dtf!.address })).toMatchObject({ address: dtf!.address });
    expect(resolveIndexDtfAlias({ input: "   " })).toBeNull();
    expect(resolveIndexDtfAlias({ input: "not a real dtf" })).toBeNull();
  });

  it("includes the new Ethereum and BSC Index DTF deployments", () => {
    const dtfs = getIndexDtfCatalogEntries();

    for (const deployment of NEW_INDEX_DTF_DEPLOYMENTS) {
      const dtf = dtfs.find(
        (entry) =>
          entry.chainId === deployment.chainId && entry.address.toLowerCase() === deployment.address.toLowerCase(),
      );

      expect(dtf).toMatchObject({
        decimals: 18,
        logo: "default.webp",
        name: deployment.name,
        status: "active",
        symbol: deployment.symbol,
      });
    }
  });

  it("keeps new catalog addresses exactly as pasted", () => {
    for (const deployment of NEW_INDEX_DTF_DEPLOYMENTS) {
      const rawDtf = indexDtfCatalog[deployment.chainId][deployment.address];

      expect(rawDtf?.address).toBe(deployment.address);
    }
  });

  it("resolves new duplicate symbols when scoped to a chain", () => {
    expect(resolveIndexDtfAlias({ input: "compute", chainId: 1, status: "active" })).toMatchObject({
      chainId: 1,
      name: "Reserve AI Compute DTF (ETH)",
      symbol: "COMPUTE",
    });
    expect(resolveIndexDtfAlias({ input: "PHOTON", chainId: 56, status: "active" })).toMatchObject({
      chainId: 56,
      name: "Reserve Photonics DTF (BSC)",
      symbol: "PHOTON",
    });
  });

  it("returns ambiguous matches for duplicate symbols without a chain", () => {
    const result = resolveIndexDtfAlias({ input: "compute", status: "active" });

    expect(result).toMatchObject({
      ambiguous: [
        { chainId: 1, symbol: "COMPUTE" },
        { chainId: 56, symbol: "COMPUTE" },
      ],
    });
  });
});
