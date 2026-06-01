import { afterEach, describe, expect, it, vi } from "vitest";

import { createDtfClientExplorer } from "@/client/explorer";

const ADDRESS = "0x0000000000000000000000000000000000000001";

describe("Dtf client explorer", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("does not fetch contract metadata without an Etherscan API key", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const explorer = createDtfClientExplorer({});

    await expect(explorer.getContractMetadata({ chainId: 1, address: ADDRESS })).resolves.toBeNull();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("parses verified Etherscan contract metadata", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          status: "1",
          result: [
            {
              ContractName: "ExternalConfigurator",
              ABI: JSON.stringify([
                {
                  type: "function",
                  name: "setFoo",
                  inputs: [{ name: "value", type: "uint256" }],
                  outputs: [],
                  stateMutability: "nonpayable",
                },
              ]),
            },
          ],
        }),
      ),
    );
    const explorer = createDtfClientExplorer({ etherscanApiKey: "key" });

    await expect(explorer.getContractMetadata({ chainId: 1, address: ADDRESS })).resolves.toMatchObject({
      contractName: "ExternalConfigurator",
    });
  });

  it("returns null for malformed ABI responses", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          status: "1",
          result: [
            {
              ContractName: "BrokenContract",
              ABI: "not json",
            },
          ],
        }),
      ),
    );
    const explorer = createDtfClientExplorer({ etherscanApiKey: "key" });

    await expect(explorer.getContractMetadata({ chainId: 1, address: ADDRESS })).resolves.toBeNull();
  });
});
