"use client";

import React, { useEffect, useRef } from "react";
import { SessionProvider, useSession, signOut } from "next-auth/react";
import { useAppDispatch } from "@/redux";
import { clearAuth, setCredentials } from "@/redux/slices/authSlice";

const SESSION_REFRESH_INTERVAL_MS = 25 * 60 * 1000;

function AuthSessionSync() {
  const dispatch = useAppDispatch();
  const { data: session, status } = useSession();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (hasRedirected.current) return;

    if (status === "authenticated" && session?.user) {
      if (session.error === "RefreshAccessTokenError") {
        hasRedirected.current = true;
        dispatch(clearAuth());
        signOut({ callbackUrl: "/auth/login", redirect: true });
        return;
      }

      dispatch(
        setCredentials({
          user: session.user,
          accessToken: session.accessToken,
        }),
      );
    } else if (status === "unauthenticated") {
      dispatch(clearAuth());
    }
  }, [status, session, dispatch]);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      if (hasRedirected.current) return;

      try {
        const response = await fetch(`/api/auth/session?_=${Date.now()}`, {
          cache: "no-store",
        });
        const contentType = response.headers.get("content-type") ?? "";
        if (!contentType.includes("application/json") || !response.ok) {
          return;
        }
        const data = await response.json();
        if (data?.error === "RefreshAccessTokenError") {
          hasRedirected.current = true;
          dispatch(clearAuth());
          signOut({ callbackUrl: "/auth/login", redirect: true });
          return;
        }
        if (data?.accessToken && data?.user) {
          dispatch(
            setCredentials({
              user: data.user,
              accessToken: data.accessToken,
            }),
          );
        }
      } catch {
        // Session refresh is best-effort; the next interval retry will handle it.
      }
    }, SESSION_REFRESH_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [dispatch]);

  return null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthSessionSync />
      {children}
    </SessionProvider>
  );
}
