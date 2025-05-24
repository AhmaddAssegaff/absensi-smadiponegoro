import { GeistSans } from "geist/font/sans";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { Navbar } from "@/components/layout/navBar";
import { Footer } from "@/components/layout/footer";

import { api } from "@/utils/api";

import "@/styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Navbar />
      <main className={GeistSans.className}>
        <Component {...pageProps} />
      </main>
      <Footer />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
