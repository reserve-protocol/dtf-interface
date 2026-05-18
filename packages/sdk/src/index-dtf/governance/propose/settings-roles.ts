import { keccak256, toBytes, type Address, type Hex } from "viem";

import type { SupportedChainId } from "@/config";
import type { IndexDtfCall } from "@/types/governance";

import { dtfIndexAbi } from "@/index-dtf/abis/dtf-index-abi";
import { timelockAbi } from "@/index-dtf/abis/timelock";
import { prepareContractCall } from "@/lib/contract-call";
import { SdkError } from "@/lib/errors";
import { sameAddress } from "@/lib/utils";

// Register labels owner timelock guardians as GUARDIAN_ROLE, but the contract
// role bytes are the Timelock CANCELLER_ROLE hash.
export const GUARDIAN_ROLE = "0xfd643c72710c63c0180259aba6b2d05451e3591a24e58b62239378085726f783" as const;
export const BRAND_MANAGER_ROLE = "0x2d8e650da9bd8c373ab2450d770f2ed39549bfc28d3630025cecc51511bcd374" as const;
export const AUCTION_LAUNCHER_ROLE = "0x13ff1b2625181b311f257c723b5e6d366eb318b212d9dd694c48fcf227659df5" as const;
export const CANCELLER_ROLE = keccak256(toBytes("CANCELLER_ROLE"));

export function buildRoleDiffCalls({
  abi,
  chainId,
  current,
  next,
  role,
  target,
}: {
  readonly target: Address | undefined;
  readonly chainId: SupportedChainId;
  readonly role: Hex;
  readonly current: readonly Address[];
  readonly next: readonly Address[] | undefined;
  readonly abi: typeof timelockAbi | typeof dtfIndexAbi;
}): IndexDtfCall[] {
  if (!next) return [];
  if (!target) {
    throw new SdkError({
      code: "INVALID_INPUT",
      message: "target is required to build role calls",
      meta: { role },
    });
  }

  const calls: IndexDtfCall[] = [];
  for (const address of current) {
    if (!next.some((nextAddress) => sameAddress(nextAddress, address))) {
      calls.push(prepareRoleCall(chainId, target, abi, "revokeRole", role, address));
    }
  }
  for (const address of next) {
    if (!current.some((currentAddress) => sameAddress(currentAddress, address))) {
      calls.push(prepareRoleCall(chainId, target, abi, "grantRole", role, address));
    }
  }

  return calls;
}

function prepareRoleCall(
  chainId: SupportedChainId,
  target: Address,
  abi: typeof timelockAbi | typeof dtfIndexAbi,
  functionName: "grantRole" | "revokeRole",
  role: Hex,
  address: Address,
): IndexDtfCall {
  const args = [role, address] as const;

  if (abi === timelockAbi) {
    return prepareContractCall({
      chainId,
      address: target,
      abi: timelockAbi,
      functionName,
      args,
    });
  }

  return prepareContractCall({
    chainId,
    address: target,
    abi: dtfIndexAbi,
    functionName,
    args,
  });
}
