import { withAuth } from "next-auth/middleware";

export default withAuth(
  function proxy() {
    return undefined;
  },
  {
    pages: {
      signIn: "/auth/login",
    },
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
);

export const config = {
  matcher: ["/creator/:path*", "/admin/:path*", "/auth/onboarding"],
};
