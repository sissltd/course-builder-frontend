"use client";

import React, { useRef, useState } from "react";
import { Trash, Logout, InfoCircle } from "iconsax-react";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/shared/Button";
import { FormInput } from "@/components/form/FormInput";
import { useRouter } from "next/navigation";

export const AccountSettingsTab = () => {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <div className="flex flex-col gap-[28px]">
      {/* Avatar row */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-[16px]">
          {/* Avatar */}
          <div className="size-[56px] rounded-full bg-[#202020] flex items-center justify-center shrink-0">
            <span className="text-[18px] font-semibold text-white">OE</span>
          </div>
          {/* Upload / delete */}
          <div className="flex items-center gap-[12px]">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => fileRef.current?.click()}
              className="h-[24px] px-[8px] border border-[#F0F0F0] rounded-[4px] text-[12px] text-[#606060] font-medium hover:bg-sd-grey-1 transition-colors"
            >
              Upload
            </button>
            <button className="text-[#B6B6B6] hover:text-[#FF5025] transition-colors">
              <Trash size={18} variant="Linear" color="currentColor" />
            </button>
          </div>
        </div>

        {/* Status Chip / Verify button */}
        {isVerified ? (
          <div className="bg-[#f1f8f2] flex items-center justify-center px-[12px] py-[8px] rounded-[6px]">
            <p className="text-[#3c7e44] text-[14px] font-medium tracking-[-0.28px] whitespace-nowrap">
              Account verified
            </p>
          </div>
        ) : (
          <button 
            onClick={() => router.push("/kyc?step=2")}
            className="bg-white border border-[#D9D9D9] flex items-center justify-center px-[12px] py-[8px] rounded-[6px] hover:bg-sd-grey-1 transition-colors"
          >
            <p className="text-[#202020] text-[14px] font-medium tracking-[-0.28px] whitespace-nowrap">
              Verify account
            </p>
          </button>
        )}
      </div>

      {/* Name + since */}
      <div className="flex flex-col gap-[4px]">
        <p className="text-[20px] font-semibold text-[#202020] tracking-[-0.4px] leading-[28px]">Osaite Emmanuel</p>
        <p className="text-[14px] text-[#636363] leading-[20px]">Member since 25 April, 2026</p>
      </div>

      <div className="h-px bg-[#F0F0F0]" />

      {/* Log out row */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-[4px]">
          <p className="text-[16px] font-semibold text-[#202020] tracking-[-0.32px] leading-[24px]">Log out</p>
          <p className="text-[14px] text-[#636363] leading-[20px]">Temporary log out of your account.</p>
        </div>
        <Button 
          variant="app-outline" 
          className="text-[#F05A25] border-[#F05A25] font-medium h-[44px] px-[24px] hover:bg-[#FFF0ED]"
          onClick={() => setIsLogoutOpen(true)}
        >
          Log out
        </Button>
      </div>

      <div className="h-px bg-[#F0F0F0]" />

      {/* Dangerous area */}
      <div className="flex flex-col gap-[16px]">
        <p className="text-[14px] font-semibold text-[#F05A25] tracking-[-0.28px]">Dangerous area</p>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-[4px]">
            <p className="text-[16px] font-semibold text-[#202020] tracking-[-0.32px] leading-[24px]">Delete account</p>
            <p className="text-[14px] text-[#636363] leading-[20px]">This process is not reversable and cannot be undone</p>
          </div>
          <Button 
            variant="app-outline" 
            className="text-[#F05A25] border-[#F05A25] font-medium h-[44px] px-[24px] hover:bg-[#FFF0ED]"
            onClick={() => setIsDeleteOpen(true)}
          >
            Delete account
          </Button>
        </div>
      </div>



      {/* Logout Modal */}
      <Modal
        isOpen={isLogoutOpen}
        onOpenChange={setIsLogoutOpen}
      >
        <div className="flex flex-col items-center text-center gap-[24px] py-[20px]">
          <div className="size-[80px] rounded-full bg-[#EBF3FF] flex items-center justify-center text-[#0063EF]">
            <Logout size={40} variant="Bulk" color="currentColor" />
          </div>
          <div className="flex flex-col gap-[8px]">
            <p className="text-[20px] font-semibold text-[#202020]">Log out?</p>
            <p className="text-[14px] text-[#606060] leading-[20px]">
              You will be required to provide your log in credentials when you want to access your account next time
            </p>
          </div>
          <div className="flex gap-[12px] w-full">
            <Button variant="app-outline" className="flex-1 h-[44px]" onClick={() => setIsLogoutOpen(false)}>
              Cancel
            </Button>
            <Button variant="app-primary" className="flex-1 h-[44px]">
              Log out
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Account Modal */}
      <Modal
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
      >
        <div className="flex flex-col items-center text-center gap-[24px] py-[20px]">
          <div className="size-[80px] rounded-full bg-[#FFF0ED] flex items-center justify-center text-[#F05A25]">
            <Trash size={40} variant="Bulk" color="currentColor" />
          </div>
          <div className="flex flex-col gap-[8px]">
            <p className="text-[20px] font-semibold text-[#202020]">Delete your account?</p>
            <p className="text-[14px] text-[#606060] leading-[20px]">
              Are you sure you want to delete your account? Once this process is initiated you won’t be able to undo it.
            </p>
          </div>
          <FormInput name="deletePassword" label="Password" placeholder="Enter your password" type="password" className="w-full" />
          <div className="flex gap-[12px] w-full">
            <Button variant="app-outline" className="flex-1 h-[44px]" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="app-primary" className="flex-1 h-[44px] bg-[#F05A25] border-[#F05A25] hover:bg-[#D4481D]">
              Delete account
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
