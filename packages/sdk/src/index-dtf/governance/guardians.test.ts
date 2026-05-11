import { describe, expect, it } from "vitest";

import { getGuardians } from "@/index-dtf/governance/index";

describe("Index DTF governance guardians", () => {
  it("groups owner, basket, and dao guardians from DTF governance", async () => {
    const guardians = await getGuardians({} as never, {
      dtf: {
        governance: {
          admin: {
            primary: governanceAuthority(
              "0x0000000000000000000000000000000000000001",
              "0x0000000000000000000000000000000000000002",
              ["0x0000000000000000000000000000000000000003"],
            ),
          },
          rebalance: {
            primary: governanceAuthority(
              "0x0000000000000000000000000000000000000004",
              "0x0000000000000000000000000000000000000005",
              ["0x0000000000000000000000000000000000000003", "0x0000000000000000000000000000000000000006"],
            ),
          },
          voteLock: governanceAuthority(
            "0x0000000000000000000000000000000000000007",
            "0x0000000000000000000000000000000000000008",
            ["0x0000000000000000000000000000000000000009"],
          ),
        },
      } as never,
    });

    expect(guardians).toEqual({
      owner: {
        governance: "0x0000000000000000000000000000000000000001",
        timelock: "0x0000000000000000000000000000000000000002",
        guardians: ["0x0000000000000000000000000000000000000003"],
      },
      basket: {
        governance: "0x0000000000000000000000000000000000000004",
        timelock: "0x0000000000000000000000000000000000000005",
        guardians: ["0x0000000000000000000000000000000000000003", "0x0000000000000000000000000000000000000006"],
      },
      dao: {
        governance: "0x0000000000000000000000000000000000000007",
        timelock: "0x0000000000000000000000000000000000000008",
        guardians: ["0x0000000000000000000000000000000000000009"],
      },
      all: [
        "0x0000000000000000000000000000000000000003",
        "0x0000000000000000000000000000000000000006",
        "0x0000000000000000000000000000000000000009",
      ],
    });
  });
});

function governanceAuthority(address: string, timelock: string, guardians: readonly string[]) {
  return {
    address,
    type: "governance",
    governance: {
      timelock: {
        address: timelock,
        guardians,
      },
    },
  };
}
