import { decodeFunctionData, parseEther, type PublicClient } from "viem";
import { describe, expect, it, vi } from "vitest";
import { createDtfClient } from "../../../client.js";
import { dtfIndexAbi } from "../../abis/dtf-index-abi.js";
import { dtfIndexGovernanceAbi } from "../../abis/dtf-index-governance.js";
import { dtfIndexStakingVaultAbi } from "../../abis/dtf-index-staking-vault.js";
import { timelockAbi } from "../../abis/timelock.js";
import {
  buildIndexDtfBasketSettingsProposal,
  buildIndexDtfDaoSettingsProposal,
  buildIndexDtfSettingsProposal,
  indexDtfSettingsProposalSchema,
} from "./settings.js";

const DTF = "0x0000000000000000000000000000000000000001";
const GOVERNANCE = "0x0000000000000000000000000000000000000002";
const TIMELOCK = "0x0000000000000000000000000000000000000003";
const GUARDIAN_A = "0x0000000000000000000000000000000000000004";
const GUARDIAN_B = "0x0000000000000000000000000000000000000005";
const ST_TOKEN = "0x0000000000000000000000000000000000000006";
const REWARD = "0x0000000000000000000000000000000000000007";
const DEPLOYER = "0x0000000000000000000000000000000000000008";
const CANCELLER_ROLE =
  "0xfd643c72710c63c0180259aba6b2d05451e3591a24e58b62239378085726f783";
const BRAND_MANAGER_ROLE =
  "0x2d8e650da9bd8c373ab2450d770f2ed39549bfc28d3630025cecc51511bcd374";
const AUCTION_LAUNCHER_ROLE =
  "0x13ff1b2625181b311f257c723b5e6d366eb318b212d9dd694c48fcf227659df5";

describe("settings proposal builders", () => {
  it("builds basket governance and guardian calls", async () => {
    const proposal = await buildIndexDtfBasketSettingsProposal({} as never, {
      address: DTF,
      chainId: 1,
      governance: GOVERNANCE,
      timelock: TIMELOCK,
      quorumDenominator: 100,
      currentGuardians: [GUARDIAN_A],
      guardians: [GUARDIAN_B],
      governanceChanges: {
        votingDelay: 60,
        quorumPercent: 25,
      },
    });

    expect(proposal.targets).toEqual([
      GOVERNANCE,
      GOVERNANCE,
      TIMELOCK,
      TIMELOCK,
    ]);

    expect(
      decodeFunctionData({ abi: dtfIndexGovernanceAbi, data: proposal.calldatas[0]! })
        .functionName,
    ).toBe("setVotingDelay");
    expect(
      decodeFunctionData({ abi: dtfIndexGovernanceAbi, data: proposal.calldatas[1]! })
        .args[0],
    ).toBe(25n);
    expect(
      decodeFunctionData({ abi: timelockAbi, data: proposal.calldatas[2]! })
        .functionName,
    ).toBe("revokeRole");
    expect(
      decodeFunctionData({ abi: timelockAbi, data: proposal.calldatas[2]! })
        .args[0],
    ).toBe(CANCELLER_ROLE);
    expect(
      decodeFunctionData({ abi: timelockAbi, data: proposal.calldatas[3]! })
        .functionName,
    ).toBe("grantRole");
    expect(
      decodeFunctionData({ abi: timelockAbi, data: proposal.calldatas[3]! })
        .args[0],
    ).toBe(CANCELLER_ROLE);
  });

  it("builds DTF settings calls", async () => {
    const proposal = await buildIndexDtfSettingsProposal({} as never, {
      address: DTF,
      chainId: 1,
      governance: GOVERNANCE,
      timelock: TIMELOCK,
      tokenName: "New DTF",
      mandate: "New mandate",
      mintFee: 1,
      auctionLength: 30,
      version: "5.0.0",
      weightControl: true,
      priceControl: 1,
    });

    expect(proposal.targets).toEqual([DTF, DTF, DTF, DTF, DTF]);
    expect(proposal.timelock).toBe(TIMELOCK);
    expect(
      decodeFunctionData({ abi: dtfIndexAbi, data: proposal.calldatas[0]! })
        .functionName,
    ).toBe("setName");
    expect(
      decodeFunctionData({ abi: dtfIndexAbi, data: proposal.calldatas[2]! }).args[0],
    ).toBe(10_000_000_000_000_000n);
    expect(
      decodeFunctionData({ abi: dtfIndexAbi, data: proposal.calldatas[3]! }).args[0],
    ).toBe(1800n);
    expect(
      decodeFunctionData({ abi: dtfIndexAbi, data: proposal.calldatas[3]! })
        .functionName,
    ).toBe("setAuctionLength");
  });

  it("fetches the DTF version for version-sensitive settings calls", async () => {
    const readContract = vi.fn(async () => "5.0.0");
    const client = createDtfClient({
      chains: {
        1: {
          publicClient: { readContract } as unknown as PublicClient,
        },
      },
    });

    const proposal = await buildIndexDtfSettingsProposal(client, {
      address: DTF,
      chainId: 1,
      governance: GOVERNANCE,
      timelock: TIMELOCK,
      auctionLength: 30,
    });

    expect(readContract).toHaveBeenCalledOnce();
    expect(
      decodeFunctionData({
        abi: dtfIndexAbi,
        data: proposal.calldatas[0]!,
      }).functionName,
    ).toBe("setAuctionLength");
  });

  it("does not fetch the DTF version when explicit v5 version is passed", async () => {
    const readContract = vi.fn(async () => "5.0.0");
    const client = createDtfClient({
      chains: {
        1: {
          publicClient: { readContract } as unknown as PublicClient,
        },
      },
    });

    const proposal = await buildIndexDtfSettingsProposal(client, {
      address: DTF,
      chainId: 1,
      governance: GOVERNANCE,
      timelock: TIMELOCK,
      auctionLength: 30,
      version: "5.0.0",
    });

    expect(readContract).not.toHaveBeenCalled();
    expect(
      decodeFunctionData({
        abi: dtfIndexAbi,
        data: proposal.calldatas[0]!,
      }).functionName,
    ).toBe("setAuctionLength");
  });

  it("rejects non-v5 settings proposal versions", async () => {
    await expect(
      buildIndexDtfSettingsProposal({} as never, {
        address: DTF,
        chainId: 1,
        governance: GOVERNANCE,
        timelock: TIMELOCK,
        auctionLength: 30,
        version: "6.0.0" as never,
      }),
    ).rejects.toMatchObject({ code: "INVALID_INPUT" });
  });

  it("builds price-control-only settings calls", async () => {
    const proposal = await buildIndexDtfSettingsProposal({} as never, {
      address: DTF,
      chainId: 1,
      governance: GOVERNANCE,
      timelock: TIMELOCK,
      dtf: createDtfContext({ weightControl: true, priceControl: 0 }),
      priceControl: 2,
      version: "5.0.0",
    });

    const decoded = decodeFunctionData({ abi: dtfIndexAbi, data: proposal.calldatas[0]! });
    expect(decoded.functionName).toBe("setRebalanceControl");
    expect(decoded.args[0]).toEqual({ weightControl: true, priceControl: 2 });
  });

  it("fetches the DTF version when no explicit version is passed", async () => {
    const readContract = vi.fn(async () => "5.0.0");
    const client = createDtfClient({
      chains: {
        1: {
          publicClient: { readContract } as unknown as PublicClient,
        },
      },
    });

    const proposal = await buildIndexDtfSettingsProposal(client, {
      address: DTF,
      chainId: 1,
      governance: GOVERNANCE,
      timelock: TIMELOCK,
      mandate: "New mandate",
    });

    expect(readContract).toHaveBeenCalledOnce();
    expect(
      decodeFunctionData({
        abi: dtfIndexAbi,
        data: proposal.calldatas[0]!,
      }).functionName,
    ).toBe("setMandate");
  });

  it("preserves explicit version in the settings schema", () => {
    expect(
      indexDtfSettingsProposalSchema.parse({
        auctionLength: 30,
        version: "5.0.0",
      }),
    ).toMatchObject({ version: "5.0.0" });
  });

  it("requires timelock to build settings proposals", async () => {
    await expect(
      buildIndexDtfSettingsProposal({} as never, {
        address: DTF,
        chainId: 1,
        governance: GOVERNANCE,
        mandate: "New mandate",
      }),
    ).rejects.toMatchObject({ code: "INVALID_INPUT" });
  });

  it("builds DAO reward token calls", async () => {
    const proposal = await buildIndexDtfDaoSettingsProposal({} as never, {
      address: DTF,
      chainId: 1,
      governance: GOVERNANCE,
      timelock: TIMELOCK,
      stToken: ST_TOKEN,
      addRewardTokens: [REWARD],
    });

    expect(proposal.targets).toEqual([ST_TOKEN]);
    expect(
      decodeFunctionData({
        abi: dtfIndexStakingVaultAbi,
        data: proposal.calldatas[0]!,
      }).functionName,
    ).toBe("addRewardToken");
  });

  it("uses exact DTF role hashes from Register", async () => {
    const proposal = await buildIndexDtfSettingsProposal({} as never, {
      address: DTF,
      chainId: 1,
      governance: GOVERNANCE,
      timelock: TIMELOCK,
      dtf: createDtfContext(),
      currentGuardians: [GUARDIAN_A],
      guardians: [GUARDIAN_B],
      brandManagers: [GUARDIAN_B],
      auctionLaunchers: [GUARDIAN_B],
    });

    expect(
      decodeFunctionData({ abi: timelockAbi, data: proposal.calldatas[0]! })
        .args[0],
    ).toBe(CANCELLER_ROLE);
    expect(
      decodeFunctionData({ abi: timelockAbi, data: proposal.calldatas[1]! })
        .args[0],
    ).toBe(CANCELLER_ROLE);
    expect(
      decodeFunctionData({ abi: dtfIndexAbi, data: proposal.calldatas[2]! })
        .args[0],
    ).toBe(BRAND_MANAGER_ROLE);
    expect(
      decodeFunctionData({ abi: dtfIndexAbi, data: proposal.calldatas[3]! })
        .args[0],
    ).toBe(AUCTION_LAUNCHER_ROLE);
  });

  it("rejects invalid revenue distribution shares", async () => {
    const dtf = createDtfContext();

    await expect(
      buildIndexDtfSettingsProposal({} as never, {
        address: DTF,
        chainId: 1,
        governance: GOVERNANCE,
        dtf: dtf as never,
        revenueDistribution: {
          platformFee: 100,
          governanceShare: 0,
          deployerShare: 1,
          additionalRecipients: [],
        },
      }),
    ).rejects.toMatchObject({ code: "INVALID_INPUT" });

    await expect(
      buildIndexDtfSettingsProposal({} as never, {
        address: DTF,
        chainId: 1,
        governance: GOVERNANCE,
        dtf: createDtfContext({ voteLock: true }),
        revenueDistribution: {
          platformFee: 20,
          governanceShare: 0,
          deployerShare: 80,
          additionalRecipients: [{ address: ST_TOKEN, share: 0 }],
        },
      }),
    ).rejects.toMatchObject({ code: "INVALID_INPUT" });

    await expect(
      buildIndexDtfSettingsProposal({} as never, {
        address: DTF,
        chainId: 1,
        governance: GOVERNANCE,
        dtf: dtf as never,
        revenueDistribution: {
          platformFee: 20,
          governanceShare: 0,
          deployerShare: 80,
          additionalRecipients: [{ address: DEPLOYER, share: 0 }],
        },
      }),
    ).rejects.toMatchObject({ code: "INVALID_INPUT" });

    await expect(
      buildIndexDtfSettingsProposal({} as never, {
        address: DTF,
        chainId: 1,
        governance: GOVERNANCE,
        dtf: dtf as never,
        revenueDistribution: {
          platformFee: 20,
          governanceShare: 0,
          deployerShare: 81,
          additionalRecipients: [{ address: GUARDIAN_A, share: -1 }],
        },
      }),
    ).rejects.toMatchObject({ code: "INVALID_INPUT" });

    await expect(
      buildIndexDtfSettingsProposal({} as never, {
        address: DTF,
        chainId: 1,
        governance: GOVERNANCE,
        dtf: dtf as never,
        revenueDistribution: {
          platformFee: 20,
          governanceShare: 0,
          deployerShare: -1,
          additionalRecipients: [{ address: GUARDIAN_A, share: 81 }],
        },
      }),
    ).rejects.toMatchObject({ code: "INVALID_INPUT" });

    await expect(
      buildIndexDtfSettingsProposal({} as never, {
        address: DTF,
        chainId: 1,
        governance: GOVERNANCE,
        dtf: dtf as never,
        revenueDistribution: {
          platformFee: -1,
          governanceShare: 0,
          deployerShare: 101,
          additionalRecipients: [],
        },
      }),
    ).rejects.toMatchObject({ code: "INVALID_INPUT" });

    await expect(
      buildIndexDtfSettingsProposal({} as never, {
        address: DTF,
        chainId: 1,
        governance: GOVERNANCE,
        dtf: dtf as never,
        revenueDistribution: {
          platformFee: 20,
          governanceShare: 0,
          deployerShare: 90,
          additionalRecipients: [],
        },
      }),
    ).rejects.toMatchObject({ code: "INVALID_INPUT" });

    await expect(
      buildIndexDtfSettingsProposal({} as never, {
        address: DTF,
        chainId: 1,
        governance: GOVERNANCE,
        dtf: dtf as never,
        revenueDistribution: {
          platformFee: 20,
          governanceShare: 0,
          deployerShare: 10,
          additionalRecipients: [{ address: GUARDIAN_A, share: 10 }],
        },
      }),
    ).rejects.toMatchObject({ code: "INVALID_INPUT" });

    await expect(
      buildIndexDtfSettingsProposal({} as never, {
        address: DTF,
        chainId: 1,
        governance: GOVERNANCE,
        dtf: dtf as never,
        revenueDistribution: {
          platformFee: 20,
          governanceShare: 80,
          deployerShare: 0,
          additionalRecipients: [],
        },
      }),
    ).rejects.toMatchObject({ code: "INVALID_INPUT" });

    await expect(
      buildIndexDtfSettingsProposal({} as never, {
        address: DTF,
        chainId: 1,
        governance: GOVERNANCE,
        dtf: dtf as never,
        revenueDistribution: {
          platformFee: 20,
          governanceShare: 0,
          deployerShare: 0,
          additionalRecipients: [
            { address: GUARDIAN_A, share: 40 },
            { address: GUARDIAN_A, share: 40 },
          ],
        },
      }),
    ).rejects.toMatchObject({ code: "INVALID_INPUT" });

    await expect(
      buildIndexDtfSettingsProposal({} as never, {
        address: DTF,
        chainId: 1,
        governance: GOVERNANCE,
        dtf: dtf as never,
        revenueDistribution: {
          platformFee: 20,
          governanceShare: 0,
          deployerShare: 0,
          additionalRecipients: [
            {
              address: "0x0000000000000000000000000000000000000000",
              share: 80,
            },
          ],
        },
      }),
    ).rejects.toMatchObject({ code: "INVALID_INPUT" });

    await expect(
      buildIndexDtfSettingsProposal({} as never, {
        address: DTF,
        chainId: 1,
        governance: GOVERNANCE,
        dtf: dtf as never,
        revenueDistribution: {
          platformFee: 20,
          governanceShare: 0,
          deployerShare: 0,
          additionalRecipients: Array.from({ length: 65 }, (_, index) => ({
            address: `0x${(index + 10).toString(16).padStart(40, "0")}` as `0x${string}`,
            share: index === 64 ? 16 : 1,
          })),
        },
      }),
    ).rejects.toMatchObject({ code: "INVALID_INPUT" });
  });

  it("rejects invalid DTF settings values before encoding", async () => {
    await expect(
      buildIndexDtfSettingsProposal({} as never, {
        address: DTF,
        chainId: 1,
        governance: GOVERNANCE,
        timelock: TIMELOCK,
        mintFee: 6,
      }),
    ).rejects.toMatchObject({ code: "INVALID_INPUT" });

    await expect(
      buildIndexDtfSettingsProposal({} as never, {
        address: DTF,
        chainId: 1,
        governance: GOVERNANCE,
        timelock: TIMELOCK,
        auctionLength: 1,
      }),
    ).rejects.toMatchObject({ code: "INVALID_INPUT" });

    await expect(
      buildIndexDtfSettingsProposal({} as never, {
        address: DTF,
        chainId: 1,
        governance: GOVERNANCE,
        timelock: TIMELOCK,
        priceControl: 3 as never,
      }),
    ).rejects.toMatchObject({ code: "INVALID_INPUT" });

    await expect(
      buildIndexDtfSettingsProposal({} as never, {
        address: DTF,
        chainId: 1,
        governance: GOVERNANCE,
        timelock: TIMELOCK,
      }),
    ).rejects.toMatchObject({ code: "INVALID_INPUT" });
  });

  it("validates raw revenue recipients before zero-share filtering", async () => {
    const dtf = createDtfContext();

    await expect(
      buildIndexDtfSettingsProposal({} as never, {
        address: DTF,
        chainId: 1,
        governance: GOVERNANCE,
        dtf: dtf as never,
        revenueDistribution: {
          platformFee: 20,
          governanceShare: 0,
          deployerShare: 80,
          additionalRecipients: [
            { address: GUARDIAN_A, share: 0 },
            { address: GUARDIAN_A, share: 0 },
          ],
        },
      }),
    ).rejects.toMatchObject({ code: "INVALID_INPUT" });

    await expect(
      buildIndexDtfSettingsProposal({} as never, {
        address: DTF,
        chainId: 1,
        governance: GOVERNANCE,
        dtf: dtf as never,
        revenueDistribution: {
          platformFee: 20,
          governanceShare: 0,
          deployerShare: 80,
          additionalRecipients: [
            {
              address: "0x0000000000000000000000000000000000000000",
              share: 0,
            },
          ],
        },
      }),
    ).rejects.toMatchObject({ code: "INVALID_INPUT" });

    await expect(
      buildIndexDtfSettingsProposal({} as never, {
        address: DTF,
        chainId: 1,
        governance: GOVERNANCE,
        dtf: dtf as never,
        revenueDistribution: {
          platformFee: 20,
          governanceShare: 0,
          deployerShare: 80,
          additionalRecipients: Array.from({ length: 65 }, (_, index) => ({
            address: `0x${(index + 10).toString(16).padStart(40, "0")}` as `0x${string}`,
            share: 0,
          })),
        },
      }),
    ).rejects.toMatchObject({ code: "INVALID_INPUT" });
  });

  it("encodes revenue recipient portions that sum to 100%", async () => {
    const proposal = await buildIndexDtfSettingsProposal({} as never, {
      address: DTF,
      chainId: 1,
      governance: GOVERNANCE,
      dtf: createDtfContext(),
      version: "5.0.0",
      revenueDistribution: {
        platformFee: 20,
        governanceShare: 0,
        deployerShare: 40,
        additionalRecipients: [{ address: GUARDIAN_A, share: 40 }],
      },
    });

    const decoded = decodeFunctionData({
      abi: dtfIndexAbi,
      data: proposal.calldatas[0]!,
    });
    const recipients = decoded.args[0] as readonly { readonly portion: bigint }[];
    const total = recipients.reduce(
      (sum, recipient) => sum + recipient.portion,
      0n,
    );

    expect(decoded.functionName).toBe("setFeeRecipients");
    expect(total).toBe(parseEther("1"));
  });

  it("encodes repeating revenue recipient portions", async () => {
    const proposal = await buildIndexDtfSettingsProposal({} as never, {
      address: DTF,
      chainId: 1,
      governance: GOVERNANCE,
      dtf: createDtfContext(),
      version: "5.0.0",
      revenueDistribution: {
        platformFee: 97,
        governanceShare: 0,
        deployerShare: 1,
        additionalRecipients: [
          { address: GUARDIAN_A, share: 1 },
          { address: GUARDIAN_B, share: 1 },
        ],
      },
    });

    const decoded = decodeFunctionData({
      abi: dtfIndexAbi,
      data: proposal.calldatas[0]!,
    });
    const recipients = decoded.args[0] as readonly { readonly portion: bigint }[];
    const total = recipients.reduce(
      (sum, recipient) => sum + recipient.portion,
      0n,
    );

    expect(decoded.functionName).toBe("setFeeRecipients");
    expect(recipients).toHaveLength(3);
    expect(total).toBe(parseEther("1"));
  });

  it("requires a full replacement revenue table", async () => {
    await expect(
      buildIndexDtfSettingsProposal({} as never, {
        address: DTF,
        chainId: 1,
        governance: GOVERNANCE,
        timelock: TIMELOCK,
        dtf: createDtfContext(),
        revenueDistribution: {
          platformFee: 20,
          deployerShare: 80,
        } as never,
      }),
    ).rejects.toMatchObject({ code: "INVALID_INPUT" });
  });

  it("encodes precise full revenue replacement tables", async () => {
    const proposal = await buildIndexDtfSettingsProposal({} as never, {
      address: DTF,
      chainId: 1,
      governance: GOVERNANCE,
      timelock: TIMELOCK,
      dtf: createDtfContext({
        feeRecipients: [
          { address: DEPLOYER, percentage: "33.333333333333333333" },
          { address: GUARDIAN_A, percentage: "33.333333333333333333" },
          { address: GUARDIAN_B, percentage: "33.333333333333333334" },
        ],
      }),
      version: "5.0.0",
      revenueDistribution: {
        platformFee: 20,
        governanceShare: 0,
        deployerShare: 26.666666666666664,
        additionalRecipients: [
          { address: GUARDIAN_A, share: 26.666666666666664 },
          { address: GUARDIAN_B, share: 26.66666666666667 },
        ],
      },
    });

    const decoded = decodeFunctionData({
      abi: dtfIndexAbi,
      data: proposal.calldatas[0]!,
    });
    const recipients = decoded.args[0] as readonly { readonly portion: bigint }[];
    const total = recipients.reduce(
      (sum, recipient) => sum + recipient.portion,
      0n,
    );

    expect(decoded.functionName).toBe("setFeeRecipients");
    expect(recipients).toHaveLength(3);
    expect(total).toBe(parseEther("1"));
  });
});

function createDtfContext(
  options: {
    readonly voteLock?: boolean;
    readonly weightControl?: boolean;
    readonly priceControl?: 0 | 1 | 2;
    readonly feeRecipients?: readonly {
      readonly address: `0x${string}`;
      readonly percentage: string;
    }[];
  } = {},
) {
  const context = {
    governance: {
      admin: {
        primary: {
          type: "governance",
          address: GOVERNANCE,
          governance: {
            address: GOVERNANCE,
            quorumDenominator: 100,
            timelock: { address: TIMELOCK, guardians: [] },
          },
        },
      },
    },
    roles: {
      metadata: { brandManagers: [] },
      rebalance: { auctionLaunchers: [] },
      deployment: { deployer: DEPLOYER },
    },
    rebalance: {
      weightControl: options.weightControl ?? false,
      priceControl: options.priceControl ?? 0,
    },
    fees: { recipients: options.feeRecipients ?? [] },
  };

  return options.voteLock
    ? {
        ...context,
        voteLockVault: {
          token: { address: ST_TOKEN },
        },
      } as never
    : context as never;
}
