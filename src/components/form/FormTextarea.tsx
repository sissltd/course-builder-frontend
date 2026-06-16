import React from "react";
import { useFormContext } from "react-hook-form";
import { AppTextarea } from "./AppTextarea";

interface FormTextareaProps extends React.ComponentProps<typeof AppTextarea> {
  name: string;
}

export const FormTextarea = ({ name, ...props }: FormTextareaProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message as string;

  return (
    <AppTextarea
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
