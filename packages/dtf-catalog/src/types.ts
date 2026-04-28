export type CatalogChainId = 1 | 56 | 8453 | 42161;

export type DTFCatalogStatus = "active" | "unsupported" | "deprecated";

export type DTFCatalogMap<T extends DTFCatalogItem = DTFCatalogItem> = Record<string, T>;

export type DTFCatalogByChain<T extends DTFCatalogItem = DTFCatalogItem> =
  Record<number, DTFCatalogMap<T>>;

export type DTFCatalogLinks = {
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

export type BaseDTFCatalogItem = DTFCatalogLinks & {
  readonly address: `0x${string}`;
  readonly chainId?: CatalogChainId;
  readonly decimals: number;
  readonly logo?: string;
  readonly name: string;
  readonly status: DTFCatalogStatus;
  readonly symbol: string;
  readonly about?: string;
};

export type YieldDTFCatalogItem = BaseDTFCatalogItem;

export type IndexDTFCatalogItem = BaseDTFCatalogItem & {
  readonly chainId: CatalogChainId;
  readonly tags?: readonly string[];
};

export type DTFCatalogItem = YieldDTFCatalogItem | IndexDTFCatalogItem;
