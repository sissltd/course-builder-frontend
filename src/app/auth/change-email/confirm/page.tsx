import type { Metadata } from "next";

import ConfirmEmailChangeView from "@/modules/auth/views/ConfirmEmailChangeView";

export const metadata: Metadata = {
  title: "Confirm your new email | SoluDesks",
  description: "Confirm the change to your account's email address.",
};

/**
 * Legacy confirmation path — links may already be sitting in inboxes, so it
 * keeps working and delegates to the same view as the root `/change-email`
 * route the backend actually emails. No confirm logic lives here.
 */
export default async function ConfirmEmailChangePage({
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
