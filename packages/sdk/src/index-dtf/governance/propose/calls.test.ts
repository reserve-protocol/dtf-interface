import { decodeFunctionData } from "viem";
import { describe, expect, it } from "vitest";
import {
  buildIndexDtfDeprecateCall,
  buildIndexDtfSetAuctionLengthCall,
  buildIndexDtfSetFeeRecipientsCall,
  buildIndexDtfSetMandateCall,
  indexDtfV5WriteAbi,
} from "./calls.js";

const DTF = "0x0000000000000000000000000000000000000001";
const ACCOUNT = "0x0000000000000000000000000000000000000002";

describe("Index DTF call builders", () => {
  it("encodes simple setter calls", () => {
    const mandateCall = buildIndexDtfSetMandateCall({
      address: DTF,
      mandate: "New mandate",
      version: "5.0.0",
    });

    expect(mandateCall.target).toBe(DTF);
    expect(
      decodeFunctionData({ abi: indexDtfV5WriteAbi, data: mandateCall.calldata }),
    ).toMatchObject({ functionName: "setMandate", args: ["New mandate"] });
  });

  it("encodes v5 version-sensitive call names", () => {
    const oldCall = buildIndexDtfSetAuctionLengthCall({
      address: DTF,
      auctionLength: 1800,
      version: "5.0.0",
    });

    expect(
      decodeFunctionData({ abi: indexDtfV5WriteAbi, data: oldCall.calldata })
        .functionName,
    ).toBe("setAuctionLength");
  });

  it("encodes unchanged v5 call interfaces", () => {
    const oldCall = buildIndexDtfSetFeeRecipientsCall({
      address: DTF,
      version: "5.0.0",
      recipients: [{ recipient: ACCOUNT, portion: 1n }],
    });

    expect(
      decodeFunctionData({ abi: indexDtfV5WriteAbi, data: oldCall.calldata })
        .functionName,
    ).toBe("setFeeRecipients");
  });

  it("rejects non-v5 call builder versions", () => {
    expect(() =>
      buildIndexDtfSetAuctionLengthCall({
        address: DTF,
        auctionLength: 1800,
        version: "6.0.0" as never,
      }),
    ).toThrow("v5 only");
  });

  it("keeps unchanged no-arg calls available on older versions", () => {
    const call = buildIndexDtfDeprecateCall({
      address: DTF,
      version: "5.0.0",
    });

    expect(
      decodeFunctionData({ abi: indexDtfV5WriteAbi, data: call.calldata })
        .functionName,
    ).toBe("deprecateFolio");
  });
});
