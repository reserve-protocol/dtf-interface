import { parseAbi } from "viem";
import { describe, expect, it } from "vitest";

import { prepareContractCall, prepareErc20Approval } from "@/lib/contract-call";

const SPENDER = "0x1111111111111111111111111111111111111111";
const TOKEN = "0x2222222222222222222222222222222222222222";

describe("prepareContractCall", () => {
  it("encodes exact calldata for an ERC20 approve", () => {
    const call = prepareErc20Approval({
      chainId: 1,
      token: TOKEN,
      spender: SPENDER,
      amount: 1_000_000n,
    });

    // approve(address,uint256) selector + padded spender + padded amount.
    expect(call.data).toBe(
      "0x095ea7b3" +
        "0000000000000000000000001111111111111111111111111111111111111111" +
        "00000000000000000000000000000000000000000000000000000000000f4240",
    );
    expect(call.to).toBe("0x2222222222222222222222222222222222222222");
    expect(call.value).toBe(0n);
    expect(call.contract.functionName).toBe("approve");
    expect(call.contract.args).toEqual([SPENDER, 1_000_000n]);
  });

  it("checksums lowercase addresses in to and contract.address", () => {
    const call = prepareErc20Approval({
      chainId: 1,
      token: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      spender: SPENDER,
      amount: 1n,
    });

    expect(call.to).toBe("0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48");
    expect(call.contract.address).toBe("0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48");
  });

  it("passes value through for payable functions and defaults to 0n", () => {
    const abi = parseAbi(["function depositEth() payable", "function poke()"]);

    const payable = prepareContractCall({
      chainId: 1,
      address: TOKEN,
      abi,
      functionName: "depositEth",
      args: [],
      value: 123n,
    });
    expect(payable.value).toBe(123n);

    const nonpayable = prepareContractCall({
      chainId: 1,
      address: TOKEN,
      abi,
      functionName: "poke",
      args: [],
    });
    expect(nonpayable.value).toBe(0n);
  });

  it("encodes argless functions as the bare selector", () => {
    const abi = parseAbi(["function poke()"]);

    const call = prepareContractCall({
      chainId: 1,
      address: TOKEN,
      abi,
      functionName: "poke",
      args: [],
    });

    // poke() selector only, no arg payload.
    expect(call.data).toBe("0x18178358");
    expect(call.data.length).toBe(10);
  });

  it("throws at runtime when args do not match the function signature", () => {
    const abi = parseAbi(["function transfer(address to, uint256 amount)"]);

    // Deliberately bypass the compile-time contract to prove viem still
    // rejects malformed args at runtime (the cast inside prepareContractCall
    // must not allow silent malformed calldata).
    expect(() =>
      prepareContractCall({
        chainId: 1,
        address: TOKEN,
        abi,
        functionName: "transfer",
        args: [SPENDER] as never,
      }),
    ).toThrow();
  });

  it("throws on invalid target addresses", () => {
    expect(() =>
      prepareErc20Approval({
        chainId: 1,
        token: "0xnot-an-address" as never,
        spender: SPENDER,
        amount: 1n,
      }),
    ).toThrow();
  });
});
