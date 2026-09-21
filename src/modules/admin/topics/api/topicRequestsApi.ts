import { BaseAPI } from "@/redux/baseApi";
import type { PaginatedPaginator } from "@/modules/creator/courses/types";

/**
 * A proposed topic awaiting administrative review. `topic` stays `null` until the
 * request is approved and the topic is created, so every consumer has to handle
 * the unapproved case.
 */
export interface TopicRequest {
  id: string;
  name: string;
  category: {
    id: string;
    name: string;
  };
  topic: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED" | string;
  rejection_reason: string | null;
  reviewed_at: string | null;
  created_datetime: string;
  requested_by: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  reviewed_by: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  } | null;
}

export interface TopicRequestsParams {
  status?: string;
  category?: string;
  requested_by?: string;
  search?: string;
  created_after?: string;
  created_before?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

interface RawTopicRequestsResponse {
  status: boolean;
  message: string;
  data: {
    paginator: PaginatedPaginator;
    /** Double-nested on this API, like every other list endpoint. */
    results: TopicRequest[][];
  };
}

export interface TopicRequestsResponse {
  status: boolean;
  message: string;
  data: {
    paginator: PaginatedPaginator;
    results: TopicRequest[];
  };
}

/**
 * The administrative topic-request queue at `/admin/topic-requests/`.
 *
 * Distinct from `/admin/reservations/requests/`, which the `/admin/reservation`
 * screen continues to use and which returns the same shape. Both are live; this
 * slice deliberately does not touch that one.
 *
 * Admin, Approver, or Super Admin only.
 */
export const topicRequestsApi = BaseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getTopicRequests: builder.query<
      TopicRequestsResponse,
      TopicRequestsParams | void
    >({
      query: (params) => ({
        url: "/admin/topic-requests/",
        method: "GET",
        params: params || {},
      }),
      transformResponse: (response: RawTopicRequestsResponse) => ({
        ...response,
        data: {
          ...response.data,
          results: response.data.results.flat(),
        },
      }),
      providesTags: ["TopicReservation"],
    }),

    getTopicRequest: builder.query<TopicRequest, string>({
      query: (id) => ({
        url: `/admin/topic-requests/${id}/`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "TopicReservation", id }],
    }),

    /**
     * Approves a Pending request, creates the topic under its category, and
     * reserves it for the requesting creator. The new topic inherits the
     * category's beginner creator price — this request accepts no price, so the
     * admin reprices it afterwards from the Topics screen if needed.
     */
    approveTopicRequest: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/topic-requests/${id}/approve/`,
        method: "POST",
      }),
      invalidatesTags: ["TopicReservation", "Topic"],
    }),

    /** Retains the request in the review history; no topic is created. */
    rejectTopicRequest: builder.mutation<
      void,
      { id: string; rejection_reason?: string }
    >({
      query: ({ id, rejection_reason }) => ({
        url: `/admin/topic-requests/${id}/reject/`,
        method: "POST",
        body: rejection_reason ? { rejection_reason } : {},
      }),
      invalidatesTags: ["TopicReservation"],
    }),
  }),
});

export const {
  useGetTopicRequestsQuery,
  useGetTopicRequestQuery,
  useApproveTopicRequestMutation,
  useRejectTopicRequestMutation,
} = topicRequestsApi;
