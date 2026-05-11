import DecimalModule from "decimal.js-light";
import type {
  Decimal as DecimalInstance,
  Numeric,
} from "decimal.js-light";

type DecimalConstructor = {
  new(value: Numeric): DecimalInstance;
  readonly ROUND_DOWN: number;
};

export const Decimal = DecimalModule as unknown as DecimalConstructor;
