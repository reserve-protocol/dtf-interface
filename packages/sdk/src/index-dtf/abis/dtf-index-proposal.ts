import type { Abi } from "viem";

import { dtfIndexAbi } from "@/index-dtf/abis/dtf-index-abi";
import { dtfIndexAbiV1 } from "@/index-dtf/abis/dtf-index-abi-v1";
import { dtfIndexAbiV2 } from "@/index-dtf/abis/dtf-index-abi-v2";
import { dtfIndexAbiV4 } from "@/index-dtf/abis/dtf-index-abi-v4";
import { folioArtifactAbi as indexDtfArtifactAbi } from "@/index-dtf/abis/folio-artifact";

export const dtfIndexProposalAbiV1 = dtfIndexAbiV1;
export const dtfIndexProposalAbiV2 = dtfIndexAbiV2;
export const dtfIndexProposalAbiV4 = dtfIndexAbiV4;
export const dtfIndexProposalAbiV5 = dtfIndexAbi;

type DtfIndexProposalAbiCatalogEntry = {
  readonly version: string;
  readonly abi: Abi;
};

export const dtfIndexProposalAbiCatalog: readonly DtfIndexProposalAbiCatalogEntry[] = [
  { version: "6.0.0", abi: indexDtfArtifactAbi },
  { version: "5.0.0", abi: dtfIndexProposalAbiV5 },
  { version: "4.0.0", abi: dtfIndexProposalAbiV4 },
  { version: "2.0.0", abi: dtfIndexProposalAbiV2 },
  { version: "1.0.0", abi: dtfIndexProposalAbiV1 },
] as const;

export const dtfIndexProposalAbi = dtfIndexProposalAbiCatalog.flatMap(({ abi }) => abi) as Abi;
