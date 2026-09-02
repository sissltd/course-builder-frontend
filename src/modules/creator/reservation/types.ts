import type { PaginatedPaginator } from "../courses/types";

export enum TopicReservationStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export interface TopicReservationCategory {
  id: string;
  name: string;
}

export interface TopicReservation {
  id: string;
  name: string;
  category: TopicReservationCategory;
  topic: string | null;
  status: TopicReservationStatus;
  rejection_reason: string | null;
  reviewed_at: string | null;
  created_datetime: string;
}

export interface TopicReservationListParams {
  ordering?: string;
  page?: number;
  size?: number;
}

export interface CreateTopicReservationRequest {
  name: string;
  category: string;
}

export interface TopicReservationListResponse {
  status: boolean;
  message: string;
  data: {
    paginator: PaginatedPaginator;
    results: TopicReservation[];
  };
}
