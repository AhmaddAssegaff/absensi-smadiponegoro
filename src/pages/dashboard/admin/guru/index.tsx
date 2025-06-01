import { PageContainer } from "@/components/layout/pageContainer";
import { SectionContiner } from "@/components/layout/sectionContiner";

export default function ListTeacherPage() {
  return (
    <PageContainer center={true} variantBg={"secondary"}>
      <SectionContiner>
        <div>
          List dari kelas kelas kalau di click kelasnya bisa buka isi list muird
          dan bisa naikken kelas murid / tinggal
        </div>
      </SectionContiner>
    </PageContainer>
  );
}
