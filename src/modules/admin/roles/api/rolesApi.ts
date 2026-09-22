import { BaseAPI } from "@/redux/baseApi";
import type {
  PermissionGroup,
  RoleCard,
  RoleCreateRequest,
  RoleMember,
  RoleUpdateRequest,
} from "../types";
import type { PaginatedResponse } from "@/modules/admin/teams/types";

/**
 * RBAC endpoints for Admin → Settings → Roles & Permissions, plus the role
 * picker the staff invite and change-role dialogs read from.
 *
 * Role mutations invalidate `UserProfile` as well as `Role`. A Super Admin can
 * edit a role they themselves hold, and the backend applies a permission change
 * on the member's next request without signing them out — so the caller's own
 * `Me.permissions` has to be refetched or the UI would keep gating on a stale
 * set until a reload.
 *
 * Every mutation here is MFA-gated on the server "where MFA is enforced"; a
 * session that has not satisfied it gets a 403, which surfaces through
 * `normalizeApiError` like any other error.
 */
export const rolesApi = BaseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getRoles: builder.query<RoleCard[], void>({
      query: () => ({
        url: "/admin/roles/",
        method: "GET",
      }),
      /*
        Not paginated — `data` is a bare array of role cards, unlike the list
        endpoints that nest `results` one level deeper still. The flat() is
        belt-and-braces for the double-nesting this API has produced elsewhere.
      */
      transformResponse: (response: { data?: RoleCard[] | RoleCard[][] }) => {
        const data = response?.data ?? [];
        return (Array.isArray(data[0]) ? (data as RoleCard[][]).flat() : data) as RoleCard[];
      },
      providesTags: ["Role"],
    }),

    getPermissionGroups: builder.query<PermissionGroup[], void>({
      query: () => ({
        url: "/admin/permissions/",
        method: "GET",
      }),
      transformResponse: (response: {
        data?: PermissionGroup[] | PermissionGroup[][];
      }) => {
        const data = response?.data ?? [];
        return (
          Array.isArray(data[0])
            ? (data as PermissionGroup[][]).flat()
            : data
        ) as PermissionGroup[];
      },
      providesTags: ["PermissionGroup"],
    }),

    getRoleMembers: builder.query<
      PaginatedResponse<RoleMember[]>,
      { roleId: string; search?: string; page?: number; size?: number }
    >({
      query: ({ roleId, ...params }) => ({
        url: `/admin/roles/${roleId}/members/`,
        method: "GET",
        params,
      }),
      providesTags: ["Role"],
    }),

    createRole: builder.mutation<RoleCard, RoleCreateRequest>({
      query: (body) => ({
        url: "/admin/roles/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Role", "UserProfile"],
    }),

    updateRole: builder.mutation<
      RoleCard,
      { id: string; body: RoleUpdateRequest }
    >({
      query: ({ id, body }) => ({
        url: `/admin/roles/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Role", "UserProfile"],
    }),

    deleteRole: builder.mutation<
      void,
      { id: string; reassignToRoleId?: string }
    >({
      query: ({ id, reassignToRoleId }) => ({
        url: `/admin/roles/${id}/`,
        method: "DELETE",
        params: reassignToRoleId
          ? { reassign_to_role_id: reassignToRoleId }
          : undefined,
      }),
      invalidatesTags: ["Role", "UserProfile", "AdminStaff"],
    }),
  }),
});

export const {
  useGetRolesQuery,
  useGetPermissionGroupsQuery,
  useGetRoleMembersQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} = rolesApi;
