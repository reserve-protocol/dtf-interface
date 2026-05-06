import type { Abi } from "viem";
import {
  INDEX_DTF_VERSION_5_0_0,
  INDEX_DTF_VERSION_6_0_0,
} from "../versions.js";
import { dtfIndexAbi } from "./dtf-index-abi.js";
import { dtfIndexAbiV1 } from "./dtf-index-abi-v1.js";
import { dtfIndexAbiV2 } from "./dtf-index-abi-v2.js";
import { dtfIndexAbiV4 } from "./dtf-index-abi-v4.js";
import { folioArtifactAbi as indexDtfArtifactAbi } from "./folio-artifact.js";

export const dtfIndexProposalAbiV1 = dtfIndexAbiV1;
export const dtfIndexProposalAbiV2 = dtfIndexAbiV2;
export const dtfIndexProposalAbiV4 = dtfIndexAbiV4;
export const dtfIndexProposalAbiV5 = dtfIndexAbi;

type DtfIndexProposalAbiCatalogEntry = {
  readonly version: string;
  readonly abi: Abi;
};

export const dtfIndexProposalAbiCatalog: readonly DtfIndexProposalAbiCatalogEntry[] = [
  { version: INDEX_DTF_VERSION_6_0_0, abi: indexDtfArtifactAbi },
  { version: INDEX_DTF_VERSION_5_0_0, abi: dtfIndexProposalAbiV5 },
  { version: "4.0.0", abi: dtfIndexProposalAbiV4 },
  { version: "2.0.0", abi: dtfIndexProposalAbiV2 },
  { version: "1.0.0", abi: dtfIndexProposalAbiV1 },
] as const;

export const dtfIndexProposalAbi = dtfIndexProposalAbiCatalog.flatMap(
  ({ abi }) => abi,
) as Abi;
