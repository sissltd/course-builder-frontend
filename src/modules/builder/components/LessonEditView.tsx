"use client";

import React, { useState } from "react";
import { 
  Trash, 
  Add, 
  Video, 
  Global, 
  Eye, 
  ArrowLeft2, 
  ArrowRight2,
  VideoPlay,
  DocumentText,
  DocumentCode2,
  Edit2,
  Timer1,
  Book,
  More
} from "iconsax-react";
import { cn } from "@/lib/utils";
import { AppInput } from "@/components/form/AppInput";
import { AppTextarea } from "@/components/form/AppTextarea";
import { AppButton } from "@/components/shared/AppButton";
import { Lesson } from "./ModulesStep";

interface LessonEditViewProps {
  lesson: Lesson;
  onUpdateLesson: (updated: Lesson) => void;
  onBack: () => void;
}

export const LessonEditView = ({ 
  lesson, 
  onUpdateLesson, 
  onBack 
}: LessonEditViewProps) => {

  // Media state
  const [embedLink, setEmbedLink] = useState("");
  const [videoScript, setVideoScript] = useState("");
  const [isAddingObjective, setIsAddingObjective] = useState(false);
  const [newObjective, setNewObjective] = useState("");

  const handleUpdateField = (field: keyof Lesson, value: any) => {
    onUpdateLesson({
      ...lesson,
      [field]: value
    });
  };

  const handleAddObjective = () => {
    if (newObjective.trim()) {
      handleUpdateField("objectives", [...lesson.objectives, newObjective.trim()]);
      setNewObjective("");
      setIsAddingObjective(false);
    }
  };

  const handleRemoveObjective = (idx: number) => {
    handleUpdateField("objectives", lesson.objectives.filter((_, i) => i !== idx));
  };

  const handleAddQuizQuestion = () => {
    const newQuestion = {
      question: "",
      options: ["", "", "", ""]
    };
    handleUpdateField("quizQuestions", [...lesson.quizQuestions, newQuestion]);
  };

  const handleRemoveQuizQuestion = (idx: number) => {
    handleUpdateField("quizQuestions", lesson.quizQuestions.filter((_, i) => i !== idx));
  };

  // General Sidebar Block Items (3 columns layout matching Figma)
  const GENERAL_BLOCKS = [
    { label: "Heading 1", icon: "H1" },
    { label: "Heading 2", icon: "H2" },
    { label: "Paragraph", icon: "¶" },
    { label: "Number", icon: "1." },
    { label: "Bullet", icon: "•" },
    { label: "Blockquote", icon: "“" },
    { label: "Divider", icon: "—" },
    { label: "Image", icon: "🖼️" },
    { label: "Video", icon: "📹" },
    { label: "Embed", icon: "🔗" },
    { label: "Quiz", icon: "❓" }
  ];

  return (
    <div className="flex h-full w-full bg-white overflow-hidden">
      
      {/* Main Content Workspace Panel */}
      <div className="flex-1 overflow-y-auto px-[40px] py-[40px] flex flex-col gap-[36px]">
        
        {/* Workspace Title & Toolbar Header Row */}
        <div className="flex items-start justify-between w-full">
          <div className="flex gap-[12px] items-start flex-1">
            <span className="mt-[2px] text-sd-grey-9 shrink-0">
              <VideoPlay size={32} variant="Linear" color="#8C8C8C" />
            </span>
            <div className="flex flex-col gap-[6px] flex-1">
              <input 
                type="text" 
                placeholder="Add lesson title..."
                value={lesson.title}
                onChange={(e) => handleUpdateField("title", e.target.value)}
                className="w-full text-[28px] font-semibold text-[#202020] border-none outline-none focus:ring-0 placeholder-[#B6B6B6] bg-transparent p-0 leading-tight"
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
            <button 
              onClick={onBack}
              className="p-[8px] text-[#FF6B00] hover:bg-[#FF6B00]/5 rounded-[8px] transition-colors"
            >
              <Trash size={24} variant="Linear" color="#FF6B00" />
            </button>
            <AppButton 
              variant="app-outline" 
              className="h-[40px] px-[16px] text-[14px]"
              leftIcon={<Eye size={18} variant="Linear" color="#0A60E1" />}
            >
              Preview
            </AppButton>
          </div>
        </div>

        {/* Media Block Upload Container */}
        <div className="bg-[rgba(240,240,240,0.8)] px-[16px] py-[20px] rounded-[16px] flex flex-col gap-[16px] items-start w-full">
          <div className="bg-[#FCFDFF] border-2 border-[#D9D9D9] border-dashed flex flex-col h-[289px] items-center justify-center p-[24px] rounded-[8px] w-full">
            <div className="flex flex-col gap-[24px] items-center text-center w-full">
              <div className="flex flex-col gap-[8px] items-center text-center w-full">
                <p className="text-[20px] font-medium text-[#202020] leading-[28px]">Add Media</p>
                <p className="text-[14px] text-[#636363] tracking-[-0.28px] leading-[20px]">
                  Drag your video/Image file or embed from Vimeo, YouTube, Wistia, Typeform and more.
                </p>
                <p className="text-[14px] text-[#202020] tracking-[-0.28px] leading-[20px]">
                  (Media size 1280x720px, (1080p) Max 500mb)
                </p>
              </div>
              <AppButton 
                variant="app-outline" 
                className="h-[40px] px-[24px] py-[12px] text-[14px] font-normal text-sd-blue border-sd-blue hover:bg-sd-blue/5 bg-transparent"
              >
                Upload media
              </AppButton>
            </div>
          </div>

          {/* Embedded link */}
          <div className="w-full">
            <AppInput 
              label="Embedded link"
              placeholder="Paste link here"
              value={embedLink}
              onChange={(e) => setEmbedLink(e.target.value)}
            />
          </div>

          {/* Video script */}
          <div className="flex gap-[12px] items-end w-full">
            <div className="flex-1">
              <AppInput 
                label="Video script"
                placeholder="Name.srt"
                value={videoScript}
                onChange={(e) => setVideoScript(e.target.value)}
              />
            </div>
            <AppButton 
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
            </AppButton>
          </div>
          
          <div className="text-[14px] text-[#202020] tracking-[-0.28px] leading-[20px] w-full">
            Kindly ensure that your lesson script meet the minimum requirement. Ensuring proper file format.{" "}
            <a href="#" className="text-[#0a60e1] underline hover:text-[#0A50C5] transition-colors">
              Learn more
            </a>{" "}
            about our video guideline
          </div>
        </div>

        {/* Lessons Objectives Section */}
        <div className="flex flex-col gap-[18px] w-full">
          <div className="flex items-center justify-between w-full">
            <h3 className="text-[20px] font-medium text-[#202020] leading-[28px]">Lessons Objectives</h3>
            <button className="flex items-center gap-[8px] text-[14px] text-[#636363] hover:text-black">
              <span>More</span>
              <div className="rotate-90">
                <span className="text-[16px] font-bold">...</span>
              </div>
            </button>
          </div>

          <div className="border border-[#E8E8E8] rounded-[16px] p-[20px] bg-white flex flex-col gap-[16px] w-full">
            <div className="flex flex-col gap-[12px] w-full">
              {lesson.objectives.map((obj, oIdx) => (
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
                    <button 
                      onClick={() => handleRemoveObjective(oIdx)}
                      className="text-[#FF6B00] hover:text-[#E05B00] transition-colors p-[2px]"
                    >
                      <Trash size={20} variant="Linear" color="#FF6B00" />
                    </button>
                    {/* Drag handle */}
                    <div className="flex flex-col gap-[2px] opacity-35 cursor-grab">
                      <div className="flex gap-[2px]"><span className="size-[3px] bg-black rounded-full"/><span className="size-[3px] bg-black rounded-full"/></div>
                      <div className="flex gap-[2px]"><span className="size-[3px] bg-black rounded-full"/><span className="size-[3px] bg-black rounded-full"/></div>
                      <div className="flex gap-[2px]"><span className="size-[3px] bg-black rounded-full"/><span className="size-[3px] bg-black rounded-full"/></div>
                    </div>
                  </div>
                </div>
              ))}

              {isAddingObjective ? (
                <div className="flex items-center gap-[12px] h-[56px] border border-[#0A60E1] bg-white rounded-[8px] px-[20px] w-full">
                  <input 
                    value={newObjective}
                    onChange={(e) => setNewObjective(e.target.value)}
                    placeholder="Enter learning objective"
                    className="flex-1 border-none focus:ring-0 focus:outline-none h-[40px] text-[14px] text-[#202020]"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddObjective();
                      else if (e.key === "Escape") setIsAddingObjective(false);
                    }}
                  />
                  <div className="flex items-center gap-[12px] shrink-0">
                    <button 
                      onClick={handleAddObjective}
                      className="text-[14px] text-[#0A60E1] font-semibold hover:underline"
                    >
                      Save
                    </button>
                    <button 
                      onClick={() => {
                        setIsAddingObjective(false);
                        setNewObjective("");
                      }}
                      className="text-[14px] text-[#606060] hover:underline"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : null}
            </div>

            {!isAddingObjective && (
              <button 
                onClick={() => setIsAddingObjective(true)}
                className="flex items-center gap-[8px] text-[#0A60E1] hover:text-[#0A50C5] transition-colors self-start font-normal text-[14px] tracking-[-0.28px] py-[4px]"
              >
                <Add size={20} variant="Linear" color="#0A60E1" />
                <span>Add objective</span>
              </button>
            )}
          </div>
        </div>

        {/* Lessons Requirement Text Editor Section */}
        <div className="flex flex-col gap-[18px] w-full">
          <div className="flex items-center justify-between w-full">
            <h3 className="text-[20px] font-medium text-[#202020] leading-[28px]">Lessons Requirement</h3>
            <button className="flex items-center gap-[8px] text-[14px] text-[#636363] hover:text-black">
              <span>More</span>
              <div className="rotate-90">
                <span className="text-[16px] font-bold">...</span>
              </div>
            </button>
          </div>

          <div className="border border-[#E8E8E8] rounded-[16px] p-[24px] bg-white flex flex-col gap-[16px] w-full">
            <div className="flex items-center justify-between w-full">
              <span className="text-[14px] text-[#606060] font-normal">
                Describe what the objectives are for this lesson
              </span>
              <button className="text-[#FF6B00] hover:text-[#E05B00] transition-colors p-[2px]">
                <Trash size={24} variant="Linear" color="#FF6B00" />
              </button>
            </div>

            <div className="border border-[#E8E8E8] rounded-[12px] overflow-hidden bg-white w-full">
              {/* Editor Toolbar Mock */}
              <div className="h-[44px] bg-[#FAFAFA] border-b border-[#E8E8E8] px-[16px] flex items-center gap-[16px] text-[#606060] text-[13px] font-medium">
                <button className="hover:text-black transition-colors text-[16px] font-bold">↺</button>
                <button className="hover:text-black transition-colors text-[16px] font-bold">↻</button>
                <div className="h-[16px] w-px bg-[#D9D9D9]" />
                <button className="hover:text-black transition-colors">Normal text ▾</button>
                <div className="h-[16px] w-px bg-[#D9D9D9]" />
                <button className="hover:text-black transition-colors font-bold">B</button>
                <button className="hover:text-black transition-colors italic">I</button>
                <button className="hover:text-black transition-colors underline">U</button>
                <div className="h-[16px] w-px bg-[#D9D9D9]" />
                <button className="hover:text-black transition-colors">Align ▾</button>
                <button className="hover:text-black transition-colors">List ▾</button>
              </div>
              
              <textarea 
                value={lesson.requirements}
                onChange={(e) => handleUpdateField("requirements", e.target.value)}
                className="w-full p-[20px] text-[14px] text-[#202020] border-none outline-none focus:ring-0 resize-y"
                rows={6}
              />
            </div>
          </div>
        </div>

        {/* Quiz Section */}
        <div className="flex flex-col gap-[18px] w-full">
          <div className="flex items-center justify-between w-full">
            <h3 className="text-[20px] font-medium text-[#202020] leading-[28px]">Quiz</h3>
            <button className="flex items-center gap-[8px] text-[14px] text-[#636363] hover:text-black">
              <span>More</span>
              <div className="rotate-90">
                <span className="text-[16px] font-bold">...</span>
              </div>
            </button>
          </div>

          <div className="border border-[#E8E8E8] rounded-[16px] p-[24px] bg-white flex flex-col gap-[16px] w-full">
            <div className="flex items-center justify-between w-full">
              <span className="text-[16px] font-normal text-[#202020] tracking-[-0.32px] leading-[24px]">
                Kindly ensure each questions aligns with the learning objectives of this lesson.
              </span>
              <button className="text-[#FF6B00] hover:text-[#E05B00] transition-colors p-[2px]">
                <Trash size={24} variant="Linear" color="#FF6B00" />
              </button>
            </div>

            <div className="flex flex-col gap-[16px] w-full">
              {lesson.quizQuestions.map((q, qIdx) => (
                <div 
                  key={qIdx}
                  className="bg-[#FDFDFD] border border-[#D9D9D9] flex gap-[12px] items-start px-[16px] py-[20px] rounded-[12px] w-full relative hover:border-[#B6B6B6] transition-all"
                >
                  {/* Drag indicator dots icon */}
                  <div className="flex flex-col gap-[2px] opacity-35 cursor-grab shrink-0 mt-[16px]">
                    <div className="flex gap-[2px]"><span className="size-[3px] bg-black rounded-full"/><span className="size-[3px] bg-black rounded-full"/></div>
                    <div className="flex gap-[2px]"><span className="size-[3px] bg-black rounded-full"/><span className="size-[3px] bg-black rounded-full"/></div>
                    <div className="flex gap-[2px]"><span className="size-[3px] bg-black rounded-full"/><span className="size-[3px] bg-black rounded-full"/></div>
                  </div>

                  {/* Question Box Card */}
                  <div className="border border-[#D9D9D9] flex-1 flex flex-col gap-[16px] p-[16px] rounded-[8px] bg-white">
                    <div className="flex gap-[12px] items-start w-full">
                      <span className="text-[16px] font-medium text-[#202020] whitespace-nowrap leading-[24px]">
                        Question {qIdx + 1}
                      </span>
                      <input 
                        type="text"
                        placeholder="Enter your question here"
                        value={q.question}
                        onChange={(e) => {
                          const updated = [...lesson.quizQuestions];
                          updated[qIdx].question = e.target.value;
                          handleUpdateField("quizQuestions", updated);
                        }}
                        className="flex-1 text-[16px] text-[#606060] font-normal leading-[24px] border-none outline-none focus:ring-0 p-0"
                      />
                    </div>

                    <div className="flex flex-col gap-[16px] w-full">
                      {q.options.map((opt, optIdx) => {
                        const label = String.fromCharCode(65 + optIdx); // A, B, C, D
                        return (
                          <div key={optIdx} className="flex gap-[12px] items-center">
                            <span className="text-[14px] text-[#606060] font-normal tracking-[-0.28px] leading-[20px] w-[14px]">
                              {label}
                            </span>
                            <div className="bg-white border-[1.08px] border-[#D9D9D9] rounded-full size-[18px] cursor-pointer hover:border-[#0A60E1] shrink-0" />
                            <input 
                              type="text"
                              placeholder={`Option ${label}`}
                              value={opt}
                              onChange={(e) => {
                                const updated = [...lesson.quizQuestions];
                                updated[qIdx].options[optIdx] = e.target.value;
                                handleUpdateField("quizQuestions", updated);
                              }}
                              className="flex-1 text-[14px] text-[#606060] font-normal tracking-[-0.28px] leading-[20px] border-none outline-none focus:ring-0 p-0"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions vertical dots */}
                  <button 
                    onClick={() => handleRemoveQuizQuestion(qIdx)}
                    className="text-[#606060] hover:text-[#FF6B00] transition-colors p-[2px] shrink-0 mt-[12px]"
                  >
                    <More size={24} variant="Linear" color="#606060" className="rotate-90" />
                  </button>
                </div>
              ))}
            </div>

            <button 
              onClick={handleAddQuizQuestion}
              className="flex items-center gap-[6px] h-[32px] px-[12px] text-[#0A60E1] hover:text-[#0A50C5] transition-all font-normal text-[16px] tracking-[-0.32px] self-start"
            >
              <Edit2 size={24} variant="Linear" color="#0A60E1" />
              <span>Customize your quiz</span>
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between w-full pt-[24px] border-t border-[#F0F0F0]">
          <AppButton 
            variant="app-outline" 
            onClick={onBack}
            leftIcon={<ArrowLeft2 size={24} variant="Linear" color="#0A60E1" />}
          >
            Go back
          </AppButton>
          <AppButton 
            variant="app-primary"
            onClick={onBack}
            rightIcon={<ArrowRight2 size={24} variant="Linear" color="#FFFFFF" />}
          >
            Publish lesson
          </AppButton>
        </div>
      </div>

      {/* Right Sidebar - Component layout blocks (3 columns layout, width 337px matching Figma) */}
      <div className="w-[337px] h-full bg-[#FDFDFD] border-l border-[#F0F0F0] px-[20px] py-[32px] flex flex-col gap-[20px] shrink-0 overflow-y-auto">
        <span className="text-[14px] font-semibold text-[#202020] tracking-[-0.28px]">
          General
        </span>
        <div className="grid grid-cols-3 gap-[10px] w-full">
          {GENERAL_BLOCKS.map((block, idx) => (
            <div 
              key={idx}
              className="h-[78px] w-[92px] border border-[#F0F0F0] rounded-[8px] hover:border-[#D9D9D9] hover:shadow-sm bg-white cursor-pointer flex flex-col items-center justify-center gap-[8px] transition-all shrink-0"
            >
              <span className="text-[18px] font-medium text-[#0A60E1]">{block.icon}</span>
              <span className="text-[14px] text-[#606060] text-center font-normal truncate w-full px-[4px] tracking-[-0.28px]">
                {block.label}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
