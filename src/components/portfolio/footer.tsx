"use client";

import * as React from "react";
import { Lock } from "lucide-react";
import { usePortfolio } from "./data-context";
import { useAppStore } from "@/store/app-store";
import { getIcon } from "./icons";

export function Footer() {
  const { settings, profile, socials, navigation } = usePortfolio();
  const setView = useAppStore((s) => s.setView);
  const openDetail = useAppStore((s) => s.openDetail);

  const siteName = settings?.siteName || profile?.name || "Arya Dev";
  const year = new Date().getFullYear();

  const navLinks = navigation.length
    ? navigation
    : [
        { id: "n1", label: "Home", href: "#home", icon: null, order: 1, enabled: true },
        { id: "n2", label: "About", href: "#about", icon: null, order: 2, enabled: true },
        { id: "n3", label: "Services", href: "#services", icon: null, order: 3, enabled: true },
        { id: "n4", label: "Solutions", href: "#solutions", icon: null, order: 4, enabled: true },
        { id: "n5", label: "Projects", href: "#projects", icon: null, order: 5, enabled: true },
        { id: "n6", label: "Contact", href: "#contact", icon: null, order: 6, enabled: true },
      ];

  return (
    <footer className="relative mt-auto border-t border-border bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* brand */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-lg border border-border bg-card text-primary">
                <span className="text-base font-bold tracking-tight">A</span>
              </span>
              <span className="text-sm font-semibold tracking-tight">{siteName}</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {settings?.footerContent ||
                profile?.bio ||
                "Building digital experiences for real businesses."}
            </p>
          </div>

          {/* nav */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Navigation
            </h4>
            <ul className="mt-4 grid grid-cols-2 gap-2.5 lg:grid-cols-1">
              {navLinks.map((n) => (
                <li key={n.id}>
                  <a
                    href={n.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* connect */}
          <div className="lg:col-span-4">
            <h4 className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Connect
            </h4>
            <div className="mt-4 flex flex-wrap gap-2">
              {socials.map((s) => {
                const Icon = getIcon(s.icon);
                return (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex size-10 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                  >
                    <Icon className="size-4" />
                  </a>
                );
              })}
            </div>
            <button
              onClick={() => openDetail({ kind: "page", id: "privacy" })}
              className="mt-4 text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              Privacy Policy
            </button>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {year} {siteName}. All rights reserved.
          </p>
          <button
            onClick={() => setView("admin")}
            className="flex items-center gap-1.5 text-xs text-muted-foreground/70 transition-colors hover:text-primary"
            aria-label="Admin access"
          >
            <Lock className="size-3" />
            Admin
          </button>
        </div>
      </div>
    </footer>
  );
}
