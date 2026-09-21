import { BaseAPI } from "@/redux/baseApi";
import type { PaginatedResponse } from "@/modules/creator/courses/types";
import type {
  Topic,
  TopicListParams,
  TopicWriteRequest,
  UpdateTopicRequest,
} from "../types";

/**
 * `/topics/` is shared, not creator-owned: creators read it to populate the topic
 * dropdown when building a course, and admins write to it from `/admin/topics`.
 * It lives here for the same reason `/categories/` lives in `src/modules/categories/`
 * — one slice per resource, so tag invalidation cannot diverge between the two
 * audiences.
 */
export const topicsApi = BaseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getTopics: builder.query<
      PaginatedResponse<Topic[]>,
      TopicListParams | void
    >({
      query: (params) => ({
        url: "/topics/",
        method: "GET",
        params: params || {},
      }),
      transformResponse: (response: {
        status: boolean;
        message: string;
        data: {
          paginator: PaginatedResponse<Topic[]>["data"]["paginator"];
          results: Topic[][];
        };
      }) => ({
        ...response,
        data: {
          ...response.data,
          results: response.data.results.flat(),
        },
      }),
      providesTags: ["Topic"],
    }),

    getTopic: builder.query<Topic, string>({
      query: (id) => ({
        url: `/topics/${id}/`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Topic", id }],
    }),

    /**
     * Creates a topic under a category, fixing the price paid for a course
     * submitted under it. Admin / Creator Reviewer / Verifier only.
     */
    createTopic: builder.mutation<Topic, TopicWriteRequest>({
      query: (body) => ({
        url: "/topics/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Topic"],
    }),

    /**
     * Full overwrite — every field must be supplied. Prefer `updateTopic` for
     * routine edits, since a partial body here blanks whatever it omits.
     */
    replaceTopic: builder.mutation<
      Topic,
      { id: string; body: TopicWriteRequest }
    >({
      query: ({ id, body }) => ({
        url: `/topics/${id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "Topic",
        { type: "Topic", id },
      ],
    }),

    /** The normal way to reprice a topic or open/close it to submissions. */
    updateTopic: builder.mutation<
      Topic,
      { id: string; body: UpdateTopicRequest }
    >({
      query: ({ id, body }) => ({
        url: `/topics/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "Topic",
        { type: "Topic", id },
      ],
    }),

    /**
     * Topics have no deletion-impact or strategy flow — unlike Category, a topic
     * with courses attached is removed and the FK left to the database's own
     * cascade. PATCH `status: INACTIVE` is the non-destructive alternative.
     */
    deleteTopic: builder.mutation<void, string>({
      query: (id) => ({
        url: `/topics/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => ["Topic", { type: "Topic", id }],
    }),

    /**
     * Clears `reserved_by` / `reserved_until`, freeing the topic for a new
     * reservation request before the current one has expired — the case being a
     * creator who reserved a topic and then went inactive.
     *
     * Idempotent: releasing an unreserved topic is a no-op, not an error, so a
     * success response is not evidence that a reservation existed. Typed `void`
     * for that reason — the invalidated refetch is the source of truth.
     */
    releaseTopicReservation: builder.mutation<void, string>({
      query: (id) => ({
        url: `/topics/${id}/release-reservation/`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, id) => ["Topic", { type: "Topic", id }],
    }),
  }),
});

export const {
  useGetTopicsQuery,
  useGetTopicQuery,
  useCreateTopicMutation,
  useReplaceTopicMutation,
  useUpdateTopicMutation,
  useDeleteTopicMutation,
  useReleaseTopicReservationMutation,
} = topicsApi;
