import { useSession } from "next-auth/react";
import { PageContainer } from "@/components/layout/pageContainer";
import { SectionContiner } from "@/components/layout/sectionContiner";
import { Navbar } from "@/components/layout/navBar";
import { Footer } from "@/components/layout/footer";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { data: sessionData, status } = useSession();

  return (
    <>
      <Navbar />
      <PageContainer center={true} variantBg={"secondary"}>
        <SectionContiner>
          <div className="flex flex-col items-center justify-center gap-6 text-center">
            <h1 className="text-3xl font-bold text-black">Selamat datang 👋</h1>

            {status === "loading" ? (
              <Skeleton className="h-6 w-60 rounded" />
            ) : sessionData ? (
              <>
                {" "}
                <p className="text-xl text-black">
                  Halo,
                  <span className="font-semibold">
                    {sessionData.user?.name}
                  </span>
                  !
                </p>
                <p className="text-lg text-gray-700">
                  Silakan Buka dashboard untuk lihat fitur aplikasi.
                </p>
              </>
            ) : (
              <p className="text-lg text-gray-700">
                Silakan Sign-In untuk mulai menggunakan aplikasi.
              </p>
            )}
          </div>
        </SectionContiner>
      </PageContainer>
      <Footer />
    </>
  );
}
