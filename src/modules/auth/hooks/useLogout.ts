"use client";

import { useCallback } from "react";
import { signOut } from "next-auth/react";

import { AuthRoute } from "@/lib/routes";
import { useAppDispatch } from "@/redux";
import { clearAuth } from "@/redux/slices/authSlice";
import { serverLogout } from "@/modules/auth/actions/logout";

/**
 * The one sign-out path, shared by every dashboard's sidebar and header.
 *
 * Order matters. Local state is cleared first so that a slow or failing
 * revocation cannot leave Redux holding a session the browser has already
 * dropped. `serverLogout` then blacklists the refresh token server-side using
 * the token inside the httpOnly cookie — it is never exposed to the client —
 * and `signOut` clears the cookie itself.
 *
 * Revocation is best-effort by design: failing to reach the backend must not
 * trap the user in a session they asked to leave. The worst case is that a
 * leaked refresh token stays valid until it expires on its own.
 */
export const useLogout = () => {
  const dispatch = useAppDispatch();

  return useCallback(
    async (callbackUrl: string = AuthRoute.LOGIN) => {
      dispatch(clearAuth());

      try {
        await serverLogout();
      } catch (error) {
        console.warn("[logout] revocation failed; continuing to sign out", error);
      }

      await signOut({ callbackUrl });
    },
    [dispatch],
  );
};
