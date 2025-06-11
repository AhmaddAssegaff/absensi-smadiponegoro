import { PageContainer } from "@/components/layout/pageContainer";
import { SectionContiner } from "@/components/layout/sectionContiner";
import { TableWrapper } from "@/components/layout/tableWrapper";
import { TableCell } from "@/components/ui/table";
import { useQueryParams } from "@/hooks/useQueryParams";
import { enumToLabel } from "@/helper/enumToLabel";
import { api } from "@/utils/api";
import type { Attendance } from "@/shared/types/trpc";

export default function DailyStatisticStudentPage() {
  const { currentPage, currentOrder, currentSortBy } = useQueryParams({
    defaultOrder: "desc",
    defaultSortBy: "createdAt",
  });

  const { data, isLoading, error } = api.student.GetAttendanceStudent.useQuery({
    page: currentPage,
    limit: 10,
    order: currentOrder,
    sortBy: currentSortBy,
  });

  const columns = [
    { key: "createdAt" as const, label: "Dibuat", sortable: true },
    { key: "status" as const, label: "Status", sortable: true },
    { key: "description" as const, label: "Deskripsi", sortable: false },
  ];

  const attendances = data?.data ?? [];

  const pagination = {
    total: data?.total ?? 0,
    page: data?.page ?? 1,
    totalPages: data?.totalPages ?? 1,
  };

  return (
    <PageContainer center variantBg={"secondary"}>
      <SectionContiner>
        <TableWrapper<Attendance>
          pagination={pagination}
          columns={columns}
          isLoading={isLoading}
          error={error?.message ?? ""}
          data={attendances}
        >
          {(attendance) => (
            <>
              <TableCell className="px-4 py-3">
                {new Date(attendance.createdAt).toLocaleDateString("id-ID")}
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
