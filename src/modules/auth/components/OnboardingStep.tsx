import React from "react";
import { AuthButton } from "./AuthButton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface OnboardingStepProps {
  title: string;
  description: string;
  children: React.ReactNode;
  onNext: () => void;
  onBack: () => void;
  progress: number; // 0 to 100
  nextLabel?: string;
}

export const OnboardingStep = ({
  title,
  description,
  children,
  onNext,
  onBack,
  progress,
  nextLabel = "Continue",
}: OnboardingStepProps) => {
  return (
    <div className="flex flex-col gap-[40px] w-full max-w-[400px]">
      {/* Progress Bar Container */}
      <div className="flex flex-col gap-[40px]">
        <div className="w-full h-[7px] bg-[#F0F0F0] rounded-full overflow-hidden shrink-0">
          <div 
            className="h-full bg-[#0063EF] transition-all duration-300" 
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex flex-col gap-[8px]">
          <h1 className="font-heading font-bold text-display-md text-sd-grey-12">
            {title}
          </h1>
          <p className="font-sans font-normal text-body-lg text-sd-grey-11 tracking-[-0.32px]">
            {description}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-[32px]">
        {children}
      </div>

      <div className="flex gap-[16px] mt-auto lg:mt-8">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="flex-1 h-[44px] border-sd-grey-6 text-sd-grey-12"
        >
          Back
        </Button>
        <AuthButton 
          onClick={onNext}
          className="flex-1"
        >
          {nextLabel}
        </AuthButton>
      </div>
    </div>
  );
};
