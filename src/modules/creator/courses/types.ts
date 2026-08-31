export enum CourseStatus {
  DRAFT = "DRAFT",
  SUBMITTED = "SUBMITTED",
  IN_REVIEW = "IN_REVIEW",
  NEEDS_REVISION = "NEEDS_REVISION",
  QA_VERIFICATION = "QA_VERIFICATION",
  APPROVED = "APPROVED",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
  REJECTED = "REJECTED",
}

export enum DifficultyLevel {
  BEGINNER = "BEGINNER",
  INTERMEDIATE = "INTERMEDIATE",
  ADVANCED = "ADVANCED",
}

export enum CourseSource {
  CREATOR_UPLOADED = "CREATOR_UPLOADED",
  AI_GENERATED = "AI_GENERATED",
  DEVELOPER_API = "DEVELOPER_API",
}

export enum SourceType {
  CREATOR_UPLOADED = "CREATOR_UPLOADED",
  AI_GENERATED = "AI_GENERATED",
  DEVELOPER_API = "DEVELOPER_API",
}

export enum ThumbnailSourceType {
  UPLOAD = "UPLOAD",
  GOOGLE_DRIVE = "GOOGLE_DRIVE",
  YOUTUBE = "YOUTUBE",
  DROPBOX = "DROPBOX",
  LINK = "LINK",
}

export enum MediaAssetKind {
  VIDEO = "VIDEO",
  AUDIO = "AUDIO",
  IMAGE = "IMAGE",
  DOCUMENT = "DOCUMENT",
}

export interface CourseCategory {
  id: string;
  name: string;
}

export interface CourseTopic {
  id: string;
  name: string;
}

export interface CourseSummary {
  id: string;
  title: string;
  category: CourseCategory;
  topic: CourseTopic | null;
  source: CourseSource;
  status: CourseStatus;
  creator_price_snapshot: string | null;
  submitted_at: string | null;
  created_datetime: string;
  updated_datetime: string;
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: CourseLesson[];
}

export interface CourseLesson {
  id: string;
  title: string;
  type: "video" | "text" | "quiz";
  duration_seconds: number | null;
  content: string | null;
  order: number;
}

export interface CourseAssessment {
  id: string;
  title: string;
  questions: unknown[];
}

export interface Course {
  id: string;
  title: string;
  category: CourseCategory;
  topic: CourseTopic | null;
  source: CourseSource;
  status: CourseStatus;
  creator_price_snapshot: string | null;
  submitted_at: string | null;
  created_datetime: string;
  updated_datetime: string;
  description: string;
  difficulty_level: DifficultyLevel;
  learning_objectives: string[];
  tags: string[];
  planned_duration_seconds: number;
  preview_video_url: string;
  thumbnail_url: string;
  terms_accepted_at: string | null;
  approved_at: string | null;
  published_at: string | null;
  rejected_at: string | null;
  modules: CourseModule[];
  final_assessment: CourseAssessment | null;
  duration_estimate_minutes: number;
  version: string;
}

export interface CreateCourseRequest {
  category: string;
  title: string;
  description: string;
  difficulty_level?: DifficultyLevel;
  learning_objectives?: string[];
  tags?: string[];
  duration_hours?: number;
  duration_minutes?: number;
  duration_seconds?: number;
  topic?: string;
  terms_accepted: boolean;
}

export interface UpdateCourseRequest {
  title?: string;
  description?: string;
  preview_video_url?: string;
  thumbnail_url?: string;
  category?: string;
  topic?: string | null;
  difficulty_level?: DifficultyLevel;
  learning_objectives?: string[];
  tags?: string[];
  duration_hours?: number;
  duration_minutes?: number;
  duration_seconds?: number;
}

export interface PaginatedPaginator {
  count: number;
  page: number;
  page_size: number;
  total_pages: number;
  next_page_number: number | null;
  next: string | null;
  previous_page_number: number | null;
  previous: string | null;
}

export interface PaginatedResponse<T> {
  status: boolean;
  message: string;
  data: {
    paginator: PaginatedPaginator;
    results: T;
  };
}

export interface CoursesListParams {
  category?: string;
  topic?: string;
  status?: CourseStatus;
  source_type?: SourceType;
  difficulty_level?: DifficultyLevel;
  course_id?: string;
  search?: string;
  creator_type?: SourceType;
  quality_score?: number;
  date_from?: string;
  date_to?: string;
  ordering?: string;
  page?: number;
  size?: number;
}

export interface SubmitCourseResponse extends Course {
  status: CourseStatus.SUBMITTED;
}

export interface StructuralValidationError {
  field: string;
  message: string;
}

export interface CourseThumbnail {
  id: string;
  course: string;
  media_type: string;
  source: ThumbnailSourceType;
  file: string | null;
  external_url: string | null;
  width: number | null;
  height: number | null;
  is_active: boolean;
  created_datetime: string;
}

export interface SetThumbnailRequest {
  media_type: string;
  source: ThumbnailSourceType;
  file?: string;
  external_url?: string;
  width?: number;
  height?: number;
}

export interface MediaAsset {
  id: string;
  lesson: string | null;
  kind: MediaAssetKind;
  url: string;
  mime_type: string | null;
  duration_seconds: number | null;
  resolution: string | null;
  subtitle_url: string | null;
}

export interface RegisterMediaAssetRequest {
  lesson?: string;
  kind: MediaAssetKind;
  url: string;
  mime_type?: string;
  duration_seconds?: number;
  resolution?: string;
  subtitle_url?: string;
  caption_accuracy_percent?: string;
  audio_lufs?: string;
  audio_video_drift_ms?: number;
  accessibility?: {
    captions?: boolean;
  };
}
