"use client";

import React from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { Modal } from "@/components/shared/Modal";
import { Button as AppButton } from "@/components/shared/Button";
import { FormSelect } from "@/components/form/FormSelect";
import { getErrorStatus, normalizeApiError } from "@/lib/api/errors";
import {
  useDeleteCategoryMutation,
  useGetCategoryDeletionImpactQuery,
} from "@/modules/categories/api/categoriesApi";
import {
  useGetCategoryPickerQuery,
  selectActivePickerOptions,
} from "@/modules/categories/api/categoryPickerApi";
import type { Category, DeleteStrategy } from "@/modules/categories/types";

interface DeleteCategoryModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
}

const STRATEGY_COPY: Array<{
  value: DeleteStrategy;
  label: string;
  description: string;
}> = [
  {
    value: "DELETE_COURSES",
    label: "Delete its courses too",
    description: "Every course in this category is removed along with it. This cannot be undone.",
  },
  {
    value: "REASSIGN",
    label: "Move courses to another category",
    description: "The courses are kept and moved to a category you choose.",
  },
];

export const DeleteCategoryModal = ({
  isOpen,
  onOpenChange,
  category,
}: DeleteCategoryModalProps) => {
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

  const {
    data: impact,
    isLoading: isLoadingImpact,
    isFetching: isFetchingImpact,
    refetch: refetchImpact,
  } = useGetCategoryDeletionImpactQuery(category?.id ?? "", { skip: !category });

 
  const { data: pickerOptions } = useGetCategoryPickerQuery(undefined, {
    skip: !isOpen,
  });

  const [strategy, setStrategy] = React.useState<DeleteStrategy | null>(null);
  const [replacement, setReplacement] = React.useState("");

  /**
   * Set when the server answers `409` — the impact read at open time said no
   * strategy was needed, but courses appeared since. From that point on the
   * strategy UI is shown without waiting for a refetch to land.
   */
  const [conflictDetected, setConflictDetected] = React.useState(false);

  const requiresStrategy = conflictDetected || impact?.requires_strategy === true;
  const isReassign = strategy === "REASSIGN";
  const canConfirm =
    !isDeleting && (!requiresStrategy || (strategy !== null && (!isReassign || !!replacement)));

  const replacementOptions = selectActivePickerOptions(pickerOptions)
    .filter((option) => option.id !== category?.id)
    .map((option) => ({ label: option.name, value: option.id }));

  const handleClose = () => {
    if (isDeleting) return;
    onOpenChange(false);
  };

  const handleConfirm = async () => {
    if (!category || !canConfirm) return;

    try {
      await deleteCategory({
        id: category.id,
        // Omitted entirely when no strategy is required, which is the case the
        // API documents as a plain delete.
        ...(requiresStrategy && strategy
          ? {
              strategy,
              ...(isReassign && replacement
                ? { replacement_category: replacement }
                : {}),
            }
          : {}),
      }).unwrap();
      toast.success("Category deleted");
      onOpenChange(false);
    } catch (err) {
      if (getErrorStatus(err as never) === 409) {
        // Courses were added between the impact read and the delete. Show the
        // choice rather than dead-ending on an error.
        setConflictDetected(true);
        refetchImpact();
        toast.error(
          "This category now holds courses. Choose what should happen to them.",
        );
        return;
      }
      const { message } = normalizeApiError(err as never);
      toast.error(message ?? "Could not delete category");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleClose();
        }
      }}
      showCloseButton={false}
      className="sm:max-w-[440px] rounded-[16px] border border-sd-grey-3 p-[20px]"
      title={
        <div className="flex items-start justify-between gap-[16px]">
          <span className="text-[20px] font-semibold text-sd-grey-12 leading-[32px] tracking-[-0.4px]">
            Delete category
          </span>
          <AppButton
            type="button"
            variant="outline"
            size="icon-sm"
            className="size-[32px] rounded-[10px] border-sd-grey-3 bg-white text-sd-grey-9 hover:bg-sd-grey-2"
            onClick={handleClose}
            aria-label="Close delete category modal"
          >
            <X size={18} />
          </AppButton>
        </div>
      }
    >
      <div className="flex flex-col gap-[20px]">
        <p className="text-[14px] font-normal text-sd-grey-11 leading-[20px] tracking-[-0.28px]">
          Are you sure you want to delete{" "}
          <span className="font-medium text-sd-grey-12">{category?.name}</span>? Once you
          proceed all data related to this category will be lost.
        </p>

        {isLoadingImpact ? (
          <div className="h-[56px] w-full animate-pulse rounded-[8px] bg-sd-grey-2" />
        ) : (
          impact && (
            <div className="flex flex-col gap-[8px] rounded-[8px] border border-sd-grey-3 bg-sd-grey-1 px-[16px] py-[12px]">
              <span className="text-[14px] font-medium leading-[20px] tracking-[-0.28px] text-sd-grey-12">
                {impact.course_count === 0
                  ? "No courses use this category"
                  : `${impact.course_count} course${impact.course_count === 1 ? "" : "s"} use this category`}
              </span>
              {impact.affected_creator_profile_count > 0 && (
                <span className="text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-sd-grey-11">
                  {impact.affected_creator_profile_count} creator
                  {impact.affected_creator_profile_count === 1 ? "" : "s"} affected
                </span>
              )}
              {Object.keys(impact.courses_by_status ?? {}).length > 0 && (
                <span className="text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-sd-grey-11">
                  {Object.entries(impact.courses_by_status)
                    .map(([status, count]) => `${count} ${status.toLowerCase().replace(/_/g, " ")}`)
                    .join(" · ")}
                </span>
              )}
            </div>
          )
        )}

        {requiresStrategy && (
          <div className="flex flex-col gap-[12px]">
            <span className="text-[14px] font-medium leading-[20px] tracking-[-0.28px] text-sd-grey-12">
              What should happen to the courses?
            </span>

            {STRATEGY_COPY.map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer items-start gap-[10px] rounded-[8px] border border-sd-grey-3 px-[12px] py-[10px] hover:bg-sd-grey-1"
              >
                <input
                  type="radio"
                  name="delete-strategy"
                  value={option.value}
                  checked={strategy === option.value}
                  disabled={isDeleting}
                  onChange={() => setStrategy(option.value)}
                  className="mt-[3px] size-[16px] shrink-0 accent-[#0056D2]"
                />
                <span className="flex flex-col gap-[2px]">
                  <span className="text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-sd-grey-12">
                    {option.label}
                  </span>
                  <span className="text-[12px] font-normal leading-[18px] tracking-[-0.24px] text-sd-grey-11">
                    {option.description}
                  </span>
                </span>
              </label>
            ))}

            {isReassign && (
              <FormSelect
                name="replacementCategory"
                label="Move courses to"
                value={replacement}
                onValueChange={setReplacement}
                options={replacementOptions}
                placeholder={
                  replacementOptions.length === 0
                    ? "No other active category available"
                    : "Select category"
                }
                triggerClassName="h-[44px] bg-white text-sd-grey-12"
              />
            )}
          </div>
        )}

        <div className="flex gap-[12px]">
          <AppButton
            type="button"
            variant="app-secondary"
            size="app"
            disabled={!canConfirm || isFetchingImpact}
            onClick={handleConfirm}
            className="h-[44px] min-w-[133px] rounded-[10px] bg-[var(--sd-danger)] px-[20px] text-[14px] font-normal tracking-[-0.28px] hover:bg-[color-mix(in_srgb,var(--sd-danger),black_8%)]"
          >
            {isDeleting ? "Deleting..." : "Delete category"}
          </AppButton>
          <AppButton
            type="button"
            variant="outline"
            size="app"
            disabled={isDeleting}
            className="h-[44px] min-w-[133px] rounded-[10px] border-sd-grey-6 bg-white px-[24px] text-[14px] font-normal text-sd-grey-12"
            onClick={handleClose}
          >
            Cancel
          </AppButton>
        </div>
      </div>
    </Modal>
  );
};
