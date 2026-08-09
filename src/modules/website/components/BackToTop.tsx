"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={cn(
        "fixed bottom-8 right-8 z-50 flex items-center gap-[10px] rounded-full px-[12px] py-[8px] text-left transition-all duration-300 hover:bg-sd-grey-3/70",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      )}
    >
      <Image
        src="/assets/website/arrow-up-regular.svg"
        alt=""
        width={20}
        height={20}
        className="size-5 shrink-0"
      />
      <span className="whitespace-nowrap text-[14px] leading-[1.4] tracking-[-0.28px] text-sd-grey-11">
        Back to Top
      </span>
    </button>
  );
}
