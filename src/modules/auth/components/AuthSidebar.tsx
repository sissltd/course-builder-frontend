import React from "react";
import Image from "next/image";

const FeatureItem = ({ text }: { text: string }) => (
  <div className="flex gap-[12px] items-center w-full">
    <div className="relative size-[24px] shrink-0">
      <Image alt="tag" fill src="/assets/auth/tag-right.png" />
    </div>
    <p className="font-sans font-normal text-body-lg text-sd-grey-11 tracking-[-0.32px]">
      {text}
    </p>
  </div>
);

export const AuthSidebar = () => {
  return (
    <div 
      className="hidden lg:block relative overflow-hidden rounded-[24px] shadow-[0px_15px_34px_0px_rgba(0,0,0,0.1)] size-full min-h-[728px]" 
      style={{ backgroundImage: "linear-gradient(18.05deg, #FDFDFF 41.97%, #F0F6FE 109.03%)" }}
    >
      {/* Background Decorative Vector */}
      <div className="absolute h-[352.5px] left-[-59px] top-[402.5px] w-[718.5px] opacity-50">
        <Image alt="bg-vector" fill src="/assets/auth/bg-pattern-2.png" className="object-contain" />
      </div>

      {/* Header Text */}
      <div className="absolute left-[54px] top-[41px] w-[529px]">
        <h2 className="font-sans font-semibold text-x text-sd-grey-12 tracking-[-0.48px] mb-2">
          Welcome to SoluDesk
        </h2>
        <p className="font-sans font-normal text-body-lg text-sd-grey-11 tracking-[-0.32px]">
          Your AI assistant course builder
        </p>
      </div>

      {/* Feature List */}
      <div className="absolute left-[54px] top-[153px] flex flex-col gap-[13px] w-[364px]">
        <FeatureItem text="Create your personalized courses" />
        <FeatureItem text="Earn while you do what you love" />
        <FeatureItem text="Collaborate with professionals" />
        <FeatureItem text="Track your progress with detailed analytics" />
      </div>

      {/* Decorative Cards */}
      {/* Card 1: Creating Courses */}
      <div className="absolute left-[56.59px] top-[344px] rotate-[0.39deg]">
        <div className="bg-white px-[19.62px] py-[9.81px] rounded-[13.08px] shadow-[0px_45.78px_45.78px_0px_rgba(0,0,0,0.09)] w-[379.98px]">
          <div className="flex items-center justify-between">
            <div className="flex gap-[5.45px] items-center">
              <div className="h-[42.51px] w-[37.06px] relative shrink-0">
                <Image alt="course" fill src="/assets/auth/course-icon-1.png" />
              </div>
              <div className="flex flex-col gap-[3.27px] px-[10.9px] py-[8.72px]">
                <p className="font-sans font-medium text-[17.44px] leading-[26.16px] text-sd-grey-11 tracking-[-0.348px]">
                  Creating courses
                </p>
                <div className="bg-[#F2F2F2] h-[8.72px] rounded-[37.06px] w-[71.95px]" />
              </div>
            </div>
            <div className="relative size-[48px] flex items-center justify-center shrink-0">
              <Image alt="progress" fill src="/assets/auth/progress-15.png" />
              <p className="relative font-sans font-medium text-[12px] text-sd-grey-11 z-10">
                15%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Card 2: Another Progress */}
      <div className="absolute left-[63.17px] top-[415px] rotate-[-7.23deg]">
        <div className="bg-white px-[18px] py-[9px] rounded-[12px] shadow-[0px_42px_42px_0px_rgba(0,0,0,0.09)] w-[286px]">
          <div className="flex items-center gap-[26px]">
            <div className="flex gap-[5px] items-center">
              <div className="h-[39px] w-[34px] relative shrink-0">
                <Image alt="course" fill src="/assets/auth/course-icon-2.png" />
              </div>
              <div className="flex flex-col gap-[3px] px-[10px] py-[8px]">
                <div className="bg-[#F2F2F2] h-[12.9px] rounded-[34px] w-[125.86px]" />
                <div className="bg-[#F2F2F2] h-[8px] rounded-[34px] w-[66px]" />
              </div>
            </div>
            <div className="relative size-[44px] flex items-center justify-center shrink-0">
              <Image alt="progress" fill src="/assets/auth/progress-70.png" />
              <p className="relative font-sans font-medium text-[11px] text-sd-grey-11 z-10">
                70%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Ellipses */}
      <div className="absolute left-[393px] top-[415px] size-[164px]">
        <Image alt="ellipse" fill src="/assets/auth/ellipse-blue.png" />
      </div>
      <div className="absolute left-[319px] top-[532px] size-[94px]">
        <Image alt="ellipse" fill src="/assets/auth/ellipse-light.png" />
      </div>
    </div>
  );
};
