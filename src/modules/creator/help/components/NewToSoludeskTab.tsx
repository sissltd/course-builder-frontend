"use client";

import React from "react";

const tutorials = [
  {
    id: 1,
    duration: "2:00min",
    title: "Account setting",
    description:
      "Learn effective way to set up your account without nay hassle or delay.",
  },
  {
    id: 2,
    duration: "2:00min",
    title: "Creating a course",
    description:
      "Learn effective way to set up your account without nay hassle or delay.",
  },
  {
    id: 3,
    duration: "2:00min",
    title: "Account setting",
    description:
      "Learn effective way to set up your account without nay hassle or delay.",
  },
  {
    id: 4,
    duration: "2:00min",
    title: "Creating a course",
    description:
      "Learn effective way to set up your account without nay hassle or delay.",
  },
];

export const NewToSoludeskTab = () => {
  return (
    <div className="flex flex-col gap-[40px] w-full">
      <div className="flex flex-col gap-[12px]">
        <h2 className="text-[24px] font-semibold text-[#202020] tracking-[-0.48px] leading-[32px]">
          New to Soludesk
        </h2>
        <p className="text-[16px] text-[#606060] leading-[24px]">
          Take a quick tour around soludesk
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
        {tutorials.map((tutorial) => (
          <div
            key={tutorial.id}
            className="border-2 border-[#F0F0F0] rounded-[16px] overflow-hidden flex flex-col"
          >
            <div className="bg-[#C0C3C6] h-[160px] w-full" />
            <div className="flex flex-col gap-[8px] p-[12px]">
              <div className="bg-white inline-flex items-center justify-center px-[6px] py-[4px] rounded-[6px] w-fit">
                <span className="text-[12px] font-medium text-[#606060] leading-[16px]">
                  {tutorial.duration}
                </span>
              </div>
              <h3 className="text-[16px] font-semibold text-[#202020] tracking-[-0.32px] leading-[24px]">
                {tutorial.title}
              </h3>
              <p className="text-[12px] font-medium text-[#B6B6B6] leading-[16px] line-clamp-2">
                {tutorial.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
