import { BaseAPI } from "@/redux/baseApi";
import type {
  UserProfile,
  UpdateProfileRequest,
  OnboardingProfile,
  UpdateOnboardingRequest,
} from "@/modules/auth/types/auth";

export const profileApi = BaseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getMyProfile: builder.query<UserProfile, void>({
      query: () => ({
        url: "/users/me/",
        method: "GET",
      }),
      providesTags: ["UserProfile"],
    }),

    updateMyProfile: builder.mutation<UserProfile, UpdateProfileRequest>({
      query: (body) => ({
        url: "/users/me/",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["UserProfile"],
    }),

    getMyOnboarding: builder.query<OnboardingProfile, void>({
      query: () => ({
        url: "/users/me/onboarding/",
        method: "GET",
      }),
      providesTags: ["OnboardingProfile"],
    }),

    updateMyOnboarding: builder.mutation<
      OnboardingProfile,
      UpdateOnboardingRequest
    >({
      query: (body) => ({
        url: "/users/me/onboarding/",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["OnboardingProfile"],
    }),
  }),
});

export const {
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
  useGetMyOnboardingQuery,
  useUpdateMyOnboardingMutation,
} = profileApi;
