"use client";

import React, { useState } from "react";
import { AuthLayout } from "@/modules/auth/components/AuthLayout";
import { OnboardingStep } from "@/modules/auth/components/OnboardingStep";
import { FormOptionSelect } from "@/components/form/FormOptionSelect";
import { AuthInput } from "@/modules/auth/components/AuthInput";
import { FormCheckbox } from "@/components/form/FormCheckbox";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { onboardingSchema, OnboardingFormData } from "@/modules/auth/utils/schemas";

type OnboardingStepType = "expertise" | "proficiency" | "courses" | "legal";

export default function OnboardingPage() {
  const [step, setStep] = useState<OnboardingStepType>("expertise");

  const methods = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    mode: "onBlur",
    defaultValues: {
      expertise: "",
      otherExpertise: "",
      proficiency: "",
      coursesPerMonth: "",
      agreeToLegal: false,
    },
  });

  const { handleSubmit, trigger, watch } = methods;
  const expertise = watch("expertise");

  const steps: OnboardingStepType[] = ["expertise", "proficiency", "courses", "legal"];
  const currentStepIndex = steps.indexOf(step);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleNext = async () => {
    let isValid = false;
    if (step === "expertise") {
      isValid = await trigger(["expertise", "otherExpertise"]);
    } else if (step === "proficiency") {
      isValid = await trigger("proficiency");
    } else if (step === "courses") {
      isValid = await trigger("coursesPerMonth");
    } else if (step === "legal") {
      isValid = await trigger("agreeToLegal");
    }

    if (isValid) {
      if (currentStepIndex < steps.length - 1) {
        setStep(steps[currentStepIndex + 1]);
      } else {
        handleSubmit((data) => {
          console.log("Onboarding complete", data);
          window.location.href = "/dashboard";
        })();
      }
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setStep(steps[currentStepIndex - 1]);
    } else {
      window.history.back();
    }
  };

  return (
    <AuthLayout showSidebar={false}>
      <FormProvider {...methods}>
        {step === "expertise" && (
          <OnboardingStep
            title="Area of expertise"
            description="Which of these best describes your primary area of expertise?"
            progress={progress}
            onNext={handleNext}
            onBack={handleBack}
          >
            <div className="flex flex-col gap-[8px]">
              {[
                "Web Development",
                "Data Science & Analytics",
                "AI & Machine Learning",
                "Business & Management",
                "Digital Marketing",
                "Leadership & Soft Skills",
                "Finance & Accounting",
                "Others (Specify)",
              ].map((option) => (
                <div key={option} className="flex flex-col gap-2">
                  <FormOptionSelect name="expertise" label={option} />
                  {option === "Others (Specify)" && expertise === option && (
                    <AuthInput
                      name="otherExpertise"
                      label="Specify expertise"
                      placeholder="Enter your expertise"
                      containerClassName="ml-9"
                    />
                  )}
                </div>
              ))}
            </div>
          </OnboardingStep>
        )}

        {step === "proficiency" && (
          <OnboardingStep
            title="Level of Proficiency"
            description="How comfortable are you creating video content?"
            progress={progress}
            onNext={handleNext}
            onBack={handleBack}
          >
            <div className="flex flex-col gap-[16px]">
              {[
                "Not comfortable, I’ll need guidance",
                "Somewhat comfortable, I’ve recorded a few video",
                "Very comfortable, I produce video regularly",
                "I prefer text-based or audio content",
              ].map((option) => (
                <FormOptionSelect key={option} name="proficiency" label={option} />
              ))}
            </div>
          </OnboardingStep>
        )}

        {step === "courses" && (
          <OnboardingStep
            title="Number of courses"
            description="How many courses are you realistically able to produce per month?"
            progress={progress}
            onNext={handleNext}
            onBack={handleBack}
          >
            <div className="flex flex-col gap-[16px]">
              {[
                "1 course",
                "2 - 3 courses",
                "4 - 5 courses",
                "More than 5 courses",
              ].map((option) => (
                <FormOptionSelect key={option} name="coursesPerMonth" label={option} />
              ))}
            </div>
          </OnboardingStep>
        )}

        {step === "legal" && (
          <OnboardingStep
            title="Legal agreements"
            description="Terms of use and privacy policy agreement"
            progress={progress}
            onNext={handleNext}
            onBack={handleBack}
            nextLabel="Finish"
          >
            <div className="flex flex-col gap-[24px]">
              <div className="flex flex-col gap-[12px]">
                <h3 className="font-sans font-medium text-paragraph text-sd-grey-12">
                  NDA & IP Ownership Agreement
                </h3>
                <p className="font-sans font-normal text-body-lg text-sd-grey-11">
                  By participating as a trainer, you agree that all content created within SoluDesks Course Builder Studio is the exclusive property of SoluDesks. You maintain no ownership or publishing rights over the submitted materials. All intellectual property is transferred upon submission.
                </p>
              </div>

              <FormCheckbox
                name="agreeToLegal"
                label="I have read this legal agreement and agree to the policy right as stated above."
                className="mt-1"
              />
            </div>
          </OnboardingStep>
        )}
      </FormProvider>
    </AuthLayout>
  );
}
