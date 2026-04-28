import type { Address } from "viem";
import {
  createDtfClient,
  type DtfClient,
  type DtfClientConfig,
} from "./client.js";
import type { SupportedChainId } from "./defaults.js";
import { createIndexNamespace } from "./index-dtf/index.js";

export type DtfSdkConfig = DtfClientConfig & {
  readonly client?: DtfClient | undefined;
};

export type DtfSdk = {
  readonly client: DtfClient;
  readonly index: ReturnType<typeof createIndexNamespace>;
  readonly yield: {
    readonly get: (params: {
      readonly address: Address | string;
      readonly chainId: SupportedChainId;
    }) => Promise<never>;
    readonly list: (params?: {
      readonly chainId?: SupportedChainId;
    }) => Promise<never>;
  };
};

export function createDtfSdk(config: DtfSdkConfig = {}): DtfSdk {
  const client = config.client ?? createDtfClient(config);
  const index = createIndexNamespace(client);

  return {
    client,
    index,
    yield: {
      get: async () => {
        throw new Error("yield.get is not implemented yet.");
      },
      list: async () => {
        throw new Error("yield.list is not implemented yet.");
      },
    },
  };
}
