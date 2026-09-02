import { BaseAPI } from "@/redux/baseApi";
import type { PaginatedPaginator } from "../courses/types";

export enum TransactionType {
  CREDIT = "CREDIT",
  DEBIT = "DEBIT",
}

export enum TransactionStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export interface TransactionCourse {
  id: string;
  title: string;
}

export interface WalletTransaction {
  id: string;
  reference: string;
  course: TransactionCourse | null;
  amount: string;
  fee: string;
  type: TransactionType;
  status: TransactionStatus;
  description: string;
  recipient_account_name: string;
  recipient_account_number: string;
  recipient_provider_name: string;
  created_datetime: string;
}

export interface WalletTransactionListParams {
  type?: TransactionType;
  status?: TransactionStatus;
  start_date?: string;
  end_date?: string;
  ordering?: string;
  search?: string;
  page?: number;
  size?: number;
}

export interface WalletTransactionListResponse {
  status: boolean;
  message: string;
  data: {
    paginator: PaginatedPaginator;
    results: WalletTransaction[];
  };
}

interface RawWalletTransactionInnerResponse {
  success: boolean;
  status: number;
  message: string;
  data: WalletTransaction[];
}

interface RawWalletTransactionListResponse {
  status: boolean;
  message: string;
  data: {
    paginator: PaginatedPaginator;
    results: RawWalletTransactionInnerResponse[];
  };
}

export const transactionsApi = BaseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getWalletTransactions: builder.query<
      WalletTransactionListResponse,
      WalletTransactionListParams | void
    >({
      query: (params) => ({
        url: "/transactions/",
        method: "GET",
        params: params || {},
      }),
      transformResponse: (response: RawWalletTransactionListResponse) => ({
        ...response,
        data: {
          ...response.data,
          results: response.data.results.flatMap((r) => r.data),
        },
      }),
      providesTags: ["Transaction"],
    }),
  }),
});

export const { useGetWalletTransactionsQuery } = transactionsApi;
