export type SdkErrorCode =
  | "API_REQUEST_FAILED"
  | "INDEX_DTF_NOT_FOUND"
  | "INDEX_DTF_BASKET_INVALID"
  | "NOT_IMPLEMENTED"
  | "SUBGRAPH_NOT_CONFIGURED"
  | "SUBGRAPH_REQUEST_FAILED"
  | "TOKEN_NOT_FOUND"
  | "UNKNOWN_INDEX_DTF_PRICE_CONTROL"
  | "UNSUPPORTED_CHAIN";

export type SdkErrorMeta = Record<string, unknown>;

export type SdkErrorOptions = {
  readonly code: SdkErrorCode;
  readonly message: string;
  readonly cause?: unknown;
  readonly meta?: SdkErrorMeta;
};

export class SdkError extends Error {
  readonly code: SdkErrorCode;
  readonly meta: SdkErrorMeta | undefined;

  constructor({ cause, code, message, meta }: SdkErrorOptions) {
    super(message, cause === undefined ? undefined : { cause });

    this.name = "SdkError";
    this.code = code;
    this.meta = meta;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      ...(this.meta ? { meta: this.meta } : {}),
    };
  }
}

export function isSdkError(error: unknown): error is SdkError {
  return error instanceof SdkError;
}
