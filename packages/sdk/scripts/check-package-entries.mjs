// Packs @reserve-protocol/sdk the way npm will ship it, installs the tarball next to the workspace dependencies and
// loads it through both package entries: `import` (ESM) and `require` (CJS). Every export must exist in both with the
// same shape; every exported ABI must be an array. Catches interop regressions such as CJS exporting `{ default: ABI }`.
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readdirSync, renameSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const sdkRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const REQUIRED_ABIS = ["folioV6Abi", "folioDeployerV6Abi", "folioVersionRegistryAbi", "folioArtifactAbi"];

assertDistIsFresh();

// Inside the package's own node_modules so the unpacked package resolves viem, zod, the catalog, etc. from the workspace.
const cacheRoot = join(sdkRoot, "node_modules", ".cache");
mkdirSync(cacheRoot, { recursive: true });
const workDirectory = mkdtempSync(join(cacheRoot, "package-entries-"));

try {
  execFileSync("pnpm", ["pack", "--pack-destination", workDirectory], { cwd: sdkRoot, stdio: "ignore" });
  const tarball = readdirSync(workDirectory).find((file) => file.endsWith(".tgz"));
  if (!tarball) fail("pnpm pack produced no tarball");
  execFileSync("tar", ["-xzf", join(workDirectory, tarball), "-C", workDirectory]);
  const installed = join(workDirectory, "node_modules", "@reserve-protocol");
  mkdirSync(installed, { recursive: true });
  renameSync(join(workDirectory, "package"), join(installed, "sdk"));

  const probe = join(workDirectory, "probe.mjs");
  writeFileSync(
    probe,
    [
      'import { createRequire } from "node:module";',
      'import * as esm from "@reserve-protocol/sdk";',
      'const cjs = createRequire(import.meta.url)("@reserve-protocol/sdk");',
      "const shape = (module) => Object.fromEntries(Object.keys(module).filter((key) => key !== 'default' && key !== '__esModule').sort().map((key) => [key, Array.isArray(module[key]) ? 'array' : typeof module[key]]));",
      "process.stdout.write(JSON.stringify({ esm: shape(esm), cjs: shape(cjs) }));",
    ].join("\n"),
  );
  const { esm, cjs } = JSON.parse(execFileSync(process.execPath, [probe], { cwd: workDirectory, encoding: "utf8" }));

  const problems = [];
  const abiKeys = new Set([...REQUIRED_ABIS, ...[...Object.keys(esm), ...Object.keys(cjs)].filter(isAbiName)]);
  for (const key of new Set([...Object.keys(esm), ...Object.keys(cjs), ...abiKeys])) {
    const expected = abiKeys.has(key) ? "array" : esm[key];
    if (esm[key] !== expected || cjs[key] !== expected) {
      problems.push(
        `${key}: ESM ${esm[key] ?? "missing"}, CJS ${cjs[key] ?? "missing"}${abiKeys.has(key) ? " (ABIs must be arrays)" : ""}`,
      );
    }
  }
  if (problems.length > 0) fail(`Packed ESM and CJS entries disagree:\n${problems.join("\n")}`);

  const abiCount = abiKeys.size;
  process.stdout.write(
    `package-entries: ${tarball} loads through import and require; ${Object.keys(esm).length} exports match, ${abiCount} ABIs are arrays\n`,
  );
} finally {
  rmSync(workDirectory, { recursive: true, force: true });
}

/** A stale dist would certify old output: every non-test source must be older than both entry bundles. */
function assertDistIsFresh() {
  const entries = ["dist/index.mjs", "dist/index.cjs"].map((file) => {
    try {
      return statSync(join(sdkRoot, file)).mtimeMs;
    } catch {
      return fail(`${file} is missing; run \`pnpm --filter @reserve-protocol/sdk build\` first`);
    }
  });
  const builtAt = Math.min(...entries);
  const newer = listFiles(join(sdkRoot, "src")).filter(
    (file) => /\.tsx?$/.test(file) && !/\.test\.tsx?$/.test(file) && statSync(file).mtimeMs > builtAt,
  );
  if (newer.length > 0) {
    fail(`dist is older than ${newer.length} source file(s), e.g. ${newer[0]}; rebuild before checking the package`);
  }
}

function isAbiName(key) {
  return /Abi(V\d+)?$/.test(key);
}

function listFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? listFiles(join(directory, entry.name)) : [join(directory, entry.name)],
  );
}

// Throws instead of exiting so the `finally` above always removes the unpacked package.
function fail(message) {
  throw new Error(message);
}
