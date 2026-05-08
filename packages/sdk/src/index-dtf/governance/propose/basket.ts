import { encodeFunctionData, getAddress, type Address, type Hex } from "viem";
import type { DtfClient } from "../../../client.js";
import { SdkError } from "../../../errors.js";
import type { DtfParams } from "../../../types/common.js";
import type { IndexDtfCall } from "../../../types/governance.js";
import type { IndexDtf } from "../../../types/index-dtf.js";
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
} from "../../dtf/basket-utils.js";
import { dtfIndexAbi } from "../../abis/dtf-index-abi.js";
import { getDtf } from "../../dtf/index.js";

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

export type BuildIndexDtfBasketProposalParams =
  BuildIndexDtfStartRebalanceParams & {
    readonly description?: string;
    readonly governance?: Address;
    readonly auctionLauncherWindow?: number | bigint;
    readonly permissionlessWindow?: number | bigint;
    readonly ttl?: number | bigint;
  };

export type BuiltIndexDtfBasketProposalContext = BuiltIndexDtfStartRebalance & {
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
  const dtf = await getDtfForProposal(client, params);
  const rebalance = await buildIndexDtfStartRebalance(client, {
    ...params,
    ...(dtf ? { dtf } : {}),
  });
  const auctionLauncherWindow = toSeconds(
    params.auctionLauncherWindow ?? DEFAULT_AUCTION_LAUNCHER_WINDOW,
    "auctionLauncherWindow",
  );
  const ttl =
    params.ttl === undefined
      ? auctionLauncherWindow +
        toSeconds(params.permissionlessWindow ?? 0, "permissionlessWindow")
      : toSeconds(params.ttl, "ttl");
  const context: BuiltIndexDtfBasketProposalContext = {
    ...rebalance,
    auctionLauncherWindow,
    ttl,
  };
  const authority = getProposalAuthority(params, dtf);

  return {
    governance: authority.governance,
    targets: [context.address],
    calldatas: [buildIndexDtfBasketRebalanceCall(context).calldata],
    description: params.description ?? "",
    context,
  };
}

function buildIndexDtfBasketRebalanceCall(
  context: BuiltIndexDtfBasketProposalContext,
): IndexDtfCall {
  return {
    target: context.address,
    calldata: encodeStartRebalanceCalldata(context),
  };
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

function encodeStartRebalanceCalldata(
  context: BuiltIndexDtfBasketProposalContext,
): Hex {
  const args = context.startRebalanceArgs as StartRebalanceArgsV5;

  return encodeFunctionData({
    abi: dtfIndexAbi,
    functionName: "startRebalance",
    args: [
      args.tokens.map((token) => ({
        ...token,
        token: getAddress(token.token as Address),
      })),
      args.limits,
      context.auctionLauncherWindow,
      context.ttl,
    ],
  });
}

function getProposalAuthority(
  params: { readonly governance?: Address },
  dtf: IndexDtf | undefined,
): { governance: Address } {
  const authority = dtf?.governance.rebalance.primary;
  const resolvedGovernance =
    params.governance ??
    (authority?.type === "governance" ? authority.address : undefined);

  if (!resolvedGovernance) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "governance is required to build an Index DTF basket proposal",
      meta: { governance: resolvedGovernance },
    });
  }

  return { governance: resolvedGovernance };
}

function toSeconds(value: number | bigint, field: string): bigint {
  if (typeof value === "bigint") {
    if (value < 0n) {
      throw new SdkError({
        code: "INVALID_INPUT",
        message: `${field} must be a positive number of seconds`,
        meta: { [field]: value },
      });
    }

    return value;
  }
  if (!Number.isFinite(value) || !Number.isInteger(value) || value < 0) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: `${field} must be a positive number of seconds`,
      meta: { [field]: value },
    });
  }

  return BigInt(Math.round(value));
}
