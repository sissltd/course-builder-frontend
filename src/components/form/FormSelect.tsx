import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { AppSelect } from "./AppSelect";

interface FormSelectProps extends React.ComponentProps<typeof AppSelect> {
  name: string;
}

export const FormSelect = ({ name, ...props }: FormSelectProps) => {
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
        <AppSelect
          {...props}
          value={field.value}
          onValueChange={field.onChange}
          error={error || props.error}
        />
      )}
    />
  );
};
