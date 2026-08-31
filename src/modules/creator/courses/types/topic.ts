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
