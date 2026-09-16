"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Magicpen } from "iconsax-react";
import { Button } from "@/components/shared/Button";
import { FormInput } from "@/components/form/FormInput";
import { FormTextarea } from "@/components/form/FormTextarea";
import { FormCheckbox } from "@/components/form/FormCheckbox";
import { FormSelect } from "@/components/form/FormSelect";
import { useAppSelector, useAppDispatch } from "@/redux";
import {
  selectActiveJobId,
  selectIsMinimized,
  startPolling,
  stopPolling,
  toggleMinimize,
} from "@/redux/slices/aiGenerationPollingSlice";
import {
  useCreateGenerationMutation,
  useGetGenerationJobQuery,
  useCancelGenerationMutation,
  useGetCategoriesPickerQuery,
  useGetTopicsQuery,
} from "./hooks";
import {
  aiGenerationSchema,
  AiGenerationFormData,
} from "./utils/aiGenerationValidation";
import {
  GenerationJob,
  GenerationItem,
  GENERATION_JOB_STORAGE_KEY,
} from "./types/aiGeneration";
import { TopicStatus } from "./types/topic";
import { normalizeApiError } from "@/lib/api/errors";
import { cn } from "@/lib/utils";
import {
  TickCircle,
  CloseCircle,
  InfoCircle,
} from "iconsax-react";

interface GenerationProgressProps {
  job: GenerationJob;
  onCancel: () => void;
  isCancelling: boolean;
  onMinimize: () => void;
}

function GenerationProgress({
  job,
  onCancel,
  isCancelling,
  onMinimize,
}: GenerationProgressProps) {
  const currentItems = job.items
    .filter((item) => item.phase === job.current_phase)
    .sort((a, b) => a.order - b.order);

  const getItemIcon = (status: GenerationItem["status"]) => {
    switch (status) {
      case "COMPLETED":
        return <TickCircle size={20} variant="Bold" color="#0063EF" />;
      case "RUNNING":
        return (
          <div className="size-[20px] border-2 border-sd-blue border-t-transparent rounded-full animate-spin" />
        );
      case "FAILED":
        return <CloseCircle size={20} variant="Bold" color="#FF5025" />;
      case "CANCELLED":
        return <InfoCircle size={20} variant="Bold" color="#B6B6B6" />;
      default:
        return <InfoCircle size={20} variant="Outline" color="#B6B6B6" />;
    }
  };

  const getItemLabelClass = (status: GenerationItem["status"]) => {
    switch (status) {
      case "COMPLETED":
        return "text-sd-blue font-medium";
      case "RUNNING":
        return "text-[#202020] font-medium";
      case "FAILED":
        return "text-[#FF5025] font-medium";
      case "CANCELLED":
        return "text-sd-grey-11";
      default:
        return "text-sd-grey-11";
    }
  };

  const phaseLabel =
    job.current_phase === "CREATING_CONTENT"
      ? "Creating content..."
      : "Preparing course details...";

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] animate-in fade-in duration-500">
      <div className="relative size-[160px] flex items-center justify-center mb-[32px]">
        <div className="absolute inset-0 border-[4px] border-sd-grey-3 rounded-full" />
        <div className="absolute inset-0 border-[4px] border-sd-blue rounded-full border-t-transparent animate-spin" />
        <div className="size-[80px] bg-[#EBF3FF] rounded-full flex items-center justify-center animate-pulse">
          <Magicpen size={40} variant="Bulk" color="#0063EF" />
        </div>
      </div>

      <h1 className="text-[24px] font-bold text-[#202020] font-quicksand mb-[8px]">
        {phaseLabel}
      </h1>
      <p className="text-[14px] text-sd-grey-11 mb-[40px]">
        Please wait while we generate your course
      </p>

      <div className="w-full max-w-[400px] flex flex-col gap-[16px]">
        {currentItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-[12px] px-[16px] py-[12px] rounded-[12px] bg-white border border-sd-grey-3"
          >
            {getItemIcon(item.status)}
            <span className={cn("text-[14px]", getItemLabelClass(item.status))}>
              {item.label}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-[40px] flex items-center gap-[12px]">
        <Button
          type="button"
          variant="app-outline"
          className="h-[44px] px-[24px] text-sd-grey-11 border-sd-grey-6 hover:bg-sd-grey-2"
          onClick={onMinimize}
        >
          <svg className="mr-[8px]" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 11L1 11L1 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M11 5L15 5L15 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15 11L11 11L11 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M1 5L5 5L5 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Minimize
        </Button>
        <Button
          type="button"
          variant="app-outline"
          className="h-[44px] px-[24px] text-[#FF5025] border-[#FF5025] hover:bg-[#FF5025]/5"
          onClick={onCancel}
          disabled={isCancelling || job.cancel_requested}
          isLoading={isCancelling}
        >
          {job.cancel_requested ? "Cancelling..." : "Stop this process and go back"}
        </Button>
      </div>
    </div>
  );
}

interface GenerationErrorProps {
  job: GenerationJob;
  onRetry: () => void;
  onBack: () => void;
}

function GenerationError({ job, onRetry, onBack }: GenerationErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] animate-in fade-in duration-500">
      <div className="size-[80px] rounded-full bg-[#FFF0ED] flex items-center justify-center mb-[24px]">
        <CloseCircle size={40} variant="Bold" color="#FF5025" />
      </div>

      <h1 className="text-[24px] font-bold text-[#202020] font-quicksand mb-[8px]">
        Generation failed
      </h1>
      <p className="text-[14px] text-sd-grey-11 mb-[32px] text-center max-w-[400px]">
        {job.error_message || "An error occurred while generating your course."}
      </p>

      <div className="flex items-center gap-[16px]">
        <Button
          type="button"
          variant="app-outline"
          className="h-[44px] px-[24px] text-sd-blue border-sd-blue"
          onClick={onBack}
        >
          Go back
        </Button>
        <Button
          type="button"
          variant="app-primary"
          className="h-[44px] px-[24px]"
          onClick={onRetry}
        >
          Try again
        </Button>
      </div>
    </div>
  );
}

export default function AiCourseGenerationView() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const activeJobId = useAppSelector(selectActiveJobId);
  const isMinimized = useAppSelector(selectIsMinimized);
  const [idempotencyKey, setIdempotencyKey] = useState<string>("");
  const [viewMode, setViewMode] = useState<"form" | "error">("form");

  const [createGeneration, { isLoading: isCreating }] =
    useCreateGenerationMutation();
  const [cancelGeneration, { isLoading: isCancelling }] =
    useCancelGenerationMutation();

  const { data: categories } = useGetCategoriesPickerQuery();

  const { data: topicsResponse } = useGetTopicsQuery(
    { status: TopicStatus.ACTIVE },
  );
  const allTopics = topicsResponse?.data?.results || [];

  const { data: jobData } = useGetGenerationJobQuery(activeJobId!, {
    skip: !activeJobId,
    pollingInterval: activeJobId ? 10_000 : 0,
  });

  const methods = useForm<AiGenerationFormData>({
    resolver: zodResolver(aiGenerationSchema),
    mode: "onBlur",
    defaultValues: {
      title: "",
      description: "",
      category: "",
      topic: "",
      terms_accepted: false,
    },
  });

  const {
    handleSubmit,
    watch,
    setValue,
  } = methods;

  const selectedCategory = watch("category");
  const selectedTopic = watch("topic");

  const filteredTopics = selectedCategory
    ? allTopics.filter((t) => t.category.id === selectedCategory)
    : allTopics;

  useEffect(() => {
    const storedJobId = localStorage.getItem(GENERATION_JOB_STORAGE_KEY);
    if (storedJobId) {
      dispatch(startPolling(storedJobId));
    }
  }, [dispatch]);

  useEffect(() => {
    if (!jobData) return;

    if (jobData.status === "FAILED") {
      setViewMode("error");
      dispatch(stopPolling());
    }
  }, [jobData, dispatch]);

  const generateIdempotencyKey = useCallback(() => {
    const key = `ai-course-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    setIdempotencyKey(key);
    return key;
  }, []);

  const onSubmit = async (data: AiGenerationFormData) => {
    try {
      const key = idempotencyKey || generateIdempotencyKey();
      const result = await createGeneration({
        title: data.title,
        description: data.description,
        category: data.category,
        topic: data.topic || null,
        terms_accepted: data.terms_accepted,
        idempotency_key: key,
      }).unwrap();

      localStorage.setItem(GENERATION_JOB_STORAGE_KEY, result.id);
      dispatch(startPolling(result.id));
    } catch (err) {
      const { message } = normalizeApiError(
        err as Parameters<typeof normalizeApiError>[0],
      );
      toast.error(message ?? "Failed to start course generation");
    }
  };

  const handleCancel = async () => {
    if (!activeJobId) return;
    try {
      await cancelGeneration(activeJobId).unwrap();
    } catch (err) {
      const { message } = normalizeApiError(
        err as Parameters<typeof normalizeApiError>[0],
      );
      toast.error(message ?? "Failed to cancel generation");
    }
  };

  const handleRetry = () => {
    localStorage.removeItem(GENERATION_JOB_STORAGE_KEY);
    dispatch(stopPolling());
    setIdempotencyKey("");
    setViewMode("form");
  };

  const handleBack = () => {
    localStorage.removeItem(GENERATION_JOB_STORAGE_KEY);
    dispatch(stopPolling());
    setIdempotencyKey("");
    setViewMode("form");
  };

  if (activeJobId && !isMinimized && jobData && viewMode !== "error") {
    return (
      <GenerationProgress
        job={jobData}
        onCancel={handleCancel}
        isCancelling={isCancelling}
        onMinimize={() => dispatch(toggleMinimize())}
      />
    );
  }

  if (viewMode === "error" && jobData) {
    return (
      <GenerationError job={jobData} onRetry={handleRetry} onBack={handleBack} />
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] animate-in fade-in duration-500">
      <div className="text-center mb-[40px]">
        <h1 className="text-[32px] font-bold text-[#202020] tracking-[-0.64px] font-quicksand mb-[12px]">
          Create course with AI
        </h1>
        <p className="text-[16px] text-[#606060] max-w-[440px] mx-auto leading-[24px]">
          Describe your course and let our AI help you create the perfect tailored
          course for you
        </p>
      </div>

      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-[500px] flex flex-col gap-[32px]"
        >
          <div className="flex flex-col gap-[20px]">
            <FormInput
              name="title"
              label="Course title"
              placeholder="Enter course title"
              required
            />

            <FormTextarea
              name="description"
              label="Description"
              placeholder="Describe what your course should cover"
              required
            />

            <FormSelect
              name="category"
              label="Course category"
              required
              searchable
              placeholder="Select category"
              options={(categories ?? []).map((c) => ({ label: c.name, value: c.id }))}
              onValueChange={() => {
                if (selectedTopic) {
                  setValue("topic", "", { shouldValidate: true });
                }
              }}
            />

            <FormSelect
              name="topic"
              label="Topic"
              searchable
              clearable
              clearLabel="No topic"
              placeholder="Select topic"
              options={filteredTopics.map((t) => ({ label: t.name, value: t.id }))}
            />

            <FormCheckbox
              name="terms_accepted"
              label="I agree to the terms and conditions for AI-generated courses"
            />
          </div>

          <div className="flex items-center gap-[16px]">
            <Button
              type="button"
              variant="app-outline"
              className="flex-1 h-[44px] text-sd-blue border-sd-blue"
              onClick={() => router.back()}
            >
              Back
            </Button>
            <Button
              type="submit"
              variant="app-primary"
              className="flex-1 h-[44px]"
              disabled={isCreating}
              isLoading={isCreating}
            >
              Generate course
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
