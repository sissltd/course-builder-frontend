"use client";

import React, { useState } from "react";
import { AuthLayout } from "@/modules/auth/components/AuthLayout";
import { AuthHeader } from "@/modules/auth/components/AuthHeader";
import { SocialLogin } from "@/modules/auth/components/SocialLogin";
import { AuthInput } from "@/modules/auth/components/AuthInput";
import { AuthButton } from "@/modules/auth/components/AuthButton";
import Link from "next/link";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/modules/auth/utils/schemas";

export default function LoginPage() {
  const [step, setStep] = useState<"email" | "password">("email");
  
  const methods = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { handleSubmit, trigger, watch } = methods;
  const email = watch("email");

  const handleContinue = async (data: LoginFormData) => {
    if (step === "email") {
      const isEmailValid = await trigger("email");
      if (isEmailValid) {
        setStep("password");
      }
    } else {
      // Handle login logic
      console.log("Logging in with", data);
    }
  };

  return (
    <AuthLayout showNav={step === "password"} showLogo={step !== "password"}>
      <AuthHeader
        title="Log in your account"
        description="Enter the required information to access your account"
        linkPrefix="Don’t have an account?"
        linkText="Create one"
        linkHref="/auth/register"
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

              <form onSubmit={handleSubmit(handleContinue)} className="flex flex-col gap-[40px] w-full">
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
                    By clicking on continue, you agree to Soludesk{" "}
                    <Link href="/terms" className="underline">Terms of Use</Link> and{" "}
                    <Link href="/privacy" className="underline">privacy policy</Link>
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

              <form onSubmit={handleSubmit(handleContinue)} className="flex flex-col gap-[40px] w-full">
                <div className="flex flex-col gap-[12px] w-full">
                  <AuthInput
                    name="password"
                    label="Enter password"
                    placeholder="Enter your password"
                    required
                    type="password"
                  />
                  <Link 
                    href="/auth/forgot-password" 
                    className="text-body-sm text-sd-grey-12 font-medium hover:underline self-start"
                  >
                    Forgot password?
                  </Link>
                </div>
                
                <div className="flex flex-col gap-[16px] w-full">
                  <AuthButton type="submit">Continue</AuthButton>
                  <p className="text-center text-caption-xs leading-[16px] text-sd-grey-11 font-medium">
                    By clicking on continue, you agree to Soludesk{" "}
                    <Link href="/terms" className="underline">Terms of Use</Link> and{" "}
                    <Link href="/privacy" className="underline">privacy policy</Link>
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
