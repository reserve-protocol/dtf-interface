import { getAddress, parseEther, type Address } from "viem";
import { describe, expect, it } from "vitest";

import {
  assertIndexDtfFeeRecipientTables,
  scaleIndexDtfFeeRecipients,
  sortIndexDtfFeeRecipients,
} from "@/index-dtf/fee-recipients";
import { SdkError } from "@/lib/errors";

const LOW: Address = "0x0000000000000000000000000000000000000002";
const MID: Address = "0x00000000000000000000000000000000000000aa";
const HIGH: Address = "0x00000000000000000000000000000000000000B0";

describe("Folio fee recipient tables", () => {
  it("sorts numerically by address, not lexically", () => {
    const sorted = sortIndexDtfFeeRecipients([
      { recipient: HIGH, portion: 1n },
      { recipient: MID.toLowerCase() as Address, portion: 2n },
      { recipient: LOW, portion: 3n },
    ]);

    expect(sorted.map((entry) => entry.recipient)).toEqual([LOW, MID, HIGH].map((address) => getAddress(address)));
  });

  it("scales a 100% table to a remainder and puts the residual on the last entry", () => {
    const scaled = scaleIndexDtfFeeRecipients(
      [
        { recipient: LOW, portion: parseEther("0.333333333333333333") },
        { recipient: MID, portion: parseEther("0.333333333333333333") },
        { recipient: HIGH, portion: parseEther("0.333333333333333334") },
      ],
      parseEther("0.7"),
    );

    expect(scaled.reduce((sum, entry) => sum + entry.portion, 0n)).toBe(parseEther("0.7"));
    expect(scaled[0]?.portion).toBe(233_333_333_333_333_333n);
    expect(scaleIndexDtfFeeRecipients([], parseEther("0.7"))).toEqual([]);
  });

  it("rejects a table that does not total 100% before scaling", () => {
    expect(() =>
      scaleIndexDtfFeeRecipients([{ recipient: LOW, portion: parseEther("0.5") }], parseEther("0.7")),
    ).toThrow(expect.objectContaining({ code: "INVALID_INPUT" }));
  });

  it("rejects the Folio itself, the zero address and more than 64 entries", () => {
    expect(() =>
      assertIndexDtfFeeRecipientTables({
        recipients: [
          { recipient: LOW, portion: parseEther("0.5") },
          { recipient: HIGH, portion: parseEther("0.5") },
        ],
        immutableRecipients: [],
        folio: HIGH,
      }),
    ).toThrow("not the Folio itself");
    expect(() =>
      assertIndexDtfFeeRecipientTables({
        recipients: [{ recipient: "0x0000000000000000000000000000000000000000", portion: parseEther("1") }],
        immutableRecipients: [],
      }),
    ).toThrow(expect.objectContaining({ code: "INVALID_INPUT" }));
    const many = Array.from({ length: 65 }, (_, index) => ({
      recipient: getAddress(`0x${(index + 1).toString(16).padStart(40, "0")}`),
      portion: 1n,
    }));
    expect(() => assertIndexDtfFeeRecipientTables({ recipients: many, immutableRecipients: [] })).toThrow(
      "cannot exceed 64",
    );
  });

  it("accepts sorted tables that total 100% and empty tables", () => {
    expect(() =>
      assertIndexDtfFeeRecipientTables({
        recipients: [{ recipient: LOW, portion: parseEther("0.6") }],
        immutableRecipients: [{ recipient: HIGH, portion: parseEther("0.4") }],
      }),
    ).not.toThrow();
    expect(() => assertIndexDtfFeeRecipientTables({ recipients: [], immutableRecipients: [] })).not.toThrow();
  });

  it("rejects unsorted, zero-portion and mis-totalled tables with INVALID_INPUT", () => {
    const cases = [
      {
        recipients: [
          { recipient: HIGH, portion: 1n },
          { recipient: LOW, portion: parseEther("1") - 1n },
        ],
        immutableRecipients: [],
      },
      {
        recipients: [
          { recipient: LOW, portion: 0n },
          { recipient: HIGH, portion: parseEther("1") },
        ],
        immutableRecipients: [],
      },
      {
        recipients: [{ recipient: LOW, portion: parseEther("0.5") }],
        immutableRecipients: [{ recipient: HIGH, portion: parseEther("0.4") }],
      },
    ];

    for (const tables of cases) {
      expect(() => assertIndexDtfFeeRecipientTables(tables)).toThrow(SdkError);
      expect(() => assertIndexDtfFeeRecipientTables(tables)).toThrow(
        expect.objectContaining({ code: "INVALID_INPUT" }),
      );
    }
  });
});
