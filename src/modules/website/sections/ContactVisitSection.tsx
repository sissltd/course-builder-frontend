import Image from "next/image";
import Link from "next/link";

const ROWS = [
  {
    image: "/images/products/contact/visit-1.png",
    alt: "SoluDesks partnership",
    title: "For Partnership",
    body: "Partner with SoluDesks to bring your expertise and brand to learners worldwide — co-created courses, joint programs, and shared growth.",
    imageClassName: "",
  },
  {
    image: "/images/products/contact/visit-2.png",
    alt: "SoluDesks sponsorship",
    title: "For Sponsorship",
    body: "Sponsor the next generation of courses and creators — put your brand in front of engaged learners across Africa and beyond.",
    imageClassName: "md:order-2",
  },
];

export function ContactVisitSection() {
  return (
    <section className="bg-white">
      <div className="flex w-full flex-col items-center pt-[74px] pb-[120px] lg:pb-[145px]">
        <div className="flex flex-col items-center gap-[16px] text-center">
          <h2 className="max-w-[579px] text-[28px] font-medium leading-[1.2] tracking-[-0.8px] text-sd-black md:text-[40px]">
            Visit us today
          </h2>
          <p className="max-w-[579px] text-[16px] leading-[1.4] tracking-[-0.32px] text-sd-grey-11">
            We care about our users. We would be so happy to hear from you
          </p>
        </div>

        <div className="mt-[60px] flex w-full flex-col lg:mt-[146px]">
          {ROWS.map((row) => (
            <div
              key={row.title}
              className="grid h-[260px] w-full grid-cols-1 md:h-[356px] md:grid-cols-2"
            >
              <div
                className={`relative overflow-hidden border-b border-r border-[#F0F0F0] ${row.imageClassName}`}
              >
                <Image
                  src={row.image}
                  alt={row.alt}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="flex items-center bg-white px-[27px] py-8">
                <div className="flex w-full max-w-[547px] flex-col items-start gap-[24px]">
                  <div className="flex w-full flex-col gap-[20px]">
                    <h3 className="max-w-[492px] text-[24px] font-medium leading-[1.2] tracking-[-0.64px] text-sd-black md:text-[32px]">
                      {row.title}
                    </h3>
                    <p className="w-full text-[16px] leading-[1.4] tracking-[-0.32px] text-sd-grey-11">
                      {row.body}
                    </p>
                  </div>
                  <Link
                    href="mailto:support@coursebuilderstudio.com"
                    className="flex h-[44px] items-center rounded-[8px] bg-[#0063EF] px-[24px] py-[12px] text-[14px] tracking-[-0.28px] text-[#FDFDFD] transition-colors hover:bg-[#0057d4]"
                  >
                    Get started
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
