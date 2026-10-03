import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { getErrorStatus, normalizeApiError } from "@/lib/api/errors";

/**
 * Shown when `POST /support/contact/` answers 429.
 *
 * The endpoint is rate limited per IP and answers 429 once the window is spent.
 * `Retry-After` is not reachable through `fetchBaseQuery`'s error shape — the
 * header is dropped before the rejection reaches a component — so this is a
 * plain "come back later" rather than a countdown that would lie about when the
 * limit lifts.
 */
export const CONTACT_RATE_LIMIT_MESSAGE =
  "You've sent several messages already. Please try again later.";

export interface ContactErrorDescription {
  message: string;
  isRateLimited: boolean;
}

/**
 * Normalises a contact submission failure for both the public `/contact` form
 * and the in-app Contact-us modal.
 *
 * A 429 is not a generic failure and must not read as one — it means the message
 * was not lost, the caller simply has to wait — so it is detected before
 * `normalizeApiError` flattens the envelope into "Request failed with status
 * 429." Everything else defers to the backend's own message.
 */
export const describeContactError = (
  error: unknown,
  fallback = "We could not send your message. Please try again.",
): ContactErrorDescription => {
  const typed = error as FetchBaseQueryError | undefined;

  if (getErrorStatus(typed) === 429) {
    return { message: CONTACT_RATE_LIMIT_MESSAGE, isRateLimited: true };
  }

  const { message } = normalizeApiError(typed);
  return { message: message ?? fallback, isRateLimited: false };
};
