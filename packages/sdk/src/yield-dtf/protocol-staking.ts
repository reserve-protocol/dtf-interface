import type { DtfClient } from "@/client";
import type { GetYieldDtfProtocolStakingTotalsParams, YieldDtfProtocolStakingTotals } from "@/types/yield-dtf";

import { SdkError } from "@/lib/errors";
import { mapAmount } from "@/lib/utils";
import { yieldDtfChainIds } from "@/yield-dtf/config";
import { GetYieldDtfProtocolStakingTotalsDocument } from "@/yield-dtf/subgraph/yield.generated";

/** Reads protocol-wide RSR staking totals per Yield DTF chain from the subgraph's Protocol entity. */
export async function getYieldDtfProtocolStakingTotals(
  client: DtfClient,
  params: GetYieldDtfProtocolStakingTotalsParams = {},
): Promise<readonly YieldDtfProtocolStakingTotals[]> {
  return Promise.all(
    (params.chainIds ?? yieldDtfChainIds).map(async (chainId) => {
      const { protocols } = await client.subgraph.queryYield({
        chainId,
        query: GetYieldDtfProtocolStakingTotalsDocument,
      });
      const protocol = protocols[0];

      if (!protocol) {
        throw new SdkError({
          code: "RECORD_NOT_FOUND",
          message: `Yield DTF protocol entity not found on chain ${chainId}`,
          meta: { chainId, entity: "yieldDtfProtocol" },
        });
      }

      return {
        chainId,
        rsrStaked: mapAmount(protocol.rsrStaked),
        rsrStakedUsd: Number(protocol.rsrStakedUSD),
        lifetimeRsrStaked: mapAmount(protocol.totalRsrStaked),
        lifetimeRsrUnstaked: mapAmount(protocol.totalRsrUnstaked),
        rTokenCount: protocol.rTokenCount,
      };
    }),
  );
}
