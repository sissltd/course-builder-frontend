import type { CSSProperties, ReactNode } from "react";

interface TiltMockupProps {
  children: ReactNode;
  rotateX?: number;
  rotateY?: number;
  blend?: boolean;
  className?: string;
}

export function TiltMockup({
  children,
  rotateX = 6,
  rotateY = 9,
  blend = true,
  className,
}: TiltMockupProps) {
  return (
    <div className={`relative [perspective:2200px] ${className ?? ""}`}>
      <div
        aria-hidden
        className="absolute -inset-x-8 bottom-0 top-[10%] rounded-[24px] bg-gradient-to-b from-sd-blue/20 via-sd-primary/15 to-transparent blur-3xl"
      />
      <div
        className="relative origin-top will-change-transform [transform:var(--tilt)]"
        style={{ "--tilt": `rotateX(${rotateX}deg) rotateY(${rotateY}deg)` } as CSSProperties}
      >
        {children}
        {blend && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[38%]"
            style={{
              backgroundImage:
                "linear-gradient(90.7deg, #FFFFFF 42.7%, rgba(255,255,255,0) 70%)",
            }}
          />
        )}
      </div>
    </div>
  );
}
