/**
 * MIE (Market Intelligence Engine) — external-developer course-idea pipeline.
 *
 * Mirrors `/api/v1/mie/...` in the TSES Course Builder OpenAPI document. The
 * admin surfaces in this module only ever talk to the `/mie/admin/*` paths; the
 * `/mie/v1/*` paths authenticate as the developer (API key or their own OTP
 * session) and are therefore not reachable with an admin bearer token.
 */

/* ─────────────────────────────── Enums ─────────────────────────────── */

/** Where a submission sits in the review pipeline. Every state can be revisited. */
export enum SubmissionStatus {
  PENDING_REVIEW = "PENDING_REVIEW",
  DUPLICATE_IN_QUEUE = "DUPLICATE_IN_QUEUE",
  DUPLICATE_EXISTING = "DUPLICATE_EXISTING",
  PREVIOUSLY_REJECTED = "PREVIOUSLY_REJECTED",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

/** Where a developer account sits in its approval lifecycle. */
export enum DeveloperAccountStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  SUSPENDED = "SUSPENDED",
}

/** Payout arrangement for a developer's accepted submissions. */
export enum MiePlanType {
  PAID_PER_SUBMISSION = "PAID_PER_SUBMISSION",
  BYPASS_PER_SUBMISSION = "BYPASS_PER_SUBMISSION",
  BYPASS_ACCOUNT = "BYPASS_ACCOUNT",
}

/* ───────────────────────── Pagination envelope ───────────────────────── */

export interface PaginatedPaginator {
  count: number;
  page: number;
  page_size: number;
  total_pages: number;
  next_page_number: number | null;
  next: string | null;
  previous_page_number: number | null;
  previous: string | null;
}

export interface PaginatedResponse<T> {
  status: boolean;
  message: string;
  data: {
    paginator: PaginatedPaginator;
    results: T;
  };
}

/** Raw list envelope before `results` is flattened — the API nests some pages. */
export interface RawPaginatedResponse<T> {
  status: boolean;
  message: string;
  data: {
    paginator: PaginatedPaginator;
    results: (T | T[])[];
  };
}

export interface DetailResponse {
  detail: string;
}

/* ───────────────────────── Developer accounts ───────────────────────── */

export interface MieDeveloper {
  id: string;
  email: string;
  webhook_url: string;
  status: DeveloperAccountStatus;
  plan_type: MiePlanType;
  /** Masked prefix of the current key, or null before issuance. */
  api_key_preview: string | null;
  api_key_issued_at: string | null;
  api_key_last_used_at: string | null;
  decided_at: string | null;
  created_datetime: string;
  updated_datetime: string;
}

export interface MieDevelopersListParams {
  status?: DeveloperAccountStatus | "";
  plan_type?: MiePlanType | "";
  search?: string;
  ordering?: string;
  page?: number;
  size?: number;
}

export interface RegisterDeveloperRequest {
  email: string;
  webhook_url: string;
  plan_type?: MiePlanType;
}

export interface DeveloperApprovalResponse {
  account: MieDeveloper;
  /**
   * Full `scb_live_...` key. Populated ONLY when credentials were freshly
   * issued — shown exactly once and never retrievable again. Null when the
   * account's existing key remains valid (e.g. un-suspending).
   */
  one_time_api_key: string | null;
}

/* ─────────────────────────── Rejection reasons ─────────────────────────── */

export interface MieRejectionReason {
  id: string;
  label: string;
  description?: string;
  is_active?: boolean;
  created_datetime: string;
}

export interface MieRejectionReasonsListParams {
  is_active?: boolean;
  ordering?: string;
  page?: number;
  size?: number;
}

export interface CreateRejectionReasonRequest {
  label: string;
  description?: string;
  is_active?: boolean;
}

export type UpdateRejectionReasonRequest = Partial<CreateRejectionReasonRequest>;

/* ─────────────────────────────── Submissions ─────────────────────────────── */

/** The verbatim Endpoint-1 body. `title` is guaranteed; extra keys ride along. */
export type SubmissionPayload = Record<string, unknown>;

export interface MieSubmission {
  id: string;
  /** `SCB-xxxxxxxx-S` — the suffix letter always mirrors `status`. */
  reference: string;
  title: string;
  status: SubmissionStatus;
  payload: SubmissionPayload;
  developer_id: string;
  developer_email: string;
  /** Per-idea no-payout marker; distinct from the developer's `plan_type`. */
  payout_bypass: boolean;
  demand_score: number | null;
  /** Decimal string, e.g. `"4200.00"`. */
  estimated_monthly_earnings: string | null;
  /** Taxonomy *label* (not id) attached to the latest rejection. */
  rejection_reason: string | null;
  rejection_note: string;
  queued_at: string | null;
  decided_at: string | null;
  decided_by_email: string | null;
  resulting_course: string | null;
  created_datetime: string;
  updated_datetime: string;
}

export interface MieSubmissionsListParams {
  status?: SubmissionStatus | "";
  payout_bypass?: boolean;
  /** Developer account uuid. */
  developer?: string;
  /** Exact developer email. */
  email?: string;
  /** ISO-8601 bounds on arrival time. */
  created_after?: string;
  created_before?: string;
  search?: string;
  ordering?: string;
  page?: number;
  size?: number;
}

export interface SubmissionDecisionRequest {
  /** Label of an existing active reason — REQUIRED when rejecting. */
  rejection_reason?: string;
  rejection_note?: string;
}

export interface SubmissionDecisionResponse {
  detail: string;
  submission: MieSubmission;
}

export interface DemandSignalsRequest {
  /** 0–100. */
  demand_score: number;
  estimated_monthly_earnings?: string | null;
}

export interface PayoutBypassRequest {
  payout_bypass: boolean;
}
