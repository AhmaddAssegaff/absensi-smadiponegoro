import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const secret = process.env.AUTH_SECRET;

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret });
  const pathname = request.nextUrl.pathname;

  const isNotAuthenticated = !token;

  if (isNotAuthenticated) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  const role = token.role;

  const isStudent = role === "STUDENT";
  const isTeacher = role === "TEACHER";
  const isAdmin = role === "ADMIN";

  const dashboardStudent = pathname.startsWith("/dashboard/murid");
  const dashboardTeacher = pathname.startsWith("/dashboard/guru");
  const dashboardAdmin = pathname.startsWith("/dashboard/admin");

  if (isStudent && (dashboardTeacher || dashboardAdmin)) {
    return NextResponse.redirect(new URL("/dashboard/murid", request.url));
  }

  if (isTeacher && (dashboardStudent || dashboardAdmin)) {
    return NextResponse.redirect(new URL("/dashboard/guru", request.url));
  }

  if (isAdmin && (dashboardStudent || dashboardTeacher)) {
    return NextResponse.redirect(new URL("/dashboard/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/murid/:path*",
    "/dashboard/guru/:path*",
    "/dashboard/admin/:path*",
  ],
};
