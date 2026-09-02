import { BaseAPI } from "@/redux/baseApi";
import type {
  CourseInvite,
  CreateInviteRequest,
  CourseInvitesListParams,
  PaginatedResponse,
} from "../types";

export const courseInvitesApi = BaseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getCourseInvites: builder.query<
      PaginatedResponse<CourseInvite[]>,
      CourseInvitesListParams
    >({
      query: ({ course_id, ...params }) => ({
        url: "/course-invites/",
        method: "GET",
        params: { course_id, ...params },
      }),
      transformResponse: (response: {
        status: boolean;
        message: string;
        data: {
          paginator: PaginatedResponse<CourseInvite[]>["data"]["paginator"];
          results: CourseInvite[];
        };
      }) => ({
        ...response,
        data: {
          ...response.data,
          results: Array.isArray(response.data.results)
            ? response.data.results
            : [response.data.results],
        },
      }),
      providesTags: ["CollaboratorInvite"],
    }),

    getIncomingInvites: builder.query<
      PaginatedResponse<CourseInvite[]>,
      void
    >({
      query: () => ({
        url: "/course-invites/incoming/",
        method: "GET",
      }),
      transformResponse: (response: {
        status: boolean;
        message: string;
        data: {
          paginator: PaginatedResponse<CourseInvite[]>["data"]["paginator"];
          results: CourseInvite[];
        };
      }) => ({
        ...response,
        data: {
          ...response.data,
          results: Array.isArray(response.data.results)
            ? response.data.results
            : [response.data.results],
        },
      }),
      providesTags: ["CollaboratorInvite"],
    }),

    createInvite: builder.mutation<CourseInvite, CreateInviteRequest>({
      query: (body) => ({
        url: "/course-invites/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["CollaboratorInvite"],
    }),

    revokeInvite: builder.mutation<void, string>({
      query: (id) => ({
        url: `/course-invites/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["CollaboratorInvite"],
    }),

    acceptInvite: builder.mutation<void, string>({
      query: (id) => ({
        url: `/course-invites/${id}/accept/`,
        method: "POST",
      }),
      invalidatesTags: ["CollaboratorInvite"],
    }),

    declineInvite: builder.mutation<void, string>({
      query: (id) => ({
        url: `/course-invites/${id}/decline/`,
        method: "POST",
      }),
      invalidatesTags: ["CollaboratorInvite"],
    }),
  }),
});

export const {
  useGetCourseInvitesQuery,
  useGetIncomingInvitesQuery,
  useCreateInviteMutation,
  useRevokeInviteMutation,
  useAcceptInviteMutation,
  useDeclineInviteMutation,
} = courseInvitesApi;
