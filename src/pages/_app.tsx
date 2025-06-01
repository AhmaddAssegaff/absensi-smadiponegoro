import { GeistSans } from "geist/font/sans";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { Toaster } from "@/components/ui/toaster";

import { api } from "@/utils/api";

import "@/styles/globals.css";
import { Navbar } from "@/components/layout/navBar";
import { useRouter } from "next/router";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const router = useRouter();
  const { pathname } = router;

  const noNavbarRoutes = ["/sign-in", "/404"];

  const hideNavbar = noNavbarRoutes.includes(pathname);
  return (
    <SessionProvider session={session}>
      <main className={GeistSans.className}>
        {!hideNavbar && <Navbar />}
        <Component {...pageProps} />
        <Toaster />
      </main>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
