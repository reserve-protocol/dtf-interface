# Revenue And Fees

Index DTF revenue starts with Folio fees and ends in configured recipients, DAO/platform fee recipients, vote-lock rewards, or ecosystem-level flows depending on deployment configuration.

## Fee Types

| Fee              | Meaning                                                                |
| ---------------- | ---------------------------------------------------------------------- |
| TVL fee          | Annualized fee charged against Folio supply over time                  |
| Mint fee         | Fee charged when new shares are minted                                 |
| Folio self-fee   | v6 mechanism for burning/not minting a portion of fee-recipient shares |
| DAO/platform fee | Protocol-level cut configured through the DAO fee registry             |

Contract maximums should be verified against current source before enforcing them in SDK validation.

## Pending Fee Shares

Folio accounts fees as pending shares.

Important behavior:

- `totalSupply()` includes pending fee shares.
- `distributeFees()` materializes pending shares to recipients.
- Pending shares affect share price and basket math.

SDK price/share calculations should use RPC `totalSupply()` when exact current supply matters.

## `distributeFees()`

Anyone can call `distributeFees()`.

The call:

- mints pending recipient shares to configured fee recipients.
- mints DAO/platform fee shares to the DAO fee recipient.
- can route all recipient-side shares to DAO if no fee recipients are configured.

Register shows pending fee shares and estimated USD value using current DTF price.

## Fee Recipients

Folio fee recipients are stored as recipient/portion pairs. Portions are D18 shares that should sum to `1e18` for the recipient side.

Register display adjusts recipient percentages to account for platform fee first. That means displayed governance/deployer/other shares are not always raw contract portions.

## Deploy And Settings Math

Register-style revenue distribution:

1. Validate raw recipient inputs before filtering zero shares.
2. Remove platform fee first.
3. Split the remaining denominator among governance, deployer, and additional recipients.
4. Sort recipients deterministically by address.
5. Adjust the final recipient so the D18 total is exact.

The SDK should reuse the same math for deploy and settings proposal builders.

## Vote-Lock Rewards

Governed Index DTFs can route fee rewards to a vote-lock vault. Vote-lock holders receive rewards as a governance participation benefit.

Reward accounting surfaces:

- Folio fee recipient table.
- staking vault reward token list.
- subgraph reward events and claims.
- Reserve API vote-lock position/APR aggregates.

## RSR Burn Relationship

Some Reserve ecosystem flows can direct value toward RSR burns. Do not describe all Index DTF fees as RSR burns.

To document or implement burn behavior, identify:

- token being burned.
- recipient/dead address.
- contract emitting transfer.
- whether the burn is configured as a fee recipient, protocol fee, or separate product mechanism.

## Source References

- `reserve-index-dtf/contracts/Folio.sol`
- `reserve-index-dtf/contracts/utils/FolioLib.sol`
- `reserve-index-dtf/contracts/folio/FolioDAOFeeRegistry.sol`
- `register/src/views/index-dtf/settings/components/index-settings-fees.tsx`
- `register/src/views/index-dtf/settings/components/distribute-fees.tsx`
- `register/src/views/index-dtf/deploy/utils/index.ts`
- `dtf-sdk/packages/sdk/src/index-dtf/governance/propose/revenue.ts`
- `dtf-sdk/packages/sdk/src/index-dtf/deploy/index.ts`

## Do Not Infer

- Do not treat displayed Register percentages as raw contract portions without checking platform-fee adjustment.
- Do not ignore pending fee shares in total-supply-sensitive math.
- Do not claim fees burn RSR unless the configured flow actually burns RSR.
