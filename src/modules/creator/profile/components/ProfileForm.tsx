"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/shared/Button";
import { FormSelect } from "@/components/form/FormSelect";
import { FormPhoneInput } from "@/components/form/FormPhoneInput";
import { Country as CountryInfo, State } from "country-state-city";
import {
  Country as PhoneCountry,
  Value as PhoneValue,
  isSupportedCountry,
} from "react-phone-number-input";

interface ProfileFormRowProps {
  label: string;
  children: React.ReactNode;
}

const ProfileFormRow = ({ label, children }: ProfileFormRowProps) => (
  <div className="flex items-start gap-[40px] py-[24px] border-b border-[#F0F0F0] last:border-b-0">
    <div className="w-[160px] shrink-0">
      <p className="text-[14px] text-[#606060] tracking-[-0.28px] leading-[20px] font-medium pt-[10px]">{label}</p>
    </div>
    <div className="flex-1 flex flex-col gap-[16px]">{children}</div>
  </div>
);

interface ProfileFormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const ProfileFormInput = ({ label, ...props }: ProfileFormInputProps) => (
  <div className="flex flex-col gap-[6px]">
    {label && (
      <label className="text-[13px] text-[#606060] tracking-[-0.26px] font-medium">{label}</label>
    )}
    <input
      {...props}
      className="w-full h-[44px] px-[16px] border border-[#D9D9D9] rounded-[8px] text-[14px] text-[#202020] placeholder:text-[#B6B6B6] bg-white outline-none focus:border-[#0063EF] transition-colors"
    />
  </div>
);

const countryOptions = CountryInfo.getAllCountries().map((c) => ({
  label: c.name,
  value: c.isoCode,
  searchValue: `${c.name} ${c.isoCode}`,
}));

export const ProfileForm = () => {
  const [country, setCountry] = useState("NG");
  const [state, setState] = useState("");
  const [phoneValue, setPhoneValue] = useState<PhoneValue | undefined>("+2349012345678");
  const [phoneDefaultCountry, setPhoneDefaultCountry] = useState<PhoneCountry>("NG");

  const stateOptions = useMemo(
    () =>
      State.getStatesOfCountry(country).map((s) => ({
        label: s.name,
        value: s.isoCode,
        searchValue: s.name,
      })),
    [country]
  );

  const handleCountryChange = (val: string) => {
    setCountry(val);
    setState("");
    if (!phoneValue && isSupportedCountry(val)) {
      setPhoneDefaultCountry(val as PhoneCountry);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Full Name */}
      <ProfileFormRow label="Full name">
        <ProfileFormInput label="Firstname" placeholder="Enter name" />
        <ProfileFormInput label="Last name" placeholder="Enter name" />
      </ProfileFormRow>

      {/* Email */}
      <ProfileFormRow label="Email">
        <ProfileFormInput
          label="Email address"
          type="email"
          placeholder="emmanuelosaite@gmail.com"
          defaultValue="emmanuelosaite@gmail.com"
          readOnly
          className="w-full h-[44px] px-[16px] border border-[#D9D9D9] rounded-[8px] text-[14px] text-[#B6B6B6] bg-[#F9F9F9] outline-none cursor-not-allowed"
        />
      </ProfileFormRow>

      {/* Contact details */}
      <ProfileFormRow label="Contact details">
        <FormPhoneInput
          key={phoneDefaultCountry}
          name="phone"
          label="Phone Number"
          placeholder="9012345678"
          defaultCountry={phoneDefaultCountry}
          value={phoneValue}
          onChange={(val) => setPhoneValue(val)}
          onCountryChange={(val) => val && setCountry(val)}
        />
      </ProfileFormRow>

      {/* Address */}
      <ProfileFormRow label="Address">
        <FormSelect
          name="country"
          label="Country"
          placeholder="Select country"
          required
          searchable
          searchPlaceholder="Search country"
          value={country}
          onValueChange={handleCountryChange}
          options={countryOptions}
          triggerClassName="h-[44px]"
        />
        <FormSelect
          name="state"
          label="State"
          placeholder={stateOptions.length ? "Select state" : "No states available"}
          disabled={stateOptions.length === 0}
          searchable
          searchPlaceholder="Search state"
          value={state}
          onValueChange={(val) => setState(val)}
          options={stateOptions}
          triggerClassName="h-[44px]"
        />
        <ProfileFormInput label="Address" placeholder="Enter address" />
      </ProfileFormRow>

      {/* Area of Expertise */}
      <ProfileFormRow label="Area of Expertise">
        <FormSelect
          name="expertiseCategory"
          label="Category"
          placeholder="Select area of expertise"
          options={[
            { label: "Information technology", value: "it" },
            { label: "Artificial intelligence", value: "ai" },
            { label: "Cloud computing", value: "cloud" },
            { label: "Cybersecurity", value: "cyber" },
          ]}
          onValueChange={(val) => console.log("Expertise:", val)}
          triggerClassName="h-[44px]"
        />
      </ProfileFormRow>

      {/* Save Button */}
      <div className="flex items-start gap-[40px] pt-[24px]">
        <div className="w-[160px] shrink-0" />
        <div className="flex-1">
          <Button
            variant="app-primary"
            className="h-[44px] px-[32px] text-[14px]"
          >
            Save changes
          </Button>
        </div>
      </div>
    </div>
  );
};
