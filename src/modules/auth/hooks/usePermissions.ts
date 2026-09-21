"use client";

import { useCallback, useMemo } from "react";
import { useGetMyProfileQuery } from "@/modules/auth/api/profileApi";
import type { Permission } from "@/modules/auth/permissions";
import type { UserRole } from "@/modules/auth/types/auth";

/**
 * The current user's capabilities, read from `Me.permissions`.
 *
 * Permissions come from `GET /users/me/` rather than being baked into the
 * NextAuth session on purpose. The backend documents that a role edit "applies
 * to every member on their next request, without signing them out", and a
 * session here lives 30 days — caching them in the JWT would make a permission
 * change invisible until the user happened to sign out. RTK Query dedupes this
 * across every caller, so the extra hook costs one request.
 *
 * **`can()` fails closed.** Until the profile resolves the permission set is
 * empty, so gated controls are hidden rather than briefly shown to someone who
 * may not have them.
 *
 * Nothing here is a security boundary — the API enforces every permission
 * regardless. This only decides what is worth rendering.
 */
export function usePermissions() {
  const { data: profile, isLoading, isError } = useGetMyProfileQuery();

  const permissions = useMemo(
    () => new Set(profile?.permissions ?? []),
    [profile?.permissions],
  );

  const can = useCallback(
    (permission: Permission | string) => permissions.has(permission),
    [permissions],
  );

  const canAny = useCallback(
    (candidates: readonly (Permission | string)[]) =>
      candidates.some((permission) => permissions.has(permission)),
    [permissions],
  );

  return {
    permissions,
    can,
    canAny,
    isLoading,
    /** True when the profile could not be read at all — treat as no access. */
    isError,
    /**
     * The *seat*, not the capability set. Some backend rules are expressed in
     * terms of the seat rather than a permission — QA review needs the QA
     * Reviewer base role plus `courses.approve`, which no single codename can
     * capture. Those rules read this.
     */
    role: (profile?.role ?? null) as UserRole | null,
    roleLabel: profile?.role_label ?? null,
    accessRole: profile?.access_role ?? null,
    profile,
  };
}
