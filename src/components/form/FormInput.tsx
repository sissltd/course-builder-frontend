import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { AppInput } from "./AppInput";

interface FormInputProps extends React.ComponentProps<typeof AppInput> {
  name: string;
}

export const FormInput = ({ name, ...props }: FormInputProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message as string;

  return (
    <AppInput
      {...props}
      {...register(name)}
      error={error || props.error}
      onBlur={(e) => {
        register(name).onBlur(e);
        props.onBlur?.(e);
      }}
      onChange={(e) => {
        register(name).onChange(e);
        props.onChange?.(e);
      }}
    />
  );
};
