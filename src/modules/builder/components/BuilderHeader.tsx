"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  Note,
  Add,
  Global,
  Eye,
} from "iconsax-react";
import { Button } from "@/components/shared/Button";
import { useAppDispatch, useAppSelector } from "@/redux";
import { saveAllDirty } from "@/redux/slices/builderSync";
import { useGetCollaboratorsQuery } from "@/modules/creator/collaborators/api/collaboratorsApi";
import { InviteCollaboratorModal } from "./InviteCollaboratorModal";

interface BuilderHeaderProps {
  moduleName?: string;
  onBackToModules?: () => void;
}

const AVATAR_COLORS = [
  "#0063EF",
  "#F05A25",
  "#27AE60",
  "#8B5CF6",
  "#EC4899",
  "#F59E0B",
];

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
  return `${first}${last}`.toUpperCase() || "?";
}

function getAvatarColor(index: number): string {
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
}

export const BuilderHeader = ({ moduleName, onBackToModules }: BuilderHeaderProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isSaving = useAppSelector((state) => state.courseBuilder.isSaving);
  const lastSavedAt = useAppSelector((state) => state.courseBuilder.lastSavedAt);
  const isDirty = useAppSelector((state) => state.courseBuilder.isDirty);
  const courseId = useAppSelector((state) => state.courseBuilder.courseId);

  const [showInviteModal, setShowInviteModal] = useState(false);

  const { data: collabData } = useGetCollaboratorsQuery(
    { course_id: courseId || "" },
    { skip: !courseId },
  );

  const collaborators = collabData?.data?.results || [];

  const getSaveStatusText = () => {
    if (isSaving) return "Saving...";
    if (!lastSavedAt) return "Not saved yet";
    return "Saved";
  };

  const handleSave = () => {
    dispatch(saveAllDirty());
  };

  return (
    <>
      <div className="h-[70px] w-full bg-white border-b border-[#F0F0F0] px-[24px] py-[12px] flex items-center justify-between z-10 sticky top-0 shrink-0">

        {/* Left Section */}
        <div className="flex items-center gap-[12px]">
          {/* Back Button */}
          <Button
            variant="app-outline"
            isGhost
            onClick={onBackToModules || (() => router.back())}
            className="h-[40px] px-[10px] text-[#202020]"
            leftIcon={<ArrowLeft size={18} variant="Linear" color="#202020" />}
          >
            <span className="text-[14px] font-medium leading-[20px] tracking-[-0.28px]">Back</span>
          </Button>

          <div className="h-[20px] w-px bg-[#F0F0F0]" />

          {/* Note Icon Container */}
          <div className="size-[32px] bg-[#EAF3FF] rounded-[6px] flex items-center justify-center shrink-0 ml-[4px]">
            <Note size={18} variant="Bold" color="#0A60E1" />
          </div>

          {/* Title */}
          <span className="text-[16px] font-semibold text-[#202020] leading-[24px] whitespace-nowrap">
            {moduleName ? (
              <span className="flex items-center gap-[4px]">
                Create a new lesson <span className="text-[#B6B6B6]">/</span> {moduleName}
              </span>
            ) : (
              "Create a new lesson"
            )}
          </span>

          {/* Saved Status Badge */}
          <div className={`h-[24px] px-[8px] rounded-[4px] flex items-center justify-center shrink-0 ml-[4px] ${
            isSaving ? "bg-[#FFF3E0]" : isDirty ? "bg-[#FFF3E0]" : "bg-[#061E2D]"
          }`}>
            <span className={`text-[11px] font-normal leading-[14px] ${
              isSaving ? "text-[#E65100]" : isDirty ? "text-[#E65100]" : "text-[#F2F2F2]"
            }`}>
              {isDirty && !isSaving ? "Unsaved changes" : getSaveStatusText()}
            </span>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-[16px]">
          {/* Collaborators Avatar stack */}
          <div className="flex items-center">
            {collaborators.slice(0, 3).map((collab, i) => (
              <div
                key={collab.id}
                className="size-[32px] rounded-full overflow-hidden mr-[-6px] relative z-10 border-2 border-white"
                style={{ zIndex: 10 - i }}
              >
                <div
                  className="w-full h-full flex items-center justify-center text-white text-[12px] font-semibold"
                  style={{ backgroundColor: getAvatarColor(i) }}
                >
                  {getInitials(collab.name)}
                </div>
              </div>
            ))}
            <div
              className="size-[32px] rounded-full border border-dashed border-[#B6B6B6] bg-white flex items-center justify-center relative z-0 p-[7px] cursor-pointer hover:bg-[#F5F5F5] transition-colors"
              onClick={() => setShowInviteModal(true)}
            >
              <Add size={14} variant="Linear" color="#606060" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-[16px]">
            <Button
              variant="app-outline"
              isGhost
              className="h-[36px] text-[#606060]"
              leftIcon={<Add size={18} variant="Linear" color="#606060" />}
              onClick={() => setShowInviteModal(true)}
            >
              <span className="text-[14px] font-medium tracking-[-0.28px]">Invite collaborators</span>
            </Button>

            <Button
              variant="app-outline"
              isGhost
              className="h-[36px] text-[#606060]"
              leftIcon={<Global size={18} variant="Linear" color="#606060" />}
            >
              <span className="text-[14px] font-medium tracking-[-0.28px]">Publish course</span>
            </Button>

            <div className="h-[20px] w-px bg-[#F0F0F0]" />

            <Button
              variant="app-outline"
              className="h-[36px] px-[12px] rounded-[8px] text-[#0A60E1]"
              leftIcon={<Eye size={18} variant="Linear" color="#0A60E1" />}
            >
              <span className="text-[14px] tracking-[-0.28px]">Preview</span>
            </Button>

            <Button
              variant="app-primary"
              className="h-[36px] px-[16px] rounded-[8px] text-white text-[14px] font-medium"
              onClick={handleSave}
              disabled={isSaving || !isDirty}
            >
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </div>

      {courseId && (
        <InviteCollaboratorModal
          isOpen={showInviteModal}
          onClose={() => setShowInviteModal(false)}
          courseId={courseId}
        />
      )}
    </>
  );
};
