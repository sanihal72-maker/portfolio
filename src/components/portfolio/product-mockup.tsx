"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * A premium, CSS-rendered product interface mockup (NOT a fake screenshot).
 * Renders an abstract dashboard/storefront composition inside a browser frame.
 * variant: "storefront" | "dashboard"
 */
export function ProductMockup({
  variant = "dashboard",
  className,
  accent = "#8B5CF6",
}: {
  variant?: "storefront" | "dashboard";
  className?: string;
  accent?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-background shadow-2xl",
        className
      )}
    >
      {/* browser chrome */}
      <div className="flex items-center gap-2 border-b border-border bg-card px-4 py-3">
        <div className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-red-400/70" />
          <span className="size-2.5 rounded-full bg-amber-400/70" />
          <span className="size-2.5 rounded-full bg-emerald-400/70" />
        </div>
        <div className="mx-auto flex h-6 w-1/2 items-center rounded-md border border-border bg-background px-3 text-[10px] text-muted-foreground">
          <span className="truncate">app.local / {variant}</span>
        </div>
      </div>

      {/* body */}
      <div className="grid grid-cols-12 gap-0">
        {/* sidebar */}
        <div className="col-span-3 border-r border-border bg-card/60 p-3">
          <div className="mb-4 flex items-center gap-2">
            <span
              className="size-5 rounded-md"
              style={{ backgroundColor: accent }}
            />
            <div className="h-2 w-16 rounded bg-border" />
          </div>
          <div className="space-y-2">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={cn(
                  "flex items-center gap-2 rounded-md px-2 py-1.5",
                  i === 0 ? "bg-primary/15" : "bg-transparent"
                )}
              >
                <span
                  className={cn(
                    "size-3 rounded",
                    i === 0 ? "" : "bg-border"
                  )}
                  style={i === 0 ? { backgroundColor: accent } : undefined}
                />
                <div className="h-2 flex-1 rounded bg-border/70" />
              </div>
            ))}
          </div>
        </div>

        {/* main */}
        <div className="col-span-9 p-4">
          {/* header row */}
          <div className="mb-4 flex items-center justify-between">
            <div className="space-y-1.5">
              <div className="h-2.5 w-32 rounded bg-border" />
              <div className="h-2 w-20 rounded bg-border/60" />
            </div>
            <div
              className="rounded-md px-3 py-1.5 text-[10px] font-medium text-white"
              style={{ backgroundColor: accent }}
            >
              + New
            </div>
          </div>

          {/* stat cards */}
          <div className="mb-4 grid grid-cols-3 gap-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-lg border border-border bg-card p-2.5">
                <div className="mb-2 h-1.5 w-10 rounded bg-border/60" />
                <div className="flex items-end justify-between">
                  <div
                    className="h-3 w-12 rounded"
                    style={{ backgroundColor: accent, opacity: 0.85 - i * 0.2 }}
                  />
                  <div className="h-4 w-6 rounded bg-border/40" />
                </div>
              </div>
            ))}
          </div>

          {variant === "storefront" ? (
            /* product grid */
            <div className="grid grid-cols-3 gap-2">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-lg border border-border bg-card"
                >
                  <div
                    className="aspect-[4/3] w-full"
                    style={{
                      background: `linear-gradient(135deg, ${accent}${i % 2 ? "22" : "14"}, transparent)`,
                    }}
                  />
                  <div className="space-y-1 p-2">
                    <div className="h-1.5 w-full rounded bg-border" />
                    <div className="h-1.5 w-2/3 rounded bg-border/60" />
                    <div
                      className="mt-1 h-2 w-10 rounded"
                      style={{ backgroundColor: accent }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* chart + table rows */
            <div className="space-y-3">
              <div className="rounded-lg border border-border bg-card p-3">
                <div className="mb-3 flex items-end gap-1.5">
                  {[40, 65, 50, 80, 60, 95, 72].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t"
                      style={{
                        height: `${h * 0.5}px`,
                        backgroundColor: i === 5 ? accent : `${accent}55`,
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 rounded-md border border-border bg-card px-2.5 py-1.5"
                  >
                    <span className="size-2 rounded-full" style={{ backgroundColor: accent }} />
                    <div className="h-1.5 flex-1 rounded bg-border" />
                    <div className="h-1.5 w-10 rounded bg-border/60" />
                    <div className="h-1.5 w-6 rounded" style={{ backgroundColor: `${accent}aa` }} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
