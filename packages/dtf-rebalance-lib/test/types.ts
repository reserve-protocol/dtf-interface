import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { Contract } from "ethers";

import { FolioVersion } from "@/types";

export interface FolioConfig {
  version: FolioVersion;
  name: string;
  chainId: number;
  folio: string;
  proxyAdmin: string;
  basketGovernor?: string;
}

export interface RebalanceContracts {
  folio: Contract;
  folioLensTyped: Contract;
}

export interface RebalanceSigners {
  admin: HardhatEthersSigner;
  bidder: HardhatEthersSigner;
  rebalanceManager: HardhatEthersSigner;
  auctionLauncher: HardhatEthersSigner;
}
