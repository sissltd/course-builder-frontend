import React from "react";
import { cn } from "@/lib/utils";
import { 
  Money, 
  Wallet, 
  Book, 
  Eye 
} from "iconsax-react";

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
}

const StatCard = ({ label, value, icon }: StatCardProps) => {
  return (
    <div className="flex flex-1 items-center gap-[12px] h-[86px] px-[16px] py-[12px] bg-[#F0F0F0]/80 border border-[#E8E8E8] rounded-[12px] relative overflow-hidden group transition-colors">
      <div className="bg-[#FDFDFD] border border-[#E8E8E8] flex items-center justify-center p-[10px] relative rounded-[8px] shrink-0 size-[44px]">
        {icon}
      </div>
      <div className="flex flex-col gap-[8px]">
        <p className="text-[16px] text-[#606060] whitespace-nowrap tracking-[-0.32px] leading-[24px] font-normal">{label}</p>
        <p className="text-[16px] font-normal text-[#202020] tracking-[-0.32px] leading-[24px]">{value}</p>
      </div>
      <div className="absolute inset-[-1px] pointer-events-none rounded-[inherit] shadow-[inset_0px_-4px_8px_0px_rgba(255,255,255,0.2),inset_0px_4px_8px_0px_rgba(255,255,255,0.16)]" />
    </div>
  );
};

export const CreatorOverview = () => {
  return (
    <div className="flex flex-col gap-[10px] w-full bg-[#FDFDFD] border-[1.5px] border-[#F0F0F0] rounded-[20px] pb-[16px] pt-[20px] px-[16px]">
      <h2 className="text-[20px] font-semibold text-[#202020] leading-[28px]">Creator’s overview</h2>
      <div className="flex items-center gap-[11px] w-full">
        <StatCard 
          label="Total amount earned" 
          value="$456,000.03" 
          icon={<Money size={28} variant="Bulk" color="#0A60E1" />} 
        />
        <StatCard 
          label="Wallet Balance" 
          value="$456,000" 
          icon={<Wallet size={28} variant="Bulk" color="#0A60E1" />} 
        />
        <StatCard 
          label="Total courses" 
          value="32" 
          icon={<Book size={28} variant="Bulk" color="#FF5025" />} 
        />
        <StatCard 
          label="In review" 
          value="12" 
          icon={<Eye size={28} variant="Bulk" color="#F2994A" />} 
        />
      </div>
    </div>
  );
};
