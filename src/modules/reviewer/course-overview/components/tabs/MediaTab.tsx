import React from "react";
import Image from "next/image";
import { PlayCircle, VideoPlay, Timer1, Monitor, VolumeHigh } from "iconsax-react";
import { LibraryBig } from "lucide-react";

export const MediaTab = () => {
  return (
    <div className="flex flex-col gap-[20px]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[12px]">
        {[
          { label: "Total Video", value: "12", icon: VideoPlay },
          { label: "Total Duration", value: "4hr 24m", icon: LibraryBig },
          { label: "Total File Size", value: "300mb", icon: PlayCircle }
        ].map((stat) => (
          <div key={stat.label} className="flex min-h-[58px] items-center gap-[12px] rounded-[10px] border border-sd-grey-3 bg-sd-grey-1 px-[14px] py-[12px] shadow-[0_1px_0_rgba(0,0,0,0.02)]">
            <div className="flex size-[36px] items-center justify-center rounded-[8px] border border-sd-blue-light text-sd-blue bg-white">
              <stat.icon size={20} color="currentColor" />
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="text-[18px] font-semibold leading-[24px] text-sd-grey-12">
                {stat.value}
              </span>
              <span className="text-[12px] leading-[16px] text-sd-reviewer-muted">
                {stat.label}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-[12px] border border-sd-grey-3 bg-sd-grey-1 p-[16px]">
        <div className="mb-[12px] text-[14px] font-semibold leading-[20px] text-sd-grey-12">
          Preview Video
        </div>
        <div className="relative overflow-hidden rounded-[10px] border border-sd-grey-3 bg-sd-grey-2">
          <Image
            src="/assets/dashboard/course-img.jpg"
            alt="Media preview"
            width={1200}
            height={680}
            className="h-[360px] w-full object-cover"
            priority
          />
          <div className="absolute bottom-[24px] left-[24px] right-[24px] flex items-center gap-[16px]">
            <span className="text-[12px] font-medium text-white drop-shadow-md">03:24 / 03:24</span>
            <div className="h-[4px] flex-1 overflow-hidden rounded-full bg-white/30 backdrop-blur-sm">
              <div className="h-full w-[40%] bg-white rounded-full" />
            </div>
            <span className="text-[12px] font-medium text-white drop-shadow-md">03:24 / 03:24</span>
          </div>
        </div>
        <div className="mt-[16px] flex flex-wrap items-center gap-[24px] text-[12px] font-medium leading-[16px] text-sd-grey-12">
          <span className="flex items-center gap-[6px]">
            <Timer1 size={16} variant="Linear" color="var(--sd-reviewer-muted)" />
            <span>Duration <span className="font-normal text-sd-reviewer-muted ml-[2px]">1:32mins</span></span>
          </span>
          <span className="flex items-center gap-[6px]">
            <Monitor size={16} variant="Linear" color="var(--sd-reviewer-muted)" />
            <span>Resolution <span className="font-normal text-sd-reviewer-muted ml-[2px]">1080p</span></span>
          </span>
          <span className="flex items-center gap-[6px]">
            <VolumeHigh size={16} variant="Linear" color="var(--sd-reviewer-muted)" />
            <span>Audio Quality <span className="font-normal text-sd-reviewer-muted ml-[2px]">-16 LUFS</span></span>
          </span>
        </div>
      </div>

      <div className="rounded-[12px] border border-sd-grey-3 bg-sd-grey-1 p-[18px]">
        <h2 className="text-[16px] font-semibold leading-[24px] text-sd-grey-12">
          Media properties
        </h2>
        <div className="mt-[16px] grid grid-cols-1 md:grid-cols-3 gap-[16px]">
          {[
            { label: "Resolution", value: "1290x400 (16:9)", status: "Pass" },
            { label: "Audio Quality", value: "16LUFS", status: "Pass" },
            { label: "Format", value: "MP4 (H.264)", status: "Pass" },
            { label: "Duration", value: "1hr 20m", status: "Pass" },
            { label: "File Size", value: "20.4mb", status: "Pass" },
            { label: "SRT", value: "2kb", status: "Pass" }
          ].map((prop) => (
            <div key={prop.label} className="flex items-center justify-between rounded-[8px] border border-sd-grey-3 bg-sd-grey-1 p-[12px]">
              <div className="flex flex-col gap-[4px]">
                <span className="text-[12px] font-medium text-sd-grey-12">{prop.label}</span>
                <span className="text-[12px] font-normal text-sd-reviewer-muted">{prop.value}</span>
              </div>
              <span className="rounded-[4px] bg-[#EAFBF3] px-[8px] py-[2px] text-[10px] font-semibold text-[#16A34A] uppercase">
                {prop.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
