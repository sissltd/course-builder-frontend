import { BaseAPI } from "@/redux/baseApi";
import type {
  GenerationJob,
  CreateGenerationRequest,
} from "../types/aiGeneration";

export const aiGenerationApi = BaseAPI.injectEndpoints({
  endpoints: (builder) => ({
    createGeneration: builder.mutation<GenerationJob, CreateGenerationRequest>({
      query: (body) => ({
        url: "/course-ai-generations/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["GenerationJob"],
    }),

    getGenerationJob: builder.query<GenerationJob, string>({
      query: (jobId) => ({
        url: `/course-ai-generations/${jobId}/`,
        method: "GET",
      }),
      providesTags: (_result, _error, jobId) => [
        { type: "GenerationJob", id: jobId },
      ],
    }),

    cancelGeneration: builder.mutation<GenerationJob, string>({
      query: (jobId) => ({
        url: `/course-ai-generations/${jobId}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, jobId) => [
        { type: "GenerationJob", id: jobId },
      ],
    }),
  }),
});

export const {
  useCreateGenerationMutation,
  useGetGenerationJobQuery,
  useCancelGenerationMutation,
} = aiGenerationApi;
