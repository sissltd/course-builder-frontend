"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Copy, ShieldTick, Warning2 } from "iconsax-react";

import { Button } from "@/components/shared/Button";
import { Modal } from "@/components/shared/Modal";
import { FormInput } from "@/components/form/FormInput";
import { normalizeApiError } from "@/lib/api/errors";
import {
  useConfirmMfaEnrollMutation,
  useDisableMfaMutation,
  useRegenerateRecoveryCodesMutation,
  useStartMfaEnrollMutation,
} from "@/modules/auth/api/mfaApi";
import type { MfaEnrollResponse } from "@/modules/auth/types/auth";

type Stage = "idle" | "scan" | "recovery" | "disable" | "regenerate";

const copyToClipboard = async (text: string, label: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(`${label} copied.`);
  } catch {
    toast.error("Could not copy to the clipboard.");
  }
};

const RecoveryCodes = ({
  codes,
  onDone,
}: {
  codes: string[];
  onDone: () => void;
}) => (
  <div className="flex flex-col gap-[20px] py-[8px]">
    <div className="flex items-start gap-[10px] rounded-[10px] border border-[#F79009] bg-[#FFFAEB] px-[14px] py-[12px]">
      <Warning2
        variant="Bold"
        color="#B54708"
        size={20}
        className="mt-[1px] shrink-0"
      />
      <p className="text-[14px] leading-[20px] text-[#B54708]">
        Save these now. Each code works once and they cannot be shown again —
        if you lose them you will have to turn two-factor off and set it up
        again.
      </p>
    </div>

    <div className="grid grid-cols-2 gap-[8px]">
      {codes.map((code) => (
        <span
          key={code}
          className="rounded-[8px] border border-sd-grey-6 bg-sd-grey-1 px-[12px] py-[10px] text-center font-mono text-[15px] text-sd-grey-12"
        >
          {code}
        </span>
      ))}
    </div>

    <Button
      variant="app-outline"
      className="w-full h-[44px]"
      leftIcon={<Copy size={18} variant="Bold" color="currentColor" />}
      onClick={() => copyToClipboard(codes.join("\n"), "Recovery codes")}
    >
      Copy all codes
    </Button>

    <Button variant="app-primary" className="w-full h-[44px]" onClick={onDone}>
      I&apos;ve saved them
    </Button>
  </div>
);

/** A live TOTP code is the credential for every action past enrollment. */
const CodePrompt = ({
  confirmLabel,
  isLoading,
  error,
  onConfirm,
  onCancel,
}: {
  confirmLabel: string;
  isLoading: boolean;
  error: string | null;
  onConfirm: (code: string) => void;
  onCancel: () => void;
}) => {
  const [code, setCode] = useState("");

  const submit = () => {
    if (!code.trim()) return;
    onConfirm(code.trim());
  };

  return (
    <div className="flex flex-col gap-[20px] mt-[8px]">
      {error && (
        <p role="alert" className="text-[14px] text-[#FF5025] leading-[20px]">
          {error}
        </p>
      )}
      <FormInput
        name="mfaActionCode"
        label="6-digit code"
        placeholder="000000"
        value={code}
        onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={6}
        autoFocus
        required
      />
      <div className="flex gap-[12px]">
        <Button variant="app-outline" className="flex-1 h-[44px]" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          variant="app-primary"
          className="flex-1 h-[44px]"
          isLoading={isLoading}
          onClick={submit}
          disabled={code.trim().length === 0}
        >
          {confirmLabel}
        </Button>
      </div>
    </div>
  );
};

export const MfaSection = () => {
  const [startEnroll, { isLoading: isStarting }] = useStartMfaEnrollMutation();
  const [confirmEnroll, { isLoading: isConfirming }] =
    useConfirmMfaEnrollMutation();
  const [disableMfa, { isLoading: isDisabling }] = useDisableMfaMutation();
  const [regenerate, { isLoading: isRegenerating }] =
    useRegenerateRecoveryCodesMutation();

  const [stage, setStage] = useState<Stage>("idle");
  const [enrollment, setEnrollment] = useState<MfaEnrollResponse | null>(null);
  const [setupCode, setSetupCode] = useState("");
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setStage("idle");
    setEnrollment(null);
    setSetupCode("");
    setRecoveryCodes([]);
    setError(null);
  };

  const handleStart = async () => {
    setError(null);
    try {
      const result = await startEnroll().unwrap();
      setEnrollment(result);
      setStage("scan");
    } catch (err) {
      const { message } = normalizeApiError(err as never);
      setError(message ?? "Could not start two-factor setup.");
    }
  };

  const handleConfirmEnroll = async () => {
    if (!setupCode.trim()) return;
    setError(null);
    try {
      const result = await confirmEnroll({ code: setupCode.trim() }).unwrap();
      setRecoveryCodes(result.recovery_codes);
      setStage("recovery");
    } catch (err) {
      const { message } = normalizeApiError(err as never);
      setError(
        message ?? "That code was not accepted. Check it and try again.",
      );
    }
  };

  const handleDisable = async (code: string) => {
    setError(null);
    try {
      await disableMfa({ code }).unwrap();
      reset();
      toast.success("Two-factor authentication is off.");
    } catch (err) {
      const { message } = normalizeApiError(err as never);
      setError(
        message ??
          "Could not turn off two-factor authentication. It cannot be disabled on an administrator account.",
      );
    }
  };

  const handleRegenerate = async (code: string) => {
    setError(null);
    try {
      const result = await regenerate({ code }).unwrap();
      setRecoveryCodes(result.recovery_codes);
      setStage("recovery");
    } catch (err) {
      const { message } = normalizeApiError(err as never);
      setError(message ?? "Could not generate new recovery codes.");
    }
  };

  const closeModal = () => reset();

  return (
    <div className="flex flex-col gap-[16px]">
      <p className="text-[16px] font-semibold text-[#202020] tracking-[-0.32px]">
        Two-factor authentication
      </p>
      <div className="flex flex-col gap-[8px]">
        <p className="text-[14px] text-[#636363] leading-[20px]">
          Add a second step to sign in. After entering your password you will be
          asked for a 6-digit code from your authenticator app.
        </p>
        <p className="text-[14px] text-[#636363] leading-[20px]">
          Required for administrator accounts.
        </p>
      </div>

      <div className="flex gap-[12px] justify-end">
        <Button
          variant="app-outline"
          className="h-[44px] px-[24px] text-[14px]"
          onClick={() => {
            setError(null);
            setStage("regenerate");
          }}
        >
          New recovery codes
        </Button>
        <Button
          variant="app-outline"
          className="h-[44px] px-[24px] text-[14px]"
          onClick={() => {
            setError(null);
            setStage("disable");
          }}
        >
          Turn off
        </Button>
        <Button
          variant="app-primary"
          className="h-[44px] px-[24px] text-[14px]"
          leftIcon={<ShieldTick size={18} variant="Bold" color="currentColor" />}
          isLoading={isStarting}
          onClick={handleStart}
        >
          {isStarting ? "Starting..." : "Set up"}
        </Button>
      </div>

      <Modal
        isOpen={stage === "scan"}
        onOpenChange={(open) => {
          if (!open) closeModal();
        }}
        title="Scan this code"
        description="Scan it with your authenticator app, then enter the code it shows."
        showCloseButton={false}
        className="sm:max-w-[460px]"
      >
        <div className="flex flex-col gap-[20px] mt-[8px]">
          {enrollment && (
            <div className="flex flex-col items-center gap-[12px]">
              {/* eslint-disable-next-line @next/next/no-img-element -- runtime base64 payload from the API, not a static asset */}
              <img
                src={`data:image/png;base64,${enrollment.qr_code_base64}`}
                alt="Authenticator setup QR code"
                className="size-[196px] rounded-[12px] border border-[#F0F0F0] bg-white p-[8px]"
              />
              <p className="text-[13px] text-[#636363] leading-[18px] text-center">
                Cannot scan? Enter this key manually in your app:
              </p>
              <button
                type="button"
                onClick={() => copyToClipboard(enrollment.secret, "Setup key")}
                className="flex items-center gap-[8px] rounded-[8px] border border-sd-grey-6 bg-sd-grey-1 px-[12px] py-[8px] font-mono text-[14px] text-sd-grey-12 hover:bg-sd-grey-2"
              >
                {enrollment.secret}
                <Copy size={16} variant="Linear" color="#606060" />
              </button>
            </div>
          )}

          {error && (
            <p role="alert" className="text-[14px] text-[#FF5025] leading-[20px]">
              {error}
            </p>
          )}

          <FormInput
            name="mfaSetupCode"
            label="6-digit code"
            placeholder="000000"
            value={setupCode}
            onChange={(e) =>
              setSetupCode(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            autoFocus
            required
          />

          <div className="flex gap-[12px]">
            <Button
              variant="app-outline"
              className="flex-1 h-[44px]"
              onClick={closeModal}
            >
              Cancel
            </Button>
            <Button
              variant="app-primary"
              className="flex-1 h-[44px]"
              isLoading={isConfirming}
              disabled={setupCode.trim().length === 0}
              onClick={handleConfirmEnroll}
            >
              Confirm
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={stage === "recovery"}
        onOpenChange={(open) => {
          if (!open) closeModal();
        }}
        title="Save your recovery codes"
        showCloseButton={false}
        className="sm:max-w-[460px]"
      >
        <RecoveryCodes
          codes={recoveryCodes}
          onDone={() => {
            const wasEnrollment = enrollment !== null;
            reset();
            toast.success(
              wasEnrollment
                ? "Two-factor authentication is on."
                : "New recovery codes generated.",
            );
          }}
        />
      </Modal>

      <Modal
        isOpen={stage === "disable"}
        onOpenChange={(open) => {
          if (!open) closeModal();
        }}
        showCloseButton={false}
        className="sm:max-w-[420px]"
      >
        <CodePrompt
          confirmLabel="Turn off"
          isLoading={isDisabling}
          error={error}
          onConfirm={handleDisable}
          onCancel={closeModal}
        />
      </Modal>

      <Modal
        isOpen={stage === "regenerate"}
        onOpenChange={(open) => {
          if (!open) closeModal();
        }}
        showCloseButton={false}
        className="sm:max-w-[420px]"
      >
        <CodePrompt
          confirmLabel="Generate"
          isLoading={isRegenerating}
          error={error}
          onConfirm={handleRegenerate}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
};
