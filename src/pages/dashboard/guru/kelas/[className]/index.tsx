import { PageContainer } from "@/components/layout/pageContainer";
import { SectionContiner } from "@/components/layout/sectionContiner";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import type { ClassName } from "@/shared/constants/className";
import { urlToEnumValue, formatClassNameLabel } from "@/helper/enumFormatter";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { PickOneDate } from "@/components/layout/pickOneDate";
import { useState } from "react";

export default function DetailClassPage() {
  const router = useRouter();
  const className = urlToEnumValue(router.query.className as ClassName);
  const [date, setDate] = useState<Date>();

  const {
    data: detailClass,
    isLoading,
    error,
  } = api.teacher.GetClassByClassName.useQuery(
    { className: className as ClassName, date: date?.toISOString() },
    { enabled: !!className },
  );

  return (
    <PageContainer center variantBg="secondary">
      <SectionContiner>
        {isLoading ? (
          <Card className="space-y-4 p-6">
            <div className="text-center">
              <Skeleton className="mx-auto h-6 w-1/2" />
            </div>

            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-12" />
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-36" />
            </div>

            <div className="mt-6 space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </Card>
        ) : error ? (
          <Card className="space-y-4 p-6 text-center">
            <div className="space-y-1 text-red-500">
              <div className="font-semibold">Terjadi kesalahan</div>
              <div className="text-xs text-muted-foreground">
                http Status: {error.data?.httpStatus}
              </div>
              <div className="text-xs text-muted-foreground">
                Kode: {error.data?.code}
              </div>
            </div>
          </Card>
        ) : detailClass ? (
          <Card className="space-y-6 p-6">
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

            <Separator />

            <CardContent>
              <div className="my-4 space-y-4">
                <div className="flex items-center justify-center space-x-4">
                  <h2 className="text-lg font-semibold">Statistik Absensi</h2>

                  <PickOneDate date={date} setDate={setDate} />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <Card className="bg-muted p-4 text-center">
                    <CardTitle className="text-sm text-muted-foreground">
                      Kehadiran
                    </CardTitle>
                    <p className="text-xl font-bold text-black">-</p>
                  </Card>
                  <Card className="bg-muted p-4 text-center">
                    <CardTitle className="text-sm text-muted-foreground">
                      Ketidak Hadiran
                    </CardTitle>
                    <p className="text-xl font-bold text-black">-</p>
                  </Card>
                  <Card className="bg-muted p-4 text-center">
                    <CardTitle className="text-sm text-muted-foreground">
                      Belum Ada Keterangan
                    </CardTitle>
                    <p className="text-xl font-bold text-black">-</p>
                  </Card>
                </div>
              </div>

              <Separator />

              <div className="my-4 space-y-4">
                <h2 className="mb-4 text-center text-lg font-semibold">
                  Daftar Siswa
                </h2>

                <div>
                  {detailClass.students.map((student) => (
                    <Card key={student.id} className="p-4">
                      <div className="mb-2">
                        <h3 className="text-md font-semibold text-black">
                          Nama : {student.name}
                        </h3>
                      </div>

                      {student.attendances.length > 0 ? (
                        <div className="space-y-2">
                          {student.attendances.map((a) => (
                            <Card key={a.id} className="bg-muted p-3 text-sm">
                              <p>
                                Status: <Badge>{a.status}</Badge>
                              </p>
                              <p>
                                Tanggal: {new Date(a.date).toLocaleDateString()}
                              </p>
                              {a.description && (
                                <p>Keterangan: {a.description}</p>
                              )}
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Belum ada data absensi.
                        </p>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="text-center text-muted-foreground">
            Data kelas tidak ditemukan.
          </div>
        )}
      </SectionContiner>
    </PageContainer>
  );
}
