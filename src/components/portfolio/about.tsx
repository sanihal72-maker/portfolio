"use client";

import * as React from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { usePortfolio } from "./data-context";
import { Section, SectionHeading } from "./section";
import { motion } from "framer-motion";

export function About() {
  const { profile } = usePortfolio();
  if (!profile) return null;

  const values = (profile.values || "")
    .split("\n")
    .map((v) => v.trim())
    .filter(Boolean);

  return (
    <Section id="about">
      <SectionHeading index="02" title="About Me" />

      <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-16">
        {/* portrait — About section only, never in Hero */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-5"
        >
          <div className="relative">
            <div className="absolute -inset-3 rounded-2xl bg-primary/10 blur-2xl" />
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
              {profile.photoUrl ? (
                <img
                  src={profile.photoUrl}
                  alt={`Portrait of ${profile.name}`}
                  className="aspect-[4/5] w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="flex aspect-[4/5] w-full items-center justify-center bg-gradient-to-br from-card to-background text-6xl font-bold text-primary/30">
                  {profile.name.charAt(0)}
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-card via-card/60 to-transparent p-5">
                <div className="flex items-center gap-2 text-sm">
                  <span className="flex size-2 rounded-full bg-emerald-400" />
                  <span className="font-medium text-foreground">{profile.name}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {profile.location}
                </p>
              </div>
            </div>
          </div>

          {/* quick stats */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { value: `${profile.yearsExperience}+`, label: "Years" },
              { value: `${profile.projectsDone}+`, label: "Projects" },
              { value: `${profile.clientsServed}+`, label: "Clients" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-border bg-card p-4 text-center"
              >
                <div className="text-2xl font-bold text-foreground">{s.value}</div>
                <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* content */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-7"
        >
          <p className="text-pretty text-lg leading-relaxed text-muted-foreground">
            {profile.about}
          </p>

          {profile.approach && (
            <div className="mt-8 rounded-xl border border-border bg-card p-6">
              <h3 className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
                Development Approach
              </h3>
              <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
                {profile.approach}
              </p>
            </div>
          )}

          {values.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
                Professional Values
              </h3>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {values.map((v) => (
                  <li key={v} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md bg-primary/15 text-primary">
                      <Check className="size-3.5" />
                    </span>
                    <span className="text-sm text-muted-foreground">{v}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <a
            href="#contact"
            className="group mt-9 inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/50 hover:text-primary"
          >
            Get in touch
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </motion.div>
      </div>
    </Section>
  );
}
