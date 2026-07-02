"use client";

import React, { useState, useRef } from "react";
import {
  Trash,
  Add,
  Eye,
  ArrowLeft2,
  ArrowRight2,
  VideoPlay,
  DocumentText,
  DocumentCode2,
  Edit2,
  Timer1,
  Book,
} from "iconsax-react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { FormInput } from "@/components/form/FormInput";
import { FormTextarea } from "@/components/form/FormTextarea";
import { Button } from "@/components/shared/Button";
import { lessonSchema, LessonFormData } from "../utils/schemas";
import { Lesson } from "./ModulesStep";
import { Editor } from "@tiptap/react";
import { RichTextEditor, RichTextEditorHandle } from "./RichTextEditor";
import { AddMediaModal } from "./AddMediaModal";
import { QuizSummaryDisplay } from "./QuizSummaryDisplay";
import { useAppDispatch, useAppSelector } from "@/redux";
import { setQuestions } from "@/redux/slices/quizBuilderSlice";
import { setEditingQuiz } from "@/redux/slices/courseBuilderSlice";

interface LessonEditViewProps {
  lesson: Lesson;
  onUpdateLesson: (updated: Lesson) => void;
  onBack: () => void;
}

export const LessonEditView = ({
  lesson,
  onUpdateLesson,
  onBack,
}: LessonEditViewProps) => {
  const editorRef = useRef<RichTextEditorHandle>(null);
  const mainEditorRef = useRef<RichTextEditorHandle>(null);
  const dispatch = useAppDispatch();

  const editingLesson = useAppSelector((s) => s.courseBuilder.editingLesson);

  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [mediaModalType, setMediaModalType] = useState<
    "image" | "video" | "embed"
  >("image");
  const pendingMediaCallbackRef = useRef<((url: string) => void) | null>(null);

  const openMediaModal = (
    type: "image" | "video" | "embed",
    onUrl: (url: string) => void,
  ) => {
    setMediaModalType(type);
    pendingMediaCallbackRef.current = onUrl;
    setMediaModalOpen(true);
  };

  const handleMediaConfirm = (url: string, source: string) => {
    pendingMediaCallbackRef.current?.(url);
    pendingMediaCallbackRef.current = null;
  };

  const methods = useForm<LessonFormData>({
    resolver: zodResolver(lessonSchema),
    mode: "onBlur",
    values: {
      id: lesson.id,
      title: lesson.title,
      duration: lesson.duration,
      assessments: lesson.assessments,
      type: lesson.type,
      objectives: lesson.objectives,
      requirements: lesson.requirements,
      content: lesson.content || "",
      embedLink: lesson.embedLink || "",
      videoScript: lesson.videoScript || "",
      quizQuestions: lesson.quizQuestions,
    },
  });

  const { handleSubmit, control } = methods;

  // Media state
  const [embedLink, setEmbedLink] = useState(lesson.embedLink || "");
  const [videoScript, setVideoScript] = useState(lesson.videoScript || "");
  const [isAddingObjective, setIsAddingObjective] = useState(false);
  const [newObjective, setNewObjective] = useState("");

  const handleUpdateField = (field: keyof Lesson, value: any) => {
    onUpdateLesson({
      ...lesson,
      [field]: value,
    });
  };

  const handleAddObjective = () => {
    if (newObjective.trim()) {
      const updated = [...(lesson.objectives || []), newObjective.trim()];
      handleUpdateField("objectives", updated);
      methods.setValue("objectives", updated);
      setNewObjective("");
      setIsAddingObjective(false);
    }
  };

  const handleRemoveObjective = (idx: number) => {
    const updated = (lesson.objectives || []).filter((_, i) => i !== idx);
    handleUpdateField("objectives", updated);
    methods.setValue("objectives", updated);
  };

  const onSubmit = (data: LessonFormData) => {
    onUpdateLesson({
      ...lesson,
      title: data.title,
      requirements: data.requirements || "",
      content: data.content || "",
      embedLink: data.embedLink || "",
      videoScript: data.videoScript || "",
      objectives: data.objectives || [],
      quizQuestions: data.quizQuestions || [],
    });
    onBack();
  };

  const exec = (fn: (editor: Editor) => void) => {
    const ed = mainEditorRef.current?.editor;
    if (ed) {
      fn(ed);
    }
  };

  const GENERAL_BLOCKS = [
    {
      label: "H1",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0A60E1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4v16" /><path d="M18 4v16" /><path d="M6 12h12" /><path d="M20 18l-2-2-2 2" /></svg>
      ),
      action: () => exec((e) => e.chain().focus().toggleHeading({ level: 1 }).run()),
    },
    {
      label: "H2",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0A60E1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4v16" /><path d="M18 4v16" /><path d="M6 12h12" /><path d="M16 18h4" /><path d="M18 14v4" /></svg>
      ),
      action: () => exec((e) => e.chain().focus().toggleHeading({ level: 2 }).run()),
    },
    {
      label: "H3",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0A60E1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4v16" /><path d="M18 4v16" /><path d="M6 12h12" /><path d="M16 14h4" /><path d="M18 10v8" /></svg>
      ),
      action: () => exec((e) => e.chain().focus().toggleHeading({ level: 3 }).run()),
    },
    {
      label: "Para",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0A60E1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4h8a4 4 0 0 1 0 8H6z" /><path d="M6 12h6a4 4 0 0 1 0 8H6z" /></svg>
      ),
      action: () => exec((e) => e.chain().focus().setParagraph().run()),
    },
    {
      label: "Bold",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0A60E1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" /><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" /></svg>
      ),
      action: () => exec((e) => e.chain().focus().toggleBold().run()),
    },
    {
      label: "Italic",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0A60E1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="4" x2="10" y2="4" /><line x1="14" y1="20" x2="5" y2="20" /><line x1="15" y1="4" x2="9" y2="20" /></svg>
      ),
      action: () => exec((e) => e.chain().focus().toggleItalic().run()),
    },
    {
      label: "Under",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0A60E1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3v7a6 6 0 0 0 12 0V3" /><line x1="4" y1="21" x2="20" y2="21" /></svg>
      ),
      action: () => exec((e) => e.chain().focus().toggleUnderline().run()),
    },
    {
      label: "AL",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0A60E1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="15" y2="12" /><line x1="3" y1="18" x2="18" y2="18" /></svg>
      ),
      action: () => exec((e) => e.chain().focus().setTextAlign("left").run()),
    },
    {
      label: "AC",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0A60E1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="6" y1="12" x2="18" y2="12" /><line x1="4" y1="18" x2="20" y2="18" /></svg>
      ),
      action: () => exec((e) => e.chain().focus().setTextAlign("center").run()),
    },
    {
      label: "AR",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0A60E1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="9" y1="12" x2="21" y2="12" /><line x1="6" y1="18" x2="21" y2="18" /></svg>
      ),
      action: () => exec((e) => e.chain().focus().setTextAlign("right").run()),
    },
    {
      label: "List",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0A60E1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="9" y1="6" x2="21" y2="6" /><line x1="9" y1="12" x2="21" y2="12" /><line x1="9" y1="18" x2="21" y2="18" /><circle cx="4" cy="6" r="1" fill="currentColor" /><circle cx="4" cy="12" r="1" fill="currentColor" /><circle cx="4" cy="18" r="1" fill="currentColor" /></svg>
      ),
      action: () => exec((e) => e.chain().focus().toggleBulletList().run()),
    },
    {
      label: "Num",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0A60E1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="10" y1="6" x2="21" y2="6" /><line x1="10" y1="12" x2="21" y2="12" /><line x1="10" y1="18" x2="21" y2="18" /><path d="M4 6h1v4" /><path d="M4 10h2" /><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" /></svg>
      ),
      action: () => exec((e) => e.chain().focus().toggleOrderedList().run()),
    },
    {
      label: "Quote",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0A60E1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1-1-2-2-2H4c-1 0-2 1-2 2v6c0 1 1 2 2 2" /><path d="M15 21c3 0 7-1 7-8V5c0-1-1-2-2-2h-4c-1 0-2 1-2 2v6c0 1 1 2 2 2" /></svg>
      ),
      action: () => exec((e) => e.chain().focus().toggleBlockquote().run()),
    },
    {
      label: "Code",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0A60E1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
      ),
      action: () => exec((e) => e.chain().focus().toggleCode().run()),
    },
    {
      label: "CodeB",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0A60E1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8" /><path d="M12 17v4" /></svg>
      ),
      action: () => exec((e) => e.chain().focus().toggleCodeBlock().run()),
    },
    {
      label: "Div",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0A60E1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12" /></svg>
      ),
      action: () => exec((e) => e.chain().focus().setHorizontalRule().run()),
    },
    {
      label: "Link",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0A60E1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
      ),
      action: () => {
        openMediaModal("embed", (url) => exec((e) => e.chain().focus().setLink({ href: url }).run()));
      },
    },
    {
      label: "Img",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0A60E1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
      ),
      action: () => {
        openMediaModal("image", (url) => exec((e) => e.chain().focus().setImage({ src: url }).run()));
      },
    },
    {
      label: "Vid",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0A60E1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" /></svg>
      ),
      action: () => {
        openMediaModal("video", (url) => exec((e) => e.chain().focus().insertContent(`<iframe src="${url}" frameborder="0" allowfullscreen class="w-full aspect-video rounded-[8px]"></iframe>`).run()));
      },
    },
    {
      label: "Embed",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0A60E1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
      ),
      action: () => {
        openMediaModal("embed", (url) => exec((e) => e.chain().focus().insertContent(`<a href="${url}" target="_blank" class="text-[#0A60E1] underline">${url}</a>`).run()));
      },
    },
  ];

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex h-full w-full bg-white overflow-hidden"
      >
        {/* Main Content Workspace Panel */}
        <div className="flex-1 overflow-y-auto px-[40px] py-[40px] flex flex-col gap-[36px]">
          {/* Workspace Title & Toolbar Header Row */}
          <div className="flex items-start justify-between w-full">
            <div className="flex gap-[12px] items-start flex-1">
              <span className="mt-[2px] text-sd-grey-9 shrink-0">
                <VideoPlay size={32} variant="Linear" color="#8C8C8C" />
              </span>
              <div className="flex flex-col gap-[6px] flex-1">
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      placeholder="Add lesson title..."
                      className="w-full text-[28px] font-semibold text-[#202020] border-none outline-none focus:ring-0 placeholder-[#B6B6B6] bg-transparent p-0 leading-tight"
                    />
                  )}
                />
                <div className="flex items-center gap-[12px] mt-[4px]">
                  <div className="flex items-center gap-[6px] text-[12px] text-[#8C8C8C]">
                    <Timer1 size={16} variant="Linear" color="#8C8C8C" />
                    <span>{lesson.duration}</span>
                  </div>
                  <span className="size-[3px] bg-[#B6B6B6] rounded-full" />
                  <div className="flex items-center gap-[6px] text-[12px] text-[#8C8C8C]">
                    <Book size={16} variant="Linear" color="#8C8C8C" />
                    <span>{lesson.assessments}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-[12px] shrink-0 mt-[4px]">
              <Button
                type="button"
                variant="app-outline"
                isGhost
                onClick={onBack}
                leftIcon={<Trash size={24} variant="Linear" color="#FF6B00" />}
              />
              {lesson.type !== "quiz" && (
                <Button
                  type="button"
                  variant="app-outline"
                  className="h-[40px] px-[16px] text-[14px]"
                  leftIcon={<Eye size={18} variant="Linear" color="#0A60E1" />}
                >
                  Preview
                </Button>
              )}
            </div>
          </div>

          {/* Quiz type — read-only summary */}
          {lesson.type === "quiz" ? (
            <div className="border border-[#E8E8E8] rounded-[16px] p-[24px] bg-white flex-1">
              <QuizSummaryDisplay questions={lesson.quizQuestions || []} />
            </div>
          ) : null}

          {/* Media Block Upload Container — only for video lessons */}
          {lesson.type === "video" && (
            <div className="bg-[rgba(240,240,240,0.8)] px-[16px] py-[20px] rounded-[16px] flex flex-col gap-[16px] items-start w-full">
              <div className="bg-[#FCFDFF] border-2 border-[#D9D9D9] border-dashed flex flex-col h-[289px] items-center justify-center p-[24px] rounded-[8px] w-full">
                <div className="flex flex-col gap-[24px] items-center text-center w-full">
                  <div className="flex flex-col gap-[8px] items-center text-center w-full">
                    <p className="text-[20px] font-medium text-[#202020] leading-[28px]">
                      Add Media
                    </p>
                    <p className="text-[14px] text-[#636363] tracking-[-0.28px] leading-[20px]">
                      Drag your video/Image file or embed from Vimeo, YouTube,
                      Wistia, Typeform and more.
                    </p>
                    <p className="text-[14px] text-[#202020] tracking-[-0.28px] leading-[20px]">
                      (Media size 1280x720px, (1080p) Max 500mb)
                    </p>
                  </div>
              <Button
                  type="button"
                  variant="app-outline"
                  className="h-[40px] px-[24px] py-[12px] text-[14px] font-normal text-sd-blue border-sd-blue hover:bg-sd-blue/5 bg-transparent"
                >
                  Upload media
                </Button>
                </div>
              </div>

              {/* Embedded link */}
              <div className="w-full">
                <FormInput
                  name="embedLink"
                  label="Embedded link"
                  placeholder="Paste link here"
                  value={embedLink}
                  onChange={(e) => setEmbedLink(e.target.value)}
                />
              </div>

              {/* Video script */}
              <div className="flex gap-[12px] items-end w-full">
                <div className="flex-1">
                  <FormInput
                    name="videoScript"
                    label="Video script"
                    placeholder="Name.srt"
                    value={videoScript}
                    onChange={(e) => setVideoScript(e.target.value)}
                  />
                </div>
                <Button
                  type="button"
                  variant="app-primary"
                  className="h-[44px] px-[24px] text-[14px] shrink-0 rounded-[8px]"
                  onClick={() => {
                    if (videoScript.trim()) {
                      handleUpdateField("videoScript", videoScript);
                      setVideoScript("");
                    }
                  }}
                >
                  Add
                </Button>
              </div>

              <div className="text-[14px] text-[#202020] tracking-[-0.28px] leading-[20px] w-full">
                Kindly ensure that your lesson script meet the minimum
                requirement. Ensuring proper file format.{" "}
                <a
                  href="#"
                  className="text-[#0a60e1] underline hover:text-[#0A50C5] transition-colors"
                >
                  Learn more
                </a>{" "}
                about our video guideline
              </div>
            </div>
          )}

          {/* Main Content Editor — blank Word-like document for text lessons, replaces media upload */}
          {lesson.type === "text" && (
          <div className="w-full">
            <RichTextEditor
              ref={mainEditorRef}
              content={lesson.content || ""}
              onChange={(html) => handleUpdateField("content", html)}
              placeholder="Start writing your lesson content here..."
              minHeight="1000px"
            />
          </div>
          )}

          {/* Lessons Objectives Section */}
          <div className="flex flex-col gap-[18px] w-full">
            <div className="flex items-center justify-between w-full">
              <h3 className="text-[20px] font-medium text-[#202020] leading-[28px]">
                Lessons Objectives
              </h3>
              <Button
                type="button"
                variant="app-outline"
                isGhost
                className="text-[14px] text-[#636363]"
              >
                <span>More</span>
                <div className="rotate-90 ml-[4px]">
                  <span className="text-[16px] font-bold">...</span>
                </div>
              </Button>
            </div>

            <div className="border border-[#E8E8E8] rounded-[16px] p-[20px] bg-white flex flex-col gap-[16px] w-full">
              <div className="flex flex-col gap-[12px] w-full">
                {(lesson.objectives || []).map((obj, oIdx) => (
                  <div
                    key={oIdx}
                    className="bg-white border border-[#D9D9D9] px-[20px] py-[16px] rounded-[8px] flex items-start justify-between w-full hover:border-[#B6B6B6] transition-all"
                  >
                    <div className="flex gap-[8px] items-start flex-1">
                      <span className="text-[16px] font-normal text-[#202020] leading-[24px] tracking-[-0.32px] whitespace-nowrap">
                        1.{oIdx + 1}
                      </span>
                      <span className="text-[16px] font-normal text-[#606060] leading-[24px] tracking-[-0.32px]">
                        {obj}
                      </span>
                    </div>
                    <div className="flex items-center gap-[16px] ml-[24px] shrink-0">
                      <Button
                        type="button"
                        variant="app-outline"
                        isGhost
                        onClick={() => handleRemoveObjective(oIdx)}
                      >
                        <Trash size={20} variant="Linear" color="#FF6B00" />
                      </Button>
                      <div className="flex flex-col gap-[2px] opacity-35 cursor-grab">
                        <div className="flex gap-[2px]">
                          <span className="size-[3px] bg-black rounded-full" />
                          <span className="size-[3px] bg-black rounded-full" />
                        </div>
                        <div className="flex gap-[2px]">
                          <span className="size-[3px] bg-black rounded-full" />
                          <span className="size-[3px] bg-black rounded-full" />
                        </div>
                        <div className="flex gap-[2px]">
                          <span className="size-[3px] bg-black rounded-full" />
                          <span className="size-[3px] bg-black rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {isAddingObjective ? (
                  <div className="flex items-center gap-[12px] h-[56px] border border-[#0A60E1] bg-white rounded-[8px] px-[20px] w-full">
                    <FormInput
                      name="newObjective"
                      value={newObjective}
                      onChange={(e) => setNewObjective(e.target.value)}
                      placeholder="Enter learning objective"
                      containerClassName="flex-1"
                      className="border-none focus:ring-0 focus-visible:border-none h-[40px] text-[14px] text-[#202020] bg-transparent"
                      autoFocus
                      onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                        if (e.key === "Enter") handleAddObjective();
                        else if (e.key === "Escape")
                          setIsAddingObjective(false);
                      }}
                    />
                    <div className="flex items-center gap-[12px] shrink-0">
                      <Button
                        type="button"
                        variant="app-outline"
                        isGhost
                        onClick={handleAddObjective}
                        className="text-[14px] text-[#0A60E1] font-semibold"
                      >
                        Save
                      </Button>
                      <Button
                        type="button"
                        variant="app-outline"
                        isGhost
                        onClick={() => {
                          setIsAddingObjective(false);
                          setNewObjective("");
                        }}
                        className="text-[14px] text-[#606060]"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : null}
              </div>

              {!isAddingObjective && (
                <Button
                  type="button"
                  variant="app-outline"
                  isGhost
                  onClick={() => setIsAddingObjective(true)}
                  className="text-[#0A60E1] text-[14px] font-normal tracking-[-0.28px] py-[4px] px-0"
                  leftIcon={<Add size={20} variant="Linear" color="#0A60E1" />}
                >
                  Add objective
                </Button>
              )}
            </div>
          </div>

          {/* Lessons Requirement Text Editor Section — shown for video and text */}
          {lesson.type !== "quiz" && (
            <div className="flex flex-col gap-[18px] w-full">
              <div className="flex items-center justify-between w-full">
                <h3 className="text-[20px] font-medium text-[#202020] leading-[28px]">
                  Lessons Requirement
                </h3>
                <Button
                  type="button"
                  variant="app-outline"
                  isGhost
                  className="text-[14px] text-[#636363]"
                >
                  <span>More</span>
                  <div className="rotate-90 ml-[4px]">
                    <span className="text-[16px] font-bold">...</span>
                  </div>
                </Button>
              </div>

              <div className="border border-[#E8E8E8] rounded-[16px] p-[24px] bg-white flex flex-col gap-[16px] w-full">
                <div className="flex items-center justify-between w-full">
                  <span className="text-[14px] text-[#606060] font-normal">
                    Describe what the objectives are for this lesson
                  </span>
                  <Button type="button" variant="app-outline" isGhost>
                    <Trash size={24} variant="Linear" color="#FF6B00" />
                  </Button>
                </div>

                <RichTextEditor
                  ref={editorRef}
                  content={lesson.requirements || ""}
                  onChange={(html) => handleUpdateField("requirements", html)}
                  placeholder="Describe what the objectives are for this lesson..."
                />
              </div>
            </div>
          )}

          {/* Quiz Section — only for text lessons */}
          {lesson.type === "text" && (
            <div className="flex flex-col gap-[18px] w-full">
              <div className="flex items-center justify-between w-full">
                <h3 className="text-[20px] font-medium text-[#202020] leading-[28px]">
                  Quiz
                </h3>
                <Button
                  type="button"
                  variant="app-outline"
                  isGhost
                  className="text-[14px] text-[#636363]"
                >
                  <span>More</span>
                  <div className="rotate-90 ml-[4px]">
                    <span className="text-[16px] font-bold">...</span>
                  </div>
                </Button>
              </div>

              <div className="border border-[#E8E8E8] rounded-[16px] p-[24px] bg-white flex flex-col gap-[16px] w-full">
                <div className="flex items-center justify-between w-full">
                  <span className="text-[16px] font-normal text-[#202020] tracking-[-0.32px] leading-[24px]">
                    Kindly ensure each questions aligns with the learning
                    objectives of this lesson.
                  </span>
                  <Button type="button" variant="app-outline" isGhost>
                    <Trash size={24} variant="Linear" color="#FF6B00" />
                  </Button>
                </div>

                <QuizSummaryDisplay questions={lesson.quizQuestions || []} />

                <Button
                  type="button"
                  variant="app-outline"
                  isGhost
                  onClick={() => {
                    if (editingLesson) {
                      dispatch(setQuestions(
                        (lesson.quizQuestions || []).map((q: any, i) => ({
                          id: q.id || `${i}`,
                          question: q.question,
                          type: q.type || "single",
                          points: q.points || 0,
                          options: (q.options || []).map((opt: any, oi: number) => {
                            if (typeof opt === "string") {
                              return {
                                id: `${i}-${String.fromCharCode(97 + oi)}`,
                                label: String.fromCharCode(65 + oi),
                                value: opt,
                              };
                            }
                            return { ...opt };
                          }),
                          correctOptionId: q.correctOptionId || undefined,
                          correctOptionIds: q.correctOptionIds || undefined,
                          correctAnswer: q.correctAnswer || undefined,
                          explanation: (q as any).explanation || "",
                        }))
                      ));
                      dispatch(setEditingQuiz({ moduleId: editingLesson.moduleId, lessonId: editingLesson.lessonId }));
                    }
                  }}
                  className="text-[#0A60E1] text-[16px] font-normal tracking-[-0.32px] h-[32px] px-[12px]"
                  leftIcon={
                    <Edit2 size={24} variant="Linear" color="#0A60E1" />
                  }
                >
                  Customize your quiz
                </Button>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-between w-full pt-[24px] border-t border-[#F0F0F0]">
            <Button
              type="button"
              variant="app-outline"
              onClick={onBack}
              leftIcon={
                <ArrowLeft2 size={24} variant="Linear" color="#0A60E1" />
              }
            >
              Go back
            </Button>
            <Button
              variant="app-primary"
              type="submit"
              rightIcon={
                <ArrowRight2 size={24} variant="Linear" color="#FFFFFF" />
              }
            >
              Publish lesson
            </Button>
          </div>
        </div>

        {/* Right Sidebar - Component layout blocks — only for text lessons */}
        {lesson.type === "text" && (
          <div className="w-[337px] h-full bg-[#FDFDFD] border-l border-[#F0F0F0] px-[20px] py-[32px] flex flex-col gap-[20px] shrink-0 overflow-y-auto">
            <span className="text-[14px] font-semibold text-[#202020] tracking-[-0.28px]">
              General
            </span>
            <div className="grid grid-cols-3 gap-[10px] w-full">
              {GENERAL_BLOCKS.map((block, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={block.action}
                  className="h-[78px] w-[92px] border border-[#F0F0F0] rounded-[8px] hover:border-[#D9D9D9] hover:shadow-sm bg-white cursor-pointer flex flex-col items-center justify-center gap-[8px] transition-all shrink-0"
                >
                  <span className="flex items-center justify-center size-[24px] text-[#0A60E1]">
                    {block.icon}
                  </span>
                  <span className="text-[14px] text-[#606060] text-center font-normal truncate w-full px-[4px] tracking-[-0.28px]">
                    {block.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </form>

      <AddMediaModal
        isOpen={mediaModalOpen}
        onOpenChange={setMediaModalOpen}
        mediaType={mediaModalType}
        onConfirm={handleMediaConfirm}
      />
    </FormProvider>
  );
};
