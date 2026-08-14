import type { PendingCourseRow } from "./types";

export const pendingCourses: PendingCourseRow[] = Array.from({ length: 12 }, () => ({
  creator: "Osaite Emmanuel",
  courseTitle: "Machine Learning and Design",
  courseId: "SLD-e4...3d5",
  category: "Software Engineering",
  difficultyLevel: "Intermediate",
  approvedBy: "Osaite Emmanuel",
  dateApproved: "15 May 2026, 03:40PM",
  dateCreated: "21 May 2026, 08:43PM",
}));
