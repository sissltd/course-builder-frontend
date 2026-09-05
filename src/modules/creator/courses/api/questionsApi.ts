import { BaseAPI } from "@/redux/baseApi";
import type { PaginatedResponse } from "../types";
import type {
  QuizQuestionItem,
  CreateQuestionRequest,
  UpdateQuestionRequest,
  QuestionListParams,
} from "../types/quiz";

export const questionsApi = BaseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getQuestions: builder.query<
      PaginatedResponse<QuizQuestionItem[]>,
      QuestionListParams | void
    >({
      query: (params) => ({
        url: "/questions/",
        method: "GET",
        params: params || {},
      }),
      transformResponse: (response: {
        status: boolean;
        message: string;
        data: {
          paginator: PaginatedResponse<QuizQuestionItem[]>["data"]["paginator"];
          results: QuizQuestionItem[][];
        };
      }) => ({
        ...response,
        data: {
          ...response.data,
          results: response.data.results.flat(),
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.results.map((q) => ({
                type: "QuizQuestion" as const,
                id: q.id || "unknown",
              })),
              { type: "QuizQuestion", id: "LIST" },
            ]
          : [{ type: "QuizQuestion", id: "LIST" }],
    }),

    getQuestion: builder.query<QuizQuestionItem, string>({
      query: (questionId) => ({
        url: `/questions/${questionId}/`,
        method: "GET",
      }),
      providesTags: (_result, _error, questionId) => [
        { type: "QuizQuestion", id: questionId },
      ],
    }),

    createQuestion: builder.mutation<
      QuizQuestionItem,
      CreateQuestionRequest
    >({
      query: (body) => ({
        url: "/questions/",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "QuizQuestion", id: "LIST" }],
    }),

    replaceQuestion: builder.mutation<
      QuizQuestionItem,
      { questionId: string; body: CreateQuestionRequest }
    >({
      query: ({ questionId, body }) => ({
        url: `/questions/${questionId}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { questionId }) => [
        { type: "QuizQuestion", id: questionId },
        { type: "QuizQuestion", id: "LIST" },
      ],
    }),

    updateQuestion: builder.mutation<
      QuizQuestionItem,
      { questionId: string; body: UpdateQuestionRequest }
    >({
      query: ({ questionId, body }) => ({
        url: `/questions/${questionId}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { questionId }) => [
        { type: "QuizQuestion", id: questionId },
        { type: "QuizQuestion", id: "LIST" },
      ],
    }),

    deleteQuestion: builder.mutation<void, string>({
      query: (questionId) => ({
        url: `/questions/${questionId}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, questionId) => [
        { type: "QuizQuestion", id: questionId },
        { type: "QuizQuestion", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetQuestionsQuery,
  useGetQuestionQuery,
  useCreateQuestionMutation,
  useReplaceQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
} = questionsApi;
