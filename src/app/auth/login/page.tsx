"use client";

import React, { useState } from "react";
import { AuthLayout } from "@/modules/auth/components/AuthLayout";
import { AuthHeader } from "@/modules/auth/components/AuthHeader";
import { SocialLogin } from "@/modules/auth/components/SocialLogin";
import { AuthRoute, WebsiteRoute } from "@/lib/routes";
import { AuthInput } from "@/modules/auth/components/AuthInput";
import { AuthButton } from "@/modules/auth/components/AuthButton";
import Link from "next/link";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/modules/auth/utils/schemas";
import { useLoginMutation } from "@/modules/auth/api/sessionApi";
import { useResendVerificationMutation } from "@/modules/auth/api/accountApi";
import { TokenPurpose } from "@/modules/auth/types/auth";
import { normalizeApiError } from "@/lib/api/errors";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useAppDispatch } from "@/redux";
import { setCredentials } from "@/redux/slices/authSlice";
import {
  getDashboardRoute,
  getWorkspaceForRole,
} from "@/modules/auth/utils/workspace";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [step, setStep] = useState<"email" | "password">("email");
  const [login, { isLoading }] = useLoginMutation();
  const [resendVerification] = useResendVerificationMutation();

  const methods = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { handleSubmit, trigger, setError } = methods;

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEmailValid = await trigger("email");
    if (isEmailValid) {
      setStep("password");
    }
  };

  const handleLoginSubmit = handleSubmit(async (data) => {
    try {
      const result = await login({
        email: data.email,
        password: data.password,
      }).unwrap();

      const workspace = getWorkspaceForRole(result.role);
      const signInResult = await signIn("credentials", {
        accessToken: result.access,
        refreshToken: result.refresh,
        user: JSON.stringify(result.user),
        workspace,
        role: result.role,
        mfaEnrollmentOverdue: String(result.mfa_enrollment_overdue ?? false),
        redirect: false,
      });

      if (signInResult?.error) {
        toast.error("Sign in failed. Please try again.");
        return;
      }

      dispatch(
        setCredentials({
          user: result.user,
          accessToken: result.access,
        }),
      );

      router.push(getDashboardRoute(workspace));
      router.refresh();
    } catch (error) {
      const { fieldErrors, message } = normalizeApiError(error as never);

      if (message && message.toLowerCase().includes("not been verified")) {
        const emailValue = methods.getValues("email");
        if (emailValue) {
          try {
            await resendVerification({
              email: emailValue,
              purpose: TokenPurpose.SIGNUP_VERIFICATION,
            }).unwrap();
            toast.success("A new verification link has been sent to your email.");
          } catch {
            toast.info("Please check your email for a verification link.");
          }
          router.push(`${AuthRoute.VERIFY_EMAIL}?email=${encodeURIComponent(emailValue)}`);
          return;
        }
      }

      for (const [field, fieldMessage] of Object.entries(fieldErrors)) {
        setError(field as keyof LoginFormData, {
          type: "server",
          message: fieldMessage,
        });
      }
      if (Object.keys(fieldErrors).length === 0 && message) {
        toast.error(message);
      }
    }
  });

  return (
    <AuthLayout showNav={step === "password"} showLogo={step !== "password"}>
      <AuthHeader
        title="Log in your account"
        description="Enter the required information to access your account"
        linkPrefix="Don’t have an account?"
        linkText="Create one"
        linkHref={AuthRoute.REGISTER}
      />

      <FormProvider {...methods}>
        <div className="flex flex-col gap-[32px] w-full items-center">
          {step === "email" && (
            <>
              <SocialLogin label="Continue with Google" />
              
              <div className="relative flex items-center justify-center w-full">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-sd-grey-8"></div>
                </div>
                <div className="relative bg-white px-2">
                  <span className="text-body-sm text-sd-grey-8 font-medium">or continue with your email</span>
                </div>
              </div>

              <form onSubmit={handleEmailSubmit} className="flex flex-col gap-[40px] w-full">
                <AuthInput
                  name="email"
                  label="Enter email address"
                  placeholder="Enter address"
                  required
                  type="email"
                />
                
                <div className="flex flex-col gap-[16px] w-full">
                  <AuthButton type="submit">Continue</AuthButton>
                  <p className="text-center text-caption-xs leading-[16px] text-sd-grey-11 font-medium">
                    By clicking on continue, you agree to SoluDesks{" "}
                    <Link href={WebsiteRoute.TERMS} className="underline">Terms of Use</Link> and{" "}
                    <Link href={WebsiteRoute.PRIVACY} className="underline">privacy policy</Link>
                  </p>
                </div>
              </form>
            </>
          )}

          {step === "password" && (
            <div className="w-full flex flex-col gap-[32px]">
              <SocialLogin label="Continue with Google" />
              
              <div className="relative flex items-center justify-center w-full">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-sd-grey-8"></div>
                </div>
                <div className="relative bg-white px-2">
                  <span className="text-body-sm text-sd-grey-8 font-medium">or continue with your email</span>
                </div>
              </div>

              <form onSubmit={handleLoginSubmit} className="flex flex-col gap-[40px] w-full">
                <div className="flex flex-col gap-[12px] w-full">
                  <AuthInput
                    name="password"
                    label="Enter password"
                    placeholder="Enter your password"
                    required
                    type="password"
                  />
                  <Link 
                    href={AuthRoute.FORGOT_PASSWORD} 
                    className="text-body-sm text-sd-grey-12 font-medium hover:underline self-start"
                  >
                    Forgot password?
                  </Link>
                </div>
                
                <div className="flex flex-col gap-[16px] w-full">
                  <AuthButton type="submit" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Continue"}
                  </AuthButton>
                  <p className="text-center text-caption-xs leading-[16px] text-sd-grey-11 font-medium">
                    By clicking on continue, you agree to SoluDesks{" "}
                    <Link href={WebsiteRoute.TERMS} className="underline">Terms of Use</Link> and{" "}
                    <Link href={WebsiteRoute.PRIVACY} className="underline">privacy policy</Link>
                  </p>
                </div>
              </form>
            </div>
          )}
        </div>
      </FormProvider>
    </AuthLayout>
  );
}
