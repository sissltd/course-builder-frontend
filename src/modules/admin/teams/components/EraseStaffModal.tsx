"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Modal } from "@/components/shared/Modal";
import { Button as AppButton } from "@/components/shared/Button";
import { FormInput } from "@/components/form/FormInput";
import { normalizeApiError } from "@/lib/api/errors";
import { useEraseStaffMutation } from "../hooks";
import type { TeamRow } from "./TeamActionMenu";

interface EraseStaffModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  member: TeamRow | null;
  onErased?: () => void;
}

/**
 * Permanently deletes a staff member.
 *
 * The endpoint requires the account's email typed back exactly, and a reason
 * that is kept in the audit log — so both are collected here rather than sent
 * as a constant. It also refuses with **409 while the member's wallet still
 * holds a balance or a payout is in flight**; that refusal is surfaced as-is,
 * because only the operator can resolve it.
 *
 * The deletion is irreversible but not a purge of history: the account row
 * stays so courses, payouts, reviews and audit logs remain intact, re-attributed
 * to an anonymous user. The copy says so, because "deleted" alone reads as
 * though their courses vanish too.
 */
export const EraseStaffModal = ({
  isOpen,
  onOpenChange,
  member,
  onErased,
}: EraseStaffModalProps) => {
  const [confirmEmail, setConfirmEmail] = useState("");
  const [reason, setReason] = useState("");
  const [eraseStaff, { isLoading }] = useEraseStaffMutation();

  const handleClose = () => {
    setConfirmEmail("");
    setReason("");
    onOpenChange(false);
  };

  const emailMatches =
    !!member && confirmEmail.trim().toLowerCase() === member.email.toLowerCase();
  const canErase = emailMatches && reason.trim().length > 0 && !isLoading;

  const handleErase = async () => {
    if (!member || !canErase) return;

    try {
      const res = await eraseStaff({
        id: member.userId,
        body: { confirm_email: member.email, reason: reason.trim() },
      }).unwrap();

      toast.success(res?.message ?? `${member.name}'s account was deleted`);
      onErased?.();
      handleClose();
    } catch (err) {
      const { message } = normalizeApiError(err as never);
      toast.error(message ?? "Could not delete the account");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open && !isLoading) handleClose();
      }}
      title="Delete account"
      className="sm:max-w-[500px]"
    >
      <div className="flex flex-col gap-[20px]">
        <p className="text-[14px] leading-[20px] tracking-[-0.28px] text-[#606060]">
          This permanently deletes{" "}
          <span className="font-medium text-[#202020]">{member?.name}</span>.
          They can never sign in again and their personal data — name, email,
          phone, address, KYC details, avatar, sign-in methods and saved bank
          accounts — is erased.{" "}
          <span className="font-medium text-[#202020]">
            This cannot be undone.
          </span>
        </p>

        <p className="text-[13px] leading-[18px] text-[#606060]">
          Their account record itself stays, so the courses, payouts, reviews
          and audit logs they are attached to survive — those are re-attributed
          to an anonymous user. Deletion is refused while their wallet still
          holds a balance or a payout is in progress.
        </p>

        <FormInput
          name="confirmEmail"
          label={`Type ${member?.email ?? "the email"} to confirm`}
          placeholder={member?.email ?? "Email address"}
          value={confirmEmail}
          onChange={(event) => setConfirmEmail(event.target.value)}
        />

        <FormInput
          name="reason"
          label="Reason"
          placeholder="Why is this account being deleted?"
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          maxLength={500}
        />

        <div className="flex gap-[12px]">
          <AppButton
            type="button"
            variant="outline"
            className="h-[44px] flex-1 text-[14px]"
            disabled={isLoading}
            onClick={handleClose}
          >
            Cancel
          </AppButton>
          <AppButton
            type="button"
            variant="destructive"
            className="h-[44px] flex-1 text-[14px]"
            disabled={!canErase}
            onClick={handleErase}
          >
            {isLoading ? "Deleting..." : "Delete account"}
          </AppButton>
        </div>
      </div>
    </Modal>
  );
};
