"use client";

import { Button } from "@/components/shared/Button";
import { useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const subscribe = (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
  };

  if (subscribed) {
    return (
      <p className="text-[14px] leading-5 text-sd-blue">
        You&apos;re on the list — watch your inbox for updates.
      </p>
    );
  }

  return (
    <form onSubmit={subscribe} className="flex w-full flex-col gap-3 sm:flex-row sm:items-start">
      <input
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Enter address"
        className="h-[44px] w-full rounded-[8px] border border-[#D9D9D9] bg-[#FDFDFD] px-4 py-3 text-[14px] text-[#8C8C8C] outline-none transition-colors focus:border-sd-blue sm:w-[377px]"
      />
      <Button type="submit" variant="app-primary" size="app" className="h-[44px] text-[14px]">
        Subscribe
      </Button>
    </form>
  );
}
