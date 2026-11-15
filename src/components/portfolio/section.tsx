"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  index,
  title,
  className,
  align = "left",
}: {
  index?: string;
  title: string;
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:gap-4 max-w-full overflow-hidden",
        align === "center" && "items-center text-center",
        className
      )}
    >
      {index && (
        <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-primary">
          {index}
        </span>
      )}
      <h2 className="text-balance text-2xl sm:text-4xl lg:text-5xl font-bold leading-[1.15] tracking-tight break-words">
        {title}
      </h2>
    </div>
  );
}

export function Section({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative mx-auto w-full max-w-7xl scroll-mt-20 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28 overflow-hidden",
        className
      )}
    >
      {children}
    </section>
  );
}
