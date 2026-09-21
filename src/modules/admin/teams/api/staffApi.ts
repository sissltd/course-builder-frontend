import { BaseAPI } from "@/redux/baseApi";
import type {
  StaffMember,
  InviteStaffRequest,
  StaffActionResponse,
  AcceptStaffInvitationRequest,
  AcceptStaffInvitationResponse,
  ChangeStaffRoleRequest,
  EraseAccountRequest,
  SuccessEnvelope,
} from "../types";

export const staffApi = BaseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getStaff: builder.query<StaffMember[], void>({
      query: () => ({
        url: "/auth/staff/",
        method: "GET",
      }),
      transformResponse: (response: StaffMember[][]) =>
        response.flat(),
      providesTags: ["AdminStaff"],
    }),

    inviteStaff: builder.mutation<StaffActionResponse, InviteStaffRequest>({
      query: (body) => ({
        url: "/auth/staff/invitations/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["AdminStaff"],
    }),

    reactivateStaff: builder.mutation<StaffActionResponse, string>({
      query: (id) => ({
        url: `/auth/staff/${id}/reactivate/`,
        method: "POST",
      }),
      invalidatesTags: ["AdminStaff"],
    }),

    revokeStaff: builder.mutation<StaffActionResponse, string>({
      query: (id) => ({
        url: `/auth/staff/${id}/revoke/`,
        method: "POST",
      }),
      invalidatesTags: ["AdminStaff"],
    }),

    /**
     * Moves a member to another staff role, built-in or custom.
     *
     * `role_id` is the only way to name a custom role, so this is one of the
     * reasons the Teams page reads `GET /admin/roles/` — the roster row carries
     * a base role and a display label, never a role id.
     *
     * `UserProfile` is invalidated too: a Super Admin may move *themselves* into
     * a role with a different permission set, and their own gates must re-resolve.
     */
    changeStaffRole: builder.mutation<
      SuccessEnvelope,
      { id: string; body: ChangeStaffRoleRequest }
    >({
      query: ({ id, body }) => ({
        url: `/auth/staff/${id}/change-role/`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["AdminStaff", "UserProfile"],
    }),

    /**
     * Emails a member a password reset link — the same one Forgot password
     * sends. Their password does not change until they use it.
     *
     * A second request inside the resend cooldown is a 400, an account of the
     * other kind (non-staff) is a 404, and the caller's own account is refused.
     */
    sendStaffPasswordReset: builder.mutation<SuccessEnvelope, string>({
      query: (id) => ({
        url: `/auth/staff/${id}/send-password-reset/`,
        method: "POST",
      }),
    }),

    /**
     * Permanently deletes a staff member.
     *
     * Irreversible, and the API refuses while their wallet is non-empty or a
     * payout is in progress (409). The account row survives so courses, payouts,
     * reviews and audit logs stay intact, re-attributed to an anonymous user.
     */
    eraseStaff: builder.mutation<
      SuccessEnvelope,
      { id: string; body: EraseAccountRequest }
    >({
      query: ({ id, body }) => ({
        url: `/auth/staff/${id}/erase/`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["AdminStaff"],
    }),

    acceptStaffInvitation: builder.mutation<
      AcceptStaffInvitationResponse,
      AcceptStaffInvitationRequest
    >({
      query: (body) => ({
        url: "/auth/staff/invitations/accept/",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetStaffQuery,
  useInviteStaffMutation,
  useReactivateStaffMutation,
  useRevokeStaffMutation,
  useChangeStaffRoleMutation,
  useSendStaffPasswordResetMutation,
  useEraseStaffMutation,
  useAcceptStaffInvitationMutation,
} = staffApi;

