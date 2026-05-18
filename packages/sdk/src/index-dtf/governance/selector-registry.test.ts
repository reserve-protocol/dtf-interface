import { describe, expect, it, vi } from "vitest";

import type { DtfClient } from "@/client";

import {
  getSelectorRegistryAllowedSelectors,
  getSelectorRegistryIsAllowed,
  getSelectorRegistryTargets,
  prepareSelectorRegistryRegisterSelectors,
  prepareSelectorRegistryUnregisterSelectors,
} from "@/index-dtf/governance/selector-registry";

describe("Index DTF selector registry", () => {
  it("reads targets, allowed selectors, and selector status", async () => {
    const readContract = vi
      .fn()
      .mockResolvedValueOnce(["0x0000000000000000000000000000000000000002"])
      .mockResolvedValueOnce(["0x12345678"])
      .mockResolvedValueOnce(true);
    const client = { viem: { readContract } } as unknown as DtfClient;
    const registry = "0x0000000000000000000000000000000000000001";
    const target = "0x0000000000000000000000000000000000000002";

    await expect(getSelectorRegistryTargets(client, { chainId: 1, registry })).resolves.toEqual([target]);
    await expect(
      getSelectorRegistryAllowedSelectors(client, {
        chainId: 1,
        registry,
        target,
      }),
    ).resolves.toEqual(["0x12345678"]);
    await expect(
      getSelectorRegistryIsAllowed(client, {
        chainId: 1,
        registry,
        target,
        selector: "0x12345678",
      }),
    ).resolves.toBe(true);
  });

  it("prepares selector registry whitelist updates", () => {
    const register = prepareSelectorRegistryRegisterSelectors({
      chainId: 1,
      registry: "0x0000000000000000000000000000000000000001",
      selectorData: [
        {
          target: "0x0000000000000000000000000000000000000002",
          selectors: ["0x12345678"],
        },
      ],
    });
    const unregister = prepareSelectorRegistryUnregisterSelectors({
      chainId: 1,
      registry: "0x0000000000000000000000000000000000000001",
      selectorData: [
        {
          target: "0x0000000000000000000000000000000000000002",
          selectors: ["0x12345678"],
        },
      ],
    });

    expect(register.contract.functionName).toBe("registerSelectors");
    expect(unregister.contract.functionName).toBe("unregisterSelectors");
    expect(register.contract.args).toEqual([
      [
        {
          target: "0x0000000000000000000000000000000000000002",
          selectors: ["0x12345678"],
        },
      ],
    ]);
  });

  it("rejects selectors that are not bytes4", () => {
    expect(() =>
      prepareSelectorRegistryRegisterSelectors({
        chainId: 1,
        registry: "0x0000000000000000000000000000000000000001",
        selectorData: [
          {
            target: "0x0000000000000000000000000000000000000002",
            selectors: ["0x1234567890"],
          },
        ],
      }),
    ).toThrow("bytes4");
  });
});
