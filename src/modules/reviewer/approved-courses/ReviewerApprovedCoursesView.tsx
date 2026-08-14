"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { CloseCircle, Copy, More, Edit } from "iconsax-react";
import { XIcon, Check } from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SideDrawer } from "@/components/shared/SideDrawer";
import { ReviewerPendingFilters } from "@/modules/reviewer/pending/components/ReviewerPendingFilters";
import { cn } from "@/lib/utils";
import { ReviewerRoute } from "@/lib/routes";

interface ApprovedCourse {
  creator: string;
  courseTitle: string;
  courseId: string;
  fullCourseId: string;
  category: string;
  difficultyLevel: string;
  reviewer: string;
  reviewerId: string;
  dateReviewed: string;
  drawerDateReviewed: string;
  reviewNote: string;
}

const approvedCourses: ApprovedCourse[] = Array.from({ length: 15 }, () => ({
  creator: "Osaite Emmanuel",
  courseTitle: "Machine Learning and Design",
  courseId: "SLD-e4...3d5",
  fullCourseId: "Td4fJcvnJ88-04924945",
  category: "Software Engineering",
  difficultyLevel: "Advanced",
  reviewer: "Osaite Emmanuel",
  reviewerId: "Td4fJcvnJ88-04924945",
  dateReviewed: "15 May 2026, 03:40PM",
  drawerDateReviewed: "17 May 2026, 08:45PM",
  reviewNote: "Extend the lesson script to resolve this issue",
}));

const columns = [
  "Creator",
  "Course Title",
  "Course ID",
  "Category",
  "Reviewer",
  "Date Reviewed",
  "Action",
];

const pages = [1, 2, 3, 4, 5];
const tableGridClassName =
  "grid grid-cols-[40px_minmax(150px,1fr)_minmax(230px,1.45fr)_minmax(138px,0.8fr)_minmax(170px,1.1fr)_minmax(155px,1fr)_minmax(205px,1.2fr)_73px]";
const selectionCheckboxClassName =
  "size-[16px] rounded-[4px] border-sd-grey-8 data-checked:border-sd-blue data-checked:bg-sd-blue data-checked:text-sd-grey-1";

const ArrowRight3Icon = ({
  size = 24,
  className,
}: {
  size?: number;
  className?: string;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M14.4302 5.92969L20.5002 11.9997L14.4302 18.0697"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.5 12H20.33"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const TableCheckbox = ({
  checked,
  onCheckedChange,
  label,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
}) => (
  <Checkbox
    checked={checked}
    onCheckedChange={(value) => onCheckedChange(Boolean(value))}
    aria-label={label}
    className={selectionCheckboxClassName}
  />
);

export const ReviewerApprovedCoursesView = () => {
  const [selected, setSelected] = React.useState<Record<number, boolean>>({});
  const [activeCourseIndex, setActiveCourseIndex] = React.useState<number | null>(null);

  const activeCourse = activeCourseIndex !== null ? approvedCourses[activeCourseIndex] : null;

  const allSelected =
    approvedCourses.length > 0 && approvedCourses.every((_, index) => selected[index]);

  const toggleAll = (checked: boolean) => {
    const next: Record<number, boolean> = {};
    approvedCourses.forEach((_, index) => {
      next[index] = checked;
    });
    setSelected(next);
  };

  const copyCourseId = async (courseId: string) => {
    try {
      await navigator.clipboard.writeText(courseId);
      toast.success("Course ID copied");
    } catch {
      toast.error("Could not copy course ID");
    }
  };

  const openCourse = (index: number) => {
    setActiveCourseIndex(index);
  };

  const closeCourse = () => {
    setActiveCourseIndex(null);
  };

  const goToPreviousCourse = () => {
    setActiveCourseIndex((current) => {
      if (current === null) return current;
      return Math.max(0, current - 1);
    });
  };

  const goToNextCourse = () => {
    setActiveCourseIndex((current) => {
      if (current === null) return current;
      return Math.min(approvedCourses.length - 1, current + 1);
    });
  };

  return (
    <>
      <div className="flex w-full flex-col gap-[16px]">
        <ReviewerPendingFilters
          secondaryLabel="Verifier"
          secondaryOptions={["Osaite Emmanuel", "Ada Johnson", "Micheal Chen"]}
        />

        <div className="flex flex-col gap-[24px]">
          <div className="w-full overflow-x-auto">
            <div className="w-full min-w-[1163px]">
              <div className={cn(tableGridClassName, "items-center")}>
                <div className="flex h-[40px] w-[40px] items-center justify-center rounded-l-[4px] border-b border-sd-grey-3 bg-[#F0F0F0CC]">
                  <TableCheckbox
                    checked={allSelected}
                    onCheckedChange={toggleAll}
                    label="Select all approved courses"
                  />
                </div>
                {columns.map((column, index) => (
                  <div
                    key={column}
                    className={cn(
                      "flex h-[40px] items-center border-b border-sd-grey-3 bg-[#F0F0F0CC] p-[10px]",
                      index === columns.length - 1 && "rounded-r-[4px]",
                    )}
                  >
                    <span className="truncate text-[14px] font-normal leading-[20px] text-sd-grey-12">
                      {column}
                    </span>
                  </div>
                ))}
              </div>

              <div>
                {approvedCourses.map((course, index) => (
                  <div
                    key={`${course.courseId}-${index}`}
                    className={cn(
                      tableGridClassName,
                      "items-center transition-colors hover:bg-sd-grey-2",
                    )}
                    role="button"
                    tabIndex={0}
                    onClick={() => openCourse(index)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        openCourse(index);
                      }
                    }}
                  >
                    <div className="flex h-[44px] w-[40px] items-center justify-center border-b border-sd-grey-3">
                      <div onClick={(event) => event.stopPropagation()}>
                        <TableCheckbox
                          checked={Boolean(selected[index])}
                          onCheckedChange={(checked) =>
                            setSelected((current) => ({ ...current, [index]: checked }))
                          }
                          label={`Select approved course row ${index + 1}`}
                        />
                      </div>
                    </div>
                    <TableCell>{course.creator}</TableCell>
                    <TableCell>{course.courseTitle}</TableCell>
                    <TableCell>
                      <div className="flex min-w-0 items-center gap-[10px]">
                        <span className="truncate">{course.courseId}</span>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            void copyCourseId(course.courseId);
                          }}
                          className="flex size-[14px] shrink-0 items-center justify-center text-sd-grey-11 transition-colors hover:text-sd-grey-12"
                          aria-label={`Copy ${course.courseId}`}
                        >
                          <Copy size={14} variant="Linear" color="currentColor" />
                        </button>
                      </div>
                    </TableCell>
                    <TableCell>{course.category}</TableCell>
                    <TableCell>{course.reviewer}</TableCell>
                    <TableCell allowWrap>{course.dateReviewed}</TableCell>
                    <div className="flex h-[44px] items-center justify-center border-b border-sd-grey-3 p-[10px]">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          openCourse(index);
                        }}
                        className="flex size-[24px] items-center justify-center text-sd-grey-12"
                        aria-label={`Open actions for ${course.courseTitle}`}
                      >
                        <More size={24} variant="Linear" color="currentColor" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex min-h-[40px] flex-col gap-[16px] md:flex-row md:items-center md:justify-between">
            <div className="flex h-[40px] w-fit items-center justify-center rounded-full border border-sd-grey-4 px-[20px] py-[10px] text-[14px] font-normal leading-[20px] text-sd-grey-11">
              Showing 15 entries
            </div>

            <div className="flex items-center gap-[15px]">
              <button
                type="button"
                className="flex h-[32px] items-center justify-center p-[10px] text-[14px] font-normal leading-[20px] text-sd-grey-11"
              >
                Previous
              </button>
              <div className="flex items-center gap-[7px]">
                {pages.map((page) => {
                  const active = page === 3;
                  return (
                    <button
                      key={page}
                      type="button"
                      className={cn(
                        "flex size-[32px] items-center justify-center rounded-[6px] border px-[8px] py-[2px] text-center text-[14px] font-normal leading-[20px]",
                        active
                          ? "border-sd-blue bg-sd-blue text-sd-grey-1"
                          : "border-sd-grey-6 bg-sd-grey-1 text-sd-grey-11",
                      )}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                className="flex h-[32px] items-center justify-center p-[10px] text-[14px] font-normal leading-[20px] text-sd-grey-12"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      <ApprovedCourseInfoDrawer
        course={activeCourse}
        isOpen={activeCourse !== null}
        onOpenChange={(open) => {
          if (!open) closeCourse();
        }}
        onPrevious={goToPreviousCourse}
        onNext={goToNextCourse}
        canPrevious={activeCourseIndex !== null && activeCourseIndex > 0}
        canNext={activeCourseIndex !== null && activeCourseIndex < approvedCourses.length - 1}
      />
    </>
  );
};

const DrawerDetailRow = ({
  label,
  value,
  canCopy = false,
  onCopy,
}: {
  label: string;
  value: string;
  canCopy?: boolean;
  onCopy?: () => void;
}) => (
  <div className="flex items-start justify-between gap-[16px]">
    <span className="shrink-0 text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-sd-grey-11">
      {label}
    </span>
    <div className="flex min-w-0 items-center gap-[8px] text-right">
      <span className="truncate text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-sd-grey-12">
        {value}
      </span>
      {canCopy && (
        <button
          type="button"
          onClick={onCopy}
          className="flex size-[20px] shrink-0 items-center justify-center text-sd-grey-11 transition-colors hover:text-sd-grey-12"
          aria-label={`Copy ${label}`}
        >
          <Copy size={20} variant="Linear" color="currentColor" />
        </button>
      )}
    </div>
  </div>
);

const ApprovedCourseInfoDrawer = ({
  course,
  isOpen,
  onOpenChange,
  onPrevious,
  onNext,
  canPrevious,
  canNext,
}: {
  course: ApprovedCourse | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onPrevious: () => void;
  onNext: () => void;
  canPrevious: boolean;
  canNext: boolean;
}) => {
  const router = useRouter();
  const [publishModalOpen, setPublishModalOpen] = React.useState(false);
  const [reviewPricesModalOpen, setReviewPricesModalOpen] = React.useState(false);
  const [reviewAndPublishModalOpen, setReviewAndPublishModalOpen] = React.useState(false);
  const [successModalOpen, setSuccessModalOpen] = React.useState(false);
  const [selectedPublishChannels, setSelectedPublishChannels] = React.useState<Record<string, boolean>>({});

  if (!course) return null;

  const copyText = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Copied");
    } catch {
      toast.error("Could not copy");
    }
  };

  return (
    <SideDrawer
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      side="right"
      showCloseButton={false}
      className="!w-full !max-w-full shadow-[0px_8px_16px_0px_rgba(0,0,0,0.1)] md:!w-[420px] md:!max-w-[420px]"
      headerClassName="border-sd-grey-6 px-[20px]"
      contentClassName="px-[20px] pb-[10px] pt-[24px]"
      title={
        <div className="flex w-full items-center justify-between gap-[16px]">
          <span className="truncate text-[20px] font-semibold leading-[28px] text-sd-grey-12">
            Course Information
          </span>

          <div className="flex items-center gap-[12px]">
            <div className="flex h-[32px] items-center rounded-[8px] border border-sd-grey-3 bg-sd-grey-1">
              <button
                type="button"
                onClick={onPrevious}
                disabled={!canPrevious}
                className={cn(
                  "flex size-[31px] items-center justify-center text-sd-grey-11",
                  !canPrevious && "cursor-not-allowed opacity-40",
                )}
                aria-label="Previous approved course"
              >
                <ArrowRight3Icon size={20} className="rotate-180" />
              </button>
              <div className="h-[16px] w-px bg-sd-grey-3" />
              <button
                type="button"
                onClick={onNext}
                disabled={!canNext}
                className={cn(
                  "flex size-[31px] items-center justify-center text-sd-grey-11",
                  !canNext && "cursor-not-allowed opacity-40",
                )}
                aria-label="Next approved course"
              >
                <ArrowRight3Icon size={20} />
              </button>
            </div>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="flex size-[32px] items-center justify-center rounded-[8px] border border-sd-grey-3 bg-sd-grey-1 text-sd-grey-11 transition-colors hover:bg-sd-grey-2"
              aria-label="Close course information"
            >
              <CloseCircle size={20} variant="Linear" color="currentColor" />
            </button>
          </div>
        </div>
      }
    >
      <div className="flex min-h-full flex-col justify-between gap-[40px]">
        <div className="flex flex-col gap-[32px]">
          <button
            type="button"
            onClick={() =>
              router.push(`${ReviewerRoute.COURSE_OVERVIEW}/${encodeURIComponent(course.courseId)}`)
            }
            className="flex h-[44px] w-fit items-center justify-center gap-[8px] rounded-[8px] border border-sd-grey-6 bg-sd-grey-1 px-[24px] py-[12px] text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-sd-grey-12 transition-colors hover:bg-sd-grey-2"
          >
            <span>Preview course</span>
            <ArrowRight3Icon size={24} />
          </button>

          <section className="flex flex-col gap-[16px]">
            <h2 className="text-[14px] font-medium leading-[20px] tracking-[-0.28px] text-sd-grey-12">
              REVIEW INFORMATION
            </h2>
            <DrawerDetailRow label="Reviewer" value={course.reviewer} />
            <DrawerDetailRow
              label="Reviewer ID"
              value={course.reviewerId}
              canCopy
              onCopy={() => void copyText(course.reviewerId)}
            />
            <DrawerDetailRow label="Date reviewed" value={course.drawerDateReviewed} />
          </section>

          <div className="h-px w-full bg-sd-grey-3" />

          <section className="flex flex-col gap-[16px]">
            <h2 className="text-[14px] font-medium leading-[20px] tracking-[-0.28px] text-sd-grey-12">
              COURSE INFORMATION
            </h2>
            <DrawerDetailRow label="Course Title" value={course.courseTitle} />
            <DrawerDetailRow label="Category" value={course.category} />
            <DrawerDetailRow label="Difficulty Level" value={course.difficultyLevel} />
            <DrawerDetailRow
              label="Course ID"
              value={course.fullCourseId}
              canCopy
              onCopy={() => void copyText(course.fullCourseId)}
            />
          </section>

          <div className="h-px w-full bg-sd-grey-3" />

          <section className="flex flex-col gap-[16px]">
            <h2 className="text-[14px] font-medium leading-[20px] tracking-[-0.28px] text-sd-grey-12">
              REVIEWER&apos;S NOTE
            </h2>
            <div className="min-h-[78px] rounded-[8px] border border-sd-grey-6 bg-sd-grey-1 p-[12px] text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-sd-grey-11">
              {course.reviewNote}
            </div>
          </section>
        </div>

        <button
          type="button"
          onClick={() => setPublishModalOpen(true)}
          className="flex h-[44px] w-full items-center justify-center gap-[8px] rounded-[8px] border border-sd-blue bg-sd-grey-1 px-[24px] py-[12px] text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-sd-blue transition-colors hover:bg-sd-blue-hover"
        >
          <span>Review Prices</span>
          <ArrowRight3Icon size={24} />
        </button>
      </div>

      <PublishChannelModal
        isOpen={publishModalOpen}
        onOpenChange={setPublishModalOpen}
        onContinue={(channels) => {
          setSelectedPublishChannels(channels);
          setPublishModalOpen(false);
          setReviewPricesModalOpen(true);
        }}
      />
      <ReviewPricesModal
        isOpen={reviewPricesModalOpen}
        onOpenChange={setReviewPricesModalOpen}
        selectedChannels={selectedPublishChannels}
        onContinue={() => {
          setReviewPricesModalOpen(false);
          setReviewAndPublishModalOpen(true);
        }}
      />
      <ReviewAndPublishModal
        isOpen={reviewAndPublishModalOpen}
        onOpenChange={setReviewAndPublishModalOpen}
        selectedChannels={selectedPublishChannels}
        onEdit={() => {
          setReviewAndPublishModalOpen(false);
          setReviewPricesModalOpen(true);
        }}
        onPublish={() => {
          setReviewAndPublishModalOpen(false);
          setSuccessModalOpen(true);
        }}
      />
      <PublishSuccessModal
        isOpen={successModalOpen}
        onOpenChange={setSuccessModalOpen}
      />
    </SideDrawer>
  );
};

const publishChannels = [
  {
    name: "SoluDesk",
    description: "Publish to soludesk learning hub",
  },
  {
    name: "Udemy",
    description: "Publish to Udemy store",
  },
  {
    name: "Coursera",
    description: "Publish to Coursera store",
  },
];

const PublishChannelModal = ({
  isOpen,
  onOpenChange,
  onContinue,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onContinue: (channels: Record<string, boolean>) => void;
}) => {
  const [selectedChannels, setSelectedChannels] = React.useState<Record<string, boolean>>({});

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[calc(100vw-32px)] gap-0 rounded-[8px] border-none bg-sd-grey-1 p-[16px] shadow-[0px_8px_16px_0px_rgba(0,0,0,0.1)] sm:max-w-[600px]"
      >
        <div className="flex items-start justify-between gap-[20px]">
          <DialogHeader className="gap-[8px]">
            <DialogTitle className="text-[20px] font-semibold leading-[28px] text-sd-grey-12">
              Publish channel
            </DialogTitle>
            <DialogDescription className="text-[14px] font-normal leading-[20px] text-[#888888]">
              Kindly review the prices for this course before publishing
            </DialogDescription>
          </DialogHeader>

          <DialogClose asChild>
            <button
              type="button"
              className="flex size-[32px] shrink-0 items-center justify-center rounded-[8px] border border-sd-grey-3 text-sd-grey-9 transition-colors hover:bg-sd-grey-2"
              aria-label="Close publish channel"
            >
              <XIcon size={20} />
            </button>
          </DialogClose>
        </div>

        <div className="mt-[48px] flex flex-col gap-[20px] pl-[16px]">
          {publishChannels.map((channel) => (
            <label key={channel.name} className="flex w-fit cursor-pointer items-start gap-[16px]">
              <Checkbox
                checked={Boolean(selectedChannels[channel.name])}
                onCheckedChange={(checked) =>
                  setSelectedChannels((current) => ({
                    ...current,
                    [channel.name]: Boolean(checked),
                  }))
                }
                className="mt-[4px] size-[16px] rounded-full border-sd-grey-8 data-checked:border-sd-blue data-checked:bg-sd-blue data-checked:text-sd-grey-1"
                aria-label={`Select ${channel.name}`}
              />
              <span className="flex flex-col gap-[8px]">
                <span className="text-[20px] font-semibold leading-[24px] text-sd-grey-12">
                  {channel.name}
                </span>
                <span className="text-[16px] font-normal leading-[20px] text-sd-reviewer-muted">
                  {channel.description}
                </span>
              </span>
            </label>
          ))}
        </div>

        <div className="mt-[40px] flex items-center gap-[12px]">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="flex h-[44px] w-[132px] items-center justify-center rounded-[8px] border border-sd-grey-6 bg-sd-grey-1 text-[14px] font-normal leading-[20px] text-sd-grey-12 transition-colors hover:bg-sd-grey-2"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onContinue(selectedChannels)}
            className="flex h-[44px] w-[133px] items-center justify-center rounded-[8px] bg-sd-blue text-[14px] font-normal leading-[20px] text-sd-grey-1 transition-colors hover:bg-sd-blue-hover"
          >
            Continue
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const TableCell = ({
  children,
  className,
  allowWrap = false,
}: {
  children: React.ReactNode;
  className?: string;
  allowWrap?: boolean;
}) => (
  <div className={cn("flex h-[44px] items-center border-b border-sd-grey-3 p-[10px]", className)}>
    <span
      className={cn(
        "min-w-0 text-[14px] font-normal leading-[20px] text-sd-grey-11",
        allowWrap ? "whitespace-nowrap" : "truncate",
      )}
    >
      {children}
    </span>
  </div>
);

const ReviewPricesModal = ({
  isOpen,
  onOpenChange,
  selectedChannels,
  onContinue,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedChannels: Record<string, boolean>;
  onContinue: () => void;
}) => {
  const activeChannelNames = Object.entries(selectedChannels)
    .filter(([_, isSelected]) => isSelected)
    .map(([name]) => name);

  const [activeTab, setActiveTab] = React.useState<string>("");

  React.useEffect(() => {
    if (isOpen && activeChannelNames.length > 0 && !activeChannelNames.includes(activeTab)) {
      setActiveTab(activeChannelNames[0]);
    }
  }, [isOpen, activeChannelNames, activeTab]);

  const [pricingModel, setPricingModel] = React.useState("One-time");

  const channelData = {
    SoluDesk: {
      channelTitle: "Channel A (SoluDesks LMS)",
      approvalRate: "Approval Rate: Published within 60 seconds",
      inputDefault: "$149.00",
      suggestionText: "MIE Suggestion: $140",
      showInfoBox: true,
      feesTitle: "COURSE FEES",
      fees: [
        { label: "Learner fee", value: "$149.00" },
        { label: "Creator payout (Fixed)", value: "$150.00" },
        { label: "Platform revenue per enrolment", value: "$149.00" },
        { label: "Model", value: "One-time purchase" }
      ],
      comparableTitle: "RELATED COURSES",
      relatedCourses: [
        { name: "Modern computing language", level: "Beginner", price: "$150" },
        { name: "Introduction to computing", level: "Advanced", price: "$190" },
        { name: "Computer Essentials", level: "Intermediate", price: "$160" }
      ]
    },
    Coursera: {
      channelTitle: "Channel C (Coursera Marketplace)",
      approvalRate: "Approval Rate: Published within 10 - 15 minuites",
      inputDefault: "$0.00",
      suggestionText: "MIE Suggestion: $100",
      showInfoBox: false,
      feesTitle: "COURSE FEES ON COURSERA",
      fees: [
        { label: "Course fee", value: "32% of net revenue" },
        { label: "Promotional pricing", value: "$150.00" },
        { label: "Platform revenue per enrolment", value: "$149.00" },
        { label: "Model", value: "One-time purchase" }
      ],
      comparableTitle: "COMPARABLE COURSES ON COURSERA",
      relatedCourses: [
        { name: "Modern computing language", level: "Beginner", price: "$100" },
        { name: "Introduction to computing", level: "Advanced", price: "$190" },
        { name: "Computer Essentials", level: "Intermediate", price: "$160" }
      ]
    },
    Udemy: {
      channelTitle: "Channel B (Udemy Marketplace)",
      approvalRate: "Approval Rate: Published within 10 - 15 minuites",
      inputDefault: "$0.00",
      suggestionText: "MIE Suggestion: $100",
      showInfoBox: false,
      feesTitle: "COURSE FEES ON UDEMY",
      fees: [
        { label: "Course fee", value: "32% of net revenue" },
        { label: "Promotional pricing", value: "$150.00" },
        { label: "Platform revenue per enrolment", value: "$149.00" },
        { label: "Model", value: "One-time purchase" }
      ],
      comparableTitle: "COMPARABLE COURSES ON UDEMY",
      relatedCourses: [
        { name: "Modern computing language", level: "Beginner", price: "$100" },
        { name: "Introduction to computing", level: "Advanced", price: "$190" },
        { name: "Computer Essentials", level: "Intermediate", price: "$160" }
      ]
    }
  };

  const currentData = channelData[activeTab as keyof typeof channelData] || channelData.Coursera;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[90vh] w-[calc(100vw-32px)] flex-col gap-0 rounded-[8px] border-none bg-sd-grey-1 p-0 shadow-[0px_8px_16px_0px_rgba(0,0,0,0.1)] sm:max-w-[600px]"
      >
        <div className="flex shrink-0 items-start justify-between gap-[20px] p-[24px] pb-[16px]">
          <DialogHeader className="gap-[8px]">
            <DialogTitle className="text-[20px] font-semibold leading-[28px] text-sd-grey-12">
              Review
            </DialogTitle>
            <DialogDescription className="text-[14px] font-normal leading-[20px] text-[#888888]">
              Kindly review the prices for this course before publishing
            </DialogDescription>
          </DialogHeader>

          <DialogClose asChild>
            <button
              type="button"
              className="flex size-[32px] shrink-0 items-center justify-center rounded-[8px] border border-[#D9D9D9] text-[#888888] transition-colors hover:bg-sd-grey-2"
              aria-label="Close review prices"
            >
              <XIcon size={20} />
            </button>
          </DialogClose>
        </div>

        {/* Tabs */}
        <div className="flex shrink-0 items-center gap-[24px] border-b border-[#D9D9D9] px-[24px]">
          {activeChannelNames.length === 0 ? (
            <span className="pb-[12px] pt-[8px] text-[14px] font-medium leading-[20px] text-sd-reviewer-muted">
              No channels selected
            </span>
          ) : (
            activeChannelNames.map((name) => {
              const isActive = activeTab === name;
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => setActiveTab(name)}
                  className={cn(
                    "border-b-[2px] pb-[12px] pt-[8px] text-[14px] font-medium leading-[20px] transition-colors",
                    isActive
                      ? "border-sd-grey-12 text-sd-grey-12"
                      : "border-transparent text-sd-reviewer-muted hover:text-sd-grey-11",
                  )}
                >
                  {name}
                </button>
              );
            })
          )}
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto px-[24px] py-[24px]">
          {/* Header context */}
          <div className="flex flex-col gap-[8px]">
            <span className="text-[14px] font-medium leading-[20px] text-sd-grey-12">
              {currentData.channelTitle}
            </span>
            <span className="text-[12px] font-normal leading-[16px] text-sd-reviewer-muted">
              {currentData.approvalRate}
            </span>
          </div>

          {/* Form */}
          <div className="mt-[24px] flex flex-col">
            <label className="mb-[8px] text-[14px] font-normal leading-[20px] text-sd-grey-12">
              Learner price
            </label>
            <input
              type="text"
              key={activeTab} // re-mount to reset default value
              defaultValue={currentData.inputDefault}
              className="flex h-[44px] w-full rounded-[8px] border border-[#D9D9D9] bg-white px-[12px] text-[14px] font-normal leading-[20px] text-sd-grey-12 outline-none focus:border-sd-blue"
            />
            <div className="mt-[12px] inline-flex w-fit items-center rounded-[4px] bg-[#EBF3FF] px-[8px] py-[4px] text-[12px] font-medium leading-[16px] text-sd-blue">
              {currentData.suggestionText}
            </div>
          </div>

          <div className="mt-[24px] flex flex-wrap gap-[12px]">
            {["One-time", "Subscription", "Promotional", "B2B only"].map((model) => {
              const isActive = pricingModel === model;
              return (
                <button
                  key={model}
                  type="button"
                  onClick={() => setPricingModel(model)}
                  className={cn(
                    "flex h-[36px] items-center justify-center rounded-[8px] px-[16px] text-[14px] font-normal leading-[20px] transition-colors",
                    isActive
                      ? "bg-sd-blue text-white"
                      : "border border-[#D9D9D9] bg-white text-sd-grey-11 hover:bg-sd-grey-2",
                  )}
                >
                  {model}
                </button>
              );
            })}
          </div>

          {currentData.showInfoBox && (
            <div className="mt-[24px] flex items-start gap-[12px] rounded-[8px] border border-[#D1E0FF] bg-[#F0F5FF] p-[16px]">
              <div className="flex size-[20px] shrink-0 items-center justify-center rounded-full bg-sd-blue text-white">
                <span className="text-[12px] font-bold">!</span>
              </div>
              <p className="text-[12px] font-normal leading-[16px] text-[#4B5563]">
                <span className="font-bold text-sd-grey-12">$149</span> is the MIE-suggested
                price based on competitor analysis across Udemy and Coursera. Advanced
                leadership courses in this price range average 890 enrollments on the SoluDesks
                LMS. Pricing above $159 is associated with a measurable drop in conversion rate
                for this category.
              </p>
            </div>
          )}

          {/* COURSE FEES */}
          <div className="mt-[32px]">
            <h3 className="mb-[16px] text-[12px] font-normal uppercase leading-[16px] text-sd-grey-12">
              {currentData.feesTitle}
            </h3>
            <div className="flex flex-col gap-[16px] text-[14px] font-normal leading-[20px]">
              {currentData.fees.map((fee, idx) => (
                <div key={idx} className="flex justify-between gap-[16px]">
                  <span className="text-[#888888]">{fee.label}</span>
                  <span className="text-right text-sd-grey-12">{fee.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RELATED COURSES */}
          <div className="mt-[32px] border-t border-[#D9D9D9] pt-[32px]">
            <h3 className="mb-[16px] text-[12px] font-normal uppercase leading-[16px] text-sd-grey-12">
              {currentData.comparableTitle}
            </h3>
            <div className="flex flex-col gap-[16px] text-[14px] font-normal leading-[20px]">
              {currentData.relatedCourses.map((course, idx) => (
                <div key={idx} className="grid grid-cols-[1fr_120px_auto] items-center gap-[24px]">
                  <span className="min-w-0 truncate text-[#888888]">
                    {course.name}
                  </span>
                  <span className="text-[#888888]">{course.level}</span>
                  <span className="w-[60px] text-right text-sd-grey-12">{course.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex shrink-0 items-center gap-[12px] p-[24px] pt-[0px]">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="flex h-[44px] w-[132px] items-center justify-center rounded-[8px] border border-[#D9D9D9] bg-white text-[14px] font-normal leading-[20px] text-sd-grey-12 transition-colors hover:bg-sd-grey-2"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onContinue}
            className="flex h-[44px] w-[132px] items-center justify-center rounded-[8px] bg-sd-blue text-[14px] font-medium leading-[20px] text-white transition-colors hover:bg-sd-blue-hover"
          >
            Continue
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ReviewAndPublishModal = ({
  isOpen,
  onOpenChange,
  selectedChannels,
  onEdit,
  onPublish,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedChannels: Record<string, boolean>;
  onEdit: () => void;
  onPublish: () => void;
}) => {
  const activeChannelNames = Object.entries(selectedChannels)
    .filter(([_, isSelected]) => isSelected)
    .map(([name]) => name);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[calc(100vw-32px)] gap-0 rounded-[8px] border-none bg-sd-grey-1 p-[24px] pb-[24px] shadow-[0px_8px_16px_0px_rgba(0,0,0,0.1)] sm:max-w-[480px]"
      >
        <div className="flex items-start justify-between gap-[20px]">
          <DialogHeader className="gap-[8px]">
            <DialogTitle className="text-[20px] font-semibold leading-[28px] text-sd-grey-12">
              Review and publish
            </DialogTitle>
            <DialogDescription className="text-[14px] font-normal leading-[20px] text-[#888888]">
              Kindly review the prices for this course before publishing
            </DialogDescription>
          </DialogHeader>

          <DialogClose asChild>
            <button
              type="button"
              className="flex size-[32px] shrink-0 items-center justify-center rounded-[8px] border border-[#D9D9D9] text-[#888888] transition-colors hover:bg-sd-grey-2"
              aria-label="Close review and publish"
            >
              <XIcon size={20} />
            </button>
          </DialogClose>
        </div>

        <div className="mt-[32px] flex flex-col">
          <h3 className="mb-[16px] text-[14px] font-semibold leading-[20px] text-sd-grey-12">
            Overview
          </h3>
          <div className="flex flex-col">
            {activeChannelNames.length === 0 ? (
              <span className="text-[14px] text-sd-reviewer-muted">No channels selected</span>
            ) : (
              activeChannelNames.map((channel) => {
                // Hardcoded prices for demonstration matching the design
                const price = channel === 'SoluDesk' ? '$100' : channel === 'Udemy' ? '$190' : '$160';
                
                return (
                  <div key={channel} className="flex items-center justify-between border-b border-[#F0F0F0] py-[16px] last:border-b-0">
                    <span className="text-[14px] font-normal text-[#4B5563]">{channel}</span>
                    <div className="flex items-center gap-[40px]">
                      <span className="text-[14px] font-normal text-sd-grey-12">{price}</span>
                      <button type="button" onClick={onEdit} className="flex items-center gap-[8px] text-[14px] font-normal text-[#4B5563] hover:text-sd-blue">
                        <span>Edit</span>
                        <Edit size={16} variant="Linear" color="var(--sd-blue)" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="mt-[32px] flex items-center gap-[12px]">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="flex h-[44px] w-[116px] items-center justify-center rounded-[8px] border border-[#D9D9D9] bg-white text-[14px] font-normal leading-[20px] text-sd-grey-12 transition-colors hover:bg-sd-grey-2"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onPublish}
            className="flex h-[44px] w-[132px] items-center justify-center rounded-[8px] bg-sd-blue text-[14px] font-medium leading-[20px] text-white transition-colors hover:bg-sd-blue-hover"
          >
            Continue
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const PublishSuccessModal = ({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[calc(100vw-32px)] gap-0 rounded-[12px] border-none bg-white p-[24px] shadow-[0px_8px_16px_0px_rgba(0,0,0,0.1)] sm:max-w-[400px]"
      >
        <div className="flex flex-col">
          <div className="flex size-[64px] items-center justify-center rounded-full bg-[#EAFBF3] text-[#16A34A]">
            <Check size={32} strokeWidth={3} />
          </div>
          <h2 className="mt-[20px] text-[20px] font-bold leading-[28px] text-sd-grey-12">
            Published!
          </h2>
          <p className="mt-[12px] text-[14px] font-normal leading-[20px] text-[#4B5563]">
            You have successfully approved this course for distribution.
          </p>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="mt-[24px] flex h-[44px] w-full items-center justify-center rounded-[8px] bg-sd-blue text-[14px] font-medium leading-[20px] text-white transition-colors hover:opacity-90"
          >
            Dismiss
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewerApprovedCoursesView;
