import React, { useState } from "react";
import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/shared/Button";
import type { KycIdentityData, KycSubmission } from "@/redux/slices/adminApi";
import { toast } from "sonner";
import {
  EMPTY_VALUE,
  formatAddress,
  formatDate,
  formatDateTime,
  formatText,
  hasValue,
  isIdentityEmpty,
  personName,
  submissionName,
} from "../lib/format";

interface KycReviewDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: KycSubmission | null;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string, reason: string) => Promise<void>;
  isApproving: boolean;
  isRejecting: boolean;
}

/** Label/value row. The label column is fixed so both panels line up. */
const Field = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="grid grid-cols-[80px_1fr] items-start gap-3">
    <span className="font-semibold text-sd-grey-12">{label}</span>
    <span className="break-words text-sd-grey-11">{value}</span>
  </div>
);

/**
 * A submitted or provider-supplied image.
 *
 * A plain `<img>`, not `next/image`, for two reasons: these are served from a
 * host that is not in `images.remotePatterns` (so `next/image` would throw
 * "hostname not configured"), and they are **signed URLs that expire about ten
 * minutes after issue** — an optimizer cache holding one would start serving a
 * dead link.
 */
const EvidenceImage = ({
  src,
  label,
  alt,
}: {
  src: string | null | undefined;
  label: string;
  alt: string;
}) => (
  <div className="flex flex-col items-center gap-1">
    <div className="relative h-[150px] w-[120px] overflow-hidden rounded-[8px] bg-sd-grey-3">
      {hasValue(src) ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src as string}
          alt={alt}
          className="absolute inset-0 size-full object-cover"
        />
      ) : (
        <span className="flex size-full items-center justify-center px-2 text-center text-[11px] text-sd-grey-11">
          Not supplied
        </span>
      )}
    </div>
    <span className="text-[12px] text-sd-grey-11">{label}</span>
  </div>
);

interface IdentityPanelProps {
  title: string;
  data: KycIdentityData | null | undefined;
  images: Array<{ src: string | null | undefined; label: string }>;
  /** Explained in place of a column of dashes when the side has nothing. */
  emptyNote: string;
  className?: string;
}

const IdentityPanel = ({
  title,
  data,
  images,
  emptyNote,
  className,
}: IdentityPanelProps) => (
  <div className={className}>
    <h3 className="text-center text-[18px] font-semibold text-sd-grey-12">
      {title}
    </h3>

    <div className="mt-4 flex justify-center gap-4">
      {images.map((image) => (
        <EvidenceImage
          key={image.label}
          src={image.src}
          label={image.label}
          alt={`${title}: ${image.label}`}
        />
      ))}
    </div>

    {isIdentityEmpty(data) ? (
      <p className="mt-6 text-center text-[13px] text-sd-grey-11">{emptyNote}</p>
    ) : (
      <div className="mt-6 flex flex-col gap-3 text-[14px]">
        <Field label="Name" value={personName(data)} />
        <Field label="DOB" value={formatDate(data?.date_of_birth)} />
        <Field label="Sex" value={formatText(data?.sex)} />
        <Field label="Address" value={formatAddress(data?.address)} />
        <Field label="Phone" value={formatText(data?.phone)} />
      </div>
    )}
  </div>
);

export const KycReviewDetailsModal = ({
  isOpen,
  onClose,
  submission,
  onApprove,
  onReject,
  isApproving,
  isRejecting,
}: KycReviewDetailsModalProps) => {
  const [rejectionReason, setRejectionReason] = useState("");
  const [isRejectMode, setIsRejectMode] = useState(false);

  const handleClose = () => {
    setIsRejectMode(false);
    setRejectionReason("");
    onClose();
  };

  const handleReject = async () => {
    if (!submission) return;
    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason.");
      return;
    }
    await onReject(submission.id, rejectionReason);
    handleClose();
  };

  const handleApprove = async () => {
    if (!submission) return;
    await onApprove(submission.id);
    handleClose();
  };

  if (!submission) return null;

  /*
    Both sides are the same shape; they differ only in which image they carry.
    `api_data` is routinely all-empty — that is what an unanswered provider
    looks like, and `kyc_request_status` is where that shows up.
  */
  const userData = submission.user_provided_data;
  const apiData = submission.api_data;

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={handleClose}
      className="sm:max-w-[800px] p-[32px] rounded-[16px]"
      title="Identity Verification"
      description={`Reviewing KYC submission for ${submissionName(submission)}`}
    >
      <div className="flex flex-col gap-6 mt-4">
        {/* Liveness is a signal about the submission as a whole, not about
            either data set, so it sits above the comparison. */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 rounded-[10px] bg-sd-grey-2 px-4 py-3 text-[13px]">
          <span className="font-semibold text-sd-grey-12">Liveness</span>
          <span
            className={
              submission.liveness_passes ? "text-[#218838]" : "text-[#C82333]"
            }
          >
            {submission.liveness_passes ? "Passed" : "Not passed"}
          </span>
          <span className="text-sd-grey-11">
            Score {submission.liveness_score ?? EMPTY_VALUE} / threshold{" "}
            {submission.liveness_threshold}
          </span>
        </div>

        {/* The two columns are the two sides of the check: what the user typed
            in, against what the provider returned. An admin is looking for the
            mismatches between them. */}
        <div className="grid grid-cols-2 gap-8">
          <IdentityPanel
            title="User Provided Data"
            data={userData}
            images={[
              { src: submission.liveness_avatar_url, label: "Liveness selfie" },
              { src: userData?.image, label: "Uploaded document" },
            ]}
            emptyNote="The user submitted no identity data."
          />

          <IdentityPanel
            className="border-l border-sd-grey-3 pl-8"
            title="API Data (BVN / ID)"
            data={apiData}
            images={[{ src: apiData?.document_image, label: "Provider document" }]}
            emptyNote="The provider returned no data for this submission."
          />
        </div>

        {/* Submission-level context. `Provider status` being blank is itself
            the signal that the provider has not answered yet. */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-3 border-t border-sd-grey-3 pt-6 text-[13px] sm:grid-cols-2">
          <Field
            label="Document"
            value={formatText(submission.document_type)}
          />
          <Field
            label="Country"
            value={formatText(submission.country_of_issue)}
          />
          <Field label="BVN / ID" value={formatText(submission.id_number)} />
          <Field
            label="Provider"
            value={formatText(submission.kyc_request_status)}
          />
          <Field
            label="Submitted"
            value={formatDateTime(submission.created_datetime)}
          />
          <Field
            label="Reviewed"
            value={formatDateTime(submission.reviewed_at)}
          />
          {hasValue(submission.rejection_reason) ? (
            <Field
              label="Declined"
              value={formatText(submission.rejection_reason)}
            />
          ) : null}
        </div>

        {/* Actions */}
        <div className="flex justify-between items-end mt-6 pt-6 border-t border-sd-grey-3">
          {submission.status === "PENDING" ? (
            <>
              <div className="w-1/2 pr-4 flex justify-center">
                <Button
                  onClick={handleApprove}
                  isLoading={isApproving}
                  disabled={isRejecting}
                  className="bg-[#28A745] hover:bg-[#218838] text-white w-full max-w-[200px]"
                >
                  Approve
                </Button>
              </div>
              <div className="w-1/2 pl-4 flex flex-col items-center gap-3">
                {isRejectMode ? (
                  <div className="w-full flex flex-col gap-2">
                    <input
                      type="text"
                      className="w-full border border-sd-grey-5 rounded-[8px] px-3 py-2 text-[14px]"
                      placeholder="Reason for rejection..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setIsRejectMode(false)}
                        variant="outline"
                        className="flex-1"
                        disabled={isRejecting}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleReject}
                        isLoading={isRejecting}
                        disabled={isApproving || !rejectionReason.trim()}
                        className="bg-[#DC3545] hover:bg-[#C82333] text-white flex-1"
                      >
                        Confirm Decline
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full flex justify-center gap-4">
                    {/*
                      Not wired: there is no flag mutation yet, though the API
                      exposes `POST /users/kyc-review/{id}/flag/` taking
                      `{ flag_reason }`. Left in place rather than removed so
                      the intent is visible — see the notes on this screen.
                    */}
                    <Button
                      variant="outline"
                      className="border-[#FD7E14] text-[#FD7E14] hover:bg-[#FD7E14] hover:text-white max-w-[140px] flex-1"
                    >
                      Flag for Review
                    </Button>
                    <Button
                      onClick={() => setIsRejectMode(true)}
                      className="bg-[#DC3545] hover:bg-[#C82333] text-white max-w-[140px] flex-1"
                    >
                      Decline
                    </Button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="w-full flex justify-center">
              <span className={`font-semibold px-4 py-2 rounded-[8px] ${submission.status === 'APPROVED' ? 'bg-[#28A745]/10 text-[#28A745]' : 'bg-[#DC3545]/10 text-[#DC3545]'}`}>
                {submission.status}
              </span>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
