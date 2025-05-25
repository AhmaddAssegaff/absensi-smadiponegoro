import { PageContainer } from "@/components/layout/pageContainer";
import { api } from "@/utils/api";
import { DataTable } from "./components/table";
import { useSearchParams } from "next/navigation";

export default function DashboardAdminPage() {
  const queryParams = useSearchParams();

  const pageParam = Math.max(1, Number(queryParams.get("page") ?? "1"));
  const sortByParam = queryParams.get("sortBy");
  const orderParam = queryParams.get("order");

  const validSortBy = ["name", "createdAt", "updatedAt"] as const;
  const validOrder = ["asc", "desc"] as const;

  type SortBy = (typeof validSortBy)[number];
  type Order = (typeof validOrder)[number];

  const sortBy: SortBy = validSortBy.includes(sortByParam as SortBy)
    ? (sortByParam as SortBy)
    : "createdAt";

  const order: Order = validOrder.includes(orderParam as Order)
    ? (orderParam as Order)
    : "asc";

  const { data, isLoading, error } = api.admin.getAllTeacher.useQuery({
    limit: 10,
    page: pageParam,
    sortBy,
    order,
  });

  return (
    <PageContainer>
      <h1>Dashboard admin Page</h1>
      <p>bisa CRUD guru murid</p>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && (
        <DataTable
          Pagination={{
            page: data.page,
            total: data.total,
            totalPages: data.totalPages,
          }}
          users={data.data}
        />
      )}
    </PageContainer>
  );
}
