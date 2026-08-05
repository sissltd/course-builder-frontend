import Image from "next/image";

const AVATARS = [
  { src: "/assets/website/avatar-1.png", size: 60, featured: false },
  { src: "/assets/website/avatar-2.png", size: 60, featured: false },
  { src: "/assets/website/avatar-3.png", size: 60, featured: false },
  { src: "/assets/website/avatar-4.png", size: 80, featured: true },
  { src: "/assets/website/avatar-5.png", size: 60, featured: false },
  { src: "/assets/website/avatar-6.png", size: 60, featured: false },
  { src: "/assets/website/avatar-7.png", size: 60, featured: false },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="bg-white py-[80px] lg:py-[120px]">
      <div className="flex w-full flex-col items-center gap-[41px]">
        <div className="flex flex-col items-center gap-5 text-center">
          <h2 className="text-[28px] font-medium leading-[1.2] tracking-[-0.8px] text-sd-black md:text-[40px]">
            How it works
          </h2>
          <p className="max-w-[379px] text-[15px] leading-[1.4] tracking-[-0.32px] text-sd-grey-11 md:text-[16px]">
            Setting up your account and getting things done is easier than you will think
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {AVATARS.map((avatar, index) => (
            <div
              key={avatar.src}
              className={
                avatar.featured
                  ? "relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full sm:h-[80px] sm:w-[80px]"
                  : "relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full sm:h-[60px] sm:w-[60px]"
              }
            >
              {avatar.featured && (
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    backgroundImage:
                      "linear-gradient(74.3deg, #0063EF 7.1%, #FA8500 98.2%)",
                  }}
                />
              )}
              <div
                className={
                  avatar.featured
                    ? "relative h-[56px] w-[56px] overflow-hidden rounded-full border-[0.8px] border-white sm:h-[70px] sm:w-[70px]"
                    : "relative h-12 w-12 overflow-hidden rounded-full sm:h-[60px] sm:w-[60px]"
                }
              >
                <Image
                  src={avatar.src}
                  alt={`Creator ${index + 1}`}
                  fill
                  sizes={avatar.featured ? "70px" : "60px"}
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        </div>

        <figure className="flex max-w-[509px] flex-col items-center gap-[29px] text-center">
          <blockquote className="text-[18px] leading-[1.4] tracking-[-0.48px] text-sd-grey-11 md:text-[24px]">
            &ldquo;I built my entire 12-module course in just one weekend. The platform made it
            so intuitive I simply organized my ideas, added my content, and everything came
            together beautifully. It&apos;s the easiest course-building experience I&apos;ve
            ever had.&rdquo;
          </blockquote>
          <figcaption className="flex flex-col items-center gap-2">
            <span className="text-[16px] font-medium leading-[1.4] text-sd-black">
              Osaite Emmanuel
            </span>
            <span className="text-[14px] leading-[1.4] text-sd-grey-11">CREATOR</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
