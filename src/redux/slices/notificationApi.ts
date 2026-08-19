import { BaseAPI } from "../baseApi";

export interface NotificationItem {
  id: string;
  title: string;
  content: string;
  content_type: string;
  is_read: boolean;
  created_datetime: string;
  metadata: Record<string, any>;
}

export interface NotificationResponse {
  status: boolean;
  message: string;
  data: {
    paginator: {
      next: string | null;
      previous: string | null;
    };
    results: NotificationItem[];
  };
}

export const notificationApi = BaseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<NotificationResponse, { cursor?: string; is_read?: boolean; size?: number } | void>({
      query: (params) => ({
        url: "/users/me/notifications/",
        method: "GET",
        params: params ? { cursor: params.cursor, is_read: params.is_read, size: params.size } : undefined,
      }),
      providesTags: ["Notifications"] as any,
    }),
  }),
});

export const { useGetNotificationsQuery } = notificationApi;
