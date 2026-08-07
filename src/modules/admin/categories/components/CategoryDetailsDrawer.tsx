"use client";

import React from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { SheetClose } from "@/components/ui/sheet";
import { SideDrawer } from "@/components/shared/SideDrawer";
import { Button as AppButton } from "@/components/shared/Button";
import { FormInput } from "@/components/form/FormInput";
import { FormSelect } from "@/components/form/FormSelect";
import { SquareTerminal } from "lucide-react";

export type CategoryTrackValue = "creator-preferred" | "ai-preferred" | "open" | "archive";

export interface CategoryDetails {
  id: string;
  category: string;
  track: CategoryTrackValue;
  beginnerPrice: string;
  intermediatePrice: string;
  advancedPrice: string;
}

interface CategoryDetailsDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  category: CategoryDetails | null;
  onEdit?: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  canPrevious?: boolean;
  canNext?: boolean;
}

const trackOptions = [
  { label: "Creator Preferred", value: "creator-preferred" },
  { label: "AI Preferred", value: "ai-preferred" },
  { label: "Open", value: "open" },
  { label: "Archive", value: "archive" },
] as const;

const toDrawerPrice = (value: string) => `${value.replace(/^(Beg|Int|Adv)\s/, "")}.00`;

const toTablePrice = (prefix: "Beg" | "Int" | "Adv", value: string) => {
  const normalizedValue = value.endsWith(".00") ? value.slice(0, -3) : value;
  return `${prefix} ${normalizedValue}`;
};

export const CategoryDetailsDrawer = ({
  isOpen,
  onOpenChange,
  category,
  onEdit,
  onPrevious,
  onNext,
  canPrevious = false,
  canNext = false,
}: CategoryDetailsDrawerProps) => {
  const [draft, setDraft] = React.useState<CategoryDetails | null>(category);

  if (!draft) return null;

  return (
    <SideDrawer
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      showCloseButton={false}
      className="!w-full md:!w-[34%] md:!max-w-[34%]"
      title={
        <div className="flex items-center justify-between gap-[16px]">
          <span className="text-[22px] font-semibold text-sd-grey-12 leading-[32px] tracking-[-0.44px]">
            {draft.category}
          </span>
          <div className="flex items-center gap-[10px]">
            <AppButton
              type="button"
              variant="outline"
              size="icon-sm"
              onClick={onPrevious}
              disabled={!canPrevious}
              className="size-[32px] rounded-[10px] border-sd-grey-3 bg-white text-sd-grey-9 hover:bg-sd-grey-2"
              aria-label="Previous category"
            >
              <ChevronLeft size={18} />
            </AppButton>
            <AppButton
              type="button"
              variant="outline"
              size="icon-sm"
              onClick={onNext}
              disabled={!canNext}
              className="size-[32px] rounded-[10px] border-sd-grey-3 bg-white text-sd-grey-9 hover:bg-sd-grey-2"
              aria-label="Next category"
            >
              <ChevronRight size={18} />
            </AppButton>
            <SheetClose asChild>
              <AppButton
                type="button"
                variant="outline"
                size="icon-sm"
                className="size-[32px] rounded-[10px] border-sd-grey-3 bg-white text-sd-grey-9 hover:bg-sd-grey-2"
                aria-label="Close category drawer"
              >
                <X size={18} />
              </AppButton>
            </SheetClose>
          </div>
        </div>
      }
      footer={
        <AppButton
          variant="app-primary"
          size="app"
          className="h-[44px] w-full rounded-[10px] text-[14px] font-normal tracking-[-0.28px]"
          onClick={onEdit}
        >
          Edit category
        </AppButton>
      }
    >
      <div className="flex flex-col gap-[20px]">
        <FormInput
          name="categoryName"
          label="Category name"
          value={draft.category}
          onChange={(event) => setDraft((current) => (current ? { ...current, category: event.target.value } : current))}
          className="h-[42px] bg-white"
        />

        <FormSelect
          name="trackPreference"
          label="Track preference"
          value={draft.track}
          onValueChange={(value) =>
            setDraft((current) =>
              current ? { ...current, track: value as CategoryTrackValue } : current
            )
          }
          options={trackOptions.map((option) => ({
            label: option.label,
            value: option.value,
          }))}
          placeholder="Select track"
          triggerClassName="h-[44px] bg-white text-sd-grey-12"
        />

        <div className="flex flex-col gap-[12px]">
          <span className="text-[14px] font-normal text-sd-grey-12 tracking-[-0.28px] leading-[20px]">
            Payout price level
          </span>
          <div className="grid grid-cols-3 gap-[16px]">
            <FormInput
              name="beginnerPrice"
              label="Beginner"
              value={toDrawerPrice(draft.beginnerPrice)}
              onChange={(event) =>
                setDraft((current) =>
                  current
                    ? { ...current, beginnerPrice: toTablePrice("Beg", event.target.value) }
                    : current
                )
              }
              className="h-[42px] bg-white"
            />
            <FormInput
              name="intermediatePrice"
              label="Intermediate"
              value={toDrawerPrice(draft.intermediatePrice)}
              onChange={(event) =>
                setDraft((current) =>
                  current
                    ? { ...current, intermediatePrice: toTablePrice("Int", event.target.value) }
                    : current
                )
              }
              className="h-[42px] bg-white"
            />
            <FormInput
              name="advancedPrice"
              label="Advanced"
              value={toDrawerPrice(draft.advancedPrice)}
              onChange={(event) =>
                setDraft((current) =>
                  current
                    ? { ...current, advancedPrice: toTablePrice("Adv", event.target.value) }
                    : current
                )
              }
              className="h-[42px] bg-white"
            />
          </div>
        </div>

        <div className="flex flex-col gap-[12px]">
          <span className="text-[14px] font-normal text-sd-grey-12 tracking-[-0.28px] leading-[20px]">
            Select category icon
          </span>
          <AppButton
            type="button"
            variant="outline"
            size="icon"
            className="size-[48px] rounded-[12px] border-sd-grey-6 bg-white text-sd-grey-10 hover:bg-sd-grey-2"
            aria-label={`${draft.category} icon`}
          >
            <SquareTerminal size={18} strokeWidth={1.7} />
          </AppButton>
        </div>
      </div>
    </SideDrawer>
  );
};
