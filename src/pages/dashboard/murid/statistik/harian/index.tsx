import { PageContainer } from "@/components/layout/pageContainer";
import { SectionContiner } from "@/components/layout/sectionContiner";
import { api } from "@/utils/api";

export default function dailyStatisticStudentPage() {
  const { data } = api.student.GetAttendanceStudent.useQuery({
    page: 1,
    limit: 10,
    order: "desc",
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
