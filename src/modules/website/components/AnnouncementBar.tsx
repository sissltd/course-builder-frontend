"use client";

import { CloseCircle } from "iconsax-react";
import { useSyncExternalStore } from "react";

const STORAGE_KEY = "sd-announcement-dismissed";

const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const getSnapshot = () =>
  typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY) === "1";

const getServerSnapshot = () => false;

export function AnnouncementBar() {
  const dismissed = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (dismissed) return null;

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    listeners.forEach((listener) => listener());
  };

  return (
    <div className="relative flex h-[44px] items-center justify-center bg-[#B3D3FF] px-12">
      <p className="text-caption-xs font-medium leading-4 text-sd-black">
        Join today to secure a percent discount on all courses created
      </p>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss announcement"
        className="absolute right-6 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-60 md:right-10"
      >
        <CloseCircle variant="Linear" color="#202020" size={24} />
      </button>
    </div>
  );
}
