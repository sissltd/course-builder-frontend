import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "sonner";
import { formatApiErrors } from "@/lib/api/errors";
import type { RootState, AppDispatch } from "@/redux";
import {
  setCourseId,
  setCourseInformation,
  setModules,
  setFinalAssessment,
  setIsLoading,
  beginSave,
  endSave,
  markSaved,
  setFingerprint,
  setFingerprints,
  clearFingerprints,
  replaceModuleId,
  replaceLessonId,
  setQuizQuestionsForLesson,
  hydrateVersion,
  type Lesson,
} from "./courseBuilderSlice";
import { uploadFile } from "@/lib/uploads";
import {
  apiCourseToReduxModules,
  apiCourseToCourseInfo,
  reduxLessonToApiPayload,
  reduxQuizQuestionsToAssessment,
  apiRelationalQuestionsToRedux,
  mapFinalAssessmentQuestions,
} from "@/modules/builder/utils/transformers";
import type { CreateModuleRequest, UpdateModuleRequest } from "@/modules/creator/courses/types/module";
import type { CreateLessonRequest, UpdateLessonRequest, LessonContentType } from "@/modules/creator/courses/types/lesson";
import type { UpsertAssessmentRequest, Assessment } from "@/modules/creator/courses/types/assessment";
import type { QuizQuestionItem } from "@/modules/creator/courses/types/quiz";
import type { ApiErrorItem } from "@/lib/api/types";

type ApiErrorPayload = {
  status?: number;
  errors?: { message?: string; field_name?: string | null }[];
};

const toRejectValue = (err: unknown): ApiErrorPayload => {
  const error = err as { status?: number; data?: { errors?: ApiErrorPayload["errors"] } };
  return { status: error?.status, errors: error?.data?.errors };
};

const firstErrorMessage = (payload: unknown, fallback: string): string =>
  formatApiErrors((payload as ApiErrorPayload)?.errors, fallback);

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

const stableStringify = (value: unknown): string => {
  const normalize = (input: unknown): unknown => {
    if (Array.isArray(input)) return input.map(normalize);
    if (input && typeof input === "object") {
      return Object.keys(input as Record<string, unknown>)
        .sort()
        .reduce<Record<string, unknown>>((acc, key) => {
          acc[key] = normalize((input as Record<string, unknown>)[key]);
          return acc;
        }, {});
    }
    return input;
  };
  return JSON.stringify(normalize(value));
};

const buildModuleBody = (
  title: string,
  order: number,
  description: string | undefined,
  learningObjectives: string[] | undefined,
): UpdateModuleRequest => ({
  title,
  order,
  description: description || "",
  learning_objectives: (learningObjectives || []).filter((o) => o.trim() !== ""),
});

const buildCourseInfoBody = (info: RootState["courseBuilder"]["courseInformation"], version?: string) => ({
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
  ...(version ? { version } : {}),
});

const extractCourseVersionId = (version: unknown): string => {
  if (typeof version === "string") return version;
  if (version && typeof version === "object" && "id" in version) {
    const id = (version as { id?: unknown }).id;
    return typeof id === "string" ? id : "";
  }
  return "";
};

const assessmentTitle = (title: string | undefined): string =>
  `${title || "Untitled"} Quiz`;

const courseFingerprint = (state: RootState): string =>
  stableStringify(buildCourseInfoBody(state.courseBuilder.courseInformation, state.courseBuilder.version));

const moduleFingerprint = (
  mod: RootState["courseBuilder"]["modules"][number],
  order: number,
): string =>
  stableStringify(
    buildModuleBody(mod.title, order, mod.description, mod.objectives),
  );

const moduleAssessmentFingerprint = (
  mod: RootState["courseBuilder"]["modules"][number],
): string =>
  stableStringify(
    reduxQuizQuestionsToAssessment(mod.quizQuestions || [], assessmentTitle(mod.title)),
  );

const lessonFingerprint = (lesson: Lesson): string =>
  stableStringify(reduxLessonToApiPayload(lesson));

const lessonAssessmentFingerprint = (
  lesson: Lesson,
  lessonTitle: string,
): string =>
  stableStringify(
    reduxQuizQuestionsToAssessment(lesson.quizQuestions || [], assessmentTitle(lessonTitle)),
  );

const courseAssessmentTitle = (courseTitle: string | undefined): string =>
  `${courseTitle || "Untitled"} Final Assessment`;

const courseAssessmentFingerprint = (
  state: RootState,
): string => {
  const finalAssessment = state.courseBuilder.finalAssessment;
  return stableStringify(
    reduxQuizQuestionsToAssessment(
      finalAssessment?.quizQuestions || [],
      finalAssessment?.title || courseAssessmentTitle(state.courseBuilder.courseInformation.courseTitle),
    ),
  );
};

interface LegacyQuizRow {
  id: string;
  lesson: string | null;
  module: string | null;
  questions?: QuizQuestionItem[];
}

const resolveLegacyQuizQuestions = async (
  token: string,
  quiz: LegacyQuizRow,
): Promise<QuizQuestionItem[]> => {
  const nested = Array.isArray(quiz.questions) ? quiz.questions : [];
  if (nested.length > 0) return nested;
  try {
    const res = await fetchJson(`/questions/?quiz=${quiz.id}&ordering=order`, token);
    const results = res.data?.results || res.results || [];
    return Array.isArray(results) ? results : [];
  } catch {
    return [];
  }
};

export const loadCourse = createAsyncThunk<
  void,
  string,
  { state: RootState; dispatch: AppDispatch }
>("builderSync/loadCourse", async (courseId, { dispatch, getState }) => {
  dispatch(setIsLoading(true));
  dispatch(clearFingerprints());
  try {
    const token = getToken(getState());
    const course = await fetchJson(`/courses/${courseId}/`, token);
    dispatch(setCourseId(courseId));
    dispatch(hydrateVersion(extractCourseVersionId(course.version)));
    dispatch(setCourseInformation(apiCourseToCourseInfo(course)));
    dispatch(setModules(apiCourseToReduxModules(course)));
    dispatch(
      setFinalAssessment({
        title:
          (course.final_assessment as { title?: string } | null)?.title ||
          courseAssessmentTitle(course.title),
        quizQuestions: mapFinalAssessmentQuestions(
          (course.final_assessment as Assessment | null) ?? null,
        ),
      }),
    );

    if (!course.final_assessment) {
      try {
        const finalAssessment = await fetchJson(
          `/courses/${courseId}/final-assessment/`,
          token,
        );
        dispatch(
          setFinalAssessment({
            title:
              (finalAssessment?.title as string | undefined) ||
              courseAssessmentTitle(course.title),
            quizQuestions: mapFinalAssessmentQuestions(
              (finalAssessment as Assessment | null) ?? null,
            ),
          }),
        );
      } catch {
        // No final assessment has been set yet.
      }
    }

    let legacyQuizzes: LegacyQuizRow[] = [];
    try {
      const quizRes = await fetchJson("/quizzes/?size=200", token);
      legacyQuizzes = quizRes.data?.results?.flat?.() || quizRes.data?.results || [];
      if (!Array.isArray(legacyQuizzes)) legacyQuizzes = [];
    } catch {
      legacyQuizzes = [];
    }

    if (legacyQuizzes.length > 0) {
      for (const mod of getState().courseBuilder.modules) {
        if ((mod.quizQuestions?.length || 0) === 0) {
          const moduleQuiz = legacyQuizzes.find((q) => q.module === mod.id && !q.lesson);
          if (moduleQuiz) {
            const legacyQuestions = await resolveLegacyQuizQuestions(token, moduleQuiz);
            if (legacyQuestions.length > 0) {
              const mapped = apiRelationalQuestionsToRedux(legacyQuestions);
              dispatch(
                setModules(
                  getState().courseBuilder.modules.map((m) =>
                    m.id === mod.id ? { ...m, quizQuestions: mapped } : m,
                  ),
                ),
              );
            }
          }
        }

        for (const lesson of mod.lessons) {
          if ((lesson.quizQuestions?.length || 0) > 0) continue;
          const matched = legacyQuizzes.find(
            (q) => q.lesson === lesson.id && q.module === mod.id,
          );
          if (!matched) continue;
          const legacyQuestions = await resolveLegacyQuizQuestions(token, matched);
          if (legacyQuestions.length === 0) continue;
          dispatch(
            setQuizQuestionsForLesson({
              moduleId: mod.id,
              lessonId: lesson.id,
              questions: apiRelationalQuestionsToRedux(legacyQuestions),
            }),
          );
        }
      }
    }

    const hydrated = getState().courseBuilder;
    const fingerprints: Record<string, string> = {
      course: courseFingerprint(getState()),
      courseAssessment: courseAssessmentFingerprint(getState()),
    };
    hydrated.modules.forEach((mod, index) => {
      fingerprints[`module:${mod.id}`] = moduleFingerprint(mod, index + 1);
      fingerprints[`moduleAssessment:${mod.id}`] = moduleAssessmentFingerprint(mod);
      mod.lessons.forEach((lesson) => {
        fingerprints[`lesson:${lesson.id}`] = lessonFingerprint(lesson);
        fingerprints[`lessonAssessment:${lesson.id}`] = lessonAssessmentFingerprint(
          lesson,
          lesson.title,
        );
      });
    });
    dispatch(setFingerprints(fingerprints));
  } finally {
    dispatch(setIsLoading(false));
  }
});

export const syncCreateModule = createAsyncThunk<
  { tempId: string; apiId: string } | null,
  { moduleId?: string },
  { state: RootState; dispatch: AppDispatch; rejectValue: ApiErrorPayload }
>("builderSync/syncCreateModule", async ({ moduleId }, { dispatch, getState, rejectWithValue }) => {
  const state = getState();
  const courseId = state.courseBuilder.courseId;
  if (!courseId) return null;

  const modules = state.courseBuilder.modules;
  const tempModules = modules.filter((m) => /^\d+$/.test(m.id));
  const newModule = moduleId
    ? modules.find((m) => m.id === moduleId)
    : tempModules[tempModules.length - 1];
  if (!newModule) return null;

  dispatch(beginSave());
  try {
    const token = getToken(state);
    const order = modules.indexOf(newModule) + 1;
    const body: CreateModuleRequest = {
      title: newModule.title || "Untitled Module",
      order,
      learning_objectives: (newModule.objectives || []).filter((o) => o.trim() !== ""),
    };
    const result = await fetchJson(`/courses/${courseId}/modules/`, token, {
      method: "POST",
      body: JSON.stringify(body),
    });
    dispatch(replaceModuleId({ oldId: newModule.id, newId: result.id }));
    dispatch(
      setFingerprint({
        key: `module:${result.id}`,
        value: moduleFingerprint({ ...newModule, id: result.id }, order),
      }),
    );
    return { tempId: newModule.id, apiId: result.id };
  } catch (err) {
    return rejectWithValue(toRejectValue(err));
  } finally {
    dispatch(endSave());
  }
});

export const syncUpdateModule = createAsyncThunk<
  void,
  { moduleId: string; title: string; order: number; description?: string; learningObjectives?: string[] },
  { state: RootState; dispatch: AppDispatch; rejectValue: ApiErrorPayload }
>("builderSync/syncUpdateModule", async ({ moduleId, title, order, description, learningObjectives }, { dispatch, getState, rejectWithValue }) => {
  const state = getState();
  const courseId = state.courseBuilder.courseId;
  if (!courseId) return;

  dispatch(beginSave());
  try {
    const token = getToken(state);
    const body = buildModuleBody(title, order, description, learningObjectives);
    await fetchJson(`/courses/${courseId}/modules/${moduleId}/`, token, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
    dispatch(setFingerprint({ key: `module:${moduleId}`, value: stableStringify(body) }));
  } catch (err) {
    return rejectWithValue(toRejectValue(err));
  } finally {
    dispatch(endSave());
  }
});

export const syncDeleteModule = createAsyncThunk<
  void,
  string,
  { state: RootState; dispatch: AppDispatch; rejectValue: ApiErrorPayload }
>("builderSync/syncDeleteModule", async (moduleId, { dispatch, getState, rejectWithValue }) => {
  const state = getState();
  const courseId = state.courseBuilder.courseId;
  if (!courseId) return;

  dispatch(beginSave());
  try {
    const token = getToken(state);
    await fetchJson(`/courses/${courseId}/modules/${moduleId}/`, token, {
      method: "DELETE",
    });
  } catch (err) {
    return rejectWithValue(toRejectValue(err));
  } finally {
    dispatch(endSave());
  }
});

export const syncCreateLesson = createAsyncThunk<
  { moduleId: string; tempId: string; apiId: string } | null,
  { moduleId: string; type: "video" | "text"; lessonId?: string },
  { state: RootState; dispatch: AppDispatch; rejectValue: ApiErrorPayload }
>("builderSync/syncCreateLesson", async ({ moduleId, type, lessonId }, { dispatch, getState, rejectWithValue }) => {
  const state = getState();
  const courseId = state.courseBuilder.courseId;
  if (!courseId) return null;

  const mod = state.courseBuilder.modules.find((m) => m.id === moduleId);
  if (!mod) return null;

  const tempLessons = mod.lessons.filter((l) => /^\d+$/.test(l.id));
  const newLesson = lessonId
    ? mod.lessons.find((l) => l.id === lessonId)
    : tempLessons[tempLessons.length - 1];
  if (!newLesson) return null;

  dispatch(beginSave());
  try {
    const token = getToken(state);
    const contentTypeMap: Record<string, LessonContentType> = {
      video: "VIDEO" as LessonContentType,
      text: "TEXT" as LessonContentType,
    };
    const body = {
      title: newLesson.title || "Untitled Lesson",
      order: mod.lessons.indexOf(newLesson) + 1,
      content_type: contentTypeMap[type],
      learning_objectives: newLesson.objectives || [],
      lesson_requirement: newLesson.requirements || "",
      ...(type === "video" ? { video_url: newLesson.videoUrl || "" } : {}),
      ...(newLesson.duration && newLesson.duration !== "0 mins"
        ? { duration_minutes: parseInt(newLesson.duration.match(/(\d+)/)?.[1] || "0", 10) }
        : {}),
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
    dispatch(
      setFingerprint({
        key: `lesson:${result.id}`,
        value: lessonFingerprint({ ...newLesson, id: result.id }),
      }),
    );
    return { moduleId, tempId: newLesson.id, apiId: result.id };
  } catch (err) {
    return rejectWithValue(toRejectValue(err));
  } finally {
    dispatch(endSave());
  }
});

export const syncUpdateLesson = createAsyncThunk<
  void,
  { moduleId: string; lessonId: string; lesson: Lesson },
  { state: RootState; dispatch: AppDispatch; rejectValue: ApiErrorPayload }
>("builderSync/syncUpdateLesson", async ({ moduleId, lessonId, lesson }, { dispatch, getState, rejectWithValue }) => {
  const state = getState();
  const courseId = state.courseBuilder.courseId;
  if (!courseId) return;

  dispatch(beginSave());
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
    dispatch(setFingerprint({ key: `lesson:${lessonId}`, value: lessonFingerprint(lesson) }));
  } catch (err) {
    return rejectWithValue(toRejectValue(err));
  } finally {
    dispatch(endSave());
  }
});

export const syncDeleteLesson = createAsyncThunk<
  void,
  { moduleId: string; lessonId: string },
  { state: RootState; dispatch: AppDispatch; rejectValue: ApiErrorPayload }
>("builderSync/syncDeleteLesson", async ({ moduleId, lessonId }, { dispatch, getState, rejectWithValue }) => {
  const state = getState();
  const courseId = state.courseBuilder.courseId;
  if (!courseId) return;

  dispatch(beginSave());
  try {
    const token = getToken(state);
    await fetchJson(
      `/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/`,
      token,
      { method: "DELETE" },
    );
  } catch (err) {
    return rejectWithValue(toRejectValue(err));
  } finally {
    dispatch(endSave());
  }
});

export const syncSaveModuleAssessment = createAsyncThunk<
  void,
  { moduleId: string; moduleTitle: string },
  { state: RootState; dispatch: AppDispatch; rejectValue: ApiErrorPayload }
>("builderSync/syncSaveModuleAssessment", async ({ moduleId, moduleTitle }, { dispatch, getState, rejectWithValue }) => {
  const state = getState();
  const courseId = state.courseBuilder.courseId;
  if (!courseId) return;

  const mod = state.courseBuilder.modules.find((m) => m.id === moduleId);
  if (!mod) return;

  dispatch(beginSave());
  try {
    const token = getToken(state);
    const payload: UpsertAssessmentRequest = reduxQuizQuestionsToAssessment(
      mod.quizQuestions || [],
      assessmentTitle(moduleTitle),
    );
    await fetchJson(`/courses/${courseId}/modules/${moduleId}/assessment/`, token, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    dispatch(
      setFingerprint({
        key: `moduleAssessment:${moduleId}`,
        value: moduleAssessmentFingerprint(mod),
      }),
    );
  } catch (err) {
    return rejectWithValue(toRejectValue(err));
  } finally {
    dispatch(endSave());
  }
});

export const syncSaveLessonAssessment = createAsyncThunk<
  void,
  { moduleId: string; lessonId: string; lessonTitle: string },
  { state: RootState; dispatch: AppDispatch; rejectValue: ApiErrorPayload }
>("builderSync/syncSaveLessonAssessment", async ({ moduleId, lessonId, lessonTitle }, { dispatch, getState, rejectWithValue }) => {
  const state = getState();
  const courseId = state.courseBuilder.courseId;
  if (!courseId) return;

  const mod = state.courseBuilder.modules.find((m) => m.id === moduleId);
  const lesson = mod?.lessons.find((l) => l.id === lessonId);
  if (!lesson) return;

  dispatch(beginSave());
  try {
    const token = getToken(state);
    const payload: UpsertAssessmentRequest = reduxQuizQuestionsToAssessment(
      lesson.quizQuestions || [],
      assessmentTitle(lessonTitle),
    );
    await fetchJson(
      `/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/assessment/`,
      token,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      },
    );
    dispatch(
      setFingerprint({
        key: `lessonAssessment:${lessonId}`,
        value: lessonAssessmentFingerprint(lesson, lessonTitle),
      }),
    );
  } catch (err) {
    return rejectWithValue(toRejectValue(err));
  } finally {
    dispatch(endSave());
  }
});

export const syncSaveCourseAssessment = createAsyncThunk<
  void,
  void,
  { state: RootState; dispatch: AppDispatch; rejectValue: ApiErrorPayload }
>("builderSync/syncSaveCourseAssessment", async (_, { dispatch, getState, rejectWithValue }) => {
  const state = getState();
  const courseId = state.courseBuilder.courseId;
  if (!courseId) return;

  const finalAssessment = state.courseBuilder.finalAssessment;
  dispatch(beginSave());
  try {
    const token = getToken(state);
    const payload: UpsertAssessmentRequest = reduxQuizQuestionsToAssessment(
      finalAssessment?.quizQuestions || [],
      finalAssessment?.title || courseAssessmentTitle(state.courseBuilder.courseInformation.courseTitle),
    );
    await fetchJson(`/courses/${courseId}/final-assessment/`, token, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    dispatch(
      setFingerprint({
        key: "courseAssessment",
        value: courseAssessmentFingerprint(getState()),
      }),
    );
  } catch (err) {
    return rejectWithValue(toRejectValue(err));
  } finally {
    dispatch(endSave());
  }
});

export const syncUpdateCourseInfo = createAsyncThunk<
  void,
  void,
  { state: RootState; dispatch: AppDispatch; rejectValue: ApiErrorPayload }
>("builderSync/syncUpdateCourseInfo", async (_, { dispatch, getState, rejectWithValue }) => {
  const state = getState();
  const courseId = state.courseBuilder.courseId;
  if (!courseId) return;

  dispatch(beginSave());
  try {
    const token = getToken(state);
    const body = buildCourseInfoBody(state.courseBuilder.courseInformation, state.courseBuilder.version);
    await fetchJson(`/courses/${courseId}/`, token, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
    dispatch(setFingerprint({ key: "course", value: courseFingerprint(getState()) }));
  } catch (err) {
    return rejectWithValue(toRejectValue(err));
  } finally {
    dispatch(endSave());
  }
});

export const syncSetThumbnail = createAsyncThunk<
  void,
  { source: string; externalUrl?: string; file?: string },
  { state: RootState; dispatch: AppDispatch; rejectValue: ApiErrorPayload }
>("builderSync/syncSetThumbnail", async ({ source, externalUrl, file }, { dispatch, getState, rejectWithValue }) => {
  const state = getState();
  const courseId = state.courseBuilder.courseId;
  if (!courseId) return;

  dispatch(beginSave());
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
  } catch (err) {
    return rejectWithValue(toRejectValue(err));
  } finally {
    dispatch(endSave());
  }
});

export const syncSetCoverVideo = createAsyncThunk<
  void,
  File,
  { state: RootState; dispatch: AppDispatch; rejectValue: ApiErrorPayload }
>("builderSync/syncSetCoverVideo", async (file, { dispatch, getState, rejectWithValue }) => {
  const state = getState();
  const courseId = state.courseBuilder.courseId;
  if (!courseId) return;

  dispatch(beginSave());
  try {
    const token = getToken(state);
    const presigned = await uploadFile(file, {}, token);
    await fetchJson(`/courses/${courseId}/`, token, {
      method: "PATCH",
      body: JSON.stringify({ preview_video_url: presigned.file_url }),
    });
  } catch (err) {
    return rejectWithValue(toRejectValue(err));
  } finally {
    dispatch(endSave());
  }
});

export const syncSubmitCourse = createAsyncThunk<
  { success: boolean; errors?: ApiErrorItem[] },
  void,
  { state: RootState; dispatch: AppDispatch }
>("builderSync/syncSubmitCourse", async (_, { dispatch, getState }) => {
  const state = getState();
  const courseId = state.courseBuilder.courseId;
  if (!courseId) return { success: false };

  if (state.courseBuilder.isDirty) {
    await dispatch(saveAllDirty());
  }

  dispatch(beginSave());
  try {
    const token = getToken(getState());
    await fetchJson(`/courses/${courseId}/submit/`, token, {
      method: "POST",
    });
    return { success: true };
  } catch (err: unknown) {
    const error = err as { status?: number; data?: { errors?: ApiErrorItem[] } };
    if (error.status === 400 && error.data?.errors) {
      return { success: false, errors: error.data.errors };
    }
    return { success: false };
  } finally {
    dispatch(endSave());
  }
});

export const saveAllDirty = createAsyncThunk<
  void,
  void,
  { state: RootState; dispatch: AppDispatch }
>("builderSync/saveAllDirty", async (_, { dispatch, getState }) => {
  const state = getState();
  if (!state.courseBuilder.isDirty) return;

  const courseId = state.courseBuilder.courseId;
  if (!courseId) return;

  dispatch(beginSave());
  let hadError = false;
  let reportedValidationError = false;

  const reportError = (err: unknown) => {
    hadError = true;
    const payload = err as ApiErrorPayload;
    if (payload?.status === 400 && !reportedValidationError) {
      reportedValidationError = true;
      toast.error(firstErrorMessage(payload, "Some changes could not be saved."));
    }
  };

  try {
    const saved = () => getState().courseBuilder.savedFingerprints || {};

    if (courseFingerprint(getState()) !== saved().course) {
      try {
        await dispatch(syncUpdateCourseInfo()).unwrap();
      } catch (err) {
        reportError(err);
      }
    }

    const courseAssessmentChanged =
      courseAssessmentFingerprint(getState()) !== saved().courseAssessment;
    const hasSavedCourseAssessment = saved().courseAssessment !== undefined;
    if (
      courseAssessmentChanged &&
      ((getState().courseBuilder.finalAssessment?.quizQuestions?.length || 0) > 0 ||
        hasSavedCourseAssessment)
    ) {
      try {
        await dispatch(syncSaveCourseAssessment()).unwrap();
      } catch (err) {
        reportError(err);
      }
    }

    const moduleSnapshots = getState().courseBuilder.modules;
    for (let index = 0; index < moduleSnapshots.length; index++) {
      const snapshot = moduleSnapshots[index];
      let moduleId = snapshot.id;
      const isTempModule = /^\d+$/.test(moduleId);

      if (isTempModule) {
        try {
          const created = await dispatch(syncCreateModule({ moduleId })).unwrap();
          if (!created) continue;
          moduleId = created.apiId;
        } catch (err) {
          reportError(err);
          continue;
        }
      } else {
        const fresh = getState().courseBuilder.modules.find((m) => m.id === moduleId);
        if (!fresh) continue;
        if (moduleFingerprint(fresh, index + 1) !== saved()[`module:${moduleId}`]) {
          try {
            await dispatch(
              syncUpdateModule({
                moduleId,
                title: fresh.title,
                order: index + 1,
                description: fresh.description,
                learningObjectives: fresh.objectives,
              }),
            ).unwrap();
          } catch (err) {
            reportError(err);
          }
        }
      }

      const mod = getState().courseBuilder.modules.find((m) => m.id === moduleId);
      if (!mod) continue;

      const moduleAssessmentKey = `moduleAssessment:${moduleId}`;
      const moduleAssessmentChanged =
        moduleAssessmentFingerprint(mod) !== saved()[moduleAssessmentKey];
      const hasSavedModuleAssessment = saved()[moduleAssessmentKey] !== undefined;
      if (
        moduleAssessmentChanged &&
        ((mod.quizQuestions?.length || 0) > 0 || hasSavedModuleAssessment)
      ) {
        try {
          await dispatch(
            syncSaveModuleAssessment({ moduleId, moduleTitle: mod.title }),
          ).unwrap();
        } catch (err) {
          reportError(err);
        }
      }

      const lessonSnapshots = mod.lessons;
      for (const lessonSnapshot of lessonSnapshots) {
        let lessonId = lessonSnapshot.id;
        const isTempLesson = /^\d+$/.test(lessonId);

        if (isTempLesson) {
          try {
            const created = await dispatch(
              syncCreateLesson({ moduleId, type: lessonSnapshot.type, lessonId }),
            ).unwrap();
            if (!created) continue;
            lessonId = created.apiId;
          } catch (err) {
            reportError(err);
            continue;
          }
        } else {
          const freshLesson = getState().courseBuilder.modules
            .find((m) => m.id === moduleId)
            ?.lessons.find((l) => l.id === lessonId);
          if (!freshLesson) continue;
          if (lessonFingerprint(freshLesson) !== saved()[`lesson:${lessonId}`]) {
            try {
              await dispatch(
                syncUpdateLesson({ moduleId, lessonId, lesson: freshLesson }),
              ).unwrap();
            } catch (err) {
              reportError(err);
            }
          }
        }

        const freshLesson = getState().courseBuilder.modules
          .find((m) => m.id === moduleId)
          ?.lessons.find((l) => l.id === lessonId);
        if (!freshLesson) continue;

        const lessonAssessmentKey = `lessonAssessment:${lessonId}`;
        const lessonAssessmentChanged =
          lessonAssessmentFingerprint(freshLesson, freshLesson.title) !==
          saved()[lessonAssessmentKey];
        const hasSavedLessonAssessment = saved()[lessonAssessmentKey] !== undefined;
        if (
          lessonAssessmentChanged &&
          ((freshLesson.quizQuestions?.length || 0) > 0 || hasSavedLessonAssessment)
        ) {
          try {
            await dispatch(
              syncSaveLessonAssessment({
                moduleId,
                lessonId,
                lessonTitle: freshLesson.title,
              }),
            ).unwrap();
          } catch (err) {
            reportError(err);
          }
        }
      }
    }

    if (!hadError) {
      dispatch(markSaved());
    }
  } finally {
    dispatch(endSave());
  }
});
