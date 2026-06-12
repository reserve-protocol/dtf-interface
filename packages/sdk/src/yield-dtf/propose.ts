import { getAddress, stringToHex, type Address, type Hex } from "viem";

import type { ContractCall } from "@/lib/contract-call";
import type { YieldDtfChainId } from "@/yield-dtf/config";

import { prepareContractCall } from "@/lib/contract-call";
import { backingManagerAbi } from "@/yield-dtf/abis/backing-manager";
import { basketHandlerAbi } from "@/yield-dtf/abis/basket-handler";
import { brokerAbi } from "@/yield-dtf/abis/broker";
import { distributorAbi } from "@/yield-dtf/abis/distributor";
import { furnaceAbi } from "@/yield-dtf/abis/furnace";
import { rTokenMainAbi } from "@/yield-dtf/abis/main";
import { rTokenAbi } from "@/yield-dtf/abis/r-token";
import { stRsrAbi } from "@/yield-dtf/abis/st-rsr";

// Main role ids are plain left-aligned strings (bytes32(bytes("OWNER"))),
// NOT keccak hashes — see protocol IMain.sol.
export const YIELD_DTF_ROLES = {
  owner: "0x4f574e4552000000000000000000000000000000000000000000000000000000",
  pauser: "0x5041555345520000000000000000000000000000000000000000000000000000",
  shortFreezer: "0x53484f52545f465245455a455200000000000000000000000000000000000000",
  longFreezer: "0x4c4f4e475f465245455a45520000000000000000000000000000000000000000",
} as const satisfies Record<string, Hex>;

export type YieldDtfRole = keyof typeof YIELD_DTF_ROLES;

// Guardians live on the timelock as OZ's CANCELLER_ROLE (this one IS a keccak hash).
export const YIELD_DTF_GUARDIAN_ROLE: Hex = "0xfd643c72710c63c0180259aba6b2d05451e3591a24e58b62239378085726f783";

type Target = { readonly chainId: YieldDtfChainId; readonly address: Address };

// Every builder targets one component address (resolve them with getContracts)
// and returns a ContractCall whose calldata goes into a governance proposal.

export function prepareYieldDtfSetTradingDelay(params: Target & { readonly seconds: number }): ContractCall {
  return prepareContractCall({
    chainId: params.chainId,
    address: getAddress(params.address),
    abi: backingManagerAbi,
    functionName: "setTradingDelay",
    args: [params.seconds],
  });
}

export function prepareYieldDtfSetBackingBuffer(params: Target & { readonly value: bigint }): ContractCall {
  return prepareContractCall({
    chainId: params.chainId,
    address: getAddress(params.address),
    abi: backingManagerAbi,
    functionName: "setBackingBuffer",
    args: [params.value],
  });
}

/** Applies to BackingManager and both revenue traders — one call per target. */
export function prepareYieldDtfSetMaxTradeSlippage(params: Target & { readonly value: bigint }): ContractCall {
  return prepareContractCall({
    chainId: params.chainId,
    address: getAddress(params.address),
    abi: backingManagerAbi,
    functionName: "setMaxTradeSlippage",
    args: [params.value],
  });
}

/** Applies to BackingManager and both revenue traders — one call per target. */
export function prepareYieldDtfSetMinTradeVolume(params: Target & { readonly value: bigint }): ContractCall {
  return prepareContractCall({
    chainId: params.chainId,
    address: getAddress(params.address),
    abi: backingManagerAbi,
    functionName: "setMinTradeVolume",
    args: [params.value],
  });
}

/** Register-parity "reward ratio" proposals set BOTH Furnace.setRatio and StRSR.setRewardRatio. */
export function prepareYieldDtfSetFurnaceRatio(params: Target & { readonly ratio: bigint }): ContractCall {
  return prepareContractCall({
    chainId: params.chainId,
    address: getAddress(params.address),
    abi: furnaceAbi,
    functionName: "setRatio",
    args: [params.ratio],
  });
}

export function prepareYieldDtfSetRewardRatio(params: Target & { readonly ratio: bigint }): ContractCall {
  return prepareContractCall({
    chainId: params.chainId,
    address: getAddress(params.address),
    abi: stRsrAbi,
    functionName: "setRewardRatio",
    args: [params.ratio],
  });
}

export function prepareYieldDtfSetUnstakingDelay(params: Target & { readonly seconds: number }): ContractCall {
  return prepareContractCall({
    chainId: params.chainId,
    address: getAddress(params.address),
    abi: stRsrAbi,
    functionName: "setUnstakingDelay",
    args: [params.seconds],
  });
}

export function prepareYieldDtfSetWithdrawalLeak(params: Target & { readonly value: bigint }): ContractCall {
  return prepareContractCall({
    chainId: params.chainId,
    address: getAddress(params.address),
    abi: stRsrAbi,
    functionName: "setWithdrawalLeak",
    args: [params.value],
  });
}

export function prepareYieldDtfSetWarmupPeriod(params: Target & { readonly seconds: number }): ContractCall {
  return prepareContractCall({
    chainId: params.chainId,
    address: getAddress(params.address),
    abi: basketHandlerAbi,
    functionName: "setWarmupPeriod",
    args: [params.seconds],
  });
}

export function prepareYieldDtfSetIssuancePremiumEnabled(params: Target & { readonly enabled: boolean }): ContractCall {
  return prepareContractCall({
    chainId: params.chainId,
    address: getAddress(params.address),
    abi: basketHandlerAbi,
    functionName: "setIssuancePremiumEnabled",
    args: [params.enabled],
  });
}

export function prepareYieldDtfSetBatchAuctionLength(params: Target & { readonly seconds: number }): ContractCall {
  return prepareContractCall({
    chainId: params.chainId,
    address: getAddress(params.address),
    abi: brokerAbi,
    functionName: "setBatchAuctionLength",
    args: [params.seconds],
  });
}

export function prepareYieldDtfSetDutchAuctionLength(params: Target & { readonly seconds: number }): ContractCall {
  return prepareContractCall({
    chainId: params.chainId,
    address: getAddress(params.address),
    abi: brokerAbi,
    functionName: "setDutchAuctionLength",
    args: [params.seconds],
  });
}

export type YieldDtfThrottleParams = Target & {
  readonly amountRate: bigint;
  readonly percentRate: bigint;
};

export function prepareYieldDtfSetIssuanceThrottle(params: YieldDtfThrottleParams): ContractCall {
  return prepareContractCall({
    chainId: params.chainId,
    address: getAddress(params.address),
    abi: rTokenAbi,
    functionName: "setIssuanceThrottleParams",
    args: [{ amtRate: params.amountRate, pctRate: params.percentRate }],
  });
}

export function prepareYieldDtfSetRedemptionThrottle(params: YieldDtfThrottleParams): ContractCall {
  return prepareContractCall({
    chainId: params.chainId,
    address: getAddress(params.address),
    abi: rTokenAbi,
    functionName: "setRedemptionThrottleParams",
    args: [{ amtRate: params.amountRate, pctRate: params.percentRate }],
  });
}

export function prepareYieldDtfSetShortFreeze(params: Target & { readonly seconds: number }): ContractCall {
  return prepareContractCall({
    chainId: params.chainId,
    address: getAddress(params.address),
    abi: rTokenMainAbi,
    functionName: "setShortFreeze",
    args: [params.seconds],
  });
}

export function prepareYieldDtfSetLongFreeze(params: Target & { readonly seconds: number }): ContractCall {
  return prepareContractCall({
    chainId: params.chainId,
    address: getAddress(params.address),
    abi: rTokenMainAbi,
    functionName: "setLongFreeze",
    args: [params.seconds],
  });
}

export type YieldDtfRoleChangeParams = Target & {
  readonly role: YieldDtfRole;
  readonly account: Address;
};

export function prepareYieldDtfGrantRole(params: YieldDtfRoleChangeParams): ContractCall {
  return prepareContractCall({
    chainId: params.chainId,
    address: getAddress(params.address),
    abi: rTokenMainAbi,
    functionName: "grantRole",
    args: [YIELD_DTF_ROLES[params.role], getAddress(params.account)],
  });
}

export function prepareYieldDtfRevokeRole(params: YieldDtfRoleChangeParams): ContractCall {
  return prepareContractCall({
    chainId: params.chainId,
    address: getAddress(params.address),
    abi: rTokenMainAbi,
    functionName: "revokeRole",
    args: [YIELD_DTF_ROLES[params.role], getAddress(params.account)],
  });
}

export type YieldDtfGuardianChangeParams = Target & {
  readonly account: Address;
};

/** Grants the guardian (CANCELLER_ROLE) on the governance timelock. */
export function prepareYieldDtfGrantGuardian(params: YieldDtfGuardianChangeParams): ContractCall {
  return prepareContractCall({
    chainId: params.chainId,
    address: getAddress(params.address),
    abi: rTokenMainAbi,
    functionName: "grantRole",
    args: [YIELD_DTF_GUARDIAN_ROLE, getAddress(params.account)],
  });
}

export function prepareYieldDtfRevokeGuardian(params: YieldDtfGuardianChangeParams): ContractCall {
  return prepareContractCall({
    chainId: params.chainId,
    address: getAddress(params.address),
    abi: rTokenMainAbi,
    functionName: "revokeRole",
    args: [YIELD_DTF_GUARDIAN_ROLE, getAddress(params.account)],
  });
}

export type YieldDtfSetPrimeBasketParams = Target & {
  readonly erc20s: readonly Address[];
  readonly targetAmounts: readonly bigint[];
};

/** Pair with prepareYieldDtfRefreshBasket after; reweightable RTokens also need a refresh BEFORE this call. */
export function prepareYieldDtfSetPrimeBasket(params: YieldDtfSetPrimeBasketParams): ContractCall {
  return prepareContractCall({
    chainId: params.chainId,
    address: getAddress(params.address),
    abi: basketHandlerAbi,
    functionName: "setPrimeBasket",
    args: [params.erc20s.map((erc20) => getAddress(erc20)), [...params.targetAmounts]],
  });
}

export function prepareYieldDtfRefreshBasket(params: Target): ContractCall {
  return prepareContractCall({
    chainId: params.chainId,
    address: getAddress(params.address),
    abi: basketHandlerAbi,
    functionName: "refreshBasket",
    args: [],
  });
}

export type YieldDtfSetBackupConfigParams = Target & {
  /** Target unit name, e.g. "USD". */
  readonly targetName: string;
  readonly max: bigint;
  readonly erc20s: readonly Address[];
};

export function prepareYieldDtfSetBackupConfig(params: YieldDtfSetBackupConfigParams): ContractCall {
  return prepareContractCall({
    chainId: params.chainId,
    address: getAddress(params.address),
    abi: basketHandlerAbi,
    functionName: "setBackupConfig",
    args: [stringToHex(params.targetName, { size: 32 }), params.max, params.erc20s.map((erc20) => getAddress(erc20))],
  });
}

export type YieldDtfSetDistributionParams = Target & {
  readonly destination: Address;
  /** Basis points of 10000. */
  readonly rTokenDist: number;
  readonly rsrDist: number;
};

export function prepareYieldDtfSetDistribution(params: YieldDtfSetDistributionParams): ContractCall {
  return prepareContractCall({
    chainId: params.chainId,
    address: getAddress(params.address),
    abi: distributorAbi,
    functionName: "setDistribution",
    args: [getAddress(params.destination), { rTokenDist: params.rTokenDist, rsrDist: params.rsrDist }],
  });
}

export { hashProposalDescription } from "@/lib/governor-calls";

export type YieldDtfProposalCall = Pick<ContractCall, "to" | "data">;

/** Collects builder outputs into propose() inputs. */
export function toYieldDtfProposalPayload(
  governor: Address,
  description: string,
  calls: readonly YieldDtfProposalCall[],
): {
  readonly governor: Address;
  readonly targets: readonly Address[];
  readonly calldatas: readonly Hex[];
  readonly description: string;
} {
  return {
    governor: getAddress(governor),
    targets: calls.map((call) => call.to),
    calldatas: calls.map((call) => call.data),
    description,
  };
}
