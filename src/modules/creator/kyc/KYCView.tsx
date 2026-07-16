"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/shared/Button";
import { FormCheckbox } from "@/components/form/FormCheckbox";
import { FormInput } from "@/components/form/FormInput";
import { Modal } from "@/components/shared/Modal";
import { ArrowLeft } from "iconsax-react";
import { cn } from "@/lib/utils";
import { FormSelect } from "@/components/form/FormSelect";
import { Country } from "country-state-city";
import { kycSchema, KYCFormData } from "./utils/validation";

type Step = "personal" | "id-selection" | "id-input" | "success";

const ID_OPTIONS = [
  "National ID (NIN)",
  "Driver’s License",
  "International passport",
  "Voter’s ID",
];

const countryOptions = Country.getAllCountries().map((c) => ({
  label: c.name,
  value: c.isoCode,
  searchValue: `${c.name} ${c.isoCode}`,
}));

export default function KYCView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stepParam = searchParams.get("step");
  const [step, setStep] = useState<Step>(
    stepParam === "2" ? "id-selection" : "personal"
  );

  const methods = useForm<KYCFormData>({
    resolver: zodResolver(kycSchema),
    mode: "onBlur",
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      address: "",
      agreed: false,
      countryOfIssue: "US",
      selectedId: "",
      idNumber: "",
    },
  });

  const {
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = methods;

  const selectedId = watch("selectedId");
  const agreed = watch("agreed");
  const countryOfIssue = watch("countryOfIssue");

  const handleNext = async () => {
    if (step === "personal") {
      const isValid = await trigger(["firstName", "lastName", "dateOfBirth", "address", "agreed"]);
      if (isValid) setStep("id-selection");
    } else if (step === "id-selection") {
      const isValid = await trigger(["countryOfIssue", "selectedId"]);
      if (isValid) setStep("id-input");
    }
  };

  const onSubmit = (data: KYCFormData) => {
    console.log("KYC Submitted Data:", data);
    setStep("success");
  };

  const handleClose = () => {
    router.push("/dashboard");
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col min-h-screen animate-in fade-in duration-500 w-full relative">
        {/* Top Navigation Bar / Header */}
        {step !== "success" && (
          <header className="h-[60px] bg-white border-b border-[#F0F0F0] flex items-center px-[24px] sticky top-0 z-30 justify-between w-full shrink-0">
            <div className="flex items-center gap-[16px]">
              <button 
                type="button"
                onClick={() => {
                  if (step === "personal") router.back();
                  else if (step === "id-selection") setStep("personal");
                  else if (step === "id-input") setStep("id-selection");
                }}
                className="flex items-center gap-[8px] text-[#202020] hover:text-[#0063EF] transition-colors font-medium text-[14px]"
              >
                <ArrowLeft size={18} variant="Linear" color="#202020" />
                <span>Back</span>
              </button>
              <div className="h-[20px] w-px bg-[#E0E0E0]" />
              <span className="text-[16px] font-semibold text-[#202020]">Complete KYC</span>
            </div>
          </header>
        )}

        {/* Step 1: Personal Details */}
        {step === "personal" && (
          <div className="flex flex-col items-center flex-1 max-w-[500px] mx-auto w-full py-[60px] px-[20px]">
            <div className="flex flex-col items-center text-center w-full mb-[40px]">
              <h1 className="text-[32px] font-semibold text-[#202020] tracking-[-0.64px] leading-[40px] mb-[16px]">Personal details</h1>
              <p className="text-[16px] text-[#606060] leading-[24px]">Kindly provide your personal information</p>
            </div>

            <div className="w-full flex flex-col gap-[40px]">
              <div className="flex flex-col gap-[16px]">
                <FormInput name="firstName" label="First name" placeholder="Enter first name" required />
                <FormInput name="lastName" label="Last name" placeholder="Enter last name" required />
                <FormInput name="dateOfBirth" label="Date of birth" type="date" required />
                <FormInput name="address" label="Address" placeholder="Enter residential address" required />
              </div>

              <div className="flex flex-col gap-[40px]">
                <FormCheckbox 
                  name="agreed"
                  label="I agree to the Terms & Condition and Privacy Policy including all product services"
                  className="text-[14px] leading-[20px]"
                />
                <Button 
                  type="button"
                  variant="app-primary" 
                  className="w-full h-[44px]"
                  disabled={!agreed}
                  onClick={handleNext}
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: ID Selection */}
        {step === "id-selection" && (
          <div className="flex flex-col items-center flex-1 max-w-[500px] mx-auto w-full py-[60px] px-[20px]">
            <div className="flex flex-col items-center text-center w-full mb-[40px]">
              <h1 className="text-[32px] font-semibold text-[#202020] tracking-[-0.64px] leading-[40px] mb-[16px]">Government ID</h1>
              <p className="text-[16px] text-[#606060] leading-[24px]">Select a recognized government ID to continue</p>
            </div>

            <div className="w-full flex flex-col gap-[40px]">
              <div className="flex flex-col gap-[16px]">
                <FormSelect
                  label="Select the country of issue"
                  required
                  searchable
                  options={countryOptions}
                  placeholder="Select country"
                  name="countryOfIssue"
                  prefix={
                    <div className="flex items-center gap-[4px] pr-[8px] border-r border-[#E8E8E8] h-[24px] text-[#202020] font-medium text-[14px]">
                      <span>{countryOfIssue || "US"}</span>
                    </div>
                  }
                />
                <div className="flex flex-col gap-[16px]">
                  <div className="flex flex-col gap-[8px]">
                    <span className="text-[14px] font-medium text-[#202020]">Select ID Type <span className="text-[#FF5025]">*</span></span>
                    {ID_OPTIONS.map((type) => (
                      <div
                        key={type}
                        onClick={() => setValue("selectedId", type, { shouldValidate: true })}
                        className={cn(
                          "flex items-center gap-[12px] h-[56px] px-[16px] border rounded-[8px] cursor-pointer transition-all bg-white",
                          selectedId === type ? "border-[#0063EF]" : "border-[#F0F0F0] hover:border-[#D9D9D9]"
                        )}
                      >
                        <div className={cn(
                          "size-[20px] rounded-full border flex items-center justify-center transition-all shrink-0",
                          selectedId === type ? "border-[#0063EF] border-[6px]" : "border-[#D9D9D9]"
                        )} />
                        <span className={cn("text-[14px] font-medium leading-[24px]", selectedId === type ? "text-[#202020]" : "text-[#606060]")}>
                          {type}
                        </span>
                      </div>
                    ))}
                    {errors.selectedId && (
                      <p className="text-caption-xs text-[#FF5025] mt-[4px]">{errors.selectedId.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-[56px]">
                <p className="text-[14px] text-[#606060] leading-[20px]">
                  By clicking continue, you agree to Soludesk Verification Policy and Terms of Service
                </p>
                <Button 
                  type="button"
                  variant="app-primary" 
                  className="w-full h-[44px]"
                  disabled={!selectedId}
                  onClick={handleNext}
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: ID Input */}
        {step === "id-input" && (
          <div className="flex flex-col items-center flex-1 max-w-[500px] mx-auto w-full py-[60px] px-[20px]">
            <div className="flex flex-col items-center text-center w-full mb-[40px]">
              <h1 className="text-[32px] font-semibold text-[#202020] tracking-[-0.64px] leading-[40px] mb-[16px]">{selectedId}</h1>
              <p className="text-[16px] text-[#606060] leading-[24px]">Please enter your {selectedId?.toLowerCase()} number in the field below</p>
            </div>

            <div className="w-full flex flex-col gap-[40px]">
              <FormInput
                name="idNumber"
                label={`${selectedId || 'ID'} number`} 
                placeholder={`Enter your ${selectedId?.split(' ')[0]} number`}
                required
              />
              
              <div className="flex flex-col gap-[56px]">
                <p className="text-[14px] text-[#606060] leading-[20px]">
                  By clicking continue, you agree to Soludesk Verification Policy and Terms of Service
                </p>
                <Button 
                  type="submit" 
                  variant="app-primary" 
                  className="w-full h-[44px]"
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Success Modal Overlay */}
        <Modal
          isOpen={step === "success"}
          onOpenChange={(open) => {
             if (!open) handleClose();
          }}
          showCloseButton={false}
          className="sm:max-w-[365px] p-0"
        >
          <div className="flex flex-col p-[20px] pb-[32px]">
            <div className="size-[60px] rounded-full bg-[#EBF7EE] flex items-center justify-center text-[#27AE60] mb-[20px]">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M26.2085 4.0767C25.9659 4.18203 24.6285 5.0207 23.5099 5.76736C20.1552 8.0087 17.2339 10.4314 13.0152 14.4714C12.3299 15.1274 11.8485 15.55 11.8152 15.5247C11.0513 14.9505 10.2864 14.3776 9.52055 13.806C8.04055 12.6994 7.20588 12.1087 7.06055 12.066C6.57122 11.9207 6.13388 12.038 5.67921 12.438C4.52188 13.458 3.09788 14.7714 2.97655 14.9314C2.82734 15.1417 2.74335 15.3913 2.73506 15.649C2.72676 15.9067 2.79452 16.1612 2.92988 16.3807C3.06188 16.5847 6.49788 20.182 10.6405 24.4554C12.2792 26.1447 12.3032 26.1607 13.2005 26.1607C13.7672 26.1607 13.7992 26.154 14.1219 25.9794C14.5539 25.7447 14.7219 25.5527 15.1992 24.746C17.7739 20.386 21.7565 15.4967 27.2325 9.97403C28.2645 8.9327 29.1486 8.00203 29.1979 7.9047C29.3192 7.66203 29.3579 7.27136 29.2859 7.0047C29.2246 6.77936 27.8979 4.69003 27.6365 4.40736C27.3099 4.05536 26.6232 3.8967 26.2085 4.0767ZM25.0086 8.41403C20.8832 12.606 17.4792 16.6034 14.9792 20.1914C14.3192 21.1394 13.4699 22.4327 13.2232 22.8674C13.1512 22.9914 13.0779 23.094 13.0592 23.094C13.0405 23.094 11.4365 21.4434 9.49655 19.4274L5.96855 15.7607L6.33122 15.43C6.53122 15.2474 6.71522 15.0967 6.74188 15.0967C6.76855 15.0954 7.81388 15.862 9.06588 16.7994C10.4285 17.8207 11.4325 18.538 11.5699 18.586C11.8619 18.6887 12.0699 18.6887 12.4219 18.5834C12.6779 18.5087 12.8125 18.3927 13.9139 17.3167C17.7045 13.6154 20.7419 10.9767 23.4139 9.06336C23.9205 8.7007 26.1472 7.2007 26.1779 7.2007C26.1912 7.2007 25.6646 7.74736 25.0086 8.41403Z" fill="#008500" />
              </svg>
            </div>
            <div className="flex flex-col gap-[16px] mb-[32px]">
              <h2 className="text-[20px] font-semibold text-[#202020] tracking-[-0.4px] leading-[28px]">KYC submitted</h2>
              <p className="text-[14px] text-[#606060] leading-[20px]">
                Thanks for taking this time to complete your KYC verification. You will be notified once your account is verified
              </p>
            </div>
            <Button variant="app-primary" type="button" className="w-full h-[44px]" onClick={handleClose}>
              Go home
            </Button>
          </div>
        </Modal>
      </form>
    </FormProvider>
  );
}
