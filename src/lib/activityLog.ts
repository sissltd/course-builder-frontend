import { format, isToday, isYesterday, parseISO } from "date-fns";
import type { ActivityLogItemApi } from "@/redux/slices/adminApi";

/**
 * The categories the API documents for `?category=`.
 *
 * The list and its labels are duplicated from the schema deliberately: labels
 * are ours, the members are the contract.
 */
export type ActivityCategory =
  | "ALERT"
  | "APPROVAL"
  | "AUTH"
  | "CONFIGURATION"
  | "COURSE"
  | "KYC"
  | "PAYMENTS"
  | "PRIVACY"
  | "PRODUCTION"
  | "PROFILE"
  | "PUBLISH"
  | "SUBMISSION"
  | "WALLET";

export const ACTIVITY_CATEGORY_LABELS: Record<ActivityCategory, string> = {
  ALERT: "Alert",
  APPROVAL: "Approval",
  AUTH: "Auth",
  CONFIGURATION: "Configuration",
  COURSE: "Course",
  KYC: "KYC",
  PAYMENTS: "Payments",
  PRIVACY: "Privacy",
  PRODUCTION: "Production",
  PROFILE: "Profile",
  PUBLISH: "Publish",
  SUBMISSION: "Submission",
  WALLET: "Wallet",
};

export interface ActivityLogEntry {
  id: string;
  title: string;
  meta: string;
  category: string;
}

export interface ActivityLogGroup {
  label: string;
  items: ActivityLogEntry[];
}

/**
 * Buckets entries into Today / Yesterday / dated groups, in the order they
 * arrive — the endpoint is newest-first, so insertion order is already correct.
 *
 * Shared by the admin and reviewer activity-log screens, which read the same
 * serializer.
 */
export const groupActivityLogs = (
  results: ActivityLogItemApi[],
): ActivityLogGroup[] => {
  const groups: Record<string, ActivityLogEntry[]> = {};

  results.forEach((log) => {
    const date = parseISO(log.activity_datetime);
    let label = format(date, "MMM dd, yyyy");
    if (isToday(date)) label = "Today";
    else if (isYesterday(date)) label = "Yesterday";

    if (!groups[label]) groups[label] = [];

    const metaTime = isToday(date)
      ? `Today - ${format(date, "h:mm a")}`
      : format(date, "MMM dd, h:mm a");
    const actorName = log.actor
      ? `${log.actor.first_name ?? ""} ${log.actor.last_name ?? ""}`.trim()
      : "";

    groups[label].push({
      id: log.id,
      // `summary` is the human sentence; fall back to the raw codes rather than
      // rendering an empty heading.
      title: log.summary || `${log.action} (${log.category})`,
      meta: actorName ? `By ${actorName} - ${metaTime}` : metaTime,
      category: log.category,
    });
  });

  return Object.entries(groups).map(([label, items]) => ({ label, items }));
};
