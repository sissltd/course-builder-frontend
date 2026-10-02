import type { Metadata } from "next";
import ConfirmEmailChangeView from "@/modules/auth/views/ConfirmEmailChangeView";

export const metadata: Metadata = {
  title: "Confirm your new email | SoluDeskss",
  description: "Confirm the change to your account email address.",
};

export default async function ConfirmEmailChangePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return <ConfirmEmailChangeView token={token ?? ""} />;
}
