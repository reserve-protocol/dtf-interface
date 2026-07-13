import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
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

if (result.error) {
  throw result.error;
}

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

const changedFiles = generatedFiles.filter((file) => before.get(file) !== read(file));

if (changedFiles.length > 0) {
  console.error(`GraphQL generated outputs changed:\n${changedFiles.join("\n")}`);
  console.error("Review the generated updates, then rerun this check.");
  process.exitCode = 1;
} else {
  console.log("GraphQL generated outputs are current.");
}

function read(file) {
  const path = resolve(root, file);
  return existsSync(path) ? readFileSync(path, "utf8") : undefined;
}
