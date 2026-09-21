import { format, parseISO } from "date-fns";
import type { KycIdentityData, KycSubmission } from "@/redux/slices/adminApi";

export const EMPTY_VALUE = "—";


export const clean = (value: string | null | undefined): string =>
  typeof value === "string" ? value.trim() : "";

export const hasValue = (value: string | null | undefined): boolean =>
  clean(value).length > 0;

const joinName = (first?: string | null, last?: string | null) =>
  [clean(first), clean(last)].filter(Boolean).join(" ");

export const personName = (
  person?: { first_name?: string | null; last_name?: string | null } | null,
): string => joinName(person?.first_name, person?.last_name) || EMPTY_VALUE;

export const submissionName = (submission: KycSubmission): string =>
  personName(submission.user_provided_data) !== EMPTY_VALUE
    ? personName(submission.user_provided_data)
    : personName(submission.api_data);

export const isIdentityEmpty = (
  data: KycIdentityData | null | undefined,
): boolean =>
  !data ||
  (!hasValue(data.first_name) &&
    !hasValue(data.last_name) &&
    !hasValue(data.date_of_birth) &&
    !hasValue(data.phone) &&
    !hasValue(data.address?.address) &&
    !hasValue(data.address?.state));

/** A date-only value (`2026-09-16`), `null`, or `""`. */
export const formatDate = (value: string | null | undefined): string => {
  if (!hasValue(value)) return EMPTY_VALUE;
  const raw = clean(value);
  const parsed = parseISO(raw);
  // `format` throws on an invalid date; show the raw value instead of crashing.
  return Number.isNaN(parsed.getTime()) ? raw : format(parsed, "dd-MMM-yyyy");
};

export const formatDateTime = (value: string | null | undefined): string => {
  if (!hasValue(value)) return EMPTY_VALUE;
  const raw = clean(value);
  const parsed = parseISO(raw);
  return Number.isNaN(parsed.getTime())
    ? raw
    : format(parsed, "dd-MMM-yyyy, HH:mm");
};

/** `{ address, state }` as one line; either half, or the whole object, may be missing. */
export const formatAddress = (
  address: { address: string; state: string } | null | undefined,
): string => {
  if (!address) return EMPTY_VALUE;
  return (
    [clean(address.address), clean(address.state)].filter(Boolean).join(", ") ||
    EMPTY_VALUE
  );
};

export const formatText = (value: string | null | undefined): string =>
  hasValue(value) ? clean(value) : EMPTY_VALUE;
