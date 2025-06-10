import { ChartPieLabel } from "@/components/layout/chartPieLabel";
import { PageContainer } from "@/components/layout/pageContainer";
import { SectionContiner } from "@/components/layout/sectionContiner";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/utils/api";

const COLOR_MAP = {
  hadirTepat: "#22c55e",
  hadirTerlambat: "#4ade80",
  izin: "#f59e0b",
  sakit: "#3b82f6",
  alpa: "#ef4444",
  keluarIzin: "#a855f7",
  keluarTanpaIzin: "#f87171",
} as const;

const LABEL_MAP = {
  hadirTepat: "Hadir Tepat",
  hadirTerlambat: "Hadir Terlambat",
  izin: "Izin",
  sakit: "Sakit",
  alpa: "Alpa",
  keluarIzin: "Keluar Izin",
  keluarTanpaIzin: "Keluar Tanpa Izin",
} as const;

type AttendanceKey = keyof typeof LABEL_MAP;

export default function monthStatisticStudentPage() {
  const { data: attendanceMonthly, isLoading } =
    api.student.GetAttendanceSummaryStudent.useQuery({
      months: 6,
      years: 2025,
    });

  if (isLoading || !attendanceMonthly) {
    return <Skeleton />;
  }

  const totalHari = attendanceMonthly.totalHari;

  const sortedKeys = (Object.keys(LABEL_MAP) as AttendanceKey[]).sort(
    (a, b) => {
      const valA = attendanceMonthly[a] ?? 0;
      const valB = attendanceMonthly[b] ?? 0;
      return valB - valA;
    },
  );

  return (
    <PageContainer center variantBg="secondary">
      <SectionContiner>
        <div className="mb-4">
          <h1>
            Catatan Bulan Ini - {attendanceMonthly.month}/
            {attendanceMonthly.year}
          </h1>
          <p>Total Hari: {totalHari}</p>
        </div>

        <section className="">
          {sortedKeys.map((key) => {
            const value = attendanceMonthly[key];
            const percentage =
              totalHari >= 1 ? ((value / totalHari) * 100).toFixed(1) : "0.0";

            const chartData =
              value > 0
                ? [
                    {
                      name: LABEL_MAP[key],
                      value,
                      fill: COLOR_MAP[key],
                    },
                    {
                      name: "Sisa",
                      value: Math.max(totalHari - value, 0),
                      fill: "#e5e7eb",
                    },
                  ]
                : [
                    {
                      name: "Sisa",
                      value: totalHari,
                      fill: "#e5e7eb",
                    },
                  ];

            return (
              <ChartPieLabel
                key={key}
                title={LABEL_MAP[key]}
                description={`${value} dari ${totalHari} hari`}
                data={chartData}
                footerChartTitle=""
                footerChartDescription={`Persentase: ${percentage}%`}
              />
            );
          })}
        </section>
      </SectionContiner>
    </PageContainer>
  );
}
