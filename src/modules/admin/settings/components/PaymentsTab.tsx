"use client";

import React from "react";
import { Bank, ArrowDown2 } from "iconsax-react";
import { Button as AppButton } from "@/components/shared/Button";
import { FormInput } from "@/components/form/FormInput";
import { FormSelect } from "@/components/form/FormSelect";

const providerOptions = [
  { label: "Paystack", value: "paystack" },
  { label: "Flutterwave", value: "flutterwave" },
  { label: "Stripe", value: "stripe" },
];

const Toggle = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
}) => (
  <label className="relative inline-flex h-[24px] w-[46px] shrink-0 cursor-pointer items-center">
    <input
      type="checkbox"
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
      className="peer sr-only"
    />
    <span className="absolute inset-0 rounded-full bg-sd-grey-6 transition-colors peer-checked:bg-sd-blue" />
    <span className="absolute left-[2px] top-[2px] size-[20px] rounded-full bg-white shadow transition-transform peer-checked:translate-x-[22px]" />
  </label>
);

export const PaymentsTab = () => {
  const [autoCreditDuration, setAutoCreditDuration] = React.useState("24hr");
  const [creatorVerification, setCreatorVerification] = React.useState(true);
  const [provider, setProvider] = React.useState("paystack");

  return (
    <div className="flex w-full flex-col gap-[34px]">
      <div className="flex flex-col gap-[6px]">
        <h3 className="text-[22px] font-medium text-sd-grey-12 tracking-[-0.44px] leading-[32px]">
          Payment
        </h3>
        <p className="text-[14px] font-normal text-sd-grey-11 leading-[24px]">
          Configure how payment is handled
        </p>
      </div>

      <div className="flex flex-col gap-[22px]">
        <div className="rounded-[16px] border border-sd-grey-3 bg-white px-[16px] py-[20px]">
          <div className="flex flex-col gap-[22px]">
            <span className="text-[14px] font-normal text-sd-grey-11 tracking-[-0.28px] leading-[20px]">
              CREATOR WALLET
            </span>

            <div className="flex items-start justify-between gap-[24px]">
              <div className="flex max-w-[420px] flex-col gap-[4px]">
                <h4 className="text-[16px] font-normal text-sd-grey-12 tracking-[-0.32px] leading-[24px]">
                  Payment auto-credit duration
                </h4>
                <p className="text-[14px] font-normal text-sd-grey-11 tracking-[-0.28px] leading-[20px]">
                  Set the number of hours required for a creator&apos;s wallet to get credited once course is approved
                </p>
              </div>

              <div className="w-[146px] shrink-0">
                <FormInput
                  name="payment-auto-credit-duration"
                  value={autoCreditDuration}
                  onChange={(event) => setAutoCreditDuration(event.target.value)}
                  className="h-[44px] rounded-[10px] border-[1.5px] border-sd-grey-6 bg-white text-[14px] text-sd-grey-10"
                />
              </div>
            </div>

            <div className="flex items-start justify-between gap-[24px]">
              <div className="flex max-w-[420px] flex-col gap-[4px]">
                <h4 className="text-[16px] font-normal text-sd-grey-12 tracking-[-0.32px] leading-[24px]">
                  Creator Verification
                </h4>
                <p className="text-[14px] font-normal text-sd-grey-11 tracking-[-0.28px] leading-[20px]">
                  Creators must pass KYC verification before they can initiate withdrawals
                </p>
              </div>

              <Toggle checked={creatorVerification} onChange={setCreatorVerification} />
            </div>
          </div>
        </div>

        <div className="rounded-[16px] border border-sd-grey-3 bg-white px-[16px] py-[20px]">
          <div className="flex flex-col gap-[20px]">
            <div className="flex items-start justify-between gap-[24px]">
              <div className="flex flex-col gap-[4px]">
                <h4 className="text-[16px] font-normal text-sd-grey-12 tracking-[-0.32px] leading-[24px]">
                  Payment provider
                </h4>
                <p className="text-[14px] font-normal text-sd-grey-11 tracking-[-0.28px] leading-[20px]">
                  Select a primary payment provider
                </p>
              </div>

              <div className="w-[196px] shrink-0">
                <FormSelect
                  name="payment-provider"
                  value={provider}
                  onValueChange={setProvider}
                  options={providerOptions}
                  triggerClassName="h-[44px] rounded-[10px] border-[1.5px] border-sd-grey-6 bg-white text-sd-grey-12 hover:bg-white"
                  suffix={<ArrowDown2 size={20} variant="Linear" color="var(--sd-grey-11)" />}
                />
              </div>
            </div>

            <div className="rounded-[12px] border border-sd-grey-3 bg-white px-[18px] py-[16px]">
              <div className="flex flex-col gap-[12px]">
                <span className="text-[14px] font-normal text-sd-grey-11 tracking-[-0.28px] leading-[20px]">
                  Paystack
                </span>

                <div className="flex items-center justify-between gap-[20px]">
                  <div className="flex items-center gap-[12px]">
                    <div className="flex size-[50px] items-center justify-center rounded-full bg-sd-secondary">
                      <Bank size={24} variant="Bulk" color="#1FA3E1" />
                    </div>

                    <div className="flex flex-col gap-[2px]">
                      <span className="text-[16px] font-normal text-sd-grey-12 tracking-[-0.32px] leading-[24px]">
                        Osaite Emmanuel
                      </span>
                      <span className="text-[14px] font-normal text-sd-grey-11 tracking-[-0.28px] leading-[20px]">
                        Access Bank - 1234567890
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="rounded-[8px] bg-sd-danger-soft px-[10px] py-[4px] text-[12px] font-normal text-sd-danger leading-[16px] cursor-pointer"
                  >
                    Remove account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <AppButton
          type="button"
          variant="app-primary"
          size="app"
          className="h-[44px] min-w-[151px] rounded-[10px] px-[24px] text-[14px] font-normal tracking-[-0.28px]"
        >
          Save changes
        </AppButton>
      </div>
    </div>
  );
};
