import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { OptionSelect } from "@/modules/auth/components/OptionSelect";

interface FormOptionSelectProps {
  name: string;
  label: string;
}

export const FormOptionSelect = ({ name, label }: FormOptionSelectProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <OptionSelect
          label={label}
          selected={field.value === label}
          onSelect={() => field.onChange(label)}
        />
      )}
    />
  );
};
