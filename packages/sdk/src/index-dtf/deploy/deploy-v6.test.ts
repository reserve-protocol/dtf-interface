import { decodeFunctionData, encodeAbiParameters, encodeEventTopics, parseEther, zeroAddress, type Log } from "viem";
import { describe, expect, it } from "vitest";

import { optimisticGovernorDeployerAbi } from "@/index-dtf/abis/optimistic-governor-deployer";
import {
  DEFAULT_INDEX_DTF_DEPLOY_FLAGS,
  extractIndexDtfDeployedStakingVault,
  INDEX_DTF_OPTIMISTIC_GOVERNOR_DEPLOYER_ADDRESS,
  prepareIndexDtfDeploy,
  prepareIndexDtfDeployGoverned,
  prepareIndexDtfDeployStakingVault,
} from "@/index-dtf/deploy/index";

const OWNER = "0x0000000000000000000000000000000000000002";
const TOKEN_A = "0x0000000000000000000000000000000000000003";
const TOKEN_B = "0x0000000000000000000000000000000000000004";
const ST_TOKEN = "0x0000000000000000000000000000000000000005";
const ADMIN = "0x0000000000000000000000000000000000000006";
const RSR = "0x320623b8E4fF03373931769A31Fc52A4E78B5d70" as const;
const NONCE = "0x0000000000000000000000000000000000000000000000000000000000000042" as const;

const basicDetails = {
  name: "Test DTF",
  symbol: "TDTF",
  assets: [TOKEN_A, TOKEN_B],
  amounts: [100n, 200n],
  initialShares: parseEther("1"),
} as const;

const additionalDetails = {
  maxAuctionLength: 1800n,
  feeRecipients: [{ recipient: OWNER, portion: parseEther("1") }],
  immutableFeeRecipients: [],
  tvlFee: parseEther("0.02"),
  mintFee: parseEther("0.003"),
  selfFee: 0n,
  mandate: "",
} as const;

const governance = {
  optimistic: { vetoDelay: 1, vetoPeriod: 86_400, vetoThreshold: parseEther("0.05") },
  standard: {
    votingDelay: 2,
    votingPeriod: 1_209_600,
    voteExtension: 604_800,
    proposalThreshold: parseEther("0.02"),
    quorumNumerator: parseEther("0.08"),
  },
  optimisticSelectors: [],
  optimisticProposers: [],
  additionalGuardians: [],
  timelockDelay: 172_800n,
  proposalThrottleCapacity: 10n,
} as const;

const ungoverned = (patch: Partial<typeof additionalDetails> = {}, amounts: readonly bigint[] = [100n, 200n]) =>
  prepareIndexDtfDeploy({
    chainId: 8453,
    version: "6.0.0",
    basicDetails: { ...basicDetails, amounts },
    additionalDetails: { ...additionalDetails, ...patch },
    flags: DEFAULT_INDEX_DTF_DEPLOY_FLAGS,
    owner: OWNER,
  });

const governed = (patch: Record<string, unknown>) =>
  prepareIndexDtfDeployGoverned({
    chainId: 8453,
    version: "6.0.0",
    stToken: ST_TOKEN,
    basicDetails,
    additionalDetails,
    flags: DEFAULT_INDEX_DTF_DEPLOY_FLAGS,
    governance: { ...governance, ...patch } as never,
  });

describe("Folio 6.0 deploy bounds", () => {
  it("accepts the protocol's own fork-test parameters", () => {
    expect(() => governed({})).not.toThrow();
    expect(() => ungoverned()).not.toThrow();
  });

  it.each([
    ["a zero asset amount", () => ungoverned({}, [100n, 0n]), "amounts"],
    ["a TVL fee above 10%", () => ungoverned({ tvlFee: parseEther("0.11") }), "tvlFee"],
    ["a mint fee above 5%", () => ungoverned({ mintFee: parseEther("0.051") }), "mintFee"],
  ])("rejects %s", (_, build, field) => {
    expect(build).toThrow(expect.objectContaining({ code: "INVALID_INPUT", message: expect.stringContaining(field) }));
  });

  it.each([
    ["a zero veto delay", { optimistic: { ...governance.optimistic, vetoDelay: 0 } }, "vetoDelay"],
    ["a veto period under 5 minutes", { optimistic: { ...governance.optimistic, vetoPeriod: 299 } }, "vetoPeriod"],
    ["a zero veto threshold", { optimistic: { ...governance.optimistic, vetoThreshold: 0n } }, "vetoThreshold"],
    [
      "a veto threshold above 100%",
      { optimistic: { ...governance.optimistic, vetoThreshold: parseEther("1.01") } },
      "vetoThreshold",
    ],
    ["a zero proposal threshold", { standard: { ...governance.standard, proposalThreshold: 0n } }, "proposalThreshold"],
    [
      "a quorum above 100%",
      { standard: { ...governance.standard, quorumNumerator: parseEther("1.01") } },
      "quorumNumerator",
    ],
    ["a zero quorum", { standard: { ...governance.standard, quorumNumerator: 0n } }, "quorumNumerator"],
    ["a throttle of 0", { proposalThrottleCapacity: 0n }, "proposalThrottleCapacity"],
    ["a throttle above 12", { proposalThrottleCapacity: 13n }, "proposalThrottleCapacity"],
    ["the zero selector", { optimisticSelectors: ["0x00000000"] }, "optimisticSelectors"],
  ])("rejects %s", (_, patch, field) => {
    expect(() => governed(patch)).toThrow(
      expect.objectContaining({ code: "INVALID_INPUT", message: expect.stringContaining(field) }),
    );
  });

  it("rejects the zero address as the staking vault", () => {
    expect(() =>
      prepareIndexDtfDeployGoverned({
        chainId: 8453,
        version: "6.0.0",
        stToken: zeroAddress,
        basicDetails,
        additionalDetails,
        flags: DEFAULT_INDEX_DTF_DEPLOY_FLAGS,
        governance,
      }),
    ).toThrow(expect.objectContaining({ code: "INVALID_INPUT", message: expect.stringContaining("stToken") }));
  });
});

describe("new staking vault (governance deployer 1.1.0)", () => {
  const vault = {
    chainId: 8453 as const,
    underlying: RSR,
    rewardHalfLife: 3n * 86_400n,
    unstakingDelay: 7n * 86_400n,
    governance,
    deploymentNonce: NONCE,
  };

  it("encodes deployWithNewStakingVault on the chain's 1.1.0 deployer", () => {
    const call = prepareIndexDtfDeployStakingVault({ ...vault, rewardTokens: [TOKEN_A] });

    expect(call.to).toBe(INDEX_DTF_OPTIMISTIC_GOVERNOR_DEPLOYER_ADDRESS[8453]);
    const decoded = decodeFunctionData({ abi: optimisticGovernorDeployerAbi, data: call.data });
    expect(decoded.functionName).toBe("deployWithNewStakingVault");
    expect(decoded.args).toEqual([
      {
        optimisticParams: { vetoDelay: 1, vetoPeriod: 86_400, vetoThreshold: parseEther("0.05") },
        standardParams: {
          votingDelay: 2,
          votingPeriod: 1_209_600,
          voteExtension: 604_800,
          proposalThreshold: parseEther("0.02"),
          quorumNumerator: parseEther("0.08"),
        },
        selectorData: [],
        optimisticProposers: [],
        additionalGuardians: [],
        timelockDelay: 172_800n,
        proposalThrottleCapacity: 10n,
      },
      { underlying: RSR, rewardTokens: [TOKEN_A], rewardHalfLife: 259_200n, unstakingDelay: 604_800n },
      NONCE,
    ]);
  });

  it.each([
    ["a reward half-life under a day", { rewardHalfLife: 86_399n }, "rewardHalfLife"],
    ["a reward half-life over two weeks", { rewardHalfLife: 1_209_601n }, "rewardHalfLife"],
    ["an unstaking delay over four weeks", { unstakingDelay: 2_419_201n }, "unstakingDelay"],
    ["more than 20 reward tokens", { rewardTokens: Array(21).fill(TOKEN_A) }, "rewardTokens"],
  ])("rejects %s", (_, patch, field) => {
    expect(() => prepareIndexDtfDeployStakingVault({ ...vault, ...(patch as object) })).toThrow(
      expect.objectContaining({ code: "INVALID_INPUT", message: expect.stringContaining(field) }),
    );
  });

  const systemLog = (address: string, stakingVault: string): Log =>
    ({
      address,
      topics: encodeEventTopics({
        abi: optimisticGovernorDeployerAbi,
        eventName: "ReserveOptimisticGovernorSystemDeployed",
        args: { stakingVault: stakingVault as never, governor: OWNER, timelock: ADMIN },
      }),
      data: encodeAbiParameters([{ type: "address" }], [TOKEN_B]),
    }) as unknown as Log;

  it("reads the new vault and its DAO from the deployer's event only", () => {
    const deployer = INDEX_DTF_OPTIMISTIC_GOVERNOR_DEPLOYER_ADDRESS[8453];
    expect(
      extractIndexDtfDeployedStakingVault([systemLog(TOKEN_A, ADMIN), systemLog(deployer, ST_TOKEN)], {
        chainId: 8453,
      }),
    ).toEqual({ stakingVault: ST_TOKEN, governor: OWNER, timelock: ADMIN, selectorRegistry: TOKEN_B });
  });

  it("fails without a new vault from the deployer", () => {
    const deployer = INDEX_DTF_OPTIMISTIC_GOVERNOR_DEPLOYER_ADDRESS[8453];
    expect(() => extractIndexDtfDeployedStakingVault([systemLog(TOKEN_A, ST_TOKEN)], { chainId: 8453 })).toThrow(
      expect.objectContaining({ code: "RECORD_NOT_FOUND" }),
    );
    expect(() => extractIndexDtfDeployedStakingVault([systemLog(deployer, zeroAddress)], { chainId: 8453 })).toThrow(
      expect.objectContaining({ code: "RECORD_NOT_FOUND" }),
    );
  });
});
