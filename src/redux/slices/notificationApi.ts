import { BaseAPI } from "../baseApi";

export interface NotificationMetadata {
  course_id?: string;
  action?: string;
  [key: string]: unknown;
}

export interface NotificationItem {
  id: string;
  title: string;
  content: string;
  content_type: string;
  is_read: boolean;
  created_datetime: string;
  metadata: NotificationMetadata;
}

export interface NotificationListParams {
  cursor?: string;
  is_read?: boolean;
  size?: number;
}

export interface NotificationListResponse {
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

export interface ToggleNotificationReadRequest {
  notification_id: string;
  read_status: boolean;
}

export interface ToggleNotificationReadResponse {
  status: number;
  success: boolean;
  message: string;
}

export const notificationApi = BaseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<
      NotificationListResponse,
      NotificationListParams | void
    >({
      query: (params) => ({
        url: "/users/me/notifications/",
        method: "GET",
        params: params
          ? {
              cursor: params.cursor,
              is_read: params.is_read,
              size: params.size,
            }
          : undefined,
      }),
      providesTags: ["Notification"],
    }),

    toggleNotificationRead: builder.mutation<
      ToggleNotificationReadResponse,
      ToggleNotificationReadRequest
    >({
      query: (body) => ({
        url: "/users/me/notifications/toggle-read/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Notification"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useToggleNotificationReadMutation,
} = notificationApi;
