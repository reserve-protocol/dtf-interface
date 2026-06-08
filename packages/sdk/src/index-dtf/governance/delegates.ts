import { getAddress } from "viem";

import type { DtfClient } from "@/client";
import type { GetIndexDtfDelegatesParams, IndexDtfDelegate, IndexDtfDelegates } from "@/types/governance";

import { DEFAULT_DELEGATE_LIMIT } from "@/index-dtf/governance/constants";
import { GetIndexDtfDelegatesDocument } from "@/index-dtf/subgraph/dtf.generated";
import { SdkError } from "@/lib/errors";
import { mapAmount } from "@/lib/utils";

export async function getDelegates(client: DtfClient, params: GetIndexDtfDelegatesParams): Promise<IndexDtfDelegates> {
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

  const voteSupply = BigInt(stakingToken.token.totalSupply);
  const delegates: IndexDtfDelegate[] = [];
  const normalDelegates: IndexDtfDelegate[] = [];
  const optimisticDelegates: IndexDtfDelegate[] = [];

  for (const delegate of stakingToken.delegates) {
    const delegatedVotes = mapAmount(delegate.delegatedVotesRaw);
    const optimisticDelegatedVotes = mapAmount(delegate.optimisticDelegatedVotesRaw);
    const mappedDelegate = {
      address: getAddress(delegate.address),
      delegatedVotes,
      optimisticDelegatedVotes,
      weightedVotes: getWeightedVotes(delegatedVotes.raw, voteSupply),
      optimisticWeightedVotes: getWeightedVotes(optimisticDelegatedVotes.raw, voteSupply),
      numberVotes: Number(delegate.numberVotes),
      numberOptimisticVotes: Number(delegate.numberOptimisticVotes),
      hasBeenStandardDelegate: delegate.hasBeenStandardDelegate,
      hasBeenOptimisticDelegate: delegate.hasBeenOptimisticDelegate,
      tokenHoldersRepresentedAmount: Number(delegate.tokenHoldersRepresentedAmount),
      optimisticTokenHoldersRepresentedAmount: Number(delegate.optimisticTokenHoldersRepresentedAmount),
    };

    delegates.push(mappedDelegate);

    if (delegatedVotes.raw > 0n) {
      normalDelegates.push(mappedDelegate);
    }

    if (optimisticDelegatedVotes.raw > 0n) {
      optimisticDelegates.push(mappedDelegate);
    }
  }

  return {
    delegates,
    normalDelegates,
    optimisticDelegates,
    totalDelegates: Number(stakingToken.totalDelegates),
    currentDelegates: Number(stakingToken.currentDelegates),
    totalNormalDelegates: Number(stakingToken.totalDelegates),
    currentNormalDelegates: Number(stakingToken.currentDelegates),
    totalOptimisticDelegates: Number(stakingToken.totalOptimisticDelegates),
    currentOptimisticDelegates: Number(stakingToken.currentOptimisticDelegates),
    voteSupply: mapAmount(voteSupply),
  };
}

function getWeightedVotes(votes: bigint, voteSupply: bigint): number {
  if (voteSupply === 0n) return 0;

  return (Number(votes) / Number(voteSupply)) * 100;
}
