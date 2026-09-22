"use client";

import React, { useState, useMemo } from "react";
import { AuthLayout } from "@/modules/auth/components/AuthLayout";
import { AuthHeader } from "@/modules/auth/components/AuthHeader";
import { AuthInput } from "@/modules/auth/components/AuthInput";
import { AuthButton } from "@/modules/auth/components/AuthButton";
import Link from "next/link";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  acceptInvitationSchema,
  AcceptInvitationFormData,
} from "@/modules/auth/utils/schemas";
import { PasswordStrength } from "@/modules/auth/components/PasswordStrength";
import { useAcceptStaffInvitationMutation } from "@/modules/admin/teams/hooks";
import { normalizeApiError } from "@/lib/api/errors";
import { toast } from "sonner";
import { AuthRoute, WebsiteRoute } from "@/lib/routes";
import { useSearchParams, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useAppDispatch } from "@/redux";
import { setCredentials } from "@/redux/slices/authSlice";
import {
  getDashboardRoute,
  getWorkspaceForRole,
} from "@/modules/auth/utils/workspace";
import { DirectInbox, ShieldSecurity, Warning2, TickCircle } from "iconsax-react";

interface AcceptInvitationViewProps {
  initialEmail?: string;
  initialToken?: string;
}

export default function AcceptInvitationView({
  initialEmail,
  initialToken,
}: AcceptInvitationViewProps = {}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();

  const [isSuccess, setIsSuccess] = useState(false);
  const [isExpiredOrInvalid, setIsExpiredOrInvalid] = useState(false);
  const [acceptStaffInvitation, { isLoading }] = useAcceptStaffInvitationMutation();

  // Extract email and token with robust fallback for props, callbackUrl, or direct params
  const { email, token } = useMemo(() => {
    let rawEmail = initialEmail || searchParams.get("email") || "";
    let rawToken = initialToken || searchParams.get("token") || "";

    if (!rawEmail || !rawToken) {
      const callbackUrl = searchParams.get("callbackUrl");
      if (callbackUrl) {
        try {
          const decodedCallback = decodeURIComponent(callbackUrl);
          const parsed = new URL(decodedCallback, "http://localhost");
          if (!rawEmail) rawEmail = parsed.searchParams.get("email") || "";
          if (!rawToken) rawToken = parsed.searchParams.get("token") || "";
        } catch {
          // Fallback regex matching if URL parsing fails on relative path
          const emailMatch = callbackUrl.match(/[?&]email=([^&]+)/i);
          const tokenMatch = callbackUrl.match(/[?&]token=([^&]+)/i);
          if (!rawEmail && emailMatch) rawEmail = emailMatch[1];
          if (!rawToken && tokenMatch) rawToken = tokenMatch[1];
        }
      }
    }

    let cleanEmail = rawEmail;
    try {
      while (cleanEmail.includes("%")) {
        cleanEmail = decodeURIComponent(cleanEmail);
      }
    } catch {
      // keep cleanEmail as is
    }

    return {
      email: cleanEmail.trim(),
      token: rawToken.trim(),
    };
  }, [searchParams]);

  const methods = useForm<AcceptInvitationFormData>({
    resolver: zodResolver(acceptInvitationSchema),
    mode: "onBlur",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { handleSubmit, watch, setError } = methods;
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  const onSubmit = handleSubmit(async (data) => {
    if (!email || !token) {
      toast.error("Invitation token or email is missing. Please check your invitation email.");
      return;
    }

    try {
      const result = await acceptStaffInvitation({
        email,
        token,
        password: data.password,
      }).unwrap();

      setIsSuccess(true);
      toast.success(`Welcome, ${result.user.first_name}! Your staff account is activated.`);

      const workspace = getWorkspaceForRole(result.user.role);

      // Authenticate NextAuth session with credentials
      const signInResult = await signIn("credentials", {
        accessToken: result.access,
        refreshToken: result.refresh,
        user: JSON.stringify(result.user),
        workspace,
        role: result.user.role,
        redirect: false,
      });

      if (signInResult?.error) {
        console.warn("Session sign-in warning:", signInResult.error);
      }

      // Store in Redux auth state
      dispatch(
        setCredentials({
          user: result.user as any,
          accessToken: result.access,
        })
      );

      // Land directly in the dashboard
      const targetDashboard = getDashboardRoute(workspace);
      setTimeout(() => {
        router.push(targetDashboard);
        router.refresh();
      }, 1200);
    } catch (error: any) {
      if (error?.status === 404) {
        setIsExpiredOrInvalid(true);
        toast.error(
          "This invitation link is invalid, has expired, or has already been used. Please request a new invitation from your administrator."
        );
        return;
      }

      const { fieldErrors, message } = normalizeApiError(error as never);
      for (const [field, fieldMessage] of Object.entries(fieldErrors)) {
        setError(field as keyof AcceptInvitationFormData, {
          type: "server",
          message: fieldMessage,
        });
      }
      toast.error(message ?? "Failed to accept staff invitation. Please try again.");
    }
  });

  // Invalid or expired token view
  if (isExpiredOrInvalid || (!email && !token)) {
    return (
      <AuthLayout showNav showSidebar={false} showLogo={false}>
        <div className="flex flex-col items-center text-center gap-[32px] w-full max-w-[460px]">
          <div className="flex flex-col items-center gap-[24px]">
            <div className="bg-[#FFF0ED] rounded-full w-[80px] h-[80px] flex items-center justify-center mx-auto">
              <Warning2 variant="Bold" size={40} color="#D54800" />
            </div>
            <AuthHeader
              title="Invitation link unavailable"
              description="This invitation link is invalid, has expired, or has already been accepted. Staff invitation links can only be used once."
            />
          </div>

          <div className="p-[16px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-[12px] text-[13px] text-[#606060] leading-[20px] text-left w-full">
            <p className="font-medium text-[#202020] mb-[4px]">What should I do?</p>
            <p>
              Please contact your platform Super Admin to resend an invitation link to your email address (
              <span className="font-mono text-[#202020]">{email || "your address"}</span>).
            </p>
          </div>

          <div className="flex flex-col gap-[16px] w-full">
            <AuthButton onClick={() => router.push(AuthRoute.LOGIN)}>
              Proceed to Sign In
            </AuthButton>
            <p className="text-center text-caption-xs leading-[16px] text-sd-grey-11 font-medium">
              Need help? Contact support or your administrator.
            </p>
          </div>
        </div>
      </AuthLayout>
    );
  }

  // Success view
  if (isSuccess) {
    return (
      <AuthLayout showNav showSidebar={false} showLogo={false}>
        <div className="flex flex-col items-center text-center gap-[32px] w-full max-w-[460px]">
          <div className="flex flex-col items-center gap-[24px]">
            <div className="bg-[#EBF7EE] rounded-full w-[80px] h-[80px] flex items-center justify-center mx-auto">
              <TickCircle variant="Bold" size={44} color="#008500" />
            </div>
            <AuthHeader
              title="Invitation accepted!"
              description="Your staff account is active and verified. We are preparing your workspace dashboard..."
            />
          </div>

          <div className="flex items-center gap-[8px] text-[14px] text-[#606060]">
            <div className="size-4 animate-spin rounded-full border-2 border-[#0063EF] border-t-transparent" />
            <span>Redirecting to your dashboard...</span>
          </div>

          <div className="flex flex-col gap-[16px] w-full">
            <AuthButton onClick={() => router.push("/reviewer/dashboard")}>
              Go to Dashboard Now
            </AuthButton>
          </div>
        </div>
      </AuthLayout>
    );
  }

  // Form view
  return (
    <AuthLayout showNav showSidebar={false} showLogo={false}>
      <div className="flex flex-col gap-[28px] w-full max-w-[460px]">
        <AuthHeader
          title="Accept staff invitation"
          description="Set your account password to accept the invitation and activate your staff access."
        />

        {/* Invited Account Context Card */}
        <div className="flex items-start gap-[12px] p-[14px] bg-[#F5F8FF] border border-[#D0E2FF] rounded-[10px]">
          <div className="size-[32px] rounded-full bg-[#E5EFFF] flex items-center justify-center shrink-0 mt-[2px]">
            <DirectInbox variant="Bold" size={18} color="#0063EF" />
          </div>
          <div className="flex flex-col gap-[2px] min-w-0">
            <span className="text-[12px] font-medium text-[#0063EF] uppercase tracking-wider">
              Invited staff account
            </span>
            <span className="text-[14px] font-semibold text-[#202020] truncate">
              {email}
            </span>
            <span className="text-[12px] text-[#606060]">
              Your password set below will become your permanent sign-in credential.
            </span>
          </div>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={onSubmit} className="flex flex-col gap-[24px] w-full">
            <div className="flex flex-col gap-[16px]">
              <AuthInput
                name="password"
                label="Create password"
                placeholder="Enter password"
                required
                type="password"
              />

              <AuthInput
                name="confirmPassword"
                label="Confirm password"
                placeholder="Confirm password"
                required
                type="password"
              />

              <PasswordStrength password={password} confirmPassword={confirmPassword} />
            </div>

            <div className="flex flex-col gap-[16px] w-full pt-[8px]">
              <AuthButton type="submit" disabled={isLoading}>
                {isLoading ? "Activating account..." : "Accept invitation & sign in"}
              </AuthButton>
              <p className="text-center text-caption-xs leading-[16px] text-sd-grey-11 font-medium">
                By activating your account, you agree to SoluDesks{" "}
                <Link href={WebsiteRoute.TERMS} className="underline hover:text-[#0063EF]">
                  Terms of Use
                </Link>{" "}
                and{" "}
                <Link href={WebsiteRoute.PRIVACY} className="underline hover:text-[#0063EF]">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </form>
        </FormProvider>
      </div>
    </AuthLayout>
  );
}
