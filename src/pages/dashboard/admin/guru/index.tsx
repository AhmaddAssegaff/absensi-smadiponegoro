import { PageContainer } from "@/components/layout/pageContainer";
import { api } from "@/utils/api";
import { DataTable } from "./components/table";
import { SectionContiner } from "@/components/layout/sectionContiner";
import { useQueryParams } from "@/hooks/useQueryParams";

export default function ListTeacherAdminPage() {
  const { currentPage, currentSortBy, currentOrder } = useQueryParams({
    validSortBy: ["name", "nisn", "role", "updatedAt"],
    defaultSortBy: "updatedAt",
  });

  const { data, isLoading, error } = api.admin.GetAllTeacher.useQuery({
    limit: 10,
    page: currentPage,
    sortBy: currentSortBy,
    order: currentOrder,
  });

  return (
    <PageContainer center variantBg={"secondary"}>
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
          users={data?.data ?? []}
          Pagination={{
            page: data?.page ?? 1,
            total: data?.total ?? 0,
            totalPages: data?.totalPages ?? 1,
          }}
          isLoading={isLoading}
        />
      </SectionContiner>
    </PageContainer>
  );
}
