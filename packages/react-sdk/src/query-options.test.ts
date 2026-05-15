import type { DtfSdk } from "@dtf-interface/sdk";

import { describe, expect, it, vi } from "vitest";

import { dtfQueryKeys } from "@/query-keys";
import {
  indexDtfOptimisticGovernanceQueryOptions,
  indexDtfOptimisticProposalContextQueryOptions,
  indexDtfOptimisticTimelockRolesQueryOptions,
  indexDtfOptimisticVotesQueryOptions,
  indexDtfPastOptimisticVotesQueryOptions,
  indexDtfProposalDeadlineQueryOptions,
  indexDtfProposalEtaQueryOptions,
  indexDtfProposalQueryOptions,
  indexDtfProposalRpcDetailsQueryOptions,
  indexDtfProposalSnapshotQueryOptions,
  indexDtfProposalStateQueryOptions,
  indexDtfProposalStatesQueryOptions,
  indexDtfProposalThrottleChargesQueryOptions,
  indexDtfQueryOptions,
  indexDtfSelectorRegistryAllowedSelectorsQueryOptions,
  indexDtfSelectorRegistryIsAllowedQueryOptions,
  indexDtfSelectorRegistryTargetsQueryOptions,
} from "@/query-options";

const GOVERNANCE = "0x0000000000000000000000000000000000000001";
const ACCOUNT = "0x0000000000000000000000000000000000000002";
const VOTE_TOKEN = "0x0000000000000000000000000000000000000003";
const TIMELOCK = "0x0000000000000000000000000000000000000004";
const REGISTRY = "0x0000000000000000000000000000000000000005";
const TARGET = "0x0000000000000000000000000000000000000006";

type QueryOptionCase = {
  readonly name: string;
  readonly method: keyof DtfSdk["index"];
  readonly build: (sdk: DtfSdk, params: any) => any;
  readonly key: (params: any) => unknown;
  readonly params: any;
  readonly result: unknown;
};

const proposalStateParams = {
  chainId: 1,
  governance: GOVERNANCE,
  proposalId: 42n,
} as const;

const newReadQueryOptions: readonly QueryOptionCase[] = [
  {
    name: "proposal state",
    method: "getProposalState",
    build: indexDtfProposalStateQueryOptions,
    key: dtfQueryKeys.index.governance.proposalState,
    params: proposalStateParams,
    result: "ACTIVE",
  },
  {
    name: "proposal states",
    method: "getProposalStates",
    build: indexDtfProposalStatesQueryOptions,
    key: dtfQueryKeys.index.governance.proposalStates,
    params: { chainId: 1, governance: GOVERNANCE, proposalIds: [42n, "43"] },
    result: ["ACTIVE", "QUEUED"],
  },
  {
    name: "proposal eta",
    method: "getProposalEta",
    build: indexDtfProposalEtaQueryOptions,
    key: dtfQueryKeys.index.governance.proposalEta,
    params: proposalStateParams,
    result: 10n,
  },
  {
    name: "proposal deadline",
    method: "getProposalDeadline",
    build: indexDtfProposalDeadlineQueryOptions,
    key: dtfQueryKeys.index.governance.proposalDeadline,
    params: proposalStateParams,
    result: 11n,
  },
  {
    name: "proposal snapshot",
    method: "getProposalSnapshot",
    build: indexDtfProposalSnapshotQueryOptions,
    key: dtfQueryKeys.index.governance.proposalSnapshot,
    params: proposalStateParams,
    result: 12n,
  },
  {
    name: "proposal RPC details",
    method: "getProposalRpcDetails",
    build: indexDtfProposalRpcDetailsQueryOptions,
    key: dtfQueryKeys.index.governance.proposalRpcDetails,
    params: proposalStateParams,
    result: { proposalId: "42", state: "ACTIVE", eta: 10n, deadline: 11n, snapshot: 12n },
  },
  {
    name: "optimistic governance",
    method: "getOptimisticGovernance",
    build: indexDtfOptimisticGovernanceQueryOptions,
    key: dtfQueryKeys.index.governance.optimisticGovernance,
    params: { chainId: 1, governance: GOVERNANCE },
    result: { governance: GOVERNANCE },
  },
  {
    name: "optimistic proposal context",
    method: "getOptimisticProposalContext",
    build: indexDtfOptimisticProposalContextQueryOptions,
    key: dtfQueryKeys.index.governance.optimisticProposalContext,
    params: proposalStateParams,
    result: null,
  },
  {
    name: "optimistic timelock roles",
    method: "getOptimisticTimelockRoles",
    build: indexDtfOptimisticTimelockRolesQueryOptions,
    key: dtfQueryKeys.index.governance.optimisticTimelockRoles,
    params: { chainId: 1, timelock: TIMELOCK },
    result: { optimisticProposers: [], guardians: [] },
  },
  {
    name: "optimistic votes",
    method: "getOptimisticVotes",
    build: indexDtfOptimisticVotesQueryOptions,
    key: dtfQueryKeys.index.governance.optimisticVotes,
    params: { account: ACCOUNT, chainId: 1, voteToken: VOTE_TOKEN },
    result: { raw: 1n, formatted: "1" },
  },
  {
    name: "past optimistic votes",
    method: "getPastOptimisticVotes",
    build: indexDtfPastOptimisticVotesQueryOptions,
    key: dtfQueryKeys.index.governance.pastOptimisticVotes,
    params: { account: ACCOUNT, chainId: 1, timepoint: 123n, voteToken: VOTE_TOKEN },
    result: { raw: 2n, formatted: "2" },
  },
  {
    name: "proposal throttle charges",
    method: "getProposalThrottleCharges",
    build: indexDtfProposalThrottleChargesQueryOptions,
    key: dtfQueryKeys.index.governance.proposalThrottleCharges,
    params: { account: ACCOUNT, chainId: 1, governance: GOVERNANCE },
    result: 3n,
  },
  {
    name: "selector registry targets",
    method: "getSelectorRegistryTargets",
    build: indexDtfSelectorRegistryTargetsQueryOptions,
    key: dtfQueryKeys.index.governance.selectorRegistryTargets,
    params: { chainId: 1, registry: REGISTRY },
    result: [TARGET],
  },
  {
    name: "selector registry allowed selectors",
    method: "getSelectorRegistryAllowedSelectors",
    build: indexDtfSelectorRegistryAllowedSelectorsQueryOptions,
    key: dtfQueryKeys.index.governance.selectorRegistryAllowedSelectors,
    params: { chainId: 1, registry: REGISTRY, target: TARGET },
    result: ["0xabcdef12"],
  },
  {
    name: "selector registry is allowed",
    method: "getSelectorRegistryIsAllowed",
    build: indexDtfSelectorRegistryIsAllowedQueryOptions,
    key: dtfQueryKeys.index.governance.selectorRegistryIsAllowed,
    params: { chainId: 1, registry: REGISTRY, selector: "0xabcdef12", target: TARGET },
    result: true,
  },
];

describe("react SDK query options", () => {
  it("builds disabled options until required params exist", () => {
    const sdk = { index: { get: vi.fn() } } as unknown as DtfSdk;
    const options = indexDtfQueryOptions(sdk, undefined);

    expect(options.enabled).toBe(false);
    expect(options.queryKey).toEqual(dtfQueryKeys.index.full(undefined));
  });

  it("calls the core SDK from query functions", async () => {
    const proposal = { id: "1" };
    const sdk = {
      index: {
        getProposal: vi.fn(async () => proposal),
      },
    } as unknown as DtfSdk;
    const params = {
      address: "0x0000000000000000000000000000000000000001",
      chainId: 1,
      proposalId: "1",
    } as const;
    const options = indexDtfProposalQueryOptions(sdk, params);

    await expect(options.queryFn()).resolves.toBe(proposal);
    expect(sdk.index.getProposal).toHaveBeenCalledWith(params);
  });

  for (const queryOption of newReadQueryOptions) {
    it(`builds ${queryOption.name} query options`, async () => {
      const method = vi.fn(async () => queryOption.result);
      const sdk = { index: { [queryOption.method]: method } } as unknown as DtfSdk;
      const disabledOptions = queryOption.build(sdk, undefined);
      const options = queryOption.build(sdk, queryOption.params);

      expect(disabledOptions.enabled).toBe(false);
      expect(disabledOptions.queryKey).toEqual(queryOption.key(undefined));
      expect(options.queryKey).toEqual(queryOption.key(queryOption.params));
      await expect(options.queryFn()).resolves.toBe(queryOption.result);
      expect(method).toHaveBeenCalledWith(queryOption.params);
    });
  }
});
