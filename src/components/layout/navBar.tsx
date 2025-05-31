import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "../ui/button";

export const Navbar = () => {
  const { data: session, status } = useSession();
  const role = session?.user.role;
  const normalizedRole = role?.toLowerCase();

  console.log("Session:", session);
  console.log("Role:", role);

  const dashboardPaths: Record<string, string> = {
    student: "/dashboard/murid",
    teacher: "/dashboard/guru",
    admin: "/dashboard/admin",
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-semibold text-primary">
          Absensi Smadip
        </Link>

        <div className="flex items-center gap-4">
          {status === "authenticated" &&
            normalizedRole &&
            dashboardPaths[normalizedRole] && (
              <Link href={dashboardPaths[normalizedRole]}>
                <Button variant="ghost" className="text-base">
                  Dashboard
                </Button>
              </Link>
            )}

          <Button
            onClick={session ? () => void signOut() : () => void signIn()}
            variant="default"
            className="text-base"
          >
            {session ? "Sign out" : "Sign in"}
          </Button>
        </div>
      </div>
    </nav>
  );
};
