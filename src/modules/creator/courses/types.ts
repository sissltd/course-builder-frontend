export enum CourseStatus {
  DRAFT = "DRAFT",
  SUBMITTED = "SUBMITTED",
  NEEDS_REVISION = "NEEDS_REVISION",
  REJECTED = "REJECTED",
  APPROVED = "APPROVED",
}

export enum DifficultyLevel {
  BEGINNER = "BEGINNER",
  INTERMEDIATE = "INTERMEDIATE",
  ADVANCED = "ADVANCED",
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
  status: CourseStatus;
  creator_price_snapshot: string | null;
  submitted_at: string | null;
  created_datetime: string;
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
  status: CourseStatus;
  creator_price_snapshot: string | null;
  submitted_at: string | null;
  created_datetime: string;
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
  updated_datetime: string;
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
