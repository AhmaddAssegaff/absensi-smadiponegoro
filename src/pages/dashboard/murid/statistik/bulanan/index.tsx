import { PageContainer } from "@/components/layout/pageContainer";
import { SectionContiner } from "@/components/layout/sectionContiner";
import { api } from "@/utils/api";

export default function monthStatisticStudentPage() {
  const { data } = api.student.GetAttendanceSummaryStudent.useQuery({
    months: 6,
    years: 2025,
  });

  console.log(data);

  return (
    <PageContainer center variantBg={"secondary"}>
      <SectionContiner>
        <div></div>
      </SectionContiner>
    </PageContainer>
  );
}
