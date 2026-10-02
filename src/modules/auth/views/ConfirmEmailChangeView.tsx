"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Warning2 } from "iconsax-react";
import { AuthLayout } from "@/modules/auth/components/AuthLayout";
import { AuthHeader } from "@/modules/auth/components/AuthHeader";
import { AuthButton } from "@/modules/auth/components/AuthButton";
import { LoadingState } from "@/modules/auth/components/LoadingState";
import { useConfirmChangeEmailMutation } from "@/modules/auth/api/accountApi";
import { normalizeApiError } from "@/lib/api/errors";
import { AuthRoute } from "@/lib/routes";
import { useAppDispatch } from "@/redux";
import { clearAuth } from "@/redux/slices/authSlice";

interface ConfirmEmailChangeViewProps {
  token: string;
}

type ConfirmState =
  | { status: "confirming" }
  | { status: "redirecting" }
  | { status: "failed"; message: string };

const getErrorMessage = (message: string | null): string => {
  if (!message) {
    return "This confirmation link is invalid, has expired, or has already been used.";
  }

  const normalized = message.toLowerCase();
  if (normalized.includes("expired")) {
    return "This confirmation link has expired. Request a new one from Settings.";
  }
  if (normalized.includes("already") || normalized.includes("used")) {
    return "This confirmation link has already been used. Try logging in with your new email address.";
  }
  if (normalized.includes("invalid")) {
    return "This confirmation link is invalid. Request a new one from Settings.";
  }
  return message;
};

export default function ConfirmEmailChangeView({
  token,
}: ConfirmEmailChangeViewProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { status: sessionStatus } = useSession();
  const [confirmChangeEmail] = useConfirmChangeEmailMutation();
  const [state, setState] = useState<ConfirmState>(() =>
    token
      ? { status: "confirming" }
      : {
          status: "failed",
          message: "This confirmation link is missing its token.",
        },
  );
  const hasRun = useRef(false);

  useEffect(() => {
    if (!token || hasRun.current || sessionStatus === "loading") return;
    hasRun.current = true;

    let active = true;

    void (async () => {
      try {
        await confirmChangeEmail({ token }).unwrap();
        if (!active) return;

        setState({ status: "redirecting" });
        dispatch(clearAuth());

        if (sessionStatus === "authenticated") {
          await signOut({ callbackUrl: AuthRoute.LOGIN });
          return;
        }

        router.replace(AuthRoute.LOGIN);
        router.refresh();
      } catch (error) {
        if (!active) return;
        const { message } = normalizeApiError(error as never);
        setState({ status: "failed", message: getErrorMessage(message) });
      }
    })();

    return () => {
      active = false;
    };
  }, [confirmChangeEmail, dispatch, router, sessionStatus, token]);

  if (state.status !== "failed") {
    return (
      <AuthLayout showNav={false} showLogo showSidebar>
        <AuthHeader
          title={
            state.status === "confirming"
              ? "Confirming your new email"
              : "Email address changed"
          }
          description={
            state.status === "confirming"
              ? "Applying the change, please wait..."
              : "Redirecting you to log in with your new email address..."
          }
        />
        <div className="flex w-full flex-col items-center gap-[16px]">
          <LoadingState />
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout showNav={false} showLogo showSidebar>
      <div className="flex w-full max-w-[460px] flex-col items-center gap-[32px] text-center">
        <div className="mx-auto flex size-[80px] items-center justify-center rounded-full bg-[#FFF0ED]">
          <Warning2 variant="Bold" size={40} color="#D54800" />
        </div>
        <AuthHeader
          title="This link is no longer valid"
          description={state.message}
        />
        <div className="flex w-full flex-col gap-[16px]">
          <AuthButton onClick={() => router.push(AuthRoute.LOGIN)}>
            Go to Log In
          </AuthButton>
        </div>
      </div>
    </AuthLayout>
  );
}
