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
  setQuizIdForLesson,
  setQuizQuestionsForLesson,
  setModuleQuizId,
  type Lesson,
} from "./courseBuilderSlice";
import { uploadFile } from "@/lib/uploads";
import {
  apiCourseToReduxModules,
  apiCourseToCourseInfo,
  reduxLessonToApiPayload,
  reduxQuizQuestionsToAssessment,
  apiQuizQuestionsToRedux,
  reduxQuizQuestionsToApiQuestions,
  apiQuizQuestionsToModuleQuiz,
} from "@/modules/builder/utils/transformers";
import type { CreateModuleRequest, UpdateModuleRequest } from "@/modules/creator/courses/types/module";
import type { CreateLessonRequest, UpdateLessonRequest, LessonContentType } from "@/modules/creator/courses/types/lesson";
import type { UpsertAssessmentRequest } from "@/modules/creator/courses/types/assessment";
import { CreateQuizRequest, QuizLevel, QuizQuestionType } from "@/modules/creator/courses/types/quiz";

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

const syncQuestionsForQuiz = async (
  token: string,
  quizId: string,
  apiQuestions: { question_text: string; question_type: QuizQuestionType; points: number; model_response_guide: string; order: number; options: { option_text: string; is_correct: boolean; explanation: string; order: number }[] }[],
) => {
  let existingQuestions: { id: string }[] = [];
  try {
    const qRes = await fetchJson(`/questions/?quiz=${quizId}`, token);
    existingQuestions = qRes.data?.results || qRes.results || [];
    if (!Array.isArray(existingQuestions)) existingQuestions = [];
  } catch {
    // ignore
  }

  for (const eq of existingQuestions) {
    await fetchJson(`/questions/${eq.id}/`, token, { method: "DELETE" }).catch(() => {});
  }

  for (const apiQ of apiQuestions) {
    await fetchJson("/questions/", token, {
      method: "POST",
      body: JSON.stringify({ ...apiQ, quiz: quizId }),
    }).catch(() => {});
  }
};

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

    const modules = getState().courseBuilder.modules;

    let allQuizzes: { id: string; lesson: string | null; module: string | null; questions: unknown[] }[] = [];
    try {
      const quizRes = await fetchJson("/quizzes/?size=200", token);
      allQuizzes = quizRes.data?.results?.flat?.() || quizRes.data?.results || [];
      if (!Array.isArray(allQuizzes)) allQuizzes = [];
    } catch {
      // quizzes fetch failed silently
    }

    for (const mod of modules) {
      const moduleQuiz = allQuizzes.find(
        (q) => q.module === mod.id && !q.lesson,
      );
      if (moduleQuiz) {
        dispatch(setModuleQuizId({ moduleId: mod.id, quizId: moduleQuiz.id }));
        let quizQuestions = moduleQuiz.questions || [];
        if (quizQuestions.length === 0) {
          try {
            const qRes = await fetchJson(`/questions/?quiz=${moduleQuiz.id}`, token);
            quizQuestions = qRes.data?.results || qRes.results || [];
            if (!Array.isArray(quizQuestions)) quizQuestions = [];
          } catch {
            // ignore
          }
        }
        if (quizQuestions.length > 0) {
          const typedQs = quizQuestions as Parameters<typeof apiQuizQuestionsToModuleQuiz>[0];
          const mapped = apiQuizQuestionsToModuleQuiz(typedQs);
          dispatch(setModules(
            getState().courseBuilder.modules.map((m) =>
              m.id === mod.id ? { ...m, quizQuestions: mapped } : m
            )
          ));
        }
      }

      for (const lesson of mod.lessons) {
        if (lesson.type === "quiz") {
          const matched = allQuizzes.find((q) => q.lesson === lesson.id && q.module === mod.id);
          if (matched) {
            dispatch(setQuizIdForLesson({
              moduleId: mod.id,
              lessonId: lesson.id,
              quizId: matched.id,
            }));
            let lessonQuestions = matched.questions || [];
            if (lessonQuestions.length === 0) {
              try {
                const qRes = await fetchJson(`/questions/?quiz=${matched.id}`, token);
                lessonQuestions = qRes.data?.results || qRes.results || [];
                if (!Array.isArray(lessonQuestions)) lessonQuestions = [];
              } catch {
                // ignore
              }
            }
            if (lessonQuestions.length > 0) {
              dispatch(setQuizQuestionsForLesson({
                moduleId: mod.id,
                lessonId: lesson.id,
                questions: apiQuizQuestionsToRedux(lessonQuestions as Parameters<typeof apiQuizQuestionsToRedux>[0]),
              }));
            }
          }
        }
      }
    }
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
      learning_objectives: (newModule.objectives || []).filter((o) => o.trim() !== ""),
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
      learning_objectives: (learningObjectives || []).filter((o) => o.trim() !== ""),
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

  let quizId = mod.quizId;

  dispatch(setIsSaving(true));
  try {
    const token = getToken(state);
    const apiQuestions = mod.quizQuestions.map((q, idx) => {
      const correctIdx = q.options.indexOf(q.correctAnswer || "");
      return {
        question_text: q.question,
        question_type: QuizQuestionType.MULTIPLE_CHOICE,
        points: 0,
        model_response_guide: "",
        order: idx,
        options: q.options.map((opt, oi) => ({
          option_text: opt,
          is_correct: oi === correctIdx,
          explanation: oi === correctIdx ? "" : "",
          order: oi,
        })),
      };
    });

    if (!quizId) {
      let existingQuizId: string | null = null;
      try {
        const quizRes = await fetchJson("/quizzes/?size=200", token);
        const allQuizzes = quizRes.data?.results || [];
        const existing = allQuizzes.find(
          (q: { module: string | null }) => q.module === moduleId
        );
        if (existing) {
          existingQuizId = existing.id;
        }
      } catch {
        // ignore fetch error
      }

      if (existingQuizId) {
        quizId = existingQuizId;
        dispatch(setModuleQuizId({ moduleId, quizId: existingQuizId }));
        await fetchJson(`/quizzes/${existingQuizId}/`, token, {
          method: "PUT",
          body: JSON.stringify({
            level: QuizLevel.MODULE,
            title: `${moduleTitle || "Untitled"} Quiz`,
            description: "",
            module: moduleId,
            passing_score: 70,
            time_limit_minutes: 0,
            attempts_allowed: 3,
            shuffle_questions: false,
            randomize_options: false,
          }),
        });
      } else {
        const body: CreateQuizRequest = {
          level: QuizLevel.MODULE,
          title: `${moduleTitle || "Untitled"} Quiz`,
          description: "",
          module: moduleId,
          passing_score: 70,
          time_limit_minutes: 0,
          attempts_allowed: 3,
          shuffle_questions: false,
          randomize_options: false,
        };
        const result = await fetchJson("/quizzes/", token, {
          method: "POST",
          body: JSON.stringify(body),
        });
        quizId = result.id;
        dispatch(setModuleQuizId({ moduleId, quizId: result.id }));
      }
    } else {
      await fetchJson(`/quizzes/${quizId}/`, token, {
        method: "PUT",
        body: JSON.stringify({
          level: QuizLevel.MODULE,
          title: `${moduleTitle || "Untitled"} Quiz`,
          description: "",
          module: moduleId,
          passing_score: 70,
          time_limit_minutes: 0,
          attempts_allowed: 3,
          shuffle_questions: false,
          randomize_options: false,
        }),
      });
    }

    if (quizId) {
      await syncQuestionsForQuiz(token, quizId, apiQuestions);
    }

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

export const syncCreateQuiz = createAsyncThunk<
  string | null,
  { moduleId: string; lessonId: string; lessonTitle: string },
  { state: RootState; dispatch: AppDispatch }
>("builderSync/syncCreateQuiz", async ({ moduleId, lessonId, lessonTitle }, { dispatch, getState }) => {
  const state = getState();
  const courseId = state.courseBuilder.courseId;
  if (!courseId) return null;

  dispatch(setIsSaving(true));
  try {
    const token = getToken(state);
    const lesson = state.courseBuilder.modules
      .find((m) => m.id === moduleId)
      ?.lessons.find((l) => l.id === lessonId);
    const questions = lesson?.quizQuestions || [];
    const apiQuestions = reduxQuizQuestionsToApiQuestions(questions);

    let existingQuizId: string | null = null;
    try {
      const quizRes = await fetchJson("/quizzes/?size=200", token);
      const allQuizzes = quizRes.data?.results || [];
      const existing = allQuizzes.find(
        (q: { lesson: string | null; module: string | null }) => q.module === moduleId && (q.lesson === lessonId || !q.lesson)
      );
      if (existing) {
        existingQuizId = existing.id;
      }
    } catch {
      // ignore fetch error
    }

    if (existingQuizId) {
      await fetchJson(`/quizzes/${existingQuizId}/`, token, {
        method: "PUT",
        body: JSON.stringify({
          level: QuizLevel.LESSON,
          title: `${lessonTitle || "Untitled"} Quiz`,
          description: "",
          lesson: lessonId,
          passing_score: 70,
          time_limit_minutes: 0,
          attempts_allowed: 3,
          shuffle_questions: false,
          randomize_options: false,
        }),
      });
      await syncQuestionsForQuiz(token, existingQuizId, apiQuestions);
      dispatch(setQuizIdForLesson({ moduleId, lessonId, quizId: existingQuizId }));
      dispatch(markSaved());
      return existingQuizId;
    }

    const body: CreateQuizRequest = {
      level: QuizLevel.LESSON,
      title: `${lessonTitle || "Untitled"} Quiz`,
      description: "",
      lesson: lessonId,
      passing_score: 70,
      time_limit_minutes: 0,
      attempts_allowed: 3,
      shuffle_questions: false,
      randomize_options: false,
    };
    const result = await fetchJson("/quizzes/", token, {
      method: "POST",
      body: JSON.stringify(body),
    });
    await syncQuestionsForQuiz(token, result.id, apiQuestions);
    dispatch(setQuizIdForLesson({ moduleId, lessonId, quizId: result.id }));
    dispatch(markSaved());
    return result.id as string;
  } catch {
    dispatch(setIsSaving(false));
    return null;
  }
});

export const syncSaveQuizQuestions = createAsyncThunk<
  void,
  { moduleId: string; lessonId: string; lessonTitle: string },
  { state: RootState; dispatch: AppDispatch }
>("builderSync/syncSaveQuizQuestions", async ({ moduleId, lessonId, lessonTitle }, { dispatch, getState }) => {
  const state = getState();
  const courseId = state.courseBuilder.courseId;
  if (!courseId) return;

  const lesson = state.courseBuilder.modules
    .find((m) => m.id === moduleId)
    ?.lessons.find((l) => l.id === lessonId);
  if (!lesson) return;

  let quizId = lesson.quizId;

  dispatch(setIsSaving(true));
  try {
    const token = getToken(state);
    const questions = lesson.quizQuestions || [];
    const apiQuestions = reduxQuizQuestionsToApiQuestions(questions);

    if (!quizId) {
      let existingQuizId: string | null = null;
      try {
        const quizRes = await fetchJson("/quizzes/?size=200", token);
        const allQuizzes = quizRes.data?.results || [];
        const existing = allQuizzes.find(
          (q: { lesson: string | null; module: string | null }) => q.module === moduleId && (q.lesson === lessonId || !q.lesson)
        );
        if (existing) {
          existingQuizId = existing.id;
        }
      } catch {
        // ignore fetch error
      }

      if (existingQuizId) {
        quizId = existingQuizId;
        dispatch(setQuizIdForLesson({ moduleId, lessonId, quizId: existingQuizId }));
        await fetchJson(`/quizzes/${existingQuizId}/`, token, {
          method: "PUT",
          body: JSON.stringify({
            level: QuizLevel.LESSON,
            title: `${lessonTitle || "Untitled"} Quiz`,
            description: "",
            lesson: lessonId,
            passing_score: 70,
            time_limit_minutes: 0,
            attempts_allowed: 3,
            shuffle_questions: false,
            randomize_options: false,
          }),
        });
      } else {
        const body: CreateQuizRequest = {
          level: QuizLevel.LESSON,
          title: `${lessonTitle || "Untitled"} Quiz`,
          description: "",
          lesson: lessonId,
          passing_score: 70,
          time_limit_minutes: 0,
          attempts_allowed: 3,
          shuffle_questions: false,
          randomize_options: false,
        };
        const result = await fetchJson("/quizzes/", token, {
          method: "POST",
          body: JSON.stringify(body),
        });
        quizId = result.id;
        dispatch(setQuizIdForLesson({ moduleId, lessonId, quizId: result.id }));
      }
    } else {
      await fetchJson(`/quizzes/${quizId}/`, token, {
        method: "PUT",
        body: JSON.stringify({
          level: QuizLevel.LESSON,
          title: `${lessonTitle || "Untitled"} Quiz`,
          description: "",
          lesson: lessonId,
          passing_score: 70,
          time_limit_minutes: 0,
          attempts_allowed: 3,
          shuffle_questions: false,
          randomize_options: false,
        }),
      });
    }

    if (quizId) {
      await syncQuestionsForQuiz(token, quizId, apiQuestions);
    }

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

export const syncSetCoverVideo = createAsyncThunk<
  void,
  File,
  { state: RootState; dispatch: AppDispatch }
>("builderSync/syncSetCoverVideo", async (file, { dispatch, getState }) => {
  const state = getState();
  const courseId = state.courseBuilder.courseId;
  if (!courseId) return;

  dispatch(setIsSaving(true));
  try {
    const token = getToken(state);
    const presigned = await uploadFile(file, {}, token);
    await fetchJson(`/courses/${courseId}/`, token, {
      method: "PATCH",
      body: JSON.stringify({ preview_video_url: presigned.file_url }),
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

        if (mod.quizQuestions.length > 0) {
          await dispatch(
            syncSaveModuleAssessment({ moduleId: mod.id, moduleTitle: mod.title }),
          ).unwrap();
        }
      }

      for (const lesson of mod.lessons) {
        if (lesson.id && !/^\d+$/.test(lesson.id)) {
          await dispatch(
            syncUpdateLesson({ moduleId: mod.id, lessonId: lesson.id, lesson }),
          ).unwrap();

          if (lesson.quizQuestions && lesson.quizQuestions.length > 0) {
            await dispatch(
              syncSaveQuizQuestions({
                moduleId: mod.id,
                lessonId: lesson.id,
                lessonTitle: lesson.title,
              }),
            ).unwrap();
          }
        }
      }
    }

    dispatch(markSaved());
  } catch {
    // errors handled inside individual thunks
  }
});
