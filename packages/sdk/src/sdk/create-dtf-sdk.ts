import { getAddress, type Address } from "viem";
import {
  createDtfClient,
  type DtfClient,
  type DtfClientConfig,
} from "../clients/create-dtf-client.js";
import type { SupportedChainId } from "../defaults.js";
import type { YieldDtfRef } from "../types/yield-dtf.js";
import {
  getAllProposals,
  getFullIndexDTF,
  getIndexDTF,
  getIndexDTFPrice,
  getIndexDTFPriceHistory,
  getProposal,
  getProposals,
  getRebalance,
  getRebalances,
  listIndexDTFs,
  type GetAllIndexDTFProposalsParams,
  type GetFullIndexDTFParams,
  type GetIndexDTFParams,
  type GetIndexDTFPriceHistoryParams,
  type GetIndexDTFPriceParams,
  type GetIndexDTFProposalParams,
  type GetIndexDTFProposalsParams,
  type GetIndexDTFRebalanceParams,
  type GetIndexDTFRebalancesParams,
  type IndexDTFRef,
  type ListIndexDTFsParams,
} from "./index/index.js";

export type RefInput = {
  readonly address: Address | string;
  readonly chainId: SupportedChainId;
};

export type DtfSdkConfig = DtfClientConfig & {
  readonly client?: DtfClient;
};

export type DtfSdk = {
  readonly client: DtfClient;
  readonly index: {
    readonly ref: (input: RefInput) => IndexDTFRef;
    readonly get: typeof getIndexDTF;
    readonly list: typeof listIndexDTFs;
    readonly getFull: typeof getFullIndexDTF;
    readonly getPrice: typeof getIndexDTFPrice;
    readonly getPriceHistory: typeof getIndexDTFPriceHistory;
    readonly getProposals: typeof getProposals;
    readonly getProposal: typeof getProposal;
    readonly getAllProposals: typeof getAllProposals;
    readonly getRebalances: typeof getRebalances;
    readonly getRebalance: typeof getRebalance;
  };
  readonly yield: {
    readonly ref: (input: RefInput) => YieldDtfRef;
    readonly get: (params: RefInput) => Promise<never>;
    readonly list: (params?: { readonly chainId?: SupportedChainId }) => Promise<never>;
  };
};

export function createDtfSdk(config: DtfSdkConfig = {}): DtfSdk {
  const client = config.client ?? createDtfClient(config);

  return {
    client,
    index: {
      ref: createRef,
      get: (params: GetIndexDTFParams) => getIndexDTF(params),
      list: (params?: ListIndexDTFsParams) => listIndexDTFs(params),
      getFull: (params: GetFullIndexDTFParams) => getFullIndexDTF(params),
      getPrice: (params: GetIndexDTFPriceParams) => getIndexDTFPrice(params),
      getPriceHistory: (params: GetIndexDTFPriceHistoryParams) =>
        getIndexDTFPriceHistory(params),
      getProposals: (params: GetIndexDTFProposalsParams) => getProposals(params),
      getProposal: (params: GetIndexDTFProposalParams) => getProposal(params),
      getAllProposals: (params: GetAllIndexDTFProposalsParams) =>
        getAllProposals(params),
      getRebalances: (params: GetIndexDTFRebalancesParams) =>
        getRebalances(params),
      getRebalance: (params: GetIndexDTFRebalanceParams) => getRebalance(params),
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
