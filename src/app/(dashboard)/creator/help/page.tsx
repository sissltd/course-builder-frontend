import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help",
};

export default function HelpPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-display-xs font-semibold text-sd-grey-12">Help & Support</h1>
      <p className="text-body-lg text-sd-grey-11">Get assistance with any issues.</p>
    </div>
  );
}
