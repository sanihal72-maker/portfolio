"use client";

import * as React from "react";
import { Mail, MapPin, ArrowUp, MessageCircle, Phone } from "lucide-react";
import { usePortfolio } from "./data-context";
import { useAppStore } from "@/store/app-store";
import { getIcon, getSocialIcon } from "./icons";

export function Footer() {
  const { settings, profile, socials, navigation, services } = usePortfolio();
  const setView = useAppStore((s) => s.setView);
  const openDetail = useAppStore((s) => s.openDetail);

  const siteName = settings?.siteName || profile?.name || "Portfolio";
  const year = new Date().getFullYear();
  const location = profile?.location || "Dhaka, Bangladesh";
  const email = settings?.contactEmail || profile?.email || "";
  const phone = settings?.whatsappNumber || profile?.phone || "";

  const whatsappUrl = phone
    ? `https://wa.me/${phone.replace(/[^0-9]/g, "")}`
    : socials.find((s) => s.platform === "whatsapp")?.url || "";

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

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="relative mt-auto border-t border-border bg-gradient-to-b from-background to-[#0d0d12] pb-24 md:pb-0">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Col 1: Brand & Contact */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {settings?.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt={siteName}
                  className="size-10 rounded-xl border border-border object-cover shadow-sm"
                />
              ) : (
                <span className="flex size-10 items-center justify-center rounded-xl border border-border bg-card text-primary font-bold shadow-sm">
                  {siteName ? siteName.charAt(0).toUpperCase() : "S"}
                </span>
              )}
              <span className="text-base font-bold tracking-tight text-foreground">
                {siteName}
              </span>
            </div>

            <p className="text-sm leading-relaxed text-muted-foreground">
              Building digital experiences for real businesses.
            </p>

            <div className="space-y-2 text-sm text-muted-foreground">
              {location && (
                <div className="flex items-center gap-2">
                  <MapPin className="size-3.5 text-primary shrink-0" />
                  <span>{location}</span>
                </div>
              )}
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-2 transition-colors hover:text-primary"
                >
                  <Mail className="size-3.5 text-primary shrink-0" />
                  <span className="truncate">{email}</span>
                </a>
              )}
              {phone && (
                <div className="flex items-center gap-2">
                  <Phone className="size-3.5 text-primary shrink-0" />
                  <span>{phone}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs font-medium text-foreground">
                Available for new projects
              </span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground">
              Navigation
            </h4>
            <ul className="mt-4 space-y-2">
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

          {/* Col 3: Services */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground">
              Services
            </h4>
            <ul className="mt-4 space-y-2">
              {services.slice(0, 5).map((s) => (
                <li key={s.id}>
                  <a
                    href="#services"
                    className="text-sm text-muted-foreground transition-colors hover:text-primary block truncate"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#solutions"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                >
                  <span>POS & ERP Solutions</span>
                  <span className="rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold text-primary">
                    SaaS
                  </span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Connect */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground">
              Connect
            </h4>

            {/* Social Icons */}
            <div className="flex flex-wrap gap-2">
              {socials
                .filter((s) => s.platform !== "whatsapp")
                .map((s) => {
                  const Icon = getSocialIcon(s.platform, s.icon);
                  const href = s.platform === "email" && email ? `mailto:${email}` : s.url;
                  return (
                    <a
                      key={s.id}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="flex size-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-all hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
                    >
                      <Icon className="size-4" />
                    </a>
                  );
                })}
            </div>

            {/* WhatsApp CTA */}
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-xs font-semibold text-emerald-400 transition-all hover:bg-emerald-500/20 hover:border-emerald-500/50"
              >
                <MessageCircle className="size-4" />
                <span>Chat on WhatsApp</span>
              </a>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {year} {siteName}. All rights reserved.</p>

          <div className="flex items-center gap-4">
            <button
              onClick={() => openDetail({ kind: "page", id: "privacy" })}
              className="transition-colors hover:text-foreground"
            >
              Privacy Policy
            </button>
            <span className="text-border">•</span>
            <button
              onClick={scrollToTop}
              className="group flex items-center gap-1 transition-colors hover:text-primary"
            >
              <span>Back to Top</span>
              <ArrowUp className="size-3.5 transition-transform group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
