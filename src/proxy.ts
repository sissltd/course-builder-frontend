import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { getDashboardRoute } from "@/modules/auth/utils/workspace";

const PUBLIC_PATHS = [
  "/",
  "/about",
  "/company",
  "/contact",
  "/cookies",
  "/creators",
  "/privacy",
  "/product",
  "/terms",
  "/auth/login",
  "/auth/register",
  "/auth/register/success",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/verify-email",
  "/api/auth",
];

const isPublicPath = (pathname: string): boolean =>
  PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (isPublicPath(pathname)) {
    if (token && pathname.startsWith("/auth")) {
      const dashboard = getDashboardRoute(token.user?.workspace);
      return NextResponse.redirect(new URL(dashboard, req.nextUrl));
    }
    return NextResponse.next();
  }

  if (!token) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        {
          errors: [
            {
              type: "client_error",
              code: "not_authenticated",
              message: "Authentication credentials were not provided.",
              field_name: null,
            },
          ],
        },
        { status: 401 },
      );
    }

    const loginUrl = new URL("/auth/login", req.nextUrl);
    loginUrl.searchParams.set(
      "callbackUrl",
      `${pathname}${req.nextUrl.search}`,
    );
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|woff2?)$).*)",
  ],
};
