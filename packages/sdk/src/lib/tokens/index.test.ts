import type { Address, Hex } from "viem";

import {
  createPublicClient,
  custom,
  decodeFunctionData,
  encodeAbiParameters,
  encodeFunctionResult,
  multicall3Abi,
  stringToHex,
  toFunctionSelector,
} from "viem";
import { mainnet } from "viem/chains";
import { describe, expect, it, vi } from "vitest";

import { getTokensData } from "@/lib/tokens";

const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const MKR = "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2";
const NAME = toFunctionSelector("name()");
const SYMBOL = toFunctionSelector("symbol()");
const DECIMALS = toFunctionSelector("decimals()");

type RpcResult = { success: boolean; returnData: Hex };

// Synthetic raw RPC fixtures, not live chain responses. The real viem client
// encodes multicalls and decodes both string and legacy bytes32 metadata.
function metadataClient(overrides: Record<string, RpcResult> = {}) {
  const fixtures: Record<string, RpcResult> = {
    [`${USDC}:${NAME}`]: { success: true, returnData: encodeAbiParameters([{ type: "string" }], ["USD Coin"]) },
    [`${USDC}:${SYMBOL}`]: { success: true, returnData: encodeAbiParameters([{ type: "string" }], ["USDC"]) },
    [`${USDC}:${DECIMALS}`]: { success: true, returnData: encodeAbiParameters([{ type: "uint8" }], [6]) },
    [`${MKR}:${NAME}`]: { success: true, returnData: stringToHex("Maker", { size: 32 }) },
    [`${MKR}:${SYMBOL}`]: { success: true, returnData: stringToHex("MKR", { size: 32 }) },
    [`${MKR}:${DECIMALS}`]: { success: true, returnData: encodeAbiParameters([{ type: "uint8" }], [18]) },
    ...overrides,
  };
  const response = (address: Address, data: Hex) => {
    const key = Object.keys(fixtures).find((key) => key.toLowerCase() === `${address}:${data}`.toLowerCase());
    if (!key) throw new Error(`Unexpected fixture call: ${address}:${data}`);
    return fixtures[key]!;
  };
  const request = vi.fn(async ({ method, params }: { method: string; params?: unknown }) => {
    if (method !== "eth_call") throw new Error(`Unexpected RPC method: ${method}`);
    const [call] = params as [{ to: Address; data: Hex }];
    if (call.to.toLowerCase() === mainnet.contracts.multicall3.address.toLowerCase()) {
      const { args, functionName } = decodeFunctionData({ abi: multicall3Abi, data: call.data });
      if (functionName !== "aggregate3") throw new Error(`Unexpected multicall: ${functionName}`);
      return encodeFunctionResult({
        abi: multicall3Abi,
        functionName: "aggregate3",
        result: args[0].map(({ target, callData }) => response(target, callData)),
      });
    }
    const result = response(call.to, call.data);
    if (!result.success) throw new Error("metadata reverted");
    return result.returnData;
  });
  const client = createPublicClient({ chain: mainnet, transport: custom({ request }, { retryCount: 0 }) });
  return { client, request };
}

describe("getTokensData", () => {
  it("decodes mixed string and bytes32 metadata without changing token order or decimals", async () => {
    const { client, request } = metadataClient();

    await expect(getTokensData(client, [USDC, MKR, USDC])).resolves.toEqual([
      { address: USDC, name: "USD Coin", symbol: "USDC", decimals: 6 },
      { address: MKR, name: "Maker", symbol: "MKR", decimals: 18 },
      { address: USDC, name: "USD Coin", symbol: "USDC", decimals: 6 },
    ]);
    const directCalls = request.mock.calls
      .map(([{ params }]) => (params as [{ to: Address; data: Hex }])[0])
      .filter(({ to }) => to.toLowerCase() !== mainnet.contracts.multicall3.address.toLowerCase());
    expect(directCalls).toEqual([
      { to: MKR, data: NAME },
      { to: MKR, data: SYMBOL },
    ]);
  });

  it.each([
    [NAME, "name", "USD Coin"],
    [SYMBOL, "symbol", "USDC"],
  ] as const)("retries only failed %s metadata, including non-MKR tokens", async (selector, field, value) => {
    const { client, request } = metadataClient({
      [`${USDC}:${selector}`]: { success: true, returnData: stringToHex(value, { size: 32 }) },
    });

    await expect(getTokensData(client, [USDC])).resolves.toEqual([
      { address: USDC, name: "USD Coin", symbol: "USDC", decimals: 6 },
    ]);
    expect(request).toHaveBeenCalledTimes(2);
    expect(request.mock.calls[1]?.[0].params).toEqual([{ to: USDC, data: toFunctionSelector(`${field}()`) }, "latest"]);
  });

  it("does not retry successfully decoded ordinary metadata", async () => {
    const { client, request } = metadataClient();

    await expect(getTokensData(client, [USDC])).resolves.toEqual([
      { address: USDC, name: "USD Coin", symbol: "USDC", decimals: 6 },
    ]);
    expect(request).toHaveBeenCalledOnce();
  });

  it.each([NAME, SYMBOL])("propagates a reverted %s even after a bytes32 retry", async (selector) => {
    const { client } = metadataClient({ [`${USDC}:${selector}`]: { success: false, returnData: "0x" } });

    await expect(getTokensData(client, [USDC])).rejects.toThrow("metadata reverted");
  });

  it.each([NAME, SYMBOL])("rejects empty %s data instead of inventing metadata", async (selector) => {
    const { client } = metadataClient({ [`${USDC}:${selector}`]: { success: true, returnData: "0x" } });

    await expect(getTokensData(client, [USDC])).rejects.toThrow("returned no data");
  });

  it.each([NAME, SYMBOL])("rejects malformed dynamic %s data instead of decoding it as bytes32", async (selector) => {
    const { client } = metadataClient({
      [`${USDC}:${selector}`]: {
        success: true,
        returnData: encodeAbiParameters([{ type: "uint256" }, { type: "uint256" }], [32n, 5n]),
      },
    });

    await expect(getTokensData(client, [USDC])).rejects.toThrow();
  });

  it.each([NAME, SYMBOL])("rejects exactly 32 bytes of invalid UTF-8 in %s", async (selector) => {
    const { client } = metadataClient({
      [`${USDC}:${selector}`]: { success: true, returnData: `0x${"ff".repeat(32)}` },
    });

    await expect(getTokensData(client, [USDC])).rejects.toThrow();
  });

  it.each([false, true])("keeps mixed legacy token decimals a hard failure (success=%s)", async (success) => {
    const { client } = metadataClient({ [`${MKR}:${DECIMALS}`]: { success, returnData: "0x" } });

    await expect(getTokensData(client, [USDC, MKR])).rejects.toMatchObject({ functionName: "decimals" });
  });

  it.each([false, true])("keeps invalid decimals a hard failure (success=%s)", async (success) => {
    const { client, request } = metadataClient({ [`${USDC}:${DECIMALS}`]: { success, returnData: "0x" } });

    await expect(getTokensData(client, [USDC])).rejects.toMatchObject({ functionName: "decimals" });
    expect(request).toHaveBeenCalledOnce();
  });

  it("propagates RPC failures", async () => {
    const { client, request } = metadataClient();
    request.mockRejectedValue(new Error("RPC unavailable"));

    await expect(getTokensData(client, [USDC])).rejects.toThrow("RPC unavailable");
  });

  it("returns an empty list without RPC calls for no tokens", async () => {
    const { client, request } = metadataClient();

    await expect(getTokensData(client, [])).resolves.toEqual([]);
    expect(request).not.toHaveBeenCalled();
  });
});
