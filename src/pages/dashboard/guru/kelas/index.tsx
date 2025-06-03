import { PageContainer } from "@/components/layout/pageContainer";
import { SectionContiner } from "@/components/layout/sectionContiner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatClassNameToUrl } from "@/helper/classNameFormatter";
import { classNames } from "@/shared/constants/className";
import Link from "next/link";

export default function ListClassPage() {
  return (
    <PageContainer center variantBg="secondary">
      <SectionContiner>
        <div className="mb-6 text-center text-xl font-semibold">
          Pilih kelas untuk melihat daftar murid dan absensinya
        </div>

        <Card className="mx-auto w-full max-w-5xl transition hover:shadow-md">
          <CardContent className="grid grid-cols-2 gap-4 p-6 sm:grid-cols-2 xl:grid-cols-3">
            {classNames.map((className) => (
              <Link
                key={className}
                href={`/dashboard/guru/kelas/${formatClassNameToUrl(className)}`}
              >
                <Button className="w-full text-base">{className}</Button>
              </Link>
            ))}
          </CardContent>
        </Card>
      </SectionContiner>
    </PageContainer>
  );
}
