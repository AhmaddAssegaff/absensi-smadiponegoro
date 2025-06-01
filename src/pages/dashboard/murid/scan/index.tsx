import { PageContainer } from "@/components/layout/pageContainer";
import { SectionContiner } from "@/components/layout/sectionContiner";

export default function StudentScanPage() {
  return (
    <PageContainer center={true} variantBg={"secondary"}>
      <SectionContiner>
        <div>Page Scan QR code untuk absen</div>
      </SectionContiner>
    </PageContainer>
  );
}
