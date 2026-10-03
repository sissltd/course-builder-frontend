import React from "react";
import { Calendar, Flag2, User } from "iconsax-react";
import {
  formatSupportDate,
  isSupportRequestOverdue,
  supportRequesterName,
} from "../utils/format";
import { SupportKindBadge } from "./SupportKindBadge";

interface SupportRequestMetaRequest {
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  country?: string | null;
  submitted_by_email?: string | null;
  created_datetime?: string | null;
  due_at?: string | null;
  resolved_at?: string | null;
  kind: string;
}

interface SupportRequestMetaProps {
  request: SupportRequestMetaRequest;
  className?: string;
}

const MetaField = ({
  icon,
  label,
  value,
  danger = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  danger?: boolean;
}) => (
  <div className="flex flex-col gap-[4px] min-w-[140px]">
    <span className="text-[12px] leading-[16px] text-sd-grey-11">{label}</span>
    <span
      className={`flex items-center gap-[6px] text-[14px] leading-[20px] ${
        danger ? "text-[#FF5025]" : "text-sd-grey-12"
      }`}
    >
      {icon}
      <span className="truncate">{value}</span>
    </span>
  </div>
);

/**
 * The record's identifying fields — who raised it, where they are, when, and the
 * SLA deadline.
 *
 * The "Email" row is the address a reply reaches. `submitted_by_email` is the
 * account the request was raised under and is null for an anonymous public
 * contact submission, so the two are shown as separate rows rather than
 * collapsed: the queue needs both.
 */
export const SupportRequestMeta = ({
  request,
  className,
}: SupportRequestMetaProps) => {
  const overdue = isSupportRequestOverdue(request);
  const contactEmail = request.email || "Not provided";
  const accountEmail = request.submitted_by_email;
  const dueLabel = request.due_at
    ? overdue
      ? `${formatSupportDate(request.due_at)} — overdue`
      : formatSupportDate(request.due_at)
    : "No deadline";

  return (
    <div className={className}>
      <div className="flex items-center gap-[8px] pb-[16px]">
        <span className="text-[12px] leading-[16px] text-sd-grey-11">Kind</span>
        <SupportKindBadge kind={request.kind} />
      </div>

      <div className="flex flex-col gap-[16px] sm:flex-row sm:flex-wrap">
        <MetaField
          icon={<User variant="Linear" size={16} color="#606060" />}
          label="Name"
          value={supportRequesterName(request)}
        />
        <MetaField
          icon={<User variant="Linear" size={16} color="#606060" />}
          label="Contact email"
          value={contactEmail}
        />
        {accountEmail && (
          <MetaField
            icon={<User variant="Linear" size={16} color="#606060" />}
            label="Account"
            value={accountEmail}
          />
        )}
        {request.country && (
          <MetaField
            icon={<Flag2 variant="Linear" size={16} color="#606060" />}
            label="Country"
            value={request.country}
          />
        )}
        <MetaField
          icon={<Calendar variant="Linear" size={16} color="#606060" />}
          label="Submitted"
          value={formatSupportDate(request.created_datetime)}
        />
        <MetaField
          icon={
            <Calendar
              variant="Linear"
              size={16}
              color={overdue ? "#FF5025" : "#606060"}
            />
          }
          label="Due"
          value={dueLabel}
          danger={overdue}
        />
      </div>
    </div>
  );
};
