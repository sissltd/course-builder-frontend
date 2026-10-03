import { BaseAPI } from "../baseApi";

/**
 * Most admin endpoints answer with a `{ status, message, data }` envelope while
 * a few return the resource bare. These two helpers type that duality once so
 * each `transformResponse` states its own result type instead of reaching for
 * `any`.
 */
type DataEnvelope<T> = { data?: T } | T;

function unwrapData<T>(response: unknown): T {
  if (
    response &&
    typeof response === "object" &&
    "data" in response &&
    response.data !== undefined
  ) {
    return response.data as T;
  }
  return response as T;
}

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
    NEEDS_REVISION?: number;
    QA_VERIFICATION?: number;
    APPROVED: number;
    PUBLISHED: number;
    ARCHIVED?: number;
    REJECTED: number;
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
  period?: string;
  today?: {
    courses_created_today: number;
    courses_created_change_percent: number | null;
    published_last_24h: number;
    published_total: number;
    daily_cost: string | number | null;
    daily_cost_change_percent: number | null;
    avg_cost_per_course: string | number | null;
  };
  production_trend?: Array<{
    date: string;
    count: number;
  }>;
  cost_trend?: Array<{
    date: string;
    amount: string;
  }>;
}

export interface AdminAnalyticsParams {
  period?: string;
}

export interface AdminAnalyticsResponse {
  period: string;
  since: string;
  catalog: {
    total_catalog: number;
    published: number;
    created_in_period: number;
  };
  enrollment: {
    total_enrollment: number;
    enrolled_in_period: number;
    completed: number;
    avg_completion_rate: number | null;
  };
  cost: {
    overall_cost: string | number | null;
    cost_in_period: string | number | null;
    cost_per_course: string | number | null;
    daily: Array<{
      date?: string;
      day?: string;
      cost?: string | number;
      amount?: string | number;
      [key: string]: unknown;
    }>;
    by_category: Array<{
      category?: string;
      name?: string;
      cost?: string | number;
      amount?: string | number;
      [key: string]: unknown;
    }>;
  };
  earnings: {
    total_earnings: string;
  };
  distribution: Array<{
    channel: string;
    label: string;
    count: number;
  }>;
  production_vs_approval: {
    produced: number;
    approved: number;
    rejected: number;
  };
  kpis: {
    daily_output: number | null;
    first_pass_approval_percent: number | null;
    avg_pipeline_time_minutes: number | null;
    cost_per_course: string | number | null;
    review_turnaround_hours: number | null;
    system_uptime_percent: number | null;
    targets: {
      daily_output: string;
      first_pass_approval_percent: string;
      avg_pipeline_time_minutes: string;
      cost_per_course: string;
      review_turnaround_hours: string;
      system_uptime_percent: string;
    };
  };
}

export interface SystemServiceItem {
  id: string;
  name: string;
  priority: "HIGH" | "MEDIUM" | "NORMAL" | "LOW" | string;
  status: "OPERATIONAL" | "DEGRADED" | "DOWN" | null;
  uptime_percent: number | null;
  avg_latency_ms: number | null;
  sample_count: number;
  last_recovery_seconds: number | null;
}

export interface AdminSystemHealthResponse {
  window_days: number;
  overall_uptime_percent: number | null;
  avg_api_latency_ms: number | null;
  avg_recovery_seconds: number | null;
  degraded_count: number;
  down_count: number;
  services: SystemServiceItem[];
}

export interface PipelineStageItem {
  stage: string;
  label: string;
  total: number;
  active: number;
  completed: number;
  failed: number;
}

export interface PipelineProviderItem {
  id: string;
  name: string;
  kind: string;
  load_percent: number | null;
  queue_depth: number | null;
  readings_updated_at: string | null;
}

export interface AdminPipelineResponse {
  active_jobs: number;
  queue_depth: number;
  completed_today: number;
  failed_or_retrying: number;
  avg_pipeline_seconds: number | null;
  stages: PipelineStageItem[];
  providers: PipelineProviderItem[];
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
  details?: Record<string, unknown>;
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

/**
 * The identity fields both sides of a submission carry.
 *
 * Absence has no single sentinel here: a missing value arrives as `null`, as
 * `""`, and — for `address.address` — sometimes as whitespace only. Callers
 * must trim before testing for emptiness; see `clean` in the kyc-review lib.
 */
export interface KycIdentityData {
  first_name: string;
  last_name: string;
  date_of_birth: string | null;
  sex: string;
  address: { address: string; state: string } | null;
  phone: string;
}

/**
 * What the KYC provider returned. Every field is empty when the provider found
 * nothing, which is what `kyc_request_status` reports — so an all-empty
 * `api_data` is a normal state, not a broken response.
 */
export interface KycApiData extends KycIdentityData {
  document_image: string | null;
}

/**
 * What the user submitted. `image` is their upload, handed out as a **signed
 * URL** (`X-Amz-Expires=600`), so it is not stable enough to cache or store.
 */
export interface KycUserProvidedData extends KycIdentityData {
  image: string;
}

/**
 * Both `GET /users/kyc-review/` and `GET /users/kyc-review/{id}/` return this
 * same object.
 *
 * The names live under `user_provided_data`. There is no `user` and no
 * `kyc_user_data` — the previous shape declared a required `user`, and reading
 * `user.first_name` off it is what crashed the review page.
 */
export interface KycSubmission {
  id: string;
  country_of_issue: string;
  document_type: string;
  id_number: string;
  /** Status with the provider — found or not found. `""`, never null. */
  kyc_request_status: string;
  status: string;
  /** `""`, not null, when the submission was never rejected. */
  rejection_reason: string;
  created_datetime: string;
  reviewed_at: string | null;
  /*
    `reviewed_by` is null in every payload seen so far and nothing renders it,
    so it is left out rather than guessed at. Check the detail endpoint before
    adding it.
  */
  liveness_score: number | null;
  liveness_passes: boolean;
  /** Signed URL of the captured selfie; `""` when no check ran. */
  liveness_avatar_url: string;
  /** Score at or above which `liveness_passes` is true. */
  liveness_threshold: number;
  api_data: KycApiData | null;
  user_provided_data: KycUserProvidedData | null;
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

export type CourseSourceType =
  | "CREATOR_UPLOADED"
  | "AI_GENERATED"
  | "DOCUMENT_IMPORTED"
  | "DEVELOPER_API";

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

export type CourseDifficultyLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export type CourseStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "IN_REVIEW"
  | "NEEDS_REVISION"
  | "QA_VERIFICATION"
  | "APPROVED"
  | "PUBLISHED"
  | "ARCHIVED"
  | "REJECTED";

export type LessonType = "VIDEO" | "QUIZ" | "TEXT";

export type QualityStatus = "NOT_RUN" | "PASS" | "WARNING" | "FAIL";

export type AssessmentLevel = "LESSON" | "MODULE" | "COURSE";

export type QuizQuestionType = "SINGLE_CHOICE" | "MULTIPLE_CHOICE" | "ESSAY";

export interface CourseAssessmentSummary {
  total_questions?: number;
  total_points?: number;
  single_choice_count?: number;
  multiple_choice_count?: number;
  essay_count?: number;
}

export interface CourseQuizQuestion {
  type?: QuizQuestionType | string;
  question: string;
  points?: number;
  options?: Array<
    | string
    | {
        label?: string;
        text?: string;
        value?: string;
        explanation?: string;
        is_correct?: boolean;
      }
  >;
  correct_index?: number | null;
  correct_indices?: number[];
  expected_answer?: string;
  explanation?: string;
}

export interface CourseAssessment {
  id: string;
  level: AssessmentLevel | string;
  title: string;
  questions: CourseQuizQuestion[];
  summary: CourseAssessmentSummary;
}

export interface CourseLessonRequirement {
  id: string;
  lesson: string;
  text: string;
  order: number;
}

export interface CourseLessonImage {
  id: string;
  lesson: string;
  image: string;
  caption: string;
  source_type: CourseSourceType | string;
  order: number;
}

export interface CourseLessonContentBlock {
  id: string;
  lesson: string;
  order: number;
  block_type: string;
  text_content: string;
  media_url: string;
  quiz: string | null;
}

export interface AdminCourseModuleLesson {
  id: string;
  title: string;
  order: number;
  lesson_type: LessonType | string;
  script: string;
  video_url: string;
  embedded_link: string;
  video_script_file: string;
  learning_objectives: string[];
  duration_minutes: number;
  lesson_requirement: string;
  assessment: CourseAssessment | null;
  content_blocks: CourseLessonContentBlock[];
  images: CourseLessonImage[];
  requirements: CourseLessonRequirement[];
}

export interface AdminCourseModule {
  id: string;
  title: string;
  order: number;
  description: string;
  learning_objectives: string[];
  lessons: AdminCourseModuleLesson[];
  assessment: CourseAssessment | null;
  locked_by: string | null;
  lock_expires_at: string | null;
  is_locked: boolean;
  collaboration_locked_by: string | null;
  collaboration_locked_at: string | null;
  collaboration_locked: boolean;
}

export interface CourseMediaAsset {
  id: string;
  lesson: string | null;
  kind: "VIDEO" | "AUDIO" | "SUBTITLE" | "THUMBNAIL" | "PREVIEW_VIDEO" | string;
  url: string;
  mime_type: string;
  duration_seconds: number | null;
  resolution: string;
  subtitle_url: string;
  caption_accuracy_percent: string | null;
  audio_lufs: string | null;
  audio_video_drift_ms: number | null;
  accessibility: Record<string, unknown> | null;
  verification: Record<string, unknown> | null;
  verified_at: string | null;
  verified_by: AdminCourseCreator | null;
}

export interface CourseQualityFinding {
  id: string;
  code: string;
  severity: "INFO" | "WARNING" | "ERROR" | string;
  message: string;
  module: string | null;
  lesson: string | null;
  evidence: Record<string, unknown> | null;
  resolved_at: string | null;
  created_datetime: string;
}

export interface CourseQualityCheckRun {
  id: string;
  provider: string;
  overall_score: number | null;
  risk_level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | string;
  status: QualityStatus | string;
  plagiarism_status: QualityStatus | string;
  plagiarism_score: string | null;
  duplicate_status: QualityStatus | string;
  duplicate_score: string | null;
  raw_report: Record<string, unknown> | null;
  findings: CourseQualityFinding[];
  created_datetime: string;
}

export interface CourseReviewAssignment {
  id: string;
  stage: string;
  reviewer: AdminCourseCreator | null;
  claimed_at: string | null;
  completed_at: string | null;
}

export interface CourseDistribution {
  id: string;
  channel: string;
  channel_label: string;
  approval_rate: string;
  learner_price: string;
  mie_suggestion: string | null;
  model: string;
  learner_fee: string;
  creator_payout_fixed: string | null;
  course_fee_percent: string | null;
  promotional_pricing: string | null;
  platform_revenue_per_enrollment: string | null;
  mie_explanation: string;
  comparable_courses: Array<{
    course_title: string;
    difficulty_level: CourseDifficultyLevel | string;
    learner_price: string;
  }>;
  status: string;
  external_course_id: string;
  failure_reason: string;
  published_at: string | null;
}

export interface AdminCourseDetail {
  id: string;
  title: string;
  description: string;
  category: AdminCourseCategory | null;
  topic: AdminCourseTopic | null;
  difficulty_level: CourseDifficultyLevel | string;
  source_type: CourseSourceType | string;
  quality_score: number | null;
  learning_objectives: string[];
  tags: string[];
  planned_duration_seconds: number;
  status: CourseStatus | string;
  creator_price_snapshot: string | null;
  preview_video_url: string;
  thumbnail_url: string;
  terms_accepted_at: string | null;
  submitted_at: string | null;
  approved_at: string | null;
  published_at: string | null;
  rejected_at: string | null;
  modules: AdminCourseModule[];
  final_assessment: CourseAssessment | null;
  media_assets: CourseMediaAsset[];
  quality_check_runs: CourseQualityCheckRun[];
  quality_findings: CourseQualityFinding[];
  review_assignments: CourseReviewAssignment[];
  review_comments: CourseReviewComment[];
  qa_video_samples: unknown[];
  distribution_channels: CourseDistribution[];
  duration_estimate_minutes: number;
  version: AdminCourseVersion | string | null;
  created_datetime: string;
  updated_datetime: string;
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
  name?: string;
}

export type ReviewStage = "CONTENT" | "QA" | string;
export type ReviewSeverity = "ERROR" | "WARNING" | "INFO" | string;

/**
 * A review seat a course can be waiting on, per the backend's seat enum —
 * `CONTENT` (First Review), `SECOND_REVIEW`, `VERIFICATION` and `QA`.
 *
 * Wider than `ReviewStage`, which only ever names the two gates a comment
 * belongs to. `assignable-reviewers` and `assign` both carry this set.
 */
export type ReviewSeat = "CONTENT" | "SECOND_REVIEW" | "VERIFICATION" | "QA" | string;

export interface AssignableReviewer {
  id: string;
  email: string;
  full_name: string;
  role: string;
  seat: ReviewSeat;
  is_available: boolean;
  holds_seat: boolean;
}

export interface AssignCourseRequest {
  reviewer_id: string;
  replace?: boolean;
}

export interface AssignCourseResult {
  course_id: string;
  seat: ReviewSeat;
  reviewer_id: string;
}

export interface CourseReviewComment {
  id: string;
  reviewer: CourseReviewCommentAuthor | string | null;
  stage: ReviewStage;
  module: string | null;
  lesson: string | null;
  severity: ReviewSeverity;
  reason_code: string;
  comment: string;
  resolved_at: string | null;
  created_datetime: string;
}

export interface AddCourseCommentRequest {
  stage: ReviewStage;
  module?: string | null;
  lesson?: string | null;
  severity?: ReviewSeverity;
  reason_code?: string;
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
  feedback: Record<string, unknown>;
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
      providesTags: ["AdminCourse"],
    }),
    getPendingCourses: builder.query<AdminCoursesResponse, AdminCoursesListParams | void>({
      query: (params) => ({
        url: "/admin/courses/pending/",
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
      providesTags: ["AdminCourse"],
    }),
    getApprovedCourses: builder.query<AdminCoursesResponse, AdminCoursesListParams | void>({
      query: (params) => ({
        url: "/admin/courses/approved/",
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
      providesTags: ["AdminCourse"],
    }),
    getAdminOverview: builder.query<AdminOverviewResponse, void>({
      query: () => ({
        url: "/admin/overview/",
        method: "GET",
      }),
      transformResponse: (response: DataEnvelope<AdminOverviewResponse>): AdminOverviewResponse =>
        unwrapData(response),
      providesTags: ["AdminOverview"],
    }),
    getAdminAnalytics: builder.query<AdminAnalyticsResponse, AdminAnalyticsParams | void>({
      query: (params) => ({
        url: "/admin/analytics/",
        method: "GET",
        params: params?.period ? { period: params.period } : undefined,
      }),
      transformResponse: (response: DataEnvelope<AdminAnalyticsResponse>): AdminAnalyticsResponse =>
        unwrapData(response),
      providesTags: ["AdminAnalytics"],
    }),
    getAdminSystemHealth: builder.query<AdminSystemHealthResponse, void>({
      query: () => ({
        url: "/admin/system-health/",
        method: "GET",
      }),
      transformResponse: (response: DataEnvelope<AdminSystemHealthResponse>): AdminSystemHealthResponse =>
        unwrapData(response),
      providesTags: ["AdminSystemHealth"],
    }),
    getAdminPipeline: builder.query<AdminPipelineResponse, void>({
      query: () => ({
        url: "/admin/pipeline/",
        method: "GET",
      }),
      transformResponse: (response: DataEnvelope<AdminPipelineResponse>): AdminPipelineResponse =>
        unwrapData(response),
      providesTags: ["AdminPipeline"],
    }),
    getActivityLog: builder.query<ActivityLogResponse, ActivityLogParams | void>({
      query: (params) => ({
        url: "/users/activity-log/",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: ["ActivityLog"],
    }),
    getKycReviewList: builder.query<KycListResponse, KycListParams | void>({
      query: (params) => ({
        url: "/users/kyc-review/",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: ["KycReview"],
    }),
    getKycReviewDetail: builder.query<KycSubmission, string>({
      query: (id) => ({
        url: `/users/kyc-review/${id}/`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "KycReview", id }],
    }),
    approveKyc: builder.mutation<void, string>({
      query: (id) => ({
        url: `/users/kyc-review/${id}/approve/`,
        method: "POST",
      }),
      invalidatesTags: ["KycReview"],
    }),
    rejectKyc: builder.mutation<void, { id: string; rejection_reason: string }>({
      query: ({ id, rejection_reason }) => ({
        url: `/users/kyc-review/${id}/reject/`,
        method: "POST",
        body: { rejection_reason },
      }),
      invalidatesTags: ["KycReview"],
    }),
    getAdminWallets: builder.query<WalletListResponse, WalletListParams | void>({
      query: (params) => ({
        url: "/admin/wallets/",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: ["AdminWallet"],
    }),
    getAdminTransactions: builder.query<TransactionListResponse, TransactionListParams | void>({
      query: (params) => ({
        url: "/admin/transactions/",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: ["AdminTransaction"],
    }),
    getAdminWithdrawals: builder.query<WithdrawalListResponse, WithdrawalListParams | void>({
      query: (params) => ({
        url: "/admin/withdrawals/",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: ["AdminWithdrawal"],
    }),
    getAdminCourseDetail: builder.query<AdminCourseDetail, string>({
      query: (id) => ({
        url: `/admin/courses/${id}/`,
        method: "GET",
      }),
      transformResponse: (response) => unwrapData<AdminCourseDetail>(response),
      providesTags: (result, error, id) => [{ type: "AdminCourse", id }],
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
      ],
    }),
    claimAdminCourse: builder.mutation<AdminCourseDetail, string>({
      query: (id) => ({
        url: `/admin/courses/${id}/claim/`,
        method: "POST",
      }),
      transformResponse: (response) => unwrapData<AdminCourseDetail>(response),
      invalidatesTags: (result, error, id) => [
        "AdminCourse",
        { type: "AdminCourse", id },
      ],
    }),
    /**
     * The reviewers who could take the seat this course is waiting on. Not
     * paginated, and empty when nobody qualifies.
     *
     * Unavailable reviewers are returned rather than omitted, carrying
     * `is_available: false` — assigning one is a 400, so the picker lists them
     * disabled instead of pretending they are not there.
     */
    getAssignableReviewers: builder.query<AssignableReviewer[], string>({
      query: (id) => ({
        url: `/admin/courses/${id}/assignable-reviewers/`,
        method: "GET",
      }),
      transformResponse: (response: DataEnvelope<AssignableReviewer[]>) =>
        Array.isArray(response) ? response : (response.data ?? []),
      providesTags: (result, error, id) => [{ type: "AdminCourse", id }],
    }),
    /**
     * Puts a reviewer in the seat the course is waiting on, as if they had
     * claimed it, and notifies them.
     *
     * A seat someone else already holds is a 409 unless `replace` is true; with
     * `replace` the previous holder is notified. Assigning the current holder
     * again changes nothing.
     */
    assignAdminCourse: builder.mutation<
      AssignCourseResult,
      { id: string; body: AssignCourseRequest }
    >({
      query: ({ id, body }) => ({
        url: `/admin/courses/${id}/assign/`,
        method: "POST",
        body,
      }),
      transformResponse: (response: DataEnvelope<AssignCourseResult>) =>
        unwrapData(response),
      invalidatesTags: (result, error, { id }) => [
        "AdminCourse",
        { type: "AdminCourse", id },
      ],
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
      ],
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
      ],
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
      ],
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
      ],
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
      ],
    }),
    qaClaimAdminCourse: builder.mutation<AdminCourseDetail, string>({
      query: (id) => ({
        url: `/admin/courses/${id}/qa-claim/`,
        method: "POST",
      }),
      transformResponse: (response) => unwrapData<AdminCourseDetail>(response),
      invalidatesTags: (result, error, id) => [
        "AdminCourse",
        { type: "AdminCourse", id },
      ],
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
      ],
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
      ],
    }),
    publishCourse: builder.mutation<{ detail?: string }, { id: string; body: PublishCourseRequest }>({
      query: ({ id, body }) => ({
        url: `/admin/courses/${id}/publish/`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        "AdminCourse",
        { type: "AdminCourse", id },
      ],
    }),
    getCourseReviewPrices: builder.query<CourseReviewPricesResponse, string>({
      query: (id) => ({
        url: `/admin/courses/${id}/review-prices/`,
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
      providesTags: (result, error, id) => [{ type: "AdminCourse", id }],
    }),
    saveCoursePrices: builder.mutation<
      CourseReviewPricesResponse,
      { id: string; body: SaveCoursePricesRequest }
    >({
      query: ({ id, body }) => ({
        url: `/admin/courses/${id}/review-prices/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "AdminCourse", id }],
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
      providesTags: ["TopicReservation"],
    }),
    getActiveReservationDetail: builder.query<AdminActiveReservation, string>({
      query: (id) => ({
        url: `/admin/reservations/active/${id}/`,
        method: "GET",
      }),
      transformResponse: (response) => unwrapData<AdminActiveReservation>(response),
      providesTags: (_result, _error, id) => [{ type: "TopicReservation", id }],
    }),
    releaseActiveReservation: builder.mutation<{ detail?: string }, { id: string }>({
      query: ({ id }) => ({
        url: `/admin/reservations/active/${id}/release/`,
        method: "POST",
      }),
      invalidatesTags: ["TopicReservation"],
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
      providesTags: ["TopicReservation"],
    }),
    getReservationRequestDetail: builder.query<AdminReservationRequestItem, string>({
      query: (id) => ({
        url: `/admin/reservations/requests/${id}/`,
        method: "GET",
      }),
      transformResponse: (response) => unwrapData<AdminReservationRequestItem>(response),
      providesTags: (_result, _error, id) => [{ type: "TopicReservation", id }],
    }),
    approveReservationRequest: builder.mutation<{ detail?: string }, { id: string }>({
      query: ({ id }) => ({
        url: `/admin/reservations/requests/${id}/approve/`,
        method: "POST",
      }),
      invalidatesTags: ["TopicReservation"],
    }),
    rejectReservationRequest: builder.mutation<
      { detail?: string },
      { id: string; body?: RejectReservationRequestPayload }
    >({
      query: ({ id, body }) => ({
        url: `/admin/reservations/requests/${id}/reject/`,
        method: "POST",
        body: body || {},
      }),
      invalidatesTags: ["TopicReservation"],
    }),
  }),
});

export const {
  useGetAdminCoursesQuery,
  useGetPendingCoursesQuery,
  useGetApprovedCoursesQuery,
  useGetAdminCourseDetailQuery,
  useApproveAdminCourseMutation,
  useClaimAdminCourseMutation,
  useGetAssignableReviewersQuery,
  useAssignAdminCourseMutation,
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
  useGetAdminAnalyticsQuery,
  useGetAdminSystemHealthQuery,
  useGetAdminPipelineQuery,
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

export {
  useGetUsersQuery,
  useGetUserQuery,
  useSuspendUserMutation,
  useDeactivateUserMutation,
  useReinstateUserMutation,
  useSendUserPasswordResetMutation,
  useEraseUserMutation,
} from "@/modules/admin/teams/api/usersApi";
export type { AdminUser, UsersListParams } from "@/modules/admin/teams/types";
