"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "iconsax-react";

interface FullscreenLayoutProps {
  title?: string;
  backLabel?: string;
  onBack?: () => void;
  children: React.ReactNode;
  showHeader?: boolean;
}

export const FullscreenLayout = ({
  title,
  backLabel = "Back",
  onBack,
  children,
  showHeader = true,
}: FullscreenLayoutProps) => {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#FDFDFD]">
      {showHeader && (
        <header className="h-[60px] bg-white border-b border-[#F0F0F0] flex items-center px-[24px] sticky top-0 z-30 w-full shrink-0">
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-[8px] text-[#202020] hover:text-[#0063EF] transition-colors"
          >
            <ArrowLeft size={18} variant="Linear" color="#202020" />
            <span className="text-[14px] font-medium">{backLabel}</span>
          </button>
          {title && (
            <>
              <div className="h-[20px] w-px bg-[#E0E0E0] mx-[16px]" />
              <span className="text-[16px] font-semibold text-[#202020]">
                {title}
              </span>
            </>
          )}
        </header>
      )}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
};
