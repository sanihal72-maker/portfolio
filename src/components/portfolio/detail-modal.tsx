"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Check, ArrowRight } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { usePortfolio } from "./data-context";
import { DynamicIcon } from "./icons";
import { ProductMockup } from "./product-mockup";
import type { Service, Solution, Project } from "@/lib/types";

function splitList(s: string | null | undefined) {
  return (s || "")
    .split("\n")
    .map((v) => v.trim())
    .filter(Boolean);
}

export function DetailModal() {
  const detail = useAppStore((s) => s.detail);
  const closeDetail = useAppStore((s) => s.closeDetail);
  const openDetail = useAppStore((s) => s.openDetail);
  const data = usePortfolio();

  const open = detail !== null;

  // resolve content
  let title = "";
  let subtitle = "";
  let body: React.ReactNode = null;

  if (detail) {
    if (detail.kind === "service") {
      const s = data.services.find((x) => x.id === detail.id) as Service | undefined;
      if (s) {
        const features = splitList(s.features);
        title = s.title;
        subtitle = "Service";
        body = (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="flex size-12 items-center justify-center rounded-xl border border-border bg-background text-primary">
                <DynamicIcon name={s.icon} className="size-5" />
              </span>
              <span className="font-mono text-xs text-muted-foreground">
                Service {String(s.number || s.order).padStart(2, "0")}
              </span>
            </div>
            <p className="text-pretty leading-relaxed text-muted-foreground">
              {s.content || s.summary}
            </p>
            {features.length > 0 && (
              <div>
                <h4 className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
                  Key Features
                </h4>
                <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md bg-primary/15 text-primary">
                        <Check className="size-3.5" />
                      </span>
                      <span className="text-sm text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex gap-3 pt-2">
              <Button onClick={() => { closeDetail(); setTimeout(() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" }), 100); }}>
                Discuss this service
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        );
      }
    } else if (detail.kind === "solution") {
      const sol = data.solutions.find((x) => x.id === detail.id) as Solution | undefined;
      if (sol) {
        const industries = splitList(sol.industries);
        title = sol.name;
        subtitle = sol.tagline;
        body = (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="border-primary/40 text-primary">{sol.technology}</Badge>
              <Badge variant="outline" className={
                sol.status.toLowerCase() === "live"
                  ? "border-emerald-500/30 text-emerald-400"
                  : "border-amber-500/30 text-amber-400"
              }>{sol.status}</Badge>
            </div>
            <p className="text-pretty leading-relaxed text-muted-foreground">
              {sol.description || sol.summary}
            </p>
            <div className="relative">
              <div className="absolute -inset-3 rounded-2xl bg-primary/10 blur-2xl" />
              <ProductMockup
                variant={sol.slug.includes("pos") ? "dashboard" : "storefront"}
                className="relative"
              />
            </div>
            <div>
              <h4 className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
                Features
              </h4>
              <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
                {sol.features.map((f) => (
                  <li key={f.id} className="flex items-start gap-2">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md bg-primary/15 text-primary">
                      <Check className="size-3.5" />
                    </span>
                    <span className="text-sm text-muted-foreground">{f.title}</span>
                  </li>
                ))}
              </ul>
            </div>
            {industries.length > 0 && (
              <div>
                <h4 className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
                  Supported Industries
                </h4>
                <div className="mt-3 flex flex-wrap gap-2">
                  {industries.map((i) => (
                    <span key={i} className="rounded-md border border-border bg-card px-2.5 py-1 text-xs text-muted-foreground">
                      {i}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {/* Monthly Subscription plans for POS or general pricing note */}
            {sol.slug.includes("pos") || sol.name.toLowerCase().includes("pos") ? (
              <div className="rounded-xl border border-primary/25 bg-card/60 p-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Monthly Subscription Plans
                </h4>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-lg border border-border bg-background/60 p-3">
                    <div className="text-xs font-medium text-muted-foreground">Startup</div>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="text-lg font-bold text-foreground">৳150</span>
                      <span className="text-xs text-muted-foreground">/mo</span>
                    </div>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      Point of Sale & single shop billing
                    </p>
                  </div>
                  <div className="relative rounded-lg border border-primary/40 bg-primary/10 p-3">
                    <span className="absolute -top-2 right-2 rounded-full bg-primary px-1.5 py-0.2 text-[9px] font-bold uppercase text-white">
                      Popular
                    </span>
                    <div className="text-xs font-medium text-primary">Business</div>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="text-lg font-bold text-foreground">৳300</span>
                      <span className="text-xs text-muted-foreground">/mo</span>
                    </div>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      Multi-branch, inventory & accounts
                    </p>
                  </div>
                  <div className="rounded-lg border border-border bg-background/60 p-3">
                    <div className="text-xs font-medium text-muted-foreground">Enterprise</div>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="text-lg font-bold text-foreground">৳500</span>
                      <span className="text-xs text-muted-foreground">/mo</span>
                    </div>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      Full ERP, custom APIs & dedicated support
                    </p>
                  </div>
                </div>
              </div>
            ) : sol.pricingNote ? (
              <p className="text-xs text-muted-foreground">Pricing: {sol.pricingNote}</p>
            ) : null}
            <div className="flex flex-wrap gap-3 pt-2">
              {sol.demoUrl && sol.demoUrl !== "#" && (
                <Button asChild>
                  <a href={sol.demoUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="size-4" />
                    Live Demo
                  </a>
                </Button>
              )}
              <Button variant="outline" onClick={() => { closeDetail(); setTimeout(() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" }), 100); }}>
                Request this solution
              </Button>
            </div>
          </div>
        );
      }
    } else if (detail.kind === "project") {
      const p = data.projects.find((x) => x.id === detail.id) as Project | undefined;
      if (p) {
        const features = splitList(p.features);
        const objectives = p.objectives;
        title = p.title;
        subtitle = `${p.categoryName} · ${p.technology}`;
        body = (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="border-primary/40 text-primary">{p.technology}</Badge>
              <Badge variant="outline" className={
                p.status.toLowerCase() === "live"
                  ? "border-emerald-500/30 text-emerald-400"
                  : p.status.toLowerCase() === "coming soon"
                  ? "border-amber-500/30 text-amber-400"
                  : "border-sky-500/30 text-sky-400"
              }>{p.status}</Badge>
            </div>
            <div className="relative">
              <div className="absolute -inset-3 rounded-2xl bg-primary/10 blur-2xl" />
              <ProductMockup
                variant={p.categoryName.toLowerCase().includes("pos") ? "dashboard" : "storefront"}
                className="relative"
              />
            </div>
            {objectives && (
              <div>
                <h4 className="text-xs font-medium uppercase tracking-[0.18em] text-primary">Objectives</h4>
                <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">{objectives}</p>
              </div>
            )}
            <p className="text-pretty leading-relaxed text-muted-foreground">{p.summary}</p>
            {features.length > 0 && (
              <div>
                <h4 className="text-xs font-medium uppercase tracking-[0.18em] text-primary">Main Features</h4>
                <div className="mt-3 flex flex-wrap gap-2">
                  {features.map((f) => (
                    <span key={f} className="rounded-md border border-border bg-card px-2.5 py-1 text-xs text-muted-foreground">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {p.devDetails && (
              <div>
                <h4 className="text-xs font-medium uppercase tracking-[0.18em] text-primary">Development Details</h4>
                <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">{p.devDetails}</p>
              </div>
            )}
            <div className="flex flex-wrap gap-3 pt-2">
              {p.demoUrl && p.demoUrl !== "#" && p.status.toLowerCase() !== "coming soon" && (
                <Button asChild>
                  <a href={p.demoUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="size-4" />
                    Live Demo
                  </a>
                </Button>
              )}
              {p.githubUrl && (
                <Button asChild variant="outline">
                  <a href={p.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="size-4" />
                    GitHub
                  </a>
                </Button>
              )}
              {p.status.toLowerCase() === "coming soon" && (
                <Badge variant="outline" className="border-amber-500/30 text-amber-400">
                  This project is still in development
                </Badge>
              )}
            </div>
            {/* related projects */}
            {data.projects.filter((x) => x.id !== p.id).length > 0 && (
              <div>
                <h4 className="text-xs font-medium uppercase tracking-[0.18em] text-primary">Related Projects</h4>
                <div className="mt-3 flex flex-wrap gap-2">
                  {data.projects.filter((x) => x.id !== p.id).slice(0, 3).map((rp) => (
                    <button
                      key={rp.id}
                      onClick={() => openDetail({ kind: "project", id: rp.id })}
                      className="rounded-md border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                    >
                      {rp.title}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      }
    } else if (detail.kind === "page") {
      if (detail.id === "ai-seo") {
        title = "AI SEO & Search Visibility";
        subtitle = "Service";
        body = (
          <div className="space-y-6 text-muted-foreground">
            <p className="leading-relaxed">
              Technical SEO, content optimization, and Generative Engine Optimization to help your
              content surface in both traditional search and AI-powered search experiences.
            </p>
            <div>
              <h4 className="text-xs font-medium uppercase tracking-[0.18em] text-primary">What's included</h4>
              <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
                {["Technical SEO audit", "On-page optimization", "Structured data", "Content optimization", "Generative Engine Optimization", "Search visibility reports"].map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md bg-primary/15 text-primary">
                      <Check className="size-3.5" />
                    </span>
                    <span className="text-sm">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-xs text-muted-foreground">
              Note: No provider can guarantee specific Google rankings or guaranteed AI search
              citations. This service focuses on technical best practices and visibility improvements.
            </p>
          </div>
        );
      } else if (detail.id === "privacy") {
        title = "Privacy Policy";
        subtitle = "Legal";
        body = (
          <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              This privacy policy describes how your information is handled when you use this website.
            </p>
            <h4 className="text-xs font-medium uppercase tracking-[0.18em] text-primary">Information we collect</h4>
            <p>
              When you submit the contact form, we collect the name, email, phone, service, budget,
              and details you provide. This information is used solely to respond to your inquiry.
            </p>
            <h4 className="text-xs font-medium uppercase tracking-[0.18em] text-primary">How we use information</h4>
            <p>
              Inquiry data is stored securely and accessed only by the site owner to respond to and
              fulfill your request. We do not sell or share your information with third parties.
            </p>
            <h4 className="text-xs font-medium uppercase tracking-[0.18em] text-primary">Data retention</h4>
            <p>
              Inquiries are retained for as long as needed to provide our services and respond to your
              request, after which they may be archived or deleted.
            </p>
            <h4 className="text-xs font-medium uppercase tracking-[0.18em] text-primary">Contact</h4>
            <p>
              For privacy questions, contact the site owner through the contact form or email provided
              on this website.
            </p>
          </div>
        );
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && closeDetail()}>
      <DialogContent className="max-h-[88vh] max-w-3xl overflow-hidden border-border bg-card p-0 sm:rounded-2xl">
        <DialogHeader className="border-b border-border px-6 py-5">
          <DialogTitle className="text-xl font-bold tracking-tight sm:text-2xl">
            {title}
          </DialogTitle>
          {subtitle && (
            <DialogDescription className="text-sm text-primary">
              {subtitle}
            </DialogDescription>
          )}
        </DialogHeader>
        <ScrollArea className="max-h-[64vh] px-6 py-6">
          {body}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
