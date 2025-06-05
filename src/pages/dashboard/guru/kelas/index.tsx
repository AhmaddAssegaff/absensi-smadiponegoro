import { PageContainer } from "@/components/layout/pageContainer";
import { SectionContiner } from "@/components/layout/sectionContiner";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { enumValueToUrl, formatClassNameLabel } from "@/helper/enumFormatter";
import { api } from "@/utils/api";
import Link from "next/link";

export default function ListClassPage() {
  const {
    data: classes,
    isLoading,
    error,
  } = api.teacher.GetAllClass.useQuery();

  return (
    <PageContainer center variantBg="secondary">
      <SectionContiner>
        <div className="mb-6 text-center text-xl font-semibold">
          Pilih kelas untuk melihat daftar murid dan absensinya
        </div>
        <CardContent className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 p-6 sm:grid-cols-2 xl:grid-cols-3">
          {isLoading &&
            Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="space-y-2 p-4">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </Card>
            ))}

          {!isLoading &&
            !error &&
            classes?.map((kelas) => (
              <Link
                key={kelas.id}
                href={`/dashboard/guru/kelas/${enumValueToUrl(kelas.ClassName)}`}
                className="rounded-xl transition hover:shadow-md"
              >
                <Card className="p-4">
                  <div className="text-base font-semibold">
                    {formatClassNameLabel(kelas.ClassName)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Wali Kelas: {kelas.homeroom?.name ?? "-"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {kelas._count.students} siswa
                  </div>
                </Card>
              </Link>
            ))}
        </CardContent>

        {!isLoading && error && (
          <div className="py-6 text-center text-red-500">
            Gagal memuat data kelas.
          </div>
        )}
      </SectionContiner>
    </PageContainer>
  );
}
