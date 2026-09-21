import type { PaginatedResponse } from "@/modules/creator/courses/types";

export enum CategoryStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  ARCHIVED = "ARCHIVED",
}

export enum TrackPreference {
  CREATOR_PREFERRED = "CREATOR_PREFERRED",
  AI_PREFERRED = "AI_PREFERRED",
  OPEN = "OPEN",
}

/**
 * The read shape. Every field is `readOnly` server-side, so writes go through
 * `CategoryWriteRequest` instead of this type.
 */
export interface Category {
  id: string;
  name: string;
  creator_price_beginner: string;
  creator_price_intermediate: string;
  creator_price_advanced: string;
  icon: string;
  track_preference: TrackPreference;
  status: CategoryStatus;
  total_courses: number;
  created_datetime: string;
  updated_datetime: string;
}

export interface CategoryListParams {
  track_preference?: TrackPreference;
  status?: CategoryStatus;
  ordering?: string;
  page?: number;
  size?: number;
}

export type CategoryListResponse = PaginatedResponse<Category[]>;

export interface CategoryStats {
  total: number;
  active: number;
  inactive: number;
  archived: number;
}

/**
 * `courses_by_status` is an open map keyed by `CourseStatus`, so it is typed as
 * a number map rather than an exhaustive record.
 */
export interface CategoryDeletionImpact {
  category_id: string;
  category_name: string;
  course_count: number;
  courses_by_status: Record<string, number>;
  affected_creator_profile_count: number;
  /** Server's call on whether a strategy must be supplied — do not re-derive. */
  requires_strategy: boolean;
}

/**
 * The picker returns a flat array, not the usual `data.results` envelope, and
 * includes non-active categories flagged via `is_active` rather than filtered
 * out server-side.
 */
export interface CategoryPickerOption {
  id: string;
  name: string;
  is_active: boolean;
}

/**
 * `name` and all three price tiers are required; `icon` is optional. The delete
 * `strategy` values are documented in the handover notes but are an unconstrained
 * `string` in the schema, so this union is the only record of them.
 */
export interface CategoryWriteRequest {
  name: string;
  creator_price_beginner: string;
  creator_price_intermediate: string;
  creator_price_advanced: string;
  icon?: string;
  track_preference?: TrackPreference;
  status?: CategoryStatus;
}

export type UpdateCategoryRequest = Partial<CategoryWriteRequest>;

export type DeleteStrategy = "DELETE_COURSES" | "REASSIGN";

export interface DeleteCategoryArgs {
  id: string;
  /**
   * Omitted when the category holds no courses. The server answers `409` if a
   * strategy turns out to be required, which is the signal to ask the user.
   */
  strategy?: DeleteStrategy;
  /** Required when `strategy` is `REASSIGN`. */
  replacement_category?: string;
}

export const TRACK_PREFERENCE_OPTIONS: Array<{
  value: TrackPreference;
  label: string;
}> = [
  { value: TrackPreference.CREATOR_PREFERRED, label: "Creator Preferred" },
  { value: TrackPreference.AI_PREFERRED, label: "AI Preferred" },
  { value: TrackPreference.OPEN, label: "Open" },
];

export const TRACK_PREFERENCE_LABELS: Record<TrackPreference, string> = {
  [TrackPreference.CREATOR_PREFERRED]: "Creator Preferred",
  [TrackPreference.AI_PREFERRED]: "AI Preferred",
  [TrackPreference.OPEN]: "Open",
};

export const CATEGORY_STATUS_LABELS: Record<CategoryStatus, string> = {
  [CategoryStatus.ACTIVE]: "Active",
  [CategoryStatus.INACTIVE]: "Inactive",
  [CategoryStatus.ARCHIVED]: "Archived",
};
