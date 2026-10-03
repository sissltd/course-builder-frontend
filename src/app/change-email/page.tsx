import type { Metadata } from "next";

import ConfirmEmailChangeView from "@/modules/auth/views/ConfirmEmailChangeView";

export const metadata: Metadata = {
  title: "Confirm your new email | SoluDesks",
  description: "Confirm the change to your account's email address.",
};

/**
 * The URL the backend actually emails —
 * `/change-email?email=…&token=…` — so it has to exist at the site root.
 *
 * `searchParams` is read on the server, so no `useSearchParams` and no
 * `Suspense` boundary: the view does its own work in a client effect. It is
 * listed in `PUBLIC_PATHS` because the link is opened from the new inbox and
 * the caller may or may not have a session. `email` is display-only — the
 * confirm endpoint is token-only.
 */
export default async function ChangeEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; token?: string }>;
}) {
  const params = await searchParams;

  return (
    <ConfirmEmailChangeView
      email={params.email ?? ""}
      token={params.token ?? ""}
    />
  );
}