import { PageContainer } from "@/components/layout/pageContainer";
import { SectionContiner } from "@/components/layout/sectionContiner";
import { useRouter } from "next/router";
import type { ClassName } from "@/shared/constants/className";
import { formatClassNameLabel, urlToEnumValue } from "@/helper/enumFormatter";
import { api } from "@/utils/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PickOneDate } from "@/components/layout/pickOneDate";
import { useState } from "react";
import { dateFormater, enumToLabel } from "@/helper";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function MyClassDetailTeacherPage() {
  const router = useRouter();
  const className = urlToEnumValue(router.query.className as ClassName);
  const [date, setDate] = useState<Date>();

  const {
    data: detailClass,
    isLoading,
    error,
  } = api.teacher.GetMyClassByClassName.useQuery(
    { className: className as ClassName, date: date?.toISOString() },
    { enabled: !!className },
  );

  return (
    <PageContainer center variantBg="secondary">
      <SectionContiner>
        <div className="space-y-6">
          {detailClass && (
            <Card className="p-6">
              <CardHeader>
                <div className="space-y-1 text-center">
                  <h1 className="text-2xl font-bold">
                    {formatClassNameLabel(detailClass.ClassName)}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Wali Kelas:{" "}
                    <span className="font-medium text-black">
                      {detailClass.homeroom?.name ?? "-"}
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Jumlah Siswa:{" "}
                    <span className="font-medium text-black">
                      {detailClass._count.students}
                    </span>
                  </p>
                </div>
              </CardHeader>
            </Card>
          )}

          <Card className="p-6">
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-lg font-semibold">Daftar Siswa</h2>
                <PickOneDate date={date} setDate={setDate} />
              </div>

              <div className="w-full overflow-x-auto">
                <Table className="min-w-[600px]">
                  <TableCaption>Daftar absensi siswa</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[200px]">Nama</TableHead>
                      <TableHead className="min-w-[180px]">
                        Absensi Pada Hari
                      </TableHead>
                      <TableHead className="min-w-[120px]">Status</TableHead>
                      <TableHead className="min-w-[240px]">Deskripsi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell>
                            <Skeleton className="h-4 w-40" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-32" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-24" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-52" />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : error ? (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center text-red-500"
                        >
                          Terjadi kesalahan:{" "}
                          {error.data?.httpStatus ?? "Unknown"}{" "}
                          {error.data?.code ?? "Unknown"}
                        </TableCell>
                      </TableRow>
                    ) : detailClass?.students.length ? (
                      detailClass.students.map((student) => {
                        const attendance = student.attendances[0];
                        return (
                          <TableRow key={student.id}>
                            <TableCell className="font-medium">
                              {student.name}
                            </TableCell>
                            <TableCell>
                              {attendance?.dateAttandance
                                ? dateFormater(attendance.dateAttandance)
                                : "-"}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  attendance?.status === "ALPA" ||
                                  attendance?.status === "HADIR_TERLAMBAT"
                                    ? "destructive"
                                    : "secondary"
                                }
                              >
                                {enumToLabel(attendance?.status ?? "") ??
                                  "Belum ada keterangan"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {attendance?.description ?? "-"}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center text-muted-foreground"
                        >
                          Tidak ada data siswa.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </SectionContiner>
    </PageContainer>
  );
}
