/* ─────────────────────────────── Kinds & statuses ─────────────────────────── */

/**
 * `kind` values the API returns.
 *
 * The API only ever names these two in its documentation — a request is either
 * a ticket or an appeal — so the arrays are the single place to correct if the
 * backend grows a third kind (e.g. a dispute). Every badge, filter and union
 * reads from here.
 */
export const SUPPORT_REQUEST_KINDS = ["TICKET", "APPEAL"] as const;

export type SupportRequestKind = (typeof SUPPORT_REQUEST_KINDS)[number];

/**
 * `status` values.
 *
 * Only `OPEN` appears anywhere in the API docs, together with the rule that
 * `POST /support/requests/{id}/resolve/` is accepted **only** while a request is
 * open. The rest are inferred from a conventional support queue; treat them as
 * best-effort and correct this one array once the enum is confirmed against a
 * running backend. `SupportStatusBadge` degrades to a neutral pill for a value
 * that is not listed, so an unrecognised status still renders rather than
 * throwing.
 */
export const SUPPORT_REQUEST_STATUSES = [
  "OPEN",
  "IN_PROGRESS",
  "RESOLVED",
  "CLOSED",
] as const;

export type SupportRequestStatus = (typeof SUPPORT_REQUEST_STATUSES)[number];

export const SUPPORT_REQUEST_STATUS_LABELS: Record<
  SupportRequestStatus,
  string
> = {
  OPEN: "Open",
  IN_PROGRESS: "In progress",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
};

export const SUPPORT_REQUEST_KIND_LABELS: Record<SupportRequestKind, string> = {
  TICKET: "Ticket",
  APPEAL: "Appeal",
};

/** The only status a resolve may be submitted against, per the API. */
export const RESOLVABLE_STATUS: SupportRequestStatus = "OPEN";

/* ─────────────────────────────────── Records ────────────────────────────────── */

/**
 * A support request, in the identical shape every `/support/*` endpoint returns
 * it — the signed-in lists, the admin queue and the admin detail all read the
 * same record, so there is one type rather than three projections of it.
 */
export interface SupportRequest {
  id: string;
  kind: SupportRequestKind;
  first_name: string;
  last_name: string;
  email: string;
  /** Two-letter ISO code, as submitted on the public contact form. */
  country: string | null;
  title: string;
  /** Optional link supplied by the submitter ("https://…" shown on the form). */
  web_link: string | null;
  /** The submitter's own words — the whole conversation until it is resolved. */
  message: string;
  status: SupportRequestStatus;
  /** SLA deadline. Null on kinds that are not queued for a decision. */
  due_at: string | null;
  resolution_notes: string | null;
  /** Null until resolved; the backend treats resolve as final. */
  resolved_at: string | null;
  /**
   * The account the request was raised under. `null` for the anonymous public
   * contact form, which is why the admin queue shows the email instead.
   */
  submitted_by_email: string | null;
  created_datetime: string;
}

/** One turn of a conversation. Rendered only — there is no compose endpoint. */
export interface SupportConversationMessage {
  id: string;
  author: string;
  body: string;
  sentAt: string;
}

/* ──────────────────────────────── Pagination ───────────────────────────────── */

/* Declared per-module rather than shared, matching every other module here. */
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

/** Raw list envelope before `results` is flattened — some pages come nested. */
export interface RawPaginatedResponse<T> {
  status: boolean;
  message: string;
  data: {
    paginator: PaginatedPaginator;
    results: (T | T[])[];
  };
}

/** The envelope the create/resolve endpoints answer with. */
export interface SupportRequestDetailResponse {
  status: boolean;
  message: string;
  data: SupportRequest;
}

/* ─────────────────────────────────── Inputs ─────────────────────────────────── */

export interface SupportListParams {
  page?: number;
  page_size?: number;
  ordering?: string;
  search?: string;
}

/**
 * Queue filters. The API documents these in prose ("filter with kind and
 * status") rather than in its parameter table, so the names are best-effort —
 * confirm them against a running backend.
 */
export interface SupportRequestListParams extends SupportListParams {
  kind?: SupportRequestKind;
  status?: SupportRequestStatus;
}

/**
 * `POST /support/tickets/` and `POST /support/appeals/` share one body. The
 * forms are camelCase, so each form maps its values onto this before sending.
 */
export interface CreateSupportTicketRequest {
  title: string;
  email: string;
  web_link?: string;
  description: string;
}

export type CreateSupportAppealRequest = CreateSupportTicketRequest;

/** `POST /support/contact/` — public, so it carries the submitter's identity. */
export interface SendContactMessageRequest {
  first_name: string;
  last_name: string;
  email: string;
  country: string;
  message: string;
}

/** `POST /support/requests/{id}/resolve/` — `notes` is optional server-side. */
export interface ResolveSupportRequestRequest {
  notes?: string;
}

/**
 * Backend `field_name` → form field. Required on every support mutation because
 * the API speaks snake_case while the forms are camelCase, so `normalizeApiError`
 * would otherwise stamp `web_link` errors onto a `webLink` field that does not
 * exist and the user would never see them.
 */
export const SUPPORT_FIELD_MAP: Record<string, string> = {
  first_name: "firstName",
  last_name: "lastName",
  web_link: "webLink",
};
