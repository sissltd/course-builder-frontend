"use client";

import React, { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  TickCircle,
  CloseCircle,
  InfoCircle,
  DocumentText,
  Magicpen,
} from "iconsax-react";
import { Button } from "@/components/shared/Button";
import { FormInput } from "@/components/form/FormInput";
import { FormTextarea } from "@/components/form/FormTextarea";
import { FormCheckbox } from "@/components/form/FormCheckbox";
import { FormSelect } from "@/components/form/FormSelect";
import { Progress } from "@/components/ui/progress";
import {
  useGetCategoriesPickerQuery,
  useGetTopicsQuery,
  usePresignCourseImportUploadMutation,
  useStartCourseImportMutation,
  useGetCourseImportQuery,
  useCancelCourseImportMutation,
  useConfirmCourseImportMutation,
} from "./hooks";
import { TopicStatus } from "./types/topic";
import {
  COURSE_IMPORT_EXTENSIONS,
  COURSE_IMPORT_MIME_TYPES,
  COURSE_IMPORT_MAX_FILE_SIZE_BYTES,
  COURSE_IMPORT_MAX_FILE_SIZE_MB,
  COURSE_IMPORT_JOB_STORAGE_KEY,
  type CourseImportDetectedStructure,
  type CourseImportPresignResponse,
} from "./types/courseImport";
import { putCourseImportFile } from "./utils/courseImportUpload";
import { normalizeApiError } from "@/lib/api/errors";
import { CreatorRoute } from "@/lib/routes";
import {
  CREATE_COURSE_STEP_PARAM,
  resolveReturnHref,
  RETURN_FROM_PARAM,
} from "./utils/createCourseNavigation";
import { cn } from "@/lib/utils";

const importSchema = z.object({
  title: z.string().min(1, "Course title is required"),
  description: z.string().min(1, "Course description is required"),
  category: z.string().min(1, "Course category is required"),
  topic: z.string(),
  terms_accepted: z
    .boolean()
    .refine((value) => value === true, "You must accept the terms"),
});

type ImportFormData = z.infer<typeof importSchema>;

type ImportStep =
  | "form"
  | "file"
  | "processing"
  | "review"
  | "done"
  | "error";

interface ReviewLesson {
  key: string;
  title: string;
  content: string;
}

interface ReviewModule {
  key: string;
  title: string;
  lessons: ReviewLesson[];
}

const makeKey = (): string =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const toReviewModules = (
  structure: CourseImportDetectedStructure | null | undefined,
): ReviewModule[] =>
  (structure?.modules ?? []).map((module) => ({
    key: makeKey(),
    title: module.title ?? "",
    lessons: (module.lessons ?? []).map((lesson) => ({
      key: makeKey(),
      title: lesson.title ?? "",
      content: lesson.content ?? "",
    })),
  }));

const makeIdempotencyKey = (): string =>
  `doc-import-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

const unwrapPresign = (
  raw: CourseImportPresignResponse,
): CourseImportPresignResponse =>
  (raw as CourseImportPresignResponse & { data?: CourseImportPresignResponse })
    .data ?? raw;

export default function DocumentImportView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnHref = resolveReturnHref({
    from: searchParams.get(RETURN_FROM_PARAM),
    step: searchParams.get(CREATE_COURSE_STEP_PARAM),
  });
  const handleWizardBack = useCallback(() => {
    if (returnHref) {
      router.push(returnHref);
      return;
    }
    router.back();
  }, [router, returnHref]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<ImportStep>("form");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [jobId, setJobId] = useState<string | null>(null);
  const [reviewModules, setReviewModules] = useState<ReviewModule[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [idempotencyKey, setIdempotencyKey] = useState(makeIdempotencyKey);

  const [presignUpload] = usePresignCourseImportUploadMutation();
  const [startImport] = useStartCourseImportMutation();
  const [cancelImport, { isLoading: isCancelling }] =
    useCancelCourseImportMutation();
  const [confirmImport, { isLoading: isConfirming }] =
    useConfirmCourseImportMutation();

  const { data: categories } = useGetCategoriesPickerQuery();
  const { data: topicsResponse } = useGetTopicsQuery({
    status: TopicStatus.ACTIVE,
  });
  const allTopics = topicsResponse?.data?.results || [];

  const { data: jobData } = useGetCourseImportQuery(jobId ?? "", {
    skip: !jobId,
    pollingInterval: step === "processing" ? 2500 : 0,
  });

  const methods = useForm<ImportFormData>({
    resolver: zodResolver(importSchema),
    mode: "onBlur",
    defaultValues: {
      title: "",
      description: "",
      category: "",
      topic: "",
      terms_accepted: false,
    },
  });

  const { handleSubmit, watch, setValue, getValues } = methods;

  const selectedCategory = watch("category");
  const selectedTopic = watch("topic");

  const filteredTopics = selectedCategory
    ? allTopics.filter((topic) => topic.category.id === selectedCategory)
    : allTopics;

  useEffect(() => {
    const storedJobId = localStorage.getItem(COURSE_IMPORT_JOB_STORAGE_KEY);
    if (storedJobId) {
      setJobId(storedJobId);
      setStep("processing");
    }
  }, []);

  useEffect(() => {
    if (!jobData) return;

    switch (jobData.status) {
      case "READY_FOR_REVIEW":
        if (step !== "review") {
          setReviewModules(toReviewModules(jobData.detected_structure));
          setWarnings(jobData.warnings ?? []);
          setStep("review");
        }
        break;
      case "FAILED":
        setErrorMessage(
          jobData.error_message ||
            "We could not read this document. Please upload a valid PDF, DOCX, TXT, or CSV file.",
        );
        localStorage.removeItem(COURSE_IMPORT_JOB_STORAGE_KEY);
        setJobId(null);
        setStep("error");
        break;
      case "CANCELLED":
        setErrorMessage("This import was cancelled.");
        localStorage.removeItem(COURSE_IMPORT_JOB_STORAGE_KEY);
        setJobId(null);
        setStep("error");
        break;
      case "COMPLETED":
        localStorage.removeItem(COURSE_IMPORT_JOB_STORAGE_KEY);
        setJobId(null);
        setStep("done");
        if (jobData.course_id) {
          setTimeout(() => {
            router.push(`${CreatorRoute.COURSES_BUILDER}?id=${jobData.course_id}`);
          }, 1500);
        }
        break;
      default:
        setStep("processing");
    }
  }, [jobData, step, router]);

  const validateFile = useCallback((file: File): string | null => {
    const extension = `.${file.name.split(".").pop()?.toLowerCase() ?? ""}`;
    const hasAllowedExtension = (
      COURSE_IMPORT_EXTENSIONS as readonly string[]
    ).includes(extension);
    const hasAllowedMime = (
      COURSE_IMPORT_MIME_TYPES as readonly string[]
    ).includes(file.type);

    if (!hasAllowedExtension && !hasAllowedMime) {
      return "Unsupported document format. Upload a PDF, DOCX, TXT, or CSV file.";
    }
    if (file.size > COURSE_IMPORT_MAX_FILE_SIZE_BYTES) {
      return `Document uploads cannot exceed ${COURSE_IMPORT_MAX_FILE_SIZE_MB}MB.`;
    }
    if (file.size === 0) {
      return "The selected document is empty. Upload a document with content.";
    }
    return null;
  }, []);

  const handleFile = useCallback(
    (file: File | null) => {
      if (!file) {
        setSelectedFile(null);
        setFileError("Please select a document to import.");
        return;
      }
      const error = validateFile(file);
      if (error) {
        setSelectedFile(null);
        setFileError(error);
        return;
      }
      setSelectedFile(file);
      setFileError(null);
    },
    [validateFile],
  );

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(event.target.files?.[0] ?? null);
  };

  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    handleFile(event.dataTransfer.files?.[0] ?? null);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const resetToForm = useCallback(() => {
    localStorage.removeItem(COURSE_IMPORT_JOB_STORAGE_KEY);
    setSelectedFile(null);
    setFileError(null);
    setUploadProgress(0);
    setJobId(null);
    setReviewModules([]);
    setWarnings([]);
    setErrorMessage(null);
    setIdempotencyKey(makeIdempotencyKey());
    setStep("form");
  }, []);

  const handleStartImport = async (data: ImportFormData) => {
    if (!selectedFile) {
      setFileError("Please select a document to import.");
      return;
    }
    const validationError = validateFile(selectedFile);
    if (validationError) {
      setFileError(validationError);
      return;
    }

    setStep("processing");
    setUploadProgress(0);

    try {
      const rawPresign = await presignUpload({
        filename: selectedFile.name,
        content_type: selectedFile.type || "application/octet-stream",
        size: selectedFile.size,
      }).unwrap();
      const presigned = unwrapPresign(rawPresign);

      await putCourseImportFile(selectedFile, presigned, setUploadProgress);

      const job = await startImport({
        file_key: presigned.file_key,
        filename: selectedFile.name,
        content_type: selectedFile.type || "application/octet-stream",
        size: selectedFile.size,
        category: data.category,
        topic: data.topic ? data.topic : null,
        title: data.title.trim(),
        description: data.description.trim(),
        terms_accepted: data.terms_accepted,
        idempotency_key: idempotencyKey,
      }).unwrap();

      localStorage.setItem(COURSE_IMPORT_JOB_STORAGE_KEY, job.id);
      setJobId(job.id);
    } catch (err) {
      const { message } = normalizeApiError(
        err as Parameters<typeof normalizeApiError>[0],
      );
      toast.error(message ?? "Failed to start the document import.");
      setStep("file");
    }
  };

  const handleCancel = async () => {
    if (!jobId) return;
    try {
      await cancelImport(jobId).unwrap();
    } catch (err) {
      const { message } = normalizeApiError(
        err as Parameters<typeof normalizeApiError>[0],
      );
      toast.error(message ?? "Failed to cancel the import.");
    }
  };

  const updateModuleTitle = (moduleKey: string, title: string) => {
    setReviewModules((prev) =>
      prev.map((module) =>
        module.key === moduleKey ? { ...module, title } : module,
      ),
    );
  };

  const updateLessonTitle = (
    moduleKey: string,
    lessonKey: string,
    title: string,
  ) => {
    setReviewModules((prev) =>
      prev.map((module) =>
        module.key === moduleKey
          ? {
              ...module,
              lessons: module.lessons.map((lesson) =>
                lesson.key === lessonKey ? { ...lesson, title } : lesson,
              ),
            }
          : module,
      ),
    );
  };

  const removeModule = (moduleKey: string) => {
    setReviewModules((prev) =>
      prev.filter((module) => module.key !== moduleKey),
    );
  };

  const removeLesson = (moduleKey: string, lessonKey: string) => {
    setReviewModules((prev) =>
      prev.map((module) =>
        module.key === moduleKey
          ? {
              ...module,
              lessons: module.lessons.filter(
                (lesson) => lesson.key !== lessonKey,
              ),
            }
          : module,
      ),
    );
  };

  const reviewIssues = useMemo(() => {
    const issues: string[] = [];
    if (reviewModules.length === 0) {
      issues.push("Add at least one module before confirming.");
    }
    if (reviewModules.some((module) => !module.title.trim())) {
      issues.push("Every module needs a title.");
    }
    if (reviewModules.some((module) => module.lessons.length === 0)) {
      issues.push("Every module needs at least one lesson.");
    }
    if (
      reviewModules.some((module) =>
        module.lessons.some((lesson) => !lesson.title.trim()),
      )
    ) {
      issues.push("Every lesson needs a title.");
    }
    if (
      reviewModules.some((module) =>
        module.lessons.some((lesson) => !lesson.content.trim()),
      )
    ) {
      issues.push("Every lesson needs content.");
    }
    return issues;
  }, [reviewModules]);

  const handleConfirm = async () => {
    if (!jobId) return;
    if (reviewIssues.length > 0) {
      toast.error(reviewIssues[0]);
      return;
    }

    try {
      const result = await confirmImport({
        id: jobId,
        body: {
          structure: {
            course: {
              title: getValues("title").trim(),
              description: getValues("description").trim(),
            },
            modules: reviewModules.map((module, moduleIndex) => ({
              title: module.title.trim(),
              order: moduleIndex + 1,
              lessons: module.lessons.map((lesson, lessonIndex) => ({
                title: lesson.title.trim(),
                order: lessonIndex + 1,
                content: lesson.content,
              })),
            })),
          },
        },
      }).unwrap();

      localStorage.removeItem(COURSE_IMPORT_JOB_STORAGE_KEY);
      setJobId(null);

      if (result.quality_failures && result.quality_failures.length > 0) {
        toast.warning(
          `Course created. Some checks are still pending: ${result.quality_failures.join(
            ", ",
          )}`,
        );
      } else {
        toast.success("Course created successfully!");
      }

      setStep("done");
      setTimeout(() => {
        router.push(`${CreatorRoute.COURSES_BUILDER}?id=${result.course_id}`);
      }, 1500);
    } catch (err) {
      const { message } = normalizeApiError(
        err as Parameters<typeof normalizeApiError>[0],
      );
      toast.error(message ?? "Failed to confirm the import.");
    }
  };

  const renderFormStep = () => (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] animate-in fade-in duration-500">
      <div className="text-center mb-[40px]">
        <h1 className="text-[32px] font-bold text-[#202020] tracking-[-0.64px] font-quicksand mb-[12px]">
          Import course from document
        </h1>
        <p className="text-[16px] text-[#606060] max-w-[440px] mx-auto leading-[24px]">
          Upload a document and we&apos;ll parse it into a structured course
          with modules and lessons
        </p>
      </div>

      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(() => setStep("file"))}
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
              placeholder="Enter course description"
              required
            />

            <FormSelect
              name="category"
              label="Course category"
              required
              searchable
              placeholder="Select category"
              options={(categories ?? []).map((category) => ({
                label: category.name,
                value: category.id,
              }))}
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
              options={filteredTopics.map((topic) => ({
                label: topic.name,
                value: topic.id,
              }))}
            />

            <FormCheckbox
              name="terms_accepted"
              label="I agree to the terms and conditions for course creation"
            />
          </div>

          <div className="flex items-center gap-[16px]">
            <Button
              type="button"
              variant="app-outline"
              className="flex-1 h-[44px] text-sd-blue border-sd-blue"
              onClick={handleWizardBack}
            >
              Back
            </Button>
            <Button
              type="submit"
              variant="app-primary"
              className="flex-1 h-[44px]"
            >
              Continue
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );

  const renderFileStep = () => (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] animate-in fade-in duration-500">
      <div className="text-center mb-[40px]">
        <h1 className="text-[32px] font-bold text-[#202020] tracking-[-0.64px] font-quicksand mb-[12px]">
          Select your document
        </h1>
        <p className="text-[16px] text-[#606060] max-w-[440px] mx-auto leading-[24px]">
          Supported formats: PDF, DOCX, TXT, CSV (max{" "}
          {COURSE_IMPORT_MAX_FILE_SIZE_MB}MB)
        </p>
      </div>

      <div className="w-full max-w-[500px] flex flex-col gap-[32px]">
        <div
          onDrop={handleFileDrop}
          onDragOver={handleDragOver}
          className={cn(
            "border-2 border-dashed rounded-[16px] p-[40px] flex flex-col items-center justify-center gap-[16px] transition-colors cursor-pointer",
            selectedFile
              ? "border-sd-blue bg-[#EBF3FF]"
              : "border-sd-grey-3 hover:border-sd-blue/50",
          )}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.txt,.csv"
            onChange={handleFileSelect}
            className="hidden"
          />

          {selectedFile ? (
            <>
              <div className="size-[48px] rounded-full bg-sd-blue/10 flex items-center justify-center">
                <DocumentText size={24} variant="Bold" color="#0063EF" />
              </div>
              <div className="text-center">
                <p className="text-[14px] font-semibold text-[#202020]">
                  {selectedFile.name}
                </p>
                <p className="text-[12px] text-sd-grey-11">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="size-[48px] rounded-full bg-sd-grey-1 flex items-center justify-center">
                <DocumentText size={24} variant="Outline" color="#636363" />
              </div>
              <div className="text-center">
                <p className="text-[14px] font-semibold text-[#202020]">
                  Drag & drop your document here
                </p>
                <p className="text-[12px] text-sd-grey-11">
                  or click to browse
                </p>
              </div>
            </>
          )}
        </div>

        {fileError && (
          <div className="p-[16px] rounded-[12px] bg-[#FFF0ED] border border-[#FF5025]/20 flex items-start gap-[12px]">
            <CloseCircle
              size={20}
              variant="Bold"
              color="#FF5025"
              className="shrink-0 mt-[2px]"
            />
            <p className="text-[14px] text-[#FF5025]">{fileError}</p>
          </div>
        )}

        <div className="flex items-center gap-[16px]">
          <Button
            type="button"
            variant="app-outline"
            className="flex-1 h-[44px] text-sd-blue border-sd-blue"
            onClick={() => setStep("form")}
          >
            Back
          </Button>
          <Button
            type="button"
            variant="app-primary"
            className="flex-1 h-[44px]"
            disabled={!selectedFile}
            onClick={handleSubmit(handleStartImport)}
          >
            Start import
          </Button>
        </div>
      </div>
    </div>
  );

  const renderProcessingStep = () => {
    const isUploading = !jobId;
    const progressValue = isUploading
      ? uploadProgress
      : (jobData?.progress ?? 0);
    const title = isUploading
      ? "Uploading document..."
      : "Processing your document...";
    const subtitle = isUploading
      ? "Uploading the file before parsing begins"
      : jobData?.stage || "Analyzing document structure";

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
          {title}
        </h1>
        <p className="text-[14px] text-sd-grey-11">{subtitle}</p>

        <div className="mt-[24px] w-full max-w-[400px] flex flex-col gap-[6px]">
          <Progress value={progressValue} className="h-[6px]" />
          <span className="text-[12px] text-sd-grey-11 text-right">
            {progressValue}%
          </span>
        </div>

        {jobId && (
          <Button
            type="button"
            variant="app-outline"
            className="mt-[32px] h-[44px] px-[24px] text-[#FF5025] border-[#FF5025] hover:bg-[#FF5025]/5"
            onClick={handleCancel}
            disabled={isCancelling}
            isLoading={isCancelling}
          >
            Cancel import
          </Button>
        )}
      </div>
    );
  };

  const renderReviewStep = () => {
    const lessonCount = reviewModules.reduce(
      (total, module) => total + module.lessons.length,
      0,
    );

    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] animate-in fade-in duration-500">
        <div className="text-center mb-[40px]">
          <h1 className="text-[32px] font-bold text-[#202020] tracking-[-0.64px] font-quicksand mb-[12px]">
            Review detected structure
          </h1>
          <p className="text-[16px] text-[#606060] max-w-[440px] mx-auto leading-[24px]">
            Edit module and lesson titles before importing. Lesson content is
            read-only for now and can be edited in the builder.
          </p>
        </div>

        <div className="w-full max-w-[600px] flex flex-col gap-[24px]">
          <div className="flex items-center gap-[12px] p-[16px] rounded-[12px] bg-[#EBF3FF] border border-[#0063EF]/20">
            <InfoCircle
              size={20}
              variant="Linear"
              color="#0063EF"
              className="shrink-0"
            />
            <p className="text-[14px] text-[#202020]">
              Found {reviewModules.length} module
              {reviewModules.length !== 1 ? "s" : ""} with {lessonCount} lesson
              {lessonCount !== 1 ? "s" : ""}
            </p>
          </div>

          {warnings.length > 0 && (
            <div className="flex flex-col gap-[8px] p-[16px] rounded-[12px] bg-[#FFF7E6] border border-[#FFB800]/30">
              {warnings.map((warning, index) => (
                <div
                  key={`${index}-${warning}`}
                  className="flex items-start gap-[12px]"
                >
                  <InfoCircle
                    size={18}
                    variant="Bold"
                    color="#B7791F"
                    className="shrink-0 mt-[2px]"
                  />
                  <p className="text-[14px] text-[#8A5A00]">{warning}</p>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-[16px] max-h-[400px] overflow-y-auto pr-[8px]">
            {reviewModules.map((module, moduleIndex) => (
              <div
                key={module.key}
                className="border border-sd-grey-3 rounded-[12px] overflow-hidden"
              >
                <div className="flex items-center gap-[12px] p-[16px] bg-sd-grey-1 border-b border-sd-grey-3">
                  <span className="size-[24px] rounded-full bg-sd-blue text-white flex items-center justify-center text-[12px] font-bold shrink-0">
                    {moduleIndex + 1}
                  </span>
                  <input
                    type="text"
                    value={module.title}
                    onChange={(event) =>
                      updateModuleTitle(module.key, event.target.value)
                    }
                    placeholder="Module title"
                    className="flex-1 text-[14px] font-semibold text-[#202020] bg-transparent border-none outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeModule(module.key)}
                    className="text-[#FF5025] hover:text-[#FF5025]/80 transition-colors"
                    aria-label="Remove module"
                  >
                    <CloseCircle size={18} variant="Bold" color="currentColor" />
                  </button>
                </div>

                <div className="flex flex-col">
                  {module.lessons.map((lesson, lessonIndex) => (
                    <div
                      key={lesson.key}
                      className="flex flex-col gap-[4px] px-[16px] py-[12px] border-b border-sd-grey-3 last:border-b-0"
                    >
                      <div className="flex items-center gap-[12px]">
                        <span className="text-[12px] text-sd-grey-11 font-medium w-[20px] shrink-0">
                          {lessonIndex + 1}.
                        </span>
                        <input
                          type="text"
                          value={lesson.title}
                          onChange={(event) =>
                            updateLessonTitle(
                              module.key,
                              lesson.key,
                              event.target.value,
                            )
                          }
                          placeholder="Lesson title"
                          className="flex-1 text-[14px] text-[#202020] bg-transparent border-none outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => removeLesson(module.key, lesson.key)}
                          className="text-sd-grey-11 hover:text-[#FF5025] transition-colors"
                          aria-label="Remove lesson"
                        >
                          <CloseCircle
                            size={16}
                            variant="Outline"
                            color="currentColor"
                          />
                        </button>
                      </div>
                      {lesson.content ? (
                        <p className="pl-[32px] text-[12px] text-sd-grey-11 line-clamp-2">
                          {lesson.content}
                        </p>
                      ) : (
                        <p className="pl-[32px] text-[12px] text-[#FF5025]">
                          This lesson has no content.
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {reviewModules.length === 0 && (
            <div className="text-center py-[40px]">
              <p className="text-[14px] text-sd-grey-11">
                No modules remaining. Go back to try a different document.
              </p>
            </div>
          )}

          {reviewIssues.length > 0 && (
            <div className="p-[16px] rounded-[12px] bg-[#FFF0ED] border border-[#FF5025]/20">
              <p className="text-[14px] text-[#FF5025]">{reviewIssues[0]}</p>
            </div>
          )}

          <div className="flex items-center gap-[16px]">
            <Button
              type="button"
              variant="app-outline"
              className="flex-1 h-[44px] text-sd-blue border-sd-blue"
              onClick={resetToForm}
            >
              Start over
            </Button>
            <Button
              type="button"
              variant="app-primary"
              className="flex-1 h-[44px]"
              disabled={reviewIssues.length > 0}
              onClick={handleConfirm}
              isLoading={isConfirming}
            >
              Confirm & create course
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderErrorStep = () => (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] animate-in fade-in duration-500">
      <div className="size-[80px] rounded-full bg-[#FFF0ED] flex items-center justify-center mb-[24px]">
        <CloseCircle size={40} variant="Bold" color="#FF5025" />
      </div>

      <h1 className="text-[24px] font-bold text-[#202020] font-quicksand mb-[8px]">
        Import failed
      </h1>
      <p className="text-[14px] text-sd-grey-11 mb-[32px] text-center max-w-[420px]">
        {errorMessage || "An error occurred while importing your document."}
      </p>

      <div className="flex items-center gap-[16px]">
        <Button
          type="button"
          variant="app-outline"
          className="h-[44px] px-[24px] text-sd-blue border-sd-blue"
          onClick={handleWizardBack}
        >
          Go back
        </Button>
        <Button
          type="button"
          variant="app-primary"
          className="h-[44px] px-[24px]"
          onClick={resetToForm}
        >
          Try again
        </Button>
      </div>
    </div>
  );

  const renderDoneStep = () => (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] animate-in fade-in duration-500">
      <div className="size-[80px] rounded-full bg-[#E6F9EF] flex items-center justify-center mb-[24px]">
        <TickCircle size={40} variant="Bold" color="#008500" />
      </div>

      <h1 className="text-[24px] font-bold text-[#202020] font-quicksand mb-[8px]">
        Course created successfully!
      </h1>
      <p className="text-[14px] text-sd-grey-11 mb-[32px] text-center max-w-[400px]">
        Redirecting you to the course builder...
      </p>
    </div>
  );

  return (
    <div className="w-full max-w-[1200px] mx-auto px-[20px] py-[40px]">
      {step === "form" && renderFormStep()}
      {step === "file" && renderFileStep()}
      {step === "processing" && renderProcessingStep()}
      {step === "review" && renderReviewStep()}
      {step === "error" && renderErrorStep()}
      {step === "done" && renderDoneStep()}
    </div>
  );
}
