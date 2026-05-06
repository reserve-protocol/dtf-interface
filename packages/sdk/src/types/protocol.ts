import type { SupportedChainId } from "../defaults.js";
import type { DtfStatus } from "./common.js";

export type ListIndexDtfsParams = {
  readonly chainId?: SupportedChainId;
  readonly status?: DtfStatus | readonly DtfStatus[];
};
