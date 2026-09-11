import { BaseAPI } from "@/redux/baseApi";
import type {
  StaffMember,
  InviteStaffRequest,
  StaffActionResponse,
  AcceptStaffInvitationRequest,
  AcceptStaffInvitationResponse,
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
  useAcceptStaffInvitationMutation,
} = staffApi;

