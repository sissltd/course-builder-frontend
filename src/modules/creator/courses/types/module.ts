import type { Lesson } from "./lesson";
import type { Assessment } from "./assessment";

export interface Module {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
  assessment: Assessment | null;
  locked_by: string | null;
  lock_expires_at: string | null;
  is_locked: boolean;
}

export interface CreateModuleRequest {
  title: string;
  order: number;
}

export interface ReplaceModuleRequest {
  title: string;
  order: number;
  description?: string;
  learning_objectives?: string;
}

export interface UpdateModuleRequest {
  title?: string;
  order?: number;
  description?: string;
  learning_objectives?: string;
}

export interface ModuleListParams {
  ordering?: string;
  page?: number;
  size?: number;
}
