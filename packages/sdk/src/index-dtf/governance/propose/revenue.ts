import { getAddress, parseEther, type Address } from "viem";

import type { IndexDtfCall } from "@/types/governance";
import type { IndexDtf } from "@/types/index-dtf";

import { SdkError } from "@/lib/errors";
import { prepareIndexDtfSetFeeRecipients, type IndexDtfWriteVersion } from "@/index-dtf/governance/propose/calls";
import { Decimal } from "@/lib/decimal";

const MAX_FEE_RECIPIENTS = 64;
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const RECIPIENT_SHARE_TOLERANCE = new Decimal("0.000000000001");

export type IndexDtfRevenueRecipientInput = {
  readonly address: Address;
  readonly share: number;
};

export type IndexDtfRevenueDistributionInput = {
  // Current platform fee used to normalize recipient shares. This does not
  // encode a platform fee change.
  readonly platformFee: number;
  readonly governanceShare: number;
  readonly deployerShare: number;
  readonly additionalRecipients: readonly IndexDtfRevenueRecipientInput[];
};

export type IndexDtfFeeRecipient = {
  readonly recipient: Address;
  readonly portion: bigint;
};

export type BuildIndexDtfFeeRecipientsParams = IndexDtfRevenueDistributionInput & {
  readonly deployer: Address;
  readonly voteLock?: Address;
};

export type RevenueDistributionCall = IndexDtfCall;

export function prepareRevenueDistribution(
  dtfAddress: Address,
  chainId: IndexDtf["chainId"],
  dtf: IndexDtf | undefined,
  distribution: IndexDtfRevenueDistributionInput | undefined,
  version: IndexDtfWriteVersion,
): RevenueDistributionCall | undefined {
  if (!distribution) {
    return undefined;
  }

  validateRevenueDistributionInput(dtf, distribution);

  const recipients = buildIndexDtfFeeRecipients({
    platformFee: distribution.platformFee,
    governanceShare: distribution.governanceShare,
    deployerShare: distribution.deployerShare,
    additionalRecipients: distribution.additionalRecipients,
    deployer: dtf.roles.deployment.deployer,
    ...(dtf.voteLockVault ? { voteLock: dtf.voteLockVault.token.address } : {}),
  });

  return recipients.length > 0
    ? prepareIndexDtfSetFeeRecipients({ address: dtfAddress, chainId, recipients, version })
    : undefined;
}

export function validateRevenueDistributionInput(
  dtf: IndexDtf | undefined,
  distribution: IndexDtfRevenueDistributionInput,
): asserts dtf is IndexDtf {
  if (!dtf) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "dtf context is required to build revenue distribution proposals",
    });
  }

  validatePlatformFee(distribution.platformFee);
  validateRevenueDistribution(distribution);

  validateRawAdditionalRecipients(distribution.additionalRecipients, [
    dtf.roles.deployment.deployer,
    ...(dtf.voteLockVault ? [dtf.voteLockVault.token.address] : []),
  ]);
  validateRecipientShares({
    platformFee: distribution.platformFee,
    governanceShare: distribution.governanceShare,
    deployerShare: distribution.deployerShare,
    additionalRecipients: distribution.additionalRecipients,
    hasVoteLock: !!dtf.voteLockVault,
  });
}

function validateRevenueDistribution(distribution: IndexDtfRevenueDistributionInput) {
  if (!Array.isArray(distribution.additionalRecipients)) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "additionalRecipients is required to build revenue distribution proposals",
    });
  }
}

function validatePlatformFee(platformFee: number) {
  if (!Number.isFinite(platformFee) || platformFee < 0 || platformFee >= 100) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "platformFee must be between 0 and 100",
    });
  }
}

function validateRecipientShares({
  additionalRecipients,
  deployerShare,
  governanceShare,
  hasVoteLock,
  platformFee,
}: {
  readonly platformFee: number;
  readonly governanceShare: number;
  readonly deployerShare: number;
  readonly additionalRecipients: readonly IndexDtfRevenueRecipientInput[];
  readonly hasVoteLock: boolean;
}) {
  const shares = [governanceShare, deployerShare].concat(additionalRecipients.map((recipient) => recipient.share));
  const totalRecipientShare = shares.reduce((sum, share) => sum.plus(share), new Decimal(0));
  const nonPlatformShare = new Decimal(100).minus(platformFee);

  if (shares.some((share) => !Number.isFinite(share) || share < 0)) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "revenue recipient shares must be positive",
    });
  }
  if (governanceShare > 0 && !hasVoteLock) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "voteLockVault is required when governanceShare is greater than zero",
    });
  }
  if (totalRecipientShare.minus(nonPlatformShare).abs().gt(RECIPIENT_SHARE_TOLERANCE)) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "revenue recipient shares must equal the non-platform share",
      meta: { platformFee, totalRecipientShare: totalRecipientShare.toNumber() },
    });
  }
}

export function buildIndexDtfFeeRecipients({
  additionalRecipients,
  deployer,
  deployerShare,
  governanceShare,
  platformFee,
  voteLock,
}: BuildIndexDtfFeeRecipientsParams): IndexDtfFeeRecipient[] {
  validatePlatformFee(platformFee);
  validateRevenueDistribution({ platformFee, governanceShare, deployerShare, additionalRecipients });
  validateRawAdditionalRecipients(additionalRecipients, [deployer, ...(voteLock ? [voteLock] : [])]);
  validateRecipientShares({
    platformFee,
    governanceShare,
    deployerShare,
    additionalRecipients,
    hasVoteLock: !!voteLock,
  });

  const nonPlatformShare = new Decimal(100).minus(platformFee);
  const calculatePortion = (share: number) => {
    const actualFraction = new Decimal(share).div(100);
    const nonPlatformFraction = nonPlatformShare.div(100);

    return parseEther(actualFraction.div(nonPlatformFraction).toFixed(18, Decimal.ROUND_DOWN));
  };
  const recipients: { recipient: Address; portion: bigint }[] = [];

  for (const recipient of additionalRecipients) {
    if (recipient.share > 0) {
      recipients.push({
        recipient: getAddress(recipient.address),
        portion: calculatePortion(recipient.share),
      });
    }
  }
  if (deployerShare > 0) {
    recipients.push({ recipient: deployer, portion: calculatePortion(deployerShare) });
  }
  if (governanceShare > 0 && voteLock) {
    recipients.push({ recipient: voteLock, portion: calculatePortion(governanceShare) });
  }

  validateFeeRecipients(recipients);

  if (recipients.length > 1) {
    const currentSum = recipients.slice(0, -1).reduce((sum, recipient) => sum + recipient.portion, 0n);
    recipients[recipients.length - 1]!.portion = parseEther("1") - currentSum;
  }

  return recipients.sort((a, b) => a.recipient.toLowerCase().localeCompare(b.recipient.toLowerCase()));
}

function validateFeeRecipients(recipients: readonly { readonly recipient: Address; readonly portion: bigint }[]) {
  if (recipients.length > MAX_FEE_RECIPIENTS) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: `fee recipients cannot exceed ${MAX_FEE_RECIPIENTS}`,
      meta: { count: recipients.length },
    });
  }

  const seen = new Set<string>();

  for (const recipient of recipients) {
    const address = getAddress(recipient.recipient);
    const key = address.toLowerCase();

    if (key === ZERO_ADDRESS) {
      throw new SdkError({
        code: "INVALID_INPUT",
        message: "fee recipient cannot be the zero address",
      });
    }
    if (seen.has(key)) {
      throw new SdkError({
        code: "INVALID_INPUT",
        message: "fee recipients must be unique",
        meta: { recipient: address },
      });
    }

    seen.add(key);
  }
}

function validateRawAdditionalRecipients(
  recipients: readonly IndexDtfRevenueRecipientInput[],
  reservedRecipients: readonly Address[],
) {
  if (recipients.length > MAX_FEE_RECIPIENTS) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: `fee recipients cannot exceed ${MAX_FEE_RECIPIENTS}`,
      meta: { count: recipients.length },
    });
  }

  const seen = new Set(reservedRecipients.map((recipient) => getAddress(recipient).toLowerCase()));

  for (const recipient of recipients) {
    const address = getAddress(recipient.address);
    const key = address.toLowerCase();

    if (key === ZERO_ADDRESS) {
      throw new SdkError({
        code: "INVALID_INPUT",
        message: "fee recipient cannot be the zero address",
      });
    }
    if (seen.has(key)) {
      throw new SdkError({
        code: "INVALID_INPUT",
        message: "fee recipients must be unique",
        meta: { recipient: address },
      });
    }

    seen.add(key);
  }
}
