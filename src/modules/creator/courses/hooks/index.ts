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
  useGetCoursePreviewQuery,
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
  useReorderModulesMutation,
  useLockModuleMutation,
  useUnlockModuleMutation,
  useHeartbeatModuleMutation,
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
  useReorderLessonsMutation,
  useBulkUpdateContentBlocksMutation,
} from "../api/lessonsApi";

export {
  useGetCategoriesQuery,
  useGetCategoryQuery,
} from "@/modules/categories/api/categoriesApi";

export {
  useGetCategoryPickerQuery,
  useGetCategoryPickerQuery as useGetCategoriesPickerQuery,
} from "@/modules/categories/api/categoryPickerApi";

export {
  useGetTopicsQuery,
  useGetTopicQuery,
} from "@/modules/topics/api/topicsApi";

export {
  useGetCourseVersionsQuery,
} from "../api/courseVersionsApi";

export {
  useGetCategoryRequestsQuery,
  useCreateCategoryRequestMutation,
} from "../api/categoryRequestsApi";

export {
  useCreateGenerationMutation,
  useGetGenerationJobQuery,
  useCancelGenerationMutation,
} from "../api/aiGenerationApi";

export {
  useCreateCourseFromImportMutation,
  useCreateModuleForImportMutation,
  useCreateLessonForImportMutation,
} from "../api/documentImportApi";
