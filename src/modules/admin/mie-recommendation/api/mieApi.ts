import { BaseAPI } from "@/redux/baseApi";
import type {
  DemandSignalsRequest,
  DetailResponse,
  DeveloperApprovalResponse,
  MieDeveloper,
  MieDevelopersListParams,
  MieRejectionReason,
  MieRejectionReasonsListParams,
  MieSubmission,
  MieSubmissionsListParams,
  PaginatedResponse,
  PayoutBypassRequest,
  RawPaginatedResponse,
  RegisterDeveloperRequest,
  CreateRejectionReasonRequest,
  SubmissionDecisionRequest,
  SubmissionDecisionResponse,
  UpdateRejectionReasonRequest,
} from "../types";

/**
 * Drops empty filter slots so a cleared select never sends `?status=` — the
 * backend treats an empty value as an invalid choice rather than "no filter".
 */
const compactParams = <T extends object>(params: T) =>
  Object.fromEntries(
    Object.entries(params ?? {}).filter(
      ([, value]) => value !== undefined && value !== null && value !== "",
    ),
  );

/**
 * Some paginated endpoints hand back `results` as an array of pages rather than
 * a flat array. Flattening one level is a no-op on already-flat payloads, so it
 * is safe for every list in this module.
 */
const flattenResults = <T>(
  response: RawPaginatedResponse<T>,
): PaginatedResponse<T[]> => ({
  ...response,
  data: {
    ...response.data,
    results: (response.data?.results ?? []).flat() as T[],
  },
});

export const mieApi = BaseAPI.injectEndpoints({
  endpoints: (builder) => ({
    /* ───────────────────── Developer accounts ───────────────────── */

    getMieDevelopers: builder.query<
      PaginatedResponse<MieDeveloper[]>,
      MieDevelopersListParams
    >({
      query: (params) => ({
        url: "/mie/admin/developers/",
        method: "GET",
        params: compactParams(params),
      }),
      transformResponse: flattenResults<MieDeveloper>,
      providesTags: ["MieDeveloper"],
    }),

    getMieDeveloper: builder.query<MieDeveloper, string>({
      query: (id) => ({
        url: `/mie/admin/developers/${id}/`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "MieDeveloper", id }],
    }),

    /** Manual onboarding. Lands in PENDING exactly like a self-registration. */
    registerMieDeveloper: builder.mutation<MieDeveloper, RegisterDeveloperRequest>({
      query: (body) => ({
        url: "/mie/admin/developers/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["MieDeveloper"],
    }),

    /**
     * Approves a PENDING, REJECTED or SUSPENDED account. `one_time_api_key` is
     * populated only when credentials were freshly issued — it must be shown to
     * the operator immediately because it is never retrievable again.
     */
    approveMieDeveloper: builder.mutation<DeveloperApprovalResponse, string>({
      query: (id) => ({
        url: `/mie/admin/developers/${id}/approve/`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "MieDeveloper", id },
        "MieDeveloper",
      ],
    }),

    /** Revokes credentials. Reversible — approving later issues a fresh key. */
    rejectMieDeveloper: builder.mutation<DetailResponse, string>({
      query: (id) => ({
        url: `/mie/admin/developers/${id}/reject/`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "MieDeveloper", id },
        "MieDeveloper",
      ],
    }),

    /** APPROVED accounts only. Freezes credentials, keeps queue history. */
    suspendMieDeveloper: builder.mutation<DetailResponse, string>({
      query: (id) => ({
        url: `/mie/admin/developers/${id}/suspend/`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "MieDeveloper", id },
        "MieDeveloper",
      ],
    }),

    /* ───────────────────── Rejection reasons ───────────────────── */

    getMieRejectionReasons: builder.query<
      PaginatedResponse<MieRejectionReason[]>,
      MieRejectionReasonsListParams
    >({
      query: (params) => ({
        url: "/mie/admin/rejection-reasons/",
        method: "GET",
        params: compactParams(params),
      }),
      transformResponse: flattenResults<MieRejectionReason>,
      providesTags: ["MieRejectionReason"],
    }),

    getMieRejectionReason: builder.query<MieRejectionReason, string>({
      query: (id) => ({
        url: `/mie/admin/rejection-reasons/${id}/`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "MieRejectionReason", id }],
    }),

    createMieRejectionReason: builder.mutation<
      MieRejectionReason,
      CreateRejectionReasonRequest
    >({
      query: (body) => ({
        url: "/mie/admin/rejection-reasons/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["MieRejectionReason"],
    }),

    /** There is no delete — `is_active: false` soft-deactivates instead. */
    updateMieRejectionReason: builder.mutation<
      MieRejectionReason,
      { id: string; body: UpdateRejectionReasonRequest }
    >({
      query: ({ id, body }) => ({
        url: `/mie/admin/rejection-reasons/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "MieRejectionReason", id },
        "MieRejectionReason",
      ],
    }),

    /* ──────────────────────── Submissions ──────────────────────── */

    getMieSubmissions: builder.query<
      PaginatedResponse<MieSubmission[]>,
      MieSubmissionsListParams
    >({
      query: (params) => ({
        url: "/mie/admin/submissions/",
        method: "GET",
        params: compactParams(params),
      }),
      transformResponse: flattenResults<MieSubmission>,
      providesTags: ["MieSubmission"],
    }),

    getMieSubmission: builder.query<MieSubmission, string>({
      query: (id) => ({
        url: `/mie/admin/submissions/${id}/`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "MieSubmission", id }],
    }),

    /**
     * Works from any state — re-approving a rejected idea clears its rejection
     * metadata and relinks any course it already produced.
     */
    approveMieSubmission: builder.mutation<
      SubmissionDecisionResponse,
      { id: string; body?: SubmissionDecisionRequest }
    >({
      query: ({ id, body }) => ({
        url: `/mie/admin/submissions/${id}/approve/`,
        method: "POST",
        body: body ?? {},
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "MieSubmission", id },
        "MieSubmission",
      ],
    }),

    /**
     * Works from any state including APPROVED — a produced course is unpublished
     * and parked, never deleted. `rejection_reason` must be an existing label.
     */
    rejectMieSubmission: builder.mutation<
      SubmissionDecisionResponse,
      { id: string; body: SubmissionDecisionRequest }
    >({
      query: ({ id, body }) => ({
        url: `/mie/admin/submissions/${id}/reject/`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "MieSubmission", id },
        "MieSubmission",
      ],
    }),

    /** Advisory prioritisation metadata. Fires no webhook. */
    setMieSubmissionSignals: builder.mutation<
      MieSubmission,
      { id: string; body: DemandSignalsRequest }
    >({
      query: ({ id, body }) => ({
        url: `/mie/admin/submissions/${id}/signals/`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "MieSubmission", id },
        "MieSubmission",
      ],
    }),

    /** Per-idea no-payout marker. An identical toggle is rejected with a 400. */
    setMieSubmissionPayoutBypass: builder.mutation<
      MieSubmission,
      { id: string; body: PayoutBypassRequest }
    >({
      query: ({ id, body }) => ({
        url: `/mie/admin/submissions/${id}/payout_bypass/`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "MieSubmission", id },
        "MieSubmission",
      ],
    }),
  }),
});

export const {
  useGetMieDevelopersQuery,
  useGetMieDeveloperQuery,
  useRegisterMieDeveloperMutation,
  useApproveMieDeveloperMutation,
  useRejectMieDeveloperMutation,
  useSuspendMieDeveloperMutation,
  useGetMieRejectionReasonsQuery,
  useGetMieRejectionReasonQuery,
  useCreateMieRejectionReasonMutation,
  useUpdateMieRejectionReasonMutation,
  useGetMieSubmissionsQuery,
  useGetMieSubmissionQuery,
  useApproveMieSubmissionMutation,
  useRejectMieSubmissionMutation,
  useSetMieSubmissionSignalsMutation,
  useSetMieSubmissionPayoutBypassMutation,
} = mieApi;
