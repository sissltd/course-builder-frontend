"use server";

import { cookies } from "next/headers";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Ends the caller's session: blacklists the refresh token server-side, then
 * lets the caller clear the local NextAuth cookie.
 *
 * The refresh token is deliberately never handed to the browser. It lives only
 * in the httpOnly session cookie and is read here, so an XSS on the client
 * cannot mint a new access token from a stolen refresh token.
 */
export async function serverLogout() {
  const cookieStore = await cookies();
  // next-auth v4 prefixes the cookie with `__Secure-` when NEXTAUTH_URL is
  // https. Local dev is plain http, so both names have to be considered.
  const secureCookie = cookieStore.get("__Secure-next-auth.session-token");
  const cookieName = secureCookie
    ? "__Secure-next-auth.session-token"
    : "next-auth.session-token";
  const cookieValue = cookieStore.get(cookieName)?.value;

  if (!cookieValue) {
    return;
  }

  let refreshToken: string | undefined;
  let accessToken: string | undefined;

  try {
    const token = await getToken({
      req: {
        headers: { cookie: `${cookieName}=${cookieValue}` },
      } as unknown as NextRequest,
      secret: process.env.NEXTAUTH_SECRET,
      cookieName,
    });
    refreshToken = token?.refreshToken;
    accessToken = token?.accessToken;
  } catch {
    refreshToken = undefined;
  }

  if (!refreshToken) {
    return;
  }

  try {
    // `/auth/logout/` is documented as "any authenticated user", so it needs
    // the access token as well as the refresh token in the body — without the
    // header it answers 401 and the blacklist never happens.
    const response = await fetch(`${API_BASE_URL}/auth/logout/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      console.warn(
        `[logout] /auth/logout/ returned ${response.status}; the refresh token may still be valid.`,
      );
    }
  } catch (error) {
    // Best-effort blacklist; the NextAuth session is cleared by signOut regardless.
    console.warn("[logout] could not reach /auth/logout/", error);
  }
}
