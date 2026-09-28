"use client";

import React from "react";
import { Diamond, Medal, MoreHorizontal, Shield, Star, Trophy, X, type LucideIcon } from "lucide-react";
import { Edit2, Setting2, Trash } from "iconsax-react";
import { toast } from "sonner";
import { Button as AppButton } from "@/components/shared/Button";
import { Checkbox } from "@/components/shared/Checkbox";
import { Modal } from "@/components/shared/Modal";
import { FormInput } from "@/components/form/FormInput";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { normalizeApiError } from "@/lib/api/errors";
import {
  type AchievementBadge,
  useAwardAchievementBadgeMutation,
  useCreateAchievementBadgeMutation,
  useDeleteAchievementBadgeMutation,
  useGetAchievementBadgesQuery,
  useGetBadgeDeletionImpactQuery,
  useGetBadgeHoldersQuery,
  useRevokeAchievementBadgeMutation,
  useUpdateAchievementBadgeMutation,
} from "../api/achievementBadgesApi";

const BADGE_ICONS: Record<string, LucideIcon> = {
  diamond: Diamond,
  medal: Medal,
  shield: Shield,
  star: Star,
  trophy: Trophy,
};

const BadgeGlyph = ({ icon, color, size = 28 }: { icon: string; color: string; size?: number }) => {
  const Icon = BADGE_ICONS[icon] ?? Medal;
  return <Icon size={size} strokeWidth={1.8} color={color} />;
};

const BadgeIconPicker = ({
  value,
  color,
  onChange,
  disabled,
}: {
  value: string;
  color: string;
  onChange: (icon: string) => void;
  disabled?: boolean;
}) => (
  <Popover>
    <PopoverTrigger asChild>
      <AppButton
        type="button"
        variant="outline"
        size="icon"
        disabled={disabled}
        className="size-[44px] rounded-[10px] border-sd-grey-6 bg-white hover:bg-sd-grey-2"
        aria-label="Select badge icon"
      >
        <BadgeGlyph icon={value} color={color} size={22} />
      </AppButton>
    </PopoverTrigger>
    <PopoverContent align="start" className="w-auto rounded-[12px] border border-sd-grey-3 bg-white p-[8px]">
      <div className="grid grid-cols-5 gap-[4px]">
        {Object.keys(BADGE_ICONS).map((icon) => (
          <AppButton
            key={icon}
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`Select ${icon} icon`}
            aria-pressed={value === icon}
            className={value === icon ? "size-[38px] rounded-[8px] bg-sd-blue/10" : "size-[38px] rounded-[8px] hover:bg-sd-grey-2"}
            onClick={() => onChange(icon)}
          >
            <BadgeGlyph icon={icon} color={color} size={20} />
          </AppButton>
        ))}
      </div>
    </PopoverContent>
  </Popover>
);

const BadgePreview = ({ badge }: { badge: AchievementBadge }) => (
  <div className="flex items-center gap-[14px]">
    <div className="flex h-[86px] w-[104px] shrink-0 items-center justify-center rounded-[12px] border border-sd-grey-3 bg-white">
      <BadgeGlyph icon={badge.icon} color={badge.color} size={50} />
    </div>
    <div className="flex flex-col gap-[8px]">
      <h4 className="text-[16px] font-medium text-sd-grey-12 leading-[24px] tracking-[-0.32px]">{badge.title}</h4>
      <p className="max-w-[400px] text-[14px] font-normal text-sd-grey-11 leading-[20px] tracking-[-0.28px]">{badge.requirement_summary}</p>
    </div>
  </div>
);

export const AchievementAwardsTab = () => {
  const [isBadgeFormOpen, setIsBadgeFormOpen] = React.useState(false);
  const [editingBadge, setEditingBadge] = React.useState<AchievementBadge | null>(null);
  const [configureBadge, setConfigureBadge] = React.useState<AchievementBadge | null>(null);
  const [deleteBadge, setDeleteBadge] = React.useState<AchievementBadge | null>(null);
  const [holdersBadge, setHoldersBadge] = React.useState<AchievementBadge | null>(null);
  const [openMenuBadgeId, setOpenMenuBadgeId] = React.useState<string | null>(null);
  const [badgeTitle, setBadgeTitle] = React.useState("");
  const [courseCount, setCourseCount] = React.useState("23");
  const [autoAward, setAutoAward] = React.useState(false);
  const [badgeIcon, setBadgeIcon] = React.useState("diamond");
  const [badgeColor, setBadgeColor] = React.useState("#F2994A");
  const [configureCount, setConfigureCount] = React.useState("");
  const [moveToPreviousBadge, setMoveToPreviousBadge] = React.useState(false);
  const [creatorId, setCreatorId] = React.useState("");
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const { data, isLoading, isError, refetch } = useGetAchievementBadgesQuery({ page: 1, size: 100 });
  const badges = data?.data.results ?? [];
  const { data: deletionImpact, isLoading: isLoadingImpact } = useGetBadgeDeletionImpactQuery(deleteBadge?.id ?? "", { skip: !deleteBadge });
  const { data: holdersData, isLoading: isLoadingHolders } = useGetBadgeHoldersQuery(
    { badgeId: holdersBadge?.id ?? "", page: 1, size: 100 },
    { skip: !holdersBadge },
  );

  const [createBadge, { isLoading: isCreating }] = useCreateAchievementBadgeMutation();
  const [updateBadge, { isLoading: isUpdating }] = useUpdateAchievementBadgeMutation();
  const [deleteAchievementBadge, { isLoading: isDeleting }] = useDeleteAchievementBadgeMutation();
  const [awardBadge, { isLoading: isAwarding }] = useAwardAchievementBadgeMutation();
  const [revokeBadge] = useRevokeAchievementBadgeMutation();
  const isSavingBadge = isCreating || isUpdating;

  const resetBadgeForm = () => {
    setEditingBadge(null);
    setBadgeTitle("");
    setCourseCount("23");
    setAutoAward(false);
    setBadgeIcon("diamond");
    setBadgeColor("#F2994A");
    setErrors({});
  };

  const closeBadgeForm = () => {
    setIsBadgeFormOpen(false);
    resetBadgeForm();
  };

  const openEditBadge = (badge: AchievementBadge) => {
    setEditingBadge(badge);
    setBadgeTitle(badge.title);
    setBadgeIcon(badge.icon);
    setBadgeColor(badge.color);
    setErrors({});
    setIsBadgeFormOpen(true);
    setOpenMenuBadgeId(null);
  };

  const handleSaveBadge = async () => {
    const requiredCount = Number(courseCount);
    const nextErrors: Record<string, string> = {};
    if (!badgeTitle.trim()) nextErrors.title = "Badge title is required";
    if (!editingBadge && (!Number.isInteger(requiredCount) || requiredCount < 1)) nextErrors.required_count = "Enter a whole number greater than zero";
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    try {
      if (editingBadge) {
        await updateBadge({ id: editingBadge.id, body: { title: badgeTitle.trim(), icon: badgeIcon, color: badgeColor } }).unwrap();
        toast.success("Badge updated");
      } else {
        await createBadge({ title: badgeTitle.trim(), icon: badgeIcon, color: badgeColor, criterion: "COURSES_CREATED", required_count: requiredCount, auto_award: autoAward }).unwrap();
        toast.success("Badge created");
      }
      closeBadgeForm();
    } catch (error) {
      const normalized = normalizeApiError(error as never);
      setErrors(normalized.fieldErrors);
      toast.error(normalized.message ?? "Could not save the badge");
    }
  };

  const handleConfigureBadge = async () => {
    if (!configureBadge) return;
    const requiredCount = Number(configureCount);
    if (!Number.isInteger(requiredCount) || requiredCount < 1) {
      setErrors({ required_count: "Enter a whole number greater than zero" });
      return;
    }
    try {
      await updateBadge({ id: configureBadge.id, body: { required_count: requiredCount } }).unwrap();
      toast.success("Badge requirement updated");
      setConfigureBadge(null);
      setErrors({});
    } catch (error) {
      const normalized = normalizeApiError(error as never);
      setErrors(normalized.fieldErrors);
      toast.error(normalized.message ?? "Could not configure the badge");
    }
  };

  const handleDeleteBadge = async () => {
    if (!deleteBadge) return;
    try {
      await deleteAchievementBadge({ id: deleteBadge.id, moveToPrevious: moveToPreviousBadge && !!deletionImpact?.previous_badge }).unwrap();
      toast.success("Badge deleted");
      setDeleteBadge(null);
      setMoveToPreviousBadge(false);
    } catch (error) {
      const normalized = normalizeApiError(error as never);
      toast.error(normalized.message ?? "Could not delete the badge");
    }
  };

  const handleAwardBadge = async () => {
    if (!holdersBadge || !creatorId.trim()) return;
    try {
      await awardBadge({ badgeId: holdersBadge.id, creatorId: creatorId.trim() }).unwrap();
      toast.success("Badge awarded");
      setCreatorId("");
    } catch (error) {
      const normalized = normalizeApiError(error as never);
      toast.error(normalized.message ?? "Could not award the badge");
    }
  };

  const handleRevokeBadge = async (holderCreatorId: string) => {
    if (!holdersBadge) return;
    try {
      await revokeBadge({ badgeId: holdersBadge.id, creatorId: holderCreatorId }).unwrap();
      toast.success("Badge revoked");
    } catch (error) {
      const normalized = normalizeApiError(error as never);
      toast.error(normalized.message ?? "Could not revoke the badge");
    }
  };

  return (
    <>
      <Modal
        isOpen={isBadgeFormOpen}
        onOpenChange={(open) => { if (!open) closeBadgeForm(); }}
        showCloseButton={false}
        className="sm:max-w-[600px] rounded-[16px] border border-sd-grey-3 bg-white p-[20px]"
        title={
          <div className="flex items-start justify-between gap-[16px]">
            <span className="text-[20px] font-semibold text-sd-grey-12 leading-[32px] tracking-[-0.4px]">{editingBadge ? "Edit badge" : "Add new badge"}</span>
            <AppButton type="button" variant="outline" size="icon-sm" className="size-[32px] rounded-[10px] border-sd-grey-3 bg-white text-sd-grey-9 hover:bg-sd-grey-2" onClick={closeBadgeForm} aria-label="Close badge form"><X size={18} /></AppButton>
          </div>
        }
      >
        <div className="flex flex-col gap-[24px] pt-[2px]">
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-[8px] rounded-[10px] border border-sd-grey-3 bg-white px-[12px] py-[8px]">
              <BadgeGlyph icon={badgeIcon} color={badgeColor} size={20} />
              <span className="text-[14px] font-normal text-sd-grey-12 leading-[20px] tracking-[-0.28px]">{badgeTitle.trim() || "Untitled"}</span>
            </div>
          </div>

          <div className="flex flex-col gap-[18px]">
            <h4 className="text-[16px] font-medium text-sd-grey-12 leading-[24px] tracking-[-0.32px]">Customize badge</h4>
            <FormInput name="badge-title" label="Badge title" placeholder="Enter name" value={badgeTitle} error={errors.title} disabled={isSavingBadge} onChange={(event) => setBadgeTitle(event.target.value)} className="h-[44px] rounded-[10px] border-[1.5px] border-sd-grey-6 bg-white text-[14px] text-sd-grey-12" />

            <div className="flex gap-[24px]">
              <div className="flex flex-col gap-[6px]">
                <span className="text-[14px] font-normal text-sd-grey-12 leading-[20px] tracking-[-0.28px]">Select icon</span>
                <BadgeIconPicker value={badgeIcon} color={badgeColor} onChange={setBadgeIcon} disabled={isSavingBadge} />
              </div>
              <div className="flex flex-col gap-[6px]">
                <span className="text-[14px] font-normal text-sd-grey-12 leading-[20px] tracking-[-0.28px]">Select color</span>
                <label className="relative flex size-[44px] cursor-pointer items-center justify-center rounded-[10px] border border-sd-grey-6 bg-white">
                  <input type="color" value={badgeColor} disabled={isSavingBadge} onChange={(event) => setBadgeColor(event.target.value)} className="absolute inset-0 cursor-pointer opacity-0" aria-label="Select badge color" />
                  <span className="size-[32px] rounded-[8px]" style={{ backgroundColor: badgeColor }} />
                </label>
              </div>
            </div>

            {!editingBadge && (
              <div className="flex flex-col gap-[12px]">
                <h4 className="text-[16px] font-medium text-sd-grey-12 leading-[24px] tracking-[-0.32px]">Configuration</h4>
                <p className="text-[14px] font-normal text-sd-grey-11 leading-[20px] tracking-[-0.28px]">Set the number of created courses required to attain this badge.</p>
                <FormInput name="badge-course-count" label="Number of courses required" type="number" min="1" value={courseCount} error={errors.required_count} disabled={isSavingBadge} onChange={(event) => setCourseCount(event.target.value)} className="h-[44px] rounded-[10px] border-[1.5px] border-sd-grey-6 bg-white text-[14px] text-sd-grey-10" />
                <Checkbox id="badge-auto-award" checked={autoAward} disabled={isSavingBadge} onCheckedChange={(checked) => setAutoAward(checked === true)} label="Automatically award this badge to creators who meet the requirement" />
              </div>
            )}
          </div>

          <div className="sticky bottom-[-8px] z-10 -mx-[20px] flex gap-[12px] border-t border-sd-grey-3 bg-white px-[20px] pb-[4px] pt-[16px]">
            <AppButton type="button" variant="outline" size="app" className="h-[44px] min-w-[134px] rounded-[10px] border-sd-grey-6 bg-white px-[24px] text-[14px] font-normal text-sd-grey-12" onClick={closeBadgeForm}>Cancel</AppButton>
            <AppButton type="button" variant="app-primary" size="app" disabled={isSavingBadge} className="h-[44px] min-w-[134px] rounded-[10px] px-[24px] text-[14px] font-normal tracking-[-0.28px]" onClick={() => void handleSaveBadge()}>
              {isSavingBadge ? "Saving..." : editingBadge ? "Save changes" : "Add badge"}
            </AppButton>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={configureBadge !== null}
        onOpenChange={(open) => { if (!open) setConfigureBadge(null); }}
        showCloseButton={false}
        className="sm:max-w-[600px] rounded-[16px] border border-sd-grey-3 bg-white p-[20px]"
        title={
          <div className="flex items-start justify-between gap-[16px]">
            <div className="flex flex-col gap-[4px]"><span className="text-[20px] font-semibold text-sd-grey-12 leading-[32px] tracking-[-0.4px]">Configure this badge</span><span className="text-[14px] font-normal text-sd-grey-11 leading-[20px] tracking-[-0.28px]">Update the number of courses required to earn {configureBadge?.title}.</span></div>
            <AppButton type="button" variant="outline" size="icon-sm" className="size-[32px] rounded-[10px] border-sd-grey-3 bg-white text-sd-grey-9 hover:bg-sd-grey-2" onClick={() => setConfigureBadge(null)} aria-label="Close configure badge modal"><X size={18} /></AppButton>
          </div>
        }
      >
        <div className="flex flex-col gap-[40px] pt-[2px]">
          <FormInput name="configure-badge-course-count" label="Number of courses required" type="number" min="1" value={configureCount} error={errors.required_count} disabled={isUpdating} onChange={(event) => setConfigureCount(event.target.value)} className="h-[44px] rounded-[10px] border-[1.5px] border-sd-grey-6 bg-white text-[14px] text-sd-grey-10" />
          <div className="flex gap-[12px]">
            <AppButton type="button" variant="outline" size="app" className="h-[44px] min-w-[134px] rounded-[10px] border-sd-grey-6 bg-white px-[24px] text-[14px] font-normal text-sd-grey-12" onClick={() => setConfigureBadge(null)}>Cancel</AppButton>
            <AppButton type="button" variant="app-primary" size="app" disabled={isUpdating} className="h-[44px] min-w-[134px] rounded-[10px] px-[24px] text-[14px] font-normal" onClick={() => void handleConfigureBadge()}>{isUpdating ? "Saving..." : "Save"}</AppButton>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={deleteBadge !== null}
        onOpenChange={(open) => { if (!open) setDeleteBadge(null); }}
        showCloseButton={false}
        className="sm:max-w-[400px] rounded-[16px] border border-sd-grey-3 bg-white p-[16px]"
        title={<div className="flex items-start justify-between gap-[16px]"><span className="text-[20px] font-semibold text-sd-grey-12 leading-[32px] tracking-[-0.4px]">Delete this badge?</span><AppButton type="button" variant="outline" size="icon-sm" className="size-[32px] rounded-[10px] border-sd-grey-3 bg-white text-sd-grey-9" onClick={() => setDeleteBadge(null)} aria-label="Close delete badge modal"><X size={18} /></AppButton></div>}
      >
        <div className="flex flex-col gap-[20px] pt-[2px]">
          <p className="text-[14px] font-normal text-sd-grey-11 leading-[20px] tracking-[-0.28px]">{isLoadingImpact ? "Checking badge holders..." : `${deletionImpact?.holder_count ?? 0} creator${deletionImpact?.holder_count === 1 ? "" : "s"} will lose this badge.`}</p>
          <Checkbox id="move-to-previous-badge" checked={moveToPreviousBadge} disabled={!deletionImpact?.previous_badge || isDeleting} onCheckedChange={(checked) => setMoveToPreviousBadge(checked === true)} label={deletionImpact?.previous_badge ? `Move holders to ${deletionImpact.previous_badge.title}` : "No previous badge is available"} />
          <div className="flex gap-[12px]">
            <AppButton type="button" variant="app-primary" size="app" disabled={isDeleting || isLoadingImpact} className="h-[44px] min-w-[134px] rounded-[10px] border-sd-danger bg-sd-danger px-[24px] text-[14px] font-normal text-white hover:bg-sd-danger" onClick={() => void handleDeleteBadge()}>{isDeleting ? "Deleting..." : "Delete badge"}</AppButton>
            <AppButton type="button" variant="outline" size="app" className="h-[44px] min-w-[110px] rounded-[10px] border-sd-grey-6 bg-white px-[24px] text-[14px] font-normal text-sd-grey-12" onClick={() => setDeleteBadge(null)}>Cancel</AppButton>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={holdersBadge !== null}
        onOpenChange={(open) => { if (!open) { setHoldersBadge(null); setCreatorId(""); } }}
        title={`${holdersBadge?.title ?? "Badge"} holders`}
        className="sm:max-w-[640px]"
      >
        <div className="flex flex-col gap-[20px]">
          <div className="flex items-end gap-[10px]">
            <FormInput name="badge-creator-id" label="Award badge by creator ID" placeholder="Creator UUID" value={creatorId} disabled={isAwarding} onChange={(event) => setCreatorId(event.target.value)} className="h-[42px] bg-white" />
            <AppButton type="button" variant="app-primary" size="app" disabled={isAwarding || !creatorId.trim()} className="h-[42px] shrink-0 rounded-[10px] px-[18px] text-[14px]" onClick={() => void handleAwardBadge()}>{isAwarding ? "Awarding..." : "Award badge"}</AppButton>
          </div>
          <div className="flex max-h-[360px] flex-col gap-[8px] overflow-y-auto">
            {isLoadingHolders ? (
              <p className="py-[24px] text-center text-[14px] text-sd-grey-11">Loading holders...</p>
            ) : (holdersData?.data.results.length ?? 0) === 0 ? (
              <p className="py-[24px] text-center text-[14px] text-sd-grey-11">No creators hold this badge yet.</p>
            ) : holdersData?.data.results.map((holder) => (
              <div key={holder.id} className="flex items-center justify-between gap-[16px] rounded-[10px] border border-sd-grey-3 px-[12px] py-[10px]">
                <div className="min-w-0"><p className="truncate text-[14px] font-medium text-sd-grey-12">{holder.creator.full_name || holder.creator.email}</p><p className="truncate text-[12px] text-sd-grey-11">{holder.creator.email} · {holder.source}</p></div>
                <AppButton type="button" variant="outline" size="sm" className="shrink-0 border-sd-danger text-sd-danger hover:bg-sd-danger-soft" onClick={() => void handleRevokeBadge(holder.creator.id)}>Revoke</AppButton>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      <div className="flex w-full flex-col gap-[34px]">
        <div className="flex items-start justify-between gap-[16px]">
          <div className="flex flex-col gap-[6px]"><h3 className="text-[22px] font-medium text-sd-grey-12 leading-[32px] tracking-[-0.44px]">Achievement award</h3><p className="text-[14px] font-normal text-sd-grey-11 leading-[24px]">Manage and create your achievement awards</p></div>
          <AppButton type="button" variant="app-primary" size="app" className="h-[42px] rounded-[10px] px-[24px] text-[14px] font-normal" onClick={() => { resetBadgeForm(); setIsBadgeFormOpen(true); }}>Add badge</AppButton>
        </div>

        <div className="flex flex-col gap-[18px]">
          {isLoading ? (
            <p className="py-[32px] text-center text-[14px] text-sd-grey-11">Loading badges...</p>
          ) : isError ? (
            <div className="flex items-center justify-between rounded-[12px] border border-sd-grey-3 p-[16px]"><span className="text-[14px] text-sd-grey-11">Could not load badges.</span><AppButton type="button" variant="outline" size="sm" onClick={() => void refetch()}>Retry</AppButton></div>
          ) : badges.length === 0 ? (
            <p className="py-[32px] text-center text-[14px] text-sd-grey-11">No achievement badges have been created.</p>
          ) : badges.map((badge) => (
            <div key={badge.id} className="flex items-center justify-between gap-[20px]">
              <BadgePreview badge={badge} />
              <div className="relative">
                <AppButton type="button" variant="ghost" size="icon-sm" className="text-sd-grey-11" aria-label={`${badge.title} actions`} onClick={() => setOpenMenuBadgeId((current) => current === badge.id ? null : badge.id)}><MoreHorizontal size={20} strokeWidth={2} /></AppButton>
                {openMenuBadgeId === badge.id && (
                  <>
                    <AppButton
                      type="button"
                      variant="ghost"
                      className="fixed inset-0 z-10 h-auto w-auto cursor-default rounded-none border-transparent bg-transparent transition-none hover:bg-transparent focus-visible:border-transparent focus-visible:ring-0 active:translate-y-0 active:scale-100"
                      onClick={() => setOpenMenuBadgeId(null)}
                      aria-label="Close badge actions"
                    />
                    <div className="absolute right-0 top-[28px] z-20 w-[126px] rounded-[12px] border border-sd-grey-3 bg-white p-[8px] shadow-[0px_8px_20px_0px_rgba(0,0,0,0.14)]">
                      <div className="flex flex-col gap-[2px]">
                        <AppButton type="button" variant="ghost" size="sm" className="h-[34px] justify-start gap-[10px] rounded-[8px] px-[10px] text-[12px] font-normal text-sd-grey-11 hover:bg-sd-grey-1" onClick={() => openEditBadge(badge)}><Edit2 variant="Linear" size={18} color="var(--sd-grey-11)" />Edit</AppButton>
                        <AppButton type="button" variant="ghost" size="sm" className="h-[34px] justify-start gap-[10px] rounded-[8px] px-[10px] text-[12px] font-normal text-sd-grey-11 hover:bg-sd-grey-1" onClick={() => { setConfigureCount(String(badge.required_count)); setErrors({}); setConfigureBadge(badge); setOpenMenuBadgeId(null); }}><Setting2 variant="Linear" size={18} color="var(--sd-grey-11)" />Configure</AppButton>
                        <AppButton type="button" variant="ghost" size="sm" className="h-[34px] justify-start gap-[10px] rounded-[8px] px-[10px] text-[12px] font-normal text-sd-danger hover:bg-sd-danger-soft" onClick={() => { setMoveToPreviousBadge(false); setDeleteBadge(badge); setOpenMenuBadgeId(null); }}><Trash variant="Linear" size={18} color="var(--sd-danger)" />Delete</AppButton>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-[18px]">
          <h4 className="text-[16px] font-semibold text-sd-grey-12 leading-[24px] tracking-[-0.32px]">Achievement Analytics</h4>
          <div className="flex flex-wrap gap-[12px]">
            {badges.map((badge) => (
              <AppButton key={badge.id} type="button" variant="ghost" size="default" className="flex h-[160px] w-[122px] flex-col items-center rounded-[16px] border border-sd-grey-3 bg-white px-[12px] py-[14px] hover:bg-sd-grey-1" onClick={() => setHoldersBadge(badge)}>
                <div className="flex h-[60px] w-[60px] items-center justify-center"><BadgeGlyph icon={badge.icon} color={badge.color} size={34} /></div>
                <span className="mt-[16px] text-[14px] font-normal text-sd-grey-12 leading-[20px] tracking-[-0.28px]">{badge.title}</span>
                <span className="text-[14px] font-normal text-sd-grey-11 leading-[20px] tracking-[-0.28px]">{badge.holder_count} {badge.holder_count === 1 ? "Creator" : "Creators"}</span>
              </AppButton>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
