import type { Address, WalletClient } from "viem";
import { getAddress } from "viem";
import type { DtfClient } from "../client.js";
import type {
  BlockNumber,
  BlockNumberParams,
  DtfParams,
} from "../types/common.js";
import type {
  GetFullIndexDtfOptions,
  GetFullIndexDtfParams,
  GetIndexDtfBasketOptions,
  GetIndexDtfBasketParams,
  GetIndexDtfOptions,
  GetIndexDtfParams,
  GetIndexDtfPriceHistoryOptions,
  GetIndexDtfPriceHistoryParams,
  GetIndexDtfPriceParams,
  GetIndexDtfRebalanceParams,
  GetIndexDtfRebalancesOptions,
  GetIndexDtfRebalancesParams,
  GetIndexDtfTotalAssetsParams,
  GetIndexDtfTotalSupplyParams,
  GetIndexDtfVersionParams,
  IndexDtf,
  IndexDtfBasket,
  IndexDtfBrand,
  IndexDtfFull,
  IndexDtfPrice,
  IndexDtfPricePoint,
  IndexDtfTotalAssets,
} from "../types/index-dtf.js";
import type {
  GetIndexDtfDelegatesParams,
  GetIndexDtfGuardiansParams,
  GetAllIndexDtfProposalsParams,
  GetIndexDtfProposalParams,
  GetIndexDtfProposalVoterStateParams,
  GetIndexDtfProposalVotesParams,
  GetIndexDtfProposalsOptions,
  GetIndexDtfProposalsParams,
  GetIndexDtfProposerStateParams,
  GetIndexDtfVoterStateParams,
  IndexDtfDelegate,
  IndexDtfGovernanceWriter,
  IndexDtfGuardians,
  IndexDtfProposalDetail,
  IndexDtfProposalSummary,
  IndexDtfProposalVoterState,
  IndexDtfProposalVotes,
  IndexDtfProposerState,
  IndexDtfVoterState,
} from "../types/governance.js";
import type { ListIndexDtfsParams } from "../types/protocol.js";
import type {
  BuildIndexDtfBasketProposalParams,
  BuiltIndexDtfBasketProposal,
  BuildIndexDtfBasketSettingsProposalParams,
  BuildIndexDtfDaoSettingsProposalParams,
  BuildIndexDtfSettingsProposalParams,
  BuiltIndexDtfProposal,
} from "./governance/propose/index.js";
import { listIndexDtfs } from "./protocol/index.js";
import {
  getFullIndexDtf,
  getIndexDtf,
  getIndexDtfBasket,
  getIndexDtfBrand,
  getIndexDtfPrice,
  getIndexDtfPriceHistory,
  getIndexDtfTotalAssets,
  getIndexDtfTotalSupply,
  getIndexDtfVersion,
} from "./dtf/index.js";
import {
  getIndexDtfDelegates,
  getAllIndexDtfProposals,
  getIndexDtfGuardians,
  getIndexDtfProposal,
  getIndexDtfProposalVoterState,
  getIndexDtfProposalVotes,
  getIndexDtfProposals,
  getIndexDtfProposerState,
  getIndexDtfVoterState,
  createIndexDtfRefGovernanceWriter,
} from "./governance/index.js";
import {
  getIndexDtfRebalance,
  getIndexDtfRebalances,
} from "./rebalance/index.js";
import {
  buildIndexDtfBasketProposal,
  buildIndexDtfBasketSettingsProposal,
  buildIndexDtfDaoSettingsProposal,
  buildIndexDtfSettingsProposal,
} from "./governance/propose/index.js";

export {
  buildIndexDtfBasket,
  buildIndexDtfTargetBasket,
  indexDtfBasketSchema,
  indexDtfBasketSharesSchema,
  indexDtfBasketTokenSchema,
  indexDtfBasketUnitsSchema,
} from "./dtf/basket/index.js";
export {
  getFullIndexDtf,
  getIndexDtf,
  getIndexDtfBasket,
  getIndexDtfBasketWithPrice,
  getIndexDtfBrand,
  getIndexDtfPrice,
  getIndexDtfPriceHistory,
  getIndexDtfTotalAssets,
  getIndexDtfTotalSupply,
  getIndexDtfVersion,
} from "./dtf/index.js";
export { getIndexDtfDelegates } from "./governance/delegates.js";
export { writeAccountDelegate } from "./governance/delegation-actions.js";
export { getIndexDtfGuardians } from "./governance/guardians.js";
export {
  writeProposal,
  writeProposalCancel,
  writeProposalExecute,
  writeProposalQueue,
  writeProposalVote,
} from "./governance/proposal-actions.js";
export {
  getAllIndexDtfProposals,
  getIndexDtfProposal,
  getIndexDtfProposals,
} from "./governance/proposals.js";
export {
  buildIndexDtfBasketProposal,
  buildIndexDtfBasketSettingsProposal,
  buildIndexDtfDaoSettingsProposal,
  buildIndexDtfSettingsProposal,
  indexDtfBasketProposalSchema,
  indexDtfBasketProposalTokenSchema,
  indexDtfBasketSettingsProposalSchema,
  indexDtfBasketSharesProposalSchema,
  indexDtfBasketUnitsProposalSchema,
  indexDtfDaoSettingsProposalSchema,
  indexDtfGovernanceChangesSchema,
  indexDtfSettingsProposalSchema,
} from "./governance/propose/index.js";
export { getIndexDtfProposalGovernanceAddresses } from "./governance/utils.js";
export {
  getIndexDtfProposalVoterState,
  getIndexDtfProposalVotes,
  getIndexDtfProposerState,
  getIndexDtfVoterState,
} from "./governance/voting.js";
export { listIndexDtfs } from "./protocol/index.js";
export {
  getIndexDtfRebalance,
  getIndexDtfRebalances,
} from "./rebalance/index.js";

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
  readonly version: (
    params?: BlockNumberParams | BlockNumber,
  ) => Promise<string>;
  readonly totalSupply: (
    params?: BlockNumberParams | BlockNumber,
  ) => Promise<bigint>;
  readonly totalAssets: (
    params?: BlockNumberParams | BlockNumber,
  ) => Promise<IndexDtfTotalAssets>;
  readonly getBrand: () => Promise<IndexDtfBrand | undefined>;
  readonly getPrice: () => Promise<IndexDtfPrice>;
  readonly getPriceHistory: (
    params?: GetIndexDtfPriceHistoryOptions,
  ) => Promise<readonly IndexDtfPricePoint[]>;
  readonly proposals: (
    params?: GetIndexDtfProposalsOptions,
  ) => Promise<readonly IndexDtfProposalSummary[]>;
  readonly proposal: (proposalId: string) => Promise<IndexDtfProposalDetail>;
  readonly delegates: (
    params: Pick<GetIndexDtfDelegatesParams, "stToken" | "limit">,
  ) => Promise<readonly IndexDtfDelegate[]>;
  readonly guardians: () => Promise<IndexDtfGuardians>;
  readonly voterState: (
    params: Pick<GetIndexDtfVoterStateParams, "account" | "stToken">,
  ) => Promise<IndexDtfVoterState>;
  readonly proposerState: (
    params: Pick<
      GetIndexDtfProposerStateParams,
      "account" | "governance" | "timepoint"
    >,
  ) => Promise<IndexDtfProposerState>;
  readonly proposalVotes: (
    params: Pick<GetIndexDtfProposalVotesParams, "governance" | "proposalId">,
  ) => Promise<IndexDtfProposalVotes>;
  readonly proposalVoterState: (
    params: Pick<
      GetIndexDtfProposalVoterStateParams,
      "account" | "governance" | "proposal"
    >,
  ) => Promise<IndexDtfProposalVoterState>;
  readonly buildBasketProposal: (
    params: Omit<BuildIndexDtfBasketProposalParams, "address" | "chainId">,
  ) => Promise<BuiltIndexDtfBasketProposal>;
  readonly buildBasketSettingsProposal: (
    params: Omit<
      BuildIndexDtfBasketSettingsProposalParams,
      "address" | "chainId"
    >,
  ) => Promise<BuiltIndexDtfProposal>;
  readonly buildDaoSettingsProposal: (
    params: Omit<BuildIndexDtfDaoSettingsProposalParams, "address" | "chainId">,
  ) => Promise<BuiltIndexDtfProposal>;
  readonly buildSettingsProposal: (
    params: Omit<BuildIndexDtfSettingsProposalParams, "address" | "chainId">,
  ) => Promise<BuiltIndexDtfProposal>;
  readonly write: (walletClient: WalletClient) => IndexDtfGovernanceWriter;
  readonly rebalances: (
    params?: GetIndexDtfRebalancesOptions,
  ) => Promise<readonly unknown[]>;
  readonly rebalance: (
    id: GetIndexDtfRebalanceParams["id"],
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
  const version = (options?: BlockNumberParams | BlockNumber) => {
    const blockNumber = resolveBlockNumber(options);

    return getIndexDtfVersion(client, {
      address,
      chainId,
      ...(blockNumber === undefined ? {} : { blockNumber }),
    });
  };
  const totalSupply = (options?: BlockNumberParams | BlockNumber) => {
    const blockNumber = resolveBlockNumber(options);

    return getIndexDtfTotalSupply(client, {
      address,
      chainId,
      ...(blockNumber === undefined ? {} : { blockNumber }),
    });
  };
  const totalAssets = (options?: BlockNumberParams | BlockNumber) => {
    const blockNumber = resolveBlockNumber(options);

    return getIndexDtfTotalAssets(client, {
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
    version,
    totalSupply,
    totalAssets,
    getBrand: () => getIndexDtfBrand(client, { address, chainId }),
    getPrice: () => getIndexDtfPrice(client, { address, chainId }),
    getPriceHistory: (options = {}) =>
      getIndexDtfPriceHistory(client, { ...options, address, chainId }),
    proposals: (options = {}) =>
      getIndexDtfProposals(client, { ...options, address, chainId }),
    proposal: (proposalId) =>
      getIndexDtfProposal(client, { proposalId, address, chainId }),
    delegates: (options) =>
      getIndexDtfDelegates(client, { ...options, chainId }),
    guardians: () => getIndexDtfGuardians(client, { address, chainId }),
    voterState: (params) =>
      getIndexDtfVoterState(client, { ...params, chainId }),
    proposerState: (params) =>
      getIndexDtfProposerState(client, { ...params, chainId }),
    proposalVotes: (params) =>
      getIndexDtfProposalVotes(client, { ...params, chainId }),
    proposalVoterState: (params) =>
      getIndexDtfProposalVoterState(client, { ...params, chainId }),
    buildBasketProposal: (params) =>
      buildIndexDtfBasketProposal(client, { ...params, address, chainId }),
    buildBasketSettingsProposal: (params) =>
      buildIndexDtfBasketSettingsProposal(client, {
        ...params,
        address,
        chainId,
      }),
    buildDaoSettingsProposal: (params) =>
      buildIndexDtfDaoSettingsProposal(client, { ...params, address, chainId }),
    buildSettingsProposal: (params) =>
      buildIndexDtfSettingsProposal(client, { ...params, address, chainId }),
    write: (walletClient) =>
      createIndexDtfRefGovernanceWriter(walletClient, chainId),
    rebalances: (options = {}) =>
      getIndexDtfRebalances(client, { ...options, address, chainId }),
    rebalance: (id) => getIndexDtfRebalance(client, { id, chainId }),
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
    version: (params: GetIndexDtfVersionParams) =>
      getIndexDtfVersion(client, params),
    totalSupply: (params: GetIndexDtfTotalSupplyParams) =>
      getIndexDtfTotalSupply(client, params),
    totalAssets: (params: GetIndexDtfTotalAssetsParams) =>
      getIndexDtfTotalAssets(client, params),
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
    delegates: (params: GetIndexDtfDelegatesParams) =>
      getIndexDtfDelegates(client, params),
    guardians: (params: GetIndexDtfGuardiansParams) =>
      getIndexDtfGuardians(client, params),
    voterState: (params: GetIndexDtfVoterStateParams) =>
      getIndexDtfVoterState(client, params),
    proposerState: (params: GetIndexDtfProposerStateParams) =>
      getIndexDtfProposerState(client, params),
    proposalVotes: (params: GetIndexDtfProposalVotesParams) =>
      getIndexDtfProposalVotes(client, params),
    proposalVoterState: (params: GetIndexDtfProposalVoterStateParams) =>
      getIndexDtfProposalVoterState(client, params),
    buildBasketProposal: (params: BuildIndexDtfBasketProposalParams) =>
      buildIndexDtfBasketProposal(client, params),
    buildBasketSettingsProposal: (
      params: BuildIndexDtfBasketSettingsProposalParams,
    ) => buildIndexDtfBasketSettingsProposal(client, params),
    buildDaoSettingsProposal: (
      params: BuildIndexDtfDaoSettingsProposalParams,
    ) => buildIndexDtfDaoSettingsProposal(client, params),
    buildSettingsProposal: (params: BuildIndexDtfSettingsProposalParams) =>
      buildIndexDtfSettingsProposal(client, params),
    rebalances: (params: GetIndexDtfRebalancesParams) =>
      getIndexDtfRebalances(client, params),
    rebalance: (params: GetIndexDtfRebalanceParams) =>
      getIndexDtfRebalance(client, params),
  };
}
