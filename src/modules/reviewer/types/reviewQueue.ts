import { format } from "date-fns";


export interface ReviewQueueRow {
  id: string;
  creator: string;
  courseTitle: string;
  courseId: string;
  category: string;
  difficultyLevel: string;
  reviewer: string;
  reviewerId: string | null;
  approvedBy: string;
  dateReviewed: string;
  lastReviewedAt: string;
  reviewerNote: string;
  price: string;
  channels: string[];
  channelSummary: string;
  sourceLabel: string;
  dateCreated: string;
  raw: ReviewQueueApiItem;
}

/** Course status values as returned in every course payload. */
export type ReviewQueueStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "IN_REVIEW"
  | "NEEDS_REVISION"
  | "QA_VERIFICATION"
  | "APPROVED"
  | "PUBLISHED"
  | "ARCHIVED"
  | "REJECTED";

export interface ReviewQueueNamedRef {
  id: string;
  name: string;
}

export interface ReviewQueueUserRef {
  id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  name?: string;
}

export interface ReviewQueueApiItem {
  id: string;
  status?: ReviewQueueStatus | string;
  course_title?: string | null;
  title?: string | null;
  course_id?: string | null;
  category?: ReviewQueueNamedRef | string | null;
  difficulty_level?: string | null;
  creator?: ReviewQueueUserRef | string | null;
  reviewer?: ReviewQueueUserRef | string | null;
  reviewer_id?: string | null;
  approved_by?: ReviewQueueUserRef | string | null;
  date_reviewed?: string | null;
  last_reviewed_at?: string | null;
  reviewer_note?: string | null;
  price?: string | number | null;
  channels?: string[] | null;
  channel_summary?: string | null;
  source_label?: string | null;
  source?: string | null;
  date_created?: string | null;
  created_datetime?: string | null;
  submitted_at?: string | null;
  date_approved?: string | null;
}

export interface ReviewQueuePaginator {
  count: number;
  page: number;
  page_size: number;
  total_pages: number;
  next_page_number: number | null;
  next: string | null;
  previous: string | null;
  previous_page_number: number | null;
}

export interface ReviewQueueListResponse {
  status: boolean;
  message: string;
  data: {
    paginator: ReviewQueuePaginator;
    results: ReviewQueueApiItem[];
  };
}

/**
 * Filters accepted by the four sidebar tables. Not every table accepts every
 * filter — see ReviewQueueListParams per screen in reviewQueueApi.
 */
export interface ReviewQueueListParams {
  search?: string;
  category?: string;
  difficulty_level?: string;
  source_type?: string;
  reviewer?: string;
  approved_by?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  size?: number;
}

export const EMPTY_FIELD = "—";

export function formatDifficulty(diff?: string | null): string {
  if (!diff) return EMPTY_FIELD;
  const lower = diff.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

export function formatDisplayDate(dateStr?: string | null): string {
  if (!dateStr) return EMPTY_FIELD;
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return format(d, "dd MMM yyyy, hh:mma");
  } catch {
    return dateStr;
  }
}

/** Resolves a user-shaped field, which the API may return as an object or a plain string. */
function resolveUserName(user?: ReviewQueueUserRef | string | null): string {
  if (!user) return EMPTY_FIELD;
  if (typeof user === "string") return user.trim() || EMPTY_FIELD;

  const fullName = `${user.first_name || ""} ${user.last_name || ""}`.trim();
  return fullName || user.name || user.email || EMPTY_FIELD;
}

/** Shortens a UUID to the `SLD-xxxxxx...` form the designs use. */
export function formatCourseId(id?: string | null): string {
  if (!id) return EMPTY_FIELD;
  return id.length > 14 ? `SLD-${id.slice(0, 6)}...` : id;
}

export function formatPrice(price?: string | number | null): string {
  if (price == null || price === "") return EMPTY_FIELD;
  const num = Number(price);
  if (isNaN(num)) return String(price);
  return `$${num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function mapToReviewQueueRow(item: ReviewQueueApiItem): ReviewQueueRow {
  const channels = Array.isArray(item.channels) ? item.channels : [];

  return {
    id: item.id,
    creator: resolveUserName(item.creator),
    courseTitle: item.course_title || item.title || "Untitled Course",
    courseId: formatCourseId(item.course_id || item.id),
    category:
      typeof item.category === "object" && item.category !== null
        ? item.category.name
        : item.category || "General",
    difficultyLevel: formatDifficulty(item.difficulty_level),
    reviewer: resolveUserName(item.reviewer),
    reviewerId: item.reviewer_id ?? (typeof item.reviewer === "object" ? item.reviewer?.id ?? null : null),
    approvedBy: resolveUserName(item.approved_by) === EMPTY_FIELD ? "Pending assignment" : resolveUserName(item.approved_by),
    dateReviewed: formatDisplayDate(item.date_reviewed ?? item.date_approved ?? item.submitted_at),
    lastReviewedAt: formatDisplayDate(item.last_reviewed_at),
    reviewerNote: item.reviewer_note || EMPTY_FIELD,
    price: formatPrice(item.price),
    channels,
    channelSummary: item.channel_summary || (channels.length ? channels.join(", ") : EMPTY_FIELD),
    sourceLabel: item.source_label || item.source || EMPTY_FIELD,
    dateCreated: formatDisplayDate(item.date_created ?? item.created_datetime),
    raw: item,
  };
}

export function mapToReviewQueueRows(items: ReviewQueueApiItem[] | undefined): ReviewQueueRow[] {
  return (items ?? []).map(mapToReviewQueueRow);
}
