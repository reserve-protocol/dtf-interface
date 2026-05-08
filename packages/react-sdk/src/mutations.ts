import {
  useMutation,
  useQueryClient,
  type DefaultError,
  type UseMutationOptions,
} from "@tanstack/react-query";
import {
  cancelIndexDtfProposal,
  delegateIndexDtfVotes,
  executeIndexDtfProposal,
  proposeIndexDtfProposal,
  queueIndexDtfProposal,
  SdkError,
  voteIndexDtfProposal,
  type CancelIndexDtfProposalParams,
  type DelegateIndexDtfVotesParams,
  type ExecuteIndexDtfProposalParams,
  type ProposeIndexDtfProposalParams,
  type QueueIndexDtfProposalParams,
  type VoteIndexDtfProposalParams,
} from "@dtf-interface/sdk";
import type { Hex, WalletClient } from "viem";
import { dtfQueryKeys } from "./query-keys.js";

export type DtfMutationOptions<TVariables, TContext = unknown> = Omit<
  UseMutationOptions<Hex, DefaultError, TVariables, TContext>,
  "mutationFn"
> & {
  readonly invalidateQueries?: boolean;
};

export function useIndexDtfDelegateMutation<TContext = unknown>(
  walletClient: WalletClient | undefined,
  options?: DtfMutationOptions<DelegateIndexDtfVotesParams, TContext>,
) {
  return useWalletClientMutation(
    walletClient,
    delegateIndexDtfVotes,
    options,
  );
}

export function useIndexDtfVoteMutation<TContext = unknown>(
  walletClient: WalletClient | undefined,
  options?: DtfMutationOptions<VoteIndexDtfProposalParams, TContext>,
) {
  return useWalletClientMutation(walletClient, voteIndexDtfProposal, options);
}

export function useIndexDtfQueueMutation<TContext = unknown>(
  walletClient: WalletClient | undefined,
  options?: DtfMutationOptions<QueueIndexDtfProposalParams, TContext>,
) {
  return useWalletClientMutation(walletClient, queueIndexDtfProposal, options);
}

export function useIndexDtfExecuteMutation<TContext = unknown>(
  walletClient: WalletClient | undefined,
  options?: DtfMutationOptions<ExecuteIndexDtfProposalParams, TContext>,
) {
  return useWalletClientMutation(walletClient, executeIndexDtfProposal, options);
}

export function useIndexDtfCancelMutation<TContext = unknown>(
  walletClient: WalletClient | undefined,
  options?: DtfMutationOptions<CancelIndexDtfProposalParams, TContext>,
) {
  return useWalletClientMutation(walletClient, cancelIndexDtfProposal, options);
}

export function useIndexDtfProposeMutation<TContext = unknown>(
  walletClient: WalletClient | undefined,
  options?: DtfMutationOptions<ProposeIndexDtfProposalParams, TContext>,
) {
  return useWalletClientMutation(walletClient, proposeIndexDtfProposal, options);
}

function useWalletClientMutation<TVariables, TContext>(
  walletClient: WalletClient | undefined,
  action: (walletClient: WalletClient, params: TVariables) => Promise<Hex>,
  options: DtfMutationOptions<TVariables, TContext> = {},
) {
  const queryClient = useQueryClient();
  const { invalidateQueries = true, onSuccess, ...mutationOptions } = options;

  return useMutation<Hex, DefaultError, TVariables, TContext>({
    ...mutationOptions,
    mutationFn: (params) => action(getWalletClient(walletClient), params),
    onSuccess: async (data, variables, onMutateResult, context) => {
      if (invalidateQueries) {
        await queryClient.invalidateQueries({
          queryKey: dtfQueryKeys.index.governance.all(),
        });
      }

      await onSuccess?.(data, variables, onMutateResult, context);
    },
  });
}

function getWalletClient(walletClient: WalletClient | undefined): WalletClient {
  if (walletClient) {
    return walletClient;
  }

  throw new SdkError({
    code: "NOT_CONFIGURED",
    message: "Wallet client is not connected.",
  });
}
