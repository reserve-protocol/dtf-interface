import { decodeFunctionData } from "viem";
import { describe, expect, it } from "vitest";
import {
  indexDtfV5WriteAbi,
  prepareIndexDtfDeprecate,
  prepareIndexDtfSetAuctionLength,
  prepareIndexDtfSetFeeRecipients,
  prepareIndexDtfSetMandate,
} from "./calls.js";

const DTF = "0x0000000000000000000000000000000000000001";
const ACCOUNT = "0x0000000000000000000000000000000000000002";

describe("Index DTF call builders", () => {
  it("encodes simple setter calls", () => {
    const mandateCall = prepareIndexDtfSetMandate({
      address: DTF,
      chainId: 1,
      mandate: "New mandate",
      version: "5.0.0",
    });

    expect(mandateCall.to).toBe(DTF);
    expect(
      decodeFunctionData({ abi: indexDtfV5WriteAbi, data: mandateCall.data }),
    ).toMatchObject({ functionName: "setMandate", args: ["New mandate"] });
  });

  it("encodes v5 version-sensitive call names", () => {
    const oldCall = prepareIndexDtfSetAuctionLength({
      address: DTF,
      chainId: 1,
      auctionLength: 1800,
      version: "5.0.0",
    });

    expect(
      decodeFunctionData({ abi: indexDtfV5WriteAbi, data: oldCall.data })
        .functionName,
    ).toBe("setAuctionLength");
  });

  it("encodes unchanged v5 call interfaces", () => {
    const oldCall = prepareIndexDtfSetFeeRecipients({
      address: DTF,
      chainId: 1,
      version: "5.0.0",
      recipients: [{ recipient: ACCOUNT, portion: 1n }],
    });

    expect(
      decodeFunctionData({ abi: indexDtfV5WriteAbi, data: oldCall.data })
        .functionName,
    ).toBe("setFeeRecipients");
  });

  it("rejects non-v5 call builder versions", () => {
    expect(() =>
      prepareIndexDtfSetAuctionLength({
        address: DTF,
        chainId: 1,
        auctionLength: 1800,
        version: "6.0.0" as never,
      }),
    ).toThrow("v5 only");
  });

  it("keeps unchanged no-arg calls available on older versions", () => {
    const call = prepareIndexDtfDeprecate({
      address: DTF,
      chainId: 1,
      version: "5.0.0",
    });

    expect(
      decodeFunctionData({ abi: indexDtfV5WriteAbi, data: call.data })
        .functionName,
    ).toBe("deprecateFolio");
  });
});
