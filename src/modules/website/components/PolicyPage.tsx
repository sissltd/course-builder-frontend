import { BackToTop } from "@/modules/website/components/BackToTop";

export interface PolicySection {
  id: string;
  title: string;
  type: "list" | "paragraph";
  body: string | string[];
}

interface PolicyPageProps {
  title: string;
  lastUpdated: string;
  intro: string;
  sections: PolicySection[];
}

export function PolicyPage({ title, lastUpdated, intro, sections }: PolicyPageProps) {
  return (
    <main className="scroll-smooth">
      <section className="bg-white">
        <div className="flex w-full flex-col items-center gap-4 pt-[92px]">
          <h1 className="text-center text-[34px] font-medium leading-none tracking-[-1.12px] text-sd-black md:text-[44px] lg:text-[56px]">
            {title}
          </h1>
          <span className="flex h-[32px] items-center justify-center rounded-full border-[0.5px] border-[#D9D9D9] bg-sd-grey-3/80 px-[10px] text-[12px] font-medium leading-4 text-sd-grey-11">
            Last Updated {lastUpdated}
          </span>
        </div>
      </section>

      <section className="bg-white pb-[80px] pt-[80px] lg:pb-[120px]">
        <div className="flex w-full flex-col gap-12 lg:flex-row lg:gap-10">
          <div className="min-w-0 flex-1">
            <p className="max-w-[769px] text-[16px] leading-[1.4] tracking-[-0.32px] text-sd-grey-11">
              {intro}
            </p>

            <div className="mt-12 flex flex-col gap-10">
              {sections.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="flex scroll-mt-24 flex-col gap-4"
                >
                  <h2 className="text-[24px] font-medium leading-[1.4] tracking-[-0.48px] text-sd-black">
                    {section.title}
                  </h2>
                  {section.type === "list" ? (
                    <ul className="list-disc">
                      {(section.body as string[]).map((item) => (
                        <li
                          key={item}
                          className="ms-[21px] text-[14px] leading-[1.4] tracking-[-0.28px] text-sd-grey-11"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[14px] leading-[1.4] tracking-[-0.28px] text-sd-grey-11">
                      {section.body as string}
                    </p>
                  )}
                </section>
              ))}
            </div>
          </div>

          <aside className="w-full shrink-0 lg:w-[273px]">
            <nav className="flex flex-col items-start lg:sticky lg:top-24">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="flex w-full items-center rounded-[8px] px-3 py-2 text-[14px] leading-[1.4] tracking-[-0.28px] text-sd-grey-11 transition-colors hover:bg-sd-grey-3/70 hover:text-sd-blue"
                >
                  {section.title}
                </a>
              ))}
            </nav>
          </aside>
        </div>
      </section>

      <BackToTop />
    </main>
  );
}
