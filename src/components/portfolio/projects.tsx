"use client";

import * as React from "react";
import { ExternalLink, Github, Clock } from "lucide-react";
import { usePortfolio } from "./data-context";
import { Section, SectionHeading } from "./section";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/types";

function ProjectStatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase();
  const map: Record<string, string> = {
    live: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    development: "border-sky-500/30 bg-sky-500/10 text-sky-400",
    "coming soon": "border-amber-500/30 bg-amber-500/10 text-amber-400",
  };
  const cls = map[s] || "border-border bg-card text-muted-foreground";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium backdrop-blur",
        cls
      )}
    >
      {s === "coming soon" && <Clock className="size-3" />}
      <span
        className={cn(
          "size-1.5 rounded-full",
          s === "live" && "bg-emerald-400",
          s === "development" && "bg-sky-400",
          s === "coming soon" && "bg-amber-400"
        )}
      />
      {status}
    </span>
  );
}

/** Compact browser-framed visual for a project card */
function CardVisual({ project }: { project: Project }) {
  const isPos = project.categoryName.toLowerCase().includes("pos");
  const isDashboard = project.categoryName.toLowerCase().includes("dashboard");
  const comingSoon = project.status.toLowerCase() === "coming soon";

  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-border bg-background">
      {/* browser chrome */}
      <div className="flex items-center gap-1.5 border-b border-border bg-card/60 px-3 py-2">
        <span className="size-1.5 rounded-full bg-red-400/60" />
        <span className="size-1.5 rounded-full bg-amber-400/60" />
        <span className="size-1.5 rounded-full bg-emerald-400/60" />
        <div className="ml-2 h-2 flex-1 max-w-[120px] rounded bg-border/60" />
      </div>

      {/* abstract content */}
      <div className="grid h-[calc(100%-32px)] grid-cols-4 gap-2 p-3">
        {/* mini sidebar */}
        <div className="col-span-1 space-y-1.5 rounded-md border border-border bg-card/50 p-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-1">
              <span
                className={cn("size-1.5 rounded", i === 0 ? "bg-primary" : "bg-border")}
              />
              <div className="h-1 flex-1 rounded bg-border/60" />
            </div>
          ))}
        </div>
        {/* main area */}
        <div className="col-span-3 space-y-2">
          <div className="grid grid-cols-3 gap-1.5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded border border-border bg-card/50 p-1.5">
                <div className="mb-1 h-1 w-2/3 rounded bg-border/60" />
                <div
                  className="h-2 w-full rounded"
                  style={{ backgroundColor: "#8B5CF6", opacity: 0.85 - i * 0.2 }}
                />
              </div>
            ))}
          </div>
          {isPos || isDashboard ? (
            <div className="space-y-1.5 rounded-md border border-border bg-card/50 p-2">
              <div className="flex items-end gap-1">
                {[50, 70, 45, 85, 60, 95].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t"
                    style={{
                      height: `${h * 0.28}px`,
                      backgroundColor: i === 5 ? "#8B5CF6" : "#8B5CF655",
                    }}
                  />
                ))}
              </div>
              <div className="space-y-1">
                {[0, 1].map((i) => (
                  <div key={i} className="flex items-center gap-1">
                    <span className="size-1 rounded-full bg-primary" />
                    <div className="h-1 flex-1 rounded bg-border/60" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-1.5">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="rounded border border-border bg-card/40 p-1.5">
                  <div className="mb-1 h-1 w-3/4 rounded bg-border/60" />
                  <div className="h-4 rounded bg-primary/10" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {comingSoon && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-[2px]">
          <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">
            Coming Soon
          </span>
        </div>
      )}
    </div>
  );
}

export function Projects() {
  const { projects } = usePortfolio();

  if (projects.length === 0) return null;

  // Order: Live first, then Development, then Coming Soon — but respect featured + order
  const statusRank: Record<string, number> = { live: 0, development: 1, "coming soon": 2 };
  const sorted = [...projects].sort((a, b) => {
    const ra = statusRank[a.status.toLowerCase()] ?? 3;
    const rb = statusRank[b.status.toLowerCase()] ?? 3;
    if (ra !== rb) return ra - rb;
    return a.order - b.order;
  });

  return (
    <Section id="projects">
      <SectionHeading index="06" title="Featured Projects" />

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((p, i) => {
          const comingSoon = p.status.toLowerCase() === "coming soon";
          const hasDemo = Boolean(p.demoUrl && p.demoUrl.trim() !== "");
          const features = (p.features || "")
            .split("\n")
            .map((v) => v.trim())
            .filter(Boolean);

          return (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/50 shadow-sm"
            >
              {/* visual — opens Demo URL directly if available */}
              {hasDemo && !comingSoon ? (
                <a
                  href={p.demoUrl!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative block cursor-pointer transition-opacity group-hover:opacity-95"
                  aria-label={`Open ${p.title} demo`}
                >
                  <CardVisual project={p} />
                  <div className="absolute left-3 top-3">
                    <ProjectStatusBadge status={p.status} />
                  </div>
                </a>
              ) : (
                <div className="relative block">
                  <CardVisual project={p} />
                  <div className="absolute left-3 top-3">
                    <ProjectStatusBadge status={p.status} />
                  </div>
                </div>
              )}

              {/* body */}
              <div className="flex flex-1 flex-col p-5">
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded-md border border-border bg-background px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                    {p.categoryName}
                  </span>
                  <span className="font-mono text-[11px] text-muted-foreground/70">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                {hasDemo && !comingSoon ? (
                  <a
                    href={p.demoUrl!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-left"
                  >
                    <h3 className="text-base font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
                      {p.title}
                    </h3>
                  </a>
                ) : (
                  <h3 className="text-base font-semibold tracking-tight text-foreground">
                    {p.title}
                  </h3>
                )}
                <p className="mt-1 text-[11px] font-medium text-primary">{p.technology}</p>

                <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                  {p.summary}
                </p>

                {features.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {features.slice(0, 3).map((f) => (
                      <span
                        key={f}
                        className="rounded border border-border bg-background px-1.5 py-0.5 text-[10px] text-muted-foreground"
                      >
                        {f}
                      </span>
                    ))}
                    {features.length > 3 && (
                      <span className="rounded px-1.5 py-0.5 text-[10px] text-muted-foreground/60">
                        +{features.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* footer actions — only Demo URL and GitHub */}
                <div className="mt-auto flex items-center justify-between gap-2 pt-5 border-t border-border/50">
                  {hasDemo && !comingSoon ? (
                    <a
                      href={p.demoUrl!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/btn inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary transition-all hover:bg-primary hover:text-white"
                    >
                      <span>Live Demo</span>
                      <ExternalLink className="size-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="size-3.5" />
                      <span>{comingSoon ? "Coming Soon" : "In Development"}</span>
                    </span>
                  )}

                  {p.githubUrl && (
                    <a
                      href={p.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex size-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary shadow-sm"
                      aria-label="GitHub repository"
                    >
                      <Github className="size-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </Section>
  );
}
