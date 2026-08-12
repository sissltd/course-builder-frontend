"use server";

import { cookies } from "next/headers";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function serverLogout() {
  const cookieStore = await cookies();
  const secureCookie = cookieStore.get("__Secure-next-auth.session-token");
  const cookieName = secureCookie
    ? "__Secure-next-auth.session-token"
    : "next-auth.session-token";
  const cookieValue = cookieStore.get(cookieName)?.value;

  let refreshToken: string | undefined;

  if (cookieValue) {
    try {
      const token = await getToken({
        req: {
          headers: { cookie: `${cookieName}=${cookieValue}` },
        } as unknown as NextRequest,
        secret: process.env.NEXTAUTH_SECRET,
        cookieName,
      });
      refreshToken = token?.refreshToken;
    } catch {
      refreshToken = undefined;
    }
  }

  if (!refreshToken) {
    return;
  }

  try {
    await fetch(`${API_BASE_URL}/auth/logout/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    });
  } catch {
    // Best-effort blacklist; the NextAuth session is cleared by signOut regardless.
  }
}
