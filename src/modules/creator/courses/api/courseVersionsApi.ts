import { BaseAPI } from "@/redux/baseApi";

export interface CourseVersion {
  id: string;
  label: string;
  is_active: boolean;
}

export const courseVersionsApi = BaseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getCourseVersions: builder.query<CourseVersion[], void>({
      query: () => ({
        url: "/course-versions/",
        method: "GET",
      }),
      transformResponse: (response: CourseVersion[]) => response,
    }),
  }),
});

export const { useGetCourseVersionsQuery } = courseVersionsApi;
