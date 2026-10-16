import type { ApiErrorEnvelope } from "@/lib/api/types";

export type CourseImportStatus =
  | "QUEUED"
  | "PARSING"
  | "MAPPING"
  | "READY_FOR_REVIEW"
  | "CONFIRMING"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED";

export const COURSE_IMPORT_ACTIVE_STATUSES: readonly CourseImportStatus[] = [
  "QUEUED",
  "PARSING",
  "MAPPING",
  "READY_FOR_REVIEW",
  "CONFIRMING",
];

export const COURSE_IMPORT_TERMINAL_STATUSES: readonly CourseImportStatus[] = [
  "COMPLETED",
  "FAILED",
  "CANCELLED",
];

export const COURSE_IMPORT_STATUS_LABEL: Record<CourseImportStatus, string> = {
  QUEUED: "Queued",
  PARSING: "Parsing",
  MAPPING: "Mapping",
  READY_FOR_REVIEW: "Ready for review",
  CONFIRMING: "Confirming",
  COMPLETED: "Completed",
  FAILED: "Failed",
  CANCELLED: "Cancelled",
};

export type CourseImportLessonType = "VIDEO" | "QUIZ" | "TEXT";

export const COURSE_IMPORT_LESSON_TYPES: readonly CourseImportLessonType[] = [
  "VIDEO",
  "QUIZ",
  "TEXT",
];

export type CourseImportDifficultyLevel =
  | "BEGINNER"
  | "INTERMEDIATE"
  | "ADVANCED";

export const COURSE_IMPORT_DIFFICULTY_LEVELS: readonly CourseImportDifficultyLevel[] =
  ["BEGINNER", "INTERMEDIATE", "ADVANCED"];

export type CourseImportQuizQuestionType =
  | "SINGLE_CHOICE"
  | "MULTIPLE_CHOICE"
  | "ESSAY";

export const COURSE_IMPORT_QUIZ_QUESTION_TYPES: readonly CourseImportQuizQuestionType[] =
  ["SINGLE_CHOICE", "MULTIPLE_CHOICE", "ESSAY"];

export type CourseImportFolder = "course-imports";

export type CourseImportUploadPurpose = "COURSE_DOCUMENT_IMPORT";

export type CourseImportTemplateFileType = "json" | "xlsx";

export const COURSE_IMPORT_TEMPLATE_FILE_TYPES: readonly CourseImportTemplateFileType[] =
  ["json", "xlsx"];

export type CourseImportErrorEnvelope = ApiErrorEnvelope;

export const COURSE_IMPORT_MAX_FILE_SIZE_MB = 20;
export const COURSE_IMPORT_MAX_FILE_SIZE_BYTES =
  COURSE_IMPORT_MAX_FILE_SIZE_MB * 1024 * 1024;

export const COURSE_IMPORT_EXTENSIONS = [
  ".pdf",
  ".docx",
  ".txt",
  ".csv",
] as const;

export const COURSE_IMPORT_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "text/csv",
  "application/csv",
] as const;

export const COURSE_IMPORT_JOB_STORAGE_KEY = "course-import-job-id";

export interface CourseImportQuizQuestion {
  type?: CourseImportQuizQuestionType;
  question: string;
  points?: number;
  options?: string[];
  correct_index?: number;
  correct_indices?: number[];
  expected_answer?: string;
  explanation?: string;
}

export interface CourseImportAssessment {
  title: string;
  questions: CourseImportQuizQuestion[];
}

export interface CourseImportLesson {
  title: string;
  order?: number;
  content?: string;
  content_type?: CourseImportLessonType;
  duration_minutes?: number | null;
  learning_objectives?: string[];
  requirements?: string[];
  video_url?: string;
  embedded_link?: string;
  assessment?: CourseImportAssessment;
}

export interface CourseImportModule {
  title: string;
  description?: string;
  order?: number;
  learning_objectives?: string[];
  lessons: CourseImportLesson[];
  assessment?: CourseImportAssessment;
}

export interface CourseImportCourseMetadata {
  title?: string;
  description?: string;
  difficulty_level?: CourseImportDifficultyLevel | "";
  tags?: string[];
  learning_objectives?: string[];
  preview_video_url?: string;
  final_assessment?: CourseImportAssessment;
}

export interface CourseImportStructure {
  course?: CourseImportCourseMetadata;
  modules: CourseImportModule[];
}

export interface CourseImportConfirmRequest {
  structure?: CourseImportStructure;
}

export interface CourseImportConfirmResponse {
  course_id: string;
  status: string;
  builder_url: string;
  quality_failures: string[];
}

export interface CourseImportCreateRequest {
  file_key: string;
  filename: string;
  content_type: string;
  size: number;
  category: string;
  topic?: string | null;
  title: string;
  description?: string;
  terms_accepted: boolean;
  idempotency_key?: string;
}

export interface CourseImportJob {
  id: string;
  course_id: string | null;
  status: CourseImportStatus;
  progress: number;
  stage: string;
  file_key: string;
  filename: string;
  content_type: string;
  size: number;
  title: string;
  description: string;
  detected_structure: CourseImportDetectedStructure;
  warnings: string[];
  error_message: string;
  cancel_requested: boolean;
  created_datetime: string;
  updated_datetime: string;
  completed_at: string | null;
}

export interface CourseImportDetectedLesson {
  title: string;
  order?: number;
  content?: string;
  content_type?: CourseImportLessonType;
  duration_minutes?: number | null;
  learning_objectives?: string[];
  requirements?: string[];
  video_url?: string;
  embedded_link?: string;
  assessment?: CourseImportAssessment;
}

export interface CourseImportDetectedModule {
  title: string;
  description?: string;
  order?: number;
  learning_objectives?: string[];
  lessons: CourseImportDetectedLesson[];
  assessment?: CourseImportAssessment;
}

export interface CourseImportDetectedStructure {
  course?: CourseImportCourseMetadata;
  modules: CourseImportDetectedModule[];
}

export interface CourseImportTemplateParams {
  file_type?: CourseImportTemplateFileType;
}

export interface CourseImportPresignRequest {
  filename: string;
  content_type: string;
  folder: CourseImportFolder;
  size: number;
  purpose: CourseImportUploadPurpose;
}

export interface CourseImportPresignResponse {
  upload_url: string;
  upload_headers: Record<string, string>;
  file_url: string;
  file_key: string;
  expires_in: number;
}

export type CourseImportPresignUploadRequest = Pick<
  CourseImportPresignRequest,
  "filename" | "content_type" | "size"
>;
