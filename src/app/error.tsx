"use client";

import React, { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Automatically recover from ChunkLoadError caused by stale dev chunks
    if (
      error.name === "ChunkLoadError" ||
      error.message?.includes("Failed to load chunk") ||
      error.message?.includes("Loading chunk")
    ) {
      window.location.reload();
    }
  }, [error]);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-[16px] p-6 text-center">
      <div className="flex flex-col gap-[6px]">
        <h2 className="text-[18px] font-semibold text-sd-grey-12">
          Unable to load page
        </h2>
        <p className="text-[14px] text-sd-reviewer-muted max-w-md">
          {error.message?.includes("Failed to load chunk")
            ? "A newer version of the page was compiled. Reloading..."
            : error.message || "An unexpected error occurred."}
        </p>
      </div>
      <div className="flex gap-[12px]">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-[8px] bg-sd-blue px-[16px] py-[8px] text-[14px] font-medium text-white hover:bg-sd-blue-hover cursor-pointer"
        >
          Reload Page
        </button>
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-[8px] border border-sd-grey-4 bg-sd-grey-1 px-[16px] py-[8px] text-[14px] font-medium text-sd-grey-12 hover:bg-sd-grey-2 cursor-pointer"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
