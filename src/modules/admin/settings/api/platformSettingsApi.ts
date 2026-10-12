import { BaseAPI } from "@/redux/baseApi";

export type PaymentProcessor = "PAYSTACK" | "FLUTTERWAVE";

export interface PlatformSettings {
  topic_reservation_expiry_days: number;
  sla_amber_threshold_hours: number;
  sla_red_threshold_hours: number;
  draft_minimum_hold_hours: number;
  auto_flag_after_hours: number;
  payment_processor: PaymentProcessor;
  auto_credit_duration_hours: number;
  withdrawal_require_verification: boolean;
}

export type UpdatePlatformSettingsRequest = Partial<PlatformSettings>;

export const platformSettingsApi = BaseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getPlatformSettings: builder.query<PlatformSettings, void>({
      query: () => ({
        url: "/platform-settings/",
        method: "GET",
      }),
      providesTags: ["PlatformSettings"],
    }),
    updatePlatformSettings: builder.mutation<
      PlatformSettings,
      UpdatePlatformSettingsRequest
    >({
      query: (body) => ({
        url: "/platform-settings/",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["PlatformSettings"],
    }),
  }),
});

export const {
  useGetPlatformSettingsQuery,
  useUpdatePlatformSettingsMutation,
} = platformSettingsApi;
