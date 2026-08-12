import type { Metadata } from "next";
import ResetPasswordView from "@/modules/auth/views/ResetPasswordView";

export const metadata: Metadata = {
  title: "Reset password | SoluDesk",
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; token?: string }>;
}) {
  const { email, token } = await searchParams;
  return <ResetPasswordView email={email ?? ""} token={token ?? ""} />;
}
