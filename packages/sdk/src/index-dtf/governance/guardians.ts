import type { DtfClient } from "@/client";
import type { GetIndexDtfGuardiansParams, IndexDtfGuardians } from "@/types/governance";

import { getDtf } from "@/index-dtf/dtf/index";
import { mapGuardianGroup } from "@/index-dtf/governance/utils";
import { dedupeAddresses } from "@/lib/utils";

export async function getGuardians(client: DtfClient, params: GetIndexDtfGuardiansParams): Promise<IndexDtfGuardians> {
  const dtf = "dtf" in params ? params.dtf : await getDtf(client, params);
  const owner = mapGuardianGroup(dtf.governance.admin.primary);
  const basket = mapGuardianGroup(dtf.governance.rebalance.primary);
  const dao = mapGuardianGroup(dtf.governance.voteLock);

  return {
    owner,
    basket,
    dao,
    all: dedupeAddresses([...owner.guardians, ...basket.guardians, ...dao.guardians]),
  };
}
