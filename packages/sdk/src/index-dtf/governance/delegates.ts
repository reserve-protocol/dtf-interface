import { getAddress } from "viem";

import type { DtfClient } from "../../client.js";
import type { GetIndexDtfDelegatesParams, IndexDtfDelegate } from "../../types/governance.js";

import { SdkError } from "../../errors.js";
import { mapAmount } from "../../lib/utils.js";
import { GetIndexDtfDelegatesDocument } from "../subgraph/dtf.generated.js";
import { DEFAULT_DELEGATE_LIMIT } from "./constants.js";

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
    delegatedVotes: mapAmount(delegate.delegatedVotes),
    numberVotes: Number(delegate.numberVotes),
  }));
}
