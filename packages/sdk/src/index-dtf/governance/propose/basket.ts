import { getAddress, zeroAddress, type Address, type Hex } from "viem";

import type { DtfClient } from "../../../client.js";
import type { DtfParams } from "../../../types/common.js";
import type { IndexDtfCall } from "../../../types/governance.js";
import type { IndexDtf } from "../../../types/index-dtf.js";

import { prepareContractCall } from "../../../contract-call.js";
import { SdkError } from "../../../errors.js";
import { dtfIndexAbi } from "../../abis/dtf-index-abi.js";
import {
  DEFAULT_AUCTION_LAUNCHER_WINDOW,
  buildIndexDtfStartRebalance,
  indexDtfBasketSchema,
  indexDtfBasketSharesSchema,
  indexDtfBasketTokenSchema,
  indexDtfBasketUnitsSchema,
  type BuildIndexDtfStartRebalanceParams,
  type BuiltIndexDtfStartRebalance,
  type IndexDtfBasketInput,
  type IndexDtfBasketSharesInput,
  type IndexDtfBasketTokenInput,
  type IndexDtfBasketUnitsInput,
  type StartRebalanceArgsV5,
} from "../../dtf/basket/index.js";
import { getDtf } from "../../dtf/index.js";

const MAX_REBALANCE_TTL = 604_800n * 4n;

export {
  indexDtfBasketSchema as indexDtfBasketProposalSchema,
  indexDtfBasketSharesSchema as indexDtfBasketSharesProposalSchema,
  indexDtfBasketTokenSchema as indexDtfBasketProposalTokenSchema,
  indexDtfBasketUnitsSchema as indexDtfBasketUnitsProposalSchema,
};

export type IndexDtfBasketProposalBaseToken = IndexDtfBasketTokenInput;
export type IndexDtfBasketProposalSharesInput = IndexDtfBasketSharesInput;
export type IndexDtfBasketProposalUnitsInput = IndexDtfBasketUnitsInput;
export type IndexDtfBasketProposalInput = IndexDtfBasketInput;

export type BuildIndexDtfBasketProposalParams = BuildIndexDtfStartRebalanceParams & {
  readonly description?: string;
  readonly governance?: Address;
  readonly auctionLauncherWindow?: number | bigint;
  readonly permissionlessWindow?: number | bigint;
  readonly ttl?: number | bigint;
};

export type BuiltIndexDtfBasketProposalContext = BuiltIndexDtfStartRebalance & {
  readonly chainId: DtfParams["chainId"];
  readonly auctionLauncherWindow: bigint;
  readonly ttl: bigint;
};

export type BuiltIndexDtfBasketProposal = {
  readonly governance: Address;
  readonly targets: readonly Address[];
  readonly calldatas: readonly Hex[];
  readonly description: string;
  readonly context: BuiltIndexDtfBasketProposalContext;
};

export async function buildIndexDtfBasketProposal(
  client: DtfClient,
  params: BuildIndexDtfBasketProposalParams,
): Promise<BuiltIndexDtfBasketProposal> {
  const windows = getRebalanceWindows(params);
  validateBasketTokenAddresses(params);
  const dtf = await getDtfForProposal(client, params);
  const rebalance = await buildIndexDtfStartRebalance(client, {
    ...params,
    ...(dtf ? { dtf } : {}),
  });
  const context: BuiltIndexDtfBasketProposalContext = {
    ...rebalance,
    chainId: params.chainId,
    ...windows,
  };
  const authority = getProposalAuthority(params, dtf);
  const call = prepareIndexDtfBasketRebalance(context);

  return {
    governance: authority.governance,
    targets: [call.to],
    calldatas: [call.data],
    description: params.description ?? "",
    context,
  };
}

function prepareIndexDtfBasketRebalance(context: BuiltIndexDtfBasketProposalContext): IndexDtfCall {
  const args = getStartRebalanceArgs(context);

  return prepareContractCall({
    chainId: context.chainId,
    address: context.address,
    abi: dtfIndexAbi,
    functionName: "startRebalance",
    args,
  });
}

async function getDtfForProposal(
  client: DtfClient,
  params: DtfParams & {
    readonly dtf?: IndexDtf;
    readonly governance?: Address;
    readonly weightControl?: boolean;
  },
): Promise<IndexDtf | undefined> {
  if (params.dtf || (params.governance && params.weightControl !== undefined)) {
    return params.dtf;
  }

  return getDtf(client, params);
}

function getStartRebalanceArgs(context: BuiltIndexDtfBasketProposalContext) {
  const startRebalanceArgs = context.startRebalanceArgs as StartRebalanceArgsV5;

  return [
    startRebalanceArgs.tokens.map((token) => ({
      ...token,
      token: getAddress(token.token as Address),
    })),
    startRebalanceArgs.limits,
    context.auctionLauncherWindow,
    context.ttl,
  ] as const;
}

function getProposalAuthority(
  params: { readonly governance?: Address },
  dtf: IndexDtf | undefined,
): { governance: Address } {
  const authority = dtf?.governance.rebalance.primary;
  const resolvedGovernance = params.governance ?? (authority?.type === "governance" ? authority.address : undefined);

  if (!resolvedGovernance) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "governance is required to build an Index DTF basket proposal",
      meta: { governance: resolvedGovernance },
    });
  }

  return { governance: resolvedGovernance };
}

function validateBasketTokenAddresses(params: BuildIndexDtfBasketProposalParams) {
  const dtfAddress = getAddress(params.address);

  for (const token of params.basket.tokens) {
    const address = getAddress(token.address);

    if (address.toLowerCase() === zeroAddress) {
      throw new SdkError({
        code: "INVALID_INPUT",
        message: "Basket token address cannot be the zero address",
        meta: { address },
      });
    }
    if (address.toLowerCase() === dtfAddress.toLowerCase()) {
      throw new SdkError({
        code: "INVALID_INPUT",
        message: "Basket token cannot be the DTF address",
        meta: { address, dtfAddress },
      });
    }
  }
}

function getRebalanceWindows(params: {
  readonly auctionLauncherWindow?: number | bigint;
  readonly permissionlessWindow?: number | bigint;
  readonly ttl?: number | bigint;
}): { auctionLauncherWindow: bigint; ttl: bigint } {
  const auctionLauncherWindow = toSeconds(
    params.auctionLauncherWindow ?? DEFAULT_AUCTION_LAUNCHER_WINDOW,
    "auctionLauncherWindow",
  );
  const ttl =
    params.ttl === undefined
      ? auctionLauncherWindow + toSeconds(params.permissionlessWindow ?? 0, "permissionlessWindow")
      : toSeconds(params.ttl, "ttl", { allowZero: false });

  if (ttl === 0n) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "ttl must be a positive number of seconds",
      meta: { ttl },
    });
  }
  if (ttl < auctionLauncherWindow) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "ttl must be greater than or equal to auctionLauncherWindow",
      meta: { ttl, auctionLauncherWindow },
    });
  }
  if (ttl > MAX_REBALANCE_TTL) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "ttl must be less than or equal to 4 weeks",
      meta: { ttl, maxTtl: MAX_REBALANCE_TTL },
    });
  }

  return { auctionLauncherWindow, ttl };
}

function toSeconds(value: number | bigint, field: string, options: { readonly allowZero?: boolean } = {}): bigint {
  const allowZero = options.allowZero ?? true;
  if (typeof value === "bigint") {
    if (value < 0n || (!allowZero && value === 0n)) {
      throw new SdkError({
        code: "INVALID_INPUT",
        message: `${field} must be a ${allowZero ? "non-negative" : "positive"} number of seconds`,
        meta: { [field]: value },
      });
    }

    return value;
  }
  if (!Number.isFinite(value) || !Number.isInteger(value) || value < 0 || (!allowZero && value === 0)) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: `${field} must be a ${allowZero ? "non-negative" : "positive"} number of seconds`,
      meta: { [field]: value },
    });
  }

  return BigInt(value);
}
