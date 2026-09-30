import { toFunctionSelector, type Abi, type AbiParameter } from "viem";
import { describe, expect, it } from "vitest";

import { readExplorerAbiFixture } from "@/index-dtf/abis/explorer-fixture";
import { folioDeployerV6Abi } from "@/index-dtf/abis/folio-deployer-v6.generated";
import { folioV6Abi } from "@/index-dtf/abis/folio-v6.generated";

// Any drift between the generated v6 ABIs and the explorer-verified 6.0.0 deployment fails here.
const folioFixture = readExplorerAbiFixture("folio-6.0.0.base.json");
const deployerFixture = readExplorerAbiFixture("folio-deployer-6.0.0.base.json");

describe("Folio 6.0.0 ABIs against the explorer-verified deployment", () => {
  it("pins the fixtures to the verified Base 6.0.0 contracts", () => {
    expect(folioFixture).toMatchObject({
      contract: "Folio",
      version: "6.0.0",
      chainId: 8453,
      address: "0xfD2e67d50ef57721f6777A1A6e648FD734f5BF73",
      runtimeCodeKeccak256: "0xa142ca5d0c7450e00273d11fdd01b109756a098fb72403ab4a58b3ba5ef08ff5",
    });
    expect(deployerFixture).toMatchObject({
      contract: "FolioDeployer",
      version: "6.0.0",
      chainId: 8453,
      address: "0x4c891fCa6319d492866672E3D2AfdAAA5bDcfF67",
    });
  });

  it.each([
    ["Folio", folioV6Abi, folioFixture],
    ["FolioDeployer", folioDeployerV6Abi, deployerFixture],
  ] as const)("the generated %s ABI equals the deployed one item for item", (_, sdkAbi, fixture) => {
    expect(canonicalAbi(sdkAbi as Abi)).toEqual(canonicalAbi(fixture.abi));
  });

  it("encodes the deployed endRebalance(uint256), not the pre-audit endRebalance()", () => {
    const selectors = (folioV6Abi as Abi)
      .filter((item) => item.type === "function" && item.name === "endRebalance")
      .map((item) => toFunctionSelector(item as never));

    expect(selectors).toEqual([toFunctionSelector("endRebalance(uint256)")]);
  });
});

/** ABI items as sorted canonical strings: `internalType` and key order are compiler/explorer noise, not ABI. */
function canonicalAbi(abi: Abi): readonly string[] {
  return abi.map((item) => JSON.stringify(canonicalItem(item))).sort();
}

function canonicalItem(item: Abi[number]) {
  return {
    type: item.type,
    name: "name" in item ? item.name : undefined,
    inputs: "inputs" in item ? (item.inputs as readonly AbiParameter[]).map(canonicalParameter) : undefined,
    outputs: "outputs" in item ? (item.outputs as readonly AbiParameter[]).map(canonicalParameter) : undefined,
    stateMutability: "stateMutability" in item ? item.stateMutability : undefined,
    anonymous: "anonymous" in item ? Boolean(item.anonymous) : undefined,
  };
}

function canonicalParameter(parameter: AbiParameter): unknown {
  return {
    name: parameter.name ?? "",
    type: parameter.type,
    indexed: "indexed" in parameter ? parameter.indexed : undefined,
    components:
      "components" in parameter ? (parameter.components as readonly AbiParameter[]).map(canonicalParameter) : undefined,
  };
}
