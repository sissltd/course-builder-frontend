import React from "react";
import { Button as ShadcnButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ComponentProps<typeof ShadcnButton> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
  isSelected?: boolean;
  isGhost?: boolean;
}

export const Button = ({
  children,
  className,
  leftIcon,
  rightIcon,
  isLoading,
  isSelected,
  isGhost,
  disabled,
  variant = "app-primary",
  size = "app",
  ...props
}: ButtonProps) => {
  return (
    <ShadcnButton
      variant={variant}
      size={size}
      isSelected={isSelected}
      isGhost={isGhost}
      className={cn("rounded-[8px] font-sans transition-all active:scale-95", className)}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && (
        <svg
          className="mr-2 h-4 w-4 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </ShadcnButton>
  );
};
