import type { SupportedChainId } from "@/defaults";
import type { DtfStatus } from "@/types/common";

export type ListIndexDtfsParams = {
  readonly chainId?: SupportedChainId;
  readonly status?: DtfStatus | readonly DtfStatus[];
};
