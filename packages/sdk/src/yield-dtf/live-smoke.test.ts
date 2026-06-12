import { describe, expect, it } from "vitest";

import { createDtfSdk } from "@/create-dtf-sdk";

const runLiveSmoke =
  (globalThis as unknown as { process?: { env?: Record<string, string | undefined> } }).process?.env
    ?.RUN_YIELD_DTF_SMOKE === "1";
const smokeDescribe = runLiveSmoke ? describe : describe.skip;

// eUSD on mainnet — the longest-lived Yield DTF.
const EUSD = "0xA0d69E286B938e21CBf7E51D71F6A4c8918f482F";
const SMOKE_ACCOUNT = "0x000000000000000000000000000000000000dEaD";
const MAINNET = 1;

smokeDescribe("Yield DTF live smoke (mainnet eUSD)", () => {
  const sdk = createDtfSdk();

  it("reads the full yield DTF, state, price, and basket", async () => {
    const [dtf, state, price, basket, contracts] = await Promise.all([
      sdk.yield.get({ address: EUSD, chainId: MAINNET }),
      sdk.yield.getState({ address: EUSD, chainId: MAINNET }),
      sdk.yield.getPrice({ address: EUSD, chainId: MAINNET }),
      sdk.yield.getBasket({ address: EUSD, chainId: MAINNET }),
      sdk.yield.getContracts({ address: EUSD, chainId: MAINNET }),
    ]);

    expect(dtf.token.symbol).toBe("eUSD");
    expect(dtf.collaterals.length).toBeGreaterThan(0);
    expect(dtf.stToken.address).toMatch(/^0x/);
    expect(dtf.revenueSplit.holders + dtf.revenueSplit.stakers).toBeGreaterThan(0);

    expect(state.totalSupply.raw).toBeGreaterThan(0n);
    expect(state.exchangeRate.raw).toBeGreaterThanOrEqual(10n ** 18n);

    // eUSD is a USD stable; sanity-band the on-chain price.
    expect(price.price).toBeGreaterThan(0.9);
    expect(price.price).toBeLessThan(1.1);

    expect(basket.collaterals.length).toBeGreaterThan(0);
    expect(basket.backing).toBeGreaterThan(0);

    expect(contracts.main).toBe(dtf.main);
    expect(contracts.version).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it("quotes issuance and redemption", async () => {
    const amount = 10n ** 18n;
    const [issuance, redemption, maxIssuable] = await Promise.all([
      sdk.yield.getIssuanceQuote({ address: EUSD, chainId: MAINNET, amount }),
      sdk.yield.getRedemptionQuote({ address: EUSD, chainId: MAINNET, amount }),
      sdk.yield.getMaxIssuable({ address: EUSD, chainId: MAINNET, account: SMOKE_ACCOUNT }),
    ]);

    expect(issuance.deposits.length).toBeGreaterThan(0);
    expect(issuance.deposits.every((deposit) => deposit.amount.raw > 0n)).toBe(true);
    expect(redemption.withdrawals.length).toBeGreaterThan(0);
    expect(maxIssuable).toBeGreaterThanOrEqual(0n);
  });

  it("reads staking state and history", async () => {
    const dtf = await sdk.yield.get({ address: EUSD, chainId: MAINNET });
    const staking = await sdk.yield.getStakingState({
      address: EUSD,
      chainId: MAINNET,
      stToken: dtf.stToken.address,
      account: SMOKE_ACCOUNT,
    });

    expect(staking.exchangeRate.raw).toBeGreaterThanOrEqual(10n ** 18n);
    expect(staking.unstakingDelay).toBeGreaterThan(0n);

    const history = await sdk.yield.getStakeHistory({
      address: EUSD,
      chainId: MAINNET,
      account: SMOKE_ACCOUNT,
      limit: 5,
    });

    expect(Array.isArray(history)).toBe(true);
  });

  it("lists yield DTFs and reads holders/transactions", async () => {
    const [list, holders, transactions] = await Promise.all([
      sdk.yield.list({ chainId: MAINNET, limit: 5 }),
      sdk.yield.getHolders({ address: EUSD, chainId: MAINNET, limit: 5 }),
      sdk.yield.getTransactions({ address: EUSD, chainId: MAINNET, limit: 5 }),
    ]);

    expect(list.length).toBeGreaterThan(0);
    expect(list.some((dtf) => dtf.status === "active")).toBe(true);
    expect(holders.length).toBeGreaterThan(0);
    expect(transactions.length).toBeGreaterThan(0);
    // Entry amounts are raw bigints mapped to Amounts; eUSD is ~1 USD, so the
    // formatted amount and the USD value must be the same order of magnitude.
    const withUsd = transactions.find((tx) => tx.amountUsd > 1);
    if (withUsd) {
      const ratio = Number(withUsd.amount.formatted) / withUsd.amountUsd;
      expect(ratio).toBeGreaterThan(0.1);
      expect(ratio).toBeLessThan(10);
    }
  });
});
