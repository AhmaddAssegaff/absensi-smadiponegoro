import Link from "next/link";
import { PageContainer } from "@/components/layout/pageContainer";
import { SectionContiner } from "@/components/layout/sectionContiner";

export default function NotFoundPage() {
  return (
    <PageContainer center={true}>
      <SectionContiner>
        <div className="flex min-h-screen flex-col items-center justify-center bg-blue-600 p-6 text-center text-white">
          <h1 className="mb-4 text-4xl font-bold">
            404 - Halaman Tidak Ditemukan
          </h1>
          <p className="mb-6 text-lg">
            Oops! Halaman yang kamu cari tidak tersedia atau sudah dipindahkan.
          </p>
          <Link
            href="/"
            className="rounded-lg bg-white px-6 py-3 font-semibold text-blue-600 transition hover:bg-gray-100"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </SectionContiner>
    </PageContainer>
  );
}
