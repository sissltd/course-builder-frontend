import React from "react";
import Image from "next/image";
import Link from "next/link";

export const AuthLogo = () => {
  return (
    <Link href="/" className="block relative w-[151px] h-[40px] overflow-hidden">
      <Image 
        alt="SoluDesk Logo" 
        src="/assets/auth/logo.png" 
        fill 
        className="object-contain scale-[2.5]"
        priority
      />
    </Link>
  );
};
