import { isRejected, Middleware } from "@reduxjs/toolkit";
import { toast } from "sonner";
import type { ApiErrorEnvelope } from "@/lib/api/types";

const isApiError = (data: unknown): data is ApiErrorEnvelope =>
  !!data && typeof data === "object" && "errors" in data && Array.isArray((data as ApiErrorEnvelope).errors);

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
      if (firstError?.message) {
        toast.error(firstError.message);
      }
    } else if (payload?.status) {
      toast.error(`Request failed with status ${payload.status}.`);
    }
  }

  return next(action);
};
