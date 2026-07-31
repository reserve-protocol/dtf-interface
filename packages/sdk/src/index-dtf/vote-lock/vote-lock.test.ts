import type { PublicClient } from "viem";

import { describe, expect, it, vi } from "vitest";

import { createDtfClient } from "@/client";
import { getVoteLockVaultState, prepareVoteLockRedeem } from "@/index-dtf/vote-lock/index";

const STTOKEN = "0x0000000000000000000000000000000000000001";
const ACCOUNT = "0x0000000000000000000000000000000000000002";
const UNDERLYING = "0x0000000000000000000000000000000000000003";
const DELEGATE = "0x0000000000000000000000000000000000000004";
const MANAGER = "0x0000000000000000000000000000000000000005";

describe("prepareVoteLockRedeem", () => {
  it("builds a shares-denominated redeem call", () => {
    const call = prepareVoteLockRedeem({
      stToken: STTOKEN,
      chainId: 56,
      shares: 123n,
      account: ACCOUNT,
    });

    expect(call.chainId).toBe(56);
    expect(call.contract.address).toBe(STTOKEN);
    expect(call.contract.functionName).toBe("redeem");
    expect(call.contract.args).toEqual([123n, ACCOUNT, ACCOUNT]);
  });
});

describe("getVoteLockVaultState", () => {
  it("maps shareBalance and exchangeRate from the state multicall", async () => {
    const success = <T>(result: T) => ({ status: "success" as const, result });
    const readContract = vi.fn(async () => UNDERLYING);
    const multicall = vi.fn(async ({ contracts }: { contracts: readonly { functionName: string }[] }) => {
      if (contracts[0]?.functionName === "name") {
        return ["Reserve Rights", "RSR", 18];
      }

      if (contracts[0]?.functionName === "optimisticDelegates") {
        return [success(DELEGATE), success(0n)];
      }

      expect(contracts.map((contract) => contract.functionName)).toEqual([
        "balanceOf",
        "allowance",
        "delegates",
        "maxWithdraw",
        "balanceOf",
        "convertToAssets",
        "unstakingDelay",
        "unstakingManager",
      ]);

      return [
        success(1000n * 10n ** 18n), // underlying balanceOf
        success(0n), // allowance
        success(DELEGATE), // delegates
        success(101_875n * 10n ** 16n), // maxWithdraw = 1018.75e18
        success(1000n * 10n ** 18n), // vault balanceOf (shares)
        success(101_875n * 10n ** 13n), // convertToAssets(1e18) = 1.01875e18
        success(1209600n), // unstakingDelay
        success(MANAGER), // unstakingManager
      ];
    });
    const base = createDtfClient({
      chains: {
        56: {
          publicClient: {
            readContract,
            multicall,
          } as unknown as PublicClient,
        },
      },
    });
    const client = {
      ...base,
      api: { ...base.api, getTokenPrices: vi.fn(async () => []) },
    };

    const state = await getVoteLockVaultState(client, {
      chainId: 56,
      stToken: STTOKEN,
      account: ACCOUNT,
    });

    expect(state.shareBalance).toEqual({ raw: 1000n * 10n ** 18n, formatted: "1000" });
    expect(state.exchangeRate.raw).toBe(101_875n * 10n ** 13n);
    expect(state.exchangeRate.formatted).toBe("1.01875");
    expect(state.maxWithdraw.raw).toBe(101_875n * 10n ** 16n);

    const stateCall = multicall.mock.calls.find(([{ contracts }]) =>
      contracts.some((contract) => contract.functionName === "convertToAssets"),
    );
    expect(stateCall).toBeDefined();
    const convertToAssets = stateCall?.[0].contracts.find((contract) => contract.functionName === "convertToAssets") as
      | { args?: readonly bigint[] }
      | undefined;
    expect(convertToAssets?.args).toEqual([10n ** 18n]);
  });
});
