import { GetIndexDtfDirectoryDocument } from "@/index-dtf/subgraph/dtf.generated";

export const TEST_VAULT = "0x0000000000000000000000000000000000000007";
export const TEST_OWNER_GOVERNANCE = "0x0000000000000000000000000000000000000010";
export const TEST_DAO_GOVERNANCE = "0x0000000000000000000000000000000000000020";

/** Two DTFs on one vault: AAA has its own owner governance, BBB is governed only through the vault DAO. */
export const TEST_DIRECTORY = {
  dtfs: [
    {
      id: "0x00000000000000000000000000000000000000a1",
      token: { symbol: "AAA", name: "Triple A" },
      stToken: { id: TEST_VAULT, governance: { id: TEST_DAO_GOVERNANCE }, legacyGovernance: [] },
      ownerGovernance: { id: TEST_OWNER_GOVERNANCE },
      tradingGovernance: null,
      legacyAdmins: [],
      legacyAuctionApprovers: [],
    },
    {
      id: "0x00000000000000000000000000000000000000b2",
      token: { symbol: "BBB", name: "Triple B" },
      stToken: { id: TEST_VAULT, governance: { id: TEST_DAO_GOVERNANCE }, legacyGovernance: [] },
      ownerGovernance: null,
      tradingGovernance: null,
      legacyAdmins: [],
      legacyAuctionApprovers: [],
    },
  ],
};

export function isDirectoryQuery(query: unknown): boolean {
  return query === GetIndexDtfDirectoryDocument;
}
