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

// ─── Wallet Types ─────────────────────────────────────────────────────────────

export interface WalletUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface WalletItem {
  id: string;
  user: WalletUser;
  balance: string;
  currency: string;
  updated_datetime: string;
}

export interface WalletListResponse {
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
    results: WalletItem[][];
  };
}

export interface WalletListParams {
  page?: number;
  size?: number;
  user?: string;
}

// ─── Transaction Types ─────────────────────────────────────────────────────────

export interface TransactionCourse {
  id: string;
  title: string;
}

export interface TransactionItem {
  id: string;
  user: WalletUser;
  reference: string;
  course: TransactionCourse | null;
  amount: string;
  fee: string;
  type: "CREDIT" | "DEBIT";
  status: "PENDING" | "COMPLETED" | "FAILED";
  description: string;
  recipient_account_name: string;
  recipient_account_number: string;
  recipient_provider_name: string;
  created_datetime: string;
}

export interface TransactionListResponse {
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
    results: TransactionItem[][];
  };
}

export interface TransactionListParams {
  page?: number;
  size?: number;
  user?: string;
  type?: "CREDIT" | "DEBIT";
  status?: "PENDING" | "COMPLETED" | "FAILED";
}

// ─── Withdrawal Types ──────────────────────────────────────────────────────────

export interface WithdrawalPayoutAccount {
  id: string;
  account_type: string;
  provider_name: string;
  account_number: string;
  account_name: string;
  is_default: boolean;
  created_datetime: string;
}

export interface WithdrawalItem {
  id: string;
  user: WalletUser;
  amount: string;
  status: "PENDING_CONFIRMATION" | "CONFIRMED" | "EXPIRED";
  payout_account: WithdrawalPayoutAccount | null;
  transaction_reference: string;
  confirmed_at: string | null;
  created_datetime: string;
}

export interface WithdrawalListResponse {
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
    results: WithdrawalItem[][];
  };
}

export interface WithdrawalListParams {
  page?: number;
  size?: number;
  user?: string;
  status?: "PENDING_CONFIRMATION" | "CONFIRMED" | "EXPIRED";
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
    getAdminWallets: builder.query<WalletListResponse, WalletListParams | void>({
      query: (params) => ({
        url: "/admin/wallets/",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: ["AdminWallet"] as any,
    }),
    getAdminTransactions: builder.query<TransactionListResponse, TransactionListParams | void>({
      query: (params) => ({
        url: "/admin/transactions/",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: ["AdminTransaction"] as any,
    }),
    getAdminWithdrawals: builder.query<WithdrawalListResponse, WithdrawalListParams | void>({
      query: (params) => ({
        url: "/admin/withdrawals/",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: ["AdminWithdrawal"] as any,
    }),
  }),
});

export const {
  useGetAdminOverviewQuery,
  useGetActivityLogQuery,
  useGetKycReviewListQuery,
  useGetKycReviewDetailQuery,
  useApproveKycMutation,
  useRejectKycMutation,
  useGetAdminWalletsQuery,
  useGetAdminTransactionsQuery,
  useGetAdminWithdrawalsQuery,
} = adminApi;
