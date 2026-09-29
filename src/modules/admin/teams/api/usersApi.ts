import { BaseAPI } from "@/redux/baseApi";
import type {
  AdminUser,
  UsersListParams,
  SuspendUserRequest,
  DeactivateUserRequest,
  EraseAccountRequest,
  SuccessEnvelope,
  PaginatedResponse,
} from "../types";

export const usersApi = BaseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<
      PaginatedResponse<AdminUser[]>,
      UsersListParams | void
    >({
      query: (params) => {
        const cleanParams: Record<string, any> = {};
        if (params) {
          if (params.search?.trim()) cleanParams.search = params.search.trim();
          if (params.role) cleanParams.role = params.role;
          if (params.status) cleanParams.status = params.status;
          if (typeof params.is_active === "boolean") cleanParams.is_active = params.is_active;
          if (params.ordering) cleanParams.ordering = params.ordering;
          if (params.page) cleanParams.page = params.page;
          if (params.page_size) cleanParams.page_size = params.page_size;
          if (params.size) cleanParams.size = params.size;
        }
        return {
          url: "/users/admin/",
          method: "GET",
          params: Object.keys(cleanParams).length > 0 ? cleanParams : undefined,
        };
      },
      transformResponse: (response: any) => ({
        ...response,
        data: {
          ...response?.data,
          results: ((response?.data?.results ?? []) as any).flat() as AdminUser[],
        },
      }),
      providesTags: ["AdminUser"],
    }),

    getUser: builder.query<AdminUser, string>({
      query: (id) => ({
        url: `/users/admin/${id}/`,
        method: "GET",
      }),
      transformResponse: (response: any) => {
        if (response && response.data && typeof response.data === "object" && !Array.isArray(response.data)) {
          return response.data as AdminUser;
        }
        return response as AdminUser;
      },
      providesTags: (_result, _error, id) => [{ type: "AdminUser", id }],
    }),

    suspendUser: builder.mutation<
      AdminUser,
      { id: string; body: SuspendUserRequest }
    >({
      query: ({ id, body }) => ({
        url: `/users/admin/${id}/assign-track/`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "AdminUser",
        { type: "AdminUser", id },
      ],
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
      invalidatesTags: (_result, _error, { id }) => [
        "AdminUser",
        { type: "AdminUser", id },
      ],
    }),

    reinstateUser: builder.mutation<AdminUser, string>({
      query: (id) => ({
        url: `/users/admin/${id}/reinstate/`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, id) => [
        "AdminUser",
        { type: "AdminUser", id },
      ],
    }),

    /**
     * Emails a non-staff account a password reset link — the same one Forgot
     * password sends. Their password does not change until they use it, which
     * also signs them out everywhere, so nothing here needs invalidating.
     *
     * A second request inside the resend cooldown is a 400, and an account of
     * the other kind (staff) is a 404 — the two families have separate routes.
     */
    sendUserPasswordReset: builder.mutation<SuccessEnvelope, string>({
      query: (id) => ({
        url: `/users/admin/${id}/send-password-reset/`,
        method: "POST",
      }),
    }),

    /**
     * Permanently deletes a non-staff account.
     *
     * Irreversible, and refused while the wallet still holds a balance or a
     * payout is in progress (409). The account row survives so courses, payouts,
     * reviews and audit logs stay intact, re-attributed to an anonymous user.
     */
    eraseUser: builder.mutation<
      SuccessEnvelope,
      { id: string; body: EraseAccountRequest }
    >({
      query: ({ id, body }) => ({
        url: `/users/admin/${id}/erase/`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "AdminUser",
        { type: "AdminUser", id },
      ],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useSuspendUserMutation,
  useDeactivateUserMutation,
  useReinstateUserMutation,
  useSendUserPasswordResetMutation,
  useEraseUserMutation,
} = usersApi;
