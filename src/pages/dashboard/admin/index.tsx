import { PageContainer } from "@/components/layout/pageContainer";
import { api } from "@/utils/api";

export default function DashboardAdminPage() {
  const {
    data: teacher,
    isLoading,
    error,
  } = api.admin.getAllTeacher.useQuery();
  return (
    <PageContainer>
      <h1>Dashboard admin Page</h1>
      <p>bisa CRUD guru murid</p>
    </PageContainer>
  );
}
