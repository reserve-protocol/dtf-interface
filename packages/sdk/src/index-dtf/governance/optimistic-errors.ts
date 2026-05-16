export function isUnsupportedOptimisticContractError(error: unknown): boolean {
  const message = error instanceof Error
    ? error.message.toLowerCase()
    : String(error).toLowerCase();

  return (
    message.includes("returned no data") ||
    message.includes("could not decode") ||
    message.includes("data size of 0 bytes") ||
    (message.includes("function") && message.includes("not found"))
  );
}

export function isUnsupportedVoteLockOptimisticReadError(error: unknown): boolean {
  const message = error instanceof Error
    ? error.message.toLowerCase()
    : String(error).toLowerCase();

  // Older staking vaults do not implement optimistic delegation/vote reads and revert via fallback.
  return (
    isUnsupportedOptimisticContractError(error) ||
    (message.includes("execution reverted") &&
      (message.includes("optimisticdelegates") ||
        message.includes("getoptimisticvotes") ||
        message.includes("getpastoptimisticvotes")))
  );
}
