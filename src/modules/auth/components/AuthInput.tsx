import React from "react";
import { FormInput } from "@/components/form/FormInput";

interface AuthInputProps extends React.ComponentProps<typeof FormInput> {
  label: string;
}

export const AuthInput = ({ label, ...props }: AuthInputProps) => {
  return (
    <FormInput
      label={label}
      {...props}
    />
  );
};
