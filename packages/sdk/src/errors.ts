export type SdkErrorCode =
  | "INVALID_RESPONSE"
  | "NOT_CONFIGURED"
  | "NOT_IMPLEMENTED"
  | "RECORD_NOT_FOUND"
  | "REQUEST_FAILED"
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
