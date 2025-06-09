import * as React from "react";
import { Bot, SquareTerminal, BarChart2 } from "lucide-react";
import { useSession } from "next-auth/react";

import { NavMain } from "@/components/layout/nav/nav-main";
import { Sidebar, SidebarContent, SidebarRail } from "@/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();
  if (!session) return null;
  const role = session?.user.role?.toLowerCase() ?? "";

  const sidebarData =
    role === "admin"
      ? [
          {
            title: "Dashboard",
            url: "/dashboard/admin",
            icon: SquareTerminal,
            isActive: true,
            items: [
              { title: "Buat Akun", url: "/dashboard/admin/buat-akun" },
              { title: "Kelas", url: "/dashboard/admin/kelas" },
              { title: "Guru", url: "/dashboard/admin/guru" },
            ],
          },
        ]
      : role === "teacher"
        ? [
            {
              title: "Dashboard",
              url: "/dashboard/guru",
              icon: SquareTerminal,
              isActive: true,
              items: [
                { title: "Kelas Saya", url: "/dashboard/guru/kelas-saya" },
                { title: "Semua Kelas", url: "/dashboard/guru/kelas" },
              ],
            },
            {
              title: "QR Code",
              url: "/dashboard/guru/qr",
              icon: Bot,
              items: [{ title: "Barcode QR", url: "/dashboard/guru/qr" }],
            },
          ]
        : role === "student"
          ? [
              {
                title: "Statistik",
                url: "/dashboard/murid/statistik",
                icon: BarChart2,
                items: [
                  { title: "Harian", url: "/dashboard/murid/statistik/harian" },
                  {
                    title: "Bulanan",
                    url: "/dashboard/murid/statistik/bulanan",
                  },
                  {
                    title: "Long Time",
                    url: "/dashboard/murid/statistik/long-time",
                  },
                ],
              },
              {
                title: "QR Code",
                url: "/dashboard/murid/scan",
                icon: Bot,
                items: [{ title: "Scan QR", url: "/dashboard/murid/scan" }],
              },
            ]
          : [];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain items={sidebarData} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
