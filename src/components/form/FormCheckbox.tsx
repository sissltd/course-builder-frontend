import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";

interface FormCheckboxProps extends React.ComponentProps<typeof Checkbox> {
  name: string;
  label?: string;
}

export const FormCheckbox = ({ name, label, className, ...props }: FormCheckboxProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message as string;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-start gap-[12px]">
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Checkbox
              {...props}
              id={name}
              checked={field.value}
              onCheckedChange={field.onChange}
              className={className}
            />
          )}
        />
        {label && (
          <label
            htmlFor={name}
            className="text-body-sm leading-[20px] text-sd-grey-11 font-medium cursor-pointer"
          >
            {label}
          </label>
        )}
      </div>
      {error && <p className="text-caption-xs text-[#FF5025] ml-[36px]">{error}</p>}
    </div>
  );
};
