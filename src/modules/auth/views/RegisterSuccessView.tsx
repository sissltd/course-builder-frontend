"use client";

import React, { useState } from "react";
import { AuthLayout } from "@/modules/auth/components/AuthLayout";
import { AuthHeader } from "@/modules/auth/components/AuthHeader";
import { AuthButton } from "@/modules/auth/components/AuthButton";
import Link from "next/link";
import { toast } from "sonner";
import { useResendVerificationMutation } from "@/modules/auth/api/accountApi";
import { TokenPurpose } from "@/modules/auth/types/auth";
import { normalizeApiError } from "@/lib/api/errors";

interface RegisterSuccessViewProps {
  email: string;
}

export default function RegisterSuccessView({ email }: RegisterSuccessViewProps) {
  const [resendVerification, { isLoading }] = useResendVerificationMutation();
  const [resent, setResent] = useState(false);

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

  return (
    <AuthLayout showNav={false} showLogo showSidebar>
      <AuthHeader
        title="Check your email"
        description={
          email
            ? `We've sent a verification link to ${email}. Click the link in the email to activate your account.`
            : "We've sent a verification link to your email. Click the link in the email to activate your account."
        }
        linkPrefix="Already verified?"
        linkText="Log In"
        linkHref="/auth/login"
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
          href="/auth/login"
          className="text-center text-body-sm text-sd-grey-12 font-medium hover:underline"
        >
          Go back to Log In
        </Link>
      </div>
    </AuthLayout>
  );
}
