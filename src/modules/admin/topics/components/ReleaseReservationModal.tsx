"use client";

import React from "react";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { normalizeApiError } from "@/lib/api/errors";
import { useReleaseTopicReservationMutation } from "@/modules/topics/api/topicsApi";
import type { Topic } from "@/modules/topics/types";

interface ReleaseReservationModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  topic: Topic | null;
}

/**
 * Frees a topic for a new reservation request before its current one has expired
 * — the case being a creator who reserved a topic and then went inactive.
 *
 * The endpoint is idempotent, so a success here does not prove a reservation
 * existed. The action is only reachable for a topic the list reported as
 * reserved, which is the real guard.
 */
export const ReleaseReservationModal = ({
  isOpen,
  onOpenChange,
  topic,
}: ReleaseReservationModalProps) => {
  const [releaseReservation, { isLoading }] =
    useReleaseTopicReservationMutation();

  const handleConfirm = async () => {
    if (!topic) return;

    try {
      await releaseReservation(topic.id).unwrap();
      toast.success("Reservation released");
      onOpenChange(false);
    } catch (err) {
      const { message } = normalizeApiError(err as never);
      toast.error(message ?? "Could not release the reservation");
    }
  };

  return (
    <ConfirmModal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open && isLoading) return;
        onOpenChange(open);
      }}
      title="Release reservation"
      description={
        topic
          ? `Free “${topic.name}” for a new reservation request now, even if the current reservation has not expired. The creator holding it loses it immediately.`
          : undefined
      }
      confirmLabel={isLoading ? "Releasing..." : "Release reservation"}
      cancelLabel="Cancel"
      isLoading={isLoading}
      onConfirm={handleConfirm}
    />
  );
};
