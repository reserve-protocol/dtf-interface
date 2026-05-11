import type { Address } from "viem";

import type { Authority, DtfParams, Governance } from "../../../types/common.js";
import type { IndexDtf, PriceControl } from "../../../types/index-dtf.js";
import type {
  BuildIndexDtfSettingsProposalParams,
  BuiltIndexDtfCalls,
  BuiltIndexDtfProposal,
} from "./settings-types.js";

import { SdkError } from "../../../errors.js";
import { getDtf, getVersion } from "../../dtf/index.js";
import { INDEX_DTF_VERSION_5_0_0, type IndexDtfVersion } from "../../versions.js";
import { assertNumberRange } from "./settings-governance.js";

const MAX_TOKEN_NAME_LENGTH = 32;
const MAX_MINT_FEE = 5;
const MAX_TVL_FEE = 10;
const MIN_AUCTION_LENGTH_MINUTES = 15;
const MAX_AUCTION_LENGTH_MINUTES = 1440;

export function buildSettingsProposal({
  calls,
  calldatas,
  description,
  governance,
  timelock,
  targets,
}: BuiltIndexDtfCalls & { readonly description: string | undefined }): BuiltIndexDtfProposal {
  if (calls.length === 0) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "proposal must include at least one call",
    });
  }

  return {
    governance: getProposalGovernance(governance),
    timelock: getProposalTimelock(timelock),
    targets,
    calldatas,
    description: description ?? "",
  };
}

export function buildCallPayload({
  calls,
  governance,
  timelock,
}: {
  readonly governance: Address | undefined;
  readonly timelock: Address | undefined;
  readonly calls: BuiltIndexDtfCalls["calls"];
}): BuiltIndexDtfCalls {
  return {
    ...(governance ? { governance } : {}),
    ...(timelock ? { timelock } : {}),
    calls,
    targets: calls.map((call) => call.to),
    calldatas: calls.map((call) => call.data),
  };
}

export async function getDtfIfNeeded(
  client: Parameters<typeof getDtf>[0],
  params: DtfParams & { readonly dtf?: IndexDtf },
  needed: boolean,
): Promise<IndexDtf | undefined> {
  return params.dtf ?? (needed ? getDtf(client, params) : undefined);
}

export async function getIndexDtfSettingsVersion(
  client: Parameters<typeof getVersion>[0],
  params: BuildIndexDtfSettingsProposalParams,
): Promise<typeof INDEX_DTF_VERSION_5_0_0> {
  const version = params.version ?? ((await getVersion(client, params)) as IndexDtfVersion);

  if (version !== INDEX_DTF_VERSION_5_0_0) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "Index DTF settings proposals currently support v5 only",
      meta: { version },
    });
  }

  return version;
}

export function hasIndexDtfSettingsCall(params: BuildIndexDtfSettingsProposalParams): boolean {
  return (
    (params.removeBasketTokens?.length ?? 0) > 0 ||
    params.tokenName !== undefined ||
    params.mandate !== undefined ||
    params.mintFee !== undefined ||
    params.tvlFee !== undefined ||
    params.auctionLength !== undefined ||
    params.weightControl !== undefined ||
    params.priceControl !== undefined ||
    params.bidsEnabled !== undefined ||
    params.revenueDistribution !== undefined
  );
}

export function getAuthorityGovernance(authority: Authority | undefined): Governance | undefined {
  return authority?.type === "governance" ? authority.governance : undefined;
}

export function validateDtfSettingsParams(params: BuildIndexDtfSettingsProposalParams) {
  if (params.tokenName !== undefined) assertStringLength(params.tokenName, "tokenName", 1, MAX_TOKEN_NAME_LENGTH);
  if (params.mintFee !== undefined) assertNumberRange(params.mintFee, "mintFee", 0, MAX_MINT_FEE);
  if (params.tvlFee !== undefined) assertNumberRange(params.tvlFee, "tvlFee", 0, MAX_TVL_FEE);
  if (params.auctionLength !== undefined)
    assertNumberRange(params.auctionLength, "auctionLength", MIN_AUCTION_LENGTH_MINUTES, MAX_AUCTION_LENGTH_MINUTES);
  if (params.priceControl !== undefined && !isPriceControl(params.priceControl)) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "priceControl must be 0, 1, or 2",
      meta: { priceControl: params.priceControl },
    });
  }
}

function getProposalGovernance(governance: Address | undefined): Address {
  if (!governance) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "governance is required to build an Index DTF proposal",
      meta: { governance },
    });
  }

  return governance;
}

function getProposalTimelock(timelock: Address | undefined): Address {
  if (!timelock) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "timelock is required to build this Index DTF proposal",
      meta: { timelock },
    });
  }

  return timelock;
}

function assertStringLength(value: string, field: string, minLength: number, maxLength: number) {
  if (value.length < minLength || value.length > maxLength) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: `${field} must be between ${minLength} and ${maxLength} characters`,
      meta: { [field]: value },
    });
  }
}

function isPriceControl(value: number): value is PriceControl {
  return Number.isInteger(value) && (value === 0 || value === 1 || value === 2);
}
