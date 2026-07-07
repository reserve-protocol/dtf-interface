// Fetches index DTF brand logos from the Reserve discover API and writes them
// to index-dtf/logos.json as a `{ "<chainId>:<address>": "<logoURI>" }` map.
//
// The token list generator reads this committed snapshot so list generation
// stays offline and deterministic. Re-run this script when the brand manager
// updates an icon, then re-run sync:tokenlists and commit both.
//
// Run `node scripts/sync-logos.mjs`.

import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const API_URL = "https://api-staging.reserve.org/v1/discover/dtfs?brand=true";

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const target = join(packageRoot, "index-dtf/logos.json");

const response = await fetch(API_URL);
if (!response.ok) {
  console.error(`Failed to fetch ${API_URL}: ${response.status} ${response.statusText}`);
  process.exit(1);
}

const dtfs = await response.json();

const logos = {};
for (const dtf of dtfs) {
  if (dtf.type !== "index") continue;
  const icon = dtf.brand?.icon;
  if (!icon) continue;
  logos[`${dtf.chainId}:${dtf.address.toLowerCase()}`] = icon;
}

const sorted = Object.fromEntries(
  Object.keys(logos)
    .sort()
    .map((key) => [key, logos[key]]),
);
writeFileSync(target, JSON.stringify(sorted, null, 2) + "\n");

console.log(`Wrote ${Object.keys(sorted).length} index DTF logos to index-dtf/logos.json.`);
