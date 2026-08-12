"use client";

import React, { useEffect } from "react";
import { SessionProvider, useSession } from "next-auth/react";
import { useAppDispatch } from "@/redux";
import { clearAuth, setCredentials } from "@/redux/slices/authSlice";

const SESSION_REFRESH_INTERVAL_MS = 25 * 60 * 1000;

function AuthSessionSync() {
  const dispatch = useAppDispatch();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
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
      try {
        const response = await fetch(`/api/auth/session?_=${Date.now()}`, {
          cache: "no-store",
        });
        const data = await response.json();
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
