"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Call } from "iconsax-react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Country } from "country-state-city";
import { FormInput } from "@/components/form/FormInput";
import { FormSelect } from "@/components/form/FormSelect";
import { FormTextarea } from "@/components/form/FormTextarea";

const contactSchema = z.object({
  firstName: z.string().min(2, "Enter your first name"),
  lastName: z.string().min(2, "Enter your last name"),
  email: z.string().email("Enter a valid email address"),
  country: z.string().min(1, "Select your country/region"),
  message: z.string().min(10, "Enter a message"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const COUNTRY_OPTIONS = Country.getAllCountries().map((country) => ({
  label: country.name,
  value: country.isoCode,
}));

export function ContactHero() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: "onBlur",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      country: "",
      message: "",
    },
  });

  const onSubmit = methods.handleSubmit(async () => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      toast.success("Thanks for reaching out! We'll get back to you soon.");
      methods.reset();
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(157.54deg,#FFFFFF_51.49%,#F5F9FF_77.39%,#FFFFFF_105.93%)]">
      <div className="relative z-10 mx-auto flex w-full max-w-[767px] flex-col items-center pt-[92px]">
        <div className="flex flex-col items-center gap-[16px] text-center">
          <div className="flex h-[32px] items-center gap-2 rounded-full bg-[#F5F9FF] px-[10px]">
            <Call variant="Bold" color="#0A60E1" size={16} />
            <span className="text-[12px] font-medium leading-4 text-[#0A60E1]">
              Contact us
            </span>
          </div>
          <h1 className="max-w-[717px] text-[34px] font-medium leading-[1.08] tracking-[-1.12px] text-sd-black md:text-[44px] lg:text-[56px] lg:leading-none">
            We&apos;re so excited to hear from you
          </h1>
          <p className="max-w-[767px] text-[16px] leading-[1.4] tracking-[-0.32px] text-sd-grey-11">
            We&apos;re a company founded in the heart of Nigeria, Abuja
          </p>
        </div>

        <FormProvider {...methods}>
          <form
            onSubmit={onSubmit}
            className="mt-[40px] flex w-full max-w-[444px] flex-col gap-[32px] rounded-[16px] border border-[#F0F0F0] bg-[#FDFDFF] p-[24px]"
          >
            <div className="flex flex-col gap-[16px]">
              <FormInput
                name="firstName"
                label="First name"
                placeholder="Enter full name"
              />
              <FormInput
                name="lastName"
                label="Last name"
                placeholder="Enter address"
              />
              <FormInput
                name="email"
                label="Email address"
                placeholder="Enter email address"
                type="email"
              />
              <FormSelect
                name="country"
                label="Country/region"
                placeholder="Select country/region"
                searchable
                searchPlaceholder="Search country"
                options={COUNTRY_OPTIONS}
              />
              <FormTextarea
                name="message"
                label="Message"
                placeholder="Enter message"
                rows={3}
                className="min-h-[78px]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-[44px] w-full items-center justify-center rounded-[8px] bg-[#0063EF] text-[14px] tracking-[-0.28px] text-[#FDFDFD] transition-colors hover:bg-[#0057d4] disabled:opacity-60"
            >
              {isSubmitting ? "Sending..." : "Submit"}
            </button>
          </form>
        </FormProvider>
      </div>

      <Image
        src="/images/products/contact/hero-vector.svg"
        alt=""
        width={1567}
        height={697}
        className="pointer-events-none absolute bottom-0 left-[40px] h-auto w-[1567px] max-w-none"
      />
    </section>
  );
}
