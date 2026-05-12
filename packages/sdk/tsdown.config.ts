import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["./src/index.ts"],
  deps: {
    neverBundle: [
      "@dtf-interface/dtf-catalog",
      "@reserve-protocol/dtf-rebalance-lib",
      "decimal.js-light",
      "graphql",
      "graphql-request",
      "viem",
      "zod",
    ],
  },
  dts: true,
  format: ["esm"],
});
