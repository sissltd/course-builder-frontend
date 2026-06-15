"use client";

import React, { useState } from "react";
import { AuthLayout } from "@/modules/auth/components/AuthLayout";
import { AuthHeader } from "@/modules/auth/components/AuthHeader";
import { AuthInput } from "@/modules/auth/components/AuthInput";
import { AuthButton } from "@/modules/auth/components/AuthButton";
import Link from "next/link";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, ForgotPasswordFormData } from "@/modules/auth/utils/schemas";

export default function ForgotPasswordPage() {
  const [isSent, setIsSent] = useState(false);

  const methods = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
    },
  });

  const { handleSubmit } = methods;

  const onSubmit = (data: ForgotPasswordFormData) => {
    console.log("Sending reset link to", data.email);
    setIsSent(true);
  };

  if (isSent) {
    return (
      <AuthLayout showNav showSidebar={false} showLogo={false}>
        <div className="flex flex-col items-center text-center gap-[32px]">
          <div className="flex flex-col items-center gap-[24px]">
            <div className="relative w-[112px] h-[100px]">
              {/* Illustration of mail */}
              <div className="bg-blue-100 rounded-full w-[80px] h-[80px] flex items-center justify-center mx-auto">
                 <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 20.5H7C4 20.5 2 19 2 15.5V8.5C2 5 4 3.5 7 3.5H17C20 3.5 22 5 22 8.5V15.5C22 19 20 20.5 17 20.5Z" stroke="#0063EF" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M17 9L13.87 11.5C12.84 12.32 11.15 12.32 10.12 11.5L7 9" stroke="#0063EF" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                 </svg>
              </div>
            </div>
            <AuthHeader
              title="Check your mail"
              description="A password reset link has been successfully sent to your mail."
            />
          </div>

          <div className="flex flex-col gap-[24px] w-full">
            <div className="flex items-center justify-center gap-[8px] font-sans font-normal text-body-lg tracking-[-0.32px]">
              <p className="text-sd-grey-12">Didn’t receive the email?</p>
              <button className="text-sd-blue hover:underline" onClick={() => setIsSent(false)}>
                Resend link
              </button>
            </div>
            
            <div className="flex flex-col gap-[16px]">
              <AuthButton onClick={() => window.location.href = '/auth/login'}>Back to Login</AuthButton>
              <p className="text-center text-caption-xs leading-[16px] text-sd-grey-11 font-medium">
                By clicking on continue, you agree to Soludesk{" "}
                <Link href="/terms" className="underline">Terms of Use</Link> and{" "}
                <Link href="/privacy" className="underline">privacy policy</Link>
              </p>
            </div>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout showNav showSidebar={false} showLogo={false}>
      <AuthHeader
        title="Forgot password?"
        description="Can’t remember your password? don’t fret. We would help you set it up"
      />

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-[40px] w-full">
          <AuthInput
            name="email"
            label="Enter email address"
            placeholder="Enter address"
            required
            type="email"
          />
          
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
