import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react"; 

interface AuthHeaderNavProps {
  onBack?: () => void;
}

export const AuthHeaderNav = ({ onBack }: AuthHeaderNavProps) => {
  return (
    <div className="w-full h-auto py-4 flex items-center justify-between z-30">
      <div className="flex items-center gap-[10px]">
        <Button 
          variant="ghost" 
          onClick={onBack || (() => window.history.back())}
          className="flex items-center gap-[8px] px-2 text-sd-grey-12 hover:bg-transparent"
        >
          <ChevronLeft className="size-5" />
          <span className="font-sans font-normal text-body-sm">Back</span>
        </Button>
      </div>
      {/* Circular profile removed as per latest design requirements */}
    </div>
  );
};
