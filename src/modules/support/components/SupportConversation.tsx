import React from "react";
import { InfoCircle, TickCircle } from "iconsax-react";
import type { SupportConversationMessage, SupportRequest } from "../types";
import { formatSupportDateTime } from "../utils/format";
import { EmptyState } from "@/components/shared/EmptyState";

interface SupportConversationProps {
  request: SupportRequest;
  /**
   * Extra turns to render ahead of the submitter's own message.
   *
   * The API exposes no message, reply or comment endpoint, so today this is
   * always empty and the thread is built from `message` + `resolution_notes`
   * alone. It exists so that adding a replies endpoint later is a data change
   * here — pass the fetched turns and they appear — rather than a redesign of
   * this component. There is deliberately no composer: nothing to post to.
   */
  messages?: SupportConversationMessage[];
}

const Entry = ({
  author,
  body,
  sentAt,
  tone,
}: {
  author: string;
  body: string;
  sentAt: string;
  tone: "submitter" | "resolution";
}) => (
  <div
    className={`flex flex-col gap-[6px] rounded-[12px] border p-[14px] ${
      tone === "resolution"
        ? "border-sd-grey-4 bg-sd-grey-1"
        : "border-sd-blue-light bg-[#F5F9FF]"
    }`}
  >
    <div className="flex items-center justify-between gap-[12px]">
      <span className="flex items-center gap-[6px] text-[14px] font-medium leading-[20px] text-sd-grey-12">
        {tone === "resolution" ? (
          <TickCircle variant="Linear" size={16} color="#3C7E44" />
        ) : (
          <InfoCircle variant="Linear" size={16} color="#0A60E1" />
        )}
        {author}
      </span>
      <span className="shrink-0 text-[12px] leading-[16px] text-sd-grey-11">
        {sentAt}
      </span>
    </div>
    <p className="text-[14px] leading-[22px] text-sd-grey-11 whitespace-pre-wrap break-words">
      {body}
    </p>
  </div>
);

/**
 * The read-only thread for one support request: the submitter's message, any
 * future turns, and the resolution notes once the request has been decided.
 *
 * Resolve is final on the backend, so a resolved request gains exactly one more
 * turn and never changes again — which is why this renders a summary rather than
 * a chat composer.
 */
export const SupportConversation = ({
  request,
  messages = [],
}: SupportConversationProps) => {
  const hasMessage = !!request.message?.trim();
  const hasResolution = !!request.resolution_notes?.trim();
  const hasThread = hasMessage || hasResolution || messages.length > 0;

  if (!hasThread) {
    return (
      <EmptyState
        title="Nothing to show yet"
        description="This request has no message attached."
      />
    );
  }

  return (
    <div className="flex flex-col gap-[12px]">
      {hasMessage && (
        <Entry
          tone="submitter"
          author={`${request.first_name ?? ""} ${request.last_name ?? ""}`.trim() || "Submitter"}
          body={request.message}
          sentAt={formatSupportDateTime(request.created_datetime)}
        />
      )}

      {messages.map((message) => (
        <Entry
          key={message.id}
          tone="submitter"
          author={message.author}
          body={message.body}
          sentAt={formatSupportDateTime(message.sentAt)}
        />
      ))}

      {hasResolution && (
        <Entry
          tone="resolution"
          author="Resolution"
          body={request.resolution_notes as string}
          sentAt={formatSupportDateTime(request.resolved_at)}
        />
      )}
    </div>
  );
};
