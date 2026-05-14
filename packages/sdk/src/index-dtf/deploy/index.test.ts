import { decodeFunctionData, encodeAbiParameters, encodeEventTopics, parseEther, type Log } from "viem";
import { describe, expect, it } from "vitest";

import { indexDtfDeployerAbi } from "@/index-dtf/abis/deployer";
import { indexDtfGovernanceDeployerAbi } from "@/index-dtf/abis/governance-deployer";
import {
  buildIndexDtfDeployFeeRecipients,
  DEFAULT_INDEX_DTF_DEPLOY_FLAGS,
  extractIndexDtfDeployedAddress,
  extractIndexDtfDeployedStakingTokenAddress,
  getIndexDtfDeployApprovalAmount,
  INDEX_DTF_DEPLOYER_ADDRESS,
  INDEX_DTF_GOVERNANCE_DEPLOYER_ADDRESS,
  prepareIndexDtfDeploy,
  prepareIndexDtfDeployAssetApprovals,
  prepareIndexDtfDeployGoverned,
  prepareIndexDtfDeployPlan,
  prepareIndexDtfDeployStakingToken,
} from "@/index-dtf/deploy/index";

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
  mintFee: parseEther("0.0015"),
  mandate: "Test mandate",
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

  it("prepares governed deployGovernedFolio calls", () => {
    const call = prepareIndexDtfDeployGoverned({
      chainId: 1,
      stToken: ST_TOKEN,
      basicDetails,
      additionalDetails,
      flags: DEFAULT_INDEX_DTF_DEPLOY_FLAGS,
      ownerGovernance: governance,
      tradingGovernance: governance,
      roles: { auctionLaunchers: [ADMIN], brandManagers: [OWNER] },
      deploymentNonce: NONCE,
    });

    expect(call.to).toBe(INDEX_DTF_DEPLOYER_ADDRESS[1]);
    const decoded = decodeFunctionData({ abi: indexDtfDeployerAbi, data: call.data });

    expect(decoded.functionName).toBe("deployGovernedFolio");
    expect(decoded.args[0]).toBe(ST_TOKEN);
    expect(decoded.args[4]).toEqual(governance);
    expect(decoded.args[6]).toEqual({
      existingBasketManagers: [],
      auctionLaunchers: [ADMIN],
      brandManagers: [OWNER],
    });
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
      assets: [TOKEN_A, TOKEN_B],
      amounts: [100n, 200n],
    });

    expect(getIndexDtfDeployApprovalAmount(100n)).toBe(200n);
    expect(approvals.map((approval) => approval.contract.args)).toEqual([
      [INDEX_DTF_DEPLOYER_ADDRESS[8453], 200n],
      [INDEX_DTF_DEPLOYER_ADDRESS[8453], 400n],
    ]);
  });

  it("prepares deploy plans with approvals on the deploy chain", () => {
    const plan = prepareIndexDtfDeployPlan({
      chainId: 8453,
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
