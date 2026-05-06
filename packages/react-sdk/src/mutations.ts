import {
  useMutation,
  useQueryClient,
  type DefaultError,
  type UseMutationOptions,
} from "@tanstack/react-query";
import {
  SdkError,
  writeAccountDelegate,
  writeProposal,
  writeProposalCancel,
  writeProposalExecute,
  writeProposalQueue,
  writeProposalVote,
  type WriteIndexDtfCancelParams,
  type WriteIndexDtfDelegateParams,
  type WriteIndexDtfProposalParams,
  type WriteIndexDtfProposeParams,
  type WriteIndexDtfVoteParams,
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
  options?: DtfMutationOptions<WriteIndexDtfDelegateParams, TContext>,
) {
  return useWalletClientMutation(
    walletClient,
    writeAccountDelegate,
    options,
  );
}

export function useIndexDtfVoteMutation<TContext = unknown>(
  walletClient: WalletClient | undefined,
  options?: DtfMutationOptions<WriteIndexDtfVoteParams, TContext>,
) {
  return useWalletClientMutation(walletClient, writeProposalVote, options);
}

export function useIndexDtfQueueMutation<TContext = unknown>(
  walletClient: WalletClient | undefined,
  options?: DtfMutationOptions<WriteIndexDtfProposalParams, TContext>,
) {
  return useWalletClientMutation(walletClient, writeProposalQueue, options);
}

export function useIndexDtfExecuteMutation<TContext = unknown>(
  walletClient: WalletClient | undefined,
  options?: DtfMutationOptions<WriteIndexDtfProposalParams, TContext>,
) {
  return useWalletClientMutation(walletClient, writeProposalExecute, options);
}

export function useIndexDtfCancelMutation<TContext = unknown>(
  walletClient: WalletClient | undefined,
  options?: DtfMutationOptions<WriteIndexDtfCancelParams, TContext>,
) {
  return useWalletClientMutation(walletClient, writeProposalCancel, options);
}

export function useIndexDtfProposeMutation<TContext = unknown>(
  walletClient: WalletClient | undefined,
  options?: DtfMutationOptions<WriteIndexDtfProposeParams, TContext>,
) {
  return useWalletClientMutation(walletClient, writeProposal, options);
}

function useWalletClientMutation<TVariables, TContext>(
  walletClient: WalletClient | undefined,
  write: (walletClient: WalletClient, params: TVariables) => Promise<Hex>,
  options: DtfMutationOptions<TVariables, TContext> = {},
) {
  const queryClient = useQueryClient();
  const { invalidateQueries = true, onSuccess, ...mutationOptions } = options;

  return useMutation<Hex, DefaultError, TVariables, TContext>({
    ...mutationOptions,
    mutationFn: (params) => write(getWalletClient(walletClient), params),
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
