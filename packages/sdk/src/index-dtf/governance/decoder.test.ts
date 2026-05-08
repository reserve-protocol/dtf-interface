import { encodeFunctionData } from "viem";
import { describe, expect, it } from "vitest";
import { dtfIndexProposalAbiCatalog } from "../abis/dtf-index-proposal.js";
import { folioArtifactAbi } from "../abis/folio-artifact.js";
import { dtfIndexProposalAbi } from "../abis/proposal-decoder.js";
import { indexDtfV5WriteAbi } from "./propose/calls.js";
import { decodeIndexDtfProposalCalldatas } from "./decoder.js";

const DTF = "0x0000000000000000000000000000000000000001";

describe("Index DTF proposal calldata decoder", () => {
  it("keeps Index DTF decoder ABIs ordered latest to oldest", () => {
    expect(dtfIndexProposalAbiCatalog.map((entry) => entry.version)).toEqual([
      "6.0.0",
      "5.0.0",
      "4.0.0",
      "2.0.0",
      "1.0.0",
    ]);
  });

  it("decodes Index DTF proposal calldata across versions", () => {
    const oldAuctionLengthCalldata = encodeFunctionData({
      abi: indexDtfV5WriteAbi,
      functionName: "setAuctionLength",
      args: [1800n],
    });
    const latestAuctionLengthCalldata = encodeFunctionData({
      abi: folioArtifactAbi,
      functionName: "setMaxAuctionLength",
      args: [1800n],
    });

    const decoded = decodeIndexDtfProposalCalldatas({
      targets: [DTF, DTF],
      calldatas: [oldAuctionLengthCalldata, latestAuctionLengthCalldata],
      contractMap: new Map([
        [
          DTF.toLowerCase(),
          {
            target: DTF,
            contract: "Index DTF",
            abi: dtfIndexProposalAbi,
          },
        ],
      ]),
    });

    expect(decoded.calls.map((call) => call.functionName)).toEqual([
      "setAuctionLength",
      "setMaxAuctionLength",
    ]);
    expect(decoded.unknownCalls).toEqual([]);
  });
});
