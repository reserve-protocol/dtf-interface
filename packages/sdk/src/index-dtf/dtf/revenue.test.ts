import { decodeFunctionData } from "viem";
import { describe, expect, it } from "vitest";

import type { IndexDtfPlatformFee } from "@/types/index-dtf";

import { dtfIndexAbi } from "@/index-dtf/abis/dtf-index-abi";
import { folioArtifactAbi } from "@/index-dtf/abis/folio-artifact";
import { getEffectiveRevenueDistribution, prepareIndexDtfDistributeFees } from "@/index-dtf/dtf/revenue";
import { SdkError } from "@/lib/errors";

const DTF = "0x0000000000000000000000000000000000000001";
const ZERO_SELF_FEE = { raw: 0n, formatted: "0" };

describe("prepareIndexDtfDistributeFees", () => {
  it("encodes distributeFees identically for 5.0.0 and 6.0.0 with the matching ABI", () => {
    const v5 = prepareIndexDtfDistributeFees({ address: DTF, chainId: 8453, version: "5.0.0" });
    const v6 = prepareIndexDtfDistributeFees({ address: DTF, chainId: 8453, version: "6.0.0" });

    expect(v6.data).toBe(v5.data);
    expect({ to: v5.to, chainId: v5.chainId, value: v5.value }).toEqual({ to: DTF, chainId: 8453, value: 0n });
    expect(decodeFunctionData({ abi: dtfIndexAbi, data: v5.data })).toEqual({
      functionName: "distributeFees",
      args: undefined,
    });
    expect(v5.contract.abi).toBe(dtfIndexAbi);
    expect(v6.contract.abi).toBe(folioArtifactAbi);
  });

  it("rejects versions the write contract does not admit", () => {
    const build = () =>
      prepareIndexDtfDistributeFees({ address: DTF, chainId: 8453, version: "4.0.0" as unknown as "5.0.0" });

    expect(build).toThrow(SdkError);
    expect(build).toThrow(expect.objectContaining({ code: "INVALID_INPUT", meta: { version: "4.0.0" } }));
  });

  it("splits a 6.0 fee: DAO first, then the self fee, then the mutable and immutable tables", () => {
    // DAO 50%, self fee 25%, mutable/immutable 60/40 → mutable 22.5%, immutable 15%, holders 12.5%.
    const platformFee: IndexDtfPlatformFee = {
      registry: DTF,
      recipient: DTF,
      numerator: 1n,
      denominator: 2n,
      floor: 0n,
      percent: 50,
    };
    const distribution = getEffectiveRevenueDistribution(
      {
        recipients: [{ address: DTF, percentage: "60" }],
        immutableRecipients: [{ address: "0x0000000000000000000000000000000000000002", percentage: "40" }],
        selfFee: { raw: 250_000_000_000_000_000n, formatted: "0.25" },
      },
      platformFee,
    );

    expect(distribution.platform.percentage).toBe("50");
    expect(distribution.holders.percentage).toBe("12.5");
    expect(distribution.recipients).toEqual([
      { address: DTF, configuredPercentage: "60", effectivePercentage: "22.5" },
      { address: "0x0000000000000000000000000000000000000002", configuredPercentage: "40", effectivePercentage: "15" },
    ]);
    const total = [
      distribution.platform.percentage,
      distribution.holders.percentage,
      ...distribution.recipients.map((recipient) => recipient.effectivePercentage),
    ].reduce((sum, percentage) => sum + Number(percentage), 0);
    expect(total).toBe(100);
  });

  it("gives the recipients' pool to the DAO when both tables are empty, as distributeFees does", () => {
    const platformFee: IndexDtfPlatformFee = {
      registry: DTF,
      recipient: DTF,
      numerator: 1n,
      denominator: 2n,
      floor: 0n,
      percent: 50,
    };
    const distribution = getEffectiveRevenueDistribution(
      { recipients: [], immutableRecipients: [], selfFee: { raw: 250_000_000_000_000_000n, formatted: "0.25" } },
      platformFee,
    );

    expect(distribution).toEqual({
      platform: { recipient: DTF, percentage: "87.5" },
      holders: { percentage: "12.5" },
      recipients: [],
    });
  });

  it("folds the 6.0 immutable table and self fee into the effective distribution", () => {
    const platformFee: IndexDtfPlatformFee = {
      registry: DTF,
      recipient: DTF,
      numerator: 1n,
      denominator: 10n,
      floor: 0n,
      percent: 10,
    };
    const v5 = getEffectiveRevenueDistribution(
      { recipients: [{ address: DTF, percentage: "100" }], immutableRecipients: [], selfFee: ZERO_SELF_FEE },
      platformFee,
    );
    expect(v5.holders.percentage).toBe("0");
    expect(v5.recipients).toEqual([{ address: DTF, configuredPercentage: "100", effectivePercentage: "90" }]);

    const v6 = getEffectiveRevenueDistribution(
      {
        recipients: [{ address: DTF, percentage: "60" }],
        immutableRecipients: [{ address: "0x0000000000000000000000000000000000000002", percentage: "40" }],
        selfFee: { raw: 50_000_000_000_000_000n, formatted: "0.05" },
      },
      platformFee,
    );
    expect(v6.platform.percentage).toBe("10");
    expect(v6.holders.percentage).toBe("4.5");
    expect(v6.recipients.map((recipient) => recipient.effectivePercentage)).toEqual(["51.3", "34.2"]);
  });
});
