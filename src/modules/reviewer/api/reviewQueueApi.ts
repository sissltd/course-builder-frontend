import { BaseAPI } from "@/redux/baseApi";
import type { AdminCourseDetail } from "@/redux/slices/adminApi";
import type {
  ReviewQueueListParams,
  ReviewQueueListResponse,
  ReviewQueueApiItem,
  ReviewQueueStatus,
} from "@/modules/reviewer/types/reviewQueue";

// ─── Request / response shapes ────────────────────────────────────────────────

/**
 * The drawer detail returns the full course content (same shape as the admin
 * course detail, which the shared tab components render) plus the three
 * grouped blocks the designs call for.
 */
export interface ReviewQueueDetail extends AdminCourseDetail {
  review_information?: Record<string, unknown> | null;
  owner_information?: Record<string, unknown> | null;
  price_information?: Record<string, unknown> | null;
  channels?: string[];
}

export interface ReviewQueueComment {
  id: string;
  stage?: string | null;
  module?: string | null;
  lesson?: string | null;
  severity?: string | null;
  reason_code?: string | null;
  comment: string;
  reviewer?: unknown;
  created_datetime?: string;
}

/** Raw wire shape — normalised to `{ data: { results } }` by the endpoint. */
interface ReviewQueueCommentsApiResponse {
  status: boolean;
  message: string;
  data: { results: ReviewQueueComment[] | ReviewQueueComment[][] };
}

export interface ReviewQueueCommentsResponse {
  status: boolean;
  message: string;
  data: { results: ReviewQueueComment[] };
}

export interface ReviewQueueAction {
  id: string;
  course: string;
  reviewer: string;
  action: "APPROVE" | "REJECT" | string;
  stage: "CONTENT" | "QA" | string;
  feedback?: Record<string, unknown> | null;
  created_datetime: string;
}

/** A structured flag attached to a rejection. */
export interface ReviewRejectFlag {
  flag_type: string;
  title: string;
  system_message?: string;
  reviewer_note?: string;
  lesson_id?: string;
  module_id?: string;
}

/** Per-module/lesson feedback items attached to a rejection. */
export interface ReviewRejectFeedbackItem {
  module_id: string;
  lesson_id?: string;
  comment: string;
}

export interface ReviewRejectFeedback {
  summary: string;
  items?: ReviewRejectFeedbackItem[];
}

export interface RejectCourseRequest {
  id: string;
  feedback: ReviewRejectFeedback;
  flags?: ReviewRejectFlag[];
}

export interface ReviewFeedbackRequest {
  id: string;
  feedback?: { summary?: string };
}

export interface AddReviewCommentRequest {
  id: string;
  stage?: string;
  module?: string | null;
  lesson?: string | null;
  severity?: string;
  reason_code?: string;
  comment: string;
}

/** One channel's pricing tab — the three Figma channel frames. */
export interface CourseDistributionChannel {
  id?: string;
  channel: "SOLUDESK" | "UDEMY" | "COURSERA" | string;
  approval_rate?: string;
  learner_price?: string;
  mie_suggestion?: string;
  model?: "ONE_TIME" | "SUBSCRIPTION" | "PROMOTIONAL" | "B2B_ONLY" | string;
  learner_fee?: string;
  creator_payout_fixed?: string;
  platform_revenue_per_enrollment?: string;
  mie_explanation?: string;
  course_fee_percent?: string | null;
  promotional_pricing?: string | null;
  comparable_courses?: {
    course_title: string;
    difficulty_level: string;
    learner_price: string;
  }[];
  status?: string;
  external_course_id?: string;
  failure_reason?: string;
  published_at?: string | null;
}

export interface SaveReviewPricesRequest {
  id: string;
  distribution_channels: CourseDistributionChannel[];
}

export interface PublishCourseRequest {
  id: string;
  distribution_channels?: CourseDistributionChannel[];
}

export interface ReviewQueuePricesResponse {
  status: boolean;
  message: string;
  data: {
    results: CourseDistributionChannel[] | CourseDistributionChannel[][];
  };
}

/**
 * The API inconsistently nests list results one level deep, so every list
 * endpoint normalises through here — mirroring the admin courses endpoints.
 */
function flattenListResponse(response: {
  status: boolean;
  message: string;
  data: {
    paginator: ReviewQueueListResponse["data"]["paginator"];
    results: ReviewQueueApiItem[][] | ReviewQueueApiItem[];
  };
}): ReviewQueueListResponse {
  return {
    ...response,
    data: {
      ...response.data,
      results: (response?.data?.results ?? []).flat() as ReviewQueueApiItem[],
    },
  };
}

function flattenPricesResponse(response: {
  status: boolean;
  message: string;
  data: { results: CourseDistributionChannel[] | CourseDistributionChannel[][] };
}): ReviewQueuePricesResponse {
  return {
    ...response,
    data: {
      ...response.data,
      results: (response?.data?.results ?? []).flat() as CourseDistributionChannel[],
    },
  } as ReviewQueuePricesResponse;
}



export const reviewQueueApi = BaseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getReviewQueuePending: builder.query<ReviewQueueListResponse, ReviewQueueListParams | void>({
      query: (params) => ({
        url: "/review-queue/pending/",
        method: "GET",
        params: params || undefined,
      }),
      transformResponse: flattenListResponse,
      providesTags: ["ReviewQueue"],
    }),

    getReviewQueueApproved: builder.query<ReviewQueueListResponse, ReviewQueueListParams | void>({
      query: (params) => ({
        url: "/review-queue/approved/",
        method: "GET",
        params: params || undefined,
      }),
      transformResponse: flattenListResponse,
      providesTags: ["ReviewQueue"],
    }),

    getReviewQueueInReview: builder.query<ReviewQueueListResponse, ReviewQueueListParams | void>({
      query: (params) => ({
        url: "/review-queue/in-review/",
        method: "GET",
        params: params || undefined,
      }),
      transformResponse: flattenListResponse,
      providesTags: ["ReviewQueue"],
    }),

    getReviewQueuePublished: builder.query<ReviewQueueListResponse, ReviewQueueListParams | void>({
      query: (params) => ({
        url: "/review-queue/published/",
        method: "GET",
        params: params || undefined,
      }),
      transformResponse: flattenListResponse,
      providesTags: ["ReviewQueue"],
    }),

    /** All statuses — filterable via `status`. */
    getReviewQueueAll: builder.query<ReviewQueueListResponse, ReviewQueueListParams | void>({
      query: (params) => ({
        url: "/review-queue/",
        method: "GET",
        params: params || undefined,
      }),
      transformResponse: flattenListResponse,
      providesTags: ["ReviewQueue"],
    }),

    getReviewQueueDetail: builder.query<ReviewQueueDetail, string>({
      query: (id) => ({
        url: `/review-queue/${id}/`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) =>
        [{ type: "ReviewQueueItem", id }],
    }),

    getReviewQueueComments: builder.query<ReviewQueueCommentsResponse, string>({
      query: (id) => ({
        url: `/review-queue/${id}/comments/`,
        method: "GET",
      }),
      transformResponse: (
        response: ReviewQueueCommentsApiResponse,
      ): ReviewQueueCommentsResponse => {
        const raw = response?.data?.results ?? [];
        const results = Array.isArray(raw) ? raw.flat() : [];
        return {
          ...response,
          data: { results: results as ReviewQueueComment[] },
        };
      },
      providesTags: (_result, _error, id) =>
        [{ type: "ReviewQueueComments", id }],
    }),

    getReviewQueuePrices: builder.query<ReviewQueuePricesResponse, string>({
      query: (id) => ({
        url: `/review-queue/${id}/review-prices/`,
        method: "GET",
      }),
      transformResponse: flattenPricesResponse,
      providesTags: (_result, _error, id) =>
        [{ type: "ReviewQueueItem", id }],
    }),

    // ── Content review actions ──────────────────────────────────────────────

    claimReviewCourse: builder.mutation<ReviewQueueApiItem, string>({
      query: (id) => ({
        url: `/review-queue/${id}/claim/`,
        method: "POST",
      }),
      invalidatesTags: ["ReviewQueue"],
    }),

    approveReviewCourseContent: builder.mutation<ReviewQueueAction, ReviewFeedbackRequest>({
      query: ({ id, feedback }) => ({
        url: `/review-queue/${id}/approve/`,
        method: "POST",
        body: feedback ? { feedback } : {},
      }),
      invalidatesTags: ["ReviewQueue"],
    }),

    rejectReviewCourseContent: builder.mutation<ReviewQueueAction, RejectCourseRequest>({
      query: ({ id, feedback, flags }) => ({
        url: `/review-queue/${id}/reject/`,
        method: "POST",
        body: flags && flags.length > 0 ? { feedback, flags } : { feedback },
      }),
      invalidatesTags: ["ReviewQueue"],
    }),

    addReviewQueueComment: builder.mutation<ReviewQueueComment, AddReviewCommentRequest>({
      query: ({ id, ...body }) => ({
        url: `/review-queue/${id}/comments/`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) =>
        [{ type: "ReviewQueueComments", id }],
    }),

    // ── QA verification actions ─────────────────────────────────────────────

    qaClaimReviewCourse: builder.mutation<ReviewQueueApiItem, string>({
      query: (id) => ({
        url: `/review-queue/${id}/qa-claim/`,
        method: "POST",
      }),
      invalidatesTags: ["ReviewQueue"],
    }),

    qaApproveReviewCourse: builder.mutation<ReviewQueueAction, ReviewFeedbackRequest>({
      query: ({ id, feedback }) => ({
        url: `/review-queue/${id}/qa-approve/`,
        method: "POST",
        body: feedback ? { feedback } : {},
      }),
      invalidatesTags: ["ReviewQueue"],
    }),

    qaRejectReviewCourse: builder.mutation<ReviewQueueAction, { id: string; feedback: ReviewRejectFeedback }>({
      query: ({ id, feedback }) => ({
        url: `/review-queue/${id}/qa-reject/`,
        method: "POST",
        body: { feedback },
      }),
      invalidatesTags: ["ReviewQueue"],
    }),

    // ── Pricing and publication ─────────────────────────────────────────────

    saveReviewQueuePrices: builder.mutation<ReviewQueuePricesResponse, SaveReviewPricesRequest>({
      query: ({ id, distribution_channels }) => ({
        url: `/review-queue/${id}/review-prices/`,
        method: "PUT",
        body: { distribution_channels },
      }),
      transformResponse: flattenPricesResponse,
      invalidatesTags: (_result, _error, { id }) =>
        [{ type: "ReviewQueueItem", id }],
    }),

    publishReviewCourse: builder.mutation<
      ReviewQueueApiItem & { channels?: string[] },
      PublishCourseRequest
    >({
      query: ({ id, distribution_channels }) => ({
        url: `/review-queue/${id}/publish/`,
        method: "POST",
        body: distribution_channels ? { distribution_channels } : {},
      }),
      invalidatesTags: ["ReviewQueue"],
    }),
  }),
});

export const {
  useGetReviewQueuePendingQuery,
  useGetReviewQueueApprovedQuery,
  useGetReviewQueueInReviewQuery,
  useGetReviewQueuePublishedQuery,
  useGetReviewQueueAllQuery,
  useGetReviewQueueDetailQuery,
  useGetReviewQueueCommentsQuery,
  useGetReviewQueuePricesQuery,
  useClaimReviewCourseMutation,
  useApproveReviewCourseContentMutation,
  useRejectReviewCourseContentMutation,
  useAddReviewQueueCommentMutation,
  useQaClaimReviewCourseMutation,
  useQaApproveReviewCourseMutation,
  useQaRejectReviewCourseMutation,
  useSaveReviewQueuePricesMutation,
  usePublishReviewCourseMutation,
} = reviewQueueApi;

export type { ReviewQueueStatus };
