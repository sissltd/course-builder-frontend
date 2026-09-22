"use client";

import React from "react";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { normalizeApiError } from "@/lib/api/errors";
import { useDeleteTopicMutation } from "@/modules/topics/api/topicsApi";
import type { Topic } from "@/modules/topics/types";

interface DeleteTopicModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  topic: Topic | null;
}

/**
 * Unlike Category, a topic has no deletion-impact preview and no strategy to
 * choose — a topic that still has courses is deleted and the FK left to the
 * database's own cascade/protect behaviour. That makes this a plain confirmation
 * rather than the multi-step flow `DeleteCategoryModal` needs.
 */
export const DeleteTopicModal = ({
  isOpen,
  onOpenChange,
  topic,
}: DeleteTopicModalProps) => {
  const [deleteTopic, { isLoading }] = useDeleteTopicMutation();

  const handleConfirm = async () => {
    if (!topic) return;

    try {
      await deleteTopic(topic.id).unwrap();
      toast.success("Topic deleted");
      onOpenChange(false);
    } catch (err) {
      const { message } = normalizeApiError(err as never);
      toast.error(message ?? "Could not delete topic");
    }
  };

  return (
    <ConfirmModal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open && isLoading) return;
        onOpenChange(open);
      }}
      variant="danger"
      title="Delete topic"
      description={
        topic
          ? `Delete “${topic.name}”? This cannot be undone. Courses already using this topic are affected. To retire it instead, set its status to Inactive — that stops new submissions and leaves existing courses alone.`
          : undefined
      }
      confirmLabel={isLoading ? "Deleting..." : "Delete topic"}
      cancelLabel="Cancel"
      isLoading={isLoading}
      onConfirm={handleConfirm}
    />
  );
};
