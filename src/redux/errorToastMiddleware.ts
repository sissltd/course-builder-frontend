import { isRejected, Middleware } from "@reduxjs/toolkit";
import { toast } from "sonner";
import type { ApiErrorEnvelope } from "@/lib/api/types";

const isApiError = (data: unknown): data is ApiErrorEnvelope =>
  !!data && typeof data === "object" && "errors" in data && Array.isArray((data as ApiErrorEnvelope).errors);

const recentToasts = new Map<string, number>();
const DEDUP_WINDOW_MS = 500;

setInterval(() => {
  const now = Date.now();
  for (const [msg, ts] of recentToasts) {
    if (now - ts > DEDUP_WINDOW_MS) recentToasts.delete(msg);
  }
}, 1000);

function isDuplicateToast(message: string): boolean {
  const now = Date.now();
  const last = recentToasts.get(message);
  if (last && now - last < DEDUP_WINDOW_MS) return true;
  recentToasts.set(message, now);
  return false;
}

export const errorToastMiddleware: Middleware = () => (next) => (action) => {
  if (isRejected(action)) {
    const payload = action.payload as
      | { status: number; data: unknown }
      | undefined;

    if (payload?.status === 401 || payload?.status === 403) {
      return next(action);
    }

    if (payload?.data && isApiError(payload.data)) {
      const firstError = payload.data.errors[0];
      if (firstError?.message && !isDuplicateToast(firstError.message)) {
        toast.error(firstError.message);
      }
    } else if (payload?.status) {
      const msg = `Request failed with status ${payload.status}.`;
      if (!isDuplicateToast(msg)) {
        toast.error(msg);
      }
    }
  }

  return next(action);
};
