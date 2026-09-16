"use client";

import React, { useRef, useCallback, useState } from "react";
import Webcam from "react-webcam";
import Image from "next/image";
import { Button } from "@/components/shared/Button";

interface SelfieCapturePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (photoDataUrl: string) => void;
}

export const SelfieCapturePopup = ({
  isOpen,
  onClose,
  onCapture,
}: SelfieCapturePopupProps) => {
  const webcamRef = useRef<Webcam>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState(false);

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedImage(imageSrc);
      }
    }
  }, []);

  const handleRecapture = () => {
    setCapturedImage(null);
  };

  const handleSubmit = () => {
    if (capturedImage) {
      onCapture(capturedImage);
    }
  };

  const handleCameraReady = () => {
    setCameraError(false);
  };

  const handleCameraError = () => {
    setCameraError(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-[#FDFDFD] rounded-[10px] px-[16px] py-[20px] w-full max-w-[340px] flex flex-col gap-[24px]">
        {/* Header */}
        <div className="flex items-start justify-between w-full">
          <h3 className="text-[20px] font-semibold text-[#202020] leading-[28px]">
            Position your face to capture selfie
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="size-[24px] rounded-[4px] border border-[#F0F0F0] flex items-center justify-center shrink-0 hover:bg-[#F0F0F0] transition-colors"
          >
            <Image
              src="/images/kyc/close.svg"
              alt="Close"
              width={16}
              height={16}
            />
          </button>
        </div>

        {/* Camera / Captured Image */}
        <div className="flex flex-col items-center gap-[20px]">
          <div className="relative w-full max-w-[264px]">
            <div
              className="relative w-full overflow-hidden"
              style={{
                aspectRatio: "225/304",
                borderRadius: "45%",
              }}
            >
              {cameraError ? (
                <div className="absolute inset-0 bg-[#1a1a1a] flex items-center justify-center rounded-[45%]">
                  <p className="text-[14px] text-white text-center px-[16px]">
                    Camera access denied. Please enable camera permissions.
                  </p>
                </div>
              ) : capturedImage ? (
                <Image
                  src={capturedImage}
                  alt="Captured selfie"
                  fill
                  className="object-cover rounded-[45%]"
                />
              ) : (
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  screenshotFormat="image/jpeg"
                  screenshotQuality={0.8}
                  videoConstraints={{
                    facingMode: "user",
                    width: 640,
                    height: 480,
                  }}
                  onUserMedia={handleCameraReady}
                  onUserMediaError={handleCameraError}
                  className="absolute inset-0 w-full h-full object-cover rounded-[45%]"
                />
              )}

              {/* Face outline overlay */}
              <div className="absolute inset-0 pointer-events-none">
                <Image
                  src="/images/kyc/face-outline.svg"
                  alt="Face outline"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          <p className="text-[12px] text-[#636363] text-center">
            Hold still and keep your face within the oval
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-[12px] w-full">
          {capturedImage ? (
            <>
              <Button
                type="button"
                variant="app-outline"
                className="flex-1 h-[44px]"
                onClick={handleRecapture}
              >
                Re-capture
              </Button>
              <Button
                type="button"
                variant="app-primary"
                className="flex-1 h-[44px]"
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </>
          ) : (
            <Button
              type="button"
              variant="app-primary"
              className="w-full h-[44px]"
              onClick={capture}
              disabled={cameraError}
            >
              Capture
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
