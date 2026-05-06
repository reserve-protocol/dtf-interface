import { getAddress, type Hex, type WalletClient } from "viem";
import { writeContract } from "../../client/viem.js";
import type { WriteIndexDtfDelegateParams } from "../../types/governance.js";
import { dtfIndexStakingVaultAbi } from "../abis/dtf-index-staking-vault.js";

export async function writeAccountDelegate(
  walletClient: WalletClient,
  params: WriteIndexDtfDelegateParams,
): Promise<Hex> {
  return writeContract(walletClient, params.chainId, {
    account: getAddress(params.account),
    address: getAddress(params.stToken),
    abi: dtfIndexStakingVaultAbi,
    functionName: "delegate",
    args: [getAddress(params.delegatee)],
  });
}
