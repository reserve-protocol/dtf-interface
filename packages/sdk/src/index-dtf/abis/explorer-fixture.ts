/// <reference types="node" />

import type { Abi, Address, Hex } from "viem";

import { readFileSync } from "node:fs";

/**
 * Test support, not part of the package: the Base Blockscout verified Folio 6.0.0 contracts the SDK encodes against
 * (source URL, address and runtime-code hash inside each `explorer/*.json`). The Folio runtime code is identical on
 * mainnet, Base and BSC.
 */
export type ExplorerAbiFixture = {
  readonly contract: string;
  readonly version: string;
  readonly chainId: number;
  readonly address: Address;
  readonly source: string;
  readonly verifiedAt: string;
  readonly compiler: string;
  readonly sourceFile: string;
  readonly runtimeCodeKeccak256: Hex;
  readonly abi: Abi;
};

export function readExplorerAbiFixture(
  file: "folio-6.0.0.base.json" | "folio-deployer-6.0.0.base.json",
): ExplorerAbiFixture {
  return JSON.parse(readFileSync(new URL(`./explorer/${file}`, import.meta.url), "utf8")) as ExplorerAbiFixture;
}
