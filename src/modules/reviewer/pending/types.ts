import type { AdminCourseItem } from "@/redux/slices/adminApi";

export interface PendingCourseRow {
  id: string;
  creator: string;
  courseTitle: string;
  courseId: string;
  category: string;
  difficultyLevel: string;
  approvedBy: string;
  dateApproved: string;
  dateCreated: string;
  raw?: AdminCourseItem;
}

export interface ReviewerPendingFiltersState {
  search: string;
  category: string;
  difficulty: string;
  fromDate?: Date;
  toDate?: Date;
}
