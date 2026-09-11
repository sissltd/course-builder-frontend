"use client";

import React from "react";
import Image from "next/image";

const sections = [
  {
    title: "1. Preparing your content",
    content:
      "Creating a digital course starts with choosing a clear topic that solves a specific problem or teaches a valuable skill. Focus on a defined audience so your content feels relevant and practical.\n\nNext, outline your course structure by breaking the topic into modules and lessons. Keep each lesson focused and easy to follow. Then, create your content\u2014this could include video recordings, slides, worksheets, or quizzes. Aim for clarity over complexity.",
  },
  {
    title: "2. Preparing your content",
    content:
      "Creating a digital course starts with choosing a clear topic that solves a specific problem or teaches a valuable skill. Focus on a defined audience so your content feels relevant and practical.\n\nNext, outline your course structure by breaking the topic into modules and lessons. Keep each lesson focused and easy to follow. Then, create your content\u2014this could include video recordings, slides, worksheets, or quizzes. Aim for clarity over complexity.",
  },
  {
    title: "3. Preparing your content",
    content:
      "Creating a digital course starts with choosing a clear topic that solves a specific problem or teaches a valuable skill. Focus on a defined audience so your content feels relevant and practical.\n\nNext, outline your course structure by breaking the topic into modules and lessons. Keep each lesson focused and easy to follow. Then, create your content\u2014this could include video recordings, slides, worksheets, or quizzes. Aim for clarity over complexity.",
  },
];

export const ArticleDetailPage = () => {
  return (
    <div className="flex flex-col items-center w-full py-[40px] px-[20px]">
      <div className="w-full max-w-[700px] flex flex-col gap-[32px]">
        <h1 className="text-[28px] font-semibold text-[#202020] text-center leading-[36px]">
          How to structure a course Module
        </h1>

        <div className="rounded-[16px] overflow-hidden h-[224px] w-full relative">
          <Image
            src="/assets/help/articles/course-module.png"
            alt="How to structure a course Module"
            fill
            className="object-cover rounded-[16px]"
            priority
          />
        </div>

        <div className="flex flex-col gap-[32px]">
          {sections.map((section, index) => (
            <div key={index} className="flex flex-col gap-[12px]">
              <h3 className="text-[16px] font-semibold text-[#202020] leading-[24px]">
                {section.title}
              </h3>
              <div className="text-[14px] text-[#606060] leading-[20px] tracking-[-0.28px] whitespace-pre-line pl-[10.5px]">
                {section.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
