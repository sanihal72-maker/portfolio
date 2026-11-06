"use client";

import * as React from "react";
import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";
import { usePortfolio } from "./data-context";
import { getIcon } from "./icons";
import { motion } from "framer-motion";

export function Hero() {
  const { profile, socials, settings } = usePortfolio();
  const whatsapp = socials.find((s) => s.platform === "whatsapp");
  const whatsappUrl =
    whatsapp?.url ||
    (settings?.whatsappNumber ? `https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, "")}` : "#");

  const name = profile?.name || "Arya Dev";
  const title = profile?.title || "Full-Stack Developer & Business Solutions Specialist";
  const bio = profile?.bio || "";

  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-16"
    >
      {/* background layers */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.35]" />
      <div className="pointer-events-none absolute -left-40 top-1/3 size-[480px] rounded-full bg-primary/20 blur-[140px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 size-[420px] rounded-full bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:px-8">
        {/* left — content */}
        <div className="lg:col-span-7">
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
                  const Icon = getIcon(s.icon);
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

        {/* right — abstract visual composition */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative hidden lg:col-span-5 lg:block"
        >
          <div className="relative aspect-square">
            {/* glow */}
            <div className="absolute inset-8 rounded-full bg-primary/20 blur-[90px]" />
            {/* main image */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl border border-border bg-card">
              <img
                src="/images/hero-visual.png"
                alt="Abstract 3D digital composition with purple geometric shapes"
                className="size-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
            </div>
            {/* floating cards */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-6 top-12 flex items-center gap-2 rounded-xl border border-border bg-card/90 px-3.5 py-2.5 backdrop-blur"
            >
              <span className="flex size-7 items-center justify-center rounded-md bg-primary/15 text-primary">
                <Sparkles className="size-3.5" />
              </span>
              <div className="text-xs">
                <div className="font-semibold">Production-ready</div>
                <div className="text-muted-foreground">software shipped</div>
              </div>
            </motion.div>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -right-4 bottom-16 flex items-center gap-2 rounded-xl border border-border bg-card/90 px-3.5 py-2.5 backdrop-blur"
            >
              <span className="flex size-7 items-center justify-center rounded-md bg-primary/15 text-primary text-xs font-bold">
                42+
              </span>
              <div className="text-xs">
                <div className="font-semibold">Projects delivered</div>
                <div className="text-muted-foreground">for real businesses</div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
