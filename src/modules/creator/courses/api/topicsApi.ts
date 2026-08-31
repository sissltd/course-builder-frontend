import { BaseAPI } from "@/redux/baseApi";
import type { PaginatedResponse } from "../types";
import type { Topic, TopicListParams } from "../types/topic";

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
  }),
});

export const { useGetTopicsQuery, useGetTopicQuery } = topicsApi;
