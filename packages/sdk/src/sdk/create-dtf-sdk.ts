import { getAddress, type Address } from "viem";
import {
  createDtfClient,
  type DtfClient,
  type DtfClientConfig,
} from "../clients/create-dtf-client.js";
import type { SupportedChainId } from "../defaults.js";
import type { YieldDtfRef } from "../types/yield-dtf.js";
import { createIndexNamespace } from "./index/index.js";
import { type IndexDTFRef } from "../types/index-dtf.js";

export type RefInput = {
  readonly address: Address | string;
  readonly chainId: SupportedChainId;
};

export type DtfSdkConfig = DtfClientConfig & {
  readonly client?: DtfClient | undefined;
};

export type DtfSdk = {
  readonly client: DtfClient;
  readonly index: ReturnType<typeof createIndexNamespace> & {
    readonly ref: (input: RefInput) => IndexDTFRef;
  };
  readonly yield: {
    readonly ref: (input: RefInput) => YieldDtfRef;
    readonly get: (params: RefInput) => Promise<never>;
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
    index: {
      ...index,
      ref: createRef,
    },
    yield: {
      ref: createRef,
      get: async () => {
        throw new Error("yield.get is not implemented yet.");
      },
      list: async () => {
        throw new Error("yield.list is not implemented yet.");
      },
    },
  };
}

function createRef({ address, chainId }: RefInput): {
  readonly address: `0x${string}`;
  readonly chainId: SupportedChainId;
} {
  return {
    address: getAddress(address),
    chainId,
  };
}
