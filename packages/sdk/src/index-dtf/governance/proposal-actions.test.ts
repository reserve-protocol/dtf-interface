import { describe, expect, it, vi } from "vitest";
import {
  bytesToHex,
  encodeAbiParameters,
  hexToBytes,
  keccak256,
  pad,
  parseAbiParameters,
  toBytes,
  zeroHash,
} from "viem";
import {
  writeProposal,
  writeProposalCancel,
  writeProposalQueue,
  writeProposalVote,
} from "./proposal-actions.js";

const account = "0x0000000000000000000000000000000000000009";
const timelockOperationParams = parseAbiParameters(
  "address[], uint256[], bytes[], bytes32, bytes32",
);

describe("Index DTF proposal actions", () => {
  it("writes propose transactions from a built proposal payload", async () => {
    const writeContract = vi.fn(async () => "0xabc");
    const walletClient = { writeContract } as never;

    await writeProposal(walletClient, {
      account,
      chainId: 1,
      proposal: {
        governance: "0x0000000000000000000000000000000000000001",
        targets: ["0x0000000000000000000000000000000000000003"],
        calldatas: ["0x1234"],
        description: "Proposal description",
      },
    });

    expect(writeContract).toHaveBeenCalledWith({
      chain: expect.objectContaining({ id: 1 }),
      account,
      address: "0x0000000000000000000000000000000000000001",
      abi: expect.anything(),
      functionName: "propose",
      args: [
        ["0x0000000000000000000000000000000000000003"],
        [0n],
        ["0x1234"],
        "Proposal description",
      ],
    });
  });

  it("writes proposal queue and cancel transactions with required timelock", async () => {
    const writeContract = vi.fn(async () => "0xabc");
    const walletClient = { writeContract } as never;
    const proposal = {
      governance: "0x0000000000000000000000000000000000000001",
      timelock: "0x0000000000000000000000000000000000000006",
      timelockId:
        "0x0000000000000000000000000000000000000000000000000000000000000042",
      targets: ["0x0000000000000000000000000000000000000003"],
      calldatas: ["0x1234"],
      description: "Proposal description",
    } as const;

    await writeProposalQueue(walletClient, { account, chainId: 1, proposal });
    await writeProposalCancel(walletClient, { account, chainId: 1, proposal });

    expect(writeContract).toHaveBeenNthCalledWith(1, {
      chain: expect.objectContaining({ id: 1 }),
      account,
      address: "0x0000000000000000000000000000000000000001",
      abi: expect.anything(),
      functionName: "queue",
      args: [
        ["0x0000000000000000000000000000000000000003"],
        [0n],
        ["0x1234"],
        keccak256(toBytes("Proposal description")),
      ],
    });
    expect(writeContract).toHaveBeenNthCalledWith(2, {
      chain: expect.objectContaining({ id: 1 }),
      account,
      address: "0x0000000000000000000000000000000000000006",
      abi: expect.anything(),
      functionName: "cancel",
      args: [
        "0x0000000000000000000000000000000000000000000000000000000000000042",
      ],
    });
  });

  it("rejects writes without a supported chain", async () => {
    const writeContract = vi.fn(async () => "0xabc");
    const walletClient = { writeContract } as never;

    await expect(
      writeProposalVote(walletClient, {
        account,
        chainId: 999 as never,
        governance: "0x0000000000000000000000000000000000000001",
        proposalId: "1",
        support: 1,
      }),
    ).rejects.toMatchObject({
      code: "UNSUPPORTED_CHAIN",
    });
    expect(writeContract).not.toHaveBeenCalled();
  });

  it("derives a timelock operation id when legacy proposals lack one", async () => {
    const writeContract = vi.fn(async () => "0xabc");
    const walletClient = { writeContract } as never;
    const proposal = {
      governance: "0x0000000000000000000000000000000000000001",
      timelock: "0x0000000000000000000000000000000000000006",
      targets: [
        "0x0000000000000000000000000000000000000003",
        "0x0000000000000000000000000000000000000004",
      ],
      calldatas: ["0x1234", "0x5678"],
      description: "Legacy proposal",
    } as const;

    await writeProposalCancel(walletClient, {
      account,
      chainId: 1,
      proposal,
    });

    expect(writeContract).toHaveBeenCalledWith(
      expect.objectContaining({
        functionName: "cancel",
        args: [getLegacyOperationId(proposal)],
      }),
    );
  });
});

function getLegacyOperationId(proposal: {
  readonly governance: `0x${string}`;
  readonly targets: readonly `0x${string}`[];
  readonly calldatas: readonly `0x${string}`[];
  readonly description: string;
}) {
  return keccak256(
    encodeAbiParameters(timelockOperationParams, [
      proposal.targets,
      [0n, 0n],
      proposal.calldatas,
      zeroHash,
      getTimelockSalt(proposal.governance, proposal.description),
    ]),
  );
}

function getTimelockSalt(governance: `0x${string}`, description: string) {
  const governorBytes = hexToBytes(
    pad(governance.toLowerCase() as `0x${string}`, {
      size: 32,
      dir: "right",
    }),
  );
  const descriptionHashBytes = hexToBytes(keccak256(toBytes(description)));
  const saltBytes = new Uint8Array(32);

  for (let i = 0; i < saltBytes.length; i++) {
    saltBytes[i] = governorBytes[i]! ^ descriptionHashBytes[i]!;
  }

  return bytesToHex(saltBytes);
}
