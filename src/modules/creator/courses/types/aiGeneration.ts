export type GenerationPhase = "CREATING_CONTENT" | "PREPARING_DETAILS";

export type GenerationStatus =
  | "QUEUED"
  | "RUNNING"
  | "STRUCTURE_READY"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED";

export type GenerationItemStatus =
  | "PENDING"
  | "RUNNING"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED";

export interface GenerationItem {
  id: string;
  key: string;
  label: string;
  phase: GenerationPhase;
  status: GenerationItemStatus;
  order: number;
  error_message: string;
}

export interface GenerationJob {
  id: string;
  course: string | null;
  kind: "FULL_COURSE";
  status: GenerationStatus;
  stage: string;
  current_phase: GenerationPhase;
  result: { course_id?: string; builder_ready?: boolean };
  error_message: string;
  cancel_requested: boolean;
  builder_ready: boolean;
  items: GenerationItem[];
  created_datetime: string;
  updated_datetime: string;
}

export interface CreateGenerationRequest {
  title: string;
  description: string;
  category: string;
  topic?: string | null;
  terms_accepted: boolean;
  idempotency_key: string;
}

export const GENERATION_JOB_STORAGE_KEY = "ai-generation-job-id";
