import { BaseAPI } from "@/redux/baseApi";
import type { PresignRequest, PresignResponse } from "@/lib/api/types";

export const uploadsApi = BaseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getPresignedUrl: builder.mutation<PresignResponse, PresignRequest>({
      query: (body) => ({
        url: "/uploads/presign/",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useGetPresignedUrlMutation } = uploadsApi;
