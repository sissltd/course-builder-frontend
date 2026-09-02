import { BaseAPI } from "@/redux/baseApi";
import type {
  NotificationPreferences,
  UpdateNotificationPreferencesRequest,
} from "@/modules/auth/types/auth";

export const notificationPreferencesApi = BaseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getNotificationPreferences: builder.query<NotificationPreferences, void>({
      query: () => ({
        url: "/users/me/notification-preferences/",
        method: "GET",
      }),
      providesTags: ["NotificationPreferences"],
    }),

    updateNotificationPreferences: builder.mutation<
      NotificationPreferences,
      UpdateNotificationPreferencesRequest
    >({
      query: (body) => ({
        url: "/users/me/notification-preferences/",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["NotificationPreferences"],
    }),
  }),
});

export const {
  useGetNotificationPreferencesQuery,
  useUpdateNotificationPreferencesMutation,
} = notificationPreferencesApi;
