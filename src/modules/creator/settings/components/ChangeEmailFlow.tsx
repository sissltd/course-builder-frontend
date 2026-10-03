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
  onSuccess?: () => void;
}

type Stage = "form" | "sent";

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
    const newEmail = data.new_email.trim();

    if (newEmail.toLowerCase() === currentEmail.toLowerCase()) {
      setError("new_email", {
        message: "This is already your current email address.",
      });
      return;
    }

    try {
      const result = await changeEmail({
        new_email: newEmail,
        password: data.password,
      }).unwrap();

      setSentTo(newEmail);
      setStage("sent");
      toast.success(
        result.detail || "Confirmation link sent — check your new inbox.",
      );
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
          <form onSubmit={onSubmit} className="mt-[8px] flex flex-col gap-[20px]">
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
                className="h-[44px] flex-1"
                disabled={isLoading}
                onClick={close}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="app-primary"
                className="h-[44px] flex-1"
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
        <div className="flex flex-col items-center gap-[24px] py-[8px] text-center">
          <div className="flex size-[72px] items-center justify-center rounded-full bg-[#EBF3FF] text-[#0063EF]">
            <DirectInbox size={36} variant="Bold" color="currentColor" />
          </div>
          <div className="flex flex-col gap-[8px]">
            <p className="text-[20px] font-semibold text-[#202020]">
              Confirmation link sent
            </p>
            <p className="text-[14px] leading-[20px] text-[#606060]">
              {sentTo
                ? `Open the link we sent to ${sentTo} to finish changing your email address.`
                : "Open the link we sent to finish changing your email address."}
            </p>
            <p className="text-[14px] leading-[20px] text-[#606060]">
              Your current email still works until the link is opened.
            </p>
          </div>
          <div className="flex w-full gap-[12px]">
            <Button
              type="button"
              variant="app-outline"
              className="h-[44px] flex-1"
              onClick={() => setStage("form")}
            >
              Use a different address
            </Button>
            <Button
              type="button"
              variant="app-primary"
              className="h-[44px] flex-1"
              onClick={close}
              leftIcon={
                <TickCircle size={18} variant="Bold" color="currentColor" />
              }
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
