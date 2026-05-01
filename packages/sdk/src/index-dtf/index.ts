import type { Address } from "viem";
import { getAddress } from "viem";
import type { DtfClient } from "../client.js";
import type {
  BlockNumber,
  BlockNumberParams,
  DtfParams,
} from "../types/common.js";
import type {
  GetAllIndexDtfProposalsParams,
  GetFullIndexDtfOptions,
  GetFullIndexDtfParams,
  GetIndexDtfBasketOptions,
  GetIndexDtfBasketParams,
  GetIndexDtfOptions,
  GetIndexDtfParams,
  GetIndexDtfPriceHistoryOptions,
  GetIndexDtfPriceHistoryParams,
  GetIndexDtfPriceParams,
  GetIndexDtfProposalParams,
  GetIndexDtfProposalsOptions,
  GetIndexDtfProposalsParams,
  GetIndexDtfRebalanceParams,
  GetIndexDtfRebalancesOptions,
  GetIndexDtfRebalancesParams,
  IndexDtf,
  IndexDtfBasket,
  IndexDtfBrand,
  IndexDtfFull,
  IndexDtfPrice,
  IndexDtfPricePoint,
  IndexDtfProposalDetail,
  IndexDtfProposalSummary,
  ListIndexDtfsParams,
} from "../types/index-dtf.js";
import { getAllIndexDtfProposals, listIndexDtfs } from "./all/index.js";
import {
  getFullIndexDtf,
  getIndexDtf,
  getIndexDtfBasket,
  getIndexDtfBrand,
  getIndexDtfPrice,
  getIndexDtfPriceHistory,
} from "./dtf/index.js";
import {
  getIndexDtfProposal,
  getIndexDtfProposals,
} from "./governance/index.js";
import {
  getIndexDtfRebalance,
  getIndexDtfRebalances,
} from "./rebalance/index.js";

export * from "./all/index.js";
export * from "./dtf/index.js";
export * from "./governance/index.js";
export * from "./rebalance/index.js";
export type * from "../types/index-dtf.js";

export type IndexDtfRef = {
  readonly address: Address;
  readonly chainId: DtfParams["chainId"];
  readonly get: (
    params?: GetIndexDtfOptions | BlockNumber,
  ) => Promise<IndexDtf>;
  readonly getFull: (params?: GetFullIndexDtfOptions) => Promise<IndexDtfFull>;
  readonly getBasket: (
    params?: GetIndexDtfBasketOptions,
  ) => Promise<IndexDtfBasket>;
  readonly basket: (
    params?: GetIndexDtfBasketOptions,
  ) => Promise<IndexDtfBasket>;
  readonly getBrand: () => Promise<IndexDtfBrand | undefined>;
  readonly getPrice: () => Promise<IndexDtfPrice>;
  readonly getPriceHistory: (
    params?: GetIndexDtfPriceHistoryOptions,
  ) => Promise<readonly IndexDtfPricePoint[]>;
  readonly proposals: (
    params?: GetIndexDtfProposalsOptions,
  ) => Promise<readonly IndexDtfProposalSummary[]>;
  readonly proposal: (
    params: Pick<GetIndexDtfProposalParams, "id">,
  ) => Promise<IndexDtfProposalDetail>;
  readonly rebalances: (
    params?: GetIndexDtfRebalancesOptions,
  ) => Promise<readonly unknown[]>;
  readonly rebalance: (
    params: Pick<GetIndexDtfRebalanceParams, "id">,
  ) => Promise<unknown>;
};

export function createIndexDtfRef(
  client: DtfClient,
  params: DtfParams,
): IndexDtfRef {
  const address = getAddress(params.address);
  const chainId = params.chainId;
  const resolveBlockNumber = (
    options: BlockNumber | BlockNumberParams | undefined,
  ) => (typeof options === "bigint" ? options : options?.blockNumber);
  const get = (options?: GetIndexDtfOptions | BlockNumber) => {
    const blockNumber = resolveBlockNumber(options);

    return getIndexDtf(client, {
      address,
      chainId,
      ...(blockNumber === undefined ? {} : { blockNumber }),
    });
  };
  const getBasket = (options?: GetIndexDtfBasketOptions) => {
    const blockNumber = resolveBlockNumber(options);

    return getIndexDtfBasket(client, {
      address,
      chainId,
      ...(blockNumber === undefined ? {} : { blockNumber }),
    });
  };

  return {
    address,
    chainId,
    get,
    getFull: (options = {}) =>
      getFullIndexDtf(client, { ...options, address, chainId }),
    getBasket,
    basket: getBasket,
    getBrand: () => getIndexDtfBrand(client, { address, chainId }),
    getPrice: () => getIndexDtfPrice(client, { address, chainId }),
    getPriceHistory: (options = {}) =>
      getIndexDtfPriceHistory(client, { ...options, address, chainId }),
    proposals: (options = {}) =>
      getIndexDtfProposals(client, { ...options, address, chainId }),
    proposal: ({ id }) => getIndexDtfProposal(client, { id, chainId }),
    rebalances: (options = {}) =>
      getIndexDtfRebalances(client, { ...options, address, chainId }),
    rebalance: ({ id }) => getIndexDtfRebalance(client, { id, chainId }),
  };
}

export function createIndexDtfNamespace(client: DtfClient) {
  return {
    ref: (params: DtfParams) => createIndexDtfRef(client, params),
    get: (params: GetIndexDtfParams) => getIndexDtf(client, params),
    list: (params?: ListIndexDtfsParams) => listIndexDtfs(client, params),
    getFull: (params: GetFullIndexDtfParams) => getFullIndexDtf(client, params),
    getBasket: (params: GetIndexDtfBasketParams) =>
      getIndexDtfBasket(client, params),
    getBrand: (params: DtfParams) => getIndexDtfBrand(client, params),
    getPrice: (params: GetIndexDtfPriceParams) =>
      getIndexDtfPrice(client, params),
    getPriceHistory: (params: GetIndexDtfPriceHistoryParams) =>
      getIndexDtfPriceHistory(client, params),
    proposals: (params: GetIndexDtfProposalsParams) =>
      getIndexDtfProposals(client, params),
    proposal: (params: GetIndexDtfProposalParams) =>
      getIndexDtfProposal(client, params),
    getAllProposals: (params: GetAllIndexDtfProposalsParams) =>
      getAllIndexDtfProposals(client, params),
    rebalances: (params: GetIndexDtfRebalancesParams) =>
      getIndexDtfRebalances(client, params),
    rebalance: (params: GetIndexDtfRebalanceParams) =>
      getIndexDtfRebalance(client, params),
  };
}
