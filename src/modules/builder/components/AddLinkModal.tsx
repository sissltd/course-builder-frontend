"use client";

import React, { useState } from "react";
import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/shared/Button";
import { FormInput } from "@/components/form/FormInput";
import { cn } from "@/lib/utils";
import {
  VideoPlay,
  DocumentText,
  DocumentCode2,
  Link as LinkIcon,
  Image as ImageIcon,
  TickCircle,
} from "iconsax-react";

interface AddLinkModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

type LinkType = "video" | "image" | "quiz" | "text" | "embed";

const LINK_OPTIONS: { type: LinkType; label: string; icon: React.ReactNode }[] = [
  { type: "video", label: "Video link", icon: <VideoPlay size={24} variant="Linear" color="#0A60E1" /> },
  { type: "image", label: "Image link", icon: <ImageIcon size={24} variant="Linear" color="#0A60E1" /> },
  { type: "quiz", label: "Quiz link", icon: <DocumentCode2 size={24} variant="Linear" color="#0A60E1" /> },
  { type: "text", label: "Text link", icon: <DocumentText size={24} variant="Linear" color="#0A60E1" /> },
  { type: "embed", label: "Embed link", icon: <LinkIcon size={24} variant="Linear" color="#0A60E1" /> },
];

export const AddLinkModal = ({ isOpen, onOpenChange }: AddLinkModalProps) => {
  const [selectedType, setSelectedType] = useState<LinkType | null>(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const handleTypeSelect = (type: LinkType) => {
    setSelectedType(type);
    setConfirmed(false);
  };

  const handleConfirm = () => {
    if (selectedType && linkUrl.trim()) {
      setConfirmed(true);
    }
  };

  const handleClose = () => {
    setSelectedType(null);
    setLinkUrl("");
    setConfirmed(false);
    onOpenChange(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={handleClose}
      title={confirmed ? "Link Added" : "Add a link"}
      description={
        confirmed
          ? "Your link has been successfully added"
          : "Select the type of link you want to add"
      }
      className="sm:max-w-[480px]"
    >
      {confirmed ? (
        <div className="flex flex-col items-center text-center gap-[24px] py-[20px]">
          <div className="size-[80px] rounded-full bg-[#F1F8F2] flex items-center justify-center">
            <TickCircle size={40} variant="Bulk" color="#3C7E44" />
          </div>
          <p className="text-[16px] text-[#606060] leading-[24px]">
            Your {LINK_OPTIONS.find((o) => o.type === selectedType)?.label?.toLowerCase() || "link"} has been
            added successfully and is ready to use.
          </p>
          <Button variant="app-primary" className="w-full h-[44px]" onClick={handleClose}>
            Done
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-[24px] mt-[8px]">
          {/* Link type selection */}
          <div className="grid grid-cols-5 gap-[10px]">
            {LINK_OPTIONS.map((opt) => (
              <button
                key={opt.type}
                type="button"
                onClick={() => handleTypeSelect(opt.type)}
                className={cn(
                  "flex flex-col items-center gap-[8px] p-[12px] border rounded-[8px] transition-all cursor-pointer bg-white",
                  selectedType === opt.type
                    ? "border-[#0A60E1] bg-[#F5F9FF]"
                    : "border-[#E8E8E8] hover:border-[#D9D9D9]"
                )}
              >
                {opt.icon}
                <span className="text-[12px] text-[#606060] text-center leading-[16px]">
                  {opt.label}
                </span>
              </button>
            ))}
          </div>

          {/* Link input */}
          {selectedType && (
            <div className="flex flex-col gap-[8px]">
              <FormInput
                name="linkUrl"
                label={`${LINK_OPTIONS.find((o) => o.type === selectedType)?.label} URL`}
                placeholder={`Paste your ${selectedType} link here...`}
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-[12px] w-full pt-[8px]">
            <Button
              variant="app-outline"
              className="flex-1 h-[44px]"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              variant="app-primary"
              className="flex-1 h-[44px]"
              disabled={!selectedType || !linkUrl.trim()}
              onClick={handleConfirm}
            >
              Add link
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
