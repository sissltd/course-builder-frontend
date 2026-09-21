import React from "react";
import Link from "next/link";
import { Button } from "@/components/shared/Button";
import { Add, Magicpen } from "iconsax-react";
import { CreatorRoute } from "@/lib/routes";

export const JourneyCard = () => {
  return (
    <div className="w-full bg-[#FDFDFD] border border-[#C3DEF3] rounded-[16px] p-[20px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.1)] flex items-center justify-between gap-[16px] flex-wrap">
      <div className="flex flex-col gap-[6px] min-w-0 flex-1">
        <h2 className="text-[20px] font-semibold text-[#202020] leading-[28px]">
          Start your journey to building digital courses
        </h2>
        <p className="text-[16px] text-[#636363] leading-[24px]">
          Join thousands of competitors and start creating courses while your earn from it
        </p>
      </div>

      <div className="flex items-center gap-[12px] shrink-0">
        <Link href={CreatorRoute.COURSES_CREATE}>
          <Button
            variant="app-outline"
            size="lg"
            leftIcon={<Add size={18} variant="Linear" color="#0063EF" />}
          >
            Create a course
          </Button>
        </Link>
        <Link href={CreatorRoute.COURSES_AI_CREATE}>
          <Button
            variant="app-primary"
            size="lg"
            leftIcon={<Magicpen size={18} variant="Linear" color="#FFF" />}
          >
            Create with AI
          </Button>
        </Link>
      </div>
    </div>
  );
};
