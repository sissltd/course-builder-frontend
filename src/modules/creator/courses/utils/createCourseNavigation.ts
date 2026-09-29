import { CreatorRoute } from "@/lib/routes";

export const CreateCourseStep = {
  VideoGuide: 0,
  Legal: 1,
  Method: 2,
  Category: 3,
  Topic: 4,
  Details: 5,
  Loading: 6,
} as const;

export type CreateCourseStepValue =
  (typeof CreateCourseStep)[keyof typeof CreateCourseStep];

export const LAST_CREATE_COURSE_STEP: CreateCourseStepValue =
  CreateCourseStep.Loading;

export const CREATE_COURSE_STEP_PARAM = "step";
export const RETURN_FROM_PARAM = "from";

export const clampCreateCourseStep = (value: number): CreateCourseStepValue => {
  if (!Number.isFinite(value)) return CreateCourseStep.VideoGuide;
  const rounded = Math.trunc(value);
  if (rounded < CreateCourseStep.VideoGuide) return CreateCourseStep.VideoGuide;
  if (rounded > LAST_CREATE_COURSE_STEP) return LAST_CREATE_COURSE_STEP;
  return rounded as CreateCourseStepValue;
};

export const parseCreateCourseStep = (
  raw: string | null | undefined,
): CreateCourseStepValue => {
  if (raw === null || raw === undefined || raw.trim() === "") {
    return CreateCourseStep.VideoGuide;
  }
  const parsed = Number.parseInt(raw, 10);
  return Number.isNaN(parsed)
    ? CreateCourseStep.VideoGuide
    : clampCreateCourseStep(parsed);
};

export const createCourseStepHref = (step: number): string =>
  `${CreatorRoute.COURSES_CREATE}?${CREATE_COURSE_STEP_PARAM}=${clampCreateCourseStep(step)}`;

export const buildMethodEntryHref = (target: string): string =>
  `${target}?${RETURN_FROM_PARAM}=${encodeURIComponent(
    CreatorRoute.COURSES_CREATE,
  )}&${CREATE_COURSE_STEP_PARAM}=${CreateCourseStep.Method}`;

export const resolveReturnHref = (params: {
  from: string | null;
  step: string | null;
}): string | null => {
  if (params.from !== CreatorRoute.COURSES_CREATE) return null;
  return createCourseStepHref(parseCreateCourseStep(params.step));
};
