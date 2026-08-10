"use client";

import React from "react";
import Image from "next/image";
import { MoreHorizontal, X } from "lucide-react";
import { Edit2, Setting2, Trash } from "iconsax-react";
import { Button as AppButton } from "@/components/shared/Button";
import { Modal } from "@/components/shared/Modal";
import { FormInput } from "@/components/form/FormInput";

type BadgeItem = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
};

type BadgeStat = {
  id: string;
  title: string;
  creators: string;
  imageUrl: string;
};

const badges: BadgeItem[] = [
  {
    id: "top",
    title: "Top",
    description: "For creators who have crossed creating 100, courses",
    imageUrl: "/assets/badges/badge1.svg",
  },
  {
    id: "professional",
    title: "Professional",
    description: "For creators who have crossed creating 100, courses",
    imageUrl: "/assets/badges/badge2.svg",
  },
  {
    id: "rising",
    title: "Rising",
    description: "For creators who have crossed creating 100, courses",
    imageUrl: "/assets/badges/badge3.svg",
  },
];

const badgeStats: BadgeStat[] = [
  { id: "top-creators", title: "Top Creators", creators: "203 Creators", imageUrl: "/assets/badges/badge1.svg" },
  { id: "professional", title: "Professional", creators: "203 Creators", imageUrl: "/assets/badges/badge2.svg" },
  { id: "rising", title: "Rising", creators: "203 Creators", imageUrl: "/assets/badges/badge3.svg" },
];

const BadgeImage = ({
  src,
  alt,
  size,
  frameClassName,
  bordered = true,
}: {
  src: string;
  alt: string;
  size: number;
  frameClassName?: string;
  bordered?: boolean;
}) => (
  <div
    className={`flex items-center justify-center overflow-hidden rounded-[12px] bg-white ${bordered ? "border border-sd-grey-3" : ""} ${frameClassName ?? ""}`}
  >
    <Image src={src} alt={alt} width={size} height={size} className="object-contain" />
  </div>
);

export const AchievementAwardsTab = () => {
  const [isAddBadgeOpen, setIsAddBadgeOpen] = React.useState(false);
  const [isConfigureBadgeOpen, setIsConfigureBadgeOpen] = React.useState(false);
  const [isDeleteBadgeOpen, setIsDeleteBadgeOpen] = React.useState(false);
  const [badgeTitle, setBadgeTitle] = React.useState("");
  const [courseCount, setCourseCount] = React.useState("23");
  const [autoAward, setAutoAward] = React.useState(false);
  const [openMenuBadgeId, setOpenMenuBadgeId] = React.useState<string | null>(null);
  const [moveToPreviousBadge, setMoveToPreviousBadge] = React.useState(false);

  return (
    <>
      <Modal
        isOpen={isAddBadgeOpen}
        onOpenChange={(open) => setIsAddBadgeOpen(open)}
        showCloseButton={false}
        className="sm:max-w-[600px] rounded-[16px] border border-sd-grey-3 bg-white p-[20px]"
        title={
          <div className="flex items-start justify-between gap-[16px]">
            <span className="text-[20px] font-semibold text-sd-grey-12 leading-[32px] tracking-[-0.4px]">
              Add new badge
            </span>
            <AppButton
              type="button"
              variant="outline"
              size="icon-sm"
              className="size-[32px] rounded-[10px] border-sd-grey-3 bg-white text-sd-grey-9 hover:bg-sd-grey-2"
              onClick={() => setIsAddBadgeOpen(false)}
              aria-label="Close add badge modal"
            >
              <X size={18} />
            </AppButton>
          </div>
        }
      >
        <div className="flex flex-col gap-[24px] pt-[2px]">
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-[8px] rounded-[10px] border border-sd-grey-3 bg-white px-[12px] py-[8px]">
              <div className="flex size-[20px] items-center justify-center rounded-full bg-sd-grey-11">
                <Image src="/assets/badges/badge2.svg" alt="Selected badge icon" width={12} height={12} className="object-contain" />
              </div>
              <span className="text-[14px] font-normal text-sd-grey-12 tracking-[-0.28px] leading-[20px]">
                Untitle
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-[18px]">
            <div className="flex flex-col gap-[12px]">
              <h4 className="text-[16px] font-medium text-sd-grey-12 tracking-[-0.32px] leading-[24px]">
                Customize badge
              </h4>

              <FormInput
                name="badge-title"
                label="Badge title"
                placeholder="Enter name"
                value={badgeTitle}
                onChange={(event) => setBadgeTitle(event.target.value)}
                className="h-[44px] rounded-[10px] border-[1.5px] border-sd-grey-6 bg-white text-[14px] text-sd-grey-12"
              />

              <div className="flex flex-col gap-[6px]">
                <span className="text-[14px] font-normal text-sd-grey-12 tracking-[-0.28px] leading-[20px]">
                  Select icon
                </span>
                <button
                  type="button"
                  className="flex h-[44px] w-[44px] items-center justify-center rounded-[10px] border border-sd-grey-6 bg-white"
                >
                  <Image src="/assets/badges/badge2.svg" alt="Badge icon option" width={22} height={22} className="object-contain" />
                </button>
              </div>

              <div className="flex flex-col gap-[6px]">
                <span className="text-[14px] font-normal text-sd-grey-12 tracking-[-0.28px] leading-[20px]">
                  Select color
                </span>
                <button
                  type="button"
                  className="flex h-[44px] w-[44px] items-center justify-center rounded-[10px] border border-sd-grey-6 bg-white"
                >
                  <span className="size-[32px] rounded-[8px] bg-sd-grey-11" />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-[12px]">
              <h4 className="text-[16px] font-medium text-sd-grey-12 tracking-[-0.32px] leading-[24px] mb-2">
                Configuration
              </h4>
              <p className="text-[14px] font-normal text-sd-grey-12/55 tracking-[-0.28px] leading-[20px]">
                Configure badge. Set the number of created courses required to attain this badge.
              </p>

              <FormInput
                name="badge-course-count"
                label="Number of courses required"
                value={courseCount}
                onChange={(event) => setCourseCount(event.target.value)}
                className="h-[44px] rounded-[10px] border-[1.5px] border-sd-grey-6 bg-white text-[14px] text-sd-grey-10"
              />

              <div className="flex items-start justify-between gap-[16px] pt-[2px]">
                <p className="max-w-[440px] text-[14px] font-normal text-sd-grey-11/55 tracking-[-0.28px] leading-[20px]">
                  Automatically award this badge to creator when the meet the requirement for this badge
                </p>

                <label className="relative inline-flex h-[24px] w-[46px] shrink-0 cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={autoAward}
                    onChange={(event) => setAutoAward(event.target.checked)}
                    className="peer sr-only"
                  />
                  <span className="absolute inset-0 rounded-full bg-sd-grey-6 transition-colors peer-checked:bg-sd-blue" />
                  <span className="absolute left-[2px] top-[2px] size-[20px] rounded-full bg-white shadow transition-transform peer-checked:translate-x-[22px]" />
                </label>
              </div>
            </div>
          </div>

          <div className="flex gap-[12px]">
            <AppButton
              type="button"
              variant="outline"
              size="app"
              className="h-[44px] min-w-[134px] rounded-[10px] border-sd-grey-6 bg-white px-[24px] text-[14px] font-normal text-sd-grey-12"
              onClick={() => setIsAddBadgeOpen(false)}
            >
              Cancel
            </AppButton>
            <AppButton
              type="button"
              variant="app-primary"
              size="app"
              className="h-[44px] min-w-[134px] rounded-[10px] px-[24px] text-[14px] font-normal tracking-[-0.28px]"
            >
              Add badge
            </AppButton>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isConfigureBadgeOpen}
        onOpenChange={(open) => setIsConfigureBadgeOpen(open)}
        showCloseButton={false}
        className="sm:max-w-[600px] rounded-[16px] border border-sd-grey-3 bg-white p-[20px]"
        title={
          <div className="flex items-start justify-between gap-[16px]">
            <div className="flex flex-col gap-[4px]">
              <span className="text-[20px] font-semibold text-sd-grey-12 leading-[32px] tracking-[-0.4px]">
                Configure this badge
              </span>
              <span className="text-[14px] font-normal text-sd-grey-11 leading-[20px] tracking-[-0.28px]">
                Configure the requirement required to achieve this creator badge
              </span>
            </div>
            <AppButton
              type="button"
              variant="outline"
              size="icon-sm"
              className="size-[32px] rounded-[10px] border-sd-grey-3 bg-white text-sd-grey-9 hover:bg-sd-grey-2"
              onClick={() => setIsConfigureBadgeOpen(false)}
              aria-label="Close configure badge modal"
            >
              <X size={18} />
            </AppButton>
          </div>
        }
      >
        <div className="flex flex-col gap-[40px] pt-[2px]">
          <FormInput
            name="configure-badge-course-count"
            label="Number of courses required"
            value={courseCount}
            onChange={(event) => setCourseCount(event.target.value)}
            className="h-[44px] rounded-[10px] border-[1.5px] border-sd-grey-6 bg-white text-[14px] text-sd-grey-10"
          />

          <div className="flex gap-[12px]">
            <AppButton
              type="button"
              variant="outline"
              size="app"
              className="h-[44px] min-w-[134px] rounded-[10px] border-sd-grey-6 bg-white px-[24px] text-[14px] font-normal text-sd-grey-12"
              onClick={() => setIsConfigureBadgeOpen(false)}
            >
              Cancel
            </AppButton>
            <AppButton
              type="button"
              variant="app-primary"
              size="app"
              className="h-[44px] min-w-[134px] rounded-[10px] px-[24px] text-[14px] font-normal tracking-[-0.28px]"
              onClick={() => setIsConfigureBadgeOpen(false)}
            >
              Save
            </AppButton>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isDeleteBadgeOpen}
        onOpenChange={(open) => setIsDeleteBadgeOpen(open)}
        showCloseButton={false}
        className="sm:max-w-[368px] rounded-[16px] border border-sd-grey-3 bg-white p-[16px]"
        title={
          <div className="flex items-start justify-between gap-[16px]">
            <span className="text-[20px] font-semibold text-sd-grey-12 leading-[32px] tracking-[-0.4px]">
              Delete this badge?
            </span>
            <AppButton
              type="button"
              variant="outline"
              size="icon-sm"
              className="size-[32px] rounded-[10px] border-sd-grey-3 bg-white text-sd-grey-9 hover:bg-sd-grey-2"
              onClick={() => setIsDeleteBadgeOpen(false)}
              aria-label="Close delete badge modal"
            >
              <X size={18} />
            </AppButton>
          </div>
        }
      >
        <div className="flex flex-col gap-[20px] pt-[2px]">
          <p className="text-[14px] font-normal text-sd-grey-11 leading-[20px] tracking-[-0.28px]">
            Are you sure you want to delete this badge? Once deleted, all creators having this badge will loose their badge?
          </p>

          <div className="flex items-start justify-between gap-[16px]">
            <p className="max-w-[220px] text-[14px] font-normal text-sd-grey-11 leading-[20px] tracking-[-0.28px]">
              Move creators having this badge to the previous badge
            </p>

            <label className="relative inline-flex h-[24px] w-[46px] shrink-0 cursor-pointer items-center">
              <input
                type="checkbox"
                checked={moveToPreviousBadge}
                onChange={(event) => setMoveToPreviousBadge(event.target.checked)}
                className="peer sr-only"
              />
              <span className="absolute inset-0 rounded-full bg-sd-grey-6 transition-colors peer-checked:bg-sd-blue" />
              <span className="absolute left-[2px] top-[2px] size-[20px] rounded-full bg-white shadow transition-transform peer-checked:translate-x-[22px]" />
            </label>
          </div>

          <div className="flex gap-[12px]">
            <AppButton
              type="button"
              variant="app-primary"
              size="app"
              className="h-[44px] min-w-[134px] rounded-[10px] border-sd-danger bg-sd-danger px-[24px] text-[14px] font-normal tracking-[-0.28px] text-white hover:bg-sd-danger"
              onClick={() => setIsDeleteBadgeOpen(false)}
            >
              Delete badge
            </AppButton>
            <AppButton
              type="button"
              variant="outline"
              size="app"
              className="h-[44px] min-w-[134px] rounded-[10px] border-sd-grey-6 bg-white px-[24px] text-[14px] font-normal text-sd-grey-12"
              onClick={() => setIsDeleteBadgeOpen(false)}
            >
              Cancel
            </AppButton>
          </div>
        </div>
      </Modal>

      <div className="flex w-full flex-col gap-[34px]">
      <div className="flex items-start justify-between gap-[16px]">
        <div className="flex flex-col gap-[6px]">
          <h3 className="text-[22px] font-medium text-sd-grey-12 tracking-[-0.44px] leading-[32px]">
            Achievement award
          </h3>
          <p className="text-[14px] font-normal text-sd-grey-11 leading-[24px]">
            Manage and create your achievement Awards
          </p>
        </div>

        <AppButton
          type="button"
          variant="app-primary"
          size="app"
          className="h-[42px] rounded-[10px] px-[24px] text-[14px] font-normal tracking-[-0.28px]"
          onClick={() => setIsAddBadgeOpen(true)}
        >
          Add badge
        </AppButton>
      </div>

      <div className="flex flex-col gap-[18px]">
        {badges.map((badge) => (
          <div key={badge.id} className="flex items-center justify-between gap-[20px]">
            <div className="flex items-center gap-[14px]">
              <BadgeImage
                src={badge.imageUrl}
                alt={badge.title}
                size={50}
                frameClassName="h-[86px] w-[104px]"
              />

              <div className="flex flex-col gap-[8px]">
                <h4 className="text-[16px] font-medium text-sd-grey-12 tracking-[-0.32px] leading-[24px]">
                  {badge.title}
                </h4>
                <p className="max-w-[400px] text-[14px] font-normal text-sd-grey-11 tracking-[-0.28px] leading-[20px]">
                  {badge.description}
                </p>
              </div>
            </div>

            <div className="relative">
              <button
                type="button"
                className="text-sd-grey-11 cursor-pointer"
                aria-label={`${badge.title} actions`}
                onClick={() =>
                  setOpenMenuBadgeId((current) => (current === badge.id ? null : badge.id))
                }
              >
                <MoreHorizontal size={20} strokeWidth={2} />
              </button>

              {openMenuBadgeId === badge.id && (
                <>
                  <button
                    type="button"
                    className="fixed inset-0 z-10 cursor-default"
                    onClick={() => setOpenMenuBadgeId(null)}
                    aria-label="Close badge actions"
                  />
                  <div className="absolute right-0 top-[28px] z-20 w-[126px] rounded-[12px] border border-sd-grey-3 bg-white p-[8px] shadow-[0px_8px_20px_0px_rgba(0,0,0,0.14)]">
                    <div className="flex flex-col gap-[2px]">
                      <AppButton
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-[34px] justify-start gap-[10px] rounded-[8px] px-[10px] text-[12px] font-normal text-sd-grey-11 hover:bg-sd-grey-1"
                        onClick={() => {
                          setOpenMenuBadgeId(null);
                        }}
                      >
                        <Edit2 variant="Linear" size={18} color="var(--sd-grey-11)" />
                        Edit
                      </AppButton>
                      <AppButton
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-[34px] justify-start gap-[10px] rounded-[8px] px-[10px] text-[12px] font-normal text-sd-grey-11 hover:bg-sd-grey-1"
                        onClick={() => {
                          setCourseCount("23");
                          setIsConfigureBadgeOpen(true);
                          setOpenMenuBadgeId(null);
                        }}
                      >
                        <Setting2 variant="Linear" size={18} color="var(--sd-grey-11)" />
                        Configure
                      </AppButton>
                      <AppButton
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-[34px] justify-start gap-[10px] rounded-[8px] px-[10px] text-[12px] font-normal text-sd-danger hover:bg-sd-danger-soft"
                        onClick={() => {
                          setMoveToPreviousBadge(false);
                          setIsDeleteBadgeOpen(true);
                          setOpenMenuBadgeId(null);
                        }}
                      >
                        <Trash variant="Linear" size={18} color="var(--sd-danger)" />
                        Delete
                      </AppButton>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-[18px]">
        <h4 className="text-[16px] font-semibold text-sd-grey-12 tracking-[-0.32px] leading-[24px]">
          Achievement Analytics
        </h4>

        <div className="flex gap-[12px]">
          {badgeStats.map((item) => (
            <div
              key={item.id}
              className="flex h-[160px] w-[122px] flex-col items-center rounded-[16px] border border-sd-grey-3 bg-white px-[12px] py-[14px]"
            >
              <BadgeImage
                src={item.imageUrl}
                alt={item.title}
                size={30}
                frameClassName="h-[60px] w-[60px]"
                bordered={false}
              />
              <div className="mt-[16px] flex flex-col items-center gap-[2px] text-center">
                <span className="text-[14px] font-normal text-sd-grey-12 tracking-[-0.28px] leading-[20px]">
                  {item.title}
                </span>
                <span className="text-[14px] font-normal text-sd-grey-11 tracking-[-0.28px] leading-[20px]">
                  {item.creators}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
    </>
  );
};
