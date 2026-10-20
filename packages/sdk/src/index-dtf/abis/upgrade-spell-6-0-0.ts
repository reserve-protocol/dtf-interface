/** `UpgradeSpell_6_0_0`: the 5.0.0 → 6.0.0 migration spell (deployed bytecode matches reserve-index-dtf e4547b3, PR #212). */
export const upgradeSpell600Abi = [
  {
    type: "function",
    name: "cast",
    inputs: [
      { name: "folio", type: "address" },
      { name: "proxyAdmin", type: "address" },
      { name: "selectorRegistry", type: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "version",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
    stateMutability: "pure",
  },
  {
    type: "error",
    name: "UpgradeSpell__Error",
    inputs: [{ name: "code", type: "uint256" }],
  },
] as const;

/** Deployed `UpgradeSpell_6_0_0` per chain. */
export const INDEX_DTF_UPGRADE_SPELL_6_0_0_ADDRESS = {
  1: "0x10479dE3B197eD50A1B5BA86cc2EC16F620f06dA",
  8453: "0x4bCd4101729C25F4e65B29357387440e357D43c1",
  56: "0x47df1465672bFc4dC83f712531F7Eb1D658C0B66",
} as const;
