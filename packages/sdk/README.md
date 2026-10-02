# @reserve-protocol/sdk

Core TypeScript SDK for DTF integrations.

This package is environment-agnostic. It should work in modern Node, browser apps, React wrappers, scripts, and bots.

Implemented SDK product surface:

- Index DTFs: Ethereum mainnet, Base, BSC.
- Yield DTFs: Ethereum mainnet and Base reads, issuance, staking, governance, auctions, APY, and proposal builders.
- Account portfolio API reads: current portfolio, historical portfolio, and transactions.

## Usage

```ts
import { createDtfSdk } from "@reserve-protocol/sdk";

const sdk = createDtfSdk();

const dtf = await sdk.index.get({
  address: "0x...",
  chainId: 8453,
});

const indexDtf = sdk.index.ref({
  address: "0x...",
  chainId: 8453,
});

const proposals = await indexDtf.getProposals();
const price = await indexDtf.getPrice();
const brand = await indexDtf.getBrand();
const basketAtBlock = await indexDtf.getBasket(123n);
```

With explicit configuration:

```ts
import { createDtfSdk } from "@reserve-protocol/sdk";

const sdk = createDtfSdk({
  apiBaseUrl: "https://api.reserve.org",
  chains: {
    1: {
      rpcUrls: ["https://eth-mainnet.example"],
    },
  },
});

const dtfs = await sdk.index.list({ chainId: 1 });
```

## Tests

Run `pnpm --filter @reserve-protocol/sdk test` from the repository root. For one domain, use
`pnpm --filter @reserve-protocol/sdk exec vitest run src/index-dtf/rebalance`.
Tests are colocated with their domain and typechecked with source; live and fork checks remain opt-in.

- Transaction tests assert the destination, chain, value, and complete decoded arguments. Pin fixed selectors for version-dependent signatures.
- Use independently calculated economic fixtures with unequal weights, different governance settings, nonzero slippage, and mixed decimals. Do not calculate expected values by calling the operation under test.
- Mock external boundaries and make results depend on the request when address, block, or timepoint matters. Use real pure math and encoding dependencies.
- Parameterize actual behavior boundaries; consolidate duplicate scenarios and remove tautologies. Keep failure output focused on relevant request fields instead of entire ABIs.
- For a regression fix, first demonstrate a failing behavior test. When strengthening an existing test, reintroduce the fault in an isolated copy and confirm it fails. Run the ordinary suite on unmodified source as the control.

## GraphQL Codegen

The SDK imports typed GraphQL documents from generated source files. After changing `.graphql` files or `codegen.yml`, regenerate them before running the SDK, build, or typecheck:

```sh
pnpm graphql:codegen
```

Generated GraphQL files are checked in so consumers do not need to run codegen after installing the package.

## Index DTF v6 ABI Sync

The checked-in Folio v6, FolioDeployer v6, and FolioVersionRegistry ABIs are generated from
`reserve-index-dtf` commit `18706fb455b8e6b91250deba795eb791243f6827`. The default protocol checkout is the sibling
`../index-protocol` directory. Verify freshness without modifying files:

```sh
pnpm abi:index-v6:check
```

This protocol-backed check verifies the checkout commit, every source hash recorded in each Foundry artifact, and the
pinned ABI SHA-256 before comparing generated output. Publication CI uses the sibling-free checked-in check:

```sh
pnpm abi:index-v6:check-generated
```

To use an explicit checkout and regenerate after reviewing a protocol update:

```sh
pnpm abi:index-v6:sync -- --protocol-root /absolute/path/to/reserve-index-dtf
pnpm abi:index-v6:check -- --protocol-root /absolute/path/to/reserve-index-dtf
```

The protocol-backed commands reject any protocol `HEAD` other than the pinned commit. Normal unit tests and release CI
consume the checked-in modules and do not depend on a sibling repository.

## Playground

Run a live Index DTF fetch and print real data:

```sh
pnpm playground:index
```

You can also pass `address chainId`:

```sh
pnpm playground:index 0x4da9a0f397db1397902070f93a4d6ddbc0e0e6e8 8453
```

This is intentionally not part of the normal test suite or CI path.

## Deterministic Fork Smoke

The opt-in Index DTF fork smoke verifies four scenarios prepared by an external local-fork runner:

- a v5 control Folio that remains on v5;
- v5 Folios upgraded to v6 through optimistic and legacy governance;
- a Folio created directly on v6.

`test:smoke:index:fork` runs two read-only files against the sandbox's indexed Anvil: `fork-smoke.test.ts` (the fixture
runner owns fork startup, deployments, upgrade transactions, and standard governance deployment) and
`fork-smoke-v6.test.ts` (v6 registry and state reads). Neither sends transactions, snapshots, reverts or warps time, so
they are safe while a fork Graph Node indexes the chain. The smoke independently matches each declared upgrade
proposal to its on-chain `ProposalCreated`/`ProposalExecuted` logs and executed Governor state. Run it after those
transitions are mined:

```sh
RUN_INDEX_DTF_FORK_SMOKE=1 \
INDEX_DTF_FORK_MANIFEST=/absolute/path/to/fixture.json \
pnpm --filter @reserve-protocol/sdk test:smoke:index:fork
```

The writing v6 cases (SDK-built settings from the admin timelock, a v6 deploy against the sandbox deployer, the
5.0.0 → 6.0.0 upgrade after a 400-day warp, each under `evm_snapshot`/`evm_revert`) live in
`fork-smoke-v6-mutating.test.ts` and have their own script. They need a disposable Anvil forked from the sandbox and
refuse port 8545 and the manifest's own RPC: rewinding a chain under its Graph Node corrupts the index.

```sh
anvil --fork-url http://127.0.0.1:8545 --port 8549
INDEX_DTF_FORK_MANIFEST=/absolute/path/to/fixture.json \
INDEX_DTF_FORK_DISPOSABLE_RPC_URL=http://127.0.0.1:8549 \
pnpm --filter @reserve-protocol/sdk test:smoke:index:fork-mutating
```

When `INDEX_DTF_FORK_MANIFEST` is unset, the harness reads `fixture.json` from `SANDBOX_STATE_DIR`. The manifest is the
single contract between the fixture runner and SDK. The following shows the complete schema; addresses, block numbers,
proposal IDs, and calldata are abbreviated and must come from the fixture runner:

```json
{
  "schemaVersion": 1,
  "rpcUrl": "http://127.0.0.1:8545",
  "chainId": 1,
  "forkBlock": "25834000",
  "stateBlock": "25835000",
  "stateTimestamp": "1788300000",
  "writePaths": { "deadline": "1788303600", "auctionLength": 300 },
  "protocol": {
    "v5Deployer": "0x...",
    "v6Deployer": "0x...",
    "v6Implementation": "0x...",
    "versionRegistry": "0x...",
    "upgradeSpell": "0x...",
    "upgradeSpellSourceCommit": "33c315690a71c826b5bcd01b69110f478ccd865d",
    "startRebalanceSelectors": { "v5": "0x207c8eed", "v6": "0xc1e54b89" }
  },
  "scenarios": {
    "v5Control": {
      "folio": "0x...",
      "proxyAdmin": "0x...",
      "governance": "0x0000000000000000000000000000000000000000",
      "governanceKind": "standard",
      "creationBlock": "25834900",
      "expectedVersion": "5.0.0",
      "execution": {
        "actor": "0x...",
        "roleAuthority": "direct-admin",
        "tokens": ["0x...", "0x..."],
        "rebalanceNonce": 1,
        "rebalanceTxHash": "0x...",
        "rebalanceBlock": "25834980",
        "auctionId": 0,
        "auctionTxHash": "0x...",
        "auctionBlock": "25834990",
        "auctionLength": 300
      }
    },
    "v5OptimisticUpgrade": {
      "folio": "0x...",
      "proxyAdmin": "0x...",
      "governance": "0x...",
      "governanceKind": "optimistic",
      "governanceAddresses": {
        "governor": "0x...",
        "timelock": "0x...",
        "stakingVault": "0x...",
        "selectorRegistry": "0x..."
      },
      "creationBlock": "25834910",
      "upgradeBlock": "25834950",
      "proposalCallCount": 4,
      "expectedVersion": "6.0.0",
      "proposal": {
        "proposalId": "...",
        "entityId": "...",
        "kind": "standard",
        "optimistic": false,
        "state": "executed",
        "proposalBlock": "25834940",
        "executeBlock": "25834950",
        "targets": ["<selectorRegistry>", "<selectorRegistry>", "<proxyAdmin>", "<upgradeSpell>"],
        "values": [0, 0, 0, 0],
        "calldatas": ["<register-v6>", "<unregister-v5>", "<transfer-ownership>", "<cast>"],
        "selectors": ["0x39535e96", "0x3bb9e672", "0xf2fde38b", "0x2aa6b211"]
      }
    },
    "v5LegacyUpgrade": {
      "folio": "0x...",
      "proxyAdmin": "0x...",
      "governance": "0x...",
      "governanceKind": "standard",
      "governanceAddresses": {
        "governor": "0x...",
        "timelock": "0x...",
        "stakingVault": "0x...",
        "selectorRegistry": "0x0000000000000000000000000000000000000000"
      },
      "creationBlock": "25834920",
      "upgradeBlock": "25834960",
      "proposalCallCount": 2,
      "expectedVersion": "6.0.0",
      "proposal": {
        "proposalId": "...",
        "entityId": "...",
        "kind": "standard",
        "optimistic": false,
        "state": "executed",
        "proposalBlock": "25834941",
        "executeBlock": "25834960",
        "targets": ["<proxyAdmin>", "<upgradeSpell>"],
        "values": [0, 0],
        "calldatas": ["<transfer-ownership>", "<cast-with-zero-selector-registry>"],
        "selectors": ["0xf2fde38b", "0x2aa6b211"]
      }
    },
    "v6Native": {
      "folio": "0x...",
      "proxyAdmin": "0x...",
      "governance": "0x...",
      "governanceKind": "optimistic",
      "governanceAddresses": {
        "governor": "0x...",
        "timelock": "0x...",
        "stakingVault": "0x...",
        "selectorRegistry": "0x..."
      },
      "creationBlock": "25834970",
      "expectedVersion": "6.0.0",
      "execution": {
        "actor": "0x...",
        "roleAuthority": "optimistic-governance",
        "governanceMechanism": "optimistic",
        "authority": {
          "kind": "standard",
          "optimistic": false,
          "state": "executed",
          "description": "...",
          "proposalId": "...",
          "proposalTxHash": "0x...",
          "proposalBlock": "25834980",
          "executeTxHash": "0x...",
          "executeBlock": "25834985"
        },
        "rebalanceProposal": {
          "kind": "optimistic",
          "optimistic": true,
          "state": "executed",
          "description": "...",
          "proposalId": "...",
          "proposalTxHash": "0x...",
          "proposalBlock": "25834990",
          "executeTxHash": "0x...",
          "executeBlock": "25834995",
          "deadline": "1788303600"
        },
        "tokens": ["0x...", "0x..."],
        "rebalanceNonce": 1,
        "deadline": "1788303600",
        "rebalanceTxHash": "<same as rebalanceProposal.executeTxHash>",
        "rebalanceBlock": "25834995",
        "auctionId": 0,
        "auctionTxHash": "0x...",
        "auctionBlock": "25834999",
        "auctionLength": 300
      }
    }
  }
}
```

`address` is accepted as a documented alias for each scenario's `folio`. `INDEX_DTF_FORK_RPC_URL` may override the
manifest RPC URL, but both forms are restricted to loopback HTTP. `chainId` is the forked source chain (`1`, `8453`,
or `56`), even when the local RPC reports a development chain ID. No production Folio address is built into the
harness; the sandbox's own v6 deployer comes from the manifest. Normal unit tests collect the fork file as skipped
unless the opt-in flag is set.

The `fork-smoke.test.ts` write-path checks are read-only: standard Governor proposal ordering, executed upgrade-path log
attestation, v5/v6 `openAuction` calldata, the live v6 `startRebalance` next nonce/deadline, and the v5 deploy builder.
They do not submit transactions or perform upgrades. SDK-built v6 deploys are executed by
`fork-smoke-v6-mutating.test.ts` against the sandbox deployer and by the real-deployer fork below.

Execution readback is pinned to `stateBlock`. The generated fixture can have non-overlapping auction windows: the v5
auction is active at its current state timestamp while the v6 auction is successfully opened and scheduled. The smoke
therefore asserts v5 through `getActiveAuction`, v6 through `getLatestAuction` with `getActiveAuction === null` before
its declared start, and exact event/readback start, end, duration, nonce, ID, and token equality for both.

## Real Folio 6.0 Deployer Fork

`fork-real-v6.test.ts` exercises the production 6.0.0 `FolioDeployer` behind `INDEX_DTF_V6_DEPLOYER_ADDRESS` on
disposable, unindexed Anvil forks of mainnet, Base and BSC (never the shared sandbox on 8545, which the suite refuses).
Per chain it:

- checks the deployer's `folioImplementation()` runtime code against the explorer-verified 6.0.0 hash the SDK ABIs are
  tested against (`src/index-dtf/abis/explorer/`);
- deploys an ungoverned Folio through the SDK's default deployer and reads the v6 state back;
- `eth_call`s every function of the SDK's v6 Folio ABI with well-formed arguments: an unknown selector (and the
  pre-audit `endRebalance()`) reverts with empty data, so every function must return or revert with a decoded error;
- runs a complete rebalance with SDK builders: `startRebalance` at the expected nonce; a launcher `openAuction` with
  bids at its start, middle and end; a no-op `closeAuction` after the end; `openAuctionUnrestricted` from a roleless
  account, rejected before `restrictedUntil` and opened from it on spot limits, spot weights and initial prices; one
  bid for everything available; a mid-auction `closeAuction`; `endRebalance(nonce)` after a stale nonce is rejected.
  Every price and bid size is recomputed from contract reads (exact at an auction's start and end, the exponential
  curve within 1e-9 between, the sell cap from limits, weights, supply and balances as Folio's `getBid` computes it),
  and the final basket must sit within the spot limits and at least three quarters of the way to the 20/80 target;
- deploys a governed Folio (the deployer's optimistic governor deployer 1.1.0 wires governor, timelock and selector
  registry), then registers the deployer in the chain's `FolioVersionRegistry` as the registry owner and reads 6.0.0
  back.

Each chain runs inside one `evm_snapshot`/`evm_revert`, so the forks can be reused. Only Folio calls behind the
`sync` modifier (`startRebalance`, `openAuction`, `openAuctionUnrestricted`, `bid`) are sent with a fixed gas limit:
Anvil can estimate at one timestamp and mine the next, and `sync`'s `lastFolioFeePoke` write then costs more than the
estimate covered, starving the delegatecall into `RebalancingLib`.

```sh
anvil --fork-url <mainnet-rpc> --port 8546 --chain-id 1
anvil --fork-url <base-rpc> --port 8547 --chain-id 8453
anvil --fork-url <bsc-rpc> --port 8548 --chain-id 56
pnpm --filter @reserve-protocol/sdk test:smoke:index:fork-real-v6
```

`INDEX_DTF_FORK_REAL_V6_RPC_URL_1`, `_8453` and `_56` override the loopback URLs. Run one chain with
`-t "chain 8453"`. The suite aborts before writing when the RPC is not Anvil or reports another chain id, which also
keeps it off Register's indexed fork stacks (Base on 8546, BSC on 8547); never point an override at an indexed fork.
When a chain's registry already has 6.0.0, the last case only checks that the registered deployer is the pinned one.

## Errors

SDK errors use stable machine-readable codes:

```ts
import { createDtfSdk, isSdkError } from "@reserve-protocol/sdk";

const sdk = createDtfSdk();
const address = "0x...";
const chainId = 8453;

try {
  await sdk.index.get({ address, chainId });
} catch (error) {
  if (isSdkError(error) && error.code === "RECORD_NOT_FOUND") {
    // handle known SDK error
  }
}
```

## Design

The SDK uses a small domain facade over a runtime client. One-off methods take plain inputs like `{ address, chainId }`. Repeated DTF workflows can use `sdk.index.ref({ address, chainId })`, which only binds identity and does not fetch by itself.

Do not add a class-based SDK surface unless there is a strong reason.

The intended model:

```text
namespace methods -> client -> small transports -> mappers
```

See [../../docs/sdk/architecture.md](../../docs/sdk/architecture.md).
