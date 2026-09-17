import { describe, expect, it } from "vitest";

import * as sdk from "@/index";

describe("SDK public surface", () => {
  it("does not export wallet-client creation helpers", () => {
    expect("createWalletClient" in sdk).toBe(false);
  });

  it("exports the canonical generated Index DTF v6 ABIs", () => {
    expect(sdk.folioArtifactAbi).toBe(sdk.folioV6Abi);
    expect(sdk.folioV6Abi.some((entry) => entry.type === "function" && entry.name === "startRebalance")).toBe(true);
    expect(sdk.folioDeployerV6Abi.some((entry) => entry.type === "function" && entry.name === "deployFolio")).toBe(
      true,
    );
    expect(
      sdk.folioVersionRegistryAbi.some((entry) => entry.type === "function" && entry.name === "registerVersion"),
    ).toBe(true);
  });
});
