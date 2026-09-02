import { BaseAPI } from "@/redux/baseApi";
import type {
  Course,
  CourseSummary,
  CreateCourseRequest,
  UpdateCourseRequest,
  CoursesListParams,
  PaginatedResponse,
  CourseThumbnail,
  SetThumbnailRequest,
  MediaAsset,
  RegisterMediaAssetRequest,
  CoursePreviewResponse,
} from "../types";

export const coursesApi = BaseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getCourses: builder.query<PaginatedResponse<CourseSummary[]>, CoursesListParams>({
      query: (params) => ({
        url: "/courses/",
        method: "GET",
        params,
      }),
      transformResponse: (response: {
        status: boolean;
        message: string;
        data: {
          paginator: PaginatedResponse<CourseSummary[]>["data"]["paginator"];
          results: CourseSummary[][];
        };
      }) => ({
        ...response,
        data: {
          ...response.data,
          results: response.data.results.flat(),
        },
      }),
      providesTags: ["Course"],
    }),

    getCourse: builder.query<Course, string>({
      query: (id) => ({
        url: `/courses/${id}/`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Course", id }],
    }),

    createCourse: builder.mutation<Course, CreateCourseRequest>({
      query: (body) => ({
        url: "/courses/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Course"],
    }),

    updateCourse: builder.mutation<
      Course,
      { id: string; body: UpdateCourseRequest }
    >({
      query: ({ id, body }) => ({
        url: `/courses/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Course", id },
        "Course",
      ],
    }),

    replaceCourse: builder.mutation<
      Course,
      { id: string; body: UpdateCourseRequest }
    >({
      query: ({ id, body }) => ({
        url: `/courses/${id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Course", id },
        "Course",
      ],
    }),

    deleteCourse: builder.mutation<void, string>({
      query: (id) => ({
        url: `/courses/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Course"],
    }),

    submitCourse: builder.mutation<Course, string>({
      query: (id) => ({
        url: `/courses/${id}/submit/`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Course", id },
        "Course",
      ],
    }),

    getCourseThumbnail: builder.query<CourseThumbnail[], string>({
      query: (courseId) => ({
        url: `/courses/${courseId}/thumbnail/`,
        method: "GET",
      }),
      providesTags: (_result, _error, courseId) => [
        { type: "Course", id: `${courseId}-thumbnail` },
      ],
    }),

    setCourseThumbnail: builder.mutation<
      CourseThumbnail,
      { courseId: string; body: SetThumbnailRequest }
    >({
      query: ({ courseId, body }) => ({
        url: `/courses/${courseId}/thumbnail/`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { courseId }) => [
        { type: "Course", id: `${courseId}-thumbnail` },
        { type: "Course", id: courseId },
      ],
    }),

    getMediaAssets: builder.query<
      PaginatedResponse<MediaAsset[]>,
      { courseId: string; params?: CoursesListParams }
    >({
      query: ({ courseId, params }) => ({
        url: `/courses/${courseId}/media-assets/`,
        method: "GET",
        params,
      }),
      transformResponse: (response: {
        status: boolean;
        message: string;
        data: {
          paginator: PaginatedResponse<MediaAsset[]>["data"]["paginator"];
          results: MediaAsset[][];
        };
      }) => ({
        ...response,
        data: {
          ...response.data,
          results: response.data.results.flat(),
        },
      }),
      providesTags: (_result, _error, { courseId }) => [
        { type: "MediaAsset", id: `list-${courseId}` },
      ],
    }),

    registerMediaAsset: builder.mutation<
      MediaAsset,
      { courseId: string; body: RegisterMediaAssetRequest }
    >({
      query: ({ courseId, body }) => ({
        url: `/courses/${courseId}/media-assets/`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { courseId }) => [
        { type: "MediaAsset", id: `list-${courseId}` },
      ],
    }),

    getCoursePreview: builder.query<CoursePreviewResponse, string>({
      query: (courseId) => ({
        url: `/courses/${courseId}/preview/`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetCoursesQuery,
  useGetCourseQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useReplaceCourseMutation,
  useDeleteCourseMutation,
  useSubmitCourseMutation,
  useGetCourseThumbnailQuery,
  useSetCourseThumbnailMutation,
  useGetMediaAssetsQuery,
  useRegisterMediaAssetMutation,
  useGetCoursePreviewQuery,
} = coursesApi;
