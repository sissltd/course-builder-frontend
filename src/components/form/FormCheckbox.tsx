import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { AppCheckbox } from "@/components/shared/AppCheckbox";

interface FormCheckboxProps extends React.ComponentProps<typeof AppCheckbox> {
  name: string;
}

export const FormCheckbox = ({ name, label, className, ...props }: FormCheckboxProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message as string;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <AppCheckbox
          {...props}
          id={name}
          checked={field.value}
          onCheckedChange={field.onChange}
          className={className}
          label={label}
          error={error || props.error}
        />
      )}
    />
  );
};
