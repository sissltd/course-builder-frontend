import React from "react";
import { ProfileHeader } from "./components/ProfileHeader";
import { ProfileForm } from "./components/ProfileForm";

export const ProfileView = () => {
  return (
    <div className="w-full bg-[#FDFDFD] border border-[#F0F0F0] rounded-[20px] px-[32px] py-[28px]">
      <ProfileHeader
        name="Osaite Emmanuel"
        memberSince="25 April, 2026"
        isVerified
      />
      <ProfileForm />
    </div>
  );
};
