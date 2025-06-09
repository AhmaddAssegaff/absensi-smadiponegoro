import Link from "next/link";
import { PageContainer } from "@/components/layout/pageContainer";
import { SectionContiner } from "@/components/layout/sectionContiner";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <PageContainer center={true} variantBg={"secondary"}>
      <SectionContiner>
        <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center text-black">
          <h1 className="mb-4 text-4xl font-bold">
            404 - Halaman Tidak Ditemukan
          </h1>
          <p className="mb-6 text-lg">
            Oops! Halaman yang kamu cari tidak tersedia atau sudah dipindahkan.
          </p>
          <Link href="/">
            <Button className="px-6 py-3 font-semibold" variant={"outline"}>
              Kembali ke Beranda
            </Button>
          </Link>
        </div>
      </SectionContiner>
    </PageContainer>
  );
}
