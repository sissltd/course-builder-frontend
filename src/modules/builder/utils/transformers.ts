import type { Course, CourseModule } from "@/modules/creator/courses/types";
import type { AssessmentQuestion } from "@/modules/creator/courses/types/assessment";
import type { Module, Lesson, CourseInformationData, QuizQuestionData } from "@/redux/slices/courseBuilderSlice";

interface ApiLessonLike {
  id: string;
  title: string;
  video_url?: string;
  duration_minutes?: number;
  learning_objectives?: string[];
  assessment?: unknown;
}

const mapContentType = (lesson: ApiLessonLike): Lesson["type"] => {
  if (lesson.video_url) return "video";
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

export const apiModuleToRedux = (apiModule: CourseModule): Module => {
  const lessons: Lesson[] = ((apiModule.lessons || []) as unknown as ApiLessonLike[]).map((l) => {
    const type = mapContentType(l);
    return {
      id: l.id,
      title: l.title,
      duration: l.duration_minutes ? `${l.duration_minutes} mins` : "0 mins",
      assessments: "0 Assessment",
      type,
      objectives: l.learning_objectives || [],
      requirements: "",
      content: "",
      videoScript: "",
      embedLink: l.video_url || "",
      quizQuestions: [],
    };
  });

  return {
    id: apiModule.id,
    title: apiModule.title,
    description: "",
    objectives: [],
    lessons,
    quizQuestions: [],
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
    script: lesson.videoScript || lesson.content || "",
    video_url: lesson.embedLink || "",
    learning_objectives: (lesson.objectives || []).join(", "),
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
