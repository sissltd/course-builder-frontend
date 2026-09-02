"use client";

import React from "react";
import { useGetMyProfileQuery } from "./api/profileApi";
import { ProfileHeader } from "./components/ProfileHeader";
import { ProfileForm } from "./components/ProfileForm";

export const ProfileView = () => {
  const { data: profile, isLoading, error } = useGetMyProfileQuery();

  if (isLoading) {
    return (
      <div className="w-full bg-[#FDFDFD] border border-[#F0F0F0] rounded-[20px] px-[32px] py-[28px]">
        <div className="max-w-[1024px] mx-auto w-full flex items-center justify-center py-[60px]">
          <p className="text-[14px] text-[#636363]">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="w-full bg-[#FDFDFD] border border-[#F0F0F0] rounded-[20px] px-[32px] py-[28px]">
        <div className="max-w-[1024px] mx-auto w-full flex items-center justify-center py-[60px]">
          <p className="text-[14px] text-[#FF5025]">Failed to load profile.</p>
        </div>
      </div>
    );
  }

  const memberDate = new Date(profile.member_since);
  const memberSince = memberDate.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="w-full bg-[#FDFDFD] border border-[#F0F0F0] rounded-[20px] px-[32px] py-[28px]">
      <div className="max-w-[1024px] mx-auto w-full">
        <ProfileHeader
          name={profile.full_name}
          avatarUrl={profile.avatar_url}
          memberSince={memberSince}
          isVerified={profile.is_verified}
          badges={profile.badges}
        />
        <ProfileForm profile={profile} />
      </div>
    </div>
  );
};
