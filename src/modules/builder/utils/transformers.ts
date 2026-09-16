import type { Course, CourseModule } from "@/modules/creator/courses/types";
import { QuestionType } from "@/modules/creator/courses/types/assessment";
import type {
  AssessmentQuestion,
  Assessment,
  AssessmentOption,
  UpsertAssessmentRequest,
} from "@/modules/creator/courses/types/assessment";
import type { QuizQuestionItem } from "@/modules/creator/courses/types/quiz";
import type {
  Module,
  Lesson,
  CourseInformationData,
  QuizQuestionData,
} from "@/redux/slices/courseBuilderSlice";

interface ApiLessonLike {
  id: string;
  title: string;
  script?: string;
  video_url?: string;
  embedded_link?: string;
  video_script_file?: string;
  duration_minutes?: number;
  learning_objectives?: string[];
  assessment?: Assessment | null;
  content_type?: string;
  requirements?: { id: string; text: string; order: number }[];
}

interface ApiModuleLike {
  id: string;
  title: string;
  description?: string;
  learning_objectives?: string | string[];
  lessons?: ApiLessonLike[];
  assessment?: Assessment | null;
}

const mapContentType = (lesson: ApiLessonLike): Lesson["type"] => {
  if (lesson.content_type === "VIDEO" || lesson.video_url || lesson.embedded_link) return "video";
  if (lesson.content_type === "QUIZ" || lesson.assessment) return "quiz";
  if (lesson.content_type === "TEXT") return "text";
  return "text";
};

const correctIndicesForQuestion = (q: AssessmentQuestion): number[] => {
  if (q.type === QuestionType.ESSAY) return [];
  if (q.type === QuestionType.MULTIPLE_CHOICE) {
    if (q.correct_indices && q.correct_indices.length > 0) return q.correct_indices;
    return q.correct_index !== undefined ? [q.correct_index] : [];
  }
  return q.correct_index !== undefined ? [q.correct_index] : [];
};

const optionText = (opt: AssessmentOption | { text?: string }): string =>
  typeof opt === "string" ? opt : opt?.text ?? "";

export const mapAssessmentQuestions = (
  questions: AssessmentQuestion[],
): QuizQuestionData[] => {
  return questions.map((q, idx) => {
    const id = `q-${idx}`;
    if (q.type === QuestionType.ESSAY) {
      return {
        id,
        question: q.question,
        type: "essay",
        points: q.points ?? 0,
        options: [],
        correctAnswer: q.expected_answer || "",
        explanation: q.explanation || "",
      };
    }

    const options = q.options.map((opt, oi) => ({
      id: `${id}-${String.fromCharCode(97 + oi)}`,
      label: String.fromCharCode(65 + oi),
      value: optionText(opt),
    }));
    const correctIndices = correctIndicesForQuestion(q);
    const explanation = q.explanation || "";

    if (q.type === QuestionType.MULTIPLE_CHOICE) {
      return {
        id,
        question: q.question,
        type: "multiple",
        points: q.points ?? 0,
        options,
        correctOptionIds: correctIndices
          .map((index) => options[index]?.id)
          .filter((optionId): optionId is string => Boolean(optionId)),
        explanation,
      };
    }

    return {
      id,
      question: q.question,
      type: "single",
      points: q.points ?? 0,
      options,
      correctOptionId:
        correctIndices[0] !== undefined ? options[correctIndices[0]]?.id : undefined,
      explanation,
    };
  });
};

export const apiModuleToRedux = (apiModule: CourseModule): Module => {
  const apiMod = apiModule as unknown as ApiModuleLike;
  const lessons: Lesson[] = (apiMod.lessons || []).map((l) => {
    const type = mapContentType(l);
    const lessonQuizQuestions = l.assessment?.questions
      ? mapAssessmentQuestions(l.assessment.questions)
      : [];
    const requirementsText = l.requirements
      ? l.requirements.sort((a, b) => a.order - b.order).map((r) => r.text).join("\n\n")
      : "";
    return {
      id: l.id,
      title: l.title,
      duration: l.duration_minutes ? `${l.duration_minutes} mins` : "0 mins",
      assessments: l.assessment
        ? `${l.assessment.summary?.total_questions || 0} Assessment`
        : "0 Assessment",
      type,
      objectives: l.learning_objectives || [],
      requirements: requirementsText,
      content: l.script || "",
      videoScript: l.video_script_file || "",
      videoUrl: l.video_url || "",
      embedLink: l.embedded_link || "",
      quizQuestions: lessonQuizQuestions,
    };
  });

  const moduleQuizQuestions = apiMod.assessment?.questions
    ? mapAssessmentQuestions(apiMod.assessment.questions)
    : [];

  const objectives = Array.isArray(apiMod.learning_objectives)
    ? apiMod.learning_objectives
    : apiMod.learning_objectives
      ? apiMod.learning_objectives.split(", ").filter(Boolean)
      : [];

  return {
    id: apiMod.id,
    title: apiMod.title,
    description: apiMod.description || "",
    objectives,
    lessons,
    quizQuestions: moduleQuizQuestions,
  };
};

export const apiCourseToReduxModules = (course: Course): Module[] => {
  return (course.modules || []).map(apiModuleToRedux);
};

export const apiCourseToCourseInfo = (
  course: Course,
): CourseInformationData => {
  const durationSeconds = course.planned_duration_seconds || 0;
  const hours = Math.floor(durationSeconds / 3600);
  const minutes = Math.floor((durationSeconds % 3600) / 60);
  const seconds = durationSeconds % 60;

  return {
    courseTitle: course.title || "",
    description: course.description || "",
    category: course.category?.id || "",
    topic: course.topic?.id || "",
    difficulty: course.difficulty_level || "",
    objectives: course.learning_objectives || [],
    tags: course.tags || [],
    hours,
    minutes,
    seconds,
    coverVideo: null,
    coverVideoUrl: course.preview_video_url || "",
    thumbnail: course.thumbnail_url || "",
  };
};

export const reduxLessonToApiPayload = (lesson: Lesson) => {
  const durationSource = lesson.type === "text"
    ? (lesson.estimatedDuration || lesson.duration || "0 mins")
    : (lesson.duration || "0 mins");
  const durationParts = durationSource.match(/(\d+)/);
  const durationMinutes = durationParts
    ? parseInt(durationParts[1], 10)
    : 0;

  const contentTypeMap: Record<string, string> = {
    video: "VIDEO",
    quiz: "QUIZ",
    text: "TEXT",
  };

  return {
    title: lesson.title,
    script: lesson.content || "",
    video_url: lesson.type === "video" ? (lesson.videoUrl || "") : "",
    embedded_link: lesson.embedLink || "",
    video_script_file: lesson.videoScript || "",
    learning_objectives: lesson.objectives || [],
    duration_minutes: durationMinutes,
    lesson_requirement: lesson.requirements || "",
    content_type: contentTypeMap[lesson.type] || "TEXT",
  };
};

export const reduxQuizQuestionsToAssessment = (
  questions: QuizQuestionData[],
  title: string,
): UpsertAssessmentRequest => {
  return {
    title,
    questions: questions.map((q): AssessmentQuestion => {
      const explanation = (q.explanation || "").trim();

      if (q.type === "essay") {
        return {
          type: QuestionType.ESSAY,
          question: q.question,
          points: q.points || 0,
          expected_answer: q.correctAnswer || "",
          ...(explanation ? { explanation } : {}),
        };
      }

      if (q.type === "multiple") {
        const correctIds = new Set(q.correctOptionIds || []);
        const indices: number[] = [];
        q.options.forEach((opt, oi) => {
          if (correctIds.has(opt.id)) indices.push(oi);
        });
        return {
          type: QuestionType.MULTIPLE_CHOICE,
          question: q.question,
          points: q.points || 0,
          options: q.options.map((opt) => opt.value),
          ...(explanation ? { explanation } : {}),
          correct_indices: indices.length > 0 ? indices : [0],
        };
      }

      const correctIdx = q.options.findIndex((opt) => opt.id === q.correctOptionId);
      const resolvedCorrect = correctIdx >= 0 ? correctIdx : 0;
      return {
        type: QuestionType.SINGLE_CHOICE,
        question: q.question,
        points: q.points || 0,
        options: q.options.map((opt) => opt.value),
        ...(explanation ? { explanation } : {}),
        correct_index: resolvedCorrect,
      };
    }),
  };
};

export const mapFinalAssessmentQuestions = (
  assessment: Assessment | null | undefined,
): QuizQuestionData[] => {
  if (!assessment?.questions?.length) return [];
  return mapAssessmentQuestions(assessment.questions);
};

export const apiRelationalQuestionsToRedux = (
  questions: QuizQuestionItem[],
): QuizQuestionData[] => {
  return questions.map((q, idx) => {
    const id = `q-${idx}`;
    if (q.question_type === "ESSAY") {
      return {
        id,
        question: q.question_text,
        type: "essay",
        points: q.points ?? 0,
        options: [],
        correctAnswer: q.model_response_guide || "",
        explanation: q.explanation || "",
      };
    }

    const options = q.options.map((opt, oi) => ({
      id: `${id}-${String.fromCharCode(97 + oi)}`,
      label: String.fromCharCode(65 + oi),
      value: opt.option_text,
    }));
    const correctIndices = q.options
      .map((opt, oi) => (opt.is_correct ? oi : -1))
      .filter((oi) => oi >= 0);
    const explanation = q.explanation || "";

    if (q.question_type === "MULTIPLE_CHOICE") {
      return {
        id,
        question: q.question_text,
        type: "multiple",
        points: q.points ?? 0,
        options,
        correctOptionIds: correctIndices
          .map((index) => options[index]?.id)
          .filter((optionId): optionId is string => Boolean(optionId)),
        explanation,
      };
    }

    return {
      id,
      question: q.question_text,
      type: "single",
      points: q.points ?? 0,
      options,
      correctOptionId:
        correctIndices[0] !== undefined ? options[correctIndices[0]]?.id : undefined,
      explanation,
    };
  });
};
