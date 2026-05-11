import { describe, expect, it } from "vitest";

import { createDtfClient } from "../client.js";
import { createWalletClient } from "./viem.js";

const privateKey = "0x0000000000000000000000000000000000000000000000000000000000000001";

describe("viem wallet helpers", () => {
  it("creates a wallet client from a private key", () => {
    const walletClient = createWalletClient({
      chainId: 8453,
      privateKey,
      rpcUrls: ["https://example.com"],
    });

    expect(walletClient.account?.address).toBe("0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf");
    expect(walletClient.chain?.id).toBe(8453);
  });

  it("creates configured wallet clients from the SDK client", () => {
    const client = createDtfClient({
      chains: {
        8453: {
          rpcUrls: ["https://example.com"],
        },
      },
    });
    const walletClient = client.viem.createWalletClient({
      chainId: 8453,
      privateKey,
    });

    expect(walletClient.account?.address).toBe("0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf");
    expect(walletClient.chain?.id).toBe(8453);
  });
});
