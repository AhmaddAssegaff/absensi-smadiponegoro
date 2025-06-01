import { PageContainer } from "@/components/layout/pageContainer";
import { SectionContiner } from "@/components/layout/sectionContiner";

export default function MyClassTeacherPage() {
  return (
    <PageContainer center={true} variantBg={"secondary"}>
      <SectionContiner>
        <div>
          page isinya guru kalau jadi walikelas akan muncul di sini anak
          didiknya
        </div>
      </SectionContiner>
    </PageContainer>
  );
}
