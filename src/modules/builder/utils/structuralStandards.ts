import type {
  CourseInformationData,
  FinalAssessmentData,
  Lesson,
  Module,
} from "@/redux/slices/courseBuilderSlice";

export interface StructuralStandard {
  id: string;
  label: string;
  requirement: string;
  actual: string;
  passed: boolean;
}

export interface StructuralStandardsInput {
  courseInformation: CourseInformationData;
  modules: Module[];
  version: string;
  finalAssessment: FinalAssessmentData;
}

export const STRUCTURAL_LIMITS = {
  courseObjectives: { min: 5, max: 5 },
  descriptionWords: { min: 100, max: 500 },
  durationMinutes: { min: 120, max: 480 },
  modules: { min: 4, max: 12 },
  moduleLessons: { min: 3, max: 8 },
  lessonObjectives: { min: 2, max: 5 },
  lessonScriptWords: { min: 500, max: 1500 },
  finalAssessmentQuestions: { min: 15 },
} as const;

const countWords = (value?: string | null): number => {
  const trimmed = (value ?? "").trim();
  return trimmed === "" ? 0 : trimmed.split(/\s+/).length;
};

const countItems = (values?: string[]): number =>
  (values ?? []).filter((value) => value.trim().length > 0).length;

const isWithin = (value: number, min: number, max: number): boolean =>
  value >= min && value <= max;

const rangeText = (min: number, max: number): string =>
  min === max ? `exactly ${min}` : `between ${min} and ${max}`;

const build = (
  id: string,
  label: string,
  value: number,
  min: number,
  max: number,
  noun: string,
): StructuralStandard => ({
  id,
  label,
  requirement: `${rangeText(min, max)} ${noun}`,
  actual: String(value),
  passed: isWithin(value, min, max),
});

const scriptWords = (lesson: Lesson): number =>
  countWords(lesson.videoScript ?? lesson.content);

const lessonDurationMinutes = (lesson: Lesson): number => {
  const source =
    lesson.type === "text"
      ? lesson.estimatedDuration || lesson.duration || "0"
      : lesson.duration || "0";
  const match = source.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
};

const totalDurationMinutes = (modules: Module[]): number =>
  modules.reduce(
    (total, courseModule) =>
      total +
      courseModule.lessons.reduce(
        (sum, lesson) => sum + lessonDurationMinutes(lesson),
        0,
      ),
    0,
  );

export const evaluateStructuralStandards = ({
  courseInformation,
  modules,
  version,
  finalAssessment,
}: StructuralStandardsInput): StructuralStandard[] => {
  const standards: StructuralStandard[] = [];

  standards.push(
    build(
      "course-objectives",
      "Course learning objectives",
      countItems(courseInformation.objectives),
      STRUCTURAL_LIMITS.courseObjectives.min,
      STRUCTURAL_LIMITS.courseObjectives.max,
      "learning objectives",
    ),
  );

  standards.push(
    build(
      "course-description",
      "Course description",
      countWords(courseInformation.description),
      STRUCTURAL_LIMITS.descriptionWords.min,
      STRUCTURAL_LIMITS.descriptionWords.max,
      "words",
    ),
  );

  standards.push(
    build(
      "course-duration",
      "Course duration",
      totalDurationMinutes(modules),
      STRUCTURAL_LIMITS.durationMinutes.min,
      STRUCTURAL_LIMITS.durationMinutes.max,
      "minutes",
    ),
  );

  standards.push({
    id: "course-version",
    label: "Course version",
    requirement: "a selected version",
    actual: version.trim() ? version : "none",
    passed: version.trim().length > 0,
  });

  standards.push(
    build(
      "course-modules",
      "Modules",
      modules.length,
      STRUCTURAL_LIMITS.modules.min,
      STRUCTURAL_LIMITS.modules.max,
      "modules",
    ),
  );

  standards.push({
    id: "final-assessment",
    label: "Final assessment",
    requirement: `at least ${STRUCTURAL_LIMITS.finalAssessmentQuestions.min} questions`,
    actual: String(finalAssessment.quizQuestions?.length ?? 0),
    passed:
      (finalAssessment.quizQuestions?.length ?? 0) >=
      STRUCTURAL_LIMITS.finalAssessmentQuestions.min,
  });

  for (const courseModule of modules) {
    const moduleName = courseModule.title.trim() || "Untitled Module";
    const lessonCount = courseModule.lessons.length;

    standards.push(
      build(
        `module-lessons-${courseModule.id}`,
        `Module '${moduleName}' lessons`,
        lessonCount,
        STRUCTURAL_LIMITS.moduleLessons.min,
        STRUCTURAL_LIMITS.moduleLessons.max,
        "lessons",
      ),
    );

    for (const lesson of courseModule.lessons) {
      const lessonName = lesson.title.trim() || "Untitled Lesson";

      standards.push(
        build(
          `lesson-objectives-${lesson.id}`,
          `Lesson '${lessonName}' learning objectives`,
          countItems(lesson.objectives),
          STRUCTURAL_LIMITS.lessonObjectives.min,
          STRUCTURAL_LIMITS.lessonObjectives.max,
          "learning objectives",
        ),
      );

      if (lesson.type === "video") {
        standards.push(
          build(
            `lesson-script-${lesson.id}`,
            `Lesson '${lessonName}' script`,
            scriptWords(lesson),
            STRUCTURAL_LIMITS.lessonScriptWords.min,
            STRUCTURAL_LIMITS.lessonScriptWords.max,
            "words",
          ),
        );
      }
    }
  }

  return standards;
};
