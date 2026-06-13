import { describe, expect, it } from "vitest";

import {
  prepareYieldDtfGrantGuardian,
  prepareYieldDtfGrantRole,
  prepareYieldDtfRefreshBasket,
  prepareYieldDtfSetDistribution,
  prepareYieldDtfSetIssuanceThrottle,
  prepareYieldDtfSetPrimeBasket,
  toYieldDtfProposalPayload,
  YIELD_DTF_ROLES,
} from "@/yield-dtf/propose";

const MAIN = "0x1111111111111111111111111111111111111111";
const ACCOUNT = "0x2222222222222222222222222222222222222222";
const ERC20 = "0x3333333333333333333333333333333333333333";
const GOVERNOR = "0x4444444444444444444444444444444444444444";

describe("yield DTF proposal builders", () => {
  it("encodes grantRole with the protocol's plain bytes32 role ids (NOT keccak)", () => {
    const call = prepareYieldDtfGrantRole({ chainId: 1, address: MAIN, role: "owner", account: ACCOUNT });

    // grantRole(bytes32,address) + bytes32("OWNER") left-aligned + padded account.
    expect(call.data).toBe(
      "0x2f2ff15d" +
        "4f574e4552000000000000000000000000000000000000000000000000000000" +
        ACCOUNT.replace("0x", "").padStart(64, "0"),
    );
    // Register's ROLES table values, byte for byte.
    expect(YIELD_DTF_ROLES.owner).toBe("0x4f574e4552000000000000000000000000000000000000000000000000000000");
    expect(YIELD_DTF_ROLES.shortFreezer).toBe("0x53484f52545f465245455a455200000000000000000000000000000000000000");
  });

  it("grants guardians via the timelock CANCELLER_ROLE keccak hash", () => {
    const call = prepareYieldDtfGrantGuardian({ chainId: 1, address: MAIN, account: ACCOUNT });

    expect(call.data).toBe(
      "0x2f2ff15d" +
        "fd643c72710c63c0180259aba6b2d05451e3591a24e58b62239378085726f783" +
        ACCOUNT.replace("0x", "").padStart(64, "0"),
    );
  });

  it("encodes setPrimeBasket and pairs with refreshBasket", () => {
    const setBasket = prepareYieldDtfSetPrimeBasket({
      chainId: 1,
      address: MAIN,
      erc20s: [ERC20],
      targetAmounts: [10n ** 18n],
    });
    const refresh = prepareYieldDtfRefreshBasket({ chainId: 1, address: MAIN });

    expect(setBasket.data.startsWith("0xef2b9337")).toBe(true);
    expect(setBasket.contract.args).toEqual([[ERC20], [10n ** 18n]]);
    expect(refresh.contract.functionName).toBe("refreshBasket");
  });

  it("encodes throttle params as the tuple the contract expects", () => {
    const call = prepareYieldDtfSetIssuanceThrottle({
      chainId: 1,
      address: MAIN,
      amountRate: 1_000_000n * 10n ** 18n,
      percentRate: 5n * 10n ** 16n,
    });

    expect(call.contract.args).toEqual([{ amtRate: 1_000_000n * 10n ** 18n, pctRate: 5n * 10n ** 16n }]);
  });

  it("encodes setDistribution shares in basis points", () => {
    const call = prepareYieldDtfSetDistribution({
      chainId: 1,
      address: MAIN,
      destination: ACCOUNT,
      rTokenDist: 6000,
      rsrDist: 0,
    });

    expect(call.data.startsWith("0x88594437")).toBe(true);
    expect(call.contract.args).toEqual([ACCOUNT, { rTokenDist: 6000, rsrDist: 0 }]);
  });

  it("collects builder calls into a propose payload", () => {
    const calls = [
      prepareYieldDtfSetPrimeBasket({ chainId: 1, address: MAIN, erc20s: [ERC20], targetAmounts: [10n ** 18n] }),
      prepareYieldDtfRefreshBasket({ chainId: 1, address: MAIN }),
    ];
    const payload = toYieldDtfProposalPayload(GOVERNOR, "Basket change", calls);

    expect(payload.governor).toBe(GOVERNOR);
    expect(payload.targets).toEqual([MAIN, MAIN]);
    expect(payload.calldatas).toHaveLength(2);
    expect(payload.description).toBe("Basket change");
  });
});
