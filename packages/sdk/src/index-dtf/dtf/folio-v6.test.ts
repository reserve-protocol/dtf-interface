import {
  ContractFunctionExecutionError,
  ContractFunctionZeroDataError,
  HttpRequestError,
  getAddress,
  type Address,
} from "viem";
import { describe, expect, it, vi } from "vitest";

import type { DtfClient } from "@/client";

import { folioV6Abi } from "@/index-dtf/abis/folio-v6.generated";
import {
  getIndexDtfImmutableFeeRecipients,
  getIndexDtfIsTokenAllowlisted,
  getIndexDtfMaxAuctionLength,
  getIndexDtfSelfFee,
  getIndexDtfTradeAllowlist,
} from "@/index-dtf/dtf/folio-v6";

const DTF = getAddress("0x4da9a0f397db1397902070f93a4d6ddbc0e0e6e8");
const TOKEN = getAddress("0x833589fcd6edb6e08f4c7c32d4f71b54bda02913");
const LOWER_DTF = DTF.toLowerCase() as Address;
const LOWER_TOKEN = TOKEN.toLowerCase() as Address;
const RECIPIENT_A = "0x000000000000000000000000000000000000000a";
const RECIPIENT_B = "0x000000000000000000000000000000000000000b";

type MulticallRequest = {
  readonly contracts: readonly { address: string; functionName: string; args?: readonly unknown[] }[];
  readonly allowFailure: boolean;
  readonly blockNumber?: bigint;
};

function createClient(handlers: {
  readonly readContract?: (request: { functionName: string; args?: readonly unknown[] }) => unknown;
  readonly multicall?: (request: MulticallRequest) => unknown;
  readonly probeFails?: boolean;
  readonly boundaryTransportFails?: boolean;
}) {
  const readContract = vi.fn(async (request: { functionName: string; args?: readonly unknown[] }) =>
    handlers.readContract?.(request),
  );
  const multicall = vi.fn(async (request: MulticallRequest) => handlers.multicall?.(request));
  const getBlockNumber = vi.fn(async () => 777n);
  const probe = vi.fn(async (request: { functionName: string; args?: readonly unknown[]; blockNumber?: bigint }) => {
    if (handlers.probeFails) throw new Error("not v6");
    if (request.functionName === "folioFeeForSelf") return 0n;
    // The boundary read: a contract revert past the table end, or a transport failure when asked to.
    if (handlers.boundaryTransportFails) {
      throw new ContractFunctionExecutionError(
        new HttpRequestError({ url: "http://127.0.0.1", details: "connection reset" }),
        {
          abi: folioV6Abi,
          functionName: request.functionName,
          args: request.args ?? [],
        },
      );
    }
    throw new ContractFunctionExecutionError(
      new ContractFunctionZeroDataError({ functionName: request.functionName }),
      {
        abi: folioV6Abi,
        functionName: request.functionName,
        args: request.args ?? [],
      },
    );
  });
  const client = {
    viem: { readContract, getPublicClient: vi.fn(() => ({ multicall, getBlockNumber, readContract: probe })) },
  } as unknown as DtfClient;

  return { client, readContract, multicall, getBlockNumber, probe };
}

function immutableTable(table: readonly (readonly [string, bigint])[]) {
  return ({ contracts }: MulticallRequest) =>
    contracts.map(({ args }) => {
      const entry = table[Number(args?.[0])];

      return entry ? { status: "success", result: entry } : { status: "failure", error: new Error("revert") };
    });
}

describe("Folio 6.0 state reads", () => {
  it("reads maxAuctionLength with the v6 ABI at the requested block", async () => {
    const { client, readContract } = createClient({ readContract: () => 1800n });

    await expect(
      getIndexDtfMaxAuctionLength(client, { address: LOWER_DTF, chainId: 56, blockNumber: 9n }),
    ).resolves.toBe(1800n);
    expect(readContract).toHaveBeenCalledWith({
      address: DTF,
      abi: folioV6Abi,
      functionName: "maxAuctionLength",
      chainId: 56,
      blockNumber: 9n,
    });
  });

  it("maps folioFeeForSelf as a D18 amount at the requested block", async () => {
    const { client, readContract } = createClient({ readContract: () => 50_000_000_000_000_000n });

    await expect(getIndexDtfSelfFee(client, { address: DTF, chainId: 1, blockNumber: 10n })).resolves.toEqual({
      raw: 50_000_000_000_000_000n,
      formatted: "0.05",
    });
    expect(readContract).toHaveBeenCalledWith({
      address: DTF,
      abi: folioV6Abi,
      functionName: "folioFeeForSelf",
      chainId: 1,
      blockNumber: 10n,
    });
  });

  it("reads the immutable table in one pinned multicall and stops at the first reverting index", async () => {
    const { client, multicall, getBlockNumber, probe } = createClient({
      multicall: immutableTable([
        [RECIPIENT_A, 300_000_000_000_000_000n],
        [RECIPIENT_B, 200_000_000_000_000_000n],
      ]),
    });

    await expect(getIndexDtfImmutableFeeRecipients(client, { address: LOWER_DTF, chainId: 8453 })).resolves.toEqual([
      { recipient: "0x000000000000000000000000000000000000000A", portion: 300_000_000_000_000_000n },
      { recipient: "0x000000000000000000000000000000000000000b", portion: 200_000_000_000_000_000n },
    ]);
    expect(multicall).toHaveBeenCalledOnce();
    expect(getBlockNumber).toHaveBeenCalledOnce();
    const request = multicall.mock.calls[0]![0];
    expect(request.blockNumber).toBe(777n);
    expect(request.contracts.map(({ functionName }) => functionName)).toEqual(
      Array.from({ length: 64 }, () => "immutableFeeRecipients"),
    );
    expect(request.contracts.map(({ args }) => args?.[0])).toEqual(Array.from({ length: 64 }, (_, i) => BigInt(i)));
    expect(request.contracts.every((contract) => contract.address === DTF)).toBe(true);
    expect(request).toMatchObject({ batchSize: 0 });
    expect(getBlockNumber).toHaveBeenCalledWith({ cacheTime: 0 });
    expect(probe).toHaveBeenNthCalledWith(1, {
      address: DTF,
      abi: folioV6Abi,
      functionName: "folioFeeForSelf",
      blockNumber: 777n,
    });
    expect(probe).toHaveBeenNthCalledWith(2, {
      address: DTF,
      abi: folioV6Abi,
      functionName: "immutableFeeRecipients",
      args: [2n],
      blockNumber: 777n,
    });
  });

  it("returns a full 64-entry table and keeps an explicit block", async () => {
    const { client, multicall, getBlockNumber } = createClient({
      multicall: immutableTable(Array.from({ length: 64 }, () => [RECIPIENT_A, 1n] as const)),
    });

    await expect(
      getIndexDtfImmutableFeeRecipients(client, { address: DTF, chainId: 1, blockNumber: 5n }),
    ).resolves.toHaveLength(64);
    expect(getBlockNumber).not.toHaveBeenCalled();
    expect(multicall.mock.calls[0]![0].blockNumber).toBe(5n);
  });

  it("returns an empty table when the probe succeeds and index 0 reverts", async () => {
    const { client } = createClient({ multicall: immutableTable([]) });

    await expect(getIndexDtfImmutableFeeRecipients(client, { address: DTF, chainId: 1 })).resolves.toEqual([]);
  });

  it("refuses a short table when the boundary read fails as a request instead of a revert", async () => {
    const { client } = createClient({ multicall: immutableTable([]), boundaryTransportFails: true });

    await expect(getIndexDtfImmutableFeeRecipients(client, { address: DTF, chainId: 1 })).rejects.toThrow(
      "connection reset",
    );
  });

  it("throws instead of reporting an empty table when the address is not a Folio 6.0", async () => {
    const { client, multicall } = createClient({ probeFails: true, multicall: immutableTable([]) });

    await expect(getIndexDtfImmutableFeeRecipients(client, { address: DTF, chainId: 1 })).rejects.toThrow("not v6");
    expect(multicall).not.toHaveBeenCalled();
  });

  it("reads allowlist enforcement and tokens in one multicall", async () => {
    const { client, multicall } = createClient({ multicall: () => [true, [LOWER_TOKEN]] });

    await expect(getIndexDtfTradeAllowlist(client, { address: DTF, chainId: 56, blockNumber: 5n })).resolves.toEqual({
      enabled: true,
      tokens: [TOKEN],
    });
    expect(multicall.mock.calls[0]?.[0]).toMatchObject({
      allowFailure: false,
      blockNumber: 5n,
      contracts: [
        { address: DTF, functionName: "tradeAllowlistEnabled" },
        { address: DTF, functionName: "getTokenAllowlist" },
      ],
    });
  });

  it("reads isTokenAllowlisted for one token", async () => {
    const { client, readContract } = createClient({ readContract: () => false });

    await expect(
      getIndexDtfIsTokenAllowlisted(client, { address: LOWER_DTF, chainId: 1, token: LOWER_TOKEN }),
    ).resolves.toBe(false);
    expect(readContract).toHaveBeenCalledWith({
      address: DTF,
      abi: folioV6Abi,
      functionName: "isTokenAllowlisted",
      args: [TOKEN],
      chainId: 1,
      blockNumber: undefined,
    });
  });
});
