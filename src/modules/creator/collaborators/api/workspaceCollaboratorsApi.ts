import { BaseAPI } from "@/redux/baseApi";
import type {
  WorkspaceCollaborator,
  CreateWorkspaceCollaboratorRequest,
  UpdateWorkspaceCollaboratorRequest,
  WorkspaceCollaboratorsListParams,
  PaginatedResponse,
} from "../types";

export const workspaceCollaboratorsApi = BaseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getWorkspaceCollaborators: builder.query<
      PaginatedResponse<WorkspaceCollaborator[]>,
      WorkspaceCollaboratorsListParams | void
    >({
      query: (params) => ({
        url: "/workspace-collaborators/",
        method: "GET",
        params: params || {},
      }),
      transformResponse: (response: {
        status: boolean;
        message: string;
        data: {
          paginator: PaginatedResponse<WorkspaceCollaborator[]>["data"]["paginator"];
          results: WorkspaceCollaborator[];
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
      providesTags: ["WorkspaceCollaborator"],
    }),

    inviteWorkspaceCollaborator: builder.mutation<
      WorkspaceCollaborator,
      CreateWorkspaceCollaboratorRequest
    >({
      query: (body) => ({
        url: "/workspace-collaborators/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["WorkspaceCollaborator"],
    }),

    updateWorkspaceCollaborator: builder.mutation<
      WorkspaceCollaborator,
      { id: string; body: UpdateWorkspaceCollaboratorRequest }
    >({
      query: ({ id, body }) => ({
        url: `/workspace-collaborators/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "WorkspaceCollaborator", id },
        "WorkspaceCollaborator",
      ],
    }),

    removeWorkspaceCollaborator: builder.mutation<void, string>({
      query: (id) => ({
        url: `/workspace-collaborators/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["WorkspaceCollaborator"],
    }),
  }),
});

export const {
  useGetWorkspaceCollaboratorsQuery,
  useInviteWorkspaceCollaboratorMutation,
  useUpdateWorkspaceCollaboratorMutation,
  useRemoveWorkspaceCollaboratorMutation,
} = workspaceCollaboratorsApi;
