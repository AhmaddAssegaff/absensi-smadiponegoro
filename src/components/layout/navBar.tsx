import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const dashboardMenus: Record<
  string,
  {
    basePath: string;
    menus: { label: string; path: string; showOn?: string[] }[];
  }
> = {
  admin: {
    basePath: "/dashboard/admin",
    menus: [
      { label: "Buat Akun", path: "/dashboard/admin/buat-akun" },
      { label: "Kelas", path: "/dashboard/admin/kelas" },
      { label: "Guru", path: "/dashboard/admin/guru" },
    ],
  },
  teacher: {
    basePath: "/dashboard/guru",
    menus: [
      { label: "Kelas Saya", path: "/dashboard/guru/kelas-saya" },
      { label: "Semua Kelas", path: "/dashboard/guru/kelas" },
      { label: "QR", path: "/dashboard/guru/qr" },
    ],
  },
  student: {
    basePath: "/dashboard/murid",
    menus: [
      { label: "Scan", path: "/dashboard/murid/scan" },
      { label: "Statistik", path: "/dashboard/murid/statistik" },
    ],
  },
};

export const Navbar = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = router.pathname;

  const role = session?.user.role?.toLowerCase() ?? "";
  const dashboard = dashboardMenus[role];

  const isOnDashboard = pathname.startsWith("/dashboard");
  const homeHref = isOnDashboard && dashboard ? dashboard.basePath : "/";

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link href={homeHref} className="text-xl font-semibold text-primary">
          Absensi Smadip
        </Link>

        <div className="flex items-center gap-4">
          {status === "authenticated" && dashboard && !isOnDashboard && (
            <Link href={dashboard.basePath}>
              <Button variant="ghost" className="text-base">
                Dashboard
              </Button>
            </Link>
          )}

          {isOnDashboard &&
            dashboard?.menus.map((menu, index) => (
              <div key={menu.path} className="flex items-center gap-2">
                <Link href={menu.path}>
                  <Button
                    variant={pathname === menu.path ? "default" : "ghost"}
                    className="text-base"
                  >
                    {menu.label}
                  </Button>
                </Link>
                {index < dashboard.menus.length - 1 && (
                  <Separator orientation="vertical" className="h-6" />
                )}
              </div>
            ))}

          {!isOnDashboard && (
            <Separator orientation="vertical" className="h-6" />
          )}

          {!isOnDashboard && (
            <Button
              onClick={session ? () => void signOut() : () => void signIn()}
              variant="default"
              className="text-base"
            >
              {session ? "Sign out" : "Sign in"}
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};
