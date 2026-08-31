import { BaseAPI } from "@/redux/baseApi";
import type {
  AdminUser,
  UsersListParams,
  SuspendUserRequest,
  DeactivateUserRequest,
  PaginatedResponse,
} from "../types";

export const usersApi = BaseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<
      PaginatedResponse<AdminUser[]>,
      UsersListParams
    >({
      query: (params) => ({
        url: "/users/admin/",
        method: "GET",
        params,
      }),
      transformResponse: (response: {
        status: boolean;
        message: string;
        data: {
          paginator: PaginatedResponse<AdminUser[]>["data"]["paginator"];
          results: AdminUser[][];
        };
      }) => ({
        ...response,
        data: {
          ...response.data,
          results: response.data.results.flat(),
        },
      }),
      providesTags: ["AdminUser"],
    }),

    getUser: builder.query<AdminUser, string>({
      query: (id) => ({
        url: `/users/admin/${id}/`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "AdminUser", id }],
    }),

    suspendUser: builder.mutation<
      AdminUser,
      { id: string; body: SuspendUserRequest }
    >({
      query: ({ id, body }) => ({
        url: `/users/admin/${id}/suspend/`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["AdminUser"],
    }),

    deactivateUser: builder.mutation<
      AdminUser,
      { id: string; body: DeactivateUserRequest }
    >({
      query: ({ id, body }) => ({
        url: `/users/admin/${id}/deactivate/`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["AdminUser"],
    }),

    reinstateUser: builder.mutation<AdminUser, string>({
      query: (id) => ({
        url: `/users/admin/${id}/reinstate/`,
        method: "POST",
      }),
      invalidatesTags: ["AdminUser"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useSuspendUserMutation,
  useDeactivateUserMutation,
  useReinstateUserMutation,
} = usersApi;
