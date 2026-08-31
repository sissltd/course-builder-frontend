import { BaseAPI } from "@/redux/baseApi";
import type {
  Collaborator,
  CollaboratorsListParams,
  UpdateCollaboratorRequest,
  PaginatedResponse,
} from "../types";

export const collaboratorsApi = BaseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getCollaborators: builder.query<
      PaginatedResponse<Collaborator[]>,
      CollaboratorsListParams
    >({
      query: (params) => ({
        url: "/collaborators/",
        method: "GET",
        params,
      }),
      transformResponse: (response: {
        status: boolean;
        message: string;
        data: {
          paginator: PaginatedResponse<Collaborator[]>["data"]["paginator"];
          results: Collaborator[][];
        };
      }) => ({
        ...response,
        data: {
          ...response.data,
          results: response.data.results.flat(),
        },
      }),
      providesTags: ["Collaborator"],
    }),

    getCollaborator: builder.query<Collaborator, string>({
      query: (id) => ({
        url: `/collaborators/${id}/`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Collaborator", id }],
    }),

    updateCollaborator: builder.mutation<
      Collaborator,
      { id: string; body: UpdateCollaboratorRequest }
    >({
      query: ({ id, body }) => ({
        url: `/collaborators/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Collaborator", id },
        "Collaborator",
      ],
    }),

    removeCollaborator: builder.mutation<void, string>({
      query: (id) => ({
        url: `/collaborators/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Collaborator"],
    }),
  }),
});

export const {
  useGetCollaboratorsQuery,
  useGetCollaboratorQuery,
  useUpdateCollaboratorMutation,
  useRemoveCollaboratorMutation,
} = collaboratorsApi;
