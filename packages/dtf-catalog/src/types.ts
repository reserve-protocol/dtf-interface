export type CatalogYieldDTF = {
  readonly address: `0x${string}`;
  readonly decimals: number;
  readonly logo?: string;
  readonly name: string;
  readonly createdAt: number;
  readonly status: "active" | "unsupported" | "deprecated";
  readonly symbol: string;
  readonly about?: string;
  readonly website?: string;
  readonly governance?: {
    readonly voting?: string;
    readonly discussion?: string;
  };
  readonly support?: {
    readonly email?: string;
    readonly url?: string;
  };
  readonly social?: {
    readonly blog?: string;
    readonly chat?: string;
    readonly facebook?: string;
    readonly forum?: string;
    readonly github?: string;
    readonly gitter?: string;
    readonly instagram?: string;
    readonly linkedin?: string;
    readonly reddit?: string;
    readonly slack?: string;
    readonly telegram?: string;
    readonly twitter?: string;
    readonly youtube?: string;
  };
};

export type CatalogIndexDTF = CatalogYieldDTF & {
  readonly chainId: 1 | 8453 | 56;
  readonly tags?: readonly string[];
};
