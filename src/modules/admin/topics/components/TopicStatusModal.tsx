"use client";

import React from "react";
import { TickCircle, CloseCircle } from "iconsax-react";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { normalizeApiError } from "@/lib/api/errors";
import { useUpdateTopicMutation } from "@/modules/topics/api/topicsApi";
import { TopicStatus, type Topic } from "@/modules/topics/types";

export type TopicStatusMode = "open" | "close";

interface TopicStatusModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  topic: Topic | null;
  mode: TopicStatusMode;
}

/**
 * Opening and closing a topic is a direct PATCH rather than a full edit, so it
 * gets its own confirmation: closing is the one action here that reads as
 * destructive but is not — it stops new submissions and leaves courses already
 * using the topic completely alone. That distinction is the whole point of the
 * copy, so it is said before the change rather than in a toast after it.
 */
export const TopicStatusModal = ({
  isOpen,
  onOpenChange,
  topic,
  mode,
}: TopicStatusModalProps) => {
  const [updateTopic, { isLoading }] = useUpdateTopicMutation();

  const isClosing = mode === "close";

  const handleConfirm = async () => {
    if (!topic) return;

    try {
      await updateTopic({
        id: topic.id,
        body: {
          status: isClosing ? TopicStatus.INACTIVE : TopicStatus.ACTIVE,
        },
      }).unwrap();
      toast.success(
        isClosing ? "Topic closed to submissions" : "Topic opened to submissions",
      );
      onOpenChange(false);
    } catch (err) {
      const { message } = normalizeApiError(err as never);
      toast.error(
        message ??
          (isClosing
            ? "Could not close the topic"
            : "Could not open the topic"),
      );
    }
  };

  return (
    <ConfirmModal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open && isLoading) return;
        onOpenChange(open);
      }}
      icon={
        isClosing ? (
          <CloseCircle variant="Bold" size={48} color="#D54800" />
        ) : (
          <TickCircle variant="Bold" size={48} color="#008500" />
        )
      }
      title={isClosing ? "Close to submissions" : "Open to submissions"}
      description={
        topic
          ? isClosing
            ? `“${topic.name}” will stop accepting new course submissions. Courses already using this topic are unaffected and keep the price they were submitted at.`
            : `Creators will be able to submit new courses under “${topic.name}” again.`
          : undefined
      }
      confirmLabel={
        isLoading
          ? isClosing
            ? "Closing..."
            : "Opening..."
          : isClosing
            ? "Close topic"
            : "Open topic"
      }
      cancelLabel="Cancel"
      isLoading={isLoading}
      onConfirm={handleConfirm}
    />
  );
};
