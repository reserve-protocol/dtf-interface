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
