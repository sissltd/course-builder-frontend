import { Building4, Buildings, Call } from "iconsax-react";

const CARDS = [
  {
    icon: <Building4 variant="Bold" color="#0A60E1" size={32} />,
    title: "Head Office",
    lines: ["1, Melborn Avenue, Lekki Phase 1, Lagos State, Nigeria"],
  },
  {
    icon: <Call variant="Bold" color="#0A60E1" size={32} />,
    title: "Phone",
    lines: ["+234 0002 324309", "+234 2343 098908"],
  },
  {
    icon: <Buildings variant="Bold" color="#0A60E1" size={32} />,
    title: "Official E-mail",
    lines: ["support@coursebuilderstudio.com", "helpdesk@coursebuilderstudio.com"],
  },
];

export function ContactInfoCards() {
  return (
    <section className="bg-[#F9F9F9]">
      <div className="flex w-full flex-col items-center pt-[64px] pb-[120px] lg:pb-[150px]">
        <div className="flex flex-col items-center gap-[16px] text-center">
          <h2 className="max-w-[579px] text-[28px] font-medium leading-[1.2] tracking-[-0.8px] text-sd-black md:text-[40px]">
            Reach out to us
          </h2>
          <p className="max-w-[579px] text-[16px] leading-[1.4] tracking-[-0.32px] text-sd-grey-11">
            We care about our users. We would be so happy to hear from you
          </p>
        </div>

        <div className="mt-[60px] grid w-full grid-cols-1 gap-[16px] md:grid-cols-3 lg:mt-[146px]">
          {CARDS.map((card) => (
            <div
              key={card.title}
              className="flex h-[192px] flex-col justify-between rounded-[16px] bg-[#FDFDFD] p-[16px]"
            >
              {card.icon}
              <div className="flex w-full flex-col gap-[12px]">
                <p className="text-[16px] font-medium leading-none tracking-[-0.32px] text-black">
                  {card.title}
                </p>
                <div className="flex w-full flex-col gap-[12px]">
                  {card.lines.map((line) => (
                    <p
                      key={line}
                      className="text-[14px] leading-[1.5] tracking-[-0.28px] text-sd-grey-11"
                    >
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
