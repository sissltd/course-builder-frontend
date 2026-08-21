import { BaseAPI } from "@/redux/baseApi";
import type {
  Course,
  CourseSummary,
  CreateCourseRequest,
  UpdateCourseRequest,
  CoursesListParams,
  PaginatedResponse,
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
} = coursesApi;
