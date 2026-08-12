import type { Metadata } from "next";
import RegisterSuccessView from "@/modules/auth/views/RegisterSuccessView";

export const metadata: Metadata = {
  title: "Check your email | SoluDesk",
};

export default async function RegisterSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;
  return <RegisterSuccessView email={email ?? ""} />;
}
