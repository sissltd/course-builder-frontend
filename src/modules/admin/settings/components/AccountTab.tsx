"use client";

import React from "react";
import { ChevronDown, Trash2 } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button as AppButton } from "@/components/shared/Button";
import { FormInput } from "@/components/form/FormInput";
import { FormSelect } from "@/components/form/FormSelect";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { normalizeApiError } from "@/lib/api/errors";
import { getTimezoneOptions } from "@/lib/timezones";
import {
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
} from "@/modules/auth/api/profileApi";
import type {
  UpdateProfileRequest,
  UserProfile,
} from "@/modules/auth/types/auth";
import { useUploadFile } from "@/modules/shared/uploads/hooks/useUploadFile";

interface AccountFormValues {
  first_name: string;
  last_name: string;
  timezone: string;
}

const initialsOf = (profile: UserProfile) =>
  `${profile.first_name?.[0] ?? ""}${profile.last_name?.[0] ?? ""}`.toUpperCase() ||
  "?";

const formatMemberSince = (value?: string) => {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const AccountForm = ({ profile }: { profile: UserProfile }) => {
  const [updateProfile, { isLoading: isSaving }] = useUpdateMyProfileMutation();
  const { upload, isUploading } = useUploadFile();
  const fileRef = React.useRef<HTMLInputElement>(null);
  const methods = useForm<AccountFormValues>({
    defaultValues: {
      first_name: profile.first_name ?? "",
      last_name: profile.last_name ?? "",
      timezone: profile.timezone ?? "",
    },
  });
  const { handleSubmit, reset, formState } = methods;

  const displayName =
    profile.full_name ||
    `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim() ||
    profile.email;

  const timezoneOptions = React.useMemo(
    () => getTimezoneOptions(profile.timezone),
    [profile.timezone],
  );

  const onSubmit = handleSubmit(async (values) => {
    const payload: UpdateProfileRequest = {};

    if (values.first_name !== (profile.first_name ?? "")) {
      payload.first_name = values.first_name;
    }
    if (values.last_name !== (profile.last_name ?? "")) {
      payload.last_name = values.last_name;
    }
    if (values.timezone !== (profile.timezone ?? "")) {
      payload.timezone = values.timezone;
    }

    if (Object.keys(payload).length === 0) {
      toast.info("Nothing to save");
      return;
    }

    try {
      await updateProfile(payload).unwrap();
      reset(values);
      toast.success("Account updated");
    } catch (error) {
      const { fieldErrors, message } = normalizeApiError(error as never);
      for (const [field, fieldMessage] of Object.entries(fieldErrors)) {
        methods.setError(field as keyof AccountFormValues, {
          message: fieldMessage,
        });
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
    } catch (error) {
      const { message } = normalizeApiError(error as never);
      toast.error(message ?? "Could not upload the photo");
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleAvatarDelete = async () => {
    try {
      await updateProfile({ avatar_url: "" }).unwrap();
      toast.success("Profile photo removed");
    } catch (error) {
      const { message } = normalizeApiError(error as never);
      toast.error(message ?? "Could not remove the photo");
    }
  };

  return (
    <div className="flex w-full flex-col gap-[38px]">
      <div className="flex flex-col gap-[18px]">
        <div className="flex items-center gap-[10px]">
          <Avatar className="size-[56px] bg-sd-grey-12">
            {profile.avatar_url && (
              <AvatarImage src={profile.avatar_url} alt={displayName} />
            )}
            <AvatarFallback className="bg-sd-grey-12">
              <span className="text-[18px] font-normal leading-[28px] tracking-[-0.36px] text-sd-grey-1">
                {initialsOf(profile)}
              </span>
            </AvatarFallback>
          </Avatar>

          <div className="flex items-center gap-[10px]">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
            />
            <AppButton
              type="button"
              variant="outline"
              size="sm"
              disabled={isUploading}
              onClick={() => fileRef.current?.click()}
              className="h-[32px] rounded-[8px] border-sd-grey-3 bg-white px-[12px] text-[12px] font-normal text-sd-grey-12 hover:bg-sd-grey-2"
            >
              {isUploading ? "Uploading..." : "Upload"}
            </AppButton>

            <AppButton
              type="button"
              variant="ghost"
              size="icon-sm"
              disabled={!profile.avatar_url || isUploading}
              onClick={() => void handleAvatarDelete()}
              className="size-[32px] rounded-[8px] bg-sd-grey-3 text-sd-grey-11 hover:bg-sd-grey-4 disabled:opacity-50"
              aria-label="Delete profile photo"
            >
              <Trash2 size={16} strokeWidth={1.8} />
            </AppButton>
          </div>
        </div>

        <div className="flex flex-col gap-[4px]">
          <div className="flex flex-wrap items-center gap-[8px]">
            <h3 className="text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-sd-grey-12">
              {displayName}
            </h3>
            <span
              className={`rounded-[8px] px-[10px] py-[4px] text-[12px] font-medium leading-[16px] ${
                profile.is_active
                  ? "bg-[#EBF7EE] text-[#008500]"
                  : "bg-sd-warning-bg text-sd-warning-text"
              }`}
            >
              {profile.is_active ? "Active" : "Unavailable"}
            </span>
          </div>
          <p className="text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-sd-grey-11">
            Member since {formatMemberSince(profile.member_since)}
          </p>
        </div>
      </div>

      <div className="rounded-[16px] border border-sd-grey-3 bg-white p-[14px]">
        <div className="flex items-center justify-between gap-[16px]">
          <span className="text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-sd-grey-12">
            Role
          </span>
          <div className="flex min-h-[42px] min-w-[110px] items-center justify-center rounded-[10px] border border-sd-grey-6 bg-white px-[16px] text-center text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-sd-grey-11">
            {profile.role_label || profile.access_role?.name || profile.role}
          </div>
        </div>
      </div>

      <div className="rounded-[16px] border border-sd-grey-3 bg-white px-[14px] py-[16px]">
        <div className="flex flex-col gap-[16px]">
          <FormInput
            name="admin-settings-email"
            label="Email address"
            value={profile.email}
            readOnly
            className="h-[44px] rounded-[10px] border-[1.5px] border-sd-grey-6 bg-sd-grey-1 text-[14px] text-sd-grey-11"
          />

          <FormProvider {...methods}>
            <form onSubmit={onSubmit} className="flex flex-col gap-[16px]">
              <FormInput name="first_name" label="First name" required />
              <FormInput name="last_name" label="Last name" required />
              <FormSelect
                name="timezone"
                label="Timezone"
                placeholder="Select timezone"
                options={timezoneOptions}
                searchable
                searchPlaceholder="Search city, country, or timezone"
                triggerClassName="h-[44px] rounded-[10px] border-[1.5px] border-sd-grey-6 bg-white text-sd-grey-12 hover:bg-white"
                suffix={
                  <ChevronDown
                    size={22}
                    strokeWidth={1.8}
                    className="text-sd-grey-11"
                  />
                }
              />

              <div className="flex justify-end pt-[8px]">
                <AppButton
                  type="submit"
                  variant="app-primary"
                  size="app"
                  disabled={!formState.isDirty || isSaving}
                  className="h-[44px] rounded-[10px] px-[24px] text-[14px] font-normal"
                >
                  {isSaving ? "Saving..." : "Save changes"}
                </AppButton>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};

export const AccountTab = () => {
  const { data: profile, isLoading, error } = useGetMyProfileQuery();

  if (isLoading) {
    return (
      <div className="flex w-full flex-col gap-[32px]">
        <div className="h-[56px] w-[240px] animate-pulse rounded bg-sd-grey-3" />
        <div className="h-[72px] w-full animate-pulse rounded-[16px] bg-sd-grey-2" />
        <div className="h-[280px] w-full animate-pulse rounded-[16px] bg-sd-grey-2" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <p className="text-[14px] text-sd-danger">
        Failed to load your account details.
      </p>
    );
  }

  return <AccountForm profile={profile} />;
};
