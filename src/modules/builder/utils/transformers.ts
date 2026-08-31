import type { Course, CourseModule } from "@/modules/creator/courses/types";
import type { AssessmentQuestion, Assessment } from "@/modules/creator/courses/types/assessment";
import type { Module, Lesson, CourseInformationData, QuizQuestionData, QuizQuestion } from "@/redux/slices/courseBuilderSlice";

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
}

interface ApiModuleLike {
  id: string;
  title: string;
  lessons?: ApiLessonLike[];
  assessment?: Assessment | null;
}

const mapContentType = (lesson: ApiLessonLike): Lesson["type"] => {
  if (lesson.video_url || lesson.embedded_link) return "video";
  if (lesson.assessment) return "quiz";
  return "text";
};

const mapAssessmentQuestions = (
  questions: AssessmentQuestion[],
): QuizQuestionData[] => {
  return questions.map((q, idx) => {
    if (q.type === "ESSAY") {
      return {
        question: q.question,
        type: "essay",
        points: q.points,
        options: [],
        correctAnswer: "",
        explanation: q.explanation,
      };
    }
    return {
      question: q.question,
      type: "single",
      points: q.points,
      options: q.options.map((opt, oi) => ({
        id: `${idx}-${String.fromCharCode(97 + oi)}`,
        label: String.fromCharCode(65 + oi),
        value: opt.text,
      })),
      correctOptionId:
        q.options[q.correct_index]
          ? `${idx}-${String.fromCharCode(97 + q.correct_index)}`
          : undefined,
      explanation: q.options[q.correct_index]?.explanation || "",
    };
  });
};

const mapAssessmentToQuizQuestions = (
  questions: AssessmentQuestion[],
): QuizQuestion[] => {
  return questions.map((q) => {
    if (q.type === "ESSAY") {
      return {
        question: q.question,
        options: [],
        correctAnswer: "",
      };
    }
    const correctText = q.options[q.correct_index]?.text || "";
    return {
      question: q.question,
      options: q.options.map((opt) => opt.text),
      correctAnswer: correctText,
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
    return {
      id: l.id,
      title: l.title,
      duration: l.duration_minutes ? `${l.duration_minutes} mins` : "0 mins",
      assessments: l.assessment
        ? `${l.assessment.summary?.total_questions || 0} Assessment`
        : "0 Assessment",
      type,
      objectives: l.learning_objectives || [],
      requirements: "",
      content: l.script || "",
      videoScript: l.video_script_file || "",
      embedLink: l.embedded_link || l.video_url || "",
      quizQuestions: lessonQuizQuestions,
    };
  });

  const moduleQuizQuestions = apiMod.assessment?.questions
    ? mapAssessmentToQuizQuestions(apiMod.assessment.questions)
    : [];

  return {
    id: apiMod.id,
    title: apiMod.title,
    description: "",
    objectives: [],
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
    thumbnail: course.thumbnail_url || "",
  };
};

export const reduxLessonToApiPayload = (lesson: Lesson) => {
  const durationParts = (lesson.duration || "0 mins").match(/(\d+)/);
  const durationMinutes = durationParts
    ? parseInt(durationParts[1], 10)
    : 0;

  return {
    title: lesson.title,
    script: lesson.content || "",
    embedded_link: lesson.embedLink || "",
    video_script_file: lesson.videoScript || "",
    learning_objectives: lesson.objectives || [],
    duration_minutes: durationMinutes,
  };
};

export const reduxQuizQuestionsToAssessment = (
  questions: QuizQuestionData[],
  title: string,
): { title: string; questions: AssessmentQuestion[] } => {
  return {
    title,
    questions: questions.map((q): AssessmentQuestion => {
      if (q.type === "essay") {
        return {
          type: "ESSAY" as AssessmentQuestion["type"],
          question: q.question,
          points: q.points || 0,
          explanation: q.explanation || "",
        } as AssessmentQuestion;
      }
      const correctIdx = q.options.findIndex(
        (opt) => opt.id === q.correctOptionId,
      );
      return {
        type: "MULTIPLE_CHOICE" as AssessmentQuestion["type"],
        question: q.question,
        points: q.points || 0,
        options: q.options.map((opt) => ({
          text: opt.value,
          explanation: "",
        })),
        correct_index: correctIdx >= 0 ? correctIdx : 0,
      } as AssessmentQuestion;
    }),
  };
};
