import { getAddress, type Address, type Hex } from "viem";

import type { DtfClient } from "@/client";
import type { SupportedChainId } from "@/config";

import { selectorRegistryAbi } from "@/index-dtf/abis/selector-registry";
import { prepareContractCall } from "@/lib/contract-call";
import { SdkError } from "@/lib/errors";

export type IndexDtfSelectorData = {
  readonly target: Address;
  readonly selectors: readonly Hex[];
};

export type IndexDtfOptimisticSelector = {
  readonly target: Address;
  readonly selector: Hex;
};

export type GetSelectorRegistryParams = {
  readonly chainId: SupportedChainId;
  readonly registry: Address;
};

export type GetSelectorRegistryTargetParams = GetSelectorRegistryParams & {
  readonly target: Address;
};

export type GetSelectorRegistryIsAllowedParams = GetSelectorRegistryTargetParams & {
  readonly selector: Hex;
};

export type PrepareSelectorRegistrySelectorsParams = GetSelectorRegistryParams & {
  readonly selectorData: readonly IndexDtfSelectorData[];
};

export async function getSelectorRegistryTargets(
  client: DtfClient,
  params: GetSelectorRegistryParams,
): Promise<readonly Address[]> {
  const targets = await client.viem.readContract({
    chainId: params.chainId,
    address: getAddress(params.registry),
    abi: selectorRegistryAbi,
    functionName: "targets",
  });

  return targets;
}

export async function getSelectorRegistryAllowedSelectors(
  client: DtfClient,
  params: GetSelectorRegistryTargetParams,
): Promise<readonly Hex[]> {
  return client.viem.readContract({
    chainId: params.chainId,
    address: getAddress(params.registry),
    abi: selectorRegistryAbi,
    functionName: "selectorsAllowed",
    args: [getAddress(params.target)],
  });
}

export async function getSelectorRegistryIsAllowed(
  client: DtfClient,
  params: GetSelectorRegistryIsAllowedParams,
): Promise<boolean> {
  return client.viem.readContract({
    chainId: params.chainId,
    address: getAddress(params.registry),
    abi: selectorRegistryAbi,
    functionName: "isAllowed",
    args: [getAddress(params.target), normalizeSelector(params.selector)],
  });
}

export async function getOptimisticSelectors(
  client: DtfClient,
  params: GetSelectorRegistryParams,
): Promise<readonly IndexDtfOptimisticSelector[]> {
  const targets = await getSelectorRegistryTargets(client, params);
  const optimisticSelectors: IndexDtfOptimisticSelector[] = [];

  for (const target of targets) {
    const normalizedTarget = getAddress(target);
    const selectors = await getSelectorRegistryAllowedSelectors(client, {
      ...params,
      target: normalizedTarget,
    });

    for (const selector of selectors) {
      optimisticSelectors.push({
        target: normalizedTarget,
        selector: normalizeSelector(selector),
      });
    }
  }

  return optimisticSelectors;
}

export function prepareSelectorRegistryRegisterSelectors(params: PrepareSelectorRegistrySelectorsParams) {
  return prepareContractCall({
    chainId: params.chainId,
    address: params.registry,
    abi: selectorRegistryAbi,
    functionName: "registerSelectors",
    args: [normalizeSelectorData(params.selectorData)] as const,
  });
}

export function prepareSelectorRegistryUnregisterSelectors(params: PrepareSelectorRegistrySelectorsParams) {
  return prepareContractCall({
    chainId: params.chainId,
    address: params.registry,
    abi: selectorRegistryAbi,
    functionName: "unregisterSelectors",
    args: [normalizeSelectorData(params.selectorData)] as const,
  });
}

function normalizeSelectorData(
  selectorData: readonly IndexDtfSelectorData[],
): readonly { readonly target: Address; readonly selectors: readonly Hex[] }[] {
  return selectorData.map((data) => ({
    target: data.target,
    selectors: data.selectors.map(normalizeSelector),
  }));
}

function normalizeSelector(selector: Hex): Hex {
  if (!/^0x[0-9a-fA-F]{8}$/.test(selector)) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "selector must be a bytes4 hex value",
      meta: { selector },
    });
  }

  return selector;
}
