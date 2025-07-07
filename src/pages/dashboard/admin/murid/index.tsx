import { PageContainer } from "@/components/layout/pageContainer";
import { SectionContiner } from "@/components/layout/sectionContiner";
import { useQueryParams } from "@/hooks/useQueryParams";
import { api } from "@/utils/api";
import { type Column, TableWrapper } from "@/components/layout/tableWrapper";
import { TableCell } from "@/components/ui/table";
import type { GetAllStudentsOutput } from "@/shared/types/trpc";
import { Input } from "@/components/ui/input";
import { dateFormater } from "@/helper";

export default function ListStudentsAdminPage() {
  const { currentPage, currentSortBy, currentOrder } = useQueryParams({
    validSortBy: ["name", "nisn", "role", "updatedAt"],
    defaultSortBy: "updatedAt",
  });

  const { data, isLoading, error } = api.admin.GetAllStudents.useQuery({
    limit: 10,
    page: currentPage,
    sortBy: currentSortBy,
    order: currentOrder,
  });

  console.log(data);

  const columns = [
    { key: "name", label: "Nama", sortable: true },
    { key: "classesAsStudent", label: "kelas", sortable: false },
    { key: "nisn", label: "NISN", sortable: true },
    { key: "role", label: "Role", sortable: true },
    { key: "updatedAt", label: "terakhir di ubah", sortable: true },
  ] satisfies Column<GetAllStudentsOutput>[];

  const students = data?.data ?? [];

  const pagination = {
    total: data?.total ?? 0,
    page: data?.page ?? 1,
    totalPages: data?.totalPages ?? 1,
  };

  return (
    <PageContainer center variantBg={"secondary"}>
      <SectionContiner>
        <div className="mb-6 space-y-4 text-center">
          <h1 className="mb-1 text-3xl font-bold text-foreground">
            List Siswa
          </h1>
          <p className="text-muted-foreground">
            Lihat semua data siswa dengan fitur sorting dan pagination click
            judul table untuk sorting.
          </p>
          <Input type="search" placeholder="Cari Nama muird" />
        </div>
        <TableWrapper<GetAllStudentsOutput>
          columns={columns}
          data={students}
          isLoading={isLoading}
          error={error?.message}
          pagination={pagination}
        >
          {(student) => (
            <>
              <TableCell>{student.name}</TableCell>
              <TableCell>{student.classesAsStudent?.ClassName}</TableCell>
              <TableCell>{student.nisn}</TableCell>
              <TableCell>{student.role}</TableCell>
              <TableCell>{dateFormater(student.updatedAt)}</TableCell>
            </>
          )}
        </TableWrapper>
      </SectionContiner>
    </PageContainer>
  );
}
