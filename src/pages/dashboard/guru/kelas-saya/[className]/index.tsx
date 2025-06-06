import { PageContainer } from "@/components/layout/pageContainer";
import { SectionContiner } from "@/components/layout/sectionContiner";
import { useRouter } from "next/router";
import type { ClassName } from "@/shared/constants/className";
import { urlToEnumValue } from "@/helper/enumFormatter";

export default function MyClassDetailTeacherPage() {
  const router = useRouter();
  const className = urlToEnumValue(router.query.className as ClassName);

  return (
    <PageContainer center variantBg={"secondary"}>
      <SectionContiner>
        <div>
          Page guru untuk CURD data absensi siswanya per keals atau per nanti di
          buat spesifik satu anak
        </div>
        <div>Ini detail untuk kelas: {className}</div>
      </SectionContiner>
    </PageContainer>
  );
}
