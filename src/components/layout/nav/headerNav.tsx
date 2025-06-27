import { Separator } from "@radix-ui/react-separator";
import { AuthButton } from "@/components/layout/nav/authButton";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";

export const HeaderNav = () => {
  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear">
      <div className="flex w-full items-center justify-between gap-2 px-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Link href={"/"}>
            <h1 className="text-foreground">SMA Absensi</h1>
          </Link>
        </div>
        <AuthButton />
      </div>
    </header>
  );
};
