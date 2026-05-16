import { getAddress } from "viem";

import type { DtfClient } from "@/client";
import type { GetIndexDtfDelegatesParams, IndexDtfDelegate } from "@/types/governance";

import { SdkError } from "@/lib/errors";
import { DEFAULT_DELEGATE_LIMIT } from "@/index-dtf/governance/constants";
import { GetIndexDtfDelegatesDocument } from "@/index-dtf/subgraph/dtf.generated";
import { mapAmount } from "@/lib/utils";

export async function getDelegates(
  client: DtfClient,
  params: GetIndexDtfDelegatesParams,
): Promise<readonly IndexDtfDelegate[]> {
  const stToken = getAddress(params.stToken);
  const { stakingToken } = await client.subgraph.queryIndex({
    chainId: params.chainId,
    query: GetIndexDtfDelegatesDocument,
    variables: {
      stToken: stToken.toLowerCase(),
      limit: params.limit ?? DEFAULT_DELEGATE_LIMIT,
    },
  });

  if (!stakingToken) {
    throw new SdkError({
      code: "RECORD_NOT_FOUND",
      message: `Index DTF staking token not found: ${stToken} on chain ${params.chainId}`,
      meta: {
        chainId: params.chainId,
        entity: "indexDtfStakingToken",
        address: stToken,
      },
    });
  }

  return stakingToken.delegates.map((delegate) => ({
    address: getAddress(delegate.address),
    delegatedVotes: mapAmount(delegate.delegatedVotesRaw),
    optimisticDelegatedVotes: mapAmount(delegate.optimisticDelegatedVotesRaw),
    numberVotes: Number(delegate.numberVotes),
    numberOptimisticVotes: Number(delegate.numberOptimisticVotes),
    hasBeenStandardDelegate: delegate.hasBeenStandardDelegate,
    hasBeenOptimisticDelegate: delegate.hasBeenOptimisticDelegate,
    tokenHoldersRepresentedAmount: Number(delegate.tokenHoldersRepresentedAmount),
    optimisticTokenHoldersRepresentedAmount: Number(delegate.optimisticTokenHoldersRepresentedAmount),
  }));
}
