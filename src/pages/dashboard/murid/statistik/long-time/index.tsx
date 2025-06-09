import { PageContainer } from "@/components/layout/pageContainer";
import { SectionContiner } from "@/components/layout/sectionContiner";
import { api } from "@/utils/api";

export default function longTimeStatisticStudentPage() {
  const { data } = api.student.GetAttendanceSummaryAllTime.useQuery();

  console.log(data);

  return (
    <PageContainer center variantBg={"secondary"}>
      <SectionContiner>
        <div></div>
      </SectionContiner>
    </PageContainer>
  );
}
