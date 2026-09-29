import { BaseAPI } from "@/redux/baseApi";

export interface AchievementBadge {
  id: string;
  title: string;
  icon: string;
  color: string;
  criterion: string;
  criterion_label: string;
  required_count: number;
  auto_award: boolean;
  requirement_summary: string;
  holder_count: number;
  created_datetime: string;
  updated_datetime: string;
}

export interface BadgePaginator {
  count: number;
  page: number;
  page_size: number;
  total_pages: number;
  next: string | null;
  next_page_number: number | null;
  previous: string | null;
  previous_page_number: number | null;
}

export interface AchievementBadgeListResponse {
  status: boolean;
  message: string;
  data: {
    paginator: BadgePaginator;
    results: AchievementBadge[];
  };
}

export interface CreateAchievementBadgeRequest {
  title: string;
  icon: string;
  color: string;
  criterion?: "COURSES_CREATED";
  required_count: number;
  auto_award: boolean;
}

export type UpdateAchievementBadgeRequest = Partial<
  Omit<CreateAchievementBadgeRequest, "criterion">
>;

export interface PreviousAchievementBadge {
  id: string;
  title: string;
  icon: string;
  color: string;
  required_count: number;
}

export interface BadgeDeletionImpact {
  badge_id: string;
  holder_count: number;
  previous_badge: PreviousAchievementBadge | null;
}

export interface BadgeHolder {
  id: string;
  creator: {
    id: string;
    email: string;
    full_name: string;
    avatar_url: string | null;
  };
  source: string;
  awarded_by_email: string | null;
  awarded_at: string;
}

export interface BadgeHolderListResponse {
  status: boolean;
  message: string;
  data: {
    paginator: BadgePaginator;
    results: BadgeHolder[];
  };
}

interface DataResponse<T> {
  data: T;
}

export const achievementBadgesApi = BaseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getAchievementBadges: builder.query<
      AchievementBadgeListResponse,
      { page?: number; size?: number } | void
    >({
      query: (params) => ({
        url: "/admin/achievements/badges/",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: ["AchievementBadge"],
    }),
    getAchievementBadge: builder.query<AchievementBadge, string>({
      query: (id) => ({
        url: `/admin/achievements/badges/${id}/`,
        method: "GET",
      }),
      transformResponse: (response: DataResponse<AchievementBadge>) => response.data,
      providesTags: ["AchievementBadge"],
    }),
    createAchievementBadge: builder.mutation<
      AchievementBadge,
      CreateAchievementBadgeRequest
    >({
      query: (body) => ({
        url: "/admin/achievements/badges/",
        method: "POST",
        body,
      }),
      transformResponse: (response: DataResponse<AchievementBadge>) => response.data,
      invalidatesTags: ["AchievementBadge"],
    }),
    updateAchievementBadge: builder.mutation<
      AchievementBadge,
      { id: string; body: UpdateAchievementBadgeRequest }
    >({
      query: ({ id, body }) => ({
        url: `/admin/achievements/badges/${id}/`,
        method: "PATCH",
        body,
      }),
      transformResponse: (response: DataResponse<AchievementBadge>) => response.data,
      invalidatesTags: ["AchievementBadge"],
    }),
    getBadgeDeletionImpact: builder.query<BadgeDeletionImpact, string>({
      query: (id) => ({
        url: `/admin/achievements/badges/${id}/deletion-impact/`,
        method: "GET",
      }),
      transformResponse: (response: DataResponse<BadgeDeletionImpact>) => response.data,
      providesTags: ["AchievementBadge"],
    }),
    deleteAchievementBadge: builder.mutation<
      void,
      { id: string; moveToPrevious: boolean }
    >({
      query: ({ id, moveToPrevious }) => ({
        url: `/admin/achievements/badges/${id}/`,
        method: "DELETE",
        params: { move_to_previous: moveToPrevious },
      }),
      invalidatesTags: ["AchievementBadge"],
    }),
    getBadgeHolders: builder.query<
      BadgeHolderListResponse,
      { badgeId: string; page?: number; size?: number }
    >({
      query: ({ badgeId, ...params }) => ({
        url: `/admin/achievements/badges/${badgeId}/holders/`,
        method: "GET",
        params,
      }),
      providesTags: ["AchievementBadge"],
    }),
    awardAchievementBadge: builder.mutation<
      BadgeHolder,
      { badgeId: string; creatorId: string }
    >({
      query: ({ badgeId, creatorId }) => ({
        url: `/admin/achievements/badges/${badgeId}/holders/`,
        method: "POST",
        body: { creator_id: creatorId },
      }),
      transformResponse: (response: DataResponse<BadgeHolder>) => response.data,
      invalidatesTags: ["AchievementBadge"],
    }),
    revokeAchievementBadge: builder.mutation<
      void,
      { badgeId: string; creatorId: string }
    >({
      query: ({ badgeId, creatorId }) => ({
        url: `/admin/achievements/badges/${badgeId}/holders/${creatorId}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["AchievementBadge"],
    }),
  }),
});

export const {
  useGetAchievementBadgesQuery,
  useGetAchievementBadgeQuery,
  useCreateAchievementBadgeMutation,
  useUpdateAchievementBadgeMutation,
  useGetBadgeDeletionImpactQuery,
  useDeleteAchievementBadgeMutation,
  useGetBadgeHoldersQuery,
  useAwardAchievementBadgeMutation,
  useRevokeAchievementBadgeMutation,
} = achievementBadgesApi;
