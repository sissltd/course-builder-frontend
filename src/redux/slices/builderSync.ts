import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState, AppDispatch } from "@/redux";
import {
  setCourseId,
  setCourseInformation,
  setModules,
  setIsLoading,
  setIsSaving,
  markSaved,
  replaceModuleId,
  replaceLessonId,
  type Lesson,
} from "./courseBuilderSlice";
import {
  apiCourseToReduxModules,
  apiCourseToCourseInfo,
  reduxLessonToApiPayload,
  reduxQuizQuestionsToAssessment,
} from "@/modules/builder/utils/transformers";
import type { CreateModuleRequest, UpdateModuleRequest } from "@/modules/creator/courses/types/module";
import type { CreateLessonRequest, UpdateLessonRequest, LessonContentType } from "@/modules/creator/courses/types/lesson";
import type { UpsertAssessmentRequest } from "@/modules/creator/courses/types/assessment";

const fetchJson = async (url: string, token: string, init?: RequestInit) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });

  if (res.status === 204) return null;
  const data = await res.json();
  if (!res.ok) {
    throw { status: res.status, data };
  }
  return data;
};

const getToken = (state: RootState): string => state.auth.accessToken || "";

export const loadCourse = createAsyncThunk<
  void,
  string,
  { state: RootState; dispatch: AppDispatch }
>("builderSync/loadCourse", async (courseId, { dispatch, getState }) => {
  dispatch(setIsLoading(true));
  try {
    const token = getToken(getState());
    const course = await fetchJson(`/courses/${courseId}/`, token);
    dispatch(setCourseId(courseId));
    const courseInfo = apiCourseToCourseInfo(course);
    dispatch(setCourseInformation(courseInfo));
    dispatch(setModules(apiCourseToReduxModules(course)));
  } finally {
    dispatch(setIsLoading(false));
  }
});

export const syncCreateModule = createAsyncThunk<
  { tempId: string; apiId: string } | null,
  void,
  { state: RootState; dispatch: AppDispatch }
>("builderSync/syncCreateModule", async (_, { dispatch, getState }) => {
  const state = getState();
  const courseId = state.courseBuilder.courseId;
  if (!courseId) return null;

  const modules = state.courseBuilder.modules;
  const newModule = modules[modules.length - 1];
  if (!newModule) return null;

  dispatch(setIsSaving(true));
  try {
    const token = getToken(state);
    const body: CreateModuleRequest = {
      title: newModule.title || "Untitled Module",
      order: modules.length,
    };
    const result = await fetchJson(`/courses/${courseId}/modules/`, token, {
      method: "POST",
      body: JSON.stringify(body),
    });
    dispatch(replaceModuleId({ oldId: newModule.id, newId: result.id }));
    dispatch(markSaved());
    return { tempId: newModule.id, apiId: result.id };
  } catch {
    dispatch(setIsSaving(false));
    return null;
  }
});

export const syncUpdateModule = createAsyncThunk<
  void,
  { moduleId: string; title: string; order: number; description?: string; learningObjectives?: string[] },
  { state: RootState; dispatch: AppDispatch }
>("builderSync/syncUpdateModule", async ({ moduleId, title, order, description, learningObjectives }, { dispatch, getState }) => {
  const state = getState();
  const courseId = state.courseBuilder.courseId;
  if (!courseId) return;

  dispatch(setIsSaving(true));
  try {
    const token = getToken(state);
    const body: UpdateModuleRequest = {
      title,
      order,
      description: description || "",
      learning_objectives: learningObjectives?.join(", ") || "",
    };
    await fetchJson(`/courses/${courseId}/modules/${moduleId}/`, token, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
    dispatch(markSaved());
  } catch {
    dispatch(setIsSaving(false));
  }
});

export const syncDeleteModule = createAsyncThunk<
  void,
  string,
  { state: RootState; dispatch: AppDispatch }
>("builderSync/syncDeleteModule", async (moduleId, { dispatch, getState }) => {
  const state = getState();
  const courseId = state.courseBuilder.courseId;
  if (!courseId) return;

  dispatch(setIsSaving(true));
  try {
    const token = getToken(state);
    await fetchJson(`/courses/${courseId}/modules/${moduleId}/`, token, {
      method: "DELETE",
    });
    dispatch(markSaved());
  } catch {
    dispatch(setIsSaving(false));
  }
});

export const syncCreateLesson = createAsyncThunk<
  { moduleId: string; tempId: string; apiId: string } | null,
  { moduleId: string; type: "video" | "quiz" | "text" },
  { state: RootState; dispatch: AppDispatch }
>("builderSync/syncCreateLesson", async ({ moduleId, type }, { dispatch, getState }) => {
  const state = getState();
  const courseId = state.courseBuilder.courseId;
  if (!courseId) return null;

  const mod = state.courseBuilder.modules.find((m) => m.id === moduleId);
  if (!mod) return null;
  const newLesson = mod.lessons[mod.lessons.length - 1];
  if (!newLesson) return null;

  dispatch(setIsSaving(true));
  try {
    const token = getToken(state);
    const contentTypeMap: Record<string, LessonContentType> = {
      video: "VIDEO" as LessonContentType,
      text: "TEXT" as LessonContentType,
      quiz: "QUIZ" as LessonContentType,
    };
    const body = {
      title: newLesson.title || "Untitled Lesson",
      order: mod.lessons.length,
      content_type: contentTypeMap[type],
    } satisfies CreateLessonRequest;
    const result = await fetchJson(
      `/courses/${courseId}/modules/${moduleId}/lessons/`,
      token,
      {
        method: "POST",
        body: JSON.stringify(body),
      },
    );
    dispatch(replaceLessonId({ moduleId, oldLessonId: newLesson.id, newLessonId: result.id }));
    dispatch(markSaved());
    return { moduleId, tempId: newLesson.id, apiId: result.id };
  } catch {
    dispatch(setIsSaving(false));
    return null;
  }
});

export const syncUpdateLesson = createAsyncThunk<
  void,
  { moduleId: string; lessonId: string; lesson: Lesson },
  { state: RootState; dispatch: AppDispatch }
>("builderSync/syncUpdateLesson", async ({ moduleId, lessonId, lesson }, { dispatch, getState }) => {
  const state = getState();
  const courseId = state.courseBuilder.courseId;
  if (!courseId) return;

  dispatch(setIsSaving(true));
  try {
    const token = getToken(state);
    const body: UpdateLessonRequest = reduxLessonToApiPayload(lesson) as UpdateLessonRequest;
    await fetchJson(
      `/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/`,
      token,
      {
        method: "PATCH",
        body: JSON.stringify(body),
      },
    );
    dispatch(markSaved());
  } catch {
    dispatch(setIsSaving(false));
  }
});

export const syncDeleteLesson = createAsyncThunk<
  void,
  { moduleId: string; lessonId: string },
  { state: RootState; dispatch: AppDispatch }
>("builderSync/syncDeleteLesson", async ({ moduleId, lessonId }, { dispatch, getState }) => {
  const state = getState();
  const courseId = state.courseBuilder.courseId;
  if (!courseId) return;

  dispatch(setIsSaving(true));
  try {
    const token = getToken(state);
    await fetchJson(
      `/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/`,
      token,
      { method: "DELETE" },
    );
    dispatch(markSaved());
  } catch {
    dispatch(setIsSaving(false));
  }
});

export const syncSaveModuleAssessment = createAsyncThunk<
  void,
  { moduleId: string; moduleTitle: string },
  { state: RootState; dispatch: AppDispatch }
>("builderSync/syncSaveModuleAssessment", async ({ moduleId, moduleTitle }, { dispatch, getState }) => {
  const state = getState();
  const courseId = state.courseBuilder.courseId;
  if (!courseId) return;

  const mod = state.courseBuilder.modules.find((m) => m.id === moduleId);
  if (!mod) return;

  dispatch(setIsSaving(true));
  try {
    const token = getToken(state);
    const payload: UpsertAssessmentRequest = reduxQuizQuestionsToAssessment(
      mod.quizQuestions.map((q, qi) => ({
        question: q.question,
        type: "single" as const,
        points: 0,
        options: q.options.map((opt, oi) => ({
          id: `${qi}-${String.fromCharCode(97 + oi)}`,
          label: String.fromCharCode(65 + oi),
          value: opt,
        })),
        correctOptionId: q.correctAnswer
          ? `${qi}-${String.fromCharCode(97 + q.options.indexOf(q.correctAnswer))}`
          : undefined,
      })),
      `${moduleTitle} Quiz`,
    );
    await fetchJson(`/courses/${courseId}/modules/${moduleId}/assessment/`, token, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    dispatch(markSaved());
  } catch {
    dispatch(setIsSaving(false));
  }
});

export const syncSaveLessonAssessment = createAsyncThunk<
  void,
  { moduleId: string; lessonId: string; lessonTitle: string },
  { state: RootState; dispatch: AppDispatch }
>("builderSync/syncSaveLessonAssessment", async ({ moduleId, lessonId, lessonTitle }, { dispatch, getState }) => {
  const state = getState();
  const courseId = state.courseBuilder.courseId;
  if (!courseId) return;

  const mod = state.courseBuilder.modules.find((m) => m.id === moduleId);
  const lesson = mod?.lessons.find((l) => l.id === lessonId);
  if (!lesson) return;

  dispatch(setIsSaving(true));
  try {
    const token = getToken(state);
    const payload: UpsertAssessmentRequest = reduxQuizQuestionsToAssessment(
      lesson.quizQuestions || [],
      `${lessonTitle} Quiz`,
    );
    await fetchJson(
      `/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/assessment/`,
      token,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      },
    );
    dispatch(markSaved());
  } catch {
    dispatch(setIsSaving(false));
  }
});

export const syncUpdateCourseInfo = createAsyncThunk<
  void,
  void,
  { state: RootState; dispatch: AppDispatch }
>("builderSync/syncUpdateCourseInfo", async (_, { dispatch, getState }) => {
  const state = getState();
  const courseId = state.courseBuilder.courseId;
  if (!courseId) return;

  const info = state.courseBuilder.courseInformation;
  dispatch(setIsSaving(true));
  try {
    const token = getToken(state);
    const body = {
      title: info.courseTitle,
      description: info.description,
      category: info.category,
      topic: info.topic || null,
      difficulty_level: info.difficulty ? info.difficulty.toUpperCase() : "",
      learning_objectives: info.objectives,
      tags: info.tags,
      duration_hours: info.hours,
      duration_minutes: info.minutes,
      duration_seconds: info.seconds,
    };
    await fetchJson(`/courses/${courseId}/`, token, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
    dispatch(markSaved());
  } catch {
    dispatch(setIsSaving(false));
  }
});

export const syncSetThumbnail = createAsyncThunk<
  void,
  { source: string; externalUrl?: string; file?: string },
  { state: RootState; dispatch: AppDispatch }
>("builderSync/syncSetThumbnail", async ({ source, externalUrl, file }, { dispatch, getState }) => {
  const state = getState();
  const courseId = state.courseBuilder.courseId;
  if (!courseId) return;

  dispatch(setIsSaving(true));
  try {
    const token = getToken(state);
    const body: Record<string, unknown> = {
      media_type: "IMAGE",
      source,
    };
    if (externalUrl) body.external_url = externalUrl;
    if (file) body.file = file;
    await fetchJson(`/courses/${courseId}/thumbnail/`, token, {
      method: "POST",
      body: JSON.stringify(body),
    });
    dispatch(markSaved());
  } catch {
    dispatch(setIsSaving(false));
  }
});

export const syncSubmitCourse = createAsyncThunk<
  { success: boolean; errors?: unknown[] },
  void,
  { state: RootState; dispatch: AppDispatch }
>("builderSync/syncSubmitCourse", async (_, { dispatch, getState }) => {
  const state = getState();
  const courseId = state.courseBuilder.courseId;
  if (!courseId) return { success: false };

  dispatch(setIsSaving(true));
  try {
    const token = getToken(state);
    await fetchJson(`/courses/${courseId}/submit/`, token, {
      method: "POST",
    });
    dispatch(markSaved());
    return { success: true };
  } catch (err: unknown) {
    dispatch(setIsSaving(false));
    const error = err as { status?: number; data?: { errors?: unknown[] } };
    if (error.status === 400 && error.data?.errors) {
      return { success: false, errors: error.data.errors };
    }
    return { success: false };
  }
});

export const saveAllDirty = createAsyncThunk<
  void,
  void,
  { state: RootState; dispatch: AppDispatch }
>("builderSync/saveAllDirty", async (_, { dispatch, getState }) => {
  const state = getState();
  if (!state.courseBuilder.isDirty) return;

  dispatch(setIsSaving(true));
  try {
    const courseId = state.courseBuilder.courseId;
    if (courseId) {
      await dispatch(syncUpdateCourseInfo()).unwrap();
    }

    for (const mod of state.courseBuilder.modules) {
      if (mod.id && !/^\d+$/.test(mod.id)) {
        await dispatch(
          syncUpdateModule({
            moduleId: mod.id,
            title: mod.title,
            order: state.courseBuilder.modules.indexOf(mod) + 1,
            description: mod.description,
            learningObjectives: mod.objectives,
          }),
        ).unwrap();
      }

      for (const lesson of mod.lessons) {
        if (lesson.id && !/^\d+$/.test(lesson.id)) {
          await dispatch(
            syncUpdateLesson({ moduleId: mod.id, lessonId: lesson.id, lesson }),
          ).unwrap();
        }
      }
    }

    dispatch(markSaved());
  } catch {
    // errors handled inside individual thunks
  }
});
