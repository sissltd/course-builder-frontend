import React from "react";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  /** Background color class for the icon container, e.g. "bg-[#EBF3FF]".
   *  When omitted the card uses the dashboard-style inset icon (white bg + border). */
  iconBg?: string;
  /** Extra classes applied to the card wrapper */
  className?: string;
}

/**
 * Shared stat card used across Dashboard overview, My Courses overview,
 * Wallet overview, and any future pages that need a KPI tile.
 */
export const StatCard = ({ label, value, icon, iconBg, className }: StatCardProps) => {
   return (
     <div
       className={cn(
         "flex flex-1 min-w-[180px] items-center gap-[12px] h-[86px] px-[16px] py-[12px] rounded-[12px] relative overflow-hidden group transition-colors bg-sd-grey-3/80 border border-sd-grey-4",
         className
       )}
     >
       {/* Icon container */}
       <div
         className={cn(
           "flex items-center justify-center p-[10px] rounded-[8px] shrink-0 size-[44px] border border-sd-grey-4 bg-white",
         )}
       >
         {icon}
       </div>

       {/* Text */}
       <div className="flex flex-col gap-[4px] relative z-10">
         <p className="text-[16px] text-sd-grey-11 whitespace-nowrap tracking-[-0.32px] leading-[24px] font-normal">
           {label}
         </p>
         <p className="text-[16px] font-normal text-sd-grey-12 tracking-[-0.32px] leading-[24px]">
           {value}
         </p>
       </div>

       {/* Glass/Bevel Effect Inset Shadow */}
       <div className="absolute inset-[-1px] pointer-events-none rounded-[inherit] shadow-[inset_0px_-4px_8px_0px_rgba(255,255,255,0.2),inset_0px_4px_8px_0px_rgba(255,255,255,0.16)]" />
     </div>
   );
 };
