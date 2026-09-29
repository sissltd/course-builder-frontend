"use client";

import React, { useMemo, useState } from "react";
import { SearchNormal1, UserAdd, UserRemove } from "iconsax-react";
import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/shared/Button";
import { humanizeFieldName } from "@/lib/api/errors";
import { cn } from "@/lib/utils";
import { colorForCreator, initialsFor } from "../data/mockData";
import type { AssignableReviewer, ReviewSeat } from "@/redux/slices/adminApi";

const SEAT_LABEL: Record<string, string> = {
  CONTENT: "First Review",
  SECOND_REVIEW: "Second Review",
  VERIFICATION: "Verification",
  QA: "QA Verification",
};

const ROLE_LABEL: Record<string, string> = {
  CREATOR_REVIEWER: "Creator Reviewer",
  REVIEWER: "Reviewer",
  STAFF_VERIFIER: "Verifier",
  STAFF_APPROVER: "Approver",
  QA_REVIEWER: "QA Reviewer",
  AI_REVIEWER: "AI Reviewer",
};

const seatLabel = (seat?: ReviewSeat) =>
  seat ? SEAT_LABEL[seat] ?? humanizeFieldName(seat) : "";

const roleLabel = (role: string) =>
  role ? ROLE_LABEL[role] ?? humanizeFieldName(role) : "";

interface AssignReviewerModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  courseTitle?: string;
  seat?: ReviewSeat;
  reviewers: AssignableReviewer[];
  isLoadingReviewers?: boolean;
  isAssigning?: boolean;
  onAssign: (reviewer: AssignableReviewer, replace: boolean) => void;
}

/**
 * Puts a reviewer in the seat a course is waiting on.
 *
 * The seat is the course's, not the admin's to choose: `assignable-reviewers`
 * returns only the people who can sit the one seat the course waits on, and
 * each row repeats which seat that is. So the seat is stated at the top and the
 * list below is already filtered — there is no seat picker.
 *
 * Unavailable reviewers are listed disabled rather than hidden. The backend
 * returns them on purpose (assigning one is a 400), and seeing that someone
 * exists but is marked unavailable is different from them being absent.
 *
 * Taking a seat someone else holds is a separate decision, so it is a second
 * step rather than a flag on the first: the holder is named, and backing out
 * returns to the list with the choice intact.
 */
export const AssignReviewerModal = ({
  isOpen,
  onOpenChange,
  courseTitle,
  seat,
  reviewers,
  isLoadingReviewers = false,
  isAssigning = false,
  onAssign,
}: AssignReviewerModalProps) => {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isConfirmingReplace, setIsConfirmingReplace] = useState(false);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSearch("");
      setSelectedId(null);
      setIsConfirmingReplace(false);
    }
    onOpenChange(open);
  };

  const holder = useMemo(
    () => reviewers.find((reviewer) => reviewer.holds_seat) ?? null,
    [reviewers],
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return reviewers;
    return reviewers.filter(
      (reviewer) =>
        reviewer.full_name.toLowerCase().includes(term) ||
        reviewer.email.toLowerCase().includes(term),
    );
  }, [reviewers, search]);

  const seatName = seatLabel(seat);

  const selected = reviewers.find((reviewer) => reviewer.id === selectedId) ?? null;

  const handleAssignClick = () => {
    if (!selected || isAssigning) return;
    if (holder && holder.id !== selected.id) {
      setIsConfirmingReplace(true);
      return;
    }
    onAssign(selected, false);
  };

  const handleConfirmReplace = () => {
    if (!selected || isAssigning) return;
    onAssign(selected, true);
  };

  const renderRow = (reviewer: AssignableReviewer) => {
    const isSelected = reviewer.id === selectedId;
    return (
      <button
        key={reviewer.id}
        type="button"
        disabled={!reviewer.is_available}
        onClick={() => setSelectedId(reviewer.id)}
        className={cn(
          "flex min-w-0 w-full items-center gap-[10px] overflow-hidden rounded-[8px] p-[8px] text-left transition-colors sm:gap-[12px]",
          reviewer.is_available
            ? "cursor-pointer hover:bg-sd-grey-2"
            : "cursor-not-allowed opacity-50",
          isSelected && "bg-sd-grey-2",
        )}
      >
        <div
          className="flex size-[32px] shrink-0 items-center justify-center rounded-full text-[14px] font-semibold text-white"
          style={{ backgroundColor: colorForCreator(reviewer.full_name) }}
        >
          {initialsFor(reviewer.full_name)}
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-[14px] font-normal leading-[20px] text-sd-grey-12">
            {reviewer.full_name}
          </span>
          <span className="truncate text-[12px] font-normal leading-[16px] text-sd-grey-11">
            {roleLabel(reviewer.role)} · {reviewer.email}
          </span>
        </div>
        <div className="ml-auto max-w-[96px] shrink-0 pl-[4px] sm:pl-[8px]">
          {reviewer.holds_seat ? (
            <span className="block truncate whitespace-nowrap text-[11px] font-medium text-sd-blue">
              Holds this seat
            </span>
          ) : !reviewer.is_available ? (
            <span className="block truncate whitespace-nowrap text-[11px] font-medium text-sd-grey-11">
              Unavailable
            </span>
          ) : null}
        </div>
      </button>
    );
  };

  if (isConfirmingReplace && selected && holder) {
    return (
      <Modal
        isOpen={isOpen}
        onOpenChange={handleOpenChange}
        className="sm:max-w-[460px]"
        showCloseButton={false}
      >
        <div className="flex flex-col items-center gap-[16px] pt-[8px]">
          <UserRemove size={48} variant="Bold" color="#D54800" />
          <div className="flex flex-col items-center gap-[4px] text-center">
            <span className="text-[28px] font-semibold text-[#202020] leading-tight">
              Take the seat from {holder.full_name}?
            </span>
            <p className="max-w-[320px] text-[14px] text-[#606060] leading-normal">
              They are removed from this course and notified.{" "}
              <span className="font-medium text-[#202020]">
                {selected.full_name}
              </span>{" "}
              takes their place in the {seatName || "review"} seat.
            </p>
          </div>
          <div className="grid w-full min-w-0 grid-cols-1 gap-[12px] pt-[8px] sm:grid-cols-2">
            <Button
              type="button"
              variant="outline"
              className="h-[44px] min-w-0 text-[14px]"
              disabled={isAssigning}
              onClick={() => setIsConfirmingReplace(false)}
            >
              Back
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="h-[44px] min-w-0 text-[14px]"
              isLoading={isAssigning}
              onClick={handleConfirmReplace}
            >
              Replace
            </Button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
      title="Assign reviewer"
      description={
        courseTitle
          ? `Choose who takes the ${seatName || "review"} seat on "${courseTitle}".`
          : `Choose who takes the ${seatName || "review"} seat.`
      }
      className="w-[calc(100vw-24px)] max-w-[520px] sm:max-w-[520px]"
    >
      <div className="flex min-w-0 flex-col gap-[12px] overflow-hidden">
        <label className="flex h-[36px] w-full min-w-0 items-center gap-[10px] rounded-[8px] border border-sd-grey-6 bg-sd-grey-1 px-[12px]">
          <SearchNormal1 size={16} variant="Linear" color="var(--sd-grey-11)" />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search reviewer"
            className="min-w-0 flex-1 bg-transparent text-[14px] font-normal text-sd-grey-12 outline-none placeholder:text-sd-muted-text"
          />
        </label>

        <div className="flex min-w-0 max-h-[min(280px,40dvh)] flex-col gap-[4px] overflow-x-hidden overflow-y-auto pr-[4px]">
          {isLoadingReviewers && reviewers.length === 0 ? (
            <div className="py-6 text-center text-[12px] text-sd-grey-11">
              Loading reviewers…
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-6 text-center text-[12px] text-sd-grey-11">
              {reviewers.length === 0
                ? "Nobody can take this seat right now."
                : "No reviewer matches that search."}
            </div>
          ) : (
            filtered.map(renderRow)
          )}
        </div>

        <div className="grid min-w-0 grid-cols-2 gap-[12px]">
          <Button
            type="button"
            variant="outline"
            className="h-[44px] min-w-0 px-[12px] text-[14px] sm:px-[24px]"
            disabled={isAssigning}
            onClick={() => handleOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="app-primary"
            className="h-[44px] min-w-0 px-[12px] text-[14px] sm:px-[24px]"
            disabled={!selected || !selected.is_available || isLoadingReviewers}
            isLoading={isAssigning}
            onClick={handleAssignClick}
            leftIcon={<UserAdd size={18} variant="Linear" color="#FFFFFF" />}
          >
            Assign
          </Button>
        </div>
      </div>
    </Modal>
  );
};
