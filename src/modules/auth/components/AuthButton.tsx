import React from "react";
import { AppButton } from "@/components/shared/AppButton";
import { cn } from "@/lib/utils";

interface AuthButtonProps extends React.ComponentProps<typeof AppButton> {
  children: React.ReactNode;
}

export const AuthButton = ({ children, className, variant = "app-primary", size = "app", ...props }: AuthButtonProps) => {
  return (
    <AppButton
      variant={variant}
      size={size}
      className={cn("w-full", className)}
      {...props}
    >
      {children}
    </AppButton>
  );
};
