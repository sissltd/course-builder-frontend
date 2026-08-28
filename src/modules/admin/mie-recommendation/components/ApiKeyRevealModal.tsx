"use client";

import React from "react";
import { X } from "lucide-react";
import { Danger, Key, TickCircle } from "iconsax-react";
import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/shared/Button";
import { Callout, CopyButton } from "./SharedUI";
import type { DeveloperApprovalResponse } from "../types";

/**
 * `NEXT_PUBLIC_API_BASE_URL` already ends in `/api/v1`, so the developer-facing
 * paths are appended directly. Falling back to a relative path keeps the block
 * readable rather than printing `undefined` when the env var is missing.
 */
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api/v1";
const SUBMISSIONS_URL = `${API_BASE}/mie/v1/submissions/`;
const DOCS_URL = `${API_BASE}/mie/v1/documentation/`;

interface ApiKeyRevealModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  /** Set when an approval just returned; null closes the modal. */
  approval: DeveloperApprovalResponse | null;
}

const HandoffRow = ({
  label,
  value,
  mono = true,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) => (
  <div className="flex items-center justify-between gap-[12px] border-b border-sd-grey-3 py-[10px] last:border-b-0">
    <div className="flex min-w-0 flex-col gap-[2px]">
      <span className="text-[12px] leading-[16px] text-sd-grey-11">{label}</span>
      <span
        className={`truncate text-[13px] leading-[18px] text-sd-grey-12 ${
          mono ? "font-mono" : ""
        }`}
        title={value}
      >
        {value}
      </span>
    </div>
    <CopyButton value={value} label="Copy" />
  </div>
);

/**
 * Shown the moment an approval succeeds. The full key exists in exactly this one
 * response — there is no endpoint that can hand it back, so the modal is
 * deliberately explicit about that and about what to do with it.
 */
export const ApiKeyRevealModal = ({
  isOpen,
  onOpenChange,
  approval,
}: ApiKeyRevealModalProps) => {
  const key = approval?.one_time_api_key ?? null;
  const email = approval?.account?.email ?? "";

  /**
   * The acknowledgement is tied to the key it was given for — a later approval
   * carries a different key, so its gate is never pre-passed and no effect has to
   * reset anything.
   */
  const [acknowledgedKey, setAcknowledgedKey] = React.useState<string | null>(
    null,
  );
  const acknowledged = !!key && acknowledgedKey === key;

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        // Closing by overlay/escape is allowed, but only after the key was seen
        // and acknowledged — otherwise it is lost silently.
        if (!open && key && !acknowledged) return;
        onOpenChange(open);
      }}
      showCloseButton={false}
      className="rounded-[16px] border border-sd-grey-3 p-[20px] sm:max-w-[600px]"
      title={
        <div className="flex items-start justify-between gap-[16px]">
          <span className="flex items-center gap-[10px]">
            <span className="flex size-[36px] items-center justify-center rounded-[10px] bg-sd-success-bg">
              <TickCircle variant="Bold" size={20} color="var(--sd-success)" />
            </span>
            <span className="text-[20px] font-semibold leading-[32px] tracking-[-0.4px] text-sd-grey-12">
              {key ? "API key issued" : "Developer approved"}
            </span>
          </span>
          {(!key || acknowledged) && (
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              className="size-[32px] rounded-[10px] border-sd-grey-3 bg-white text-sd-grey-9 hover:bg-sd-grey-2"
              onClick={() => onOpenChange(false)}
              aria-label="Close API key modal"
            >
              <X size={18} />
            </Button>
          )}
        </div>
      }
    >
      <div className="flex flex-col gap-[20px]">
        <p className="text-[14px] leading-[20px] tracking-[-0.28px] text-sd-grey-11">
          {email ? (
            <>
              <span className="text-sd-grey-12">{email}</span> can now submit
              course ideas.
            </>
          ) : (
            "The developer account is now approved."
          )}
        </p>

        {key ? (
          <>
            <Callout tone="warning">
              <span className="flex items-start gap-[8px]">
                <Danger variant="Bold" size={16} color="var(--sd-warning-text)" />
                <span>
                  This is the only time the key is ever shown. Nothing — not this
                  screen, not the API — can retrieve it again. Send it to the
                  developer now; if it is lost, reject and re-approve the account
                  to issue a new one.
                </span>
              </span>
            </Callout>

            <div className="flex flex-col gap-[8px]">
              <span className="text-[14px] font-medium leading-[20px] tracking-[-0.28px] text-sd-grey-12">
                API key
              </span>
              <div className="flex items-center justify-between gap-[12px] rounded-[10px] border border-sd-grey-4 bg-sd-grey-1 p-[12px]">
                <span className="flex min-w-0 items-center gap-[8px]">
                  <Key variant="Bold" size={18} color="var(--sd-grey-11)" />
                  <span className="min-w-0 break-all font-mono text-[13px] leading-[18px] text-sd-grey-12">
                    {key}
                  </span>
                </span>
                <CopyButton value={key} label="Copy key" />
              </div>
            </div>

            <div className="flex flex-col gap-[4px] rounded-[10px] border border-sd-grey-3 bg-white p-[12px]">
              <span className="pb-[4px] text-[14px] font-medium leading-[20px] tracking-[-0.28px] text-sd-grey-12">
                Integration handoff
              </span>
              <HandoffRow label="Auth header" value={`X-MIE-Api-Key: ${key}`} />
              <HandoffRow label="Submit ideas to" value={SUBMISSIONS_URL} />
              <HandoffRow label="Developer docs" value={DOCS_URL} />
              <HandoffRow
                label="Webhook receiver"
                value={approval?.account?.webhook_url ?? "—"}
              />
            </div>

            <label className="flex cursor-pointer items-start gap-[10px]">
              <input
                type="checkbox"
                checked={acknowledged}
                onChange={(event) =>
                  setAcknowledgedKey(event.target.checked ? key : null)
                }
                className="mt-[2px] size-[16px] cursor-pointer accent-sd-blue"
              />
              <span className="text-[13px] leading-[18px] text-sd-grey-11">
                I have copied the key and sent it to the developer.
              </span>
            </label>
          </>
        ) : (
          <Callout tone="info">
            No new key was issued — this account already had valid credentials,
            so the developer&apos;s existing key keeps working. Nothing needs to
            be sent.
          </Callout>
        )}

        <div className="flex justify-end pt-[4px]">
          <Button
            type="button"
            variant="app-primary"
            size="app"
            className="h-[44px] min-w-[133px] rounded-[10px] px-[24px] text-[14px] font-normal tracking-[-0.28px]"
            disabled={!!key && !acknowledged}
            onClick={() => onOpenChange(false)}
          >
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
};
