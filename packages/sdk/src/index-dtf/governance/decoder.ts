import { decodeFunctionData, getAbiItem, getAddress, type Abi, type Address } from "viem";
import { SdkError } from "../../errors.js";
import type {
  IndexDtfDecodedCalldata,
  IndexDtfProposalDecoded,
  IndexDtfUnknownCalldata,
} from "../../types/index-dtf.js";
import {
  getContractAliases,
  type ProposalContractDecoder,
} from "./contract-map.js";

const UNKNOWN_CONTRACT = "Unknown";

type DecodeIndexDtfProposalCalldatasParams = {
  readonly targets: readonly Address[];
  readonly calldatas: readonly `0x${string}`[];
  readonly contractMap: Map<string, ProposalContractDecoder>;
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
  assertProposalCalldataShape(targets, calldatas);
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
      const unknownCall = {
        index: i,
        target: targetAddress,
        contract: UNKNOWN_CONTRACT,
        callData,
      };

      unknownCalls.push(unknownCall);
      pushUnknownContractGroup(
        unknownContracts,
        unknownGroupMap,
        unknownCall,
      );
      continue;
    }

    const decoded = decodeProposalCalldata(
      contractDecoder,
      i,
      targetAddress,
      callData,
    );

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
      pushUnknownContractGroup(
        unknownContracts,
        unknownGroupMap,
        unknownCall,
      );
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

function assertProposalCalldataShape(
  targets: readonly Address[],
  calldatas: readonly `0x${string}`[],
) {
  if (targets.length !== calldatas.length) {
    throw new SdkError({
      code: "INVALID_RESPONSE",
      message: "Index DTF proposal targets and calldatas length mismatch.",
      meta: {
        targets: targets.length,
        calldatas: calldatas.length,
      },
    });
  }
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
): Omit<
  IndexDtfDecodedCalldata,
  "callData" | "contract" | "index" | "target"
> | undefined {
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
    const parameters =
      abiItem && "inputs" in abiItem
        ? abiItem.inputs.map((input) => formatAbiInput(input))
        : [];
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
