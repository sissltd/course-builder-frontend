import Image from "next/image";

const BULLETS = [
  "Quality that holds up — every course is reviewed against standards that protect learners and reward creators.",
  "Fair pay, clearly stated — published compensation rates before you write a single word.",
  "Trust, both ways — verified creators, transparent decisions, and payment on approval.",
  "Reach beyond one market — courses can be localized into French, Yoruba, Igbo, Hausa, Nigerian Pidgin, and Akan/Twi.",
];

export function AboutStory() {
  return (
    <section className="bg-white">
      <div className="flex w-full flex-col gap-[60px] py-[80px] lg:py-[120px]">
        <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2 md:items-center">
          <div className="flex max-w-[547px] flex-col items-start gap-5">
            <h3 className="text-[24px] font-medium leading-[1.2] tracking-[-0.64px] text-sd-black md:text-[32px]">
              Why we built SoluDesks
            </h3>
            <p className="text-[16px] leading-[1.4] tracking-[-0.32px] text-sd-grey-11">
              Experts have valuable knowledge, but building and selling a course is hard. We
              built the Course Creator Studio to remove the friction — for creators and for
              learners.
            </p>
            <ul className="flex flex-col gap-3">
              {BULLETS.map((bullet) => (
                <li
                  key={bullet}
                  className="flex items-start gap-3 text-[15px] leading-[1.4] tracking-[-0.32px] text-sd-grey-11 md:text-[16px]"
                >
                  <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-sd-blue" />
                  {bullet}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative min-h-[531px] w-full overflow-hidden rounded-[24px]">
            <Image
              src="/images/products/about/about-story-1.png"
              alt="Why we built SoluDesks"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
              style={{ objectPosition: "50% 22.6%" }}
            />
          </div>
        </div>

        <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2 md:items-center">
          <div className="order-2 relative min-h-[541px] w-full overflow-hidden rounded-[24px] md:order-1">
            <Image
              src="/images/products/about/about-story-2.png"
              alt="Where we're headed"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
              style={{ objectPosition: "7.5% 50%" }}
            />
          </div>

          <div className="order-1 flex max-w-[547px] flex-col items-start gap-5 md:order-2">
            <h3 className="text-[24px] font-medium leading-[1.2] tracking-[-0.64px] text-sd-black md:text-[32px]">
              Where we&apos;re headed
            </h3>
            <p className="text-[16px] leading-[1.4] tracking-[-0.32px] text-sd-grey-11">
              Course Creator Studio is the foundation of a larger platform — one that will also
              connect creators to collaborators, help learners get direct answers from their
              courses, and bring enterprise learning catalogues to teams that need them.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
