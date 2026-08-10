"use client";

import React from "react";
import { Button as AppButton } from "@/components/shared/Button";
import { FormInput } from "@/components/form/FormInput";

type PlatformField = {
  id: string;
  title: string;
  description: string;
  value: string;
};

type PlatformSection = {
  title: string;
  fields: PlatformField[];
};

const initialSections: PlatformSection[] = [
  {
    title: "TIMING & THRESHOLDS",
    fields: [
      {
        id: "draft-minimum-hold-time",
        title: "Draft minimum hold time",
        description: "Set the number of hours required for a course to stay in draft",
        value: "48hr",
      },
      {
        id: "topic-reservation-expiration",
        title: "Topic reservation expiration",
        description: "Set how long you want topic to return to the available pool after days of inactivity",
        value: "48hr",
      },
      {
        id: "topic-reservation-expiration-two",
        title: "Topic reservation expiration",
        description: "Set how long you want topic to return to the available pool after days of inactivity",
        value: "48hr",
      },
    ],
  },
  {
    title: "REVIEW",
    fields: [
      {
        id: "review-sla-admin-alert",
        title: "Review SLA - admin alert",
        description: "Admin is alerted when a course has been in review without a decision",
        value: "48hr",
      },
      {
        id: "flagging-hour",
        title: "Flagging hour",
        description: "Course is auto-flagged if no decision is made within this period",
        value: "48hr",
      },
    ],
  },
];

export const PlatformTab = () => {
  const [sections, setSections] = React.useState(initialSections);

  const handleFieldChange = (fieldId: string, nextValue: string) => {
    setSections((current) =>
      current.map((section) => ({
        ...section,
        fields: section.fields.map((field) =>
          field.id === fieldId ? { ...field, value: nextValue } : field
        ),
      }))
    );
  };

  return (
    <div className="flex w-full flex-col gap-[34px]">
      <div className="flex flex-col gap-[6px]">
        <h3 className="text-[22px] font-medium text-sd-grey-12 tracking-[-0.44px] leading-[32px]">
          Platform settings
        </h3>
        <p className="max-w-[510px] text-[14px] font-normal text-sd-grey-11 leading-[24px]">
          Configure operational rules that governs creator and course behavior
        </p>
      </div>

      <div className="flex flex-col gap-[40px]">
        {sections.map((section) => (
          <div key={section.title} className="rounded-[16px] border border-sd-grey-3 bg-white px-[16px] py-[20px]">
            <div className="flex flex-col gap-[20px]">
              <span className="text-[14px] font-normal text-sd-grey-11 tracking-[-0.28px] leading-[20px]">
                {section.title}
              </span>

              <div className="flex flex-col gap-[18px]">
                {section.fields.map((field) => (
                  <div key={field.id} className="flex items-start justify-between gap-[24px]">
                    <div className="flex max-w-[430px] flex-col gap-[4px]">
                      <h4 className="text-[16px] font-normal text-sd-grey-12 tracking-[-0.32px] leading-[24px]">
                        {field.title}
                      </h4>
                      <p className="text-[14px] font-normal text-sd-grey-11 tracking-[-0.28px] leading-[20px]">
                        {field.description}
                      </p>
                    </div>

                    <div className="w-[146px] shrink-0">
                      <FormInput
                        name={field.id}
                        value={field.value}
                        onChange={(event) => handleFieldChange(field.id, event.target.value)}
                        className="h-[44px] rounded-[10px] border-[1.5px] border-sd-grey-6 bg-white text-[14px] text-sd-grey-10"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
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
