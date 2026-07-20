import { createElement, type PropsWithChildren } from "react";

// @vitest-environment jsdom
import type { DtfSdk } from "@reserve-protocol/sdk";

import { getIndexDtfStatus } from "@reserve-protocol/sdk";
import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useIndexDtfStatus } from "@/index-dtf-extra-hooks";
import { DtfSdkProvider } from "@/provider";

// Real catalog entry: VTF on Base, deprecated.
const DEPRECATED_BASE = "0x47686106181b3cefe4eaf94c4c10b48ac750370b";

const sdk = { index: { getStatus: getIndexDtfStatus } } as unknown as DtfSdk;

function wrapper({ children }: PropsWithChildren) {
  return createElement(DtfSdkProvider, { sdk }, children);
}

describe("useIndexDtfStatus", () => {
  it("resolves catalog status synchronously", () => {
    const { result } = renderHook(() => useIndexDtfStatus({ address: DEPRECATED_BASE, chainId: 8453 }), { wrapper });

    expect(result.current).toBe("deprecated");
  });

  it("defaults to active without params", () => {
    const { result } = renderHook(() => useIndexDtfStatus(undefined), { wrapper });

    expect(result.current).toBe("active");
  });
});
