import { BaseAPI } from "@/redux/baseApi";
import type {
  CreateSupportAppealRequest,
  CreateSupportTicketRequest,
  PaginatedResponse,
  RawPaginatedResponse,
  ResolveSupportRequestRequest,
  SendContactMessageRequest,
  SupportListParams,
  SupportRequest,
  SupportRequestDetailResponse,
  SupportRequestListParams,
} from "../types";

/**
 * Drops empty filter slots so a cleared select never sends `?kind=` — the
 * backend reads an empty value as an invalid choice rather than "no filter".
 */
const compactParams = <T extends object>(params: T) =>
  Object.fromEntries(
    Object.entries(params ?? {}).filter(
      ([, value]) => value !== undefined && value !== null && value !== "",
    ),
  );

/**
 * Some paginated endpoints hand back `results` as an array of pages rather than
 * a flat array. Flattening one level is a no-op on an already-flat payload, so
 * it is safe for every list in this module.
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

export const supportApi = BaseAPI.injectEndpoints({
  endpoints: (builder) => ({
    /* ───────────────────────── Creator: own requests ───────────────────────── */

    /** The caller's own tickets. Any signed-in user may read this. */
    getSupportTickets: builder.query<
      PaginatedResponse<SupportRequest[]>,
      SupportListParams | void
    >({
      query: (params) => ({
        url: "/support/tickets/",
        method: "GET",
        params: compactParams(params ?? {}),
      }),
      transformResponse: flattenResults<SupportRequest>,
      providesTags: ["SupportTicket"],
    }),

    createSupportTicket: builder.mutation<
      SupportRequestDetailResponse,
      CreateSupportTicketRequest
    >({
      query: (body) => ({
        url: "/support/tickets/",
        method: "POST",
        body,
      }),
      // The creator's ticket list is the only thing that can change, so this
      // refreshes it with no manual refetch. `SupportRequest` is included for the
      // admin queue, which shows the same record under a different listing.
      invalidatesTags: ["SupportTicket", "SupportRequest"],
    }),

    /** The caller's own appeals — the same listing an appeal form writes into. */
    getSupportAppeals: builder.query<
      PaginatedResponse<SupportRequest[]>,
      SupportListParams | void
    >({
      query: (params) => ({
        url: "/support/appeals/",
        method: "GET",
        params: compactParams(params ?? {}),
      }),
      transformResponse: flattenResults<SupportRequest>,
      providesTags: ["SupportAppeal"],
    }),

    /** Open to a suspended creator too — an appeal is the way back in. */
    createSupportAppeal: builder.mutation<
      SupportRequestDetailResponse,
      CreateSupportAppealRequest
    >({
      query: (body) => ({
        url: "/support/appeals/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["SupportAppeal", "SupportRequest"],
    }),

    /* ───────────────────────────── Public contact ──────────────────────────── */

    /**
     * Reachable signed out, so it is registered in `PUBLIC_ENDPOINTS` and must
     * never be given a bearer token. Rate limited per IP — a 429 arrives here as
     * an ordinary RTK Query error and callers check `getErrorStatus(error)`.
     */
    sendContactMessage: builder.mutation<
      { status: boolean; message: string },
      SendContactMessageRequest
    >({
      query: (body) => ({
        url: "/support/contact/",
        method: "POST",
        body,
      }),
      // A contact message becomes a ticket in the queue, so both admin listings
      // and the creator's own ticket list can move under the submitter.
      invalidatesTags: ["SupportTicket", "SupportRequest"],
    }),

    /* ──────────────────────────── Admin queue ──────────────────────────────── */

    /** `support.manage_requests`. Backs both the queue and the stat cards. */
    getSupportRequests: builder.query<
      PaginatedResponse<SupportRequest[]>,
      SupportRequestListParams | void
    >({
      query: (params) => ({
        url: "/support/requests/",
        method: "GET",
        params: compactParams(params ?? {}),
      }),
      transformResponse: flattenResults<SupportRequest>,
      providesTags: ["SupportRequest"],
    }),

    getSupportRequest: builder.query<SupportRequest, string>({
      query: (id) => ({
        url: `/support/requests/${id}/`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "SupportRequest", id }],
    }),

    /**
     * Final and irreversible: the backend accepts it only while the request is
     * `OPEN`, and rejects a second attempt with a 400. Both the detail record and
     * the queue it came from are invalidated, so the detail page updates in
     * place instead of needing a refetch.
     */
    resolveSupportRequest: builder.mutation<
      SupportRequestDetailResponse,
      { id: string; body: ResolveSupportRequestRequest }
    >({
      query: ({ id, body }) => ({
        url: `/support/requests/${id}/resolve/`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "SupportRequest", id },
        "SupportRequest",
        // The submitter watches the request from their own tickets/appeals
        // listing, which carries the creator-facing tag rather than this one.
        "SupportTicket",
        "SupportAppeal",
      ],
    }),
  }),
});

export const {
  useGetSupportTicketsQuery,
  useCreateSupportTicketMutation,
  useGetSupportAppealsQuery,
  useCreateSupportAppealMutation,
  useSendContactMessageMutation,
  useGetSupportRequestsQuery,
  useGetSupportRequestQuery,
  useResolveSupportRequestMutation,
} = supportApi;
