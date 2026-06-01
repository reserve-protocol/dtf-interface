import { decodeFunctionData, getAbiItem, getAddress, type Abi, type Address } from "viem";

import type { DtfClient } from "@/client";
import type { DtfClientExplorer } from "@/client/explorer";
import type { SupportedChainId } from "@/config";
import type { IndexDtfDecodedCalldata, IndexDtfProposalDecoded, IndexDtfUnknownCalldata } from "@/types/governance";

import { selectorRegistryAbi } from "@/index-dtf/abis/selector-registry";
import {
  buildProposalContractMap,
  getContractAliases,
  type IndexDtfProposalDtfContractContext,
  type IndexDtfProposalGovernanceContractContext,
  type ProposalContractDecoder,
} from "@/index-dtf/governance/contract-map";

const UNKNOWN_CONTRACT = "Unknown";
const FALLBACK_DECODERS: readonly Omit<ProposalContractDecoder, "target">[] = [
  {
    contract: "Selector Registry",
    abi: selectorRegistryAbi,
  },
];

type DecodeIndexDtfProposalCalldatasParams = {
  readonly targets: readonly Address[];
  readonly calldatas: readonly `0x${string}`[];
  readonly contractMap: Map<string, ProposalContractDecoder>;
};

export type DecodeIndexDtfProposalParams = {
  readonly chainId: SupportedChainId;
  readonly targets: readonly Address[];
  readonly calldatas: readonly `0x${string}`[];
  readonly dtf: IndexDtfProposalDtfContractContext;
  readonly proposalGovernance?: IndexDtfProposalGovernanceContractContext;
};

type AbiInput = {
  readonly name?: string | undefined;
  readonly type: string;
};

type MutableDecodedContractGroup = {
  target: Address;
  contract: string;
  calls: IndexDtfDecodedCalldata[];
};

type MutableUnknownContractGroup = {
  target: Address;
  contract: string;
  calls: IndexDtfUnknownCalldata[];
};

export function decodeIndexDtfProposalCalldatas({
  targets,
  calldatas,
  contractMap,
}: DecodeIndexDtfProposalCalldatasParams): IndexDtfProposalDecoded {
  if (targets.length !== calldatas.length) {
    throw new Error("Index DTF proposal targets and calldatas length mismatch");
  }

  const calls: IndexDtfDecodedCalldata[] = [];
  const unknownCalls: IndexDtfUnknownCalldata[] = [];
  const dataByContract: MutableDecodedContractGroup[] = [];
  const unknownContracts: MutableUnknownContractGroup[] = [];
  const dataGroupMap = new Map<string, MutableDecodedContractGroup>();
  const unknownGroupMap = new Map<string, MutableUnknownContractGroup>();

  for (let i = 0; i < targets.length; i++) {
    const target = targets[i]!;
    const callData = calldatas[i]!;

    const targetAddress = getAddress(target);
    const targetKey = targetAddress.toLowerCase();
    const contractDecoder = contractMap.get(targetKey);

    if (!contractDecoder) {
      const fallbackDecoded = decodeFallbackProposalCalldata(i, targetAddress, callData);

      if (fallbackDecoded) {
        calls.push(fallbackDecoded);
        pushDecodedContractGroup(dataByContract, dataGroupMap, fallbackDecoded);
        continue;
      }

      const unknownCall = {
        index: i,
        target: targetAddress,
        contract: UNKNOWN_CONTRACT,
        callData,
      };

      unknownCalls.push(unknownCall);
      pushUnknownContractGroup(unknownContracts, unknownGroupMap, unknownCall);
      continue;
    }

    const decoded = decodeProposalCalldata(contractDecoder, i, targetAddress, callData);

    if (decoded) {
      calls.push(decoded);
      pushDecodedContractGroup(dataByContract, dataGroupMap, decoded);
    } else {
      const unknownCall = {
        index: i,
        target: targetAddress,
        contract: contractDecoder.contract,
        callData,
      };

      unknownCalls.push(unknownCall);
      pushUnknownContractGroup(unknownContracts, unknownGroupMap, unknownCall);
    }
  }

  return {
    contracts: getContractAliases(contractMap),
    dataByContract,
    unknownContracts,
    calls,
    unknownCalls,
  };
}

export async function decodeIndexDtfProposal(
  client: DtfClient,
  params: DecodeIndexDtfProposalParams,
): Promise<IndexDtfProposalDecoded> {
  const contractMap = buildProposalContractMap({
    chainId: params.chainId,
    dtf: params.dtf,
    ...(params.proposalGovernance ? { proposalGovernance: params.proposalGovernance } : {}),
  });
  const decoded = decodeIndexDtfProposalCalldatas({
    targets: params.targets,
    calldatas: params.calldatas,
    contractMap,
  });

  if (decoded.unknownCalls.length === 0) {
    return decoded;
  }

  const explorer = client.explorer;
  if (!explorer) {
    return decoded;
  }

  const externalContractMap = await getExternalAbiContractMap(explorer, params.chainId, decoded.unknownCalls, contractMap);
  if (!externalContractMap) {
    return decoded;
  }

  return decodeIndexDtfProposalCalldatas({
    targets: params.targets,
    calldatas: params.calldatas,
    contractMap: externalContractMap,
  });
}

async function getExternalAbiContractMap(
  explorer: DtfClientExplorer,
  chainId: SupportedChainId,
  unknownCalls: readonly IndexDtfUnknownCalldata[],
  contractMap: Map<string, ProposalContractDecoder>,
): Promise<Map<string, ProposalContractDecoder> | null> {
  const targets = [...new Set(unknownCalls.map((call) => getAddress(call.target)))] as Address[];
  const metadata = await Promise.all(
    targets.map(async (target) => ({
      target,
      metadata: await explorer.getContractMetadata({ chainId, address: target }),
    })),
  );
  const withMetadata = metadata.filter((entry) => entry.metadata !== null);

  if (withMetadata.length === 0) {
    return null;
  }

  const externalContractMap = new Map(contractMap);

  for (const { target, metadata } of withMetadata) {
    const key = target.toLowerCase();
    const existing = externalContractMap.get(key);

    externalContractMap.set(key, {
      target,
      contract: existing?.contract ?? metadata!.contractName,
      abi: existing ? ([...existing.abi, ...metadata!.abi] as Abi) : metadata!.abi,
    });
  }

  return externalContractMap;
}

function decodeProposalCalldata(
  contractDecoder: ProposalContractDecoder,
  index: number,
  target: Address,
  callData: `0x${string}`,
): IndexDtfDecodedCalldata | undefined {
  const decoded = tryDecodeCalldata(contractDecoder.abi, callData);

  if (!decoded) {
    return undefined;
  }

  return {
    index,
    target,
    contract: contractDecoder.contract,
    functionName: decoded.functionName,
    signature: decoded.signature,
    parameters: decoded.parameters,
    params: decoded.params,
    callData,
  };
}

function tryDecodeCalldata(
  abi: Abi,
  callData: `0x${string}`,
): Omit<IndexDtfDecodedCalldata, "callData" | "contract" | "index" | "target"> | undefined {
  try {
    const { args, functionName } = decodeFunctionData({
      abi,
      data: callData,
    });
    const abiItem = getAbiItem({
      abi,
      args,
      name: functionName,
    });
    const parameters = abiItem && "inputs" in abiItem ? abiItem.inputs.map((input) => formatAbiInput(input)) : [];
    const functionNameString = String(functionName);

    return {
      functionName: functionNameString,
      signature: `${functionNameString}(${parameters.join(", ")})`,
      parameters,
      params: [...(args ?? [])],
    };
  } catch {
    return undefined;
  }
}

function decodeFallbackProposalCalldata(
  index: number,
  target: Address,
  callData: `0x${string}`,
): IndexDtfDecodedCalldata | undefined {
  for (const fallbackDecoder of FALLBACK_DECODERS) {
    const decoded = decodeProposalCalldata({ ...fallbackDecoder, target }, index, target, callData);

    if (decoded) {
      return decoded;
    }
  }

  return undefined;
}

function formatAbiInput(input: AbiInput): string {
  if (!input.name) {
    return input.type;
  }

  return `${input.name}: ${input.type}`;
}

function pushDecodedContractGroup(
  groups: MutableDecodedContractGroup[],
  groupMap: Map<string, MutableDecodedContractGroup>,
  call: IndexDtfDecodedCalldata,
) {
  const key = call.target.toLowerCase();
  let group = groupMap.get(key);

  if (!group) {
    group = {
      target: call.target,
      contract: call.contract,
      calls: [],
    };
    groupMap.set(key, group);
    groups.push(group);
  }

  group.calls.push(call);
}

function pushUnknownContractGroup(
  groups: MutableUnknownContractGroup[],
  groupMap: Map<string, MutableUnknownContractGroup>,
  call: IndexDtfUnknownCalldata,
) {
  const key = call.target.toLowerCase();
  let group = groupMap.get(key);

  if (!group) {
    group = {
      target: call.target,
      contract: call.contract,
      calls: [],
    };
    groupMap.set(key, group);
    groups.push(group);
  }

  group.calls.push(call);
}
