import { format, formatDistanceToNow, parseISO } from "date-fns";
import {
  DeveloperAccountStatus,
  MiePlanType,
  SubmissionStatus,
} from "../types";

/* ─────────────────────────────── Labels ─────────────────────────────── */

export const submissionStatusLabels: Record<SubmissionStatus, string> = {
  [SubmissionStatus.PENDING_REVIEW]: "Pending review",
  [SubmissionStatus.DUPLICATE_IN_QUEUE]: "Duplicate in queue",
  [SubmissionStatus.DUPLICATE_EXISTING]: "Duplicate existing",
  [SubmissionStatus.PREVIOUSLY_REJECTED]: "Previously rejected",
  [SubmissionStatus.APPROVED]: "Approved",
  [SubmissionStatus.REJECTED]: "Rejected",
};

/** Why the pipeline put an idea in this state, in the operator's language. */
export const submissionStatusHints: Record<SubmissionStatus, string> = {
  [SubmissionStatus.PENDING_REVIEW]: "Queued and waiting for a decision.",
  [SubmissionStatus.DUPLICATE_IN_QUEUE]:
    "The dedup engine short-circuited this — the same title is already awaiting review.",
  [SubmissionStatus.DUPLICATE_EXISTING]:
    "The dedup engine short-circuited this — a live course already covers the title.",
  [SubmissionStatus.PREVIOUSLY_REJECTED]:
    "The dedup engine short-circuited this — the title was rejected before.",
  [SubmissionStatus.APPROVED]: "Accepted. Reversible — rejecting parks any produced course.",
  [SubmissionStatus.REJECTED]: "Declined. Reversible — approving clears the rejection.",
};

/** The three states the dedup engine assigns on arrival, with no human input. */
export const duplicateStatuses: SubmissionStatus[] = [
  SubmissionStatus.DUPLICATE_IN_QUEUE,
  SubmissionStatus.DUPLICATE_EXISTING,
  SubmissionStatus.PREVIOUSLY_REJECTED,
];

export const developerStatusLabels: Record<DeveloperAccountStatus, string> = {
  [DeveloperAccountStatus.PENDING]: "Pending",
  [DeveloperAccountStatus.APPROVED]: "Approved",
  [DeveloperAccountStatus.REJECTED]: "Rejected",
  [DeveloperAccountStatus.SUSPENDED]: "Suspended",
};

export const planTypeLabels: Record<MiePlanType, string> = {
  [MiePlanType.PAID_PER_SUBMISSION]: "Paid per submission",
  [MiePlanType.BYPASS_PER_SUBMISSION]: "Bypass per submission",
  [MiePlanType.BYPASS_ACCOUNT]: "Account bypass",
};

export const planTypeHints: Record<MiePlanType, string> = {
  [MiePlanType.PAID_PER_SUBMISSION]:
    "Credits the creator wallet on every approval.",
  [MiePlanType.BYPASS_PER_SUBMISSION]:
    "Pays by default, but individual ideas can be marked no-payout.",
  [MiePlanType.BYPASS_ACCOUNT]: "Never pays this developer.",
};

/* ───────────────────────── Filter option lists ───────────────────────── */

export const submissionStatusOptions = Object.values(SubmissionStatus).map(
  (value) => ({ label: submissionStatusLabels[value], value }),
);

export const developerStatusOptions = Object.values(DeveloperAccountStatus).map(
  (value) => ({ label: developerStatusLabels[value], value }),
);

export const planTypeOptions = Object.values(MiePlanType).map((value) => ({
  label: planTypeLabels[value],
  value,
}));

export const payoutBypassOptions = [
  { label: "No-payout only", value: "true" },
  { label: "Paying only", value: "false" },
];

/* ──────────────────────────── Reference codes ──────────────────────────── */

/**
 * `SCB-xxxxxxxx-S` — the trailing letter is regenerated on every transition, so
 * it always agrees with `status` and is never a historical record.
 */
export const referenceSuffixLabels: Record<string, string> = {
  P: "Pending review",
  D: "Duplicate in queue",
  E: "Duplicate existing",
  X: "Previously rejected",
  A: "Approved",
  R: "Rejected",
};

export const referenceSuffix = (reference: string) => {
  const suffix = reference?.split("-").pop() ?? "";
  return suffix.length === 1 ? suffix : "";
};

export const referenceSuffixHint = (reference: string) => {
  const suffix = referenceSuffix(reference);
  const label = referenceSuffixLabels[suffix];
  return label
    ? `Suffix "${suffix}" — ${label}. The letter follows the current status.`
    : "Public reference. The suffix letter follows the current status.";
};

/* ──────────────────────────── Timestamps ──────────────────────────── */

export const formatAbsolute = (iso: string | null | undefined) => {
  if (!iso) return "—";
  try {
    return format(parseISO(iso), "dd MMM yyyy, HH:mm");
  } catch {
    return "—";
  }
};

export const formatRelative = (iso: string | null | undefined) => {
  if (!iso) return "—";
  try {
    return `${formatDistanceToNow(parseISO(iso))} ago`;
  } catch {
    return "—";
  }
};

/* ──────────────────────────── Numbers ──────────────────────────── */

/** `"4200.00"` → `"$4,200.00"`. Left alone when the backend sends nothing. */
export const formatEarnings = (value: string | null | undefined) => {
  if (value === null || value === undefined || value === "") return "—";
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return value;
  return `$${numeric.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

/** Pretty-prints the verbatim Endpoint-1 payload for the raw viewer. */
export const formatPayload = (payload: unknown) => {
  try {
    return JSON.stringify(payload ?? {}, null, 2);
  } catch {
    return String(payload);
  }
};

/**
 * The extra context keys a developer sent alongside `title`. Shown separately so
 * operators can read the pitch without scanning raw JSON.
 */
export const payloadExtras = (payload: Record<string, unknown> | undefined) =>
  Object.entries(payload ?? {}).filter(([key]) => key !== "title");
