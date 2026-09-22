import { BaseAPI } from "@/redux/baseApi";
import type {
  ReviewerOverviewResponse,
  ReviewerActivityOverviewResponse,
  ReviewerPeriod,
} from "../types";

export const reviewerDashboardApi = BaseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getReviewerOverview: builder.query<ReviewerOverviewResponse, void>({
      query: () => ({
        url: "/reviewer/overview/",
        method: "GET",
      }),
      providesTags: ["ReviewerOverview"],
    }),

    getReviewerActivityOverview: builder.query<
      ReviewerActivityOverviewResponse,
      ReviewerPeriod | string | void
    >({
      query: (period) => ({
        url: "/reviewer/activity-overview/",
        method: "GET",
        params: period ? { period } : undefined,
      }),
      providesTags: ["ReviewerActivity"],
    }),
  }),
});

export const {
  useGetReviewerOverviewQuery,
  useGetReviewerActivityOverviewQuery,
} = reviewerDashboardApi;
