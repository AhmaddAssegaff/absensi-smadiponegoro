import { PageContainer } from "@/components/layout/pageContainer";
import { SectionContiner } from "@/components/layout/sectionContiner";
import { useQueryParams } from "@/hooks/useQueryParams";
import { useSetQueryParams } from "@/hooks/useSetQueryParams";
import { useRouter } from "next/router";
import { api } from "@/utils/api";

export default function StatsStudentPage() {
  const router = useRouter();
  const { setQueryParams } = useSetQueryParams();
  const { currentPage, currentSortBy, currentOrder } = useQueryParams();

  const {
    data: AttendanceStudent,
    isLoading,
    error,
  } = api.student.GetAttendanceStudent.useQuery({
    limit: 1,
    order: "desc",
    page: 1,
  });

  const { data: AttendanceStudentSummary } =
    api.student.GetAttendanceSummaryStudent.useQuery({
      months: 6,
      years: 2025,
    });

  const { data: AttendanceStudentSummaryAlltime } =
    api.student.GetAttendanceSummaryAllTime.useQuery();

  return (
    <PageContainer center={true} variantBg={"secondary"}>
      <SectionContiner>
        <div>Statistik muird individu page</div>
      </SectionContiner>
    </PageContainer>
  );
}
