import { describe, expect, it } from "vitest";

import { SdkError, isSdkError } from "@/errors";

describe("SdkError", () => {
  it("exposes a deterministic code, message, and metadata", () => {
    const error = new SdkError({
      code: "RECORD_NOT_FOUND",
      message: "Index DTF not found",
      meta: {
        address: "0x0000000000000000000000000000000000000001",
        chainId: 1,
        entity: "indexDtf",
      },
    });

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(SdkError);
    expect(error.name).toBe("SdkError");
    expect(error.code).toBe("RECORD_NOT_FOUND");
    expect(error.message).toBe("Index DTF not found");
    expect(error.meta).toEqual({
      address: "0x0000000000000000000000000000000000000001",
      chainId: 1,
      entity: "indexDtf",
    });
    expect(isSdkError(error)).toBe(true);
  });

  it("serializes without unstable stack or cause data", () => {
    const error = new SdkError({
      code: "UNSUPPORTED_CHAIN",
      message: "Unsupported chain id: 10",
      meta: { chainId: 10 },
    });

    expect(error.toJSON()).toEqual({
      name: "SdkError",
      code: "UNSUPPORTED_CHAIN",
      message: "Unsupported chain id: 10",
      meta: { chainId: 10 },
    });
  });
});
