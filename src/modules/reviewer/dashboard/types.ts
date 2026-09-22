export interface ReviewerQueueCounts {
  SUBMITTED: number;
  IN_REVIEW: number;
}

export interface ReviewerMyDecisions {
  approved: number;
  today: number;
}

export interface ReviewerOverviewResponse {
  queue: ReviewerQueueCounts;
  my_decisions: ReviewerMyDecisions;
  courses_reviewed: number;
  courses_in_queue: number;
  escalations_resolved: number;
}

export interface ReviewerActivityTotals {
  escalated: number;
  approved: number;
  rejected: number;
}

export interface ReviewerActivitySeriesItem {
  date: string;
  escalated: number;
  approved: number;
  rejected: number;
}

export interface ReviewerActivityOverviewResponse {
  period: string;
  start_date: string;
  end_date: string;
  totals: ReviewerActivityTotals;
  series: ReviewerActivitySeriesItem[];
}

export type ReviewerPeriod = "today" | "this_week" | "this_month" | "all_time";
