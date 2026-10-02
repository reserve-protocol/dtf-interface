/** `UpgradeSpell_6_0_0`: the reviewed 5.0.0 → 6.0.0 migration spell (protocol commit 33c315690a71c826b5bcd01b69110f478ccd865d). */
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
