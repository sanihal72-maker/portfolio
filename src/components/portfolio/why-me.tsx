"use client";

import * as React from "react";
import { Target, Layout, SlidersHorizontal, Briefcase, LifeBuoy } from "lucide-react";
import { Section, SectionHeading } from "./section";
import { motion } from "framer-motion";

const POINTS = [
  {
    icon: Target,
    title: "Business-focused development",
    desc: "I build around real business workflows — software that removes friction, not adds it.",
  },
  {
    icon: Layout,
    title: "Modern and responsive interfaces",
    desc: "Clean, fast, responsive UIs that work across every device and screen size.",
  },
  {
    icon: SlidersHorizontal,
    title: "Customizable solutions",
    desc: "Every solution is built to adapt — templates, modules, and configurable workflows.",
  },
  {
    icon: Briefcase,
    title: "Practical software experience",
    desc: "Production software shipped across retail, pharmacy, fashion, grocery and restaurant.",
  },
  {
    icon: LifeBuoy,
    title: "Ongoing support and maintenance",
    desc: "Reliable updates, performance tuning, and priority support after launch.",
  },
];

export function WhyMe() {
  return (
    <Section id="why-me" className="bg-surface-2/40">
      <SectionHeading index="07" title="Why Work With Me" />

      <div className="mt-12 divide-y divide-border rounded-2xl border border-border bg-card">
        {POINTS.map((p, i) => {
          const Icon = p.icon;
          return (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group flex items-center gap-5 p-6 transition-colors hover:bg-background/40 sm:gap-7 sm:p-8"
            >
              <span className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-primary transition-colors group-hover:border-primary/40 group-hover:bg-primary/10">
                <Icon className="size-5" />
              </span>
              <div className="flex flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                <div className="flex-1">
                  <h3 className="text-base font-semibold tracking-tight text-foreground sm:text-lg">
                    {p.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
                </div>
                <span className="font-mono text-xs text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}
