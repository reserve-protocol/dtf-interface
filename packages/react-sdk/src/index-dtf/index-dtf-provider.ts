import { createContext, createElement, useContext, useMemo, type PropsWithChildren } from "react";

import type { SupportedChainId } from "@reserve-protocol/sdk";
import type { Address } from "viem";

import { useFullIndexDtf } from "@/hooks";

export type IndexDtfIdentity = {
  readonly address: Address;
  readonly chainId: SupportedChainId;
};

export type IndexDtfProviderProps = PropsWithChildren<
  IndexDtfIdentity & {
    readonly prefetch?: boolean;
  }
>;

const IndexDtfContext = createContext<IndexDtfIdentity | undefined>(undefined);

export function IndexDtfProvider({ address, chainId, children, prefetch = false }: IndexDtfProviderProps) {
  const value = useMemo(() => ({ address, chainId }), [address, chainId]);

  return createElement(
    IndexDtfContext.Provider,
    { value },
    prefetch ? createElement(IndexDtfPrefetch) : null,
    children,
  );
}

export function useIndexDtfIdentity(): IndexDtfIdentity {
  const identity = useContext(IndexDtfContext);

  if (!identity) {
    throw new Error("useIndexDtfIdentity must be used inside IndexDtfProvider.");
  }

  return identity;
}

function IndexDtfPrefetch() {
  const identity = useIndexDtfIdentity();

  useFullIndexDtf({ ...identity, brand: true });

  return null;
}
