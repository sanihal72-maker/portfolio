"use client";

import * as React from "react";
import { Star, Quote } from "lucide-react";
import { usePortfolio } from "./data-context";
import { Section, SectionHeading } from "./section";
import { motion } from "framer-motion";

export function Testimonials() {
  const { testimonials } = usePortfolio();
  if (testimonials.length === 0) return null;

  return (
    <Section id="testimonials">
      <SectionHeading index="08" title="Client Testimonials" />

      <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t, i) => (
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
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-foreground">
                  {t.clientName}
                </div>
                <div className="truncate text-xs text-muted-foreground">
                  {t.designation}
                  {t.business ? ` · ${t.business}` : ""}
                </div>
                {t.projectRef && (
                  <div className="mt-0.5 truncate text-[11px] text-primary/80">
                    Project: {t.projectRef}
                  </div>
                )}
              </div>
            </figcaption>
          </motion.figure>
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        Testimonials reflect genuine client feedback. No fabricated reviews are published.
      </p>
    </Section>
  );
}
