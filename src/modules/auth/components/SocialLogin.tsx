import React from "react";
import Image from "next/image";
import { Button } from "@/components/shared/Button";

interface SocialLoginProps {
  label?: string;
  onClick?: () => void;
  type?: "google" | "apple";
}

export const SocialLogin = ({ label = "Continue with Google", onClick, type = "google" }: SocialLoginProps) => {
  return (
    <Button
      variant={type === "google" ? "google" : "apple"}
      className="w-full h-[44px] gap-[8px]"
      onClick={onClick}
      leftIcon={
        <div className="relative size-[20px]">
          <Image 
            alt={type === "google" ? "Google" : "Apple"} 
            fill 
            src={type === "google" ? "/assets/auth/google-icon.png" : "/assets/auth/apple-icon.png"} 
          />
        </div>
      }
    >
      {label}
    </Button>
  );
};
