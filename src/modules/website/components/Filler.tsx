import { ArrowRight } from "iconsax-react";
import Link from "next/link";

import { Button } from "@/components/shared/Button";
import { AuthRoute } from "@/lib/routes";

interface PageHeaderProps {
  title: string;
  subtitle: string;
}

export function FillerPageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <section className="bg-[#FDFDFF]">
      <div className="flex w-full flex-col items-center px-6 pb-16 pt-[88px] text-center md:px-10">
        <h1 className="max-w-[767px] text-[32px] font-medium leading-[1.15] tracking-[-0.96px] text-sd-black md:text-[48px]">
          {title}
        </h1>
        <p className="mt-5 max-w-[579px] text-[15px] leading-[1.4] text-sd-grey-11 md:text-[16px]">
          {subtitle}
        </p>
        <div className="mt-10">
          <Link href={AuthRoute.REGISTER}>
            <Button variant="app-primary" size="app" className="h-[44px] px-6 text-[14px]">
              Get started
              <ArrowRight variant="TwoTone" color="#FDFDFD" size={24} />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

interface FillerBlock {
  heading: string;
  body: string;
}

export function FillerPlaceholderBlocks({ blocks }: { blocks: FillerBlock[] }) {
  return (
    <section className="bg-white">
      <div className="flex w-full flex-col gap-6 px-6 py-20 md:px-10">
        {blocks.map((block) => (
          <div
            key={block.heading}
            className="flex flex-col gap-3 rounded-[24px] border border-sd-grey-3 bg-sd-grey-3/40 p-8"
          >
            <h2 className="text-[22px] font-medium leading-[1.2] text-sd-black md:text-[28px]">
              {block.heading}
            </h2>
            <p className="max-w-[720px] text-[15px] leading-[1.6] text-sd-grey-11 md:text-[16px]">
              {block.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
