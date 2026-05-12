import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["./src/index.ts"],
  deps: {
    neverBundle: ["@dtf-interface/sdk", "@tanstack/react-query", "react", "viem"],
  },
  dts: true,
  format: ["esm"],
});
