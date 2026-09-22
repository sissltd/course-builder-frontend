"use client";

import React from "react";
import { toast } from "sonner";
import { FormInput } from "@/components/form/FormInput";
import { FormSelect } from "@/components/form/FormSelect";
import { FormPhoneInput } from "@/components/form/FormPhoneInput";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash, ArrowDown2 } from "iconsax-react";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { Country as CountryInfo, State } from "country-state-city";
import {
  Country as PhoneCountry,
  isSupportedCountry,
} from "react-phone-number-input";
import { normalizeApiError } from "@/lib/api/errors";
import { useUploadFile } from "@/modules/shared/uploads/hooks/useUploadFile";
import {
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
} from "@/modules/auth/api/profileApi";
import type {
  AssignedTrack,
  UpdateProfileRequest,
  UserProfile,
} from "@/modules/auth/types/auth";

const ASSIGNED_TRACK_LABELS: Record<Exclude<AssignedTrack, null>, string> = {
  CREATOR_TRACK: "Creator track",
  AI_TRACK: "AI track",
  ALL: "All tracks",
};

/**
 * The editable fields. `email` is deliberately absent: the API does not accept it
 * on this PATCH, and `FormInput` binds to react-hook-form *unconditionally* when
 * a provider is present — a `value` prop would be silently ignored — so leaving
 * it unregistered is the only way to render it read-only.
 */
interface AccountFormValues {
  first_name: string;
  last_name: string;
  timezone: string;
  phone_number: string;
  country: string;
  state: string;
  address: string;
}

const toFormValues = (profile: UserProfile): AccountFormValues => ({
  first_name: profile.first_name ?? "",
  last_name: profile.last_name ?? "",
  timezone: profile.timezone ?? "",
  phone_number: profile.phone_number ?? "",
  country: profile.country || "NG",
  state: profile.state ?? "",
  address: profile.address ?? "",
});

const initialsOf = (first?: string, last?: string) =>
  `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase() || "?";

const memberSince = (value?: string) => {
  if (!value) return "—";
  const date = new Date(value);
  if (isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const countryOptions = CountryInfo.getAllCountries().map((country) => ({
  label: country.name,
  value: country.isoCode,
  searchValue: `${country.name} ${country.isoCode}`,
}));

/**
 * Compares a form value against the server's, treating `undefined` and `null` as
 * the empty string — so emptying a field counts as a change and is sent, which is
 * how a reviewer clears their address.
 */
const differs = (next: string, current: string | null | undefined) =>
  next !== (current ?? "");

const ReadOnlyField = ({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) => (
  <div className="flex w-full flex-col gap-[6px]">
    <Label className="text-body-sm font-normal tracking-[-0.28px] text-sd-grey-12">
      {label}
    </Label>
    <Input
      value={value}
      disabled
      readOnly
      className="h-[44px] border-sd-grey-6 bg-sd-grey-1 px-[16px] py-[12px] text-body-sm tracking-[-0.28px] disabled:cursor-not-allowed disabled:opacity-100"
    />
    {hint && <p className="text-caption-xs text-sd-grey-11">{hint}</p>}
  </div>
);

const AccountForm = ({ profile }: { profile: UserProfile }) => {
  const [updateProfile, { isLoading: isSaving }] = useUpdateMyProfileMutation();
  const { upload, isUploading } = useUploadFile();
  const fileRef = React.useRef<HTMLInputElement>(null);

  const methods = useForm<AccountFormValues>({
    defaultValues: toFormValues(profile),
  });
  const { reset, handleSubmit, formState, setValue, control } = methods;

  // `useWatch` rather than `methods.watch`: the latter returns a function, which
  // the React Compiler cannot memoize and warns about.
  const country = useWatch({ control, name: "country" }) ?? "";

  /**
   * Derived, not stored: react-phone-number-input only consults `defaultCountry`
   * when the value carries no country code, so keeping it in step with the
   * address country is all that is needed — and deriving it avoids a second
   * source of truth that an effect would have to synchronise.
   */
  const phoneDefaultCountry: PhoneCountry =
    country && isSupportedCountry(country) ? (country as PhoneCountry) : "NG";

  const stateOptions = React.useMemo(
    () =>
      State.getStatesOfCountry(country).map((state) => ({
        label: state.name,
        value: state.isoCode,
        searchValue: state.name,
      })),
    [country],
  );

  /**
   * Single path for every country change, whichever control drove it. Clearing
   * `state` is the point: a state code only means anything inside its country, so
   * carrying one across a country change submits a code that does not belong.
   */
  const applyCountry = (value: string) => {
    setValue("country", value, { shouldDirty: true });
    setValue("state", "", { shouldDirty: true });
  };

  const onSubmit = handleSubmit(async (values) => {
    // PATCH is partial, so send only what changed. `email` cannot appear here —
    // it is not on `UpdateProfileRequest` and not in the form values.
    const payload: UpdateProfileRequest = {};
    if (differs(values.first_name, profile.first_name))
      payload.first_name = values.first_name;
    if (differs(values.last_name, profile.last_name))
      payload.last_name = values.last_name;
    if (differs(values.timezone, profile.timezone))
      payload.timezone = values.timezone;
    if (differs(values.phone_number, profile.phone_number))
      payload.phone_number = values.phone_number;
    if (differs(values.country, profile.country))
      payload.country = values.country;
    if (differs(values.state, profile.state)) payload.state = values.state;
    if (differs(values.address, profile.address))
      payload.address = values.address;

    if (Object.keys(payload).length === 0) {
      toast.info("Nothing to save");
      return;
    }

    try {
      await updateProfile(payload).unwrap();
      // The refetch that follows a PATCH replaces `profile`, but `defaultValues`
      // are only read once — so clear the dirty flag against what was just saved.
      reset(values);
      toast.success("Account updated");
    } catch (err) {
      const { fieldErrors, message } = normalizeApiError(err as never);
      for (const [field, error] of Object.entries(fieldErrors)) {
        methods.setError(field as keyof AccountFormValues, { message: error });
      }
      toast.error(message ?? "Could not update account");
    }
  });

  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const result = await upload(file);
      await updateProfile({ avatar_url: result.file_url }).unwrap();
      toast.success("Profile photo updated");
    } catch (err) {
      const { message } = normalizeApiError(err as never);
      toast.error(message ?? "Could not upload the photo");
    }

    // Reset so re-picking the same file fires `change` again.
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleAvatarDelete = async () => {
    try {
      await updateProfile({ avatar_url: "" }).unwrap();
      toast.success("Profile photo removed");
    } catch (err) {
      const { message } = normalizeApiError(err as never);
      toast.error(message ?? "Could not remove the photo");
    }
  };

  const displayName =
    profile.full_name ||
    `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim() ||
    "—";

  const assignedTrack = profile.assigned_track;

  return (
    <FormProvider {...methods}>
      <div className="flex w-full flex-col gap-[32px]">
        {/* Profile Header */}
        <div className="flex flex-col gap-[16px]">
          <div className="flex items-center gap-[12px]">
            <div className="relative flex size-[56px] items-center justify-center overflow-hidden rounded-full bg-sd-grey-12 text-[18px] font-normal leading-[28px] tracking-[-0.36px] text-white">
              {profile.avatar_url ? (
                /*
                  A plain <img>, not next/image: uploads are served from a host
                  that is not in `images.remotePatterns`, and next/image throws
                  "hostname not configured" for anything that is not.
                */
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatar_url}
                  alt={displayName}
                  className="absolute inset-0 size-full object-cover"
                />
              ) : (
                initialsOf(profile.first_name, profile.last_name)
              )}
            </div>
            <div className="flex items-center gap-[8px]">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
              <button
                type="button"
                disabled={isUploading}
                onClick={() => fileRef.current?.click()}
                className="flex h-[32px] items-center justify-center rounded-[8px] border border-sd-grey-3 bg-white px-[12px] text-[14px] font-normal text-sd-grey-12 hover:bg-sd-grey-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isUploading ? "Uploading..." : "Upload"}
              </button>
              <button
                type="button"
                onClick={handleAvatarDelete}
                disabled={!profile.avatar_url || isUploading}
                className="flex size-[32px] items-center justify-center rounded-[8px] bg-sd-grey-3 text-sd-grey-11 hover:bg-sd-grey-4 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Delete profile photo"
              >
                <Trash size={16} variant="Linear" />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-[4px]">
            <div className="flex items-center gap-[8px]">
              <h3 className="text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-sd-grey-12">
                {displayName}
              </h3>
              {/*
                Only shown when the account is actually inactive. The design's
                hardcoded "Unavailable" is not the same thing as `is_active` —
                reviewer availability lives on /users/me/availability/ — so this
                needs a design decision rather than a guess. See the note in the
                handover.
              */}
              {profile.is_active === false && (
                <span className="rounded-[8px] bg-sd-warning-bg px-[10px] py-[4px] text-[12px] font-medium leading-[16px] text-sd-warning-text">
                  Unavailable
                </span>
              )}
            </div>
            <span className="text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-sd-grey-11">
              Member since {memberSince(profile.member_since)}
            </span>
          </div>
        </div>

        {/* Both are set by an admin and are not editable here. */}
        <div className="flex flex-col gap-[16px]">
          <div className="flex items-center justify-between rounded-[12px] border border-sd-grey-3 p-[16px]">
            <div className="flex flex-col gap-[2px]">
              <span className="text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-sd-grey-12">
                Role
              </span>
              <span className="text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-sd-grey-11">
                Set by admin
              </span>
            </div>
            <div className="flex items-center justify-center rounded-[8px] border border-sd-grey-4 bg-sd-grey-1 px-[16px] py-[6px] text-[14px] font-normal text-sd-grey-11">
              {profile.role ?? "—"}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-[12px] border border-sd-grey-3 p-[16px]">
            <div className="flex flex-col gap-[2px]">
              <span className="text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-sd-grey-12">
                Assigned Track
              </span>
              <span className="text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-sd-grey-11">
                Set by admin
              </span>
            </div>
            <div className="flex items-center justify-center rounded-[8px] border border-sd-grey-4 bg-sd-grey-1 px-[16px] py-[6px] text-[14px] font-normal text-sd-grey-11">
              {assignedTrack
                ? (ASSIGNED_TRACK_LABELS[assignedTrack] ?? assignedTrack)
                : "Not assigned"}
            </div>
          </div>
        </div>

        {/* Personal Info Form */}
        <form
          onSubmit={onSubmit}
          className="flex flex-col gap-[24px] rounded-[12px] border border-sd-grey-3 p-[24px]"
        >
          <ReadOnlyField
            label="Email address"
            value={profile.email ?? ""}
            hint="Change this from the Login & security tab."
          />

          <FormInput name="first_name" label="First name" />

          <FormInput name="last_name" label="Last name" />

          <FormSelect
            name="country"
            label="Country"
            placeholder="Select country"
            searchable
            searchPlaceholder="Search country"
            onValueChange={applyCountry}
            options={countryOptions}
          />

          <FormSelect
            name="state"
            label="State"
            placeholder={
              stateOptions.length ? "Select state" : "No states available"
            }
            disabled={stateOptions.length === 0}
            searchable
            searchPlaceholder="Search state"
            options={stateOptions}
          />

          <FormInput name="address" label="Address" />

          <FormPhoneInput
            key={phoneDefaultCountry}
            name="phone_number"
            label="Phone number"
            placeholder="8012345678"
            defaultCountry={phoneDefaultCountry}
            onCountryChange={(next) => {
              if (next) applyCountry(next);
            }}
          />

          <FormInput
            name="timezone"
            label="Timezone"
            rightElement={
              <ArrowDown2
                size={18}
                variant="Linear"
                color="var(--sd-grey-11)"
                className="pointer-events-none"
              />
            }
          />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!formState.isDirty || isSaving}
              className="flex h-[44px] items-center justify-center rounded-[8px] bg-[#0056D2] px-[24px] text-[14px] font-medium text-white hover:bg-[#0047B8] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </FormProvider>
  );
};

export const AccountTab = () => {
  const { data: profile, isLoading, error } = useGetMyProfileQuery();

  if (isLoading) {
    return (
      <div className="flex w-full flex-col gap-[32px]">
        <div className="h-[56px] w-[240px] animate-pulse rounded bg-sd-grey-3" />
        <div className="h-[120px] w-full animate-pulse rounded-[12px] bg-sd-grey-2" />
        <div className="h-[280px] w-full animate-pulse rounded-[12px] bg-sd-grey-2" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <p className="text-[14px] text-[#FF5025]">
        Failed to load your account details.
      </p>
    );
  }

  // Mounted only once the profile exists, so the form can seed its defaults from
  // it directly instead of hydrating through an effect that a refetch would rerun.
  return <AccountForm profile={profile} />;
};
