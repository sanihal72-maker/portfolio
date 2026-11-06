"use client";

import * as React from "react";
import { Star, Quote, ArrowUpRight, ExternalLink } from "lucide-react";
import { usePortfolio } from "./data-context";
import { useAppStore } from "@/store/app-store";
import { Section, SectionHeading } from "./section";
import { motion } from "framer-motion";
import type { Project } from "@/lib/types";

export function Testimonials() {
  const { testimonials, projects } = usePortfolio();
  const openDetail = useAppStore((s) => s.openDetail);
  if (testimonials.length === 0) return null;

  // Resolve a testimonial's projectRef to an actual Project.
  // Supports both project IDs (admin-selected) and legacy title strings (seeded).
  function resolveProject(ref: string | null): Project | undefined {
    if (!ref) return undefined;
    return (
      projects.find((p) => p.id === ref) ||
      projects.find((p) => p.title.toLowerCase() === ref.toLowerCase())
    );
  }

  return (
    <Section id="testimonials">
      <SectionHeading index="08" title="Client Testimonials" />

      <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t, i) => {
          const project = resolveProject(t.projectRef);
          return (
            <motion.figure
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="flex h-full flex-col rounded-2xl border border-border bg-card p-6"
            >
              <div className="flex items-center justify-between">
                <Quote className="size-7 text-primary/40" />
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className={
                        idx < t.rating
                          ? "size-3.5 fill-primary text-primary"
                          : "size-3.5 text-border"
                      }
                    />
                  ))}
                </div>
              </div>

              <blockquote className="mt-4 flex-1 text-pretty text-sm leading-relaxed text-foreground/90">
                “{t.review}”
              </blockquote>

              {/* screenshot / original review evidence */}
              {t.screenshotUrl && (
                <a
                  href={t.screenshotUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-4 flex items-center gap-3 overflow-hidden rounded-lg border border-border bg-background p-2 transition-colors hover:border-primary/40"
                >
                  <img
                    src={t.screenshotUrl}
                    alt="Original review screenshot"
                    className="size-12 shrink-0 rounded border border-border object-cover"
                    loading="lazy"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs font-medium text-foreground">
                      Original review
                    </div>
                    <div className="truncate text-[11px] text-muted-foreground">
                      View screenshot evidence
                    </div>
                  </div>
                  <ExternalLink className="size-3.5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                </a>
              )}

              <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                {t.photoUrl ? (
                  <img
                    src={t.photoUrl}
                    alt={t.clientName}
                    className="size-10 rounded-full border border-border object-cover"
                  />
                ) : (
                  <span className="flex size-10 items-center justify-center rounded-full border border-border bg-background text-sm font-bold text-primary">
                    {t.clientName.charAt(0)}
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-foreground">
                    {t.clientName}
                  </div>
                  <div className="truncate text-xs text-muted-foreground">
                    {t.designation}
                    {t.business ? ` · ${t.business}` : ""}
                  </div>
                  {/* clickable project link */}
                  {project ? (
                    <button
                      onClick={() => openDetail({ kind: "project", id: project.id })}
                      className="group/proj mt-1 inline-flex max-w-full items-center gap-1 truncate text-[11px] font-medium text-primary/90 transition-colors hover:text-primary"
                    >
                      <span className="truncate">Project: {project.title}</span>
                      <ArrowUpRight className="size-3 shrink-0 transition-transform group-hover/proj:translate-x-0.5 group-hover/proj:-translate-y-0.5" />
                    </button>
                  ) : t.projectRef ? (
                    <div className="mt-1 truncate text-[11px] text-muted-foreground">
                      Project: {t.projectRef}
                    </div>
                  ) : null}
                </div>
              </figcaption>
            </motion.figure>
          );
        })}
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        Testimonials reflect genuine client feedback. No fabricated reviews are published.
      </p>
    </Section>
  );
}
