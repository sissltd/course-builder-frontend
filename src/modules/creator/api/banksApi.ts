import { BaseAPI } from "@/redux/baseApi";

export interface Bank {
  name: string;
  code: string;
}

export interface VerifyAccountRequest {
  bank_code: string;
  account_number: string;
}

export interface VerifyAccountResponse {
  account_name: string;
  account_number: string;
  bank_code: string;
}

export const banksApi = BaseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getBanks: builder.query<Bank[], void>({
      query: () => ({
        url: "/banks/",
        method: "GET",
      }),
      transformResponse: (response: { success: boolean; status: number; message: string; data: Bank[] }) =>
        response.data,
    }),

    verifyBankAccount: builder.mutation<VerifyAccountResponse, VerifyAccountRequest>({
      query: (body) => ({
        url: "/payout-accounts/verify/",
        method: "POST",
        body,
      }),
      transformResponse: (response: { success: boolean; status: number; message: string; data: VerifyAccountResponse }) =>
        response.data,
    }),
  }),
});

export const { useGetBanksQuery, useVerifyBankAccountMutation } = banksApi;
