import { BaseAPI } from "@/redux/baseApi";
import type { PaginatedResponse } from "../types";
import type {
  Module,
  CreateModuleRequest,
  ReplaceModuleRequest,
  UpdateModuleRequest,
  ModuleListParams,
  ReorderRequest,
} from "../types/module";

export const modulesApi = BaseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getModules: builder.query<
      PaginatedResponse<Module[]>,
      { courseId: string; params?: ModuleListParams }
    >({
      query: ({ courseId, params }) => ({
        url: `/courses/${courseId}/modules/`,
        method: "GET",
        params,
      }),
      transformResponse: (response: {
        status: boolean;
        message: string;
        data: {
          paginator: PaginatedResponse<Module[]>["data"]["paginator"];
          results: Module[][];
        };
      }) => ({
        ...response,
        data: {
          ...response.data,
          results: response.data.results.flat(),
        },
      }),
      providesTags: (_result, _error, { courseId }) => [
        { type: "Module", id: `list-${courseId}` },
      ],
    }),

    getModule: builder.query<
      Module,
      { courseId: string; moduleId: string }
    >({
      query: ({ courseId, moduleId }) => ({
        url: `/courses/${courseId}/modules/${moduleId}/`,
        method: "GET",
      }),
      providesTags: (_result, _error, { courseId, moduleId }) => [
        { type: "Module", id: `${courseId}-${moduleId}` },
      ],
    }),

    createModule: builder.mutation<
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

    replaceModule: builder.mutation<
      Module,
      {
        courseId: string;
        moduleId: string;
        body: ReplaceModuleRequest;
      }
    >({
      query: ({ courseId, moduleId, body }) => ({
        url: `/courses/${courseId}/modules/${moduleId}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { courseId, moduleId }) => [
        { type: "Module", id: `${courseId}-${moduleId}` },
        { type: "Module", id: `list-${courseId}` },
        "Module",
      ],
    }),

    updateModule: builder.mutation<
      Module,
      {
        courseId: string;
        moduleId: string;
        body: UpdateModuleRequest;
      }
    >({
      query: ({ courseId, moduleId, body }) => ({
        url: `/courses/${courseId}/modules/${moduleId}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { courseId, moduleId }) => [
        { type: "Module", id: `${courseId}-${moduleId}` },
        { type: "Module", id: `list-${courseId}` },
        "Module",
      ],
    }),

    deleteModule: builder.mutation<
      void,
      { courseId: string; moduleId: string }
    >({
      query: ({ courseId, moduleId }) => ({
        url: `/courses/${courseId}/modules/${moduleId}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { courseId }) => [
        { type: "Module", id: `list-${courseId}` },
        "Module",
      ],
    }),

    reorderModules: builder.mutation<
      Module[],
      { courseId: string; body: ReorderRequest }
    >({
      query: ({ courseId, body }) => ({
        url: `/courses/${courseId}/modules/reorder/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { courseId }) => [
        { type: "Module", id: `list-${courseId}` },
        "Module",
      ],
    }),

    lockModule: builder.mutation<
      Module,
      { courseId: string; moduleId: string }
    >({
      query: ({ courseId, moduleId }) => ({
        url: `/courses/${courseId}/modules/${moduleId}/lock/`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, { courseId, moduleId }) => [
        { type: "Module", id: `${courseId}-${moduleId}` },
        { type: "Module", id: `list-${courseId}` },
      ],
    }),

    unlockModule: builder.mutation<
      Module,
      { courseId: string; moduleId: string }
    >({
      query: ({ courseId, moduleId }) => ({
        url: `/courses/${courseId}/modules/${moduleId}/unlock/`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, { courseId, moduleId }) => [
        { type: "Module", id: `${courseId}-${moduleId}` },
        { type: "Module", id: `list-${courseId}` },
      ],
    }),

    heartbeatModule: builder.mutation<
      Module,
      { courseId: string; moduleId: string }
    >({
      query: ({ courseId, moduleId }) => ({
        url: `/courses/${courseId}/modules/${moduleId}/heartbeat/`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useGetModulesQuery,
  useGetModuleQuery,
  useCreateModuleMutation,
  useReplaceModuleMutation,
  useUpdateModuleMutation,
  useDeleteModuleMutation,
  useReorderModulesMutation,
  useLockModuleMutation,
  useUnlockModuleMutation,
  useHeartbeatModuleMutation,
} = modulesApi;
