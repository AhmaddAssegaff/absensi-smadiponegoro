import { useSearchParams } from "next/navigation";

const DEFAULT_LIMIT = 10;
const DEFAULT_PAGE = 1;
const DEFAULT_SORT_BY = "updatedAt";
const DEFAULT_ORDER: "asc" | "desc" = "desc";

const VALID_SORT_BY = ["name", "nisn", "role", "updatedAt"] as const;
const VALID_ORDER = ["asc", "desc"] as const;

type SortBy = (typeof VALID_SORT_BY)[number];
type Order = (typeof VALID_ORDER)[number];

export const useReadPaginationSort = () => {
  const queryParams = useSearchParams();

  const rawParams = Object.fromEntries(queryParams.entries());

  const currentLimit = Number(queryParams.get("limit") ?? DEFAULT_LIMIT);
  const currentPage = Math.max(
    1,
    Number(queryParams.get("page") ?? DEFAULT_PAGE),
  );
  const sortByParam = queryParams.get("sortBy");
  const orderParam = queryParams.get("order");

  const currentSortBy: SortBy = VALID_SORT_BY.includes(sortByParam as SortBy)
    ? (sortByParam as SortBy)
    : DEFAULT_SORT_BY;

  const currentOrder: Order = VALID_ORDER.includes(orderParam as Order)
    ? (orderParam as Order)
    : DEFAULT_ORDER;

  const orderedQuery = {
    page: String(currentPage),
    limit: String(currentLimit),
    sortBy: currentSortBy,
    order: currentOrder,
  };

  return {
    currentPage,
    currentLimit,
    currentSortBy,
    currentOrder,
    orderedQuery,
    rawParams,
  };
};
