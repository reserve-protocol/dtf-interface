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

The SDK test is read-only. The fixture runner owns fork startup, deployments, upgrade transactions, and standard
governance deployment. The smoke independently matches each declared upgrade proposal to its on-chain
`ProposalCreated`/`ProposalExecuted` logs and executed Governor state. Run it after those transitions are mined:

```sh
RUN_INDEX_DTF_FORK_SMOKE=1 \
INDEX_DTF_FORK_MANIFEST=/absolute/path/to/fixture.json \
pnpm --filter @reserve-protocol/sdk test:smoke:index:fork
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
or `56`), even when the local RPC reports a development chain ID. No production Folio or v6 deployer address is built
into the harness. Normal unit tests collect the fork file as skipped unless the opt-in flag is set.

The write-path checks are read-only: standard Governor proposal ordering, executed upgrade-path log attestation,
v5/v6 `openAuction` calldata, the live v6 `startRebalance` next nonce/deadline, and the currently available v5 deploy
builder. They do not submit transactions or perform upgrades. Direct v6 deployment is not claimed because the SDK has
no v6 deployer configuration or public v6 deploy builder yet.

Execution readback is pinned to `stateBlock`. The generated fixture can have non-overlapping auction windows: the v5
auction is active at its current state timestamp while the v6 auction is successfully opened and scheduled. The smoke
therefore asserts v5 through `getActiveAuction`, v6 through `getLatestAuction` with `getActiveAuction === null` before
its declared start, and exact event/readback start, end, duration, nonce, ID, and token equality for both.

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
