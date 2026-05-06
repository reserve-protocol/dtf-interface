import type { DtfClient } from "../../client.js";
import { dedupeAddresses } from "../../lib/utils.js";
import type {
  GetIndexDtfGuardiansParams,
  IndexDtfGuardians,
} from "../../types/governance.js";
import { getIndexDtf } from "../dtf/index.js";
import { mapGuardianGroup } from "./utils.js";

export async function getIndexDtfGuardians(
  client: DtfClient,
  params: GetIndexDtfGuardiansParams,
): Promise<IndexDtfGuardians> {
  const dtf = "dtf" in params ? params.dtf : await getIndexDtf(client, params);
  const owner = mapGuardianGroup(dtf.governance.admin.primary);
  const basket = mapGuardianGroup(dtf.governance.rebalance.primary);
  const dao = mapGuardianGroup(dtf.governance.voteLock);

  return {
    owner,
    basket,
    dao,
    all: dedupeAddresses([
      ...owner.guardians,
      ...basket.guardians,
      ...dao.guardians,
    ]),
  };
}
