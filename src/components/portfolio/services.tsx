"use client";

import * as React from "react";
import { ArrowUpRight } from "lucide-react";
import { usePortfolio } from "./data-context";
import { useAppStore } from "@/store/app-store";
import { Section, SectionHeading } from "./section";
import { getIcon } from "./icons";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Services() {
  const { services } = usePortfolio();
  const openDetail = useAppStore((s) => s.openDetail);

  if (services.length === 0) return null;

  return (
    <Section id="services">
      <SectionHeading index="04" title="Services I Provide" />

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => {
          const Icon = getIcon(s.icon);
          return (
            <motion.button
              key={s.id}
              type="button"
              onClick={() => openDetail({ kind: "service", id: s.id })}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className={cn(
                "group relative flex h-full flex-col items-start overflow-hidden rounded-2xl border border-border bg-card p-6 text-left transition-colors hover:border-primary/50"
              )}
            >
              {/* hover glow */}
              <div className="pointer-events-none absolute -right-12 -top-12 size-40 rounded-full bg-primary/10 opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-100" />

              <div className="flex w-full items-center justify-between">
                <span className="flex size-12 items-center justify-center rounded-xl border border-border bg-background text-primary transition-colors group-hover:border-primary/40 group-hover:bg-primary/10">
                  <Icon className="size-5" />
                </span>
                <span className="font-mono text-xs font-medium text-muted-foreground">
                  {String(s.number || s.order || i + 1).padStart(2, "0")}
                </span>
              </div>

              <h3 className="mt-5 text-lg font-semibold tracking-tight text-foreground">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {s.summary}
              </p>

              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                Learn More
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </motion.button>
          );
        })}
      </div>
    </Section>
  );
}
