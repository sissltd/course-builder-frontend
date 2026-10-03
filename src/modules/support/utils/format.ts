import { format, isValid, parseISO } from "date-fns";

/**
 * Formats an API datetime as `dd MMM yyyy`, or `—` when it is absent or
 * unparseable. The API returns ISO-8601 strings, which `new Date()` handles but
 * throws on in some runtimes, so they go through `parseISO`.
 */
export const formatSupportDate = (value?: string | null): string => {
  if (!value) return "—";
  const parsed = parseISO(value);
  if (!isValid(parsed)) return "—";
  return format(parsed, "dd MMM yyyy");
};

/** Formats an API datetime as `dd MMM yyyy, HH:mm`, for the conversation thread. */
export const formatSupportDateTime = (value?: string | null): string => {
  if (!value) return "—";
  const parsed = parseISO(value);
  if (!isValid(parsed)) return "—";
  return format(parsed, "dd MMM yyyy, HH:mm");
};

export const supportRequestTitle = (request: { title?: string | null }): string =>
  request.title?.trim() || "Untitled request";

export const supportRequesterName = (request: {
  first_name?: string | null;
  last_name?: string | null;
}): string => {
  const name = `${request.first_name ?? ""} ${request.last_name ?? ""}`.trim();
  return name || "Anonymous";
};

/** `true` when `due_at` has passed and the request has not been resolved. */
export const isSupportRequestOverdue = (request: {
  due_at?: string | null;
  resolved_at?: string | null;
}): boolean => {
  if (!request.due_at || request.resolved_at) return false;
  const due = parseISO(request.due_at);
  return isValid(due) && due.getTime() < Date.now();
};
