import { decodeFunctionData, encodeAbiParameters, encodeEventTopics, erc20Abi, parseEther, type Log } from "viem";
import { describe, expect, it } from "vitest";

import { indexDtfDeployerAbi } from "@/index-dtf/abis/deployer";
import { folioDeployerV6Abi } from "@/index-dtf/abis/folio-deployer-v6.generated";
import { indexDtfGovernanceDeployerAbi } from "@/index-dtf/abis/governance-deployer";
import {
  buildIndexDtfDeployFeeRecipients,
  DEFAULT_INDEX_DTF_DEPLOY_FLAGS,
  extractIndexDtfDeployedAddress,
  extractIndexDtfDeployedStakingTokenAddress,
  getIndexDtfDeployApprovalAmount,
  getIndexDtfDeployerAddress,
  INDEX_DTF_DEPLOYER_ADDRESS,
  INDEX_DTF_GOVERNANCE_DEPLOYER_ADDRESS,
  INDEX_DTF_V6_DEPLOYER_ADDRESS,
  prepareIndexDtfDeploy,
  prepareIndexDtfDeployAssetApproval,
  prepareIndexDtfDeployAssetApprovals,
  prepareIndexDtfDeployGoverned,
  prepareIndexDtfDeployGovernedPlan,
  prepareIndexDtfDeployPlan,
  prepareIndexDtfDeployStakingToken,
} from "@/index-dtf/deploy/index";
import { SdkError } from "@/lib/errors";

const DTF = "0x0000000000000000000000000000000000000001";
const OWNER = "0x0000000000000000000000000000000000000002";
const TOKEN_A = "0x0000000000000000000000000000000000000003";
const TOKEN_B = "0x0000000000000000000000000000000000000004";
const ST_TOKEN = "0x0000000000000000000000000000000000000005";
const ADMIN = "0x0000000000000000000000000000000000000006";
const NONCE = "0x0000000000000000000000000000000000000000000000000000000000000042";

const basicDetails = {
  name: "Test DTF",
  symbol: "TDTF",
  assets: [TOKEN_A, TOKEN_B],
  amounts: [100n, 200n],
  initialShares: parseEther("1"),
} as const;

const additionalDetails = {
  auctionLength: 1800n,
  feeRecipients: [{ recipient: OWNER, portion: parseEther("1") }],
  tvlFee: parseEther("0.0015"),
  mintFee: parseEther("0.0025"),
  mandate: "Test mandate",
} as const;

// A non-canonical Folio 6.0 deployer: the mainnet sandbox fixture's (index-subgraph/.fork/fixture.json), used as an override.
const V6_DEPLOYER = "0x388dB009b7984E673938AC20480194D4481bEF11";
const V6_DEPLOYER_LOWERCASE = "0x388db009b7984e673938ac20480194d4481bef11";

const additionalDetailsV6 = {
  maxAuctionLength: 1800n,
  feeRecipients: [{ recipient: OWNER, portion: parseEther("0.7") }],
  immutableFeeRecipients: [{ recipient: ST_TOKEN, portion: parseEther("0.3") }],
  tvlFee: parseEther("0.0015"),
  mintFee: parseEther("0.0025"),
  selfFee: parseEther("0.05"),
  mandate: "Test mandate",
} as const;

const optimisticGovernance = {
  optimistic: { vetoDelay: 3600, vetoPeriod: 86_400, vetoThreshold: parseEther("0.1") },
  standard: {
    votingDelay: 0,
    votingPeriod: 86_400,
    voteExtension: 600,
    proposalThreshold: parseEther("0.01"),
    quorumNumerator: 3n,
  },
  optimisticSelectors: ["0xc1e54b89"],
  optimisticProposers: [ADMIN],
  additionalGuardians: [OWNER],
  timelockDelay: 86_400n,
  proposalThrottleCapacity: 5n,
} as const;

const governance = {
  votingDelay: 0,
  votingPeriod: 86_400,
  proposalThreshold: parseEther("0.01"),
  quorumThreshold: parseEther("0.03"),
  timelockDelay: 86_400n,
  guardians: [ADMIN],
} as const;

describe("Index DTF deploy builders", () => {
  it("builds Register-style fee recipients from platform/deployer/governance shares", () => {
    const recipients = buildIndexDtfDeployFeeRecipients({
      platformFee: 50,
      governanceShare: 25,
      deployerShare: 15,
      additionalRecipients: [{ address: TOKEN_A, share: 10 }],
      deployer: OWNER,
      voteLock: ST_TOKEN,
    });

    expect(recipients).toEqual([
      { recipient: OWNER, portion: parseEther("0.3") },
      { recipient: TOKEN_A, portion: parseEther("0.2") },
      { recipient: ST_TOKEN, portion: parseEther("0.5") },
    ]);
  });

  it("prepares ungoverned deployFolio calls", () => {
    const call = prepareIndexDtfDeploy({
      chainId: 8453,
      version: "5.0.0",
      basicDetails,
      additionalDetails,
      flags: DEFAULT_INDEX_DTF_DEPLOY_FLAGS,
      owner: OWNER,
      auctionLaunchers: [ADMIN],
      deploymentNonce: NONCE,
    });

    expect(call.to).toBe(INDEX_DTF_DEPLOYER_ADDRESS[8453]);
    expect(decodeFunctionData({ abi: indexDtfDeployerAbi, data: call.data })).toMatchObject({
      functionName: "deployFolio",
      args: [basicDetails, additionalDetails, DEFAULT_INDEX_DTF_DEPLOY_FLAGS, OWNER, [], [ADMIN], [], NONCE],
    });
  });

  it("preserves distinct owner and trading governance in the complete deploy payload", () => {
    const tradingGovernance = {
      votingDelay: 60,
      votingPeriod: 43_200,
      proposalThreshold: parseEther("0.02"),
      quorumThreshold: parseEther("0.04"),
      timelockDelay: 3600n,
      guardians: [OWNER],
    } as const;
    const call = prepareIndexDtfDeployGoverned({
      chainId: 1,
      version: "5.0.0",
      stToken: ST_TOKEN,
      basicDetails,
      additionalDetails,
      flags: DEFAULT_INDEX_DTF_DEPLOY_FLAGS,
      ownerGovernance: governance,
      tradingGovernance,
      roles: { auctionLaunchers: [ADMIN], brandManagers: [OWNER] },
      deploymentNonce: NONCE,
    });

    expect(call).toMatchObject({ to: INDEX_DTF_DEPLOYER_ADDRESS[1], chainId: 1, value: 0n });
    const decoded = decodeFunctionData({ abi: indexDtfDeployerAbi, data: call.data });

    expect(decoded).toEqual({
      functionName: "deployGovernedFolio",
      args: [
        ST_TOKEN,
        basicDetails,
        additionalDetails,
        DEFAULT_INDEX_DTF_DEPLOY_FLAGS,
        governance,
        tradingGovernance,
        { existingBasketManagers: [], auctionLaunchers: [ADMIN], brandManagers: [OWNER] },
        NONCE,
      ],
    });
  });

  it("encodes Folio 6.0 deployFolio against an overriding v6 deployer with the v6 additional details", () => {
    const call = prepareIndexDtfDeploy({
      chainId: 1,
      version: "6.0.0",
      deployer: V6_DEPLOYER,
      basicDetails,
      additionalDetails: additionalDetailsV6,
      flags: DEFAULT_INDEX_DTF_DEPLOY_FLAGS,
      owner: OWNER,
      auctionLaunchers: [ADMIN],
      deploymentNonce: NONCE,
    });

    expect(call).toMatchObject({ to: V6_DEPLOYER, chainId: 1, value: 0n });
    expect(decodeFunctionData({ abi: folioDeployerV6Abi, data: call.data })).toEqual({
      functionName: "deployFolio",
      args: [
        basicDetails,
        {
          maxAuctionLength: 1800n,
          feeRecipients: [{ recipient: OWNER, portion: parseEther("0.7") }],
          immutableFeeRecipients: [{ recipient: ST_TOKEN, portion: parseEther("0.3") }],
          tvlFee: parseEther("0.0015"),
          mintFee: parseEther("0.0025"),
          folioFeeForSelf: parseEther("0.05"),
          mandate: "Test mandate",
        },
        DEFAULT_INDEX_DTF_DEPLOY_FLAGS,
        OWNER,
        [],
        [ADMIN],
        [],
        NONCE,
      ],
    });
    expect(() => decodeFunctionData({ abi: indexDtfDeployerAbi, data: call.data })).toThrow();
  });

  it("encodes Folio 6.0 deployGovernedFolio with one optimistic governance table", () => {
    const call = prepareIndexDtfDeployGoverned({
      chainId: 8453,
      version: "6.0.0",
      deployer: V6_DEPLOYER,
      stToken: ST_TOKEN,
      basicDetails,
      additionalDetails: additionalDetailsV6,
      flags: DEFAULT_INDEX_DTF_DEPLOY_FLAGS,
      governance: optimisticGovernance,
      roles: { auctionLaunchers: [ADMIN] },
      deploymentNonce: NONCE,
    });

    expect(call.to).toBe(V6_DEPLOYER);
    const decoded = decodeFunctionData({ abi: folioDeployerV6Abi, data: call.data });
    expect(decoded.functionName).toBe("deployGovernedFolio");
    expect(decoded.args?.[4]).toEqual({
      optimisticParams: { vetoDelay: 3600, vetoPeriod: 86_400, vetoThreshold: parseEther("0.1") },
      standardParams: {
        votingDelay: 0,
        votingPeriod: 86_400,
        voteExtension: 600,
        proposalThreshold: parseEther("0.01"),
        quorumNumerator: 3n,
      },
      optimisticSelectors: ["0xc1e54b89"],
      optimisticProposers: [ADMIN],
      additionalGuardians: [OWNER],
      timelockDelay: 86_400n,
      proposalThrottleCapacity: 5n,
    });
    expect(decoded.args?.[5]).toEqual({ existingBasketManagers: [], auctionLaunchers: [ADMIN], brandManagers: [] });
    expect(decoded.args?.[6]).toBe(NONCE);
  });

  it("points v6 plan approvals at an overriding deployer", () => {
    const plan = prepareIndexDtfDeployGovernedPlan({
      chainId: 8453,
      version: "6.0.0",
      deployer: V6_DEPLOYER,
      stToken: ST_TOKEN,
      basicDetails,
      additionalDetails: additionalDetailsV6,
      flags: DEFAULT_INDEX_DTF_DEPLOY_FLAGS,
      governance: optimisticGovernance,
      approvals: [{ token: TOKEN_A, amount: 100n }],
    });

    expect(plan.type).toBe("approval-required");
    if (plan.type !== "approval-required") throw new Error("expected approvals");
    expect(decodeFunctionData({ abi: erc20Abi, data: plan.approvals[0]!.data })).toEqual({
      functionName: "approve",
      args: [V6_DEPLOYER, 100n],
    });
  });

  it("routes ungoverned v6 plan approvals and plural approvals to the given deployer", () => {
    const plan = prepareIndexDtfDeployPlan({
      chainId: 1,
      version: "6.0.0",
      deployer: V6_DEPLOYER,
      basicDetails,
      additionalDetails: additionalDetailsV6,
      flags: DEFAULT_INDEX_DTF_DEPLOY_FLAGS,
      owner: OWNER,
      approvals: [{ token: TOKEN_A, amount: 100n }],
    });
    if (plan.type !== "approval-required") throw new Error("expected approvals");
    expect(decodeFunctionData({ abi: erc20Abi, data: plan.approvals[0]!.data }).args).toEqual([V6_DEPLOYER, 100n]);

    const approvals = prepareIndexDtfDeployAssetApprovals({
      chainId: 1,
      version: "6.0.0",
      assets: [TOKEN_A, TOKEN_B],
      amounts: [100n, 200n],
      deployer: V6_DEPLOYER,
    });
    expect(approvals.map((approval) => decodeFunctionData({ abi: erc20Abi, data: approval.data }).args)).toEqual([
      [V6_DEPLOYER, 200n],
      [V6_DEPLOYER, 400n],
    ]);
  });

  it("defaults v6 deploys, governed deploys and their plan approvals to the chain's 6.0.0 deployer", () => {
    // Pinned so an edit to the map fails here, not only in the opt-in real-deployer fork suite.
    expect(INDEX_DTF_V6_DEPLOYER_ADDRESS).toEqual({
      1: "0x2B1Cd9aEF0CD3B9fF5DCa1C66348eCfC46F37392",
      8453: "0x4c891fCa6319d492866672E3D2AfdAAA5bDcfF67",
      56: "0x9837Ce9825D52672Ca02533B5A160212bf901963",
    });
    for (const chainId of [1, 8453, 56] as const) {
      const deployer = INDEX_DTF_V6_DEPLOYER_ADDRESS[chainId];
      const plan = prepareIndexDtfDeployPlan({
        chainId,
        version: "6.0.0",
        basicDetails,
        additionalDetails: additionalDetailsV6,
        flags: DEFAULT_INDEX_DTF_DEPLOY_FLAGS,
        owner: OWNER,
        approvals: [{ token: TOKEN_A, amount: 100n }],
      });
      const governedPlan = prepareIndexDtfDeployGovernedPlan({
        chainId,
        version: "6.0.0",
        stToken: ST_TOKEN,
        basicDetails,
        additionalDetails: additionalDetailsV6,
        flags: DEFAULT_INDEX_DTF_DEPLOY_FLAGS,
        governance: optimisticGovernance,
        approvals: [{ token: TOKEN_B, amount: 200n }],
      });
      if (plan.type !== "approval-required" || governedPlan.type !== "approval-required") {
        throw new Error("expected approval plans");
      }

      expect(deployer).not.toBe(INDEX_DTF_DEPLOYER_ADDRESS[chainId]);
      expect(getIndexDtfDeployerAddress({ chainId, version: "6.0.0" })).toBe(deployer);
      expect(plan.call.to, `${chainId} deploy`).toBe(deployer);
      expect(decodeFunctionData({ abi: folioDeployerV6Abi, data: plan.call.data }).functionName).toBe("deployFolio");
      expect(governedPlan.call.to, `${chainId} governed deploy`).toBe(deployer);
      expect(decodeFunctionData({ abi: erc20Abi, data: plan.approvals[0]!.data }).args).toEqual([deployer, 100n]);
      expect(decodeFunctionData({ abi: erc20Abi, data: governedPlan.approvals[0]!.data }).args).toEqual([
        deployer,
        200n,
      ]);
    }
  });

  it("points standalone deploy approvals at the version's deployer and keeps an explicit override", () => {
    const spenderOf = (params: Parameters<typeof prepareIndexDtfDeployAssetApproval>[0]) =>
      decodeFunctionData({ abi: erc20Abi, data: prepareIndexDtfDeployAssetApproval(params).data }).args?.[0];

    expect(spenderOf({ chainId: 56, version: "6.0.0", token: TOKEN_A, amount: 1n })).toBe(
      INDEX_DTF_V6_DEPLOYER_ADDRESS[56],
    );
    expect(spenderOf({ chainId: 56, version: "5.0.0", token: TOKEN_A, amount: 1n })).toBe(
      INDEX_DTF_DEPLOYER_ADDRESS[56],
    );
    expect(
      spenderOf({ chainId: 56, version: "6.0.0", token: TOKEN_A, amount: 1n, deployer: V6_DEPLOYER_LOWERCASE }),
    ).toBe(V6_DEPLOYER);
    expect(
      prepareIndexDtfDeployAssetApprovals({ chainId: 8453, version: "6.0.0", assets: [TOKEN_A], amounts: [5n] }).map(
        (approval) => decodeFunctionData({ abi: erc20Abi, data: approval.data }).args,
      ),
    ).toEqual([[INDEX_DTF_V6_DEPLOYER_ADDRESS[8453], 10n]]);
    expect(getIndexDtfDeployerAddress({ chainId: 1, version: "6.0.0", deployer: V6_DEPLOYER_LOWERCASE })).toBe(
      V6_DEPLOYER,
    );
  });

  it("rejects out-of-range v6 details and malformed optimistic selectors", () => {
    const base = {
      chainId: 1,
      version: "6.0.0",
      deployer: V6_DEPLOYER,
      basicDetails,
      flags: DEFAULT_INDEX_DTF_DEPLOY_FLAGS,
      owner: OWNER,
    } as const;
    expect(() =>
      prepareIndexDtfDeploy({ ...base, additionalDetails: { ...additionalDetailsV6, maxAuctionLength: 60n } }),
    ).toThrow("maxAuctionLength");
    expect(() =>
      prepareIndexDtfDeployGoverned({
        ...base,
        stToken: ST_TOKEN,
        additionalDetails: additionalDetailsV6,
        governance: { ...optimisticGovernance, optimisticSelectors: [NONCE] },
      }),
    ).toThrow("4-byte");
  });

  it("rejects a self fee above 100% and unknown deploy versions", () => {
    const build = () =>
      prepareIndexDtfDeploy({
        chainId: 1,
        version: "6.0.0",
        deployer: V6_DEPLOYER,
        basicDetails,
        additionalDetails: { ...additionalDetailsV6, selfFee: parseEther("1.01") },
        flags: DEFAULT_INDEX_DTF_DEPLOY_FLAGS,
        owner: OWNER,
      });
    expect(build).toThrow(SdkError);
    expect(build).toThrow(expect.objectContaining({ code: "INVALID_INPUT" }));

    const unknown = () => getIndexDtfDeployerAddress({ chainId: 1, version: "4.0.0" as unknown as "5.0.0" });
    expect(unknown).toThrow(SdkError);
    expect(unknown).toThrow(expect.objectContaining({ code: "INVALID_INPUT", meta: { version: "4.0.0" } }));
    expect(getIndexDtfDeployerAddress({ chainId: 56, version: "5.0.0" })).toBe(INDEX_DTF_DEPLOYER_ADDRESS[56]);
  });

  it("prepares governed staking token deploy calls", () => {
    const call = prepareIndexDtfDeployStakingToken({
      chainId: 56,
      name: "Vote Lock TDTF",
      symbol: "vlTDTF",
      underlying: TOKEN_A,
      governance,
      deploymentNonce: NONCE,
    });

    expect(call.to).toBe(INDEX_DTF_GOVERNANCE_DEPLOYER_ADDRESS[56]);
    expect(decodeFunctionData({ abi: indexDtfGovernanceDeployerAbi, data: call.data })).toMatchObject({
      functionName: "deployGovernedStakingToken",
      args: ["Vote Lock TDTF", "vlTDTF", TOKEN_A, governance, NONCE],
    });
  });

  it("prepares deploy asset approvals with Register's 2x default buffer", () => {
    const approvals = prepareIndexDtfDeployAssetApprovals({
      chainId: 8453,
      version: "5.0.0",
      assets: [TOKEN_A, TOKEN_B],
      amounts: [100n, 200n],
    });

    expect(getIndexDtfDeployApprovalAmount({ amount: 100n })).toBe(200n);
    expect(
      approvals.map(({ to, chainId, value, data }) => ({
        to,
        chainId,
        value,
        decoded: decodeFunctionData({ abi: erc20Abi, data }),
      })),
    ).toEqual([
      {
        to: TOKEN_A,
        chainId: 8453,
        value: 0n,
        decoded: { functionName: "approve", args: [INDEX_DTF_DEPLOYER_ADDRESS[8453], 200n] },
      },
      {
        to: TOKEN_B,
        chainId: 8453,
        value: 0n,
        decoded: { functionName: "approve", args: [INDEX_DTF_DEPLOYER_ADDRESS[8453], 400n] },
      },
    ]);
  });

  it("prepares deploy plans with approvals on the deploy chain", () => {
    const plan = prepareIndexDtfDeployPlan({
      chainId: 8453,
      version: "5.0.0",
      basicDetails,
      additionalDetails,
      flags: DEFAULT_INDEX_DTF_DEPLOY_FLAGS,
      owner: OWNER,
      deploymentNonce: NONCE,
      approvals: [{ token: TOKEN_A, amount: 100n }],
    });

    expect(plan.type).toBe("approval-required");
    if (plan.type !== "approval-required") throw new Error("expected approval plan");
    expect(plan.approvals[0]?.chainId).toBe(8453);
    expect(plan.approvals[0]?.to).toBe(TOKEN_A);
    expect(plan.approvals[0]?.contract.args).toEqual([INDEX_DTF_DEPLOYER_ADDRESS[8453], 100n]);
  });

  it("extracts deployed DTF addresses from deploy logs", () => {
    const log = {
      address: INDEX_DTF_DEPLOYER_ADDRESS[1],
      topics: encodeEventTopics({
        abi: indexDtfDeployerAbi,
        eventName: "FolioDeployed",
        args: { folioOwner: OWNER, folio: DTF },
      }),
      data: encodeAbiParameters([{ type: "address" }], [ADMIN]),
    } as unknown as Log;

    expect(extractIndexDtfDeployedAddress([log])).toBe(DTF);
  });

  it("extracts governed deployed DTF addresses from deploy logs", () => {
    const log = {
      address: INDEX_DTF_DEPLOYER_ADDRESS[1],
      topics: encodeEventTopics({
        abi: indexDtfDeployerAbi,
        eventName: "GovernedFolioDeployed",
        args: { stToken: ST_TOKEN, folio: DTF },
      }),
      data: encodeAbiParameters(
        [{ type: "address" }, { type: "address" }, { type: "address" }, { type: "address" }],
        [OWNER, TOKEN_A, ADMIN, TOKEN_B],
      ),
    } as unknown as Log;

    expect(extractIndexDtfDeployedAddress([log])).toBe(DTF);
  });

  it("extracts deployed staking token addresses from governance deploy logs", () => {
    const log = {
      address: INDEX_DTF_GOVERNANCE_DEPLOYER_ADDRESS[1],
      topics: encodeEventTopics({
        abi: indexDtfGovernanceDeployerAbi,
        eventName: "DeployedGovernedStakingToken",
        args: { underlying: TOKEN_A, stToken: ST_TOKEN },
      }),
      data: encodeAbiParameters([{ type: "address" }, { type: "address" }], [OWNER, ADMIN]),
    } as unknown as Log;

    expect(extractIndexDtfDeployedStakingTokenAddress([log])).toBe(ST_TOKEN);
  });
});
