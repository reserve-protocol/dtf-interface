import { createPublicClient, http, type PublicClient } from "viem";
import { base } from "viem/chains";
import { describe, expect, it } from "vitest";

import { createDtfClient } from "@/client";

describe("viem client helpers", () => {
  it("creates public clients from configured RPC URLs", () => {
    const client = createDtfClient({
      chains: {
        8453: {
          rpcUrls: ["https://example.com"],
        },
      },
    });

    expect(client.viem.getRpcUrls(8453)[0]).toBe("https://example.com");
    expect(client.viem.getPublicClient(8453).chain?.id).toBe(8453);
  });

  it("uses configured public clients", () => {
    const publicClient = createPublicClient({
      chain: base,
      transport: http("https://example.com"),
    });
    const client = createDtfClient({
      chains: {
        8453: { publicClient: publicClient as unknown as PublicClient },
      },
    });

    expect(client.viem.getPublicClient(8453)).toBe(publicClient);
  });
});
