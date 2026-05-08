import type { Address, WalletClient } from "viem";
import { getAddress } from "viem";
import type { DtfClient } from "../client.js";
import type { BlockNumber, DtfParams } from "../types/common.js";
import type {
  GetFullIndexDtfOptions,
  GetFullIndexDtfParams,
  GetIndexDtfBasketOptions,
  GetIndexDtfBasketParams,
  GetIndexDtfBasketSnapshotOptions,
  GetIndexDtfBasketSnapshotParams,
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
  IndexDtfBasketSnapshot,
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
  getBasket as readBasket,
  getBasketSnapshot as readBasketSnapshot,
  getBrand as readBrand,
  getDtf as readDtf,
  getFull as readFull,
  getPrice as readPrice,
  getPriceHistory as readPriceHistory,
  getTotalAssets as readTotalAssets,
  getTotalSupply as readTotalSupply,
  getVersion as readVersion,
} from "./dtf/index.js";
import {
  createIndexDtfRefGovernanceWriter,
  getAllProposals,
  getDelegates,
  getGuardians,
  getProposal,
  getProposalVoterState,
  getProposalVotes,
  getProposals,
  getProposerState,
  getVoterState,
} from "./governance/index.js";
import { getRebalance, getRebalances } from "./rebalance/index.js";
import {
  buildIndexDtfBasketProposal,
  buildIndexDtfBasketSettingsProposal,
  buildIndexDtfDaoSettingsProposal,
  buildIndexDtfSettingsProposal,
} from "./governance/propose/index.js";

export {
  buildIndexDtfStartRebalance,
  buildInitialBasket as buildIndexDtfInitialBasket,
  buildStartRebalanceArgs as buildIndexDtfStartRebalanceArgs,
  getBasketSharesFromUnits as getIndexDtfBasketSharesFromUnits,
  getBasketUnitsFromShares as getIndexDtfBasketUnitsFromShares,
  getDtfPriceFromBalances as getIndexDtfPriceFromBalances,
  indexDtfBasketSchema,
  indexDtfBasketSharesSchema,
  indexDtfBasketTokenSchema,
  indexDtfBasketUnitsSchema,
} from "./dtf/basket-utils.js";
export {
  getDtf,
  getBasket as getIndexDtfBasket,
  getBasketSnapshot as getIndexDtfBasketSnapshot,
  getBasketWithPrice as getIndexDtfBasketWithPrice,
  getBrand as getIndexDtfBrand,
  getFull as getIndexDtf,
  getFull as getFullIndexDtf,
  getMandate as getIndexDtfMandate,
  getPrice as getIndexDtfPrice,
  getPriceHistory as getIndexDtfPriceHistory,
  getTotalAssets as getIndexDtfTotalAssets,
  getTotalSupply as getIndexDtfTotalSupply,
  getVersion as getIndexDtfVersion,
} from "./dtf/index.js";
export { getDelegates as getIndexDtfDelegates } from "./governance/delegates.js";
export { delegate as delegateIndexDtfVotes } from "./governance/delegation-actions.js";
export { getGuardians as getIndexDtfGuardians } from "./governance/guardians.js";
export {
  cancel as cancelIndexDtfProposal,
  execute as executeIndexDtfProposal,
  propose as proposeIndexDtfProposal,
  queue as queueIndexDtfProposal,
  vote as voteIndexDtfProposal,
} from "./governance/proposal-actions.js";
export {
  getAllProposals as getAllIndexDtfProposals,
  getProposal as getIndexDtfProposal,
  getProposals as getIndexDtfProposals,
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
export { getProposalGovernanceAddresses as getIndexDtfProposalGovernanceAddresses } from "./governance/utils.js";
export {
  getProposalVoterState as getIndexDtfProposalVoterState,
  getProposalVotes as getIndexDtfProposalVotes,
  getProposerState as getIndexDtfProposerState,
  getVoterState as getIndexDtfVoterState,
} from "./governance/voting.js";
export { listIndexDtfs } from "./protocol/index.js";
export {
  getRebalance as getIndexDtfRebalance,
  getRebalances as getIndexDtfRebalances,
} from "./rebalance/index.js";

type BlockNumberOption = Pick<DtfParams, "blockNumber">;

export type IndexDtfRef = {
  readonly address: Address;
  readonly chainId: DtfParams["chainId"];
  readonly get: (params?: GetIndexDtfOptions) => Promise<IndexDtfFull>;
  readonly getDtf: (
    params?: BlockNumberOption | BlockNumber,
  ) => Promise<IndexDtf>;
  readonly getFull: (params?: GetFullIndexDtfOptions) => Promise<IndexDtfFull>;
  readonly getBasket: (
    params?: GetIndexDtfBasketOptions,
  ) => Promise<IndexDtfBasket>;
  readonly getBasketSnapshot: (
    params?: GetIndexDtfBasketSnapshotOptions,
  ) => Promise<IndexDtfBasketSnapshot>;
  readonly getVersion: (
    params?: BlockNumberOption | BlockNumber,
  ) => Promise<string>;
  readonly getTotalSupply: (
    params?: BlockNumberOption | BlockNumber,
  ) => Promise<bigint>;
  readonly getTotalAssets: (
    params?: BlockNumberOption | BlockNumber,
  ) => Promise<IndexDtfTotalAssets>;
  readonly getBrand: () => Promise<IndexDtfBrand | undefined>;
  readonly getPrice: () => Promise<IndexDtfPrice>;
  readonly getPriceHistory: (
    params: GetIndexDtfPriceHistoryOptions,
  ) => Promise<readonly IndexDtfPricePoint[]>;
  readonly getProposals: (
    params?: GetIndexDtfProposalsOptions,
  ) => Promise<readonly IndexDtfProposalSummary[]>;
  readonly getProposal: (proposalId: string) => Promise<IndexDtfProposalDetail>;
  readonly getDelegates: (
    params: Pick<GetIndexDtfDelegatesParams, "stToken" | "limit">,
  ) => Promise<readonly IndexDtfDelegate[]>;
  readonly getGuardians: () => Promise<IndexDtfGuardians>;
  readonly getVoterState: (
    params: Pick<GetIndexDtfVoterStateParams, "account" | "stToken">,
  ) => Promise<IndexDtfVoterState>;
  readonly getProposerState: (
    params: Pick<
      GetIndexDtfProposerStateParams,
      "account" | "governance" | "timepoint"
    >,
  ) => Promise<IndexDtfProposerState>;
  readonly getProposalVotes: (
    params: Pick<GetIndexDtfProposalVotesParams, "governance" | "proposalId">,
  ) => Promise<IndexDtfProposalVotes>;
  readonly getProposalVoterState: (
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
  readonly governance: (walletClient: WalletClient) => IndexDtfGovernanceWriter;
  readonly getRebalances: (
    params?: GetIndexDtfRebalancesOptions,
  ) => Promise<readonly unknown[]>;
  readonly getRebalance: (
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
    options: BlockNumber | BlockNumberOption | undefined,
  ) => (typeof options === "bigint" ? options : options?.blockNumber);
  const get = (options: GetIndexDtfOptions = {}) =>
    readFull(client, { ...options, address, chainId });
  const getDtfRef = (options?: BlockNumberOption | BlockNumber) => {
    const blockNumber = resolveBlockNumber(options);

    return readDtf(client, {
      address,
      chainId,
      ...(blockNumber === undefined ? {} : { blockNumber }),
    });
  };
  const getFullRef = (options: GetFullIndexDtfOptions = {}) =>
    readFull(client, { ...options, address, chainId });
  const getBasketRef = (options?: GetIndexDtfBasketOptions) => {
    const blockNumber = resolveBlockNumber(options);

    return readBasket(client, {
      address,
      chainId,
      ...(blockNumber === undefined ? {} : { blockNumber }),
    });
  };
  const getBasketSnapshotRef = (options?: GetIndexDtfBasketSnapshotOptions) => {
    const blockNumber = resolveBlockNumber(options);

    return readBasketSnapshot(client, {
      address,
      chainId,
      ...(blockNumber === undefined ? {} : { blockNumber }),
    });
  };
  const getVersionRef = (options?: BlockNumberOption | BlockNumber) => {
    const blockNumber = resolveBlockNumber(options);

    return readVersion(client, {
      address,
      chainId,
      ...(blockNumber === undefined ? {} : { blockNumber }),
    });
  };
  const getTotalSupplyRef = (options?: BlockNumberOption | BlockNumber) => {
    const blockNumber = resolveBlockNumber(options);

    return readTotalSupply(client, {
      address,
      chainId,
      ...(blockNumber === undefined ? {} : { blockNumber }),
    });
  };
  const getTotalAssetsRef = (options?: BlockNumberOption | BlockNumber) => {
    const blockNumber = resolveBlockNumber(options);

    return readTotalAssets(client, {
      address,
      chainId,
      ...(blockNumber === undefined ? {} : { blockNumber }),
    });
  };

  return {
    address,
    chainId,
    get,
    getDtf: getDtfRef,
    getFull: getFullRef,
    getBasket: getBasketRef,
    getBasketSnapshot: getBasketSnapshotRef,
    getVersion: getVersionRef,
    getTotalSupply: getTotalSupplyRef,
    getTotalAssets: getTotalAssetsRef,
    getBrand: () => readBrand(client, { address, chainId }),
    getPrice: () => readPrice(client, { address, chainId }),
    getPriceHistory: (options) =>
      readPriceHistory(client, { ...options, address, chainId }),
    getProposals: (options = {}) =>
      getProposals(client, { ...options, address, chainId }),
    getProposal: (proposalId) =>
      getProposal(client, { proposalId, address, chainId }),
    getDelegates: (options) => getDelegates(client, { ...options, chainId }),
    getGuardians: () => getGuardians(client, { address, chainId }),
    getVoterState: (params) => getVoterState(client, { ...params, chainId }),
    getProposerState: (params) =>
      getProposerState(client, { ...params, chainId }),
    getProposalVotes: (params) =>
      getProposalVotes(client, { ...params, chainId }),
    getProposalVoterState: (params) =>
      getProposalVoterState(client, { ...params, chainId }),
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
    governance: (walletClient) =>
      createIndexDtfRefGovernanceWriter(walletClient, chainId),
    getRebalances: (options = {}) =>
      getRebalances(client, { ...options, address, chainId }),
    getRebalance: (id) => getRebalance(client, { id, chainId }),
  };
}

export function createIndexDtfNamespace(client: DtfClient) {
  return {
    ref: (params: DtfParams) => createIndexDtfRef(client, params),
    get: (params: GetIndexDtfParams) => readFull(client, params),
    getDtf: (params: DtfParams) => readDtf(client, params),
    list: (params?: ListIndexDtfsParams) => listIndexDtfs(client, params),
    getFull: (params: GetFullIndexDtfParams) => readFull(client, params),
    getBasket: (params: GetIndexDtfBasketParams) => readBasket(client, params),
    getBasketSnapshot: (params: GetIndexDtfBasketSnapshotParams) =>
      readBasketSnapshot(client, params),
    getVersion: (params: GetIndexDtfVersionParams) =>
      readVersion(client, params),
    getTotalSupply: (params: GetIndexDtfTotalSupplyParams) =>
      readTotalSupply(client, params),
    getTotalAssets: (params: GetIndexDtfTotalAssetsParams) =>
      readTotalAssets(client, params),
    getBrand: (params: DtfParams) => readBrand(client, params),
    getPrice: (params: GetIndexDtfPriceParams) => readPrice(client, params),
    getPriceHistory: (params: GetIndexDtfPriceHistoryParams) =>
      readPriceHistory(client, params),
    getProposals: (params: GetIndexDtfProposalsParams) =>
      getProposals(client, params),
    getProposal: (params: GetIndexDtfProposalParams) =>
      getProposal(client, params),
    getAllProposals: (params: GetAllIndexDtfProposalsParams) =>
      getAllProposals(client, params),
    getDelegates: (params: GetIndexDtfDelegatesParams) =>
      getDelegates(client, params),
    getGuardians: (params: GetIndexDtfGuardiansParams) =>
      getGuardians(client, params),
    getVoterState: (params: GetIndexDtfVoterStateParams) =>
      getVoterState(client, params),
    getProposerState: (params: GetIndexDtfProposerStateParams) =>
      getProposerState(client, params),
    getProposalVotes: (params: GetIndexDtfProposalVotesParams) =>
      getProposalVotes(client, params),
    getProposalVoterState: (params: GetIndexDtfProposalVoterStateParams) =>
      getProposalVoterState(client, params),
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
    getRebalances: (params: GetIndexDtfRebalancesParams) =>
      getRebalances(client, params),
    getRebalance: (params: GetIndexDtfRebalanceParams) =>
      getRebalance(client, params),
  };
}
