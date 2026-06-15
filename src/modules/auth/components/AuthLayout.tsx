import React from "react";
import Image from "next/image";
import { AuthSidebar } from "./AuthSidebar";
import { AuthLogo } from "./AuthLogo";
import { AuthHeaderNav } from "./AuthHeaderNav";
import { cn } from "@/lib/utils";

interface AuthLayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
  showLogo?: boolean;
  showSidebar?: boolean;
}

export const AuthLayout = ({ 
  children, 
  showNav = false, 
  showLogo = true,
  showSidebar = true 
}: AuthLayoutProps) => {
  return (
    <div className="min-h-screen w-full bg-white flex flex-col relative overflow-hidden">
      {/* Background Decorative Blobs/Patterns */}
      <div className="absolute bottom-0 left-0 w-full h-[400px] xl:h-[600px] pointer-events-none opacity-60 z-0">
         <Image alt="pattern" fill src="/assets/auth/bg-pattern-1.png" className="object-bottom object-left" />
      </div>
      
      {/* Header Container (Part of the flow) */}
      <header className="w-full flex flex-col z-20 px-6 lg:px-16 xl:px-12 pt-10 shrink-0">
        {showLogo && (
          <div className="mb-2">
            <AuthLogo />
          </div>
        )}
        {showNav && <AuthHeaderNav />}
      </header>

      <main className={cn(
        "flex-1 w-full max-w-[1400px] mx-auto flex flex-col items-center py-12 xl:py-16 px-6 lg:px-16",
        showSidebar 
          ? "xl:flex-row xl:justify-between xl:px-12" 
          : "justify-center"
      )}>
        {/* Left/Center Side: Form */}
        <div className={cn(
          "w-full max-w-[500px] z-10 flex flex-col items-center",
          !showSidebar && "mx-auto" // Center strictly if no sidebar
        )}>
          {children}
        </div>

        {/* Right Side: Sidebar */}
        {showSidebar && (
          <div className="hidden xl:block w-[623px] h-[728px] shrink-0 mt-[20px]">
            <AuthSidebar />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-12 flex justify-center w-full mt-auto z-10">
        <p className="font-sans font-normal text-body-sm text-sd-grey-11 tracking-[-0.28px]">
          2026 Soludesks Incoporated
        </p>
      </footer>
    </div>
  );
};
