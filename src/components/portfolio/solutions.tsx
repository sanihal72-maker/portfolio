"use client";

import * as React from "react";
import { ArrowRight, ExternalLink, Check } from "lucide-react";
import { usePortfolio } from "./data-context";
import { useAppStore } from "@/store/app-store";
import { Section, SectionHeading } from "./section";
import { ProductMockup } from "./product-mockup";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

function StatusBadge({ status }: { status: string }) {
  const live = status.toLowerCase() === "live";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium",
        live
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
          : "border-amber-500/30 bg-amber-500/10 text-amber-400"
      )}
    >
      <span className={cn("size-1.5 rounded-full", live ? "bg-emerald-400" : "bg-amber-400")} />
      {status}
    </span>
  );
}

export function Solutions() {
  const { solutions } = usePortfolio();
  const openDetail = useAppStore((s) => s.openDetail);

  if (solutions.length === 0) return null;

  return (
    <Section id="solutions" className="bg-surface-2/40">
      <SectionHeading index="05" title="Ready-Made Business Solutions" />

      <div className="mt-12 space-y-20">
        {solutions.map((sol, idx) => {
          const variant = sol.slug.includes("pos") ? "dashboard" : "storefront";
          const reversed = idx % 2 === 1;
          const industries = (sol.industries || "")
            .split("\n")
            .map((v) => v.trim())
            .filter(Boolean);

          return (
            <div
              key={sol.id}
              className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
            >
              {/* visual */}
              <motion.div
                initial={{ opacity: 0, x: reversed ? 30 : -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.55 }}
                className={cn("relative", reversed && "lg:order-2")}
              >
                <div className="absolute -inset-6 rounded-3xl bg-primary/10 blur-3xl" />
                <ProductMockup variant={variant} className="relative" />
              </motion.div>

              {/* content */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5 }}
                className={cn(reversed && "lg:order-1")}
              >
                <div className="flex items-center gap-3">
                  <StatusBadge status={sol.status} />
                  <span className="font-mono text-xs text-muted-foreground">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
                  {sol.name}
                </h3>
                <p className="mt-2 text-sm font-medium text-primary">{sol.tagline}</p>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="rounded-md border border-border bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground">
                    {sol.technology}
                  </span>
                </div>

                <p className="mt-5 text-pretty leading-relaxed text-muted-foreground">
                  {sol.summary}
                </p>

                {/* features */}
                <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                  {sol.features.slice(0, 8).map((f) => (
                    <li key={f.id} className="flex items-start gap-2">
                      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md bg-primary/15 text-primary">
                        <Check className="size-3.5" />
                      </span>
                      <span className="text-sm text-muted-foreground">{f.title}</span>
                    </li>
                  ))}
                </ul>

                {industries.length > 0 && (
                  <div className="mt-6">
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                      Supported Industries
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {industries.map((ind) => (
                        <span
                          key={ind}
                          className="rounded-md border border-border bg-card px-2.5 py-1 text-xs text-muted-foreground"
                        >
                          {ind}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Monthly Subscription Pricing for POS */}
                {sol.slug.includes("pos") || sol.name.toLowerCase().includes("pos") ? (
                  <div className="mt-6 rounded-xl border border-primary/25 bg-gradient-to-b from-card/90 to-surface-2/80 p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                          Monthly Subscription Plans
                        </span>
                      </div>
                      <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary">
                        Cloud / Hosted
                      </span>
                    </div>

                    <div className="mt-3.5 grid gap-3 sm:grid-cols-3">
                      {/* Startup Tier */}
                      <div className="flex flex-col justify-between rounded-lg border border-border/80 bg-background/60 p-3">
                        <div>
                          <div className="text-xs font-semibold text-muted-foreground">Startup</div>
                          <div className="mt-1 flex items-baseline gap-1">
                            <span className="text-xl font-extrabold text-foreground">৳150</span>
                            <span className="text-xs text-muted-foreground">/mo</span>
                          </div>
                        </div>
                        <p className="mt-2 text-[11px] text-muted-foreground">
                          Single store & standard billing
                        </p>
                      </div>

                      {/* Business Tier */}
                      <div className="relative flex flex-col justify-between rounded-lg border border-primary/50 bg-primary/10 p-3 shadow-md">
                        <span className="absolute -top-2.5 right-2 rounded-full bg-primary px-2 py-0.5 text-[9px] font-bold uppercase text-white shadow-sm">
                          Popular
                        </span>
                        <div>
                          <div className="text-xs font-semibold text-primary">Business</div>
                          <div className="mt-1 flex items-baseline gap-1">
                            <span className="text-xl font-extrabold text-foreground">৳300</span>
                            <span className="text-xs text-muted-foreground">/mo</span>
                          </div>
                        </div>
                        <p className="mt-2 text-[11px] text-muted-foreground">
                          Multi-branch & inventory sync
                        </p>
                      </div>

                      {/* Enterprise Tier */}
                      <div className="flex flex-col justify-between rounded-lg border border-border/80 bg-background/60 p-3">
                        <div>
                          <div className="text-xs font-semibold text-muted-foreground">Enterprise</div>
                          <div className="mt-1 flex items-baseline gap-1">
                            <span className="text-xl font-extrabold text-foreground">৳500</span>
                            <span className="text-xs text-muted-foreground">/mo</span>
                          </div>
                        </div>
                        <p className="mt-2 text-[11px] text-muted-foreground">
                          Full ERP & 24/7 priority support
                        </p>
                      </div>
                    </div>
                  </div>
                ) : sol.pricingNote ? (
                  <div className="mt-5 text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">Pricing:</span> {sol.pricingNote}
                  </div>
                ) : null}

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => openDetail({ kind: "solution", id: sol.id })}
                    className="group inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90"
                  >
                    View Details
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </button>
                  {sol.demoUrl && sol.demoUrl !== "#" && (
                    <a
                      href={sol.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/50"
                    >
                      <ExternalLink className="size-4" />
                      Live Demo
                    </a>
                  )}
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
