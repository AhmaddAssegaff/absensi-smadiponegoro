import { useSearchParams } from "next/navigation";

type Order = "asc" | "desc";
const DEFAULT_VALID_SORT_BY = [
  "name",
  "nisn",
  "role",
  "createdAt",
  "updatedAt",
  "status",
  "dateAttandance",
] as const;

interface useQueryParamsOptions<SortBy extends string> {
  validSortBy?: readonly SortBy[];
  defaultSortBy?: SortBy;
  defaultOrder?: Order;
  defaultLimit?: number;
  defaultPage?: number;
  defaultSearch?: string;
}

export const useQueryParams = <
  SortBy extends string = (typeof DEFAULT_VALID_SORT_BY)[number],
>({
  validSortBy = DEFAULT_VALID_SORT_BY as unknown as readonly SortBy[],
  defaultSortBy = "updatedAt" as SortBy,
  defaultOrder = "desc",
  defaultLimit = 10,
  defaultPage = 1,
  defaultSearch = "",
}: useQueryParamsOptions<SortBy> = {}) => {
  const queryParams = useSearchParams();

  const rawParams = Object.fromEntries(queryParams.entries());
  const sortByParam = queryParams.get("sortBy");
  const orderParam = queryParams.get("order");
  const searchParam = queryParams.get("search");

  const currentSearch = String(queryParams.get("search") ?? defaultSearch);
  const currentLimit = Number(queryParams.get("limit") ?? defaultLimit);
  const currentPage = Math.max(
    1,
    Number(queryParams.get("page") ?? defaultPage),
  );

  const currentSortBy: SortBy = validSortBy.includes(sortByParam as SortBy)
    ? (sortByParam as SortBy)
    : defaultSortBy;

  const validOrder: Order[] = ["asc", "desc"];
  const currentOrder: Order = validOrder.includes(orderParam as Order)
    ? (orderParam as Order)
    : defaultOrder;

  const orderedQuery = {
    page: String(currentPage),
    limit: String(currentLimit),
    sortBy: currentSortBy,
    order: currentOrder,
    searchParam,
  };

  return {
    currentPage,
    currentLimit,
    currentSortBy,
    currentOrder,
    currentSearch,
    orderedQuery,
    rawParams,
  };
};
