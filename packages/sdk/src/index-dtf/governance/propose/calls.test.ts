import { decodeFunctionData } from "viem";
import { describe, expect, it } from "vitest";
import {
  buildIndexDtfDeprecateCall,
  buildIndexDtfSetAuctionLengthCall,
  buildIndexDtfSetFeeRecipientsCall,
  buildIndexDtfSetSelfFeeCall,
  buildIndexDtfSetMandateCall,
  buildIndexDtfSetTradeAllowlistEnabledCall,
  indexDtfV5WriteAbi,
  indexDtfV6WriteAbi,
} from "./calls.js";

const DTF = "0x0000000000000000000000000000000000000001";
const ACCOUNT = "0x0000000000000000000000000000000000000002";

describe("Index DTF call builders", () => {
  it("encodes simple setter calls", () => {
    const mandateCall = buildIndexDtfSetMandateCall({
      address: DTF,
      mandate: "New mandate",
      version: "6.0.0",
    });
    const selfFeeCall = buildIndexDtfSetSelfFeeCall({
      address: DTF,
      percentage: 1,
      version: "6.0.0",
    });
    const allowlistCall = buildIndexDtfSetTradeAllowlistEnabledCall({
      address: DTF,
      enabled: true,
      version: "6.0.0",
    });

    expect(mandateCall.target).toBe(DTF);
    expect(
      decodeFunctionData({ abi: indexDtfV6WriteAbi, data: mandateCall.calldata }),
    ).toMatchObject({ functionName: "setMandate", args: ["New mandate"] });
    expect(
      decodeFunctionData({ abi: indexDtfV6WriteAbi, data: selfFeeCall.calldata }),
    ).toMatchObject({ functionName: "setFolioSelfFee", args: [10_000_000_000_000_000n] });
    expect(
      decodeFunctionData({ abi: indexDtfV6WriteAbi, data: allowlistCall.calldata }),
    ).toMatchObject({ functionName: "setTradeAllowlistEnabled", args: [true] });
  });

  it("uses the Index DTF version when an interface changed", () => {
    const oldCall = buildIndexDtfSetAuctionLengthCall({
      address: DTF,
      auctionLength: 1800,
      version: "5.0.0",
    });
    const latestCall = buildIndexDtfSetAuctionLengthCall({
      address: DTF,
      auctionLength: 1800,
      version: "6.0.0",
    });

    expect(
      decodeFunctionData({ abi: indexDtfV5WriteAbi, data: oldCall.calldata })
        .functionName,
    ).toBe("setAuctionLength");
    expect(
      decodeFunctionData({ abi: indexDtfV6WriteAbi, data: latestCall.calldata })
        .functionName,
    ).toBe("setMaxAuctionLength");
  });

  it("encodes unchanged call interfaces on each version", () => {
    const oldCall = buildIndexDtfSetFeeRecipientsCall({
      address: DTF,
      version: "5.0.0",
      recipients: [{ recipient: ACCOUNT, portion: 1n }],
    });
    const latestCall = buildIndexDtfSetFeeRecipientsCall({
      address: DTF,
      version: "6.0.0",
      recipients: [{ recipient: ACCOUNT, portion: 1n }],
    });

    expect(
      decodeFunctionData({ abi: indexDtfV5WriteAbi, data: oldCall.calldata })
        .functionName,
    ).toBe("setFeeRecipients");
    expect(
      decodeFunctionData({ abi: indexDtfV6WriteAbi, data: latestCall.calldata })
        .functionName,
    ).toBe("setFeeRecipients");
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
