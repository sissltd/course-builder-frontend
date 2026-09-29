"use client";

import React, { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/shared/Button";
import { FormInput } from "@/components/form/FormInput";
import { FormSelect } from "@/components/form/FormSelect";
import { normalizeApiError } from "@/lib/api/errors";
import { useGetCoursesQuery, useLazyGetCoursesQuery } from "@/modules/creator/courses/hooks";
import type { CourseSummary } from "@/modules/creator/courses/types";
import { useCreateInviteMutation } from "../api/courseInvitesApi";
import { CollaboratorRole } from "../types";

const COURSE_PAGE_SIZE = 20;

const ROLE_OPTIONS = [
  { label: "Collaborator", value: CollaboratorRole.COLLABORATOR },
  { label: "Admin", value: CollaboratorRole.ADMIN },
];

interface AddCollaboratorModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAdded?: () => void;
}

/**
 * A course collaborator is always scoped to one course, so the course is picked
 * before the invitation is created — `POST /course-invites/` needs the
 * `course_id` up front.
 *
 * The course list is paged and accumulated locally rather than fetched whole:
 * a creator can have far more courses than a picker should hold, and
 * `FormSelect`'s search box filters whatever options it has been given.
 */
export const AddCollaboratorModal = ({
  isOpen,
  onOpenChange,
  onAdded,
}: AddCollaboratorModalProps) => {
  const [createInvite, { isLoading: isCreating }] = useCreateInviteMutation();
  const [fetchCourses, { isFetching: isLoadingMore }] = useLazyGetCoursesQuery();

  // Page 1 comes straight from the query hook; only "Show more" pages are
  // accumulated here, so nothing has to be fetched from an effect.
  const { data: firstPage } = useGetCoursesQuery(
    { page: 1, size: COURSE_PAGE_SIZE },
    { skip: !isOpen },
  );

  const [extraCourses, setExtraCourses] = useState<CourseSummary[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [courseId, setCourseId] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<CollaboratorRole>(
    CollaboratorRole.COLLABORATOR,
  );

  const handleLoadMore = useCallback(async () => {
    const nextPage = page + 1;
    const result = await fetchCourses({ page: nextPage, size: COURSE_PAGE_SIZE });
    const incoming = result.data?.data?.results ?? [];
    const paginator = result.data?.data?.paginator;

    setExtraCourses((current) => [
      ...current,
      // Guard against a page boundary shifting the same row into two pages,
      // which would render duplicate options.
      ...incoming.filter(
        (course) => !current.some((existing) => existing.id === course.id),
      ),
    ]);
    setHasMore(Boolean(paginator && nextPage < paginator.total_pages));
    setPage(nextPage);
  }, [fetchCourses, page]);

  const courses = useMemo(() => {
    const first = firstPage?.data?.results ?? [];
    return [
      ...first,
      ...extraCourses.filter(
        (course) => !first.some((existing) => existing.id === course.id),
      ),
    ];
  }, [firstPage, extraCourses]);

  const isFetching = isLoadingMore || Boolean(firstPage && !firstPage.data);

  const courseOptions = useMemo(
    () => courses.map((course) => ({ label: course.title, value: course.id })),
    [courses],
  );

  const selectedCourseLabel = useMemo(
    () => courseOptions.find((option) => option.value === courseId)?.label,
    [courseOptions, courseId],
  );

  const reset = () => {
    setExtraCourses([]);
    setPage(1);
    setHasMore(false);
    setCourseId("");
    setEmail("");
    setRole(CollaboratorRole.COLLABORATOR);
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  const handleSubmit = async () => {
    const trimmedEmail = email.trim();
    if (!courseId) {
      toast.error("Please select the course this collaborator is joining.");
      return;
    }
    if (!trimmedEmail) {
      toast.error("Please enter the collaborator's email address.");
      return;
    }

    try {
      await createInvite({
        course_id: courseId,
        email: trimmedEmail,
        role,
      }).unwrap();
      toast.success(`${trimmedEmail} was invited to the course.`);
      onAdded?.();
      handleClose();
    } catch (error) {
      const { fieldErrors, message } = normalizeApiError(error as never);
      const fieldMessage = fieldErrors.email ?? fieldErrors.course_id;
      if (fieldMessage) toast.error(fieldMessage);
      toast.error(message ?? "Could not send this invitation.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
      title="Add a collaborator"
      description="Choose the course, then invite someone to work on it with you."
      showCloseButton={false}
    >
      <div className="flex flex-col gap-[20px] mt-[8px]">
        <FormSelect
          name="course_id"
          label="Course"
          placeholder={
            isFetching && courses.length === 0
              ? "Loading courses..."
              : "Select a course"
          }
          options={courseOptions}
          value={courseId}
          onValueChange={(value) => setCourseId(value)}
          triggerValue={() => selectedCourseLabel ?? undefined}
          searchable
          searchPlaceholder="Search courses"
          emptyText="No courses match that search"
          required
          hasMore={hasMore}
          isLoadingMore={isLoadingMore}
          onLoadMore={() => void handleLoadMore()}
          hint={
            hasMore
              ? "Showing courses as you page through — use Show more for more."
              : undefined
          }
        />

        <FormInput
          name="email"
          label="Email address"
          placeholder="person@example.com"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          hint="They will receive an invitation and can accept it once they sign up."
        />

        <FormSelect
          name="role"
          label="Role"
          placeholder="Select role"
          options={ROLE_OPTIONS}
          value={role}
          onValueChange={(value) => setRole(value as CollaboratorRole)}
        />

        <div className="flex gap-[12px]">
          <Button
            variant="app-outline"
            className="flex-1 h-[44px]"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            variant="app-primary"
            className="flex-1 h-[44px]"
            isLoading={isCreating}
            onClick={handleSubmit}
          >
            Send invitation
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddCollaboratorModal;
