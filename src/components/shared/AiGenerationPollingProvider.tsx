"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { Maximize2, CloseCircle } from "iconsax-react";
import { useAppSelector, useAppDispatch } from "@/redux";
import {
  useGetGenerationJobQuery,
  useCancelGenerationMutation,
} from "@/modules/creator/courses/hooks";
import {
  selectActiveJobId,
  selectIsMinimized,
  stopPolling,
  toggleMinimize,
} from "@/redux/slices/aiGenerationPollingSlice";
import {
  GENERATION_JOB_STORAGE_KEY,
  GenerationItem,
} from "@/modules/creator/courses/types/aiGeneration";
import { CreatorRoute } from "@/lib/routes";
import { cn } from "@/lib/utils";

const POLL_INTERVAL_MS = 10_000;

function FloatingStatus({ onExpand }: { onExpand: () => void }) {
  const dispatch = useAppDispatch();
  const activeJobId = useAppSelector(selectActiveJobId);
  const router = useRouter();

  const [cancelGeneration, { isLoading: isCancelling }] =
    useCancelGenerationMutation();

  const { data: jobData } = useGetGenerationJobQuery(activeJobId!, {
    skip: !activeJobId,
    pollingInterval: activeJobId ? POLL_INTERVAL_MS : 0,
  });

  useEffect(() => {
    if (!jobData) return;

    if (jobData.status === "COMPLETED") {
      localStorage.removeItem(GENERATION_JOB_STORAGE_KEY);
      const courseId = jobData.course ?? jobData.result?.course_id;
      if (courseId) {
        router.push(`${CreatorRoute.COURSES_BUILDER}?id=${courseId}`);
      }
      dispatch(stopPolling());
    } else if (jobData.status === "FAILED") {
      dispatch(stopPolling());
    } else if (jobData.status === "CANCELLED") {
      localStorage.removeItem(GENERATION_JOB_STORAGE_KEY);
      dispatch(stopPolling());
      toast.info("Course generation was cancelled");
    }
  }, [jobData, router, dispatch]);

  const handleCancel = async () => {
    if (!activeJobId) return;
    try {
      await cancelGeneration(activeJobId).unwrap();
      localStorage.removeItem(GENERATION_JOB_STORAGE_KEY);
      dispatch(stopPolling());
    } catch {
      toast.error("Failed to cancel generation");
    }
  };

  if (!activeJobId || !jobData) return null;

  const currentItems = jobData.items
    .filter((item) => item.phase === jobData.current_phase)
    .sort((a, b) => a.order - b.order);

  const completedCount = currentItems.filter(
    (item) => item.status === "COMPLETED",
  ).length;

  const phaseLabel =
    jobData.current_phase === "CREATING_CONTENT"
      ? "Creating content..."
      : "Preparing course details...";

  const getItemIcon = (status: GenerationItem["status"]) => {
    switch (status) {
      case "COMPLETED":
        return (
          <div className="size-[8px] rounded-full bg-sd-blue shrink-0" />
        );
      case "RUNNING":
        return (
          <div className="size-[8px] rounded-full bg-[#F59E0B] shrink-0 animate-pulse" />
        );
      case "FAILED":
        return (
          <div className="size-[8px] rounded-full bg-[#FF5025] shrink-0" />
        );
      default:
        return (
          <div className="size-[8px] rounded-full bg-sd-grey-6 shrink-0" />
        );
    }
  };

  return (
    <div className="fixed bottom-[24px] left-[24px] z-50 bg-white border border-sd-grey-3 rounded-[16px] shadow-[0px_8px_32px_rgba(0,0,0,0.12)] animate-in fade-in slide-in-from-bottom-4 w-[340px]">
      <div className="flex items-center gap-[12px] p-[16px]">
        <div className="size-[32px] rounded-full bg-[#EBF3FF] flex items-center justify-center shrink-0">
          <div className="size-[16px] border-2 border-sd-blue border-t-transparent rounded-full animate-spin" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-medium text-[#202020] truncate">
            {phaseLabel}
          </p>
          <p className="text-[12px] text-sd-grey-11">
            {completedCount}/{currentItems.length} steps completed
          </p>
        </div>
        <div className="flex items-center gap-[4px] shrink-0">
          <button
            type="button"
            onClick={onExpand}
            className="size-[32px] flex items-center justify-center rounded-[8px] hover:bg-sd-grey-2 transition-colors cursor-pointer"
            title="Expand"
          >
            <Maximize2 size={16} variant="Linear" color="#606060" />
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={isCancelling || jobData.cancel_requested}
            className="size-[32px] flex items-center justify-center rounded-[8px] hover:bg-[#FFEBEB] transition-colors cursor-pointer disabled:opacity-50"
            title="Stop"
          >
            <CloseCircle
              size={16}
              variant="Linear"
              color={isCancelling ? "#B6B6B6" : "#FF5025"}
            />
          </button>
        </div>
      </div>

      <div className="px-[16px] pb-[12px]">
        <div className="flex flex-col gap-[6px]">
          {currentItems.slice(0, 4).map((item) => (
            <div key={item.id} className="flex items-center gap-[8px]">
              {getItemIcon(item.status)}
              <span
                className={cn(
                  "text-[12px] truncate",
                  item.status === "COMPLETED"
                    ? "text-sd-grey-11 line-through"
                    : item.status === "RUNNING"
                      ? "text-[#202020] font-medium"
                      : "text-sd-grey-11",
                )}
              >
                {item.label}
              </span>
            </div>
          ))}
          {currentItems.length > 4 && (
            <p className="text-[11px] text-sd-grey-11 pl-[16px]">
              +{currentItems.length - 4} more
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export function AiGenerationPollingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const activeJobId = useAppSelector(selectActiveJobId);
  const isMinimized = useAppSelector(selectIsMinimized);
  const pathname = usePathname();
  const router = useRouter();

  const isOnCreatePage = pathname === CreatorRoute.COURSES_AI_CREATE;

  const { data: jobData } = useGetGenerationJobQuery(activeJobId!, {
    skip: !activeJobId,
    pollingInterval: activeJobId ? POLL_INTERVAL_MS : 0,
  });

  useEffect(() => {
    if (!jobData) return;

    if (jobData.status === "COMPLETED") {
      localStorage.removeItem(GENERATION_JOB_STORAGE_KEY);
      const courseId = jobData.course ?? jobData.result?.course_id;
      if (courseId) {
        router.push(`${CreatorRoute.COURSES_BUILDER}?id=${courseId}`);
      }
      dispatch(stopPolling());
    } else if (jobData.status === "FAILED") {
      dispatch(stopPolling());
    } else if (jobData.status === "CANCELLED") {
      localStorage.removeItem(GENERATION_JOB_STORAGE_KEY);
      dispatch(stopPolling());
      toast.info("Course generation was cancelled");
    }
  }, [jobData, router, dispatch]);

  const handleExpand = () => {
    dispatch(toggleMinimize());
    if (!isOnCreatePage) {
      router.push(CreatorRoute.COURSES_AI_CREATE);
    }
  };

  const showFloatingPopup =
    activeJobId && (isMinimized || !isOnCreatePage);

  return (
    <>
      {children}
      {showFloatingPopup && <FloatingStatus onExpand={handleExpand} />}
    </>
  );
}
