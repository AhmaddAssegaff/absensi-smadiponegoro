export const buildOrderedQuery = (query: Record<string, string>) => {
  return {
    page: query.page ?? "1",
    limit: query.limit ?? "10",
    sortBy: query.sortBy ?? "createdAt",
    order: query.order ?? "asc",
  };
};
