export enum TopicStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface TopicCategory {
  id: string;
  name: string;
}

export interface Topic {
  id: string;
  category: TopicCategory;
  name: string;
  creator_price: string;
  status: TopicStatus;
  reserved_by: string | null;
  reserved_until: string | null;
  is_currently_reserved: boolean;
  created_datetime: string;
  updated_datetime: string;
}

export interface TopicListParams {
  category?: string;
  status?: TopicStatus;
  ordering?: string;
  page?: number;
  size?: number;
}

/**
 * `creator_price` is a decimal string, not a number — send `"180.00"`. It is the
 * price actually paid for a course submitted under this topic, and it overrides
 * the category's tiered price when set.
 */
export interface TopicWriteRequest {
  category: string;
  name: string;
  creator_price: string;
  status?: TopicStatus;
}

/**
 * Routine edits (repricing, opening/closing to submissions) use PATCH, which
 * only touches the keys supplied. PUT overwrites the whole object.
 */
export type UpdateTopicRequest = Partial<TopicWriteRequest>;

export const TOPIC_STATUS_LABELS: Record<TopicStatus, string> = {
  [TopicStatus.ACTIVE]: "Active",
  [TopicStatus.INACTIVE]: "Inactive",
};

export const TOPIC_STATUS_OPTIONS: Array<{
  value: TopicStatus;
  label: string;
}> = [
  { value: TopicStatus.ACTIVE, label: "Active" },
  { value: TopicStatus.INACTIVE, label: "Inactive" },
];
