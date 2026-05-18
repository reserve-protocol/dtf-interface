import type { Address } from "viem";

import type { SupportedChainId } from "@/config";

import { createDtfClient, type DtfClient, type DtfClientConfig } from "@/client";
import { createPortfolioNamespace } from "@/client/api/portfolio";
import { createIndexDtfNamespace } from "@/index-dtf/index";
import { SdkError } from "@/lib/errors";

export type DtfSdkConfig = DtfClientConfig & {
  readonly client?: DtfClient;
};

export type DtfSdk = {
  readonly client: DtfClient;
  readonly index: ReturnType<typeof createIndexDtfNamespace>;
  readonly portfolio: ReturnType<typeof createPortfolioNamespace>;
  readonly yield: {
    readonly get: (params: {
      readonly address: Address | string;
      readonly chainId: SupportedChainId;
    }) => Promise<never>;
    readonly list: (params?: { readonly chainId?: SupportedChainId }) => Promise<never>;
  };
};

export function createDtfSdk(config: DtfSdkConfig = {}): DtfSdk {
  const client = config.client ?? createDtfClient(config);
  const index = createIndexDtfNamespace(client);
  const portfolio = createPortfolioNamespace(client);

  return {
    client,
    index,
    portfolio,
    yield: {
      get: async () => {
        throw new SdkError({
          code: "NOT_IMPLEMENTED",
          message: "yield.get is not implemented yet.",
          meta: { method: "yield.get" },
        });
      },
      list: async () => {
        throw new SdkError({
          code: "NOT_IMPLEMENTED",
          message: "yield.list is not implemented yet.",
          meta: { method: "yield.list" },
        });
      },
    },
  };
}
