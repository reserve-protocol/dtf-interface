import { useCurrentIndexDtf } from "@/index-dtf/use-current-index-dtf";

export function useCurrentIndexDtfBasket() {
  return useCurrentIndexDtf().data?.basket;
}
