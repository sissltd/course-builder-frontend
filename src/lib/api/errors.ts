import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { ApiErrorEnvelope } from "./types";

export interface NormalizedApiError {
  fieldErrors: Record<string, string>;
  message: string | null;
}

export const humanizeFieldName = (name: string): string =>
  name
    .replace(/[_-]+/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());

export const formatApiErrorItem = (item: {
  message: string;
  field_name?: string | null;
}): string =>
  item.field_name
    ? `${humanizeFieldName(item.field_name)}: ${item.message}`
    : item.message;

export const formatApiErrors = (
  errors: { message?: string; field_name?: string | null }[] | undefined,
  fallback = "An unexpected error occurred.",
): string => {
  const items = (errors ?? []).filter(
    (item): item is { message: string; field_name?: string | null } =>
      typeof item.message === "string" && item.message.length > 0,
  );
  if (items.length === 0) return fallback;
  const shown = items.slice(0, 5).map(formatApiErrorItem);
  const extra =
    items.length > shown.length ? ` (+${items.length - shown.length} more)` : "";
  return `${shown.join(" • ")}${extra}`;
};

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

  for (const item of envelope.errors) {
    if (item.field_name) {
      const field = fieldMap[item.field_name] ?? item.field_name;
      fieldErrors[field] = item.message;
    }
  }

  return { fieldErrors, message: formatApiErrors(envelope.errors) };
}
