import { BaseAPI } from "@/redux/baseApi";
import type { CreatorOverviewResponse, QualityCheckResult, QualityCheckCriterion } from "../dashboard/types";

export const creatorApi = BaseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getCreatorOverview: builder.query<CreatorOverviewResponse, void>({
      query: () => ({
        url: "/creator/overview/",
        method: "GET",
      }),
    }),

    getQualityChecks: builder.query<QualityCheckResult[], string>({
      query: (courseId) => ({
        url: `/courses/${courseId}/quality-checks/`,
        method: "GET",
      }),
      providesTags: (_result, _error, courseId) => [
        { type: "QualityCheck", id: courseId },
      ],
    }),

    refreshQualityChecks: builder.mutation<QualityCheckResult[], string>({
      query: (courseId) => ({
        url: `/courses/${courseId}/quality-checks/`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, courseId) => [
        { type: "QualityCheck", id: courseId },
      ],
    }),

    getQualityCheckCriteria: builder.query<QualityCheckCriterion[], void>({
      query: () => ({
        url: "/quality-check-criteria/",
        method: "GET",
      }),
      transformResponse: (response: QualityCheckCriterion[]) => response,
    }),
  }),
});

export const {
  useGetCreatorOverviewQuery,
  useGetQualityChecksQuery,
  useRefreshQualityChecksMutation,
  useGetQualityCheckCriteriaQuery,
} = creatorApi;
