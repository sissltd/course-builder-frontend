import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { getDashboardRoute } from "@/modules/auth/utils/workspace";

const PUBLIC_PATHS = [
  "/",
  "/about",
  "/contact",
  "/cookies",
  "/creators",
  "/privacy",
  "/terms",
  "/auth/login",
  "/auth/register",
  "/auth/register/success",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/verify-email",
  "/auth/signup-google",
  "/api/auth",
];

const isPublicPath = (pathname: string): boolean =>
  PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );


export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isGoogleHandoff = req.nextUrl.searchParams.get("google") === "1";
  const isAuthenticated = Boolean(token?.user);

  console.log("[Middleware]", pathname, {
    isAuthenticated,
    isGoogleHandoff,
    hasToken: Boolean(token),
    hasUser: Boolean(token?.user),
  });

  if (isPublicPath(pathname)) {
    if (isAuthenticated && pathname.startsWith("/auth") && !isGoogleHandoff) {
      const dashboard = getDashboardRoute(token?.user?.workspace);
      console.log("[Middleware] public+authed+notGoogleHandoff → redirect to", dashboard);
      return NextResponse.redirect(new URL(dashboard, req.nextUrl));
    }
    console.log("[Middleware] public path, next");
    return NextResponse.next();
  }

  if (!token) {
    console.log("[Middleware] no token, path not public → redirect to login");
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

  console.log("[Middleware] authenticated, next");
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|woff2?)$).*)",
  ],
};
