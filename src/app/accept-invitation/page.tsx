import { Suspense } from "react";
import AcceptInvitationView from "@/modules/auth/views/AcceptInvitationView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accept Staff Invitation | SoluDesks",
  description: "Set your password to accept your staff invitation and join the platform.",
};

export default async function AcceptInvitationPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; token?: string; callbackUrl?: string }>;
}) {
  const params = await searchParams;
  let email = params.email || "";
  let token = params.token || "";

  if (!email || !token) {
    if (params.callbackUrl) {
      try {
        const decoded = decodeURIComponent(params.callbackUrl);
        const parsed = new URL(decoded, "http://localhost");
        if (!email) email = parsed.searchParams.get("email") || "";
        if (!token) token = parsed.searchParams.get("token") || "";
      } catch {
        const emailMatch = params.callbackUrl.match(/[?&]email=([^&]+)/i);
        const tokenMatch = params.callbackUrl.match(/[?&]token=([^&]+)/i);
        if (!email && emailMatch) email = emailMatch[1];
        if (!token && tokenMatch) token = tokenMatch[1];
      }
    }
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="flex items-center gap-3">
            <div className="size-5 animate-spin rounded-full border-2 border-[#0063EF] border-t-transparent" />
            <span className="text-[14px] text-sd-grey-11">Loading invitation...</span>
          </div>
        </div>
      }
    >
      <AcceptInvitationView initialEmail={email} initialToken={token} />
    </Suspense>
  );
}
