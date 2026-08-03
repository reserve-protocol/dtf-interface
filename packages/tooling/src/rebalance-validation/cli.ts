import { createDtfSdk } from "@reserve-protocol/sdk";

import { HUMAN_REVIEW_QUESTIONS } from "@/rebalance-validation/human-review";
import { parseProposalUrl } from "@/rebalance-validation/proposal-url";
import { validateRebalanceProposal } from "@/rebalance-validation/validate";

async function main(): Promise<void> {
  const input = process.argv[2];
  if (!input) {
    console.error("usage: pnpm validate:rebalance <governance proposal url>");
    process.exit(2);
  }

  const url = parseProposalUrl(input);
  console.log(`Validating ${input}`);
  const { report } = await validateRebalanceProposal(createDtfSdk(), url);
  report.print();

  console.log("\nStill needs a human");
  for (const question of HUMAN_REVIEW_QUESTIONS) {
    console.log(`  - ${question}`);
  }

  process.exit(report.failures > 0 ? 1 : 0);
}

await main();
