import { PageContainer } from "@/components/layout/pageContainer";
import { SectionContiner } from "@/components/layout/sectionContiner";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { enumValueToUrl, formatClassNameLabel } from "@/helper/enumFormatter";
import { api } from "@/utils/api";
import Link from "next/link";

export default function MyClassTeacherPage() {
  const { data: myClass, error, isLoading } = api.teacher.GetMyClass.useQuery();

  return (
    <PageContainer center variantBg="secondary">
      <SectionContiner>
        <div className="mb-6 text-center text-xl font-semibold">
          Kelas yang Anda ampu sebagai wali kelas
        </div>

        <CardContent className="mx-auto w-full max-w-4xl p-6">
          {isLoading && (
            <Card className="p-4">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="mt-2 h-4 w-3/4" />
              <Skeleton className="mt-1 h-4 w-1/2" />
            </Card>
          )}

          {!isLoading && error && (
            <div className="text-center text-red-500">
              Gagal memuat data kelas.
            </div>
          )}

          {!isLoading && !error && myClass && (
            <Link
              href={`/dashboard/guru/kelas-saya/${enumValueToUrl(myClass.ClassName)}`}
              className="rounded-xl transition hover:shadow-md"
            >
              <Card className="p-4">
                <div className="text-base font-semibold">
                  {formatClassNameLabel(myClass.ClassName)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Wali Kelas: {myClass.homeroom?.name ?? "-"}
                </div>
                <div className="text-sm text-muted-foreground">
                  {myClass._count.students} siswa
                </div>
              </Card>
            </Link>
          )}

          {!isLoading && !error && !myClass && (
            <div className="text-center text-muted-foreground">
              Anda belum menjadi wali kelas.
            </div>
          )}
        </CardContent>
      </SectionContiner>
    </PageContainer>
  );
}
