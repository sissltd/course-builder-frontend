"use client";

import React, { useState } from "react";
import { AuthLayout } from "@/modules/auth/components/AuthLayout";
import { AuthHeader } from "@/modules/auth/components/AuthHeader";
import { AuthInput } from "@/modules/auth/components/AuthInput";
import { AuthButton } from "@/modules/auth/components/AuthButton";
import Link from "next/link";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, ResetPasswordFormData } from "@/modules/auth/utils/schemas";

export default function ResetPasswordPage() {
  const [isSuccess, setIsSuccess] = useState(false);

  const methods = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onBlur",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { handleSubmit } = methods;

  const onSubmit = (data: ResetPasswordFormData) => {
    console.log("Resetting password with", data);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <AuthLayout showNav showSidebar={false} showLogo={false}>
        <div className="flex flex-col items-center text-center gap-[32px]">
          <div className="flex flex-col items-center gap-[24px]">
            <div className="bg-green-100 rounded-full w-[80px] h-[80px] flex items-center justify-center mx-auto">
               <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM16.78 9.7L11.11 15.37C10.97 15.51 10.78 15.59 10.58 15.59C10.38 15.59 10.19 15.51 10.05 15.37L7.22 12.54C6.93 12.25 6.93 11.77 7.22 11.48C7.51 11.19 7.99 11.19 8.28 11.48L10.58 13.78L15.72 8.64C16.01 8.35 16.49 8.35 16.78 8.64C17.07 8.93 17.07 9.41 16.78 9.7Z" fill="#22C55E"/>
               </svg>
            </div>
            <AuthHeader
              title="Password reset successful"
              description="Your password has been successfully reset. You can now log in with your new password."
            />
          </div>

          <div className="flex flex-col gap-[16px] w-full">
            <AuthButton onClick={() => window.location.href = '/auth/login'}>Proceed to Login</AuthButton>
            <p className="text-center text-caption-xs leading-[16px] text-sd-grey-11 font-medium">
              By clicking on continue, you agree to Soludesk{" "}
              <Link href="/terms" className="underline">Terms of Use</Link> and{" "}
              <Link href="/privacy" className="underline">privacy policy</Link>
            </p>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout showNav showSidebar={false} showLogo={false}>
      <AuthHeader
        title="Create new password"
        description="Fill in the fields below to reset your password."
      />

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-[40px] w-full">
          <div className="flex flex-col gap-[16px]">
            <AuthInput
              name="password"
              label="New password"
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
          </div>
          
          <div className="flex flex-col gap-[16px]">
            <AuthButton type="submit">Continue</AuthButton>
            <p className="text-center text-caption-xs leading-[16px] text-sd-grey-11 font-medium">
              By clicking on continue, you agree to Soludesk{" "}
              <Link href="/terms" className="underline">Terms of Use</Link> and{" "}
              <Link href="/privacy" className="underline">privacy policy</Link>
            </p>
          </div>
        </form>
      </FormProvider>
    </AuthLayout>
  );
}
