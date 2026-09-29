"use client";

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { DirectInbox, TickCircle } from "iconsax-react";

import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/shared/Button";
import { FormInput } from "@/components/form/FormInput";
import { useChangeEmailMutation } from "@/modules/auth/api/accountApi";
import { normalizeApiError } from "@/lib/api/errors";

const changeEmailSchema = z.object({
  new_email: z
    .string()
    .min(1, "Enter a new email address.")
    .email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

type ChangeEmailFormData = z.infer<typeof changeEmailSchema>;

interface ChangeEmailFlowProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  /** Fired once the confirmation link has actually been sent. */
  onSuccess?: () => void;
}

type Stage = "form" | "sent";

/**
 * Two stages, because that is all the API does. `POST /auth/change-email/`
 * proves identity with the current password and mails a confirmation link; the
 * email is not applied until that link is opened. There is deliberately no
 * "enter the code we sent you" step — the token travels in the link.
 */
export const ChangeEmailFlow = ({
  isOpen,
  onOpenChange,
  onSuccess,
}: ChangeEmailFlowProps) => {
  const { data: session } = useSession();
  const [changeEmail, { isLoading }] = useChangeEmailMutation();
  const [stage, setStage] = useState<Stage>("form");
  const [sentTo, setSentTo] = useState("");

  const currentEmail = session?.user?.email ?? "";

  const methods = useForm<ChangeEmailFormData>({
    resolver: zodResolver(changeEmailSchema),
    mode: "onBlur",
    defaultValues: { new_email: "", password: "" },
  });

  const { handleSubmit, reset, setError } = methods;

  const close = () => {
    setStage("form");
    setSentTo("");
    reset({ new_email: "", password: "" });
    onOpenChange(false);
  };

  const onSubmit = handleSubmit(async (data) => {
    if (data.new_email.trim().toLowerCase() === currentEmail.toLowerCase()) {
      setError("new_email", {
        message: "This is already your current email address.",
      });
      return;
    }

    try {
      const { detail } = await changeEmail({
        new_email: data.new_email.trim(),
        password: data.password,
      }).unwrap();

      setSentTo(data.new_email.trim());
      setStage("sent");
      toast.success(detail || "Confirmation link sent — check your new inbox.");
      onSuccess?.();
    } catch (error) {
      const { fieldErrors, message } = normalizeApiError(error as never);
      for (const [field, fieldMessage] of Object.entries(fieldErrors)) {
        setError(field as keyof ChangeEmailFormData, {
          type: "server",
          message: fieldMessage,
        });
      }
      toast.error(message ?? "Could not change your email address.");
    }
  });

  return (
    <>
      <Modal
        isOpen={isOpen && stage === "form"}
        onOpenChange={(open) => {
          if (!open) close();
        }}
        title="Change email address"
        description="Confirm with your current password. We will send a confirmation link to the new address."
        showCloseButton={false}
      >
        <FormProvider {...methods}>
          <form onSubmit={onSubmit} className="flex flex-col gap-[20px] mt-[8px]">
            <FormInput
              name="new_email"
              label="New email address"
              placeholder="person@example.com"
              type="email"
              required
              hint={
                currentEmail
                  ? `Currently signed in as ${currentEmail}`
                  : undefined
              }
            />
            <FormInput
              name="password"
              label="Current password"
              placeholder="Confirm with your password"
              type="password"
              required
            />
            <div className="flex gap-[12px]">
              <Button
                type="button"
                variant="app-outline"
                className="flex-1 h-[44px]"
                onClick={close}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="app-primary"
                className="flex-1 h-[44px]"
                isLoading={isLoading}
              >
                Send confirmation link
              </Button>
            </div>
          </form>
        </FormProvider>
      </Modal>

      <Modal
        isOpen={isOpen && stage === "sent"}
        onOpenChange={(open) => {
          if (!open) close();
        }}
        title="Check your new inbox"
        showCloseButton={false}
      >
        <div className="flex flex-col items-center text-center gap-[24px] py-[8px]">
          <div className="size-[72px] rounded-full bg-[#EBF3FF] flex items-center justify-center text-[#0063EF]">
            <DirectInbox size={36} variant="Bold" color="currentColor" />
          </div>
          <div className="flex flex-col gap-[8px]">
            <p className="text-[20px] font-semibold text-[#202020]">
              Confirmation link sent
            </p>
            <p className="text-[14px] text-[#606060] leading-[20px]">
              {sentTo
                ? `Open the link we sent to ${sentTo} to finish changing your email address.`
                : "Open the link we sent to finish changing your email address."}
            </p>
            <p className="text-[14px] text-[#606060] leading-[20px]">
              Your current email still works until the link is opened.
            </p>
          </div>
          <div className="flex gap-[12px] w-full">
            <Button
              variant="app-outline"
              className="flex-1 h-[44px]"
              onClick={() => {
                setStage("form");
              }}
            >
              Use a different address
            </Button>
            <Button
              variant="app-primary"
              className="flex-1 h-[44px]"
              onClick={close}
              leftIcon={<TickCircle size={18} variant="Bold" color="currentColor" />}
            >
              Done
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ChangeEmailFlow;
