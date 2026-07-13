import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { gzipSync } from "node:zlib";
import { build } from "vite";

const repoRoot = path.resolve(import.meta.dirname, "../../..");
const entryDirectory = await mkdtemp(path.join(tmpdir(), "dtf-sdk-bundle-"));
const entry = path.join(entryDirectory, "price-reader.mjs");
const sdkEntry = path.join(repoRoot, "packages/sdk/dist/index.mjs");

try {
  await writeFile(entry, `export { getIndexDtfPrice } from ${JSON.stringify(sdkEntry)};\n`);

  const result = await build({
    configFile: false,
    logLevel: "silent",
    define: {
      "process.env.NODE_ENV": JSON.stringify("production"),
    },
    build: {
      write: false,
      minify: "esbuild",
      lib: {
        entry,
        formats: ["es"],
      },
      rollupOptions: {
        output: {
          exports: "named",
        },
      },
    },
  });

  const outputs = Array.isArray(result) ? result : [result];
  const chunks = outputs.flatMap((output) => output.output.filter((item) => item.type === "chunk"));
  const code = chunks.map((chunk) => chunk.code).join("\n");
  const moduleIds = new Set(chunks.flatMap((chunk) => Object.keys(chunk.modules)));
  const forbidden = ["/zod@", "dtf-rebalance-lib", "decimal.js-light"];
  const retained = forbidden.filter((dependency) => [...moduleIds].some((id) => id.includes(dependency)));
  const bytes = Buffer.byteLength(code);
  const gzipBytes = gzipSync(code).byteLength;

  if (retained.length > 0) {
    throw new Error(`price reader retained unrelated dependencies: ${retained.join(", ")}`);
  }

  if (bytes > 25_000 || gzipBytes > 8_000) {
    throw new Error(`price reader bundle exceeded budget: ${bytes} bytes, ${gzipBytes} bytes gzip`);
  }

  console.log(`sdk-bundle-check: price reader ${bytes} bytes (${gzipBytes} bytes gzip), no unrelated dependencies`);
} finally {
  await rm(entryDirectory, { recursive: true, force: true });
}
