"use client";

import * as React from "react";
import { usePortfolio } from "./data-context";
import { Section, SectionHeading } from "./section";
import { TechLogo } from "./tech-logos";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

function TechBadge({
  name,
  color,
  delay,
}: {
  name: string;
  color: string | null;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -3 }}
      className="group flex items-center gap-2.5 sm:gap-3 rounded-xl border border-border bg-card p-3 sm:p-4 transition-colors hover:border-primary/40 min-w-0 overflow-hidden"
    >
      <TechLogo name={name} fallbackColor={color} />
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold text-foreground">{name}</div>
      </div>
    </motion.div>
  );
}

export function Technologies() {
  const { skills } = usePortfolio();

  const groups = React.useMemo(() => {
    const map = new Map<string, typeof skills>();
    for (const s of skills) {
      const arr = map.get(s.category) || [];
      arr.push(s);
      map.set(s.category, arr);
    }
    return Array.from(map.entries());
  }, [skills]);

  return (
    <Section id="technologies" className="bg-surface-2/40">
      <SectionHeading index="03" title="Technologies I Work With" />

      <div className="mt-12 space-y-12">
        {groups.map(([category, items]) => (
          <div key={category}>
            <div className="mb-5 flex items-center gap-3">
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {category}
              </h3>
              <div className="h-px flex-1 bg-border" />
              <span className="font-mono text-xs text-muted-foreground">
                {String(items.length).padStart(2, "0")}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 sm:grid-cols-3 lg:grid-cols-4 w-full">
              {items.map((s, i) => (
                <TechBadge
                  key={s.id}
                  name={s.name}
                  color={s.color}
                  delay={i * 0.04}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
