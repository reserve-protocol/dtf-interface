import { dtfIndexAbi as indexDtfV5Abi } from "@/index-dtf/abis/dtf-index-abi";
import { folioV6Abi as indexDtfV6Abi } from "@/index-dtf/abis/folio-v6.generated";
import { SdkError } from "@/lib/errors";

export const indexDtfV5WriteAbi = indexDtfV5Abi;
export const indexDtfV6WriteAbi = indexDtfV6Abi;

export type IndexDtfWriteVersion = "5.0.0" | "6.0.0";

const INDEX_DTF_WRITE_VERSIONS: readonly IndexDtfWriteVersion[] = ["5.0.0", "6.0.0"];

/** Runtime guard for every write/calldata builder: v4 and unknown releases never get v5 bytes by default. */
export function assertIndexDtfWriteVersion(version: unknown): asserts version is IndexDtfWriteVersion {
  if (!INDEX_DTF_WRITE_VERSIONS.includes(version as IndexDtfWriteVersion)) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: `Unsupported Index DTF version: ${String(version)}`,
      meta: { version },
    });
  }
}

/** The Folio ABI a write builder encodes against; asserts the version first. */
export function getIndexDtfWriteAbi(version: IndexDtfWriteVersion) {
  assertIndexDtfWriteVersion(version);

  return version === "6.0.0" ? indexDtfV6WriteAbi : indexDtfV5WriteAbi;
}
