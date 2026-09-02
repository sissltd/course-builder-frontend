import type { Metadata } from "next";
import VerifyEmailView from "@/modules/auth/views/VerifyEmailView";

export const metadata: Metadata = {
  title: "Verify your email | SoluDeskss",
};

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; token?: string; fromLogin?: string }>;
}) {
  const { email, token, fromLogin } = await searchParams;
  return (
    <VerifyEmailView
      email={email ?? ""}
      token={token ?? ""}
      fromLogin={fromLogin === "true"}
    />
  );
}
