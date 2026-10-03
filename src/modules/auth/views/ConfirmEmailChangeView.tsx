"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { TickCircle, Warning2 } from "iconsax-react";

import { AuthLayout } from "@/modules/auth/components/AuthLayout";
import { AuthHeader } from "@/modules/auth/components/AuthHeader";
import { AuthButton } from "@/modules/auth/components/AuthButton";
import { LoadingState } from "@/modules/auth/components/LoadingState";
import { useConfirmChangeEmailMutation } from "@/modules/auth/api/accountApi";
import { normalizeApiError } from "@/lib/api/errors";
import { AuthRoute, CreatorRoute } from "@/lib/routes";
import {
  getDashboardRoute,
  getWorkspaceForRole,
} from "@/modules/auth/utils/workspace";

interface ConfirmEmailChangeViewProps {
  token: string;
  email?: string;
}

type ConfirmState =
  | { status: "confirming" }
  | { status: "confirmed"; message: string }
  | { status: "failed"; message: string };

export default function ConfirmEmailChangeView({
  token,
  email = "",
}: ConfirmEmailChangeViewProps) {
  const { data: session } = useSession();
  const [confirmChangeEmail] = useConfirmChangeEmailMutation();
  const [state, setState] = useState<ConfirmState>(() =>
    token ? { status: "confirming" } : { status: "failed", message: "" },
  );
  const hasRun = useRef(false);

  useEffect(() => {
    if (!token || hasRun.current) return;
    hasRun.current = true;

    let active = true;

    void (async () => {
      try {
        const result = await confirmChangeEmail({ token }).unwrap();
        if (!active) return;
        setState({
          status: "confirmed",
          message: result?.detail ?? "Email address changed successfully.",
        });
      } catch (error) {
        if (!active) return;
        const { message } = normalizeApiError(error as never);
        setState({ status: "failed", message: friendlyMessage(message) });
      }
    })();

    return () => {
      active = false;
    };
  }, [token, confirmChangeEmail]);

  const workspace = session?.user?.workspace
    ? getDashboardRoute(session.user.workspace)
    : getDashboardRoute(getWorkspaceForRole(session?.user?.role));
  const isSignedIn = Boolean(session?.user);
  const pendingAddress = email.trim();
  const primaryDestination = isSignedIn ? workspace : AuthRoute.LOGIN;

  if (state.status === "confirming") {
    return (
      <AuthLayout showNav={false} showLogo showSidebar>
        <AuthHeader
          title="Confirm your new email"
          description={
            pendingAddress
              ? `Applying the change to ${pendingAddress}, please wait...`
              : "Applying the change, please wait..."
          }
        />
        <div className="flex w-full flex-col items-center gap-[16px]">
          <LoadingState />
        </div>
      </AuthLayout>
    );
  }

  if (state.status === "confirmed") {
    return (
      <AuthLayout showNav={false} showLogo showSidebar>
        <div className="flex w-full max-w-[460px] flex-col items-center gap-[32px] text-center">
          <div className="mx-auto flex size-[80px] items-center justify-center rounded-full bg-[#EBF7EE]">
            <TickCircle variant="Bold" size={44} color="#008500" />
          </div>
          <AuthHeader
            title="Email address changed"
            description={
              pendingAddress
                ? `${state.message} You can sign in with ${pendingAddress} from now on.`
                : state.message
            }
          />
          <div className="flex w-full flex-col gap-[16px]">
            <AuthButton
              onClick={() => window.location.assign(primaryDestination)}
            >
              {isSignedIn ? "Go to Dashboard" : "Go to Log In"}
            </AuthButton>
          </div>
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
          description={
            state.message ||
            "This confirmation link is invalid, has expired, or has already been used."
          }
        />
        <div className="flex w-full flex-col gap-[16px]">
          <AuthButton
            onClick={() => window.location.assign(CreatorRoute.SETTINGS)}
          >
            Request a new link
          </AuthButton>
          <Link
            href={AuthRoute.LOGIN}
            className="text-body-sm text-center font-medium text-sd-grey-12 hover:underline"
          >
            Back to Log In
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}

function friendlyMessage(message: string | null): string {
  if (!message) {
    return "This confirmation link is invalid, has expired, or has already been used.";
  }
  const lower = message.toLowerCase();
  if (lower.includes("expired")) {
    return "This confirmation link has expired. Request a new one from Settings.";
  }
  if (lower.includes("already") || lower.includes("used")) {
    return "This confirmation link has already been used. If your address did not change, request a new one.";
  }
  if (lower.includes("invalid")) {
    return "This confirmation link is invalid. Request a new one from Settings.";
  }
  return message;
}
