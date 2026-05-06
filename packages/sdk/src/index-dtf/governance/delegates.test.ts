import { describe, expect, it, vi } from "vitest";
import type { DtfClient } from "../../client.js";
import { getIndexDtfDelegates } from "./index.js";

describe("Index DTF governance delegates", () => {
  it("lists delegates ordered by delegated votes from the subgraph", async () => {
    const queryIndex = vi.fn(async () => ({
      stakingToken: {
        id: "0x0000000000000000000000000000000000000001",
        totalDelegates: "1",
        token: {
          totalSupply: "10000000000000000000",
        },
        delegates: [
          {
            address: "0x0000000000000000000000000000000000000002",
            delegatedVotes: "3000000000000000000",
            numberVotes: 4,
          },
        ],
      },
    }));
    const client = {
      subgraph: {
        queryIndex,
      },
    } as unknown as DtfClient;

    const delegates = await getIndexDtfDelegates(client, {
      chainId: 1,
      stToken: "0x0000000000000000000000000000000000000001",
      limit: 5,
    });

    expect(queryIndex).toHaveBeenCalledWith({
      chainId: 1,
      query: expect.anything(),
      variables: {
        stToken: "0x0000000000000000000000000000000000000001",
        limit: 5,
      },
    });
    expect(delegates).toEqual([
      {
        address: "0x0000000000000000000000000000000000000002",
        delegatedVotes: {
          raw: 3000000000000000000n,
          formatted: "3",
        },
        numberVotes: 4,
      },
    ]);
  });
});
