import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["./src/index.ts"],
  deps: {
    neverBundle: ["@reserve-protocol/sdk", "@tanstack/react-query", "react", "viem"],
  },
  dts: true,
  format: ["esm"],
});
