import React from "react";
import { Button } from "@/components/shared/Button";
import { cn } from "@/lib/utils";

interface AuthButtonProps extends React.ComponentProps<typeof Button> {
  children: React.ReactNode;
}

export const AuthButton = ({ children, className, variant = "app-primary", size = "app", ...props }: AuthButtonProps) => {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn("w-full", className)}
      {...props}
    >
      {children}
    </Button>
  );
};
