import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function PageContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full px-6 md:px-10 lg:px-[120px]", className)}>
      {children}
    </div>
  );
}
