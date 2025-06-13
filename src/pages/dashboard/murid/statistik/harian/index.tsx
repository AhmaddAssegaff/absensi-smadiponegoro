import { PageContainer } from "@/components/layout/pageContainer";
import { SectionContiner } from "@/components/layout/sectionContiner";
import { type Column, TableWrapper } from "@/components/layout/tableWrapper";
import { TableCell } from "@/components/ui/table";
import { useQueryParams } from "@/hooks/useQueryParams";
import { enumToLabel } from "@/helper/enumToLabel";
import { dateFormater } from "@/helper/dateFormatter";
import { api } from "@/utils/api";
import type { Attendance } from "@/shared/types/trpc";

export default function DailyStatisticStudentPage() {
  const { currentPage, currentOrder, currentSortBy } = useQueryParams({
    defaultOrder: "desc",
    defaultSortBy: "dateAttandance",
  });

  const { data, isLoading, error } = api.student.GetAttendanceStudent.useQuery({
    page: currentPage,
    limit: 10,
    order: currentOrder,
    sortBy: currentSortBy,
  });

  const columns = [
    {
      key: "dateAttandance" as const,
      label: "Absensi Pada hari",
      sortable: true,
    },
    { key: "status" as const, label: "Status", sortable: true },
    { key: "description" as const, label: "Deskripsi", sortable: false },
  ] satisfies Column<Attendance>[];

  const attendances = data?.data ?? [];

  const pagination = {
    total: data?.total ?? 0,
    page: data?.page ?? 1,
    totalPages: data?.totalPages ?? 1,
  };

  return (
    <PageContainer center variantBg={"secondary"}>
      <SectionContiner>
        <div className="my-4 text-center">
          <h1>Daftar Absensi Perhari</h1>
        </div>
        <TableWrapper<Attendance>
          pagination={pagination}
          columns={columns}
          isLoading={isLoading}
          error={error?.message}
          data={attendances}
        >
          {(attendance) => (
            <>
              <TableCell className="px-4 py-3">
                {dateFormater(attendance.dateAttandance) || "-"}
              </TableCell>
              <TableCell className="px-4 py-3 capitalize">
                {enumToLabel(attendance.status)}
              </TableCell>
              <TableCell className="px-4 py-3">
                {attendance.description || "-"}
              </TableCell>
            </>
          )}
        </TableWrapper>
      </SectionContiner>
    </PageContainer>
  );
}
