import { PageContainer } from "@/components/layout/pageContainer";
import { SectionContiner } from "@/components/layout/sectionContiner";

export default function CreateAccountPage() {
  return (
    <PageContainer center={true} variantBg={"secondary"}>
      <SectionContiner>
        <div>Form bikin akun bisa pilih role guru admin student</div>
      </SectionContiner>
    </PageContainer>
  );
}
