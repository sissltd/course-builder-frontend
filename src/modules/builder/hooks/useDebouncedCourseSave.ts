"use client";

import { useRef, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/redux";
import { updateCourseInformation } from "@/redux/slices/courseBuilderSlice";
import { syncUpdateCourseInfo } from "@/redux/slices/builderSync";

const DEBOUNCE_MS = 800;

export function useDebouncedCourseSave() {
  const dispatch = useAppDispatch();
  const courseId = useAppSelector((state) => state.courseBuilder.courseId);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debouncedSave = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      if (courseId) {
        dispatch(syncUpdateCourseInfo());
      }
    }, DEBOUNCE_MS);
  }, [dispatch, courseId]);

  const updateAndSave = useCallback(
    (patch: Parameters<typeof updateCourseInformation>[0]) => {
      dispatch(updateCourseInformation(patch));
      debouncedSave();
    },
    [dispatch, debouncedSave],
  );

  return { updateAndSave };
}
