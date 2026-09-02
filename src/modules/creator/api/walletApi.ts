import { BaseAPI } from "@/redux/baseApi";

export interface Wallet {
  id: string;
  balance: string;
  currency: string;
  total_earned: string;
  pending_balance: string;
  updated_datetime: string;
}

export interface PayoutAccount {
  id: string;
  bank_name: string;
  account_name: string;
  account_number: string;
  bank_code: string;
  is_default: boolean;
}

export interface CreatePayoutAccountRequest {
  account_name: string;
  account_number: string;
  bank_code: string;
  account_type: string;
  is_default?: boolean;
}

export interface WithdrawalRequest {
  id: string;
  amount: string;
  payout_account: string;
}

export interface RequestWithdrawalPayload {
  amount: string;
  payout_account: string;
}

export interface ConfirmWithdrawalPayload {
  code: string;
}

export const walletApi = BaseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getWallet: builder.query<Wallet, void>({
      query: () => ({
        url: "/wallet/",
        method: "GET",
      }),
      providesTags: ["Wallet"],
    }),

    getPayoutAccounts: builder.query<PayoutAccount[], void>({
      query: () => ({
        url: "/payout-accounts/",
        method: "GET",
      }),
      transformResponse: (response: { success: boolean; status: number; message: string; data: PayoutAccount[] }) =>
        response.data,
      providesTags: ["PayoutAccount"],
    }),

    createPayoutAccount: builder.mutation<
      PayoutAccount,
      CreatePayoutAccountRequest
    >({
      query: (body) => ({
        url: "/payout-accounts/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["PayoutAccount"],
    }),

    deletePayoutAccount: builder.mutation<void, string>({
      query: (id) => ({
        url: `/payout-accounts/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["PayoutAccount"],
    }),

    setDefaultPayoutAccount: builder.mutation<void, string>({
      query: (id) => ({
        url: `/payout-accounts/${id}/default/`,
        method: "POST",
      }),
      invalidatesTags: ["PayoutAccount"],
    }),

    requestWithdrawal: builder.mutation<
      WithdrawalRequest,
      RequestWithdrawalPayload
    >({
      query: (body) => ({
        url: "/withdrawals/",
        method: "POST",
        body,
      }),
    }),

    confirmWithdrawal: builder.mutation<
      ConfirmWithdrawalPayload,
      { withdrawalRequestId: string; body: ConfirmWithdrawalPayload }
    >({
      query: ({ withdrawalRequestId, body }) => ({
        url: `/withdrawals/${withdrawalRequestId}/confirm/`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Wallet", "Transaction"],
    }),
  }),
});

export const {
  useGetWalletQuery,
  useGetPayoutAccountsQuery,
  useCreatePayoutAccountMutation,
  useDeletePayoutAccountMutation,
  useSetDefaultPayoutAccountMutation,
  useRequestWithdrawalMutation,
  useConfirmWithdrawalMutation,
} = walletApi;
