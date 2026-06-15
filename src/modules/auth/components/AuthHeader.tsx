import React from "react";
import Link from "next/link";

interface AuthHeaderProps {
  title: string;
  description: string;
  linkText?: string;
  linkHref?: string;
  linkPrefix?: string;
}

export const AuthHeader = ({
  title,
  description,
  linkText,
  linkHref,
  linkPrefix,
}: AuthHeaderProps) => {
  return (
    <div className="flex flex-col items-center text-center gap-[16px] mb-[32px] w-full shrink-0">
      <div className="flex flex-col gap-[8px]">
        <h1 className="font-heading font-bold text-display-md text-sd-grey-12">
          {title}
        </h1>
        <p className="font-sans font-normal text-body-lg text-sd-grey-11 tracking-[-0.32px]  mx-auto">
          {description}
        </p>
      </div>
      
      {linkText && linkHref && (
        <div className="flex items-center justify-center gap-[8px] font-sans font-normal text-body-lg tracking-[-0.32px]">
          <p className="text-sd-grey-12">{linkPrefix}</p>
          <Link href={linkHref} className="text-sd-blue hover:underline">
            {linkText}
          </Link>
        </div>
      )}
    </div>
  );
};
