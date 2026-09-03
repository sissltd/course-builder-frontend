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

// ─── Course Types ─────────────────────────────────────────────────────────────

export interface AdminCourseCategory {
  id: string;
  name: string;
}

export interface AdminCourseTopic {
  id: string;
  name: string;
}

export interface AdminCourseCreator {
  id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  name?: string;
}

export interface AdminCourseItem {
  id: string;
  title: string;
  category: AdminCourseCategory | null;
  topic: AdminCourseTopic | null;
  source: string;
  status: string;
  creator_price_snapshot: string | null;
  submitted_at: string | null;
  created_datetime: string;
  updated_datetime: string;
  creator?: AdminCourseCreator | string | null;
  difficulty_level?: string | null;
  modules_count?: number | null;
  lessons_count?: number | null;
  has_video?: boolean | null;
  date_approved?: string | null;
}

export type CourseSourceType = "CREATOR_UPLOADED" | "AI_GENERATED" | "DEVELOPER_API";

export interface AdminCoursesListParams {
  category?: string;
  topic?: string;
  status?: string;
  source_type?: CourseSourceType | string;
  difficulty_level?: "ADVANCED" | "BEGINNER" | "INTERMEDIATE" | string;
  creator?: string;
  course_id?: string;
  search?: string;
  creator_type?: string;
  quality_score?: number;
  date_from?: string;
  date_to?: string;
  reviewer?: string;
  review_stage?: "CONTENT" | "QA" | string;
  ordering?: string;
  page?: number;
  size?: number;
}

export interface AdminCoursesData {
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
  results: AdminCourseItem[];
}

export interface AdminCoursesResponse {
  status: boolean;
  message: string;
  data: AdminCoursesData;
}

export interface AdminCourseVersion {
  id: string;
  label: string;
}

export interface AdminCourseModuleLesson {
  id: string;
  title: string;
  type: "video" | "text" | "quiz" | string;
  duration_seconds: number | null;
  content: string | null;
  order: number;
}

export interface AdminCourseModule {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: AdminCourseModuleLesson[];
}

export interface AdminCourseDetail {
  id: string;
  title: string;
  category: AdminCourseCategory | null;
  topic: AdminCourseTopic | null;
  source: string;
  status: string;
  creator_price_snapshot: string | null;
  submitted_at: string | null;
  created_datetime: string;
  updated_datetime: string;
  description: string;
  difficulty_level: string;
  learning_objectives: string[];
  tags: string[];
  planned_duration_seconds: number;
  preview_video_url: string;
  thumbnail_url: string;
  terms_accepted_at: string | null;
  approved_at: string | null;
  published_at: string | null;
  rejected_at: string | null;
  modules: AdminCourseModule[];
  final_assessment: unknown | null;
  duration_estimate_minutes: number;
  version: AdminCourseVersion | string | null;
}

export interface ApproveCourseRequest {
  feedback?: {
    summary?: string;
  };
}

export interface CourseReviewCommentAuthor {
  id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
}

export interface CourseReviewComment {
  id: string;
  stage: "CONTENT" | "QA" | string;
  lesson?: string | null;
  severity: "ERROR" | "WARNING" | "INFO" | string;
  reason_code: string;
  comment: string;
  created_datetime?: string;
  author?: CourseReviewCommentAuthor | string | null;
}

export interface AddCourseCommentRequest {
  stage: "CONTENT" | "QA" | string;
  lesson?: string | null;
  severity: "ERROR" | "WARNING" | "INFO" | string;
  reason_code: string;
  comment: string;
}

export interface CourseCommentsParams {
  courseId: string;
  page?: number;
  size?: number;
}

export interface CourseCommentsResponse {
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
    results: CourseReviewComment[];
  };
}

export interface ReviewActionResponse {
  id: string;
  course: string;
  reviewer: {
    id: string;
    email: string;
  };
  action: "APPROVE" | "REJECT" | string;
  stage: "CONTENT" | "QA" | string;
  feedback: Record<string, any>;
  created_datetime: string;
}

export interface ContentApproveRequest {
  feedback?: {
    summary?: string;
  };
}

export interface ContentRejectRequest {
  feedback: {
    summary: string;
  };
}

export interface QaApproveRequest {
  feedback?: {
    summary?: string;
  };
}

export interface QaRejectRequest {
  feedback: {
    summary: string;
  };
}

export interface RejectCourseRequestItem {
  module_id?: string;
  comment: string;
}

export interface RejectCourseRequest {
  feedback: {
    summary: string;
    items?: RejectCourseRequestItem[];
  };
}

export interface DistributionChannelPayload {
  channel: "SOLUDESK" | "COURSERA" | "UDEMY" | string;
  approval_rate?: string;
  learner_price: string;
  mie_suggestion?: string;
  model?: "ONE_TIME" | "SUBSCRIPTION" | "PROMOTIONAL" | "B2B_ONLY" | string;
  platform_revenue_per_enrollment?: string;
  mie_explanation?: string;
  course_fee_percent?: string | null;
  promotional_pricing?: string | null;
  comparable_courses?: Array<{
    course_title: string;
    difficulty_level: string;
    learner_price: string;
  }>;
}

export interface CoursePriceReviewItem {
  id: string;
  channel: "SOLUDESK" | "COURSERA" | "UDEMY" | string;
  approval_rate: string;
  learner_price: string;
  mie_suggestion: string;
  model: string;
  learner_fee?: string;
  creator_payout_fixed?: string;
  course_fee_percent?: string | null;
  promotional_pricing?: string | null;
  platform_revenue_per_enrollment?: string;
  mie_explanation?: string;
  comparable_courses?: Array<{
    course_title: string;
    difficulty_level: string;
    learner_price: string;
  }>;
  status?: string;
  external_course_id?: string;
  failure_reason?: string;
  published_at?: string | null;
}

export interface CourseReviewPricesResponse {
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
    results: CoursePriceReviewItem[];
  };
}

export interface PublishCourseRequest {
  distribution_channels: DistributionChannelPayload[];
}

export interface SaveCoursePricesRequest {
  distribution_channels: DistributionChannelPayload[];
}

export interface AdminReservationUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface AdminReservationCategory {
  id: string;
  name: string;
}

export interface AdminActiveReservation {
  id: string;
  name: string;
  category: AdminReservationCategory;
  status: "ACTIVE" | string;
  creator_price: string;
  reserved_by: AdminReservationUser;
  reserved_until: string;
  is_currently_reserved: boolean;
  created_datetime: string;
  updated_datetime: string;
}

export interface AdminActiveReservationsParams {
  page?: number;
  page_size?: number;
  search?: string;
  category?: string;
  ordering?: string;
}

export interface AdminActiveReservationsResponse {
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
    results: AdminActiveReservation[];
  };
}

export interface AdminReservationRequestTopic {
  id: string;
  category: AdminReservationCategory;
  name: string;
  creator_price: string;
  status: string;
  reserved_by: string;
  reserved_until: string;
  is_currently_reserved: boolean;
  created_datetime: string;
  updated_datetime: string;
}

export interface AdminReservationRequestItem {
  id: string;
  name: string;
  category: AdminReservationCategory;
  topic?: AdminReservationRequestTopic | null;
  status: "PENDING" | "APPROVED" | "REJECTED" | string;
  rejection_reason?: string | null;
  reviewed_at?: string | null;
  created_datetime: string;
  requested_by: AdminReservationUser;
  reviewed_by?: AdminReservationUser | null;
}

export interface AdminReservationRequestsParams {
  page?: number;
  page_size?: number;
  search?: string;
  category?: string;
  status?: string;
  ordering?: string;
}

export interface AdminReservationRequestsResponse {
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
    results: AdminReservationRequestItem[];
  };
}

export interface RejectReservationRequestPayload {
  rejection_reason?: string;
}

export const adminApi = BaseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getAdminCourses: builder.query<AdminCoursesResponse, AdminCoursesListParams | void>({
      query: (params) => ({
        url: "/admin/courses/",
        method: "GET",
        params: params || undefined,
      }),
      transformResponse: (response: {
        status: boolean;
        message: string;
        data: {
          paginator: AdminCoursesData["paginator"];
          results: AdminCourseItem[][] | AdminCourseItem[];
        };
      }): AdminCoursesResponse => ({
        ...response,
        data: {
          ...response.data,
          results: (response?.data?.results ?? []).flat() as AdminCourseItem[],
        },
      }),
      providesTags: ["AdminCourse"] as any,
    }),
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
    getAdminCourseDetail: builder.query<AdminCourseDetail, string>({
      query: (id) => ({
        url: `/admin/courses/${id}/`,
        method: "GET",
      }),
      transformResponse: (response: any) => {
        return (response && typeof response === "object" && "data" in response && response.data)
          ? response.data
          : response;
      },
      providesTags: (result, error, id) => [{ type: "AdminCourse", id }] as any,
    }),
    approveAdminCourse: builder.mutation<void, { id: string; feedback?: { summary?: string } }>({
      query: ({ id, feedback }) => ({
        url: `/admin/courses/${id}/approve/`,
        method: "POST",
        body: feedback ? { feedback } : {},
      }),
      invalidatesTags: (result, error, { id }) => [
        "AdminCourse",
        { type: "AdminCourse", id },
      ] as any,
    }),
    claimAdminCourse: builder.mutation<AdminCourseDetail, string>({
      query: (id) => ({
        url: `/admin/courses/${id}/claim/`,
        method: "POST",
      }),
      transformResponse: (response: any) => {
        return (response && typeof response === "object" && "data" in response && response.data)
          ? response.data
          : response;
      },
      invalidatesTags: (result, error, id) => [
        "AdminCourse",
        { type: "AdminCourse", id },
      ] as any,
    }),
    getAdminCourseComments: builder.query<CourseCommentsResponse, CourseCommentsParams>({
      query: ({ courseId, page, size }) => ({
        url: `/admin/courses/${courseId}/comments/`,
        method: "GET",
        params: {
          ...(page ? { page } : {}),
          ...(size ? { size } : {}),
        },
      }),
      transformResponse: (response: {
        status: boolean;
        message: string;
        data: {
          paginator: CourseCommentsResponse["data"]["paginator"];
          results: CourseReviewComment[][] | CourseReviewComment[];
        };
      }): CourseCommentsResponse => ({
        ...response,
        data: {
          ...response.data,
          results: (response?.data?.results ?? []).flat() as CourseReviewComment[],
        },
      }),
      providesTags: (result, error, { courseId }) => [
        { type: "AdminCourseComment", id: courseId },
      ] as any,
    }),
    addAdminCourseComment: builder.mutation<
      CourseReviewComment,
      { courseId: string; body: AddCourseCommentRequest }
    >({
      query: ({ courseId, body }) => ({
        url: `/admin/courses/${courseId}/comments/`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { courseId }) => [
        { type: "AdminCourseComment", id: courseId },
        { type: "AdminCourse", id: courseId },
      ] as any,
    }),
    contentApproveAdminCourse: builder.mutation<
      ReviewActionResponse,
      { id: string; feedback?: { summary?: string } }
    >({
      query: ({ id, feedback }) => ({
        url: `/admin/courses/${id}/content-approve/`,
        method: "POST",
        body: feedback ? { feedback } : {},
      }),
      invalidatesTags: (result, error, { id }) => [
        "AdminCourse",
        { type: "AdminCourse", id },
      ] as any,
    }),
    contentRejectAdminCourse: builder.mutation<
      ReviewActionResponse,
      { id: string; feedback: { summary: string } }
    >({
      query: ({ id, feedback }) => ({
        url: `/admin/courses/${id}/content-reject/`,
        method: "POST",
        body: { feedback },
      }),
      invalidatesTags: (result, error, { id }) => [
        "AdminCourse",
        { type: "AdminCourse", id },
      ] as any,
    }),
    qaApproveAdminCourse: builder.mutation<
      ReviewActionResponse,
      { id: string; feedback?: { summary?: string } }
    >({
      query: ({ id, feedback }) => ({
        url: `/admin/courses/${id}/qa-approve/`,
        method: "POST",
        body: feedback ? { feedback } : {},
      }),
      invalidatesTags: (result, error, { id }) => [
        "AdminCourse",
        { type: "AdminCourse", id },
      ] as any,
    }),
    qaClaimAdminCourse: builder.mutation<AdminCourseDetail, string>({
      query: (id) => ({
        url: `/admin/courses/${id}/qa-claim/`,
        method: "POST",
      }),
      transformResponse: (response: any) => {
        return response && typeof response === "object" && "data" in response && response.data
          ? response.data
          : response;
      },
      invalidatesTags: (result, error, id) => [
        "AdminCourse",
        { type: "AdminCourse", id },
      ] as any,
    }),
    qaRejectAdminCourse: builder.mutation<
      ReviewActionResponse,
      { id: string; feedback: { summary: string } }
    >({
      query: ({ id, feedback }) => ({
        url: `/admin/courses/${id}/qa-reject/`,
        method: "POST",
        body: { feedback },
      }),
      invalidatesTags: (result, error, { id }) => [
        "AdminCourse",
        { type: "AdminCourse", id },
      ] as any,
    }),
    rejectAdminCourse: builder.mutation<
      ReviewActionResponse,
      { id: string; feedback: RejectCourseRequest["feedback"] }
    >({
      query: ({ id, feedback }) => ({
        url: `/admin/courses/${id}/reject/`,
        method: "POST",
        body: { feedback },
      }),
      invalidatesTags: (result, error, { id }) => [
        "AdminCourse",
        { type: "AdminCourse", id },
      ] as any,
    }),
    publishCourse: builder.mutation<any, { id: string; body: PublishCourseRequest }>({
      query: ({ id, body }) => ({
        url: `/courses/${id}/publish/`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        "AdminCourse",
        { type: "AdminCourse", id },
      ] as any,
    }),
    getCourseReviewPrices: builder.query<CourseReviewPricesResponse, string>({
      query: (id) => ({
        url: `/courses/${id}/review-prices/`,
        method: "GET",
      }),
      transformResponse: (response: {
        status: boolean;
        message: string;
        data: {
          paginator: CourseReviewPricesResponse["data"]["paginator"];
          results: CoursePriceReviewItem[][] | CoursePriceReviewItem[];
        };
      }): CourseReviewPricesResponse => ({
        ...response,
        data: {
          ...response.data,
          results: (response?.data?.results ?? []).flat() as CoursePriceReviewItem[],
        },
      }),
      providesTags: (result, error, id) => [{ type: "AdminCourse", id }] as any,
    }),
    saveCoursePrices: builder.mutation<
      CourseReviewPricesResponse,
      { id: string; body: SaveCoursePricesRequest }
    >({
      query: ({ id, body }) => ({
        url: `/courses/${id}/review-prices/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "AdminCourse", id }] as any,
    }),
    getActiveReservations: builder.query<
      AdminActiveReservationsResponse,
      AdminActiveReservationsParams | void
    >({
      query: (params) => ({
        url: "/admin/reservations/active/",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: ["TopicReservation"] as any,
    }),
    getActiveReservationDetail: builder.query<AdminActiveReservation, string>({
      query: (id) => ({
        url: `/admin/reservations/active/${id}/`,
        method: "GET",
      }),
      transformResponse: (response: any) => (response?.data ? response.data : response),
      providesTags: (_result, _error, id) => [{ type: "TopicReservation", id }] as any,
    }),
    releaseActiveReservation: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `/admin/reservations/active/${id}/release/`,
        method: "POST",
      }),
      invalidatesTags: ["TopicReservation"] as any,
    }),
    getReservationRequests: builder.query<
      AdminReservationRequestsResponse,
      AdminReservationRequestsParams | void
    >({
      query: (params) => ({
        url: "/admin/reservations/requests/",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: ["TopicReservation"] as any,
    }),
    getReservationRequestDetail: builder.query<AdminReservationRequestItem, string>({
      query: (id) => ({
        url: `/admin/reservations/requests/${id}/`,
        method: "GET",
      }),
      transformResponse: (response: any) => (response?.data ? response.data : response),
      providesTags: (_result, _error, id) => [{ type: "TopicReservation", id }] as any,
    }),
    approveReservationRequest: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `/admin/reservations/requests/${id}/approve/`,
        method: "POST",
      }),
      invalidatesTags: ["TopicReservation"] as any,
    }),
    rejectReservationRequest: builder.mutation<
      any,
      { id: string; body?: RejectReservationRequestPayload }
    >({
      query: ({ id, body }) => ({
        url: `/admin/reservations/requests/${id}/reject/`,
        method: "POST",
        body: body || {},
      }),
      invalidatesTags: ["TopicReservation"] as any,
    }),
  }),
});

export const {
  useGetAdminCoursesQuery,
  useGetAdminCourseDetailQuery,
  useApproveAdminCourseMutation,
  useClaimAdminCourseMutation,
  useGetAdminCourseCommentsQuery,
  useAddAdminCourseCommentMutation,
  useContentApproveAdminCourseMutation,
  useContentRejectAdminCourseMutation,
  useQaApproveAdminCourseMutation,
  useQaClaimAdminCourseMutation,
  useQaRejectAdminCourseMutation,
  useRejectAdminCourseMutation,
  usePublishCourseMutation,
  useGetCourseReviewPricesQuery,
  useSaveCoursePricesMutation,
  useGetAdminOverviewQuery,
  useGetActivityLogQuery,
  useGetKycReviewListQuery,
  useGetKycReviewDetailQuery,
  useApproveKycMutation,
  useRejectKycMutation,
  useGetAdminWalletsQuery,
  useGetAdminTransactionsQuery,
  useGetAdminWithdrawalsQuery,
  useGetActiveReservationsQuery,
  useGetActiveReservationDetailQuery,
  useReleaseActiveReservationMutation,
  useGetReservationRequestsQuery,
  useGetReservationRequestDetailQuery,
  useApproveReservationRequestMutation,
  useRejectReservationRequestMutation,
} = adminApi;
