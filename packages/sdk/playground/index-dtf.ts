import type { SupportedChainId } from "@/defaults";

import { createDtfSdk } from "@/create-dtf-sdk";

const address = process.argv[2] ?? "0x4da9a0f397db1397902070f93a4d6ddbc0e0e6e8";
const chainId = Number(process.argv[3] ?? 8453) as SupportedChainId;

const sdk = createDtfSdk();
const dtf = await sdk.index.get({ address, chainId });

console.info("\nIndex DTF");
console.table([
  {
    address: dtf.id,
    chainId: dtf.chainId,
    name: dtf.token.name,
    symbol: dtf.token.symbol,
    holders: dtf.token.snapshot.currentHolderCount,
    supply: dtf.token.snapshot.totalSupply.formatted,
  },
]);

console.info("\nGovernance");
console.table(
  dtf.governance.all.map((authority, index) => ({
    index,
    address: authority.address,
    type: authority.type,
    votingDelay: authority.type === "governance" ? authority.governance.votingDelay : undefined,
    votingPeriod: authority.type === "governance" ? authority.governance.votingPeriod : undefined,
    quorum: authority.type === "governance" ? authority.governance.quorum : undefined,
  })),
);

console.info("\nRoles");
console.dir(dtf.roles, { depth: null });

console.info("\nVote Lock Vault");
console.dir(dtf.voteLockVault ?? "No vote lock vault", { depth: null });

console.info("\nFees");
console.dir(dtf.fees, { depth: null });
