import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const generatedFiles = [
  "packages/sdk/src/index-dtf/subgraph/dtf.generated.ts",
  "packages/sdk/src/yield-dtf/subgraph/yield.generated.ts",
];
const before = new Map(generatedFiles.map((file) => [file, read(file)]));
const pnpm = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
const result = spawnSync(pnpm, ["--filter", "@reserve-protocol/sdk", "graphql:codegen"], {
  cwd: root,
  stdio: "inherit",
});

const changedFiles = generatedFiles.filter((file) => before.get(file) !== read(file));
// A check must not rewrite the checked-in types (e.g. back to an older prod schema): restore them on every path,
// including a codegen run that failed after writing one output.
for (const file of changedFiles) {
  const content = before.get(file);
  if (content === undefined) rmSync(resolve(root, file), { force: true });
  else writeFileSync(resolve(root, file), content);
}

if (result.error) {
  throw result.error;
}

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

if (changedFiles.length > 0) {
  console.error(`GraphQL generated outputs differ from the configured schemas:\n${changedFiles.join("\n")}`);
  console.error(
    "Run `pnpm graphql:codegen` and review the diff. Before a subgraph release is promoted to prod, point the index " +
      "schema at the candidate with INDEX_DTF_SUBGRAPH_SCHEMA=<.../dtf-index-base/<version>/gn>.",
  );
  process.exitCode = 1;
} else {
  console.log(
    `GraphQL generated outputs are current (index schema: ${process.env.INDEX_DTF_SUBGRAPH_SCHEMA || "prod"}).`,
  );
}

function read(file) {
  const path = resolve(root, file);
  return existsSync(path) ? readFileSync(path, "utf8") : undefined;
}
