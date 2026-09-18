import { decodeFunctionData } from "viem";
import { describe, expect, it } from "vitest";

import { dtfIndexAbi } from "@/index-dtf/abis/dtf-index-abi";
import { folioArtifactAbi } from "@/index-dtf/abis/folio-artifact";
import { prepareIndexDtfDistributeFees } from "@/index-dtf/dtf/revenue";
import { SdkError } from "@/lib/errors";

const DTF = "0x0000000000000000000000000000000000000001";

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
});
