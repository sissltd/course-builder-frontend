import { BaseAPI } from "@/redux/baseApi";
import type { PaginatedResponse } from "../types";
import type {
  Quiz,
  CreateQuizRequest,
  UpdateQuizRequest,
  QuizListParams,
} from "../types/quiz";

export const quizzesApi = BaseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getQuizzes: builder.query<
      PaginatedResponse<Quiz[]>,
      QuizListParams | void
    >({
      query: (params) => ({
        url: "/quizzes/",
        method: "GET",
        params: params || {},
      }),
      transformResponse: (response: {
        status: boolean;
        message: string;
        data: {
          paginator: PaginatedResponse<Quiz[]>["data"]["paginator"];
          results: Quiz[][];
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
                type: "Quiz" as const,
                id: q.id,
              })),
              { type: "Quiz", id: "LIST" },
            ]
          : [{ type: "Quiz", id: "LIST" }],
    }),

    getQuiz: builder.query<Quiz, string>({
      query: (quizId) => ({
        url: `/quizzes/${quizId}/`,
        method: "GET",
      }),
      providesTags: (_result, _error, quizId) => [
        { type: "Quiz", id: quizId },
      ],
    }),

    createQuiz: builder.mutation<Quiz, CreateQuizRequest>({
      query: (body) => ({
        url: "/quizzes/",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Quiz", id: "LIST" }],
    }),

    replaceQuiz: builder.mutation<
      Quiz,
      { quizId: string; body: CreateQuizRequest }
    >({
      query: ({ quizId, body }) => ({
        url: `/quizzes/${quizId}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { quizId }) => [
        { type: "Quiz", id: quizId },
        { type: "Quiz", id: "LIST" },
      ],
    }),

    updateQuiz: builder.mutation<
      Quiz,
      { quizId: string; body: UpdateQuizRequest }
    >({
      query: ({ quizId, body }) => ({
        url: `/quizzes/${quizId}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { quizId }) => [
        { type: "Quiz", id: quizId },
        { type: "Quiz", id: "LIST" },
      ],
    }),

    deleteQuiz: builder.mutation<void, string>({
      query: (quizId) => ({
        url: `/quizzes/${quizId}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, quizId) => [
        { type: "Quiz", id: quizId },
        { type: "Quiz", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetQuizzesQuery,
  useGetQuizQuery,
  useCreateQuizMutation,
  useReplaceQuizMutation,
  useUpdateQuizMutation,
  useDeleteQuizMutation,
} = quizzesApi;
