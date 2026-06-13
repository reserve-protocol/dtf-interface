import { createDtfClient, type DtfClient, type DtfClientConfig } from "@/client";
import { createPortfolioNamespace } from "@/client/api/portfolio";
import { createIndexDtfNamespace } from "@/index-dtf/index";
import { createYieldDtfNamespace } from "@/yield-dtf/namespace";

export type DtfSdkConfig = DtfClientConfig & {
  readonly client?: DtfClient;
};

export type DtfSdk = {
  readonly client: DtfClient;
  readonly index: ReturnType<typeof createIndexDtfNamespace>;
  readonly portfolio: ReturnType<typeof createPortfolioNamespace>;
  readonly yield: ReturnType<typeof createYieldDtfNamespace>;
};

export function createDtfSdk(config: DtfSdkConfig = {}): DtfSdk {
  const client = config.client ?? createDtfClient(config);

  return {
    client,
    index: createIndexDtfNamespace(client),
    portfolio: createPortfolioNamespace(client),
    yield: createYieldDtfNamespace(client),
  };
}
