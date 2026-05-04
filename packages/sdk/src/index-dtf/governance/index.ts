import { getAddress } from "viem";
import type { DtfClient } from "../../client.js";
import { SdkError } from "../../errors.js";
import { getCurrentTime } from "../../lib/utils.js";
import type { DtfParams } from "../../types/common.js";
import type {
  GetIndexDtfProposalParams,
  GetIndexDtfProposalsParams,
  IndexDtfProposalDetail,
  IndexDtfProposalSummary,
} from "../../types/index-dtf.js";
import {
  GetIndexDtfProposalDocument,
  GetIndexDtfProposalGovernanceAddressesDocument,
  GetIndexDtfProposalsDocument,
} from "../subgraph/dtf.generated.js";
import { buildProposalContractMap } from "./contract-map.js";
import { decodeIndexDtfProposalCalldatas } from "./decoder.js";
import {
  mapDtfProposalContractContext,
  mapIndexDtfProposal,
  mapIndexDtfProposalSummary,
  mapProposalGovernanceContractContext,
  type SubgraphGovernedIndexDtfProposalDtf,
} from "./mapper.js";
import {
  getDtfProposalGovernanceIds,
  getIndexDtfProposalGovernanceAddresses,
  isProposalForDtf,
  normalizeGovernanceIds,
  withVoteState,
  type DtfGovernanceAddressContext,
} from "./utils.js";

export { getIndexDtfProposalGovernanceAddresses, getVoteState } from "./utils.js";

const DEFAULT_PROPOSAL_LIMIT = 100;

type GetProposalsByGovernanceIdsParams = {
  readonly chainId: DtfParams["chainId"];
  readonly dtf?: DtfParams;
  readonly governanceIds: readonly string[];
  readonly limit: number;
};

export async function getIndexDtfProposals(
  client: DtfClient,
  params: GetIndexDtfProposalsParams,
): Promise<readonly IndexDtfProposalSummary[]> {
  const proposalListParams = await getProposalListParams(client, params);

  return getProposalsByGovernanceIds(client, proposalListParams);
}

async function getProposalListParams(
  client: DtfClient,
  params: GetIndexDtfProposalsParams,
): Promise<GetProposalsByGovernanceIdsParams> {
  const limit = params.limit ?? DEFAULT_PROPOSAL_LIMIT;

  if ("governanceAddresses" in params) {
    const proposalListParams = {
      chainId: params.chainId,
      governanceIds: normalizeGovernanceIds(params.governanceAddresses),
      limit,
    };

    if (!params.address) {
      return proposalListParams;
    }

    return {
      ...proposalListParams,
      dtf: {
        address: getAddress(params.address),
        chainId: params.chainId,
      },
    };
  }

  if ("dtf" in params) {
    return {
      chainId: params.dtf.chainId,
      dtf: { address: getAddress(params.dtf.id), chainId: params.dtf.chainId },
      governanceIds: normalizeGovernanceIds(
        getIndexDtfProposalGovernanceAddresses(params.dtf),
      ),
      limit,
    };
  }

  const dtf = { address: getAddress(params.address), chainId: params.chainId };

  return {
    chainId: params.chainId,
    dtf,
    governanceIds: await fetchDtfProposalGovernanceIds(client, dtf),
    limit,
  };
}

async function getProposalsByGovernanceIds(
  client: DtfClient,
  params: GetProposalsByGovernanceIdsParams,
): Promise<readonly IndexDtfProposalSummary[]> {
  if (params.governanceIds.length === 0) {
    return [];
  }

  const { governances } = await client.subgraph.queryIndex({
    chainId: params.chainId,
    query: GetIndexDtfProposalsDocument,
    variables: {
      governanceIds: [...params.governanceIds],
      limit: params.limit,
    },
  });

  const timestamp = getCurrentTime();
  const proposals = governances
    .flatMap((governance) => governance.proposals)
    .map((proposal) =>
      withVoteState(
        mapIndexDtfProposalSummary(proposal, params.chainId, params.dtf),
        timestamp,
      ),
    )
    .sort((a, b) => b.creationTime - a.creationTime);

  return proposals.slice(0, params.limit);
}

export async function getIndexDtfProposal(
  client: DtfClient,
  params: GetIndexDtfProposalParams,
): Promise<IndexDtfProposalDetail> {
  const { proposalId, address, chainId } = params;
  const { dtf, proposal } = await client.subgraph.queryIndex({
    chainId,
    query: GetIndexDtfProposalDocument,
    variables: {
      dtfId: address.toLowerCase(),
      proposalId,
    },
  });

  if (!proposal || !dtf) {
    throw new SdkError({
      code: "RECORD_NOT_FOUND",
      message: !proposal
        ? `Index DTF proposal not found: ${proposalId} on chain ${chainId}`
        : `Index DTF not found: ${address} on chain ${chainId}`,
      meta: {
        chainId,
        entity: !proposal ? "indexDtfProposal" : "indexDtf",
        ...(!proposal ? { id: proposalId } : { address }),
      },
    });
  }

  const governedDtf = dtf as SubgraphGovernedIndexDtfProposalDtf;

  if (!isProposalForDtf(proposal.governance.id, governedDtf)) {
    throw new SdkError({
      code: "RECORD_NOT_FOUND",
      message: `Index DTF proposal not found: ${proposalId} for DTF ${address} on chain ${chainId}`,
      meta: {
        chainId,
        entity: "indexDtfProposal",
        id: proposalId,
        address,
      },
    });
  }

  const parsedProposal = mapIndexDtfProposal(proposal, governedDtf, chainId);
  const proposalWithVoteState = withVoteState(parsedProposal, getCurrentTime());
  const contractMap = buildProposalContractMap({
    chainId,
    dtf: mapDtfProposalContractContext(governedDtf),
    proposalGovernance: mapProposalGovernanceContractContext(
      proposal.governance,
    ),
  });
  const decodedData = decodeIndexDtfProposalCalldatas({
    targets: parsedProposal.targets,
    calldatas: parsedProposal.calldatas,
    contractMap,
  });

  return {
    ...proposalWithVoteState,
    decoded: decodedData,
  };
}

async function fetchDtfProposalGovernanceIds(
  client: DtfClient,
  params: DtfParams,
): Promise<readonly string[]> {
  const address = getAddress(params.address);
  const { dtf } = await client.subgraph.queryIndex({
    chainId: params.chainId,
    query: GetIndexDtfProposalGovernanceAddressesDocument,
    variables: { dtfId: address.toLowerCase() },
  });

  if (!dtf) {
    throw new SdkError({
      code: "RECORD_NOT_FOUND",
      message: `Index DTF not found: ${address} on chain ${params.chainId}`,
      meta: {
        chainId: params.chainId,
        entity: "indexDtf",
        address,
      },
    });
  }

  return getDtfProposalGovernanceIds(dtf as DtfGovernanceAddressContext);
}
