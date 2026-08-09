import { Chart2, People, SearchNormal, Star } from "iconsax-react";

const VALUES = [
  {
    icon: <Star variant="Bold" color="#0A60E1" size={32} />,
    title: "Quality",
    body: "We hold every course, every decision, and every interaction with a creator to a standard worth trusting — because your name is on it, and so is ours.",
  },
  {
    icon: <SearchNormal variant="Bold" color="#0A60E1" size={32} />,
    title: "Transparency",
    body: "Creators deserve to know exactly what they'll earn, why a decision was made, and where they stand — at every step of the journey.",
  },
  {
    icon: <Chart2 variant="Bold" color="#0A60E1" size={32} />,
    title: "Growth",
    body: "We grow by helping creators grow first — their income, their reach, and their skill as teachers.",
  },
  {
    icon: <People variant="Bold" color="#0A60E1" size={32} />,
    title: "Inclusivitity",
    body: "We build for the creator who's often overlooked: more languages, more regions, and more starting points for everyone.",
  },
];

export function AboutValues() {
  return (
    <section className="bg-white">
      <div className="flex w-full flex-col items-center gap-[60px] py-[80px] lg:py-[120px]">
        <h2 className="max-w-[295px] text-center text-[28px] font-medium leading-[1.2] tracking-[-0.8px] text-sd-black md:text-[40px]">
          Our values
        </h2>

        <div className="grid w-full max-w-[711px] grid-cols-1 gap-4 sm:grid-cols-2">
          {VALUES.map((value) => (
            <div
              key={value.title}
              className="flex min-h-[197px] flex-col justify-between gap-6 rounded-[16px] bg-sd-grey-3/80 p-4"
            >
              {value.icon}
              <div>
                <p className="text-[16px] font-medium leading-[1.4] text-sd-black">
                  {value.title}
                </p>
                <p className="mt-3 text-[14px] leading-[1.5] text-sd-grey-11">{value.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
