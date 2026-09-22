import { BaseAPI } from "@/redux/baseApi";

// ─── Availability ─────────────────────────────────────────────────────────────

/**
 * `GET/PATCH /users/me/availability/`.
 *
 * The handover doc lists this endpoint but never names its fields, so the names
 * below come from the live OpenAPI schema (`/api/schema/`) — specifically
 * `components.schemas.ReviewerAvailability` — which is the contract of record.
 */
export interface ReviewerAvailability {
  id: string;
  is_available: boolean;
  unavailability_reason: UnavailabilityReason | null;
  return_date: string | null;
  auto_return_enabled: boolean;
  /**
   * Derived server-side, like `effective_track_filter`: `is_available` is the
   * stored intent, this is what actually applies (e.g. once `return_date` has
   * passed). Read it, never re-derive it.
   */
  is_effectively_available: boolean;
}

/**
 * The write serializer takes only these four. `id` and
 * `is_effectively_available` are read-only and must never be sent.
 */
export interface UpdateReviewerAvailabilityRequest {
  is_available?: boolean;
  unavailability_reason?: UnavailabilityReason | null;
  return_date?: string | null;
  auto_return_enabled?: boolean;
}

export type UnavailabilityReason =
  | "VACATION"
  | "SICK_LEAVE"
  | "PERSONAL"
  | "TRAINING"
  | "OTHER";

export const UNAVAILABILITY_REASONS: Array<{
  value: UnavailabilityReason;
  label: string;
}> = [
  { value: "VACATION", label: "On Vacation" },
  { value: "SICK_LEAVE", label: "Sick Leave" },
  { value: "PERSONAL", label: "Personal" },
  { value: "TRAINING", label: "Training" },
  { value: "OTHER", label: "Other" },
];

// ─── Queue behaviour ──────────────────────────────────────────────────────────

/** Derived server-side; `show_both_track` wins over the other two. */
export type EffectiveTrackFilter = "ALL" | "AI_TRACK" | "CREATOR_TRACK" | "NONE";

export type ReviewQueueSortOrder =
  | "ALL"
  | "NEWEST_FIRST"
  | "OLDEST_FIRST"
  | "LAST_30_DAYS"
  | "LAST_7_DAYS"
  | "LAST_24_HOURS";

export interface ReviewerQueuePreferences {
  id: string;
  show_ai_track: boolean;
  show_creator_track: boolean;
  show_both_track: boolean;
  /** Read-only — the server derives it, so the client never re-derives the rule. */
  effective_track_filter: EffectiveTrackFilter;
  default_sort_order: ReviewQueueSortOrder;
  /**
   * Schema note: "Frontend-only … Stored here for round-trip; it has no backend
   * effect." It is persisted so the preference follows the reviewer between
   * devices, but the advance behaviour itself is ours to implement.
   */
  auto_advance_enabled: boolean;
}

/**
 * `id` and `effective_track_filter` are read-only, so they are never sent back.
 * `UpdateReviewerQueuePreferencesRequest` mirrors the schema's write serializer.
 */
export type UpdateReviewerQueuePreferencesRequest = Partial<
  Omit<ReviewerQueuePreferences, "id" | "effective_track_filter">
>;

/**
 * `SLA_URGENCY` is retired — it is not in the design — so it is deliberately
 * absent here.
 *
 * The `LAST_*` values narrow to that window *and* sort oldest-first, which is
 * why their labels say both.
 */
export const QUEUE_SORT_OPTIONS: Array<{
  value: ReviewQueueSortOrder;
  label: string;
}> = [
  { value: "ALL", label: "All" },
  { value: "NEWEST_FIRST", label: "Newest first" },
  { value: "OLDEST_FIRST", label: "Oldest first" },
  { value: "LAST_30_DAYS", label: "Last 30 days (oldest first)" },
  { value: "LAST_7_DAYS", label: "Last 7 days (oldest first)" },
  { value: "LAST_24_HOURS", label: "Last 24 hours (oldest first)" },
];

export const EFFECTIVE_TRACK_LABELS: Record<EffectiveTrackFilter, string> = {
  ALL: "All courses",
  AI_TRACK: "AI track only",
  CREATOR_TRACK: "Creator track only",
  NONE: "Nothing — every track is switched off",
};

// ─── Login & security ─────────────────────────────────────────────────────────

/**
 * Schema (`components.schemas.ChangeEmailRequestRequest`): identity is proven
 * with the current password before the confirmation link goes to `new_email`.
 * Both fields are required — a body of `{ email }` would 400.
 */
export interface ChangeEmailRequest {
  new_email: string;
  password: string;
}

// ─── API ──────────────────────────────────────────────────────────────────────

export const reviewerSettingsApi = BaseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getReviewerAvailability: builder.query<ReviewerAvailability, void>({
      query: () => ({
        url: "/users/me/availability/",
        method: "GET",
      }),
      providesTags: ["ReviewerSettings"],
    }),

    updateReviewerAvailability: builder.mutation<
      ReviewerAvailability,
      UpdateReviewerAvailabilityRequest
    >({
      query: (body) => ({
        url: "/users/me/availability/",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["ReviewerSettings"],
    }),

    getReviewerQueuePreferences: builder.query<ReviewerQueuePreferences, void>({
      query: () => ({
        url: "/users/me/queue-preferences/",
        method: "GET",
      }),
      providesTags: ["ReviewerSettings"],
    }),

    updateReviewerQueuePreferences: builder.mutation<
      ReviewerQueuePreferences,
      UpdateReviewerQueuePreferencesRequest
    >({
      query: (body) => ({
        url: "/users/me/queue-preferences/",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["ReviewerSettings"],
    }),

    changeEmail: builder.mutation<{ detail: string }, ChangeEmailRequest>({
      query: (body) => ({
        url: "/auth/change-email/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["UserProfile"],
    }),

    /**
     * Both exports stream `text/csv` as an attachment, so they are fetched as
     * blobs and saved client-side. The audit export is scoped to the caller
     * server-side, so there is nothing to filter here.
     */
    exportActivityLog: builder.query<Blob, void>({
      query: () => ({
        url: "/users/me/activity-log/export/",
        method: "GET",
        responseHandler: (response) => response.blob(),
        cache: "no-cache",
      }),
    }),

    exportAuditLog: builder.query<Blob, void>({
      query: () => ({
        url: "/users/me/audit-log/export/",
        method: "GET",
        responseHandler: (response) => response.blob(),
        cache: "no-cache",
      }),
    }),
  }),
});

export const {
  useGetReviewerAvailabilityQuery,
  useUpdateReviewerAvailabilityMutation,
  useGetReviewerQueuePreferencesQuery,
  useUpdateReviewerQueuePreferencesMutation,
  useChangeEmailMutation,
  useLazyExportActivityLogQuery,
  useLazyExportAuditLogQuery,
} = reviewerSettingsApi;
