import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {
  const isProtectedRoute = (pathname: string) => {
    // Protect specific paths
    if (['/profile'].includes(pathname)) {
      return true;
    }
    // Protect all paths under /dashboard and /api
    if (pathname.startsWith('/dashboardsss') || pathname.startsWith('/api')) {
      return true;
    }
    return false;
  };

  // For demonstration, let's assume authentication status is checked via a cookie or session
  const isAuthenticated = request.cookies.get('session_token') // Replace with your actual auth check

  if (isProtectedRoute(request.nextUrl.pathname) && !isAuthenticated) {
    // Redirect to login page if unauthenticated and trying to access a protected route
    const url = request.nextUrl.clone()
    url.pathname = 'auth/login' // Assuming you have a /login page
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}
 
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (login page)
     * - public (public assets)
     */
    '/((?!_next/static|_next/image|favicon.ico|login|public).*)',
  ],
}
