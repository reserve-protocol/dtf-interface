import type { DtfClient } from "../../client.js";
import { SdkError } from "../../errors.js";
import type {
  GetIndexDtfRebalanceParams,
  GetIndexDtfRebalancesParams,
} from "../../types/index-dtf.js";

export async function getRebalance(
  _client: DtfClient,
  _params: GetIndexDtfRebalanceParams,
): Promise<unknown> {
  throw new SdkError({
    code: "NOT_IMPLEMENTED",
    message: "getIndexDtfRebalance is not implemented yet.",
    meta: { method: "getIndexDtfRebalance" },
  });
}

export async function getRebalances(
  _client: DtfClient,
  _params: GetIndexDtfRebalancesParams,
): Promise<readonly unknown[]> {
  throw new SdkError({
    code: "NOT_IMPLEMENTED",
    message: "getIndexDtfRebalances is not implemented yet.",
    meta: { method: "getIndexDtfRebalances" },
  });
}
