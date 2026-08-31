import { BaseAPI } from "../baseApi";

export interface AdminOverviewResponse {
  users: {
    PENDING_VERIFICATION: number;
    ACTIVE: number;
    SUSPENDED: number;
    DEACTIVATED: number;
  };
  courses: {
    DRAFT: number;
    SUBMITTED: number;
    IN_REVIEW: number;
    APPROVED: number;
    REJECTED: number;
    PUBLISHED: number;
  };
  kyc: {
    PENDING: number;
    APPROVED: number;
    REJECTED: number;
  };
  withdrawals: {
    PENDING_CONFIRMATION: number;
    CONFIRMED: number;
    EXPIRED: number;
  };
  wallet_totals: {
    balance_held: string;
    total_credited: string;
    awaiting_payout: string;
  };
}

export interface InviteStaffPayload {
  email: string;
  first_name: string;
  last_name: string;
  role: "STAFF_WRITER" | "STAFF_VERIFIER" | "STAFF_APPROVER";
}

export interface ActivityLogItemApi {
  id: string;
  category: string;
  action: string;
  summary: string;
  actor: {
    id?: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  details?: Record<string, any>;
  activity_datetime: string;
}

export interface ActivityLogResponse {
  status: boolean;
  message: string;
  data: {
    paginator: {
      count: number;
      page: number;
      page_size: number;
      total_pages: number;
      next_page_number: number | null;
      next: string | null;
      previous: string | null;
      previous_page_number: number | null;
    };
    results: ActivityLogItemApi[];
  };
}

export interface ActivityLogParams {
  user?: string;
  category?: string;
  action?: string;
  ordering?: string;
  page?: number;
  size?: number;
}

export interface KycUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface KycSubmission {
  id: string;
  user: KycUser;
  country_of_issue: string;
  document_type: string;
  id_number: string;
  status: string;
  rejection_reason?: string;
  reviewed_by?: KycUser;
  reviewed_at?: string;
  created_datetime: string;
}

export interface KycListResponse {
  status: boolean;
  message: string;
  data: {
    paginator: {
      count: number;
      page: number;
      page_size: number;
      total_pages: number;
      next_page_number: number | null;
      next: string | null;
      previous: string | null;
      previous_page_number: number | null;
    };
    results: KycSubmission[];
  };
}

export interface KycListParams {
  status?: string;
  page?: number;
  size?: number;
}

export const adminApi = BaseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getAdminOverview: builder.query<AdminOverviewResponse, void>({
      query: () => ({
        url: "/admin/overview/",
        method: "GET",
      }),
      providesTags: ["AdminOverview"] as any,
    }),
    inviteStaff: builder.mutation<void, InviteStaffPayload>({
      query: (payload) => ({
        url: "/auth/staff/invitations/",
        method: "POST",
        body: payload,
      }),
    }),
    getActivityLog: builder.query<ActivityLogResponse, ActivityLogParams | void>({
      query: (params) => ({
        url: "/users/activity-log/",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: ["ActivityLog"] as any,
    }),
    getKycReviewList: builder.query<KycListResponse, KycListParams | void>({
      query: (params) => ({
        url: "/users/kyc-review/",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: ["KycReview"] as any,
    }),
    getKycReviewDetail: builder.query<KycSubmission, string>({
      query: (id) => ({
        url: `/users/kyc-review/${id}/`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "KycReview", id }] as any,
    }),
    approveKyc: builder.mutation<void, string>({
      query: (id) => ({
        url: `/users/kyc-review/${id}/approve/`,
        method: "POST",
      }),
      invalidatesTags: ["KycReview"] as any,
    }),
    rejectKyc: builder.mutation<void, { id: string; rejection_reason: string }>({
      query: ({ id, rejection_reason }) => ({
        url: `/users/kyc-review/${id}/reject/`,
        method: "POST",
        body: { rejection_reason },
      }),
      invalidatesTags: ["KycReview"] as any,
    }),
  }),
});

export const {
  useGetAdminOverviewQuery,
  useInviteStaffMutation,
  useGetActivityLogQuery,
  useGetKycReviewListQuery,
  useGetKycReviewDetailQuery,
  useApproveKycMutation,
  useRejectKycMutation,
} = adminApi;
