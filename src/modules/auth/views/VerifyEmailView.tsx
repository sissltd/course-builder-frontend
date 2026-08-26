"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { AuthLayout } from "@/modules/auth/components/AuthLayout";
import { AuthHeader } from "@/modules/auth/components/AuthHeader";
import { AuthButton } from "@/modules/auth/components/AuthButton";
import { LoadingState } from "@/modules/auth/components/LoadingState";
import Link from "next/link";
import { toast } from "sonner";
import {
  useResendVerificationMutation,
  useVerifyEmailMutation,
} from "@/modules/auth/api/accountApi";
import { TokenPurpose } from "@/modules/auth/types/auth";
import { normalizeApiError } from "@/lib/api/errors";
import { useAppDispatch } from "@/redux";
import { setCredentials } from "@/redux/slices/authSlice";
import {
  getDashboardRoute,
  getWorkspaceForRole,
} from "@/modules/auth/utils/workspace";
import { AuthRoute } from "@/lib/routes";

interface VerifyEmailViewProps {
  email: string;
  token: string;
}

type VerifyState =
  | { status: "verifying" }
  | { status: "signed-in"; redirectTo: string }
  | { status: "failed"; message: string };

export default function VerifyEmailView({ email, token }: VerifyEmailViewProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();
  const [resendVerification, { isLoading: isResending }] =
    useResendVerificationMutation();
  const [state, setState] = useState<VerifyState>(() =>
    email && token ? { status: "verifying" } : { status: "failed", message: "This verification link is invalid." },
  );
  const [resent, setResent] = useState(false);

  useEffect(() => {
    if (!email || !token) {
      return;
    }

    let active = true;

    void (async () => {
      try {
        const result = await verifyEmail({ email, token }).unwrap();
        if (!active) {
          return;
        }
        const workspace = getWorkspaceForRole(result.user.role);
        const signInResult = await signIn("credentials", {
          accessToken: result.access,
          refreshToken: result.refresh,
          user: JSON.stringify(result.user),
          workspace,
          redirect: false,
        });

        if (signInResult?.error) {
          setState({
            status: "failed",
            message:
              "Your account was verified but we couldn't sign you in. Please log in.",
          });
          return;
        }

        dispatch(
          setCredentials({
            user: result.user,
            accessToken: result.access,
          }),
        );

        const redirectTo = getDashboardRoute(workspace);
        setState({ status: "signed-in", redirectTo });
        router.push(redirectTo);
        router.refresh();
      } catch (error) {
        if (!active) {
          return;
        }
        const { message } = normalizeApiError(error as never);
        setState({
          status: "failed",
          message:
            message ??
            "This link is invalid or has already been used. You can request a new one.",
        });
      }
    })();

    return () => {
      active = false;
    };
  }, [email, token, verifyEmail, router, dispatch]);

  const handleResend = async () => {
    try {
      await resendVerification({
        email,
        purpose: TokenPurpose.SIGNUP_VERIFICATION,
      }).unwrap();
      setResent(true);
      toast.success("A new verification link has been sent to your email.");
    } catch (error) {
      const { message } = normalizeApiError(error as never);
      toast.error(message ?? "Failed to resend the verification link.");
    }
  };

  return (
    <AuthLayout showNav={false} showLogo showSidebar>
      <AuthHeader
        title="Verify email address"
        description={
          state.status === "verifying"
            ? "Verifying your email, please wait..."
            : state.status === "signed-in"
              ? "Email verified. Taking you to your dashboard..."
              : "We couldn't verify your email with this link."
        }
      />

      {state.status === "verifying" && (
        <div className="w-full flex flex-col items-center gap-[16px]">
          <LoadingState message={isLoading ? "Verifying..." : undefined} />
        </div>
      )}

      {state.status === "failed" && (
        <div className="flex flex-col gap-[24px] w-full">
          <p className="text-center text-body-sm text-sd-grey-11 font-medium">
            {state.message}
          </p>
          <AuthButton onClick={handleResend} disabled={isResending || resent}>
            {isResending
              ? "Sending link..."
              : resent
                ? "Link sent"
                : "Resend verification link"}
          </AuthButton>
          <Link
            href={AuthRoute.LOGIN}
            className="text-center text-body-sm text-sd-grey-12 font-medium hover:underline"
          >
            Go back to Log In
          </Link>
        </div>
      )}
    </AuthLayout>
  );
}
