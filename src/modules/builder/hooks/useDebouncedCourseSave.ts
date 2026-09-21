"use client";

import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/redux";
import { updateCourseInformation } from "@/redux/slices/courseBuilderSlice";
import { syncUpdateCourseInfo } from "@/redux/slices/builderSync";
import { useDebouncedSave } from "./useDebouncedSave";

const DEBOUNCE_MS = 800;

export function useDebouncedCourseSave() {
  const dispatch = useAppDispatch();
  const courseId = useAppSelector((state) => state.courseBuilder.courseId);

  const { schedule } = useDebouncedSave(
    () => {
      if (courseId) {
        dispatch(syncUpdateCourseInfo());
      }
    },
    { wait: DEBOUNCE_MS },
  );

  const updateAndSave = useCallback(
    (patch: Parameters<typeof updateCourseInformation>[0]) => {
      dispatch(updateCourseInformation(patch));
      schedule();
    },
    [dispatch, schedule],
  );

  return { updateAndSave };
}
