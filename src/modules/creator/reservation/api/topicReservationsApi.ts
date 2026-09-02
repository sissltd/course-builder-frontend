import { BaseAPI } from "@/redux/baseApi";
import type {
  TopicReservation,
  TopicReservationListParams,
  CreateTopicReservationRequest,
  TopicReservationListResponse,
} from "../types";
import type { PaginatedPaginator } from "../../courses/types";

interface RawTopicReservationListResponse {
  status: boolean;
  message: string;
  data: {
    paginator: PaginatedPaginator;
    results: TopicReservation[][];
  };
}

export const topicReservationsApi = BaseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getTopicReservations: builder.query<
      TopicReservationListResponse,
      TopicReservationListParams | void
    >({
      query: (params) => ({
        url: "/topic-reservations/",
        method: "GET",
        params: params || {},
      }),
      transformResponse: (response: RawTopicReservationListResponse) => ({
        ...response,
        data: {
          ...response.data,
          results: response.data.results.flat(),
        },
      }),
      providesTags: ["TopicReservation"],
    }),

    getTopicReservation: builder.query<TopicReservation, string>({
      query: (id) => ({
        url: `/topic-reservations/${id}/`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [
        { type: "TopicReservation", id },
      ],
    }),

    createTopicReservation: builder.mutation<
      TopicReservation,
      CreateTopicReservationRequest
    >({
      query: (body) => ({
        url: "/topic-reservations/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["TopicReservation"],
    }),

    replaceTopicReservation: builder.mutation<
      TopicReservation,
      { id: string; body: CreateTopicReservationRequest }
    >({
      query: ({ id, body }) => ({
        url: `/topic-reservations/${id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "TopicReservation", id },
        "TopicReservation",
      ],
    }),

    updateTopicReservation: builder.mutation<
      TopicReservation,
      { id: string; body: Partial<CreateTopicReservationRequest> }
    >({
      query: ({ id, body }) => ({
        url: `/topic-reservations/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "TopicReservation", id },
        "TopicReservation",
      ],
    }),

    deleteTopicReservation: builder.mutation<void, string>({
      query: (id) => ({
        url: `/topic-reservations/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["TopicReservation"],
    }),
  }),
});

export const {
  useGetTopicReservationsQuery,
  useGetTopicReservationQuery,
  useCreateTopicReservationMutation,
  useReplaceTopicReservationMutation,
  useUpdateTopicReservationMutation,
  useDeleteTopicReservationMutation,
} = topicReservationsApi;
