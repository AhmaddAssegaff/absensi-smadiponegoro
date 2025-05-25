import { useSearchParams } from "next/navigation";

export const useQueryParams = () => {
  const queryParams = useSearchParams();

  const currentLimit = Number(queryParams.get("limit") ?? "10");
  const currentPage = Number(queryParams.get("page") ?? "1");
  const currentSortBy = queryParams.get("sortBy") ?? "createdAt";
  const currentOrder = (queryParams.get("order") ?? "asc") as "asc" | "desc";

  const rawParams = Object.fromEntries(queryParams.entries());

  return {
    currentLimit,
    currentPage,
    currentSortBy,
    currentOrder,
    rawParams,
  };
};
