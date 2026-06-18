/**
 * End-to-end Yield DTF validation against live chains.
 *
 *   pnpm --filter @reserve-protocol/sdk validate:yield
 *
 * Exercises the full sdk.yield surface for eUSD + ETH+ (mainnet) and
 * bsdETH (base), asserting shapes and sanity bands on real data.
 */
import { parseEther, parseUnits, zeroAddress } from "viem";

import type { YieldDtfChainId } from "../src/yield-dtf/config";

import { createDtfSdk } from "../src/create-dtf-sdk";

const CASES = [
  { label: "eUSD", address: "0xA0d69E286B938e21CBf7E51D71F6A4c8918f482F", chainId: 1, priceBand: [0.9, 1.1] },
  { label: "ETH+", address: "0xE72B141DF173b999AE7c1aDcbF60Cc9833Ce56a8", chainId: 1, priceBand: [500, 100_000] },
  { label: "bsdETH", address: "0xCb327b99fF831bF8223cCEd12B1338FF3aA322Ff", chainId: 8453, priceBand: [500, 100_000] },
] as const;

const sdk = createDtfSdk();
let failures = 0;

function check(label: string, condition: boolean, detail?: unknown) {
  if (condition) {
    console.log(`  ok  ${label}`);
  } else {
    failures += 1;
    console.error(`  FAIL ${label}`, detail ?? "");
  }
}

async function validate(
  label: string,
  address: `0x${string}`,
  chainId: YieldDtfChainId,
  priceBand: readonly [number, number],
) {
  console.log(`\n=== ${label} (chain ${chainId}) ===`);
  const started = Date.now();

  // Core reads in parallel — also proves the multicall paths are healthy.
  const [dtf, state, price, basket, contracts] = await Promise.all([
    sdk.yield.get({ address, chainId }),
    sdk.yield.getState({ address, chainId }),
    sdk.yield.getPrice({ address, chainId }),
    sdk.yield.getBasket({ address, chainId }),
    sdk.yield.getContracts({ address, chainId }),
  ]);
  console.log(`  core reads in ${Date.now() - started}ms`);

  check("identity", dtf.token.symbol === label && dtf.collaterals.length > 0, dtf.token.symbol);
  check("stToken", dtf.stToken.address !== zeroAddress);
  check("revenue split sums <= 100", dtf.revenueSplit.holders + dtf.revenueSplit.stakers <= 100.0001, dtf.revenueSplit);
  check("supply > 0", state.totalSupply.raw > 0n);
  check("exchange rate >= 1", Number(state.exchangeRate.formatted) >= 1);
  check(
    `price in [${priceBand[0]}, ${priceBand[1]}]`,
    price.price > priceBand[0] && price.price < priceBand[1],
    price.price,
  );
  check("price low <= high", price.low.raw <= price.high.raw);
  const shareSum = basket.collaterals.reduce((sum, c) => sum + c.share, 0);
  check("basket shares ~100", shareSum > 95 && shareSum < 105, shareSum);
  check("backing 0-100", basket.backing > 0 && basket.backing <= 100, basket.backing);
  check("contracts resolved", contracts.basketHandler !== zeroAddress && contracts.stRsr === dtf.stToken.address);
  check("version semver", /^\d+\.\d+\.\d+$/.test(contracts.version), contracts.version);

  // Issuance + redemption quotes (1 whole token).
  const amount = parseEther("1");
  const [issuance, redemption, maxIssuable] = await Promise.all([
    sdk.yield.getIssuanceQuote({ address, chainId, amount }),
    sdk.yield.getRedemptionQuote({ address, chainId, amount }),
    sdk.yield.getMaxIssuable({ address, chainId, account: "0x000000000000000000000000000000000000dEaD" }),
  ]);
  check(
    "issuance quote has deposits",
    issuance.deposits.length > 0 && issuance.deposits.every((d) => d.amount.raw > 0n),
  );
  check("redemption quote has withdrawals", redemption.withdrawals.length > 0);
  check("maxIssuable >= 0", maxIssuable >= 0n);

  // The issuance deposits should be worth roughly one token's price.
  // (Quick magnitude sanity: every deposit formatted < 10x the DTF price.)
  check(
    "deposit magnitudes sane",
    issuance.deposits.every((d) => Number(d.amount.formatted) < price.price * 10 + 10),
    issuance.deposits.map((d) => d.amount.formatted),
  );

  // Staking.
  const staking = await sdk.yield.getStakingState({
    address,
    chainId,
    stToken: dtf.stToken.address,
    account: "0x000000000000000000000000000000000000dEaD",
  });
  check("unstaking delay > 0", staking.unstakingDelay > 0);
  check("staking exchange rate >= 1", Number(staking.exchangeRate.formatted) >= 1);

  // Governance.
  const governance = await sdk.yield.getGovernance({ address, chainId });
  check("governor resolved", governance.governor !== zeroAddress, governance.name);
  check("quorum > 0", governance.quorum.raw > 0n, governance.quorum.formatted);
  check("threshold > 0 (votes)", governance.proposalThreshold.raw > 0n, governance.proposalThreshold.formatted);

  const proposals = await sdk.yield.getProposals({ address, chainId, limit: 3 });
  check("proposals read", Array.isArray(proposals));
  if (proposals[0]) {
    const detail = await sdk.yield.getProposal({ chainId, proposalId: proposals[0].id });
    check("proposal detail calldatas match targets", detail.targets.length === detail.calldatas.length);
    check("proposal state resolved", detail.state.length > 0, detail.state);
    const votePower = await sdk.yield.getProposalVotePower({
      chainId,
      governor: detail.governor,
      account: "0x000000000000000000000000000000000000dEaD",
      voteStart: detail.voteStart,
      isTimepointBased: governance.isTimepointBased,
    });
    check("vote power read", votePower >= 0n);
  } else {
    console.log("  skip proposal detail: no proposals indexed");
  }

  const voter = await sdk.yield.getVoterState({
    chainId,
    stToken: dtf.stToken.address,
    account: "0x000000000000000000000000000000000000dEaD",
  });
  check("voter state read", voter.delegate.length === 42);

  // Auctions / revenue.
  const [revenue, trades] = await Promise.all([
    sdk.yield.getRevenue({ address, chainId }),
    sdk.yield.getTrades({ address, chainId, limit: 3 }),
  ]);
  check("revenue traders resolved", revenue.rsrTrader.trader === contracts.rsrTrader);
  check(
    "no tokenToBuy rows in auctions",
    revenue.rsrTrader.auctions.every((a) => a.erc20 !== zeroAddress) &&
      !revenue.rTokenTrader.auctions.some((a) => a.erc20 === address),
  );
  check(
    "surplus magnitudes sane",
    [...revenue.rsrTrader.auctions, ...revenue.rTokenTrader.auctions].every((a) => Number(a.surplus.formatted) < 1e12),
  );
  if (trades[0]) {
    check("trades history", trades[0].startedAt > 1600000000);
  } else {
    console.log("  skip trades history: no trades indexed");
  }

  // APY (DefiLlama + on-chain assembly).
  const apy = await sdk.yield.getApy({ address, chainId });
  check("apy sane", apy.basket >= 0 && apy.basket < 50, apy);
  check("staker apy >= holder share implies leverage", apy.stakers >= 0, apy.stakers);

  const apyHistory = await sdk.yield.getStakingApyHistory({ address, chainId, days: 30 });
  check("apy history points", apyHistory.length > 0);
  check(
    "apy history sane",
    apyHistory.every((p) => p.apy > -1 && p.apy < 1000 && p.exchangeRate >= 1),
    apyHistory.slice(-2),
  );

  // Builders: encode without throwing, against real addresses.
  const issuePlan = sdk.yield.ref({ address, chainId }).prepareIssuePlan({
    amount,
    deposits: issuance.deposits.map((d) => ({ token: d.token, amount: d.amount.raw })),
  });
  check("issue plan approvals", issuePlan.type === "approval-required");
  const stakePlan = sdk.yield.prepareStakePlan({
    chainId,
    stToken: dtf.stToken.address,
    amount: parseUnits("100", 18),
  });
  check("stake plan encodes", stakePlan.type === "approval-required" && stakePlan.call.data.startsWith("0xa694fc3a"));
  const claim = sdk.yield.prepareClaimRewards({ address, chainId });
  check("claim rewards encodes", claim.data.startsWith("0xef5cfb8c"));
  if (proposals[0]) {
    const vote = sdk.yield.prepareVote({
      chainId,
      governor: proposals[0].governor,
      proposalId: proposals[0].id,
      support: 1,
    });
    check("vote encodes", vote.data.startsWith("0x56781388"));
  }

  console.log(`  done in ${Date.now() - started}ms`);
}

for (const dtfCase of CASES) {
  try {
    await validate(dtfCase.label, dtfCase.address, dtfCase.chainId, dtfCase.priceBand);
  } catch (error) {
    failures++;
    console.error(`\n${dtfCase.label} validation crashed (${dtfCase.address} on chain ${dtfCase.chainId})`);
    console.error(error);
  }
}

if (failures > 0) {
  console.error(`\n${failures} check(s) FAILED`);
  process.exit(1);
}

console.log("\nAll validations passed.");
