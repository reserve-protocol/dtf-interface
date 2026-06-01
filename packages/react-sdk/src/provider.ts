import { createContext, createElement, useContext, useMemo, type PropsWithChildren } from "react";

import { createDtfSdk, type DtfSdk, type DtfSdkConfig } from "@reserve-protocol/sdk";

export type DtfSdkProviderProps = PropsWithChildren<
  DtfSdkConfig & {
    readonly sdk?: DtfSdk;
  }
>;

const DtfSdkContext = createContext<DtfSdk | undefined>(undefined);

export function DtfSdkProvider({ apiBaseUrl, chains, children, client, etherscanApiKey, sdk }: DtfSdkProviderProps) {
  const value = useMemo(() => {
    if (sdk) {
      return sdk;
    }

    return createDtfSdk({
      ...(apiBaseUrl ? { apiBaseUrl } : {}),
      ...(chains ? { chains } : {}),
      ...(client ? { client } : {}),
      ...(etherscanApiKey ? { etherscanApiKey } : {}),
    });
  }, [apiBaseUrl, chains, client, etherscanApiKey, sdk]);

  return createElement(DtfSdkContext.Provider, { value }, children);
}

export function useDtfSdk(): DtfSdk {
  const sdk = useContext(DtfSdkContext);

  if (!sdk) {
    throw new Error("useDtfSdk must be used inside DtfSdkProvider.");
  }

  return sdk;
}
