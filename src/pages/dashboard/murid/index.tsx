import { PageContainer } from "@/components/layout/pageContainer";
import { SectionContiner } from "@/components/layout/sectionContiner";
import { api } from "@/utils/api";

export default function DashboardGuruPage() {
  const { data, isLoading, error } =
    api.student.GetAttendanceStudent.useQuery();

  console.log(data);
  return (
    <PageContainer center={true} variantBg={"secondary"}>
      <SectionContiner>
        <h1>Dashboard Murid Page</h1>
        <p>
          muird bisa lihat datar absensinya dan keterangannya dirinya sendiri
        </p>
      </SectionContiner>
    </PageContainer>
  );
}
