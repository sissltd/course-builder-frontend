import Link from "next/link";

import { NewsletterForm } from "@/modules/website/components/NewsletterForm";
import { PageContainer } from "@/modules/website/components/PageContainer";
import { FOOTER_COLUMNS } from "@/modules/website/data/content";

const SOCIALS = [
  { label: "Instagram", src: "/assets/website/social-instagram.svg" },
  { label: "LinkedIn", src: "/assets/website/social-linkedin.svg" },
  { label: "X", src: "/assets/website/social-x.svg" },
];

export function Footer() {
  return (
    <footer>
      <div className="bg-white">
        <PageContainer>
          <div className="flex w-full flex-col gap-12 pb-16 pt-[67px] lg:flex-row lg:justify-between">
          <div className="w-full max-w-[362px]">
            <div className="flex flex-col items-start gap-[21px]">
              <img
                src="/assets/auth/logo.png"
                alt="SoluDesks"
                className=" w-[180px] ml-[-15px] object-contain"
              />
              <p className="text-[14px] leading-[1.4]  mt-[-30px] text-sd-grey-11">
                The unified operating system for modern
                <br />
                organizations and ambitious learners.
              </p>
              <div className="flex items-center gap-[6px]">
                {SOCIALS.map((social) => (
                  <a
                    key={social.label}
                    href="#"
                    aria-label={social.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-sd-grey-3/70"
                  >
                    <img src={social.src} alt="" className="h-6 w-6" />
                  </a>
                ))}
              </div>
            </div>
            <p className="mt-6 text-[14px] leading-[1.4] text-sd-grey-11">
              © 2026 SoluDesks. All rights reserved.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-[30px] gap-y-10">
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.title} className="flex w-[162px] flex-col items-start gap-2">
                <p className="flex h-[40px] items-center rounded-full px-3 py-2 text-[14px] font-semibold leading-5 text-sd-grey-11">
                  {column.title}
                </p>
                {column.links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="flex h-[40px] w-full items-center rounded-full px-3 py-2 text-[14px] leading-5 text-sd-grey-11 transition-colors hover:bg-sd-grey-3/70"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
          </div>
        </PageContainer>
      </div>

      <div className="bg-white pb-[80px] pt-[80px]">
        <PageContainer>
          <div className="flex w-full flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-[500px]">
              <h2 className="text-[28px] font-medium leading-[1.2] tracking-[-0.8px] text-sd-black md:text-[40px]">
                Don&apos;t miss out from our updates
              </h2>
              <p className="mt-4 text-[15px] leading-[1.4] tracking-[-0.32px] text-sd-grey-11 md:text-[16px]">
                Get regular updates from your team. Subscribe to our newsletter
              </p>
            </div>
            <div className="w-full max-w-[480px]">
              <NewsletterForm />
            </div>
          </div>
        </PageContainer>
      </div>
    </footer>
  );
}
