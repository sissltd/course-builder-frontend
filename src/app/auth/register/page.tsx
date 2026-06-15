"use client";

import React, { useState } from "react";
import { AuthLayout } from "@/modules/auth/components/AuthLayout";
import { AuthHeader } from "@/modules/auth/components/AuthHeader";
import { SocialLogin } from "@/modules/auth/components/SocialLogin";
import { AuthInput } from "@/modules/auth/components/AuthInput";
import { AuthButton } from "@/modules/auth/components/AuthButton";
import Link from "next/link";
import { FormCheckbox } from "@/components/form/FormCheckbox";
import { FormSelect } from "@/components/form/FormSelect";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterFormData } from "@/modules/auth/utils/schemas";

type Step = "email" | "details" | "password";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");

  const methods = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
      country: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
  });

  const { handleSubmit, trigger } = methods;

  const handleContinue = async (data: RegisterFormData) => {
    if (step === "email") {
      const isEmailValid = await trigger("email");
      if (isEmailValid) setStep("details");
    } else if (step === "details") {
      const isDetailsValid = await trigger(["firstName", "lastName", "phone", "country", "agreeToTerms"]);
      if (isDetailsValid) setStep("password");
    } else if (step === "password") {
      const isPasswordValid = await trigger(["password", "confirmPassword"]);
      if (isPasswordValid) {
        console.log("Registering with", data);
        router.push("/auth/onboarding");
      }
    }
  };

  const isPasswordStep = step === "password";
  const isEmailStep = step === "email";

  return (
    <AuthLayout 
      showNav={!isEmailStep} 
      showLogo={isEmailStep}
      showSidebar={!isPasswordStep}
    >
      <AuthHeader
        title={step === "details" ? "Enter your details" : step === "password" ? "Create a Password" : "Create account"}
        description={
          step === "details" 
            ? "Provide the following information to create a new account" 
            : step === "password"
            ? "You will be required to input this password on you login"
            : "Enter the required information to create a new account"
        }
        linkPrefix={step === "email" ? "Already have an account?" : undefined}
        linkText={step === "email" ? "Log In" : undefined}
        linkHref="/auth/login"
      />

      <FormProvider {...methods}>
        <div className="flex flex-col gap-[32px] w-full">
          {step === "email" && (
            <>
              <SocialLogin label="Sign up using Google" />
              
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-sd-grey-8"></div>
                </div>
                <div className="relative bg-white px-2">
                  <span className="text-body-sm text-sd-grey-8 font-medium">or continue with your email</span>
                </div>
              </div>

              <form onSubmit={handleSubmit(handleContinue)} className="flex flex-col gap-[40px]">
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
            </>
          )}

          {step === "details" && (
            <form onSubmit={handleSubmit(handleContinue)} className="flex flex-col gap-[40px]">
              <div className="flex flex-col gap-[16px]">
                <AuthInput
                  name="firstName"
                  label="First name"
                  placeholder="Enter first name"
                  required
                />
                <AuthInput
                  name="lastName"
                  label="Last name"
                  placeholder="Enter last name"
                  required
                />
                <AuthInput
                  name="phone"
                  label="Phone number"
                  placeholder="Enter phone number"
                  required
                  leftElement="US"
                />
                <FormSelect
                  name="country"
                  label="Country/Region"
                  placeholder="Select country"
                  required
                  options={[
                    { label: "United States", value: "US" },
                    { label: "Nigeria", value: "NG" },
                    { label: "United Kingdom", value: "UK" },
                  ]}
                />

                <FormCheckbox
                  name="agreeToTerms"
                  label="I agree to the Terms & Condition and Privacy Policy including all product services"
                  className="mt-1"
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
          )}

          {step === "password" && (
            <form onSubmit={handleSubmit(handleContinue)} className="flex flex-col gap-[40px] w-full max-w-[400px] mx-auto">
              <div className="flex flex-col gap-[16px]">
                <AuthInput
                  name="password"
                  label="Password"
                  placeholder="********"
                  required
                  type="password"
                />
                <div className="flex flex-col gap-[7px]">
                  <AuthInput
                    name="confirmPassword"
                    label="Re-enter password"
                    placeholder="********"
                    required
                    type="password"
                  />
                  <div className="flex items-start">
                    <div className="flex flex-1 flex-col gap-[2px]">
                      <ul className="list-disc ms-[18px] text-caption-xs text-sd-grey-11">
                        <li><span className="leading-[16px]">minimum 8 characters</span></li>
                        <li><span className="leading-[16px]">one number</span></li>
                      </ul>
                    </div>
                    <div className="flex flex-1 flex-col gap-[2px]">
                      <ul className="list-disc ms-[18px] text-caption-xs text-sd-grey-11">
                        <li><span className="leading-[16px]">one uppercase character</span></li>
                        <li><span className="leading-[16px]">one lowercase character</span></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-[16px]">
                <AuthButton type="submit">Set password</AuthButton>
                <p className="text-center text-caption-xs leading-[16px] text-sd-grey-11 font-medium">
                  By clicking on continue, you agree to Soludesk{" "}
                  <Link href="/terms" className="underline">Terms of Use</Link> and{" "}
                  <Link href="/privacy" className="underline">privacy policy</Link>
                </p>
              </div>
            </form>
          )}
        </div>
      </FormProvider>
    </AuthLayout>
  );
}
