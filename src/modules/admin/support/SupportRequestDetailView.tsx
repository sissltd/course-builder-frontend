"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CloseCircle, TickCircle } from "iconsax-react";
import { Button } from "@/components/shared/Button";
import { EmptyState } from "@/components/shared/EmptyState";
import { normalizeApiError } from "@/lib/api/errors";
import { AdminRoute } from "@/lib/routes";
import {
  SupportConversation,
  SupportRequestMeta,
  SupportResolveModal,
  SupportStatusBadge,
} from "@/modules/support/components";
import { useGetSupportRequestQuery } from "@/modules/support/hooks";
import { RESOLVABLE_STATUS } from "@/modules/support/types";
import { formatSupportDateTime, supportRequestTitle } from "@/modules/support/utils/format";

interface SupportRequestDetailViewProps {
  requestId: string;
}

/**
 * One support request in full: the record, the read-only thread, and — while it
 * is still open — the resolve action.
 *
 * Resolve is offered **only** while `status === "OPEN"`, because the backend
 * accepts it only then. Hiding it after the fact is not a UI nicety: an operator
 * who can still click it gets a 400 and has to work out what that meant.
 */
export const SupportRequestDetailView = ({
  requestId,
}: SupportRequestDetailViewProps) => {
  const router = useRouter();
  const [isResolveOpen, setIsResolveOpen] = useState(false);

  const { data: request, isLoading, error, refetch } =
    useGetSupportRequestQuery(requestId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="size-8 animate-spin rounded-full border-4 border-sd-grey-3 border-t-sd-blue" />
      </div>
    );
  }

  if (error) {
    const { message } = normalizeApiError(error as Parameters<typeof normalizeApiError>[0]);
    return (
      <EmptyState
        title="We couldn't load this request"
        description={message ?? undefined}
        actionLabel="Try again"
        onAction={() => void refetch()}
        icon={<CloseCircle size={24} variant="Linear" color="#FF5025" />}
      />
    );
  }

  if (!request) {
    return (
      <EmptyState
        title="Request not found"
        description="It may have been removed, or the link may be wrong."
        actionLabel="Back to queue"
        onAction={() => router.push(AdminRoute.SUPPORT)}
      />
    );
  }

  const canResolve = request.status === RESOLVABLE_STATUS;

  return (
    <div className="flex flex-col gap-[24px]">
      <div className="flex flex-wrap items-start justify-between gap-[16px]">
        <div className="flex flex-col gap-[8px] min-w-0">
          <Button
            type="button"
            variant="app-outline"
            size="xs"
            leftIcon={<ArrowLeft size={16} variant="Linear" color="#0A60E1" />}
            className="h-[32px] w-fit rounded-[8px] border-sd-grey-6 bg-white px-[12px] font-normal text-sd-blue"
            onClick={() => router.push(AdminRoute.SUPPORT)}
          >
            Back to queue
          </Button>
          <h1 className="text-[24px] font-medium leading-[32px] tracking-[-0.48px] text-[#202020]">
            {supportRequestTitle(request)}
          </h1>
          <div className="flex items-center gap-[8px]">
            <SupportStatusBadge status={request.status} />
            <span className="text-[12px] leading-[16px] text-sd-grey-11">
              {request.id}
            </span>
          </div>
        </div>

        {canResolve ? (
          <Button
            type="button"
            variant="app-primary"
            size="app"
            leftIcon={<TickCircle size={18} variant="Linear" color="#FDFDFD" />}
            className="h-[44px] shrink-0 rounded-[10px] px-[20px] font-normal"
            onClick={() => setIsResolveOpen(true)}
          >
            Resolve request
          </Button>
        ) : (
          <span className="max-w-[320px] text-[12px] leading-[16px] text-sd-grey-11">
            This request is no longer open, so it cannot be resolved again. It
            {request.resolved_at
              ? ` was resolved on ${formatSupportDateTime(request.resolved_at)}.`
              : " has been closed."}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-[24px] rounded-[20px] border border-sd-grey-3 bg-sd-grey-1 p-[20px]">
        <div className="flex flex-col gap-[12px]">
          <h2 className="text-[16px] font-medium leading-[24px] text-sd-grey-12">
            Request
          </h2>
          <SupportRequestMeta request={request} />
        </div>

        <div className="flex flex-col gap-[12px]">
          <h2 className="text-[16px] font-medium leading-[24px] text-sd-grey-12">
            Conversation
          </h2>
          <SupportConversation request={request} />
        </div>
      </div>

      <SupportResolveModal
        isOpen={isResolveOpen}
        onOpenChange={setIsResolveOpen}
        request={request}
      />
    </div>
  );
};
