export enum CategoryStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export enum TrackPreference {
  CREATOR_PREFERRED = "CREATOR_PREFERRED",
  AI_PREFERRED = "AI_PREFERRED",
  OPEN = "OPEN",
}

export interface Category {
  id: string;
  name: string;
  description: string;
  creator_price: string;
  track_preference: TrackPreference;
  status: CategoryStatus;
  created_datetime: string;
  updated_datetime: string;
}

export interface CategoryListParams {
  status?: CategoryStatus;
  track_preference?: TrackPreference;
  ordering?: string;
  page?: number;
  size?: number;
}
