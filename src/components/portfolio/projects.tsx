"use client";

import * as React from "react";
import { ArrowUpRight, ExternalLink, Github, Clock } from "lucide-react";
import { usePortfolio } from "./data-context";
import { useAppStore } from "@/store/app-store";
import { Section, SectionHeading } from "./section";
import { ProductMockup } from "./product-mockup";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium",
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

export function Projects() {
  const { projects } = usePortfolio();
  const openDetail = useAppStore((s) => s.openDetail);

  if (projects.length === 0) return null;

  return (
    <Section id="projects">
      <SectionHeading index="06" title="Featured Projects" />

      <div className="mt-12 space-y-20">
        {projects.map((p, idx) => {
          const reversed = idx % 2 === 1;
          const comingSoon = p.status.toLowerCase() === "coming soon";
          const features = (p.features || "")
            .split("\n")
            .map((v) => v.trim())
            .filter(Boolean);

          return (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55 }}
              className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
            >
              {/* visual */}
              <div className={cn("relative", reversed && "lg:order-2")}>
                <div className="absolute -inset-6 rounded-3xl bg-primary/10 blur-3xl" />
                <ProductMockup
                  variant={p.categoryName.toLowerCase().includes("pos") ? "dashboard" : "storefront"}
                  className="relative"
                />
                {comingSoon && (
                  <div className="absolute -right-3 -top-3 rotate-3 rounded-lg border border-amber-500/40 bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-300 backdrop-blur">
                    In Development
                  </div>
                )}
              </div>

              {/* content */}
              <div className={cn(reversed && "lg:order-1")}>
                <div className="flex flex-wrap items-center gap-3">
                  <ProjectStatusBadge status={p.status} />
                  <span className="rounded-md border border-border bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground">
                    {p.categoryName}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm font-medium text-primary">{p.technology}</p>

                <p className="mt-5 text-pretty leading-relaxed text-muted-foreground">
                  {p.summary}
                </p>

                {features.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {features.slice(0, 6).map((f) => (
                      <span
                        key={f}
                        className="rounded-md border border-border bg-card px-2.5 py-1 text-xs text-muted-foreground"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => openDetail({ kind: "project", id: p.id })}
                    className="group inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90"
                  >
                    View Project Details
                    <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                  {p.demoUrl && p.demoUrl !== "#" && !comingSoon && (
                    <a
                      href={p.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/50"
                    >
                      <ExternalLink className="size-4" />
                      Live Demo
                    </a>
                  )}
                  {p.githubUrl && (
                    <a
                      href={p.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex size-10 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                      aria-label="GitHub repository"
                    >
                      <Github className="size-4" />
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
