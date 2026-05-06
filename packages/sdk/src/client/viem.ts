import {
  createPublicClient,
  fallback,
  http as viemHttp,
  type Abi,
  type Chain,
  type ContractFunctionArgs,
  type ContractFunctionName,
  type Hex,
  type PublicClient,
  type ReadContractParameters,
  type ReadContractReturnType,
  type Transport,
  type WalletClient,
} from "viem";
import {
  SUPPORTED_CHAINS,
  supportedChainIds,
  type SupportedChainId,
} from "../defaults.js";
import { SdkError } from "../errors.js";

export type DtfClientViemChainConfig = {
  readonly chain?: Chain;
  readonly publicClient?: PublicClient;
  readonly rpcUrls?: readonly string[];
};

export type DtfClientViemConfig = {
  readonly chains: Partial<Record<SupportedChainId, DtfClientViemChainConfig>>;
};

type WalletClientWriteContractParameters = Parameters<
  WalletClient["writeContract"]
>[0];

export type DtfClientWriteContractParameters = Omit<
  WalletClientWriteContractParameters,
  "chain"
>;

export type DtfClientReadContractParameters<
  abi extends Abi | readonly unknown[] = Abi,
  functionName extends ContractFunctionName<
    abi,
    "pure" | "view"
  > = ContractFunctionName<abi, "pure" | "view">,
  args extends ContractFunctionArgs<
    abi,
    "pure" | "view",
    functionName
  > = ContractFunctionArgs<abi, "pure" | "view", functionName>,
> = ReadContractParameters<abi, functionName, args> & {
  readonly chainId: SupportedChainId;
};

export type DtfClientViem = {
  readonly getPublicClient: (chainId: SupportedChainId) => PublicClient;
  readonly getRpcUrls: (chainId: SupportedChainId) => readonly string[];
  readonly readContract: <
    const abi extends Abi | readonly unknown[],
    functionName extends ContractFunctionName<abi, "pure" | "view">,
    const args extends ContractFunctionArgs<abi, "pure" | "view", functionName>,
  >(
    params: DtfClientReadContractParameters<abi, functionName, args>,
  ) => Promise<ReadContractReturnType<abi, functionName, args>>;
};

export function createDtfClientViem({
  chains,
}: DtfClientViemConfig): DtfClientViem {
  const publicClients = getConfiguredPublicClients(chains);

  const viem: DtfClientViem = {
    getPublicClient(chainId) {
      const chainConfig = getChainConfig(chains, chainId);

      publicClients[chainId] ??= createDefaultPublicClient(
        chainId,
        chainConfig.chain,
        chainConfig.rpcUrls,
      );

      return publicClients[chainId];
    },
    getRpcUrls(chainId) {
      return getChainConfig(chains, chainId).rpcUrls ?? [];
    },
    readContract<
      const abi extends Abi | readonly unknown[],
      functionName extends ContractFunctionName<abi, "pure" | "view">,
      const args extends ContractFunctionArgs<
        abi,
        "pure" | "view",
        functionName
      >,
    >({
      chainId,
      ...params
    }: DtfClientReadContractParameters<abi, functionName, args>) {
      return viem.getPublicClient(chainId).readContract(
        params as ReadContractParameters<abi, functionName, args>,
      ) as Promise<ReadContractReturnType<abi, functionName, args>>;
    },
  };

  return viem;
}

export async function getLatestBlockTimepoint(
  viem: DtfClientViem,
  chainId: SupportedChainId,
): Promise<bigint> {
  const block = await viem.getPublicClient(chainId).getBlock();

  return block.timestamp > 0n ? block.timestamp - 1n : 0n;
}

export function writeContract(
  walletClient: WalletClient,
  chainId: SupportedChainId,
  params: DtfClientWriteContractParameters,
): Promise<Hex> {
  return walletClient.writeContract({
    ...params,
    chain: getWriteChain(chainId),
  } as WalletClientWriteContractParameters) as Promise<Hex>;
}

export function getWriteChain(chainId: SupportedChainId) {
  if (supportedChainIds.includes(chainId as SupportedChainId)) {
    return SUPPORTED_CHAINS[chainId];
  }

  throw new SdkError({
    code: "UNSUPPORTED_CHAIN",
    message: `Unsupported chain id: ${chainId}`,
    meta: { chainId },
  });
}

function createDefaultPublicClient(
  chainId: SupportedChainId,
  chain: Chain | undefined,
  rpcUrls: readonly string[] | undefined,
): PublicClient {
  if (!chain) {
    throwUnsupportedChain(chainId);
  }

  const transport: Transport =
    rpcUrls && rpcUrls.length > 0
      ? fallback(rpcUrls.map((url) => viemHttp(url)))
      : viemHttp();

  return createPublicClient({ chain, transport });
}

function getChainConfig(
  chains: Partial<Record<SupportedChainId, DtfClientViemChainConfig>>,
  chainId: SupportedChainId,
): DtfClientViemChainConfig {
  const chainConfig = chains[chainId];

  if (!chainConfig) {
    throwUnsupportedChain(chainId);
  }

  return chainConfig;
}

function getConfiguredPublicClients(
  chains: Partial<Record<SupportedChainId, DtfClientViemChainConfig>>,
): Partial<Record<SupportedChainId, PublicClient>> {
  const publicClients: Partial<Record<SupportedChainId, PublicClient>> = {};

  for (const [chainId, chainConfig] of Object.entries(chains)) {
    if (chainConfig.publicClient) {
      publicClients[Number(chainId) as SupportedChainId] =
        chainConfig.publicClient;
    }
  }

  return publicClients;
}

function throwUnsupportedChain(chainId: SupportedChainId): never {
  throw new SdkError({
    code: "UNSUPPORTED_CHAIN",
    message: `Unsupported chain id: ${chainId}`,
    meta: { chainId },
  });
}
