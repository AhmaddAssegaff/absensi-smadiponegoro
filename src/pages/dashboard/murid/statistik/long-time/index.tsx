import { PageContainer } from "@/components/layout/pageContainer";
import { SectionContiner } from "@/components/layout/sectionContiner";
import { ChartPieLabel } from "@/components/layout/chartPieLabel";
import { api } from "@/utils/api";
import { Skeleton } from "@/components/ui/skeleton";

export default function longTimeStatisticStudentPage() {
  const {
    data: attendanceSummary,
    isLoading,
    error,
  } = api.student.GetAttendanceSummaryAllTime.useQuery();

  if (isLoading) {
    <Skeleton />;
  }

  const chartData = attendanceSummary
    ? [
        {
          name: "Hadir Tepat",
          value: attendanceSummary.hadirTepat,
          fill: "#22c55e",
        },
        {
          name: "Hadir Terlambat",
          value: attendanceSummary.hadirTerlambat,
          fill: "#4ade80",
        },
        { name: "Izin", value: attendanceSummary.izin, fill: "#f59e0b" },
        { name: "Sakit", value: attendanceSummary.sakit, fill: "#3b82f6" },
        { name: "Alpa", value: attendanceSummary.alpa, fill: "#ef4444" },
        {
          name: "Keluar Izin",
          value: attendanceSummary.keluarIzin,
          fill: "#a855f7",
        },
        {
          name: "Keluar Tanpa Izin",
          value: attendanceSummary.keluarTanpaIzin,
          fill: "#f87171",
        },
      ]
    : [];

  return (
    <PageContainer center variantBg={"secondary"}>
      <SectionContiner>
        <ChartPieLabel
          title="Attendance Summary"
          description="All-time Attendance"
          data={chartData}
          footerChartTitle=""
          footerChartDescription={`total hari: ${attendanceSummary?.totalHari}`}
        />
      </SectionContiner>
    </PageContainer>
  );
}
