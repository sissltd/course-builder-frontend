import React from "react";
import { useFormContext, useController } from "react-hook-form";
import { Checkbox } from "@/components/shared/Checkbox";

interface FormCheckboxProps extends React.ComponentProps<typeof Checkbox> {
  name: string;
}

export const FormCheckbox = ({ name, label, className, ...props }: FormCheckboxProps) => {
  const { control, formState: { errors } } = useFormContext();
  const { field } = useController({ name, control });
  const error = errors[name]?.message as string | undefined;

  return (
    <Checkbox
      id={name}
      label={label}
      className={className}
      error={error}
      {...props}
      checked={field.value ?? false}
      onCheckedChange={(checked: boolean) => {
        field.onChange(checked);
        props.onCheckedChange?.(checked);
      }}
    />
  );
};
