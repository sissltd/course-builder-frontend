import React from "react";

export const LoadingState = ({ message = "Signing you in..." }: { message?: string }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-[24px] min-h-[400px]">
      <div className="relative size-[114px]">
        {/* Simple CSS Spinner as placeholder for Loading_Animation_5 */}
        <div className="absolute inset-0 border-[4px] border-[#F0F0F0] rounded-full" />
        <div className="absolute inset-0 border-[4px] border-[#0063EF] border-t-transparent rounded-full animate-spin" />
      </div>
      <p className="font-sans font-normal text-body-sm text-[#202020]">
        {message}
      </p>
    </div>
  );
};
