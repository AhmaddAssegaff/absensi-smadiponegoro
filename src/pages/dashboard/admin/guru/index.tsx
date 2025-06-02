import { PageContainer } from "@/components/layout/pageContainer";
import { api } from "@/utils/api";
import { DataTable } from "./components/table";
import { useSearchParams } from "next/navigation";
import { SectionContiner } from "@/components/layout/sectionContiner";

export default function ListTeacherAdminPage() {
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
    : "desc";

  const { data, isLoading, error } = api.admin.GetAllTeacher.useQuery({
    limit: 10,
    page: pageParam,
    sortBy,
    order,
  });

  return (
    <PageContainer center={true} variantBg={"secondary"}>
      <SectionContiner>
        <div className="mb-6 text-center">
          <h1 className="mb-1 text-3xl font-bold text-foreground">
            List User Teacher & Admin
          </h1>
          <p className="text-muted-foreground">
            Lihat informasi User secara ringkas.
          </p>
        </div>
        {error && <p>Error: {error.message}</p>}
        <DataTable
          isLoading={isLoading}
          Pagination={
            data
              ? {
                  page: data.page,
                  total: data.total,
                  totalPages: data.totalPages,
                }
              : {
                  page: 1,
                  total: 0,
                  totalPages: 1,
                }
          }
          users={data?.data ?? []}
        />
      </SectionContiner>
    </PageContainer>
  );
}
