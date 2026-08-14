"use client";

import React, { useState } from "react";
import { ArrowDown2 } from "iconsax-react";
import { Switch } from "./Switch";
import { Button } from "@/components/shared/Button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export const QueueBehaviourTab = () => {
  const [autoAdvance, setAutoAdvance] = useState(false);
  const [trackPreference, setTrackPreference] = useState("both");

  return (
    <div className="flex w-full flex-col gap-[24px]">
      <div className="flex flex-col gap-[8px]">
        <h2 className="text-[22px] font-medium leading-[32px] tracking-[-0.48px] text-sd-grey-12">
          Queue Behaviour
        </h2>
        <p className="text-[14px] font-normal leading-[24px] tracking-[-0.28px] text-sd-grey-11">
          Control how courses are sorted and surfaced in your review queue
        </p>
      </div>

      <div className="flex flex-col gap-[24px] rounded-[12px] border border-sd-grey-3 p-[24px]">
        {/* Default sort order */}
        <div className="flex items-center justify-between gap-[24px]">
          <div className="flex flex-col gap-[4px]">
            <span className="text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-sd-grey-12">
              Default sort order
            </span>
            <span className="text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-sd-grey-11">
              How courses are ordered when you open the queue
            </span>
          </div>
          <div className="relative flex w-[160px] items-center">
            <select className="flex h-[40px] w-full appearance-none rounded-[8px] border border-sd-grey-4 bg-white pl-[16px] pr-[36px] text-[14px] font-normal text-sd-grey-11 outline-none focus:border-sd-blue cursor-pointer">
              <option value="oldest">Oldest First</option>
              <option value="newest">Newest First</option>
            </select>
            <ArrowDown2
              size={18}
              variant="Linear"
              color="var(--sd-grey-11)"
              className="absolute right-[12px] pointer-events-none"
            />
          </div>
        </div>

        {/* Auto-advance */}
        <div className="flex items-center justify-between gap-[24px]">
          <div className="flex flex-col gap-[4px]">
            <span className="text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-sd-grey-12">
              Auto-advance on decision
            </span>
            <span className="text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-sd-grey-11">
              Load next course immediately after approval or rejection
            </span>
          </div>
          <Switch checked={autoAdvance} onChange={setAutoAdvance} />
        </div>
      </div>

      <div className="flex flex-col gap-[24px] rounded-[12px] border border-sd-grey-3 p-[24px]">
        <h3 className="mb-[20px] block text-[14px] font-medium uppercase leading-[20px] tracking-[-0.28px] text-sd-grey-12">
          TRACK PREFERENCE
        </h3>

        <RadioGroup
          value={trackPreference}
          onValueChange={setTrackPreference}
          className="flex flex-col gap-[24px]"
        >
          {/* AI track */}
          <div className="flex items-center justify-between gap-[24px] cursor-pointer" onClick={() => setTrackPreference("ai")}>
            <div className="flex flex-col gap-[4px]">
              <span className="text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-sd-grey-12">
                Show AI track courses
              </span>
              <span className="text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-sd-grey-11">
                Include APE-produced course in your queue
              </span>
            </div>
            <RadioGroupItem value="ai" id="track-ai" className="size-[20px] cursor-pointer" />
          </div>

          {/* Creator track */}
          <div className="flex items-center justify-between gap-[24px] cursor-pointer" onClick={() => setTrackPreference("creator")}>
            <div className="flex flex-col gap-[4px]">
              <span className="text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-sd-grey-12">
                Show creator track courses
              </span>
              <span className="text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-sd-grey-11">
                Include human-submitted courses in your queue
              </span>
            </div>
            <RadioGroupItem value="creator" id="track-creator" className="size-[20px] cursor-pointer" />
          </div>

          {/* Both track */}
          <div className="flex items-center justify-between gap-[24px] cursor-pointer" onClick={() => setTrackPreference("both")}>
            <div className="flex flex-col gap-[4px]">
              <span className="text-[16px] font-normal leading-[24px] tracking-[-0.32px] text-sd-grey-12">
                Show both track
              </span>
              <span className="text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-sd-grey-11">
                Include all type of courses in your queue
              </span>
            </div>
            <RadioGroupItem value="both" id="track-both" className="size-[20px] cursor-pointer" />
          </div>
        </RadioGroup>
      </div>

      <div className="flex justify-end">
        <Button
          type="button"
          size="app"
          className="h-[44px] rounded-[8px] bg-[#0056D2] px-[24px] text-[14px] font-medium text-white hover:bg-[#0047B8]"
        >
          Save changes
        </Button>
      </div>
    </div>
  );
};
