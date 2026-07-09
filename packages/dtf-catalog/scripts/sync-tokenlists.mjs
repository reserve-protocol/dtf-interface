// Generates Uniswap-spec token lists from the catalog and validates them
// against the official Uniswap token-list JSON schema.
//
// For each index-dtf source list (and its restricted subset) it emits a
// standard `*.tokenlist.json` under tokenlists/, then validates every list with
// ajv against @reserve-protocol's copy of the Uniswap schema. Restricted tokens
// are excluded from the main lists and only appear in the restricted lists.
// Lists with no tokens are skipped because the schema requires at least one
// token. The list timestamp is derived from the newest token so generation
// stays deterministic. Token logoURIs come from the index-dtf/logos.json
// snapshot produced by sync:logos.
//
// Run `node scripts/sync-tokenlists.mjs` to regenerate the token lists.
// Run `node scripts/sync-tokenlists.mjs --check` to validate them and verify
// they are up to date (used in CI). Exits non-zero on an invalid or stale list.

import schema from "@uniswap/token-lists/src/tokenlist.schema.json" with { type: "json" };
import Ajv from "ajv";
import addFormats from "ajv-formats";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

const logos = JSON.parse(readFileSync(join(packageRoot, "index-dtf/logos.json"), "utf8"));
const missingLogos = [];

const chainNames = { base: "Base", bnb: "BNB", mainnet: "Ethereum" };

const listLogoURI =
  "https://github.com/reserve-protocol/brand-assets/blob/master/assets/Reserve-Monogram-white-blue.png?raw=true";

const specs = [];
for (const chain of ["base", "bnb", "mainnet"]) {
  specs.push({
    name: `Reserve Index DTFs ${chainNames[chain]}`,
    source: `index-dtf/${chain}.json`,
    output: `tokenlists/index-dtf/${chain}.tokenlist.json`,
    include: (token) => !token.restricted,
  });
  specs.push({
    name: `Reserve Restricted DTFs ${chainNames[chain]}`,
    source: `index-dtf/restricted/${chain}.json`,
    output: `tokenlists/index-dtf/restricted/${chain}.tokenlist.json`,
    include: () => true,
  });
}

function buildTokenList(name, source, include) {
  const entries = Object.values(source).filter(include);
  if (entries.length === 0) return null;

  const newestCreatedAt = Math.max(...entries.map((token) => token.createdAt));

  return {
    name,
    logoURI: listLogoURI,
    timestamp: new Date(newestCreatedAt * 1000).toISOString(),
    version: { major: 1, minor: 0, patch: 0 },
    tokens: entries.map((token) => {
      const logoURI = logos[`${token.chainId}:${token.address.toLowerCase()}`];
      if (!logoURI) missingLogos.push(`${token.symbol} (${token.chainId}:${token.address})`);
      return {
        chainId: token.chainId,
        address: token.address,
        name: token.name,
        symbol: token.symbol,
        decimals: token.decimals,
        logoURI,
      };
    }),
  };
}

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
const validate = ajv.compile(schema);

const check = process.argv.includes("--check");
const invalid = [];
const stale = [];

for (const spec of specs) {
  const source = JSON.parse(readFileSync(join(packageRoot, spec.source), "utf8"));
  const list = buildTokenList(spec.name, source, spec.include);
  const target = join(packageRoot, spec.output);

  if (list && !validate(list)) {
    invalid.push({ output: spec.output, errors: validate.errors });
    continue;
  }

  const expected = list === null ? null : JSON.stringify(list, null, 2) + "\n";

  if (check) {
    const actual = existsSync(target) ? readFileSync(target, "utf8") : null;
    if (actual !== expected) stale.push(spec.output);
    continue;
  }

  if (expected === null) {
    if (existsSync(target)) rmSync(target);
    continue;
  }
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, expected);
}

if (invalid.length > 0) {
  for (const { output, errors } of invalid) {
    console.error(`Token list ${output} failed Uniswap schema validation:`);
    console.error(JSON.stringify(errors, null, 2));
  }
  process.exit(1);
}

if (check && stale.length > 0) {
  console.error(
    `Token lists are out of date for: ${stale.join(", ")}.\n` +
      `Run \`pnpm --filter @reserve-protocol/dtf-catalog sync:tokenlists\` and commit the result.`,
  );
  process.exit(1);
}

if (missingLogos.length > 0) {
  console.warn(`Missing logoURI for: ${[...new Set(missingLogos)].join(", ")}. Run sync:logos to refresh.`);
}

if (check) {
  console.log("Token lists are valid and up to date.");
} else {
  console.log("Synced token lists.");
}
