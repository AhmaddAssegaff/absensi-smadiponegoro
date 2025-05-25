import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "../ui/button";
import Link from "next/link";

export const Navbar = () => {
  const { data: sessionData } = useSession();

  const roleUser = sessionData?.user.role;

  const roleDashboardMap: Record<string, string> = {
    student: "/dashboard/murid",
    teacher: "/dashboard/guru",
    admin: "/dashboard/admin",
  };

  const dashboardUrl = roleUser ? roleDashboardMap[roleUser] : "/";

  return (
    <>
      <nav className="pageContainerBG-primary container sticky top-0 z-40 w-full border-b text-2xl shadow-md">
        <div className="mx-auto flex items-center justify-between px-6 py-4">
          <h1>Navbar</h1>
          {/* {sessionData && roleUser && dashboardUrl && ( */}
          {/* <Link href={dashboardUrl} className="text-black"> */}
          <Button className="text-black" variant={"link"}>
            Dashboard
          </Button>
          {/* </Link> */}
          {/* )} */}
          <Button
            variant={"link"}
            className="text-2xl text-black"
            onClick={sessionData ? () => void signOut() : () => void signIn()}
          >
            {sessionData ? "Sign out" : "Sign in"}
          </Button>
        </div>
      </nav>
    </>
  );
};
