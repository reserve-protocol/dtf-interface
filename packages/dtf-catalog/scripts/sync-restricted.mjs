// Syncs the restricted index-dtf token lists.
//
// Reads each index-dtf/<chain>.json, keeps only the entries flagged
// "restricted": true, and writes them to index-dtf/restricted/<chain>.json.
//
// Run `node scripts/sync-restricted.mjs` to regenerate the restricted lists.
// Run `node scripts/sync-restricted.mjs --check` to verify they are up to date
// (used in CI). Exits non-zero when a restricted list is missing or stale.

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const chains = ["base", "bnb", "mainnet"];

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const sourceDir = join(packageRoot, "index-dtf");
const restrictedDir = join(sourceDir, "restricted");

function buildRestrictedList(chain) {
  const source = JSON.parse(readFileSync(join(sourceDir, `${chain}.json`), "utf8"));
  const restricted = {};
  for (const [address, token] of Object.entries(source)) {
    if (token.restricted) restricted[address] = token;
  }
  return JSON.stringify(restricted, null, 2) + "\n";
}

const check = process.argv.includes("--check");
const stale = [];

for (const chain of chains) {
  const target = join(restrictedDir, `${chain}.json`);
  const expected = buildRestrictedList(chain);

  if (!check) {
    writeFileSync(target, expected);
    continue;
  }

  let actual;
  try {
    actual = readFileSync(target, "utf8");
  } catch {
    actual = undefined;
  }
  if (actual !== expected) stale.push(chain);
}

if (check && stale.length > 0) {
  console.error(
    `Restricted token lists are out of date for: ${stale.join(", ")}.\n` +
      `Run \`pnpm --filter @reserve-protocol/dtf-catalog sync:restricted\` and commit the result.`,
  );
  process.exit(1);
}

if (check) {
  console.log("Restricted token lists are up to date.");
} else {
  console.log(`Synced restricted token lists for: ${chains.join(", ")}.`);
}
