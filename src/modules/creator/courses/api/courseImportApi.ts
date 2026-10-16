import { BaseAPI } from "@/redux/baseApi";
import type {
  CourseImportConfirmRequest,
  CourseImportConfirmResponse,
  CourseImportCreateRequest,
  CourseImportJob,
  CourseImportPresignResponse,
  CourseImportPresignUploadRequest,
  CourseImportTemplateParams,
} from "../types/courseImport";

export const courseImportApi = BaseAPI.injectEndpoints({
  endpoints: (builder) => ({
    presignCourseImportUpload: builder.mutation<
      CourseImportPresignResponse,
      CourseImportPresignUploadRequest
    >({
      query: ({ filename, content_type, size }) => ({
        url: "/uploads/presign/",
        method: "POST",
        body: {
          filename,
          content_type,
          folder: "course-imports",
          purpose: "COURSE_DOCUMENT_IMPORT",
          size,
        },
      }),
    }),

    startCourseImport: builder.mutation<
      CourseImportJob,
      CourseImportCreateRequest
    >({
      query: (body) => ({
        url: "/course-imports/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["CourseImportJob"],
    }),

    getCourseImport: builder.query<CourseImportJob, string>({
      query: (id) => ({
        url: `/course-imports/${id}/`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [
        { type: "CourseImportJob", id },
      ],
    }),

    cancelCourseImport: builder.mutation<CourseImportJob, string>({
      query: (id) => ({
        url: `/course-imports/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "CourseImportJob", id },
        "CourseImportJob",
      ],
    }),

    confirmCourseImport: builder.mutation<
      CourseImportConfirmResponse,
      { id: string; body?: CourseImportConfirmRequest }
    >({
      query: ({ id, body }) => ({
        url: `/course-imports/${id}/confirm/`,
        method: "POST",
        body: body ?? {},
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "CourseImportJob", id },
        "CourseImportJob",
        "Course",
      ],
    }),

    downloadCourseImportTemplate: builder.query<
      Blob,
      CourseImportTemplateParams | void
    >({
      query: (params) => ({
        url: "/course-imports/template/",
        method: "GET",
        params: { file_type: params?.file_type ?? "xlsx" },
        cache: "no-cache",
        responseHandler: (response) => response.blob(),
      }),
      keepUnusedDataFor: 0,
    }),
  }),
});

export const {
  usePresignCourseImportUploadMutation,
  useStartCourseImportMutation,
  useGetCourseImportQuery,
  useLazyGetCourseImportQuery,
  useCancelCourseImportMutation,
  useConfirmCourseImportMutation,
  useDownloadCourseImportTemplateQuery,
  useLazyDownloadCourseImportTemplateQuery,
} = courseImportApi;
