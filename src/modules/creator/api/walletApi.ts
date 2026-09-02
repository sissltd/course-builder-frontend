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
  provider: string;
  account_number: string;
  account_name: string;
  is_default: boolean;
  created_datetime: string;
}

export interface CreatePayoutAccountRequest {
  provider: string;
  account_number: string;
  account_name: string;
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
  useRequestWithdrawalMutation,
  useConfirmWithdrawalMutation,
} = walletApi;
