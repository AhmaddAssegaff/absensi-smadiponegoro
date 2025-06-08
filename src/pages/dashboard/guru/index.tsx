import { PageContainer } from "@/components/layout/pageContainer";
import { SectionContiner } from "@/components/layout/sectionContiner";

export default function DashboardTeacherPage() {
  return (
    <PageContainer center={true} variantBg={"secondary"}>
      <SectionContiner>
        <h1>Dashboard Guru Page</h1>
        <p>guru biasa Read data semua anak dari kelas 10-12</p>
        <p>jika guru adalah wali kelas maka bisa CRU semua anak didiknya</p>
      </SectionContiner>
    </PageContainer>
  );
}
