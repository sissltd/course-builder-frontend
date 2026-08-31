import { BaseAPI } from "@/redux/baseApi";
import type { Assessment, UpsertAssessmentRequest } from "../types/assessment";

export const assessmentApi = BaseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getCourseFinalAssessment: builder.query<Assessment, string>({
      query: (courseId) => ({
        url: `/courses/${courseId}/final-assessment/`,
        method: "GET",
      }),
      providesTags: (_result, _error, courseId) => [
        { type: "Assessment", id: `course-${courseId}` },
      ],
    }),

    upsertCourseFinalAssessment: builder.mutation<
      Assessment,
      { courseId: string; body: UpsertAssessmentRequest }
    >({
      query: ({ courseId, body }) => ({
        url: `/courses/${courseId}/final-assessment/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { courseId }) => [
        { type: "Assessment", id: `course-${courseId}` },
        "Assessment",
      ],
    }),

    getModuleAssessment: builder.query<
      Assessment,
      { courseId: string; moduleId: string }
    >({
      query: ({ courseId, moduleId }) => ({
        url: `/courses/${courseId}/modules/${moduleId}/assessment/`,
        method: "GET",
      }),
      providesTags: (_result, _error, { courseId, moduleId }) => [
        { type: "Assessment", id: `module-${courseId}-${moduleId}` },
      ],
    }),

    upsertModuleAssessment: builder.mutation<
      Assessment,
      {
        courseId: string;
        moduleId: string;
        body: UpsertAssessmentRequest;
      }
    >({
      query: ({ courseId, moduleId, body }) => ({
        url: `/courses/${courseId}/modules/${moduleId}/assessment/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { courseId, moduleId }) => [
        { type: "Assessment", id: `module-${courseId}-${moduleId}` },
        "Assessment",
      ],
    }),

    getLessonAssessment: builder.query<
      Assessment,
      { courseId: string; moduleId: string; lessonId: string }
    >({
      query: ({ courseId, moduleId, lessonId }) => ({
        url: `/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/assessment/`,
        method: "GET",
      }),
      providesTags: (_result, _error, { courseId, moduleId, lessonId }) => [
        {
          type: "Assessment",
          id: `lesson-${courseId}-${moduleId}-${lessonId}`,
        },
      ],
    }),

    upsertLessonAssessment: builder.mutation<
      Assessment,
      {
        courseId: string;
        moduleId: string;
        lessonId: string;
        body: UpsertAssessmentRequest;
      }
    >({
      query: ({ courseId, moduleId, lessonId, body }) => ({
        url: `/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/assessment/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (
        _result,
        _error,
        { courseId, moduleId, lessonId },
      ) => [
        {
          type: "Assessment",
          id: `lesson-${courseId}-${moduleId}-${lessonId}`,
        },
        "Assessment",
      ],
    }),
  }),
});

export const {
  useGetCourseFinalAssessmentQuery,
  useUpsertCourseFinalAssessmentMutation,
  useGetModuleAssessmentQuery,
  useUpsertModuleAssessmentMutation,
  useGetLessonAssessmentQuery,
  useUpsertLessonAssessmentMutation,
} = assessmentApi;
