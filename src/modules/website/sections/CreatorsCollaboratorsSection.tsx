import {
  ArrowDown2,
  Calendar2,
  CloseSquare,
  DirectboxNotif,
  Global,
  More,
  SearchNormal1,
  Sort,
  User,
} from "iconsax-react";
import Image from "next/image";

import { CREATOR_COLLABORATORS } from "@/modules/website/data/content";

const HEADER_CELLS: { label: string; className: string }[] = [
  { label: "Name", className: "w-[216px]" },
  { label: "Email", className: "w-[255.5px]" },
  { label: "Dated added", className: "flex-1" },
  { label: "Role", className: "w-[136px]" },
  { label: "", className: "w-6 justify-end" },
];

const DETAILS = [
  { icon: User, label: "Sex", value: "Male" },
  { icon: Global, label: "Country of Origin", value: "Nigeria" },
  { icon: DirectboxNotif, label: "Email", value: "dogwahales@support.com" },
];

export function CreatorsCollaboratorsSection() {
  return (
    <section className="relative bg-white lg:pt-[76px]">
      <div className="flex w-full flex-col items-center gap-5 pt-[64px] lg:pt-0">
        <h2 className="w-full max-w-[496px] text-center text-[28px] font-medium leading-[1.2] tracking-[-0.8px] text-sd-black md:text-[40px]">
          Build courses together
        </h2>
        <p className="w-full max-w-[659px] text-center text-[15px] leading-[1.4] tracking-[-0.32px] text-sd-grey-11 md:text-[16px]">
          Invite collaborators to join you on a course; assign them access, work on different
          modules at the same time, and bring in the right expertise without giving up
          ownership.
        </p>
      </div>

      <div className="relative mt-[48px] -mx-6 overflow-clip md:-mx-10 lg:mt-0 lg:h-[543px] lg:-mx-[120px]">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(-0.23deg, rgba(10, 96, 225, 0.35) 54.75%, rgba(255, 255, 255, 0) 93.1%)",
          }}
        />

        <div className="relative mx-auto w-full max-w-[915px] overflow-clip rounded-[24px] bg-white lg:absolute lg:left-1/2 lg:top-[74px] lg:h-[500px] lg:w-[915px] lg:-translate-x-1/2">
          <p className="px-5 pt-5 text-[24px] font-semibold leading-8 tracking-[-0.48px] text-sd-black">
            Collaborators
          </p>

          <div className="flex gap-3 px-5 pt-5">
            <div className="flex min-w-0 flex-1 flex-col gap-4 overflow-clip rounded-[20px] border border-[#F0F0F0] bg-[#FDFDFD] px-4 pb-4 pt-5 lg:w-[509px] lg:flex-none">
              <div className="flex w-full items-start gap-3">
                <div className="flex h-10 w-[308px] max-w-full items-center gap-3 overflow-clip rounded-[8px] border border-[#D9D9D9] px-4">
                  <SearchNormal1 variant="Linear" color="#202020" size={20} />
                  <span className="text-[14px] leading-5 tracking-[-0.28px] text-[#B6B6B6]">
                    Search collaborator
                  </span>
                </div>
                <div className="hidden items-center sm:flex">
                  <div className="flex h-10 shrink-0 items-center gap-3 overflow-clip rounded-[8px] border border-[#D9D9D9] px-4">
                    <Calendar2 variant="Linear" color="#202020" size={20} />
                    <span className="text-[14px] leading-5 tracking-[-0.28px] text-[#606060]">
                      Date
                    </span>
                  </div>
                  <div className="ml-3 flex h-10 shrink-0 items-center gap-3 overflow-clip rounded-[8px] border border-[#D9D9D9] px-4">
                    <Sort variant="Linear" color="#202020" size={20} />
                    <span className="text-[14px] leading-5 tracking-[-0.28px] text-[#606060]">
                      Role
                    </span>
                    <ArrowDown2 variant="Linear" color="#202020" size={20} />
                  </div>
                </div>
              </div>

              <div className="w-[1160px]">
                <div className="flex h-10 items-center justify-between border-b border-[#F0F0F0] bg-white p-2">
                  {HEADER_CELLS.map((cell) => (
                    <div key={cell.label} className={`flex items-center ${cell.className}`}>
                      <span className="text-[14px] leading-5 tracking-[-0.28px] text-[#888]">
                        {cell.label}
                      </span>
                    </div>
                  ))}
                </div>
                {CREATOR_COLLABORATORS.map((collaborator) => (
                  <div
                    key={`${collaborator.name}-${collaborator.email}`}
                    className="flex items-center justify-between border-b border-[#F0F0F0] p-2"
                  >
                    <div className="flex w-[216px] items-center gap-2">
                      <div
                        className="flex size-8 shrink-0 flex-col items-center justify-center overflow-clip rounded-full px-[6.67px] py-[2.67px]"
                        style={{ backgroundColor: collaborator.color }}
                      >
                        <span className="text-[16px] font-medium leading-normal text-white">
                          {collaborator.initials}
                        </span>
                      </div>
                      <span className="truncate text-[14px] leading-5 tracking-[-0.28px] text-[#606060]">
                        {collaborator.name}
                      </span>
                    </div>
                    <div className="flex w-[255.5px] items-center">
                      <span className="truncate text-[14px] leading-5 tracking-[-0.28px] text-[#606060]">
                        {collaborator.email}
                      </span>
                    </div>
                    <p className="flex-1 truncate text-[14px] leading-5 tracking-[-0.28px] text-[#606060]">
                      {collaborator.dateAdded}
                    </p>
                    <div className="flex w-[136px] items-center">
                      <span className="text-[14px] leading-5 tracking-[-0.28px] text-[#606060]">
                        {collaborator.role}
                      </span>
                    </div>
                    <div className="flex w-6 items-center justify-end">
                      <More variant="Linear" color="#606060" size={24} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden h-fit w-[342px] shrink-0 overflow-clip rounded-[12px] bg-[#FDFDFD] lg:block">
              <div className="flex w-full items-start justify-between border-b border-[#F0F0F0] bg-white p-5">
                <div className="flex min-w-px flex-1 items-center gap-3">
                  <div className="flex size-10 shrink-0 flex-col items-center justify-center overflow-clip rounded-full bg-[#0A60E1] px-[6.67px] py-[2.67px]">
                    <span className="text-[16px] font-medium leading-normal text-white">D</span>
                  </div>
                  <p className="w-full truncate text-[16px] font-medium leading-6 tracking-[-0.32px] text-sd-black">
                    Dog Whales
                  </p>
                </div>
                <div className="flex size-6 shrink-0 items-center justify-center overflow-clip rounded-[4px] border border-[#F0F0F0]">
                  <CloseSquare variant="Linear" color="#202020" size={16} />
                </div>
              </div>

              <div className="flex w-full flex-col gap-5 p-5">
                {DETAILS.map((detail) => (
                  <div key={detail.label} className="flex w-full items-center gap-3">
                    <detail.icon variant="Linear" color="#202020" size={24} />
                    <div className="flex min-w-px flex-1 flex-col gap-2">
                      <span className="text-[14px] leading-5 tracking-[-0.28px] text-[#606060]">
                        {detail.label}
                      </span>
                      <span className="text-[14px] leading-5 tracking-[-0.28px] text-sd-black">
                        {detail.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute left-[-64px] top-[271px] hidden h-[379px] w-[528px] lg:block">
          <Image
            src="/images/products/creators/collaborators-vector.svg"
            alt=""
            width={929}
            height={780}
            className="absolute inset-[-53.01%_-37.97%_-52.9%_-37.97%] max-w-none"
          />
        </div>
      </div>
    </section>
  );
}
