"use client";

import * as React from "react";
import {
  ArrowRight,
  MessageCircle,
  Sparkles,
  Code2,
  Terminal,
  Cpu,
  Zap,
  Activity,
  CheckCircle2,
  Copy,
  Check,
  Layers,
  Server,
  ShieldCheck,
  Boxes,
} from "lucide-react";
import { usePortfolio } from "./data-context";
import { getIcon, getSocialIcon } from "./icons";
import { motion, AnimatePresence } from "framer-motion";

export function Hero() {
  const { profile, socials, settings } = usePortfolio();
  const whatsapp = socials.find((s) => s.platform === "whatsapp");
  const whatsappNumber = settings?.whatsappNumber || profile?.phone || "";
  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}`
    : (whatsapp?.url || "#");

  const name = profile?.name || "Arya Dev";
  const title = profile?.title || "Full-Stack Developer & Business Solutions Specialist";
  const bio = profile?.bio || "";
  const projectsDone = profile?.projectsDone || 42;
  const yearsExperience = profile?.yearsExperience || 6;
  const clientsServed = profile?.clientsServed || 28;

  const [activeTab, setActiveTab] = React.useState<"code" | "arch" | "metrics">("code");
  const [copied, setCopied] = React.useState(false);

  const codeSnippet = `export const engineer = {
  name: "${name}",
  role: "Full-Stack & Business Systems",
  experience: "${yearsExperience}+ years production",
  stack: [
    "Next.js 16", "React 19", "TypeScript",
    "Node.js", "Tailwind CSS", "Prisma"
  ],
  shipped: "${projectsDone}+ real-world systems",
  status: "Available for new projects" ⚡
};`;

  const handleCopy = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(codeSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-16"
    >
      {/* background layers */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.35]" />
      <div className="pointer-events-none absolute -left-40 top-1/3 size-[500px] rounded-full bg-primary/20 blur-[140px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 size-[450px] rounded-full bg-primary/15 blur-[130px]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:px-8">
        {/* left — content */}
        <div className="lg:col-span-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3.5 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            Available for new projects
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="mt-6 text-balance text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
          >
            Building Digital<br className="hidden sm:block" />{" "}
            <span className="text-gradient">Experiences</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            <span className="font-medium text-foreground">{name}</span> — {title}. {bio}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.18 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <a
              href="#projects"
              className="group inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-[0_0_0_1px_rgba(139,92,246,0.4),0_12px_40px_-12px_rgba(139,92,246,0.7)]"
            >
              View My Work
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/50 hover:text-primary"
            >
              <Sparkles className="size-4" />
              Let&apos;s Talk
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex size-11 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
              aria-label="WhatsApp"
            >
              <MessageCircle className="size-4" />
            </a>
          </motion.div>

          {/* social links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.24 }}
            className="mt-8 flex items-center gap-4"
          >
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Connect
            </span>
            <div className="h-px w-8 bg-border" />
            <div className="flex items-center gap-2.5">
              {socials
                .filter((s) => s.platform !== "whatsapp")
                .slice(0, 6)
                .map((s) => {
                  const Icon = getSocialIcon(s.platform, s.icon);
                  return (
                    <a
                      key={s.id}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="text-muted-foreground transition-colors hover:text-primary"
                    >
                      <Icon className="size-[18px]" />
                    </a>
                  );
                })}
            </div>
          </motion.div>
        </div>

        {/* right — Modern Glassmorphism Code & System Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative lg:col-span-6"
        >
          {/* Animated Ambient Glow */}
          <motion.div
            animate={{
              scale: [1, 1.12, 1],
              opacity: [0.35, 0.55, 0.35],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-tr from-primary/30 via-purple-600/20 to-indigo-500/10 blur-[80px]"
          />

          {/* Floating Pill Top Left — Live System Status */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-2 -top-4 sm:-left-4 sm:-top-6 z-20 flex items-center gap-2 rounded-xl border border-primary/30 bg-card/90 px-2.5 py-1.5 sm:px-3.5 sm:py-2 shadow-xl backdrop-blur-md"
          >
            <div className="relative flex size-2 sm:size-2.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 sm:size-2.5 rounded-full bg-emerald-500" />
            </div>
            <div className="text-[11px] sm:text-xs">
              <span className="font-semibold text-foreground">Production-Ready</span>
              <span className="ml-1 text-muted-foreground hidden xs:inline sm:inline">• 99.9% Uptime</span>
            </div>
          </motion.div>

          {/* Floating Pill Top Right — Speed badge */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute -right-2 -top-4 sm:-right-3 sm:-top-5 z-20 hidden sm:flex items-center gap-2 rounded-xl border border-border bg-card/90 px-3 py-1.5 shadow-lg backdrop-blur-md"
          >
            <Zap className="size-3.5 text-amber-400" />
            <span className="text-xs font-medium text-foreground">Turbopack Fast</span>
          </motion.div>

          {/* Main Interactive Terminal / Dashboard Card */}
          <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-b from-[#181822]/95 to-[#101017]/95 p-1 shadow-2xl backdrop-blur-xl w-full max-w-full">
            {/* Window Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 bg-surface-2/60 px-3 py-2.5 sm:px-4 sm:py-3">
              {/* Traffic light dots */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="size-2.5 sm:size-3 rounded-full bg-rose-500/80 transition-opacity hover:opacity-100" />
                <span className="size-2.5 sm:size-3 rounded-full bg-amber-500/80 transition-opacity hover:opacity-100" />
                <span className="size-2.5 sm:size-3 rounded-full bg-emerald-500/80 transition-opacity hover:opacity-100" />
                <span className="ml-1 sm:ml-2 font-mono text-[10px] sm:text-[11px] text-muted-foreground/80 hidden md:inline truncate max-w-[140px]">
                  ~/workspace/{name ? name.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") : "core"}
                </span>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-0.5 sm:gap-1 rounded-lg bg-card/80 p-0.5 border border-border/40 overflow-x-auto max-w-full">
                <button
                  type="button"
                  onClick={() => setActiveTab("code")}
                  className={`flex items-center gap-1 sm:gap-1.5 rounded-md px-2 py-1 text-[11px] sm:text-xs font-medium transition-all ${
                    activeTab === "code"
                      ? "bg-primary text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Code2 className="size-3 sm:size-3.5" />
                  <span>developer.ts</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("arch")}
                  className={`flex items-center gap-1 sm:gap-1.5 rounded-md px-2 py-1 text-[11px] sm:text-xs font-medium transition-all ${
                    activeTab === "arch"
                      ? "bg-primary text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Layers className="size-3 sm:size-3.5" />
                  <span>architecture</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("metrics")}
                  className={`flex items-center gap-1 sm:gap-1.5 rounded-md px-2 py-1 text-[11px] sm:text-xs font-medium transition-all ${
                    activeTab === "metrics"
                      ? "bg-primary text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Activity className="size-3 sm:size-3.5" />
                  <span>metrics</span>
                </button>
              </div>

              {/* Copy button */}
              <button
                type="button"
                onClick={handleCopy}
                className="hidden sm:flex size-7 items-center justify-center rounded-md border border-border/60 bg-card/60 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                title="Copy code"
              >
                {copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
              </button>
            </div>

            {/* Window Body */}
            <div className="min-h-[300px] sm:min-h-[340px] p-3 sm:p-6 font-mono text-xs sm:text-[13px] leading-relaxed overflow-x-auto">
              <AnimatePresence mode="wait">
                {activeTab === "code" && (
                  <motion.div
                    key="tab-code"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-1 text-foreground/90"
                  >
                    <div className="text-muted-foreground/60 italic pb-1">
                      // ⚡ High-Performance Full-Stack & Business Systems
                    </div>
                    <div>
                      <span className="text-purple-400 font-semibold">export const</span>{" "}
                      <span className="text-amber-300 font-semibold">engineer</span> = &#123;
                    </div>
                    <div className="pl-4">
                      <span className="text-blue-300">name</span>:{" "}
                      <span className="text-emerald-300">&quot;{name}&quot;</span>,
                    </div>
                    <div className="pl-4">
                      <span className="text-blue-300">role</span>:{" "}
                      <span className="text-emerald-300">&quot;Full-Stack & ERP Architect&quot;</span>,
                    </div>
                    <div className="pl-4">
                      <span className="text-blue-300">experience</span>:{" "}
                      <span className="text-emerald-300">&quot;{yearsExperience}+ years production&quot;</span>,
                    </div>
                    <div className="pl-4">
                      <span className="text-blue-300">coreStack</span>: [
                    </div>
                    <div className="pl-8 text-primary-foreground/90">
                      <span className="text-amber-200">&quot;Next.js 16&quot;</span>,{" "}
                      <span className="text-amber-200">&quot;TypeScript&quot;</span>,{" "}
                      <span className="text-amber-200">&quot;React 19&quot;</span>,
                    </div>
                    <div className="pl-8 text-primary-foreground/90">
                      <span className="text-amber-200">&quot;Node.js&quot;</span>,{" "}
                      <span className="text-amber-200">&quot;Tailwind CSS&quot;</span>,{" "}
                      <span className="text-amber-200">&quot;Prisma ORM&quot;</span>
                    </div>
                    <div className="pl-4">],</div>
                    <div className="pl-4">
                      <span className="text-blue-300">deliverables</span>: &#123;
                    </div>
                    <div className="pl-8">
                      <span className="text-purple-300">projects</span>:{" "}
                      <span className="text-amber-400 font-bold">{projectsDone}+</span>,{" "}
                      <span className="text-purple-300">clients</span>:{" "}
                      <span className="text-amber-400 font-bold">{clientsServed}+</span>
                    </div>
                    <div className="pl-4">&#125;,</div>
                    <div className="pl-4">
                      <span className="text-blue-300">status</span>:{" "}
                      <span className="text-emerald-400">&quot;Ready for high-impact projects&quot;</span>
                    </div>
                    <div>
                      &#125;;
                      <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className="inline-block ml-1 h-4 w-1.5 bg-primary align-middle"
                      />
                    </div>
                  </motion.div>
                )}

                {activeTab === "arch" && (
                  <motion.div
                    key="tab-arch"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col gap-3 font-sans"
                  >
                    <div className="text-xs font-mono text-muted-foreground pb-1">
                      // Scalable Production Architecture
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="rounded-xl border border-border/80 bg-card/60 p-3">
                        <div className="flex items-center gap-2 text-primary font-semibold text-xs">
                          <Boxes className="size-4" />
                          <span>Frontend Layer</span>
                        </div>
                        <p className="mt-1 text-[11px] text-muted-foreground">
                          Next.js 16 App Router, React 19, Tailwind CSS & Framer Motion
                        </p>
                      </div>

                      <div className="rounded-xl border border-border/80 bg-card/60 p-3">
                        <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs">
                          <Cpu className="size-4" />
                          <span>Edge & API</span>
                        </div>
                        <p className="mt-1 text-[11px] text-muted-foreground">
                          Server Actions, REST & type-safe RPC endpoints
                        </p>
                      </div>

                      <div className="rounded-xl border border-border/80 bg-card/60 p-3">
                        <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs">
                          <Server className="size-4" />
                          <span>Data Engine</span>
                        </div>
                        <p className="mt-1 text-[11px] text-muted-foreground">
                          Prisma ORM, SQLite/PostgreSQL, transactional safety
                        </p>
                      </div>

                      <div className="rounded-xl border border-border/80 bg-card/60 p-3">
                        <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
                          <ShieldCheck className="size-4" />
                          <span>Business Core</span>
                        </div>
                        <p className="mt-1 text-[11px] text-muted-foreground">
                          POS / ERP, Inventory, Billing & real-world workflows
                        </p>
                      </div>
                    </div>

                    <div className="mt-2 flex items-center justify-between rounded-lg border border-primary/20 bg-primary/10 px-3 py-2 text-xs">
                      <span className="flex items-center gap-2 text-primary font-medium">
                        <CheckCircle2 className="size-4 text-primary" />
                        Clean Architecture & Real-world Tested
                      </span>
                      <span className="text-[11px] font-mono text-muted-foreground">100% Type-Safe</span>
                    </div>
                  </motion.div>
                )}

                {activeTab === "metrics" && (
                  <motion.div
                    key="tab-metrics"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-2 gap-3 font-sans"
                  >
                    <div className="rounded-xl border border-border/80 bg-card/60 p-4">
                      <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-mono">
                        Performance
                      </div>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-emerald-400">100</span>
                        <span className="text-xs text-muted-foreground">/ 100</span>
                      </div>
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        Lighthouse Core Web Vitals score
                      </p>
                    </div>

                    <div className="rounded-xl border border-border/80 bg-card/60 p-4">
                      <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-mono">
                        System Uptime
                      </div>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-primary">99.9%</span>
                      </div>
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        Production reliability & monitoring
                      </p>
                    </div>

                    <div className="rounded-xl border border-border/80 bg-card/60 p-4">
                      <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-mono">
                        Shipped Systems
                      </div>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-amber-400">{projectsDone}+</span>
                        <span className="text-xs text-muted-foreground">apps</span>
                      </div>
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        Retail, Pharmacy, POS & Custom Web
                      </p>
                    </div>

                    <div className="rounded-xl border border-border/80 bg-card/60 p-4">
                      <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-mono">
                        Edge Latency
                      </div>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-indigo-400">&lt;35ms</span>
                      </div>
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        Global CDN & optimized response
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Status Bar */}
            <div className="flex items-center justify-between border-t border-border/60 bg-surface-2/40 px-4 py-2.5 text-[11px] text-muted-foreground font-mono">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-emerald-400" />
                  <span>main*</span>
                </span>
                <span className="hidden sm:inline">TypeScript 5.x</span>
                <span className="hidden sm:inline">UTF-8</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-primary font-semibold">Next.js Turbopack</span>
                <span>Ready</span>
              </div>
            </div>
          </div>

          {/* Floating Pill Bottom Left — Experience badge */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute left-2 -bottom-4 sm:-left-5 sm:-bottom-5 z-20 flex items-center gap-2.5 sm:gap-3 rounded-xl border border-border bg-card/95 px-3 py-2 sm:px-4 sm:py-2.5 shadow-xl backdrop-blur-md"
          >
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/20 text-primary font-bold text-sm">
              {yearsExperience}+
            </div>
            <div className="text-xs">
              <div className="font-semibold text-foreground">Years Experience</div>
              <div className="text-[11px] text-muted-foreground">Building real software</div>
            </div>
          </motion.div>

          {/* Floating Pill Bottom Right — Tech highlights */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            className="absolute -right-4 -bottom-6 z-20 hidden sm:flex items-center gap-2 rounded-xl border border-primary/30 bg-card/95 px-3.5 py-2 shadow-xl backdrop-blur-md"
          >
            <Sparkles className="size-4 text-primary" />
            <div className="text-xs font-medium text-foreground">
              <span>{projectsDone}+ Projects Delivered</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
