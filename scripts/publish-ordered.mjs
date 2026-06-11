import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const packages = [
  { name: "@reserve-protocol/dtf-catalog", path: "packages/dtf-catalog" },
  { name: "@reserve-protocol/sdk", path: "packages/sdk" },
  { name: "@reserve-protocol/react-sdk", path: "packages/react-sdk" },
];
const dryRun = process.env.DRY_RUN === "1";

for (const pkg of packages) {
  const manifest = JSON.parse(readFileSync(join(pkg.path, "package.json"), "utf8"));
  const version = manifest.version;

  if (isPublished(pkg.name, version)) {
    console.log(`${pkg.name}@${version} is already published, skipping.`);
  } else {
    run("pnpm", ["--dir", pkg.path, "publish", "--access", "public", "--no-git-checks"], {
      label: `Publishing ${pkg.name}@${version}`,
    });
  }

  createTagIfMissing(`${pkg.name}@${version}`);
}

function isPublished(name, version) {
  const result = spawnSync("npm", ["view", `${name}@${version}`, "version", "--json"], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });

  if (result.status === 0) {
    return true;
  }

  const output = `${result.stdout}\n${result.stderr}`;
  if (output.includes("E404") || output.includes("404 Not Found")) {
    return false;
  }

  process.stdout.write(result.stdout);
  process.stderr.write(result.stderr);
  process.exit(result.status ?? 1);
}

function createTagIfMissing(tag) {
  const remoteTag = spawnSync("git", ["ls-remote", "--tags", "origin", tag], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });

  if (remoteTag.status === 0 && remoteTag.stdout.trim()) {
    console.log(`${tag} already exists on origin, skipping tag.`);
    return;
  }

  const localTag = spawnSync("git", ["rev-parse", "--verify", `refs/tags/${tag}`], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });

  if (localTag.status === 0) {
    console.log(`${tag} already exists locally, skipping tag.`);
    return;
  }

  run("git", ["tag", tag], { label: `Creating tag ${tag}` });
}

function run(command, args, { label }) {
  console.log(label);

  if (dryRun) {
    console.log(`[dry-run] ${command} ${args.join(" ")}`);
    return;
  }

  const result = spawnSync(command, args, { stdio: "inherit" });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
