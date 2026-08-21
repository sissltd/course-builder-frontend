"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/modules/auth/components/AuthLayout";
import { AuthHeader } from "@/modules/auth/components/AuthHeader";
import { AuthButton } from "@/modules/auth/components/AuthButton";
import Link from "next/link";
import { toast } from "sonner";
import { useResendVerificationMutation } from "@/modules/auth/api/accountApi";
import { TokenPurpose } from "@/modules/auth/types/auth";
import { normalizeApiError } from "@/lib/api/errors";
import { REGISTER_EMAIL_STORAGE_KEY } from "@/modules/auth/utils/storage";
import { AuthRoute } from "@/lib/routes";

export default function RegisterSuccessView() {
  const router = useRouter();
  const [email] = useState<string>(() => {
    if (typeof window === "undefined") {
      return "";
    }
    return sessionStorage.getItem(REGISTER_EMAIL_STORAGE_KEY) ?? "";
  });
  const [resendVerification, { isLoading }] = useResendVerificationMutation();
  const [resent, setResent] = useState(false);

  useEffect(() => {
    if (!email) {
      router.replace(AuthRoute.REGISTER);
    }
  }, [email, router]);

  const handleResend = async () => {
    try {
      await resendVerification({
        email,
        purpose: TokenPurpose.SIGNUP_VERIFICATION,
      }).unwrap();
      setResent(true);
      toast.success("A new verification link has been sent.");
    } catch (error) {
      const { message } = normalizeApiError(error as never);
      toast.error(message ?? "Failed to resend the verification link.");
    }
  };

  if (!email) {
    return null;
  }

  return (
    <AuthLayout showNav={false} showLogo showSidebar>
      <AuthHeader
        title="Check your email"
        description={`We've sent a verification link to ${email}. Click the link in the email to activate your account.`}
        linkPrefix="Already verified?"
        linkText="Log In"
        linkHref={AuthRoute.LOGIN}
      />

      <div className="flex flex-col gap-[16px] w-full">
        <AuthButton variant="outline" onClick={handleResend} disabled={isLoading || resent}>
          {isLoading
            ? "Sending link..."
            : resent
              ? "Link sent"
              : "Didn't get the email? Resend link"}
        </AuthButton>
        <p className="text-center text-caption-xs leading-[16px] text-sd-grey-11 font-medium">
          The link expires after a short time. Check your spam folder if you don&apos;t see it.
        </p>
        <Link
          href={AuthRoute.LOGIN}
          className="text-center text-body-sm text-sd-grey-12 font-medium hover:underline"
        >
          Go back to Log In
        </Link>
      </div>
    </AuthLayout>
  );
}
