import { GeistSans } from "geist/font/sans";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { Toaster } from "@/components/ui/toaster";
import { AppSidebar } from "@/components/layout/nav/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { HeaderNav } from "@/components/layout/nav/headerNav";
import { api } from "@/utils/api";

import "@/styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <SidebarProvider className={GeistSans.className}>
        <AppSidebar />
        <SidebarInset>
          <HeaderNav />
          <main>
            <Component {...pageProps} />
            <Toaster />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
