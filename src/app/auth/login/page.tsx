"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import { AuthLayout } from "@/modules/auth/components/AuthLayout";
import { AuthHeader } from "@/modules/auth/components/AuthHeader";
import { SocialLogin } from "@/modules/auth/components/SocialLogin";
import { LoadingState } from "@/modules/auth/components/LoadingState";
import { AuthRoute, WebsiteRoute } from "@/lib/routes";
import { AuthInput } from "@/modules/auth/components/AuthInput";
import { AuthButton } from "@/modules/auth/components/AuthButton";
import Link from "next/link";
import { Warning2 } from "iconsax-react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/modules/auth/utils/schemas";
import { useLoginMutation } from "@/modules/auth/api/sessionApi";


import { normalizeApiError, getErrorEnvelope } from "@/lib/api/errors";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { useAppDispatch } from "@/redux";
import { setCredentials } from "@/redux/slices/authSlice";
import {
  getDashboardRoute,
  getWorkspaceForRole,
} from "@/modules/auth/utils/workspace";
import {
  GOOGLE_AUTH_PENDING_STORAGE_KEY,
  GOOGLE_CALLBACK_URL_STORAGE_KEY,
} from "@/modules/auth/utils/storage";

const isSafeInternalPath = (value: string | null): value is string =>
  Boolean(
    value &&
      value.startsWith("/") &&
      !value.startsWith("//") &&
      !value.startsWith("/auth"),
  );

function LoginContent() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const googleHandoff = searchParams.get("google") === "1";
  const queryError = searchParams.get("error");
  const [step, setStep] = useState<"email" | "password">("email");
  const [formError, setFormError] = useState<string | null>(null);
  const [login, { isLoading }] = useLoginMutation();
  const googleAuthHandled = useRef(false);
  const routerRef = useRef(router);

  useEffect(() => {
    routerRef.current = router;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const methods = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { handleSubmit, trigger, setError } = methods;

  useEffect(() => {
    console.log("[GoogleLogin] useEffect: googleHandoff=", googleHandoff, "status=", status, {
      hasSession: Boolean(session),
      googleError: session?.googleError,
      googleSignupRequired: session?.googleSignupRequired,
      sessionError: session?.error,
      hasUser: Boolean(session?.user),
      hasAccessToken: Boolean(session?.accessToken),
      googleIdToken: session?.googleIdToken,
      alreadyHandled: googleAuthHandled.current,
    });

    if (googleAuthHandled.current) {
      console.log("[GoogleLogin] useEffect: already handled, skipping");
      return;
    }

    const hasPending =
      googleHandoff ||
      sessionStorage.getItem(GOOGLE_AUTH_PENDING_STORAGE_KEY) === "1";
    if (!hasPending || status === "loading") {
      console.log("[GoogleLogin] useEffect: no pending or still loading, returning");
      return;
    }

    if (status === "authenticated" && session) {
      googleAuthHandled.current = true;

      if (session.googleSignupRequired) {
        console.log("[GoogleLogin] useEffect: googleSignupRequired → redirecting to SIGNUP_GOOGLE");
        sessionStorage.removeItem(GOOGLE_AUTH_PENDING_STORAGE_KEY);
        routerRef.current.replace(AuthRoute.SIGNUP_GOOGLE);
        return;
      }

      if (session.googleError) {
        console.log("[GoogleLogin] useEffect: googleError →", session.googleError);
        console.log(
          "[GoogleLogin] Google id_token returned from Google (debug):",
          session.googleIdToken,
        );
        sessionStorage.removeItem(GOOGLE_AUTH_PENDING_STORAGE_KEY);
        return;
      }

      if (session.error === "RefreshAccessTokenError") {
        console.log("[GoogleLogin] useEffect: RefreshAccessTokenError");
        sessionStorage.removeItem(GOOGLE_AUTH_PENDING_STORAGE_KEY);
        return;
      }

      if (session.user && session.accessToken) {
        console.log("[GoogleLogin] useEffect: SUCCESS — dispatching credentials, redirecting", {
          userId: session.user.id,
          role: session.user.role,
        });
        dispatch(
          setCredentials({
            user: session.user,
            accessToken: session.accessToken,
          }),
        );

        const storedCallback = sessionStorage.getItem(
          GOOGLE_CALLBACK_URL_STORAGE_KEY,
        );
        sessionStorage.removeItem(GOOGLE_AUTH_PENDING_STORAGE_KEY);
        sessionStorage.removeItem(GOOGLE_CALLBACK_URL_STORAGE_KEY);

        const workspace =
          session.user.workspace ??
          getWorkspaceForRole(session.role ?? session.user.role);
        const target = isSafeInternalPath(storedCallback)
          ? storedCallback
          : getDashboardRoute(workspace);

        console.log("[GoogleLogin] useEffect: redirecting to", target);
        routerRef.current.replace(target);
        routerRef.current.refresh();
        return;
      }

      console.log("[GoogleLogin] useEffect: authenticated but no user/accessToken — not handled");
      return;
    }

    if (status === "unauthenticated") {
      console.log("[GoogleLogin] useEffect: unauthenticated, clearing pending flag");
    }

    sessionStorage.removeItem(GOOGLE_AUTH_PENDING_STORAGE_KEY);
  }, [googleHandoff, status, session, dispatch]);

  const googleSigningIn =
    googleHandoff &&
    (status === "loading" ||
      (status === "authenticated" &&
        Boolean(session?.user?.id) &&
        Boolean(session?.accessToken) &&
        !session?.googleError &&
        session?.error !== "RefreshAccessTokenError" &&
        !session?.googleSignupRequired));

  const sessionAuthError =
    session?.googleError ??
    (session?.error === "RefreshAccessTokenError"
      ? "Your session expired. Please sign in again."
      : null);

  const displayError =
    formError ??
    sessionAuthError ??
    (queryError
      ? "Google sign in was cancelled or failed. Please try again."
      : null);

  console.log("[GoogleLogin] displayError:", displayError, {
    formError,
    sessionAuthError,
    queryError,
    googleHandoff,
  });

  const handleGoogleLogin = async () => {
    setFormError(null);
    const callbackUrl = new URLSearchParams(window.location.search).get(
      "callbackUrl",
    );
    if (callbackUrl) {
      sessionStorage.setItem(GOOGLE_CALLBACK_URL_STORAGE_KEY, callbackUrl);
    }
    sessionStorage.setItem(GOOGLE_AUTH_PENDING_STORAGE_KEY, "1");
    await signIn("google", { callbackUrl: `${AuthRoute.LOGIN}?google=1` });
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const isEmailValid = await trigger("email");
    if (isEmailValid) {
      setStep("password");
    }
  };

  const handleLoginSubmit = handleSubmit(async (data) => {
    setFormError(null);
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
        setFormError("Sign in failed. Please try again.");
        return;
      }

      dispatch(
        setCredentials({
          user: result.user,
          accessToken: result.access,
        }),
      );

      const callbackUrl = new URLSearchParams(window.location.search).get(
        "callbackUrl",
      );
      router.push(
        isSafeInternalPath(callbackUrl)
          ? callbackUrl
          : getDashboardRoute(workspace),
      );
      router.refresh();
    } catch (error) {
      const { fieldErrors, message } = normalizeApiError(error as never);

      const envelope = getErrorEnvelope(error as never);
      const isEmailNotVerified =
        (message && message.toLowerCase().includes("not been verified")) ||
        (envelope &&
          envelope.errors.some(
            (e) =>
              e.code === "EMAIL_NOT_VERIFIED" ||
              e.message.toLowerCase().includes("not been verified"),
          ));
      if (isEmailNotVerified) {
        const emailValue = methods.getValues("email");
        if (emailValue) {
          router.push(`${AuthRoute.VERIFY_EMAIL}?email=${encodeURIComponent(emailValue)}&fromLogin=true`);
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
        setFormError(message);
      }
    }
  });

  if (googleSigningIn) {
    return (
      <AuthLayout showNav={false} showLogo>
        <LoadingState message="Signing you in..." />
      </AuthLayout>
    );
  }

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
          {displayError && (
            <div
              role="alert"
              data-testid="auth-error"
              className="w-full flex items-start gap-[10px] rounded-[10px] border border-[#FDA29B] bg-[#FFFBFA] px-[14px] py-[12px]"
            >
              <Warning2
                variant="Bold"
                color="#B42318"
                size={20}
                className="mt-[1px] shrink-0"
              />
              <p className="text-[14px] leading-[20px] font-medium text-[#B42318]">
                {displayError}
              </p>
            </div>
          )}

          {step === "email" && (
            <>
              <SocialLogin label="Continue with Google" onClick={handleGoogleLogin} />
              
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
              <SocialLogin label="Continue with Google" onClick={handleGoogleLogin} />
              
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

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}
