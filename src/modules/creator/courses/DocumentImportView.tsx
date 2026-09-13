"use client";

import React, { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  TickCircle,
  CloseCircle,
  InfoCircle,
  Magicpen,
} from "iconsax-react";
import { Button } from "@/components/shared/Button";
import { FormInput } from "@/components/form/FormInput";
import { FormTextarea } from "@/components/form/FormTextarea";
import { FormCheckbox } from "@/components/form/FormCheckbox";
import { FormSelect } from "@/components/form/FormSelect";
import {
  useCreateCourseFromImportMutation,
  useCreateModuleForImportMutation,
  useCreateLessonForImportMutation,
  useGetCategoriesQuery,
  useGetTopicsQuery,
} from "./hooks";
import { parseDocument, extractDocumentTitle } from "./utils/documentParser";
import {
  CategoryStatus,
} from "./types/category";
import {
  TopicStatus,
} from "./types/topic";
import type { ParsedModule } from "./types/documentImport";
import {
  ACCEPTED_EXTENSIONS,
  ACCEPTED_DOCUMENT_TYPES,
  MAX_FILE_SIZE_MB,
  MAX_FILE_SIZE_BYTES,
} from "./types/documentImport";
import { normalizeApiError } from "@/lib/api/errors";
import { CreatorRoute } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { LessonContentType } from "./types/lesson";

const importSchema = z.object({
  courseTitle: z.string().min(1, "Course title is required"),
  courseDescription: z.string().min(1, "Course description is required"),
  category: z.string().min(1, "Course category is required"),
  topic: z.string().min(1, "Course topic is required"),
  terms_accepted: z.boolean().refine((val) => val === true, "You must accept the terms"),
});

type ImportFormData = z.infer<typeof importSchema>;

type ImportStep = "form" | "file" | "parsing" | "review" | "creating" | "done";

export default function DocumentImportView() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<ImportStep>("form");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedModules, setParsedModules] = useState<ParsedModule[]>([]);
  const [parsingError, setParsingError] = useState<string | null>(null);

  const [createCourse, { isLoading: isCreatingCourse }] =
    useCreateCourseFromImportMutation();
  const [createModule, { isLoading: isCreatingModule }] =
    useCreateModuleForImportMutation();
  const [createLesson, { isLoading: isCreatingLesson }] =
    useCreateLessonForImportMutation();

  const { data: categoriesResponse } =
    useGetCategoriesQuery({ status: CategoryStatus.ACTIVE });
  const categories = categoriesResponse?.data?.results || [];

  const { data: topicsResponse } =
    useGetTopicsQuery({ status: TopicStatus.ACTIVE });
  const allTopics = topicsResponse?.data?.results || [];

  const methods = useForm<ImportFormData>({
    resolver: zodResolver(importSchema),
    mode: "onBlur",
    defaultValues: {
      courseTitle: "",
      courseDescription: "",
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

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_DOCUMENT_TYPES.includes(file.type as typeof ACCEPTED_DOCUMENT_TYPES[number])) {
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (!ACCEPTED_EXTENSIONS.includes(`.${ext}` as typeof ACCEPTED_EXTENSIONS[number])) {
        return `Unsupported file type. Please upload a PDF, DOCX, or TXT file.`;
      }
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return `File is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`;
    }
    return null;
  };

  const processFile = useCallback(
    async (file: File) => {
      const error = validateFile(file);
      if (error) {
        toast.error(error);
        return;
      }

      setSelectedFile(file);
      setStep("parsing");
      setParsingError(null);

      try {
        const modules = await parseDocument(file);

        if (modules.length === 0) {
          setParsingError("No content structure detected in the document. Please try a different file.");
          setStep("form");
          return;
        }

        setParsedModules(modules);

        // Auto-fill course title from document if field is empty
        const currentTitle = methods.getValues("courseTitle");
        if (!currentTitle) {
          const detectedTitle = extractDocumentTitle(modules);
          if (detectedTitle) {
            methods.setValue("courseTitle", detectedTitle, { shouldValidate: true });
          }
        }

        setStep("review");
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to process document";
        setParsingError(message);
        setStep("form");
        setSelectedFile(null);
        toast.error(message);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      await processFile(file);
    },
    [processFile],
  );

  const handleFileDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (!file || !fileInputRef.current) return;

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInputRef.current.files = dataTransfer.files;

      const event = new Event("change", { bubbles: true });
      fileInputRef.current.dispatchEvent(event);
    },
    [],
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const updateModuleTitle = (moduleId: string, title: string) => {
    setParsedModules((prev) =>
      prev.map((m) => (m.id === moduleId ? { ...m, title } : m)),
    );
  };

  const updateLessonTitle = (moduleId: string, lessonId: string, title: string) => {
    setParsedModules((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              lessons: m.lessons.map((l) =>
                l.id === lessonId ? { ...l, title } : l,
              ),
            }
          : m,
      ),
    );
  };

  const removeModule = (moduleId: string) => {
    setParsedModules((prev) => prev.filter((m) => m.id !== moduleId));
  };

  const removeLesson = (moduleId: string, lessonId: string) => {
    setParsedModules((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) }
          : m,
      ),
    );
  };

  const handleConfirm = async (data: ImportFormData) => {
    if (parsedModules.length === 0) {
      toast.error("No modules to import");
      return;
    }

    setStep("creating");

    try {
      const course = await createCourse({
        category: data.category,
        title: data.courseTitle,
        description: data.courseDescription,
        topic: data.topic || undefined,
        terms_accepted: data.terms_accepted,
      }).unwrap();

      for (let i = 0; i < parsedModules.length; i++) {
        const mod = parsedModules[i];
        const createdModule = await createModule({
          courseId: course.id,
          body: {
            title: mod.title,
            order: i + 1,
          },
        }).unwrap();

        for (let j = 0; j < mod.lessons.length; j++) {
          const lesson = mod.lessons[j];
          await createLesson({
            courseId: course.id,
            moduleId: createdModule.id,
            body: {
              title: lesson.title,
              order: j + 1,
              content_type: LessonContentType.TEXT,
              script: lesson.content,
            },
          }).unwrap();
        }
      }

      setStep("done");
      toast.success("Course created successfully!");

      setTimeout(() => {
        router.push(`${CreatorRoute.COURSES_BUILDER}?id=${course.id}`);
      }, 2000);
    } catch (err) {
      const { message } = normalizeApiError(
        err as Parameters<typeof normalizeApiError>[0],
      );
      toast.error(message ?? "Failed to create course from document");
      setStep("review");
    }
  };

  const handleBackToForm = () => {
    setStep("form");
    setSelectedFile(null);
    setParsedModules([]);
    setParsingError(null);
  };

  const renderFormStep = () => (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] animate-in fade-in duration-500">
      <div className="text-center mb-[40px]">
        <h1 className="text-[32px] font-bold text-[#202020] tracking-[-0.64px] font-quicksand mb-[12px]">
          Import course from document
        </h1>
        <p className="text-[16px] text-[#606060] max-w-[440px] mx-auto leading-[24px]">
          Upload a document and we&apos;ll parse it into a structured course with modules and lessons
        </p>
      </div>

      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(() => setStep("file"))}
          className="w-full max-w-[500px] flex flex-col gap-[32px]"
        >
          <div className="flex flex-col gap-[20px]">
            <FormInput
              name="courseTitle"
              label="Course title"
              placeholder="Enter course title"
              required
            />

            <FormTextarea
              name="courseDescription"
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
              options={categories.map((c) => ({ label: c.name, value: c.id }))}
              onValueChange={() => {
                if (selectedTopic) {
                  setValue("topic", "", { shouldValidate: true });
                }
              }}
            />

            <FormSelect
              name="topic"
              label="Course topic"
              required
              searchable
              placeholder="Select topic"
              options={filteredTopics.map((t) => ({ label: t.name, value: t.id }))}
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
              onClick={() => router.back()}
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
          Supported formats: PDF, DOCX, TXT (max {MAX_FILE_SIZE_MB}MB)
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
            accept=".pdf,.docx,.txt"
            onChange={handleFileSelect}
            className="hidden"
          />

          {selectedFile ? (
            <>
              <div className="size-[48px] rounded-full bg-sd-blue/10 flex items-center justify-center">
                <InfoCircle size={24} variant="Bold" color="#0063EF" />
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
                <InfoCircle size={24} variant="Outline" color="#636363" />
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

        {parsingError && (
          <div className="p-[16px] rounded-[12px] bg-[#FFF0ED] border border-[#FF5025]/20 flex items-start gap-[12px]">
            <CloseCircle size={20} variant="Bold" color="#FF5025" className="shrink-0 mt-[2px]" />
            <p className="text-[14px] text-[#FF5025]">{parsingError}</p>
          </div>
        )}

        <div className="flex items-center gap-[16px]">
          <Button
            type="button"
            variant="app-outline"
            className="flex-1 h-[44px] text-sd-blue border-sd-blue"
            onClick={handleBackToForm}
          >
            Back
          </Button>
          <Button
            type="button"
            variant="app-primary"
            className="flex-1 h-[44px]"
            disabled={!selectedFile}
            onClick={() => {
              if (selectedFile) {
                processFile(selectedFile);
              }
            }}
          >
            Parse Document
          </Button>
        </div>
      </div>
    </div>
  );

  const renderParsingStep = () => (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] animate-in fade-in duration-500">
      <div className="relative size-[160px] flex items-center justify-center mb-[32px]">
        <div className="absolute inset-0 border-[4px] border-sd-grey-3 rounded-full" />
        <div className="absolute inset-0 border-[4px] border-sd-blue rounded-full border-t-transparent animate-spin" />
        <div className="size-[80px] bg-[#EBF3FF] rounded-full flex items-center justify-center animate-pulse">
          <Magicpen size={40} variant="Bulk" color="#0063EF" />
        </div>
      </div>

      <h1 className="text-[24px] font-bold text-[#202020] font-quicksand mb-[8px]">
        Parsing document...
      </h1>
      <p className="text-[14px] text-sd-grey-11">
        Analyzing document structure and detecting sections
      </p>
    </div>
  );

  const renderReviewStep = () => (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] animate-in fade-in duration-500">
      <div className="text-center mb-[40px]">
        <h1 className="text-[32px] font-bold text-[#202020] tracking-[-0.64px] font-quicksand mb-[12px]">
          Review parsed structure
        </h1>
        <p className="text-[16px] text-[#606060] max-w-[440px] mx-auto leading-[24px]">
          Edit module and lesson titles before importing
        </p>
      </div>

      <div className="w-full max-w-[600px] flex flex-col gap-[24px]">
        <div className="flex items-center gap-[12px] p-[16px] rounded-[12px] bg-[#EBF3FF] border border-[#0063EF]/20">
          <InfoCircle size={20} variant="Linear" color="#0063EF" className="shrink-0" />
          <p className="text-[14px] text-[#202020]">
            Found {parsedModules.length} module{parsedModules.length !== 1 ? "s" : ""} with{" "}
            {parsedModules.reduce((acc, m) => acc + m.lessons.length, 0)} lesson
            {parsedModules.reduce((acc, m) => acc + m.lessons.length, 0) !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex flex-col gap-[16px] max-h-[400px] overflow-y-auto pr-[8px]">
          {parsedModules.map((mod, modIndex) => (
            <div
              key={mod.id}
              className="border border-sd-grey-3 rounded-[12px] overflow-hidden"
            >
              <div className="flex items-center gap-[12px] p-[16px] bg-sd-grey-1 border-b border-sd-grey-3">
                <span className="size-[24px] rounded-full bg-sd-blue text-white flex items-center justify-center text-[12px] font-bold shrink-0">
                  {modIndex + 1}
                </span>
                <input
                  type="text"
                  value={mod.title}
                  onChange={(e) => updateModuleTitle(mod.id, e.target.value)}
                  className="flex-1 text-[14px] font-semibold text-[#202020] bg-transparent border-none outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeModule(mod.id)}
                  className="text-[#FF5025] hover:text-[#FF5025]/80 transition-colors"
                >
                  <CloseCircle size={18} variant="Bold" color="currentColor" />
                </button>
              </div>

              <div className="flex flex-col">
                {mod.lessons.map((lesson, lessonIndex) => (
                  <div
                    key={lesson.id}
                    className="flex items-center gap-[12px] px-[16px] py-[12px] border-b border-sd-grey-3 last:border-b-0"
                  >
                    <span className="text-[12px] text-sd-grey-11 font-medium w-[20px] shrink-0">
                      {lessonIndex + 1}.
                    </span>
                    <input
                      type="text"
                      value={lesson.title}
                      onChange={(e) =>
                        updateLessonTitle(mod.id, lesson.id, e.target.value)
                      }
                      className="flex-1 text-[14px] text-[#202020] bg-transparent border-none outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => removeLesson(mod.id, lesson.id)}
                      className="text-sd-grey-11 hover:text-[#FF5025] transition-colors"
                    >
                      <CloseCircle size={16} variant="Outline" color="currentColor" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {parsedModules.length === 0 && (
          <div className="text-center py-[40px]">
            <p className="text-[14px] text-sd-grey-11">
              No modules remaining. Go back to try a different document.
            </p>
          </div>
        )}

        <div className="flex items-center gap-[16px]">
          <Button
            type="button"
            variant="app-outline"
            className="flex-1 h-[44px] text-sd-blue border-sd-blue"
            onClick={handleBackToForm}
          >
            Back
          </Button>
          <Button
            type="button"
            variant="app-primary"
            className="flex-1 h-[44px]"
            disabled={parsedModules.length === 0}
            onClick={handleSubmit(handleConfirm)}
            isLoading={isCreatingCourse || isCreatingModule || isCreatingLesson}
          >
            Import & Create Course
          </Button>
        </div>
      </div>
    </div>
  );

  const renderCreatingStep = () => (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] animate-in fade-in duration-700">
      <div className="relative size-[160px] flex items-center justify-center">
        <div className="absolute inset-0 border-[4px] border-sd-grey-3 rounded-full" />
        <div className="absolute inset-0 border-[4px] border-sd-blue rounded-full border-t-transparent animate-spin" />
        <div className="size-[80px] bg-[#EBF3FF] rounded-full flex items-center justify-center animate-pulse">
          <Magicpen size={40} variant="Bulk" color="#0063EF" />
        </div>
      </div>
      <p className="mt-[32px] text-[18px] text-[#202020] font-semibold tracking-[-0.36px]">
        Creating your course...
      </p>
      <p className="mt-[8px] text-[14px] text-sd-grey-11">
        Setting up modules and lessons from your document
      </p>
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
      {step === "parsing" && renderParsingStep()}
      {step === "review" && renderReviewStep()}
      {step === "creating" && renderCreatingStep()}
      {step === "done" && renderDoneStep()}
    </div>
  );
}
