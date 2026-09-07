import { BaseAPI } from "@/redux/baseApi";

export type KycDocumentType =
  | "NATIONAL_ID"
  | "DRIVERS_LICENSE"
  | "INTERNATIONAL_PASSPORT"
  | "VOTERS_ID";

export type KycStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface KycUserData {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  sex: string;
}

export interface KycSubmission {
  id: string;
  country_of_issue: string;
  document_type: KycDocumentType;
  status: KycStatus;
  rejection_reason: string | null;
  created_datetime: string;
  reviewed_at: string | null;
  first_name: string;
  last_name: string;
  kyc_user_data: KycUserData | null;
  kyc_request_status: string | null;
  kyc_response_summary: string | null;
}

export interface SubmitKycPayload {
  first_name: string;
  last_name: string;
  address: string;
  country_of_issue: string;
  document_type: KycDocumentType;
  id_number: string;
  date_of_birth: string;
}

export const DOCUMENT_TYPE_MAP: Record<string, KycDocumentType> = {
  "National ID (NIN)": "NATIONAL_ID",
  "Driver's License": "DRIVERS_LICENSE",
  "International passport": "INTERNATIONAL_PASSPORT",
  "Voter's ID": "VOTERS_ID",
};

export const kycApi = BaseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getMyKyc: builder.query<KycSubmission | null, void>({
      query: () => ({
        url: "/users/me/kyc/",
        method: "GET",
      }),
      providesTags: ["KycSubmission" as const],
    }),

    submitKyc: builder.mutation<KycSubmission, SubmitKycPayload>({
      query: (body) => ({
        url: "/users/me/kyc/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["KycSubmission" as const],
    }),
  }),
});

export const { useGetMyKycQuery, useSubmitKycMutation } = kycApi;
