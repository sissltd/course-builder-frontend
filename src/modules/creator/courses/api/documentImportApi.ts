import { BaseAPI } from "@/redux/baseApi";
import type { Course, CreateCourseRequest } from "../types";
import type { Module, CreateModuleRequest } from "../types/module";
import type { Lesson, CreateLessonRequest } from "../types/lesson";

export interface CreateDocumentImportRequest {
  title: string;
  description: string;
  category: string;
  topic?: string;
  terms_accepted: boolean;
}

export interface DocumentImportModule {
  title: string;
  description: string;
  lessons: {
    title: string;
    content: string;
  }[];
}

const documentImportApi = BaseAPI.injectEndpoints({
  endpoints: (builder) => ({
    createCourseFromImport: builder.mutation<Course, CreateCourseRequest>({
      query: (body) => ({
        url: "/courses/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Course"],
    }),

    createModuleForImport: builder.mutation<
      Module,
      { courseId: string; body: CreateModuleRequest }
    >({
      query: ({ courseId, body }) => ({
        url: `/courses/${courseId}/modules/`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { courseId }) => [
        { type: "Module", id: `list-${courseId}` },
        "Module",
      ],
    }),

    createLessonForImport: builder.mutation<
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
  }),
});

export const {
  useCreateCourseFromImportMutation,
  useCreateModuleForImportMutation,
  useCreateLessonForImportMutation,
} = documentImportApi;
