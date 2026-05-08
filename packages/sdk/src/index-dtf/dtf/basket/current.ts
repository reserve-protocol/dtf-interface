import { getAddress, type Address } from "viem";
import type { DtfClient } from "../../../client.js";
import type { IndexDtf, IndexDtfTotalAssets } from "../../../types/index-dtf.js";
import type {
  BuildIndexDtfStartRebalanceParams,
  IndexDtfBasketCurrentBalancesInput,
  IndexDtfBasketTokenInput,
} from "./types.js";
import { getDtf, getTotalAssets } from "../index.js";

export async function getCurrentBalances(
  client: DtfClient,
  params: BuildIndexDtfStartRebalanceParams,
): Promise<Record<string, bigint>> {
  const totalAssets = params.currentBalances ?? await getTotalAssets(client, params);

  return normalizeCurrentBalances(totalAssets);
}

export async function getDtfForWeightControl(
  client: DtfClient,
  params: BuildIndexDtfStartRebalanceParams,
): Promise<IndexDtf | undefined> {
  if (params.weightControl !== undefined) {
    return params.dtf;
  }

  return params.dtf ?? getDtf(client, params);
}

export function getBasketTokenOrder(
  currentBalances: Readonly<Record<string, bigint>>,
  inputTokens: readonly IndexDtfBasketTokenInput[],
): Address[] {
  const addresses: Address[] = [];
  const seen = new Set<string>();
  const add = (token: Address) => {
    const address = getAddress(token);
    const key = address.toLowerCase();

    if (!seen.has(key)) {
      seen.add(key);
      addresses.push(address);
    }
  };

  for (const token of Object.keys(currentBalances)) {
    add(token as Address);
  }
  for (const token of inputTokens) {
    add(token.address);
  }

  return addresses;
}

function normalizeCurrentBalances(
  input: IndexDtfBasketCurrentBalancesInput,
): Record<string, bigint> {
  if (Array.isArray(input)) {
    const result: Record<string, bigint> = {};

    for (const item of input) {
      result[getAddress(item.address).toLowerCase()] = item.balance;
    }

    return result;
  }

  if (isTotalAssetsInput(input)) {
    const result: Record<string, bigint> = {};

    for (let i = 0; i < input.tokens.length; i++) {
      result[getAddress(input.tokens[i]!).toLowerCase()] = input.balances[i] ?? 0n;
    }

    return result;
  }

  const result: Record<string, bigint> = {};

  for (const [token, balance] of Object.entries(input)) {
    result[getAddress(token as Address).toLowerCase()] = balance;
  }

  return result;
}

function isTotalAssetsInput(
  input: IndexDtfBasketCurrentBalancesInput,
): input is IndexDtfTotalAssets {
  if (Array.isArray(input)) {
    return false;
  }

  const value = input as Partial<IndexDtfTotalAssets>;

  return Array.isArray(value.tokens) && Array.isArray(value.balances);
}
