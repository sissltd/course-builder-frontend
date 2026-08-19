import React, { useState } from "react";
import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/shared/Button";
import { KycSubmission } from "@/redux/slices/adminApi";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import Image from "next/image";

interface KycReviewDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: KycSubmission | null;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string, reason: string) => Promise<void>;
  isApproving: boolean;
  isRejecting: boolean;
}

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

  // Mock data for fields not in the API payload yet
  const mockData = {
    dob: "14-Feb-1950",
    bvn: "22446688891",
    address: "12 Market Road, Aba, Abia State",
    apiAddress: "14 Old Umuahia Road, Aba",
    phone: "+2348031234567",
    passportImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=mock1",
    bvnImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=mock2",
  };

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

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={handleClose}
      className="sm:max-w-[800px] p-[32px] rounded-[16px]"
      title="Identity Verification"
      description={`Reviewing KYC submission for ${submission.user.first_name} ${submission.user.last_name}`}
    >
      <div className="flex flex-col gap-6 mt-4">
        {/* Side-by-Side Comparison */}
        <div className="grid grid-cols-2 gap-8">
          {/* User Provided Data */}
          <div className="flex flex-col gap-4">
            <h3 className="text-[18px] font-semibold text-center text-sd-grey-12">User Provided Data</h3>
            <div className="flex justify-center gap-4">
              <div className="flex flex-col items-center">
                <div className="relative w-[120px] h-[150px] bg-sd-grey-3 rounded-[8px] overflow-hidden">
                  <Image src={mockData.passportImage} alt="Passport" fill className="object-cover" />
                </div>
                <span className="text-sd-grey-11 text-[12px] mt-1">Passport Live</span>
              </div>
              <div className="relative w-[120px] h-[150px] bg-sd-grey-3 rounded-[8px] overflow-hidden">
                <Image src={mockData.passportImage} alt="Document" fill className="object-cover" />
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-4 text-[14px]">
              <div className="grid grid-cols-[80px_1fr] gap-4 items-center">
                <span className="font-semibold text-sd-grey-12">Name</span>
                <span className="text-sd-grey-11">{submission.user.first_name} {submission.user.last_name}</span>
              </div>
              <div className="grid grid-cols-[80px_1fr] gap-4 items-start">
                <div className="relative w-[80px] h-[100px] bg-sd-grey-3 rounded-[8px] overflow-hidden">
                  <Image src={mockData.passportImage} alt="Selfie" fill className="object-cover" />
                </div>
                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-[80px_1fr] gap-2">
                    <span className="font-semibold text-sd-grey-12">DOB</span>
                    <span className="text-sd-grey-11">{mockData.dob}</span>
                  </div>
                  <div className="grid grid-cols-[80px_1fr] gap-2">
                    <span className="font-semibold text-sd-grey-12">BVN / ID</span>
                    <span className="text-sd-grey-11">{submission.id_number}</span>
                  </div>
                  <div className="grid grid-cols-[80px_1fr] gap-2">
                    <span className="font-semibold text-sd-grey-12">Address</span>
                    <span className="text-sd-grey-11">{mockData.address}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-[80px_1fr] gap-4 items-center mt-2">
                <span className="font-semibold text-sd-grey-12">Phone</span>
                <span className="text-sd-grey-11">{mockData.phone}</span>
              </div>
            </div>
          </div>

          {/* API Data */}
          <div className="flex flex-col gap-4 border-l border-sd-grey-3 pl-8">
            <h3 className="text-[18px] font-semibold text-center text-sd-grey-12">API Data (BVN / ID)</h3>
            <div className="flex justify-center gap-4">
              <div className="relative w-[120px] h-[150px] bg-sd-grey-3 rounded-[8px] overflow-hidden">
                <Image src={mockData.bvnImage} alt="API Data" fill className="object-cover" />
              </div>
              <div className="flex items-center w-[120px]">
                <span className="text-[16px] font-semibold text-center leading-tight">
                  {submission.user.first_name} {submission.user.last_name}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-4 text-[14px]">
              <div className="grid grid-cols-[80px_1fr] gap-4 items-center">
                <span className="font-semibold text-sd-grey-12">Name</span>
                <span className="text-sd-grey-11">{submission.user.first_name} {submission.user.last_name}</span>
              </div>
              <div className="grid grid-cols-[80px_1fr] gap-4 items-center mt-[100px]">
                <span className="font-semibold text-sd-grey-12">DOB</span>
                <span className="text-sd-grey-11">{mockData.dob}</span>
              </div>
              <div className="grid grid-cols-[80px_1fr] gap-4 items-center">
                <span className="font-semibold text-sd-grey-12">BVN / ID</span>
                <span className="text-sd-grey-11">{submission.id_number}</span>
              </div>
              <div className="grid grid-cols-[80px_1fr] gap-4 items-center">
                <span className="font-semibold text-sd-grey-12">Address</span>
                <span className="text-sd-grey-11">{mockData.apiAddress}</span>
              </div>
              <div className="grid grid-cols-[80px_1fr] gap-4 items-center mt-2">
                <span className="font-semibold text-sd-grey-12">Phone</span>
                <span className="text-sd-grey-11">{mockData.phone}</span>
              </div>
            </div>
          </div>
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
