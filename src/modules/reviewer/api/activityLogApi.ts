import { BaseAPI } from "@/redux/baseApi";
import type { ActivityLogResponse } from "@/redux/slices/adminApi";
import type { ActivityCategory } from "@/lib/activityLog";

/**
 * `GET /users/me/activity-log/`.
 *
 * Self-scoped server-side — the doc is explicit that no parameter can widen it
 * to another account. Unlike the admin slice's `ActivityLogParams` there is
 * deliberately **no `user` filter** here: exposing one would advertise a
 * capability the endpoint does not have.
 */
export interface MyActivityLogParams {
  category?: ActivityCategory;
  /** `ActivityActionEnum` — ~50 values. Accepted, but no UI filter uses it yet. */
  action?: string;
  ordering?: string;
  page?: number;
  size?: number;
}

export const activityLogApi = BaseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getMyActivityLog: builder.query<
      ActivityLogResponse,
      MyActivityLogParams | void
    >({
      query: (params) => ({
        url: "/users/me/activity-log/",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: ["ActivityLog"],
    }),
  }),
});

export const { useGetMyActivityLogQuery } = activityLogApi;
