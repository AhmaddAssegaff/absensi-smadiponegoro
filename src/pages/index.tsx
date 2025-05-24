import { signIn, signOut, useSession } from "next-auth/react";
import { PageContainer } from "@/components/layout/pageContainer";
import { Button } from "@/components/ui/button";
import { SectionContiner } from "@/components/layout/sectionContiner";

export default function Home() {
  const { data: sessionData } = useSession();

  return (
    <PageContainer center={false} variantBg={"secondary"}>
      <SectionContiner>
        <h1>tess index page</h1>
        <div className="flex flex-col items-center justify-center gap-4">
          <p className="text-center text-2xl text-black">
            {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
          </p>
          <Button
            variant={"link"}
            onClick={sessionData ? () => void signOut() : () => void signIn()}
          >
            {sessionData ? "Sign out" : "Sign in"}
          </Button>
        </div>
      </SectionContiner>
    </PageContainer>
  );
}
