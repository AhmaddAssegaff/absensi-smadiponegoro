import { PageContainer } from "@/components/layout/pageContainer";
import { api } from "@/utils/api";
import { SectionContiner } from "@/components/layout/sectionContiner";
import { useQueryParams } from "@/hooks/useQueryParams";
import { type Column, TableWrapper } from "@/components/layout/tableWrapper";
import { TableCell } from "@/components/ui/table";
import type { User } from "@/shared/types/trpc";

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

  const columns = [
    { key: "name", label: "Nama", sortable: true },
    { key: "nisn", label: "NISN / Kode Guru", sortable: true },
    { key: "role", label: "Role", sortable: true },
  ] satisfies Column<User>[];

  const users = data?.data ?? [];

  const pagination = {
    total: data?.total ?? 0,
    page: data?.page ?? 1,
    totalPages: data?.totalPages ?? 1,
  };

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
        <TableWrapper<User>
          columns={columns}
          data={users}
          isLoading={isLoading}
          error={error?.message}
          pagination={pagination}
        >
          {(user) => (
            <>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.nisn}</TableCell>
              <TableCell>{user.role}</TableCell>
            </>
          )}
        </TableWrapper>
      </SectionContiner>
    </PageContainer>
  );
}
