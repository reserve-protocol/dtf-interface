import { buildClientSchema, getIntrospectionQuery, parse, validate } from "graphql";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { INDEX_DTF_SUBGRAPH_URL, YIELD_DTF_SUBGRAPH_URL } from "../dist/index.mjs";

// Release guard: every subgraph endpoint the built SDK queries must accept the GraphQL documents it ships. Codegen only
// checks Base prod; publishing while mainnet or BSC prod still serves an older schema would fail every read there.
const sdkRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const targets = [
  { name: "index", urls: INDEX_DTF_SUBGRAPH_URL, document: "src/index-dtf/subgraph/dtf.graphql" },
  { name: "yield", urls: YIELD_DTF_SUBGRAPH_URL, document: "src/yield-dtf/subgraph/yield.graphql" },
];

const problems = [];
let checked = 0;

for (const target of targets) {
  const document = parse(readFileSync(resolve(sdkRoot, target.document), "utf8"));

  for (const [chainId, url] of Object.entries(target.urls)) {
    const response = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ query: getIntrospectionQuery() }),
    });
    const body = await response.json();
    if (!response.ok || !body.data) {
      problems.push(`${target.name} ${chainId} ${url}: introspection failed (${response.status})`);
      continue;
    }

    const errors = validate(buildClientSchema(body.data), document);
    for (const error of errors) problems.push(`${target.name} ${chainId} ${url}: ${error.message}`);
    checked += 1;
  }
}

if (problems.length > 0) {
  process.stderr.write(`Subgraph endpoints reject the SDK's GraphQL documents:\n${problems.join("\n")}\n`);
  process.exit(1);
}

process.stdout.write(`subgraph-endpoints: ${checked} configured endpoints accept the SDK's GraphQL documents\n`);
