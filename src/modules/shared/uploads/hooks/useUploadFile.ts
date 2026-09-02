"use client";

import { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux";
import { uploadFile, UploadError, type UploadOptions } from "@/lib/uploads";
import type { PresignResponse } from "@/lib/api/types";

export interface UseUploadFileReturn {
  upload: (file: File, options?: UploadOptions) => Promise<PresignResponse>;
  isUploading: boolean;
  progress: number;
  result: PresignResponse | null;
  error: string | null;
  reset: () => void;
}

export function useUploadFile(): UseUploadFileReturn {
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<PresignResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(
    async (file: File, options?: UploadOptions) => {
      if (!token) {
        throw new UploadError("Not authenticated.");
      }

      setIsUploading(true);
      setProgress(0);
      setResult(null);
      setError(null);

      try {
        const res = await uploadFile(file, options, token);
        setResult(res);
        setProgress(100);
        return res;
      } catch (err) {
        const message =
          err instanceof UploadError
            ? err.message
            : "Upload failed. Please try again.";
        setError(message);
        throw err;
      } finally {
        setIsUploading(false);
      }
    },
    [token],
  );

  const reset = useCallback(() => {
    setProgress(0);
    setResult(null);
    setError(null);
  }, []);

  return { upload, isUploading, progress, result, error, reset };
}
