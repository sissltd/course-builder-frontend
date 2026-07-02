"use client";

import React from "react";
import { ArrowLeft2, ArrowRight2, TickCircle, InfoCircle } from "iconsax-react";
import { Button } from "@/components/shared/Button";
import { useAppSelector } from "@/redux";

interface QualityCheckStepProps {
  onNext?: () => void;
  onBack?: () => void;
  onPreview?: () => void;
}

interface QualityCheckItemProps {
  label: string;
  passed: boolean;
  warning?: string;
}

const QualityCheckItem = ({ label, passed, warning }: QualityCheckItemProps) => {
  return (
    <div className="flex flex-col gap-[8px]">
      <div className="flex items-center gap-[12px]">
        <TickCircle size={24} variant="Bold" color={passed ? "#0A60E1" : "#D9D9D9"} />
        <span className="text-[16px] text-[#202020] leading-[24px] tracking-[-0.32px]">
          {label}
        </span>
      </div>
      {warning && (
        <div className="flex items-center gap-[8px] pl-[36px]">
          <InfoCircle size={16} variant="Linear" color="#FF5025" />
          <span className="text-[14px] text-[#FF5025] leading-[20px]">
            {warning}
          </span>
        </div>
      )}
    </div>
  );
};

export const QualityCheckStep = ({ onNext, onBack, onPreview }: QualityCheckStepProps) => {
  const courseInfo = useAppSelector((state) => state.courseBuilder.courseInformation);
  const modules = useAppSelector((state) => state.courseBuilder.modules);
  const version = useAppSelector((state) => state.courseBuilder.version);

  const hasTitle = courseInfo.courseTitle.trim().length > 0;
  const descWordCount = courseInfo.description.trim() === "" ? 0 : courseInfo.description.trim().split(/\s+/).length;
  const hasDescription = descWordCount > 0;
  const descMeetsMin = descWordCount >= 10;
  const objectivesCount = courseInfo.objectives.length;
  const hasObjectives = objectivesCount > 0;
  const objectivesMeetMin = objectivesCount >= 5;
  const hasTags = courseInfo.tags.length >= 3;
  const hasDuration = courseInfo.hours > 0 || courseInfo.minutes > 0 || courseInfo.seconds > 0;
  const hasCoverVideo = courseInfo.coverVideo !== null;
  const hasThumbnail = !!courseInfo.thumbnail;

  const hasModuleObjectives = modules.some((m) => m.objectives.length > 0);
  const hasVersion = version.trim().length > 0;
  const allModulesHaveTitle = modules.length > 0 && modules.every((m) => m.title.trim().length > 0);
  const allModulesHaveDescription = modules.length > 0 && modules.every((m) => m.description.trim().length > 0);
  const allModulesHaveObjectives = modules.length > 0 && modules.every((m) => m.objectives.length > 0);
  const hasLessons = modules.some((m) => m.lessons.length > 0);
  const hasQuiz = modules.some(
    (m) =>
      m.quizQuestions.length > 0 ||
      m.lessons.some((l) => l.type === "quiz" || (l.quizQuestions && l.quizQuestions.length > 0))
  );

  return (
    <div className="w-full bg-[#FDFDFD] pl-[24px] pr-[200px] py-[40px] flex flex-col gap-[40px] pb-[100px]">
      {/* Title Section */}
      <div className="flex flex-col gap-[12px]">
        <h2 className="text-[24px] font-semibold text-[#202020] tracking-[-0.48px] leading-[32px]">
          Quality check
        </h2>
        <p className="text-[16px] text-[#606060] leading-[24px]">
          Review and confirm your course meets all quality standards before submitting for review
        </p>
      </div>

      {/* Course Information Section */}
      <div className="flex flex-col gap-[20px]">
        <h3 className="text-[20px] font-semibold text-[#202020] tracking-[-0.48px] leading-[28px]">
          Course Information
        </h3>
        <div className="flex flex-col gap-[16px]">
          <QualityCheckItem label="Course title" passed={hasTitle} />
          <QualityCheckItem
            label="Course description"
            passed={hasDescription}
            warning={!descMeetsMin ? "Your description does not meet the minimum requirement" : undefined}
          />
          <QualityCheckItem
            label="Learning objectives"
            passed={hasObjectives}
            warning={!objectivesMeetMin ? "Your course must have at least 5 learning objectives" : undefined}
          />
          <QualityCheckItem label="Tags" passed={hasTags} />
          <QualityCheckItem label="Duration" passed={hasDuration} />
          <QualityCheckItem label="Cover video" passed={hasCoverVideo} />
        </div>
      </div>

      <div className="w-full h-[1px] bg-[#E8E8E8]" />

      {/* Course Outline Section */}
      <div className="flex flex-col gap-[20px]">
        <h3 className="text-[20px] font-semibold text-[#202020] tracking-[-0.48px] leading-[28px]">
          Course Outline
        </h3>
        <div className="flex flex-col gap-[16px]">
          <QualityCheckItem label="Learning objectives" passed={hasModuleObjectives} />
        </div>
      </div>

      <div className="w-full h-[1px] bg-[#E8E8E8]" />

      {/* Version Section */}
      <div className="flex flex-col gap-[20px]">
        <h3 className="text-[20px] font-semibold text-[#202020] tracking-[-0.48px] leading-[28px]">
          Version
        </h3>
        <div className="flex flex-col gap-[16px]">
          <QualityCheckItem label="Course versioning" passed={hasVersion} />
        </div>
      </div>

      <div className="w-full h-[1px] bg-[#E8E8E8]" />

      {/* Course Modules Section */}
      <div className="flex flex-col gap-[20px]">
        <h3 className="text-[20px] font-semibold text-[#202020] tracking-[-0.48px] leading-[28px]">
          Course Modules
        </h3>
        <div className="flex flex-col gap-[16px]">
          <QualityCheckItem label="Title" passed={allModulesHaveTitle} />
          <QualityCheckItem label="Description" passed={allModulesHaveDescription} />
          <QualityCheckItem label="Objectives" passed={allModulesHaveObjectives} />
          <QualityCheckItem label="Lessons" passed={hasLessons} />
          <QualityCheckItem label="Quiz" passed={hasQuiz} />
        </div>
      </div>

      <div className="w-full h-[1px] bg-[#E8E8E8]" />

      {/* Thumbnail Section */}
      <div className="flex flex-col gap-[20px]">
        <h3 className="text-[20px] font-semibold text-[#202020] tracking-[-0.48px] leading-[28px]">
          Thumbnail
        </h3>
        <div className="flex flex-col gap-[16px]">
          <QualityCheckItem label="Thumbnail" passed={hasThumbnail} />
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between w-full pt-[24px] border-t border-[#F0F0F0]">
        <Button
          variant="app-outline"
          onClick={onBack}
          leftIcon={<ArrowLeft2 size={24} variant="Linear" color="#0A60E1" />}
        >
          Go back
        </Button>
        <Button
          variant="app-primary"
          onClick={onPreview || onNext}
          rightIcon={<ArrowRight2 size={24} variant="Linear" color="#FFFFFF" />}
        >
          Preview and Submit
        </Button>
      </div>
    </div>
  );
};
