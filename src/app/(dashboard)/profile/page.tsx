import React from "react";
import { ProfileView } from "@/modules/profile/ProfileView";

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-[24px]">
      <h1 className="text-[24px] font-semibold text-[#202020] tracking-[-0.48px] leading-[32px]">Profile</h1>
      <ProfileView />
    </div>
  );
}
