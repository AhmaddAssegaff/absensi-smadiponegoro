import { PageContainer } from "@/components/layout/pageContainer";
import { SectionContiner } from "@/components/layout/sectionContiner";
import { useQueryParams } from "@/hooks/useQueryParams";
import { useRouter } from "next/router";

export default function DetailClassPage() {
  const { rawParams } = useQueryParams();
  const router = useRouter();
  const { className } = router.query;

  console.log("className dari URL:", className);
  console.log("query string:", rawParams);

  return (
    <PageContainer center={true} variantBg={"secondary"}>
      <SectionContiner>
        <div>
          Page isinya semua anak anak dari {className} lalu bisa lihat hari ini
          absensinya gimana tarus bisa total mninggu in, bulan ini
        </div>
        <div>
          lalu bisa di lcik ngarah ke detail 1 anak isinya absneisnya data
          statistik dll
        </div>
      </SectionContiner>
    </PageContainer>
  );
}
