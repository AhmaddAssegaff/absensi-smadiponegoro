import { useState } from "react";
import { ChartPieLabel } from "@/components/layout/chartPieLabel";
import { PageContainer } from "@/components/layout/pageContainer";
import { SectionContiner } from "@/components/layout/sectionContiner";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/utils/api";
import { getYear } from "date-fns";

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

const MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

type AttendanceKey = keyof typeof LABEL_MAP;

export default function MonthStatisticStudentPage() {
  const now = new Date();
  const [month, setMonth] = useState(String(now.getMonth() + 1));
  const [year, setYear] = useState(String(now.getFullYear()));

  const thisYear = getYear(new Date());
  const yearOptions = Array.from({ length: 5 }, (_, i) => thisYear - 3 + i);

  const { data: attendanceMonthly, isLoading } =
    api.student.GetAttendanceSummaryStudent.useQuery({
      months: Number(month),
      years: Number(year),
    });

  const totalHari = attendanceMonthly?.totalHari ?? 0;

  const sortedKeys = (Object.keys(LABEL_MAP) as AttendanceKey[]).sort(
    (a, b) => {
      const valA = attendanceMonthly?.[a] ?? 0;
      const valB = attendanceMonthly?.[b] ?? 0;
      return valB - valA;
    },
  );

  return (
    <PageContainer center variantBg="secondary">
      <SectionContiner>
        <div className="mb-4">
          <h1 className="text-xl font-semibold">Catatan Kehadiran Bulanan</h1>
          <div className="mt-4 flex items-center gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Bulan</label>
              <Select value={month} onValueChange={setMonth}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Pilih bulan" />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((name, index) => (
                    <SelectItem key={index + 1} value={String(index + 1)}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Tahun</label>
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Pilih tahun" />
                </SelectTrigger>
                <SelectContent>
                  {yearOptions.map((y) => (
                    <SelectItem key={y} value={String(y)}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {totalHari > 0 ? (
            <p className="mt-4">Total Hari: {totalHari}</p>
          ) : (
            <p className="mt-4 text-sm italic text-muted-foreground">
              Belum ada catatan di bulan ini.
            </p>
          )}
        </div>

        {isLoading || !attendanceMonthly ? (
          <Skeleton />
        ) : (
          <section>
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
        )}
      </SectionContiner>
    </PageContainer>
  );
}
