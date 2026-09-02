import type { PresignRequest, PresignResponse } from "./api/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface UploadOptions {
  folder?: string;
  onProgress?: (percent: number) => void;
}

export class UploadError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
    this.name = "UploadError";
  }
}

async function getPresignedUrl(
  file: File,
  folder: string,
  token: string,
): Promise<PresignResponse> {
  const body: PresignRequest = {
    filename: file.name,
    content_type: file.type || "application/octet-stream",
    folder,
    size: file.size,
  };

  const res = await fetch(`${API_BASE_URL}/uploads/presign/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new UploadError(
      `Failed to get upload URL (${res.status})`,
      res.status,
    );
  }

  const data = await res.json();
  return data.data ?? data;
}

async function putFile(
  uploadUrl: string,
  file: File,
  onProgress?: (percent: number) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadUrl);
    xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(
          new UploadError(`Upload failed (${xhr.status})`, xhr.status),
        );
      }
    });

    xhr.addEventListener("error", () => {
      reject(new UploadError("Upload failed due to a network error."));
    });

    xhr.addEventListener("abort", () => {
      reject(new UploadError("Upload was cancelled."));
    });

    xhr.send(file);
  });
}

export async function uploadFile(
  file: File,
  options: UploadOptions = {},
  token: string,
): Promise<PresignResponse> {
  const folder = options.folder ?? "general";

  const presigned = await getPresignedUrl(file, folder, token);
  await putFile(presigned.upload_url, file, options.onProgress);

  return presigned;
}
