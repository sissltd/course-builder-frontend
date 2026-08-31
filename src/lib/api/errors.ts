import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { ApiErrorEnvelope } from "./types";

export interface NormalizedApiError {
  fieldErrors: Record<string, string>;
  message: string | null;
}

export function getErrorEnvelope(
  error: FetchBaseQueryError | undefined,
): ApiErrorEnvelope | null {
  if (!error) {
    return null;
  }
  const data = error.data as ApiErrorEnvelope | undefined;
  if (data && Array.isArray(data.errors) && data.errors.length > 0) {
    return data;
  }
  return null;
}

export function normalizeApiError(
  error: FetchBaseQueryError | undefined,
  fieldMap: Record<string, string> = {},
): NormalizedApiError {
  const envelope = getErrorEnvelope(error);

  if (!envelope) {
    if (error && "status" in error && typeof error.status === "number") {
      return {
        fieldErrors: {},
        message: `Request failed with status ${error.status}.`,
      };
    }
    return { fieldErrors: {}, message: "An unexpected error occurred." };
  }

  const fieldErrors: Record<string, string> = {};
  let message: string | null = null;

  for (const item of envelope.errors) {
    if (item.field_name) {
      const field = fieldMap[item.field_name] ?? item.field_name;
      fieldErrors[field] = item.message;
    } else if (!message) {
      message = item.message;
    }
  }

  if (!message && envelope.errors.length > 0) {
    message = envelope.errors[0].message;
  }

  return { fieldErrors, message };
}
