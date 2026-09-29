import type { Metadata } from "next";

import ConfirmEmailChangeView from "@/modules/auth/views/ConfirmEmailChangeView";

export const metadata: Metadata = {
  title: "Confirm your new email | SoluDesks",
  description: "Confirm the change to your account's email address.",
};

/**
 * The target of the confirmation link emailed by
 * `POST /auth/change-email/` — `/auth/change-email/confirm?token=…`.
 *
 * It is reachable both signed in and signed out, so `middleware.ts` lists it
 * in `PUBLIC_PATHS` and exempts it from the authed-redirect.
 */
export default async function ConfirmEmailChangePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return <ConfirmEmailChangeView token={token ?? ""} />;
}
