export {
  useGetCoursesQuery,
  useGetCourseQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useReplaceCourseMutation,
  useDeleteCourseMutation,
  useSubmitCourseMutation,
  useGetCourseThumbnailQuery,
  useSetCourseThumbnailMutation,
  useGetMediaAssetsQuery,
  useRegisterMediaAssetMutation,
} from "../api/coursesApi";

export {
  useGetCourseFinalAssessmentQuery,
  useUpsertCourseFinalAssessmentMutation,
  useGetModuleAssessmentQuery,
  useUpsertModuleAssessmentMutation,
  useGetLessonAssessmentQuery,
  useUpsertLessonAssessmentMutation,
} from "../api/assessmentApi";

export {
  useGetModulesQuery,
  useGetModuleQuery,
  useCreateModuleMutation,
  useReplaceModuleMutation,
  useUpdateModuleMutation,
  useDeleteModuleMutation,
} from "../api/modulesApi";

export {
  useGetLessonsQuery,
  useGetLessonQuery,
  useCreateLessonMutation,
  useReplaceLessonMutation,
  useUpdateLessonMutation,
  useDeleteLessonMutation,
  useGetContentBlocksQuery,
  useCreateContentBlockMutation,
  useGetLessonImagesQuery,
  useCreateLessonImageMutation,
  useGetLessonRequirementsQuery,
  useCreateLessonRequirementMutation,
} from "../api/lessonsApi";

export {
  useGetCategoriesQuery,
  useGetCategoryQuery,
} from "../api/categoriesApi";

export {
  useGetTopicsQuery,
  useGetTopicQuery,
} from "../api/topicsApi";
