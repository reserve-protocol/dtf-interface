import type { Abi } from "viem";
import { SdkError } from "../errors.js";
import { dtfIndexAbi as indexDtfV5Abi } from "./abis/dtf-index-abi.js";
import { folioArtifactAbi as indexDtfV6Abi } from "./abis/folio-artifact.js";

export const INDEX_DTF_VERSION_5_0_0 = "5.0.0";
export const INDEX_DTF_VERSION_6_0_0 = "6.0.0";
export const LATEST_INDEX_DTF_VERSION = INDEX_DTF_VERSION_6_0_0;

const INDEX_DTF_VERSIONS = [
  INDEX_DTF_VERSION_5_0_0,
  INDEX_DTF_VERSION_6_0_0,
] as const;

export type IndexDtfVersion = typeof INDEX_DTF_VERSIONS[number];

export type IndexDtfOperation =
  | "addToBasket"
  | "removeFromBasket"
  | "setTVLFee"
  | "setMintFee"
  | "setSelfFee"
  | "setFeeRecipients"
  | "setAuctionLength"
  | "setMandate"
  | "setName"
  | "setTrustedFillerRegistry"
  | "setRebalanceControl"
  | "setBidsEnabled"
  | "setTradeAllowlistEnabled"
  | "addToAllowlist"
  | "removeFromAllowlist"
  | "deprecate";

export type IndexDtfOperationSpec = {
  readonly abi: Abi;
  readonly functionName: string;
};

type AbiFunctionInput = {
  readonly type: string;
  readonly components?: readonly AbiFunctionInput[];
};

type AbiFunction = {
  readonly type: "function";
  readonly name: string;
  readonly inputs?: readonly AbiFunctionInput[];
};

type AbiDifference = {
  readonly addedOrChangedFunctions: ReadonlySet<string>;
  readonly removedFunctions: ReadonlySet<string>;
};

const INDEX_DTF_ABIS = {
  [INDEX_DTF_VERSION_5_0_0]: indexDtfV5Abi,
  [INDEX_DTF_VERSION_6_0_0]: indexDtfV6Abi,
} satisfies Record<IndexDtfVersion, Abi>;

const INDEX_DTF_OPERATION_FUNCTIONS = {
  addToBasket: "addToBasket",
  removeFromBasket: "removeFromBasket",
  setTVLFee: "setTVLFee",
  setMintFee: "setMintFee",
  setSelfFee: "setFolioSelfFee",
  setFeeRecipients: "setFeeRecipients",
  setAuctionLength: "setAuctionLength",
  setMandate: "setMandate",
  setName: "setName",
  setTrustedFillerRegistry: "setTrustedFillerRegistry",
  setRebalanceControl: "setRebalanceControl",
  setBidsEnabled: "setBidsEnabled",
  setTradeAllowlistEnabled: "setTradeAllowlistEnabled",
  addToAllowlist: "addToAllowlist",
  removeFromAllowlist: "removeFromAllowlist",
  deprecate: "deprecateFolio",
} satisfies Record<IndexDtfOperation, string>;

const INDEX_DTF_OPERATION_FUNCTION_OVERRIDES: Partial<
  Record<IndexDtfVersion, Partial<Record<IndexDtfOperation, string>>>
> = {
  [INDEX_DTF_VERSION_6_0_0]: {
    setAuctionLength: "setMaxAuctionLength",
  },
};

const INDEX_DTF_FUNCTIONS = {
  [INDEX_DTF_VERSION_5_0_0]: getAbiFunctionSignatures(indexDtfV5Abi),
  [INDEX_DTF_VERSION_6_0_0]: getAbiFunctionSignatures(indexDtfV6Abi),
} satisfies Record<IndexDtfVersion, ReadonlyMap<string, ReadonlySet<string>>>;

const INDEX_DTF_ABI_DIFFERENCES: Partial<Record<IndexDtfVersion, AbiDifference>> = {
  [INDEX_DTF_VERSION_6_0_0]: getAbiDifference(indexDtfV5Abi, indexDtfV6Abi),
};

const VERSION_SENSITIVE_INDEX_DTF_OPERATIONS = getVersionSensitiveOperations();

export function getIndexDtfOperation(
  operationName: IndexDtfOperation,
  version: IndexDtfVersion,
): IndexDtfOperationSpec {
  const functionName = getOperationFunctionName(operationName, version);

  if (!INDEX_DTF_FUNCTIONS[version].has(functionName)) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: `${operationName} is not supported by Index DTF ${version}`,
      meta: { operation: operationName, version },
    });
  }

  return {
    abi: INDEX_DTF_ABIS[version],
    functionName,
  };
}

export function isIndexDtfOperationVersionSensitive(
  operationName: IndexDtfOperation,
): boolean {
  return VERSION_SENSITIVE_INDEX_DTF_OPERATIONS.has(operationName);
}

function getOperationFunctionName(
  operationName: IndexDtfOperation,
  version: IndexDtfVersion,
): string {
  return INDEX_DTF_OPERATION_FUNCTION_OVERRIDES[version]?.[operationName] ??
    INDEX_DTF_OPERATION_FUNCTIONS[operationName];
}

function getOperationFunctionNames(operationName: IndexDtfOperation): Set<string> {
  const names = new Set<string>([INDEX_DTF_OPERATION_FUNCTIONS[operationName]]);

  for (const overrides of Object.values(INDEX_DTF_OPERATION_FUNCTION_OVERRIDES)) {
    const functionName = overrides?.[operationName];

    if (functionName) {
      names.add(functionName);
    }
  }

  return names;
}

function getVersionSensitiveOperations(): ReadonlySet<IndexDtfOperation> {
  const operations = new Set<IndexDtfOperation>();
  const operationNames = Object.keys(
    INDEX_DTF_OPERATION_FUNCTIONS,
  ) as IndexDtfOperation[];

  for (const operationName of operationNames) {
    const functionNames = getOperationFunctionNames(operationName);

    for (const difference of Object.values(INDEX_DTF_ABI_DIFFERENCES)) {
      if (!difference) {
        continue;
      }

      for (const functionName of functionNames) {
        if (
          difference.addedOrChangedFunctions.has(functionName) ||
          difference.removedFunctions.has(functionName)
        ) {
          operations.add(operationName);
        }
      }
    }
  }

  return operations;
}

function getAbiDifference(previousAbi: Abi, nextAbi: Abi): AbiDifference {
  const previousFunctions = getAbiFunctionSignatures(previousAbi);
  const nextFunctions = getAbiFunctionSignatures(nextAbi);
  const addedOrChangedFunctions = new Set<string>();
  const removedFunctions = new Set<string>();

  for (const [name, nextSignatures] of nextFunctions) {
    const previousSignatures = previousFunctions.get(name);

    if (!previousSignatures || !setsEqual(previousSignatures, nextSignatures)) {
      addedOrChangedFunctions.add(name);
    }
  }

  for (const name of previousFunctions.keys()) {
    if (!nextFunctions.has(name)) {
      removedFunctions.add(name);
    }
  }

  return {
    addedOrChangedFunctions,
    removedFunctions,
  };
}

function getAbiFunctionSignatures(
  abi: Abi,
): ReadonlyMap<string, ReadonlySet<string>> {
  const signatures = new Map<string, Set<string>>();

  for (const item of abi) {
    if (item.type !== "function") {
      continue;
    }

    const functionSignatures = signatures.get(item.name) ?? new Set<string>();
    functionSignatures.add(getAbiFunctionSignature(item));
    signatures.set(item.name, functionSignatures);
  }

  return signatures;
}

function getAbiFunctionSignature(fn: AbiFunction): string {
  return `${fn.name}(${(fn.inputs ?? []).map(getAbiInputSignature).join(",")})`;
}

function getAbiInputSignature(input: AbiFunctionInput): string {
  if (!input.type.startsWith("tuple")) {
    return input.type;
  }

  const arraySuffix = input.type.slice("tuple".length);
  const tupleSignature = (input.components ?? [])
    .map(getAbiInputSignature)
    .join(",");

  return `(${tupleSignature})${arraySuffix}`;
}

function setsEqual<T>(left: ReadonlySet<T>, right: ReadonlySet<T>): boolean {
  if (left.size !== right.size) {
    return false;
  }

  for (const value of left) {
    if (!right.has(value)) {
      return false;
    }
  }

  return true;
}
