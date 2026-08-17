import React from "react";
import Image from "next/image";
import { Play, PlayCircle, Clock, Sound, Trash, More, InfoCircle } from "iconsax-react";
import { scriptDescription, scriptBody, scriptObjectives } from "../../data/mockData";
import { ScriptSectionCard, ScriptField, ScriptObjectiveItem } from "../SharedUI";

export const ScriptTab = () => {
  return (
    <div className="flex flex-col gap-[40px]">
      <ScriptSectionCard className="p-[16px]">
        <div className="flex min-h-[404px] flex-col">
          <div className="flex items-start justify-between gap-[24px]">
            <div>
              <h1 className="text-[16px] font-semibold leading-[24px] text-sd-grey-12">
                Module 1: Artificial Computing
              </h1>
              <div className="mt-[8px] flex items-center gap-[12px] text-[14px] font-normal leading-[20px] text-sd-reviewer-muted">
                <span>Total lessons (4)</span>
                <span>Time (45mins)</span>
              </div>
            </div>
            <div className="flex h-[20px] items-center gap-[16px] text-sd-grey-11">
              <button type="button" className="transition-colors hover:text-sd-danger" aria-label="Delete">
                <Trash size={20} variant="Linear" color="currentColor" />
              </button>
              <button type="button" className="transition-colors hover:text-sd-grey-12" aria-label="More options">
                <More size={20} variant="Linear" color="currentColor" />
              </button>
            </div>
          </div>

          <div className="mt-[24px] flex flex-col gap-[20px]">
            <ScriptField label="Title">
              Introduction to Artificial Computing
            </ScriptField>

            <ScriptField
              label="Discription"
              className="min-h-[84px]"
              invalid
              helper="450/500 words (Description short of 50 words)"
            >
              {scriptDescription}
            </ScriptField>

            <ScriptField label="Objective" className="min-h-[64px]">
              At the end of this module, you will be able to understand what Artificial intelligence
              is and how it plays a role in modern computing. Its basics, and how to interpret basic
              language using python and other language
            </ScriptField>
          </div>
        </div>
      </ScriptSectionCard>

      <div className="flex items-center gap-[12px]">
        <PlayCircle size={24} variant="Linear" color="var(--sd-grey-11)" />
        <h2 className="text-[22px] font-semibold leading-[28px] text-sd-grey-12">
          Lesson 1: Meaning of Computer
        </h2>
      </div>

      <ScriptSectionCard className="p-[16px]">
        <h2 className="text-[18px] font-semibold leading-[24px] text-sd-grey-12">Media</h2>
        <div className="relative mt-[11px] h-[309px] overflow-hidden rounded-[10px] bg-sd-grey-3">
          <Image
            src="/assets/dashboard/course-img.jpg"
            alt="Lesson media preview"
            fill
            className="object-cover"
            sizes="801px"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              type="button"
              className="flex size-[56px] items-center justify-center rounded-full bg-sd-grey-11/80 text-sd-grey-1 transition-all hover:scale-105 hover:bg-sd-grey-12/90"
              aria-label="Play lesson media"
            >
              <Play size={24} variant="Bold" color="currentColor" />
            </button>
          </div>
        </div>

        <div className="mt-[16px] flex flex-wrap items-center gap-[12px] text-[14px] font-normal leading-[20px] text-sd-grey-12">
          <span className="flex h-[36px] items-center gap-[6px]">
            <Clock size={14} variant="Linear" color="currentColor" />
            <span>Duration</span>
            <span className="text-sd-reviewer-muted">1:32mins</span>
          </span>
          <span className="flex h-[36px] items-center gap-[6px]">
            <PlayCircle size={14} variant="Linear" color="currentColor" />
            <span>Resolution</span>
            <span className="text-sd-reviewer-muted">1080p</span>
          </span>
          <span className="flex h-[36px] items-center gap-[6px]">
            <Sound size={14} variant="Linear" color="currentColor" />
            <span>Audio Quality</span>
            <span className="text-sd-reviewer-muted">-16 LUFS</span>
          </span>
        </div>
      </ScriptSectionCard>

      <ScriptSectionCard className="p-[16px]">
        <h2 className="text-[16px] font-semibold leading-[24px] text-sd-grey-12">
          Lesson Script <span className="text-sd-reviewer-muted">(450/500) words</span>
        </h2>
        <div className="mt-[16px] rounded-[16px] bg-sd-grey-1 text-[14px] font-normal leading-[20px] text-sd-reviewer-muted">
          {scriptBody.map((paragraph) => (
            <p key={paragraph} className="mb-[16px] last:mb-0">
              {paragraph}
            </p>
          ))}
        </div>
        <div className="mt-[20px] flex items-start gap-[12px] rounded-[8px] border-l-2 border-l-[#FA8500] bg-[#FFF8EB] px-[12px] py-[11px] text-[12px] font-normal leading-[16px] text-sd-grey-12">
          <InfoCircle size={16} variant="Bold" color="#B77815" className="mt-[1px] shrink-0" />
          <span>
            Plagiarism 13% similarity, approaching the 15% threshold. Section 2 of this lesson is
            the flagged passage. Borderline; reviewer judgement required.
          </span>
        </div>
        <p className="mt-[12px] text-[12px] font-normal leading-[16px] text-sd-danger">
          Source: <span className="underline">scdc.com/informationtech/computer language</span>
        </p>
      </ScriptSectionCard>

      <ScriptSectionCard className="p-[16px]">
        <h2 className="text-[16px] font-semibold leading-[24px] text-sd-grey-12">
          Lesson Objectives <span className="text-sd-reviewer-muted">(4/5) words</span>
        </h2>
        <div className="mt-[12px] flex flex-col gap-[12px]">
          {scriptObjectives.map((objective) => (
            <ScriptObjectiveItem key={objective.number} {...objective} />
          ))}
        </div>
      </ScriptSectionCard>
    </div>
  );
};
