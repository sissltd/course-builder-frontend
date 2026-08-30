import { BaseAPI } from "@/redux/baseApi";
import type { PaginatedResponse } from "../types";
import type {
  Lesson,
  CreateLessonRequest,
  ReplaceLessonRequest,
  UpdateLessonRequest,
  ContentBlock,
  CreateContentBlockRequest,
  LessonImage,
  CreateLessonImageRequest,
  LessonRequirement,
  CreateLessonRequirementRequest,
  LessonListParams,
} from "../types/lesson";

export const lessonsApi = BaseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getLessons: builder.query<
      PaginatedResponse<Lesson[]>,
      {
        courseId: string;
        moduleId: string;
        params?: LessonListParams;
      }
    >({
      query: ({ courseId, moduleId, params }) => ({
        url: `/courses/${courseId}/modules/${moduleId}/lessons/`,
        method: "GET",
        params,
      }),
      transformResponse: (response: {
        status: boolean;
        message: string;
        data: {
          paginator: PaginatedResponse<Lesson[]>["data"]["paginator"];
          results: Lesson[][];
        };
      }) => ({
        ...response,
        data: {
          ...response.data,
          results: response.data.results.flat(),
        },
      }),
      providesTags: (_result, _error, { courseId, moduleId }) => [
        { type: "Lesson", id: `list-${courseId}-${moduleId}` },
      ],
    }),

    getLesson: builder.query<
      Lesson,
      { courseId: string; moduleId: string; lessonId: string }
    >({
      query: ({ courseId, moduleId, lessonId }) => ({
        url: `/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/`,
        method: "GET",
      }),
      providesTags: (_result, _error, { courseId, moduleId, lessonId }) => [
        { type: "Lesson", id: `${courseId}-${moduleId}-${lessonId}` },
      ],
    }),

    createLesson: builder.mutation<
      Lesson,
      {
        courseId: string;
        moduleId: string;
        body: CreateLessonRequest;
      }
    >({
      query: ({ courseId, moduleId, body }) => ({
        url: `/courses/${courseId}/modules/${moduleId}/lessons/`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { courseId, moduleId }) => [
        { type: "Lesson", id: `list-${courseId}-${moduleId}` },
        "Lesson",
      ],
    }),

    replaceLesson: builder.mutation<
      Lesson,
      {
        courseId: string;
        moduleId: string;
        lessonId: string;
        body: ReplaceLessonRequest;
      }
    >({
      query: ({ courseId, moduleId, lessonId, body }) => ({
        url: `/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (
        _result,
        _error,
        { courseId, moduleId, lessonId },
      ) => [
        { type: "Lesson", id: `${courseId}-${moduleId}-${lessonId}` },
        { type: "Lesson", id: `list-${courseId}-${moduleId}` },
        "Lesson",
      ],
    }),

    updateLesson: builder.mutation<
      Lesson,
      {
        courseId: string;
        moduleId: string;
        lessonId: string;
        body: UpdateLessonRequest;
      }
    >({
      query: ({ courseId, moduleId, lessonId, body }) => ({
        url: `/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (
        _result,
        _error,
        { courseId, moduleId, lessonId },
      ) => [
        { type: "Lesson", id: `${courseId}-${moduleId}-${lessonId}` },
        { type: "Lesson", id: `list-${courseId}-${moduleId}` },
        "Lesson",
      ],
    }),

    deleteLesson: builder.mutation<
      void,
      { courseId: string; moduleId: string; lessonId: string }
    >({
      query: ({ courseId, moduleId, lessonId }) => ({
        url: `/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { courseId, moduleId }) => [
        { type: "Lesson", id: `list-${courseId}-${moduleId}` },
        "Lesson",
      ],
    }),

    getContentBlocks: builder.query<
      PaginatedResponse<ContentBlock[]>,
      {
        courseId: string;
        moduleId: string;
        lessonId: string;
        params?: LessonListParams;
      }
    >({
      query: ({ courseId, moduleId, lessonId, params }) => ({
        url: `/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/content-blocks/`,
        method: "GET",
        params,
      }),
      transformResponse: (response: {
        status: boolean;
        message: string;
        data: {
          paginator: PaginatedResponse<ContentBlock[]>["data"]["paginator"];
          results: ContentBlock[];
        };
      }) => ({
        ...response,
        data: {
          ...response.data,
          results: Array.isArray(response.data.results)
            ? response.data.results
            : [response.data.results],
        },
      }),
      providesTags: (
        _result,
        _error,
        { courseId, moduleId, lessonId },
      ) => [
        {
          type: "ContentBlock",
          id: `list-${courseId}-${moduleId}-${lessonId}`,
        },
      ],
    }),

    createContentBlock: builder.mutation<
      ContentBlock,
      {
        courseId: string;
        moduleId: string;
        lessonId: string;
        body: CreateContentBlockRequest;
      }
    >({
      query: ({ courseId, moduleId, lessonId, body }) => ({
        url: `/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/content-blocks/`,
        method: "POST",
        body,
      }),
      invalidatesTags: (
        _result,
        _error,
        { courseId, moduleId, lessonId },
      ) => [
        {
          type: "ContentBlock",
          id: `list-${courseId}-${moduleId}-${lessonId}`,
        },
      ],
    }),

    getLessonImages: builder.query<
      PaginatedResponse<LessonImage[]>,
      {
        courseId: string;
        moduleId: string;
        lessonId: string;
        params?: LessonListParams;
      }
    >({
      query: ({ courseId, moduleId, lessonId, params }) => ({
        url: `/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/images/`,
        method: "GET",
        params,
      }),
      transformResponse: (response: {
        status: boolean;
        message: string;
        data: {
          paginator: PaginatedResponse<LessonImage[]>["data"]["paginator"];
          results: LessonImage[];
        };
      }) => ({
        ...response,
        data: {
          ...response.data,
          results: Array.isArray(response.data.results)
            ? response.data.results
            : [response.data.results],
        },
      }),
      providesTags: (
        _result,
        _error,
        { courseId, moduleId, lessonId },
      ) => [
        {
          type: "LessonImage",
          id: `list-${courseId}-${moduleId}-${lessonId}`,
        },
      ],
    }),

    createLessonImage: builder.mutation<
      LessonImage,
      {
        courseId: string;
        moduleId: string;
        lessonId: string;
        body: CreateLessonImageRequest;
      }
    >({
      query: ({ courseId, moduleId, lessonId, body }) => ({
        url: `/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/images/`,
        method: "POST",
        body,
      }),
      invalidatesTags: (
        _result,
        _error,
        { courseId, moduleId, lessonId },
      ) => [
        {
          type: "LessonImage",
          id: `list-${courseId}-${moduleId}-${lessonId}`,
        },
      ],
    }),

    getLessonRequirements: builder.query<
      PaginatedResponse<LessonRequirement[]>,
      {
        courseId: string;
        moduleId: string;
        lessonId: string;
        params?: LessonListParams;
      }
    >({
      query: ({ courseId, moduleId, lessonId, params }) => ({
        url: `/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/requirements/`,
        method: "GET",
        params,
      }),
      transformResponse: (response: {
        status: boolean;
        message: string;
        data: {
          paginator: PaginatedResponse<
            LessonRequirement[]
          >["data"]["paginator"];
          results: LessonRequirement[];
        };
      }) => ({
        ...response,
        data: {
          ...response.data,
          results: Array.isArray(response.data.results)
            ? response.data.results
            : [response.data.results],
        },
      }),
      providesTags: (
        _result,
        _error,
        { courseId, moduleId, lessonId },
      ) => [
        {
          type: "LessonRequirement",
          id: `list-${courseId}-${moduleId}-${lessonId}`,
        },
      ],
    }),

    createLessonRequirement: builder.mutation<
      LessonRequirement,
      {
        courseId: string;
        moduleId: string;
        lessonId: string;
        body: CreateLessonRequirementRequest;
      }
    >({
      query: ({ courseId, moduleId, lessonId, body }) => ({
        url: `/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/requirements/`,
        method: "POST",
        body,
      }),
      invalidatesTags: (
        _result,
        _error,
        { courseId, moduleId, lessonId },
      ) => [
        {
          type: "LessonRequirement",
          id: `list-${courseId}-${moduleId}-${lessonId}`,
        },
      ],
    }),
  }),
});

export const {
  useGetLessonsQuery,
  useGetLessonQuery,
  useCreateLessonMutation,
  useReplaceLessonMutation,
  useUpdateLessonMutation,
  useDeleteLessonMutation,
  useGetContentBlocksQuery,
  useCreateContentBlockMutation,
  useGetLessonImagesQuery,
  useCreateLessonImageMutation,
  useGetLessonRequirementsQuery,
  useCreateLessonRequirementMutation,
} = lessonsApi;
