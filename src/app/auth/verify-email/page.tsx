import type { Metadata } from "next";
import VerifyEmailView from "@/modules/auth/views/VerifyEmailView";

export const metadata: Metadata = {
  title: "Verify your email | SoluDesks",
};

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; token?: string }>;
}) {
  const { email, token } = await searchParams;
  return <VerifyEmailView email={email ?? ""} token={token ?? ""} />;
}
