import { PageContainer } from "@/components/layout/pageContainer";
import { SectionContiner } from "@/components/layout/sectionContiner";

export default function ClassTeacherPage() {
  return (
    <PageContainer center={true} variantBg={"secondary"}>
      <SectionContiner>
        <div>
          page list kelas kalau di click muncul anak didiknya bisa lihat
          absesnsi tiap anak
        </div>
      </SectionContiner>
    </PageContainer>
  );
}
