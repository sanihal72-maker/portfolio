"use client";

import * as React from "react";
import { Menu, X } from "lucide-react";
import { usePortfolio } from "./data-context";
import { getIcon } from "./icons";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Solutions", href: "#solutions" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

const MOBILE_SECTIONS = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const { socials, settings, profile } = usePortfolio();
  const [scrolled, setScrolled] = React.useState(false);
  const [active, setActive] = React.useState("#home");
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 16);
      // active section detection
      const offsets = SECTIONS.map((s) => {
        const el = document.querySelector(s.href);
        if (!el) return { href: s.href, top: Infinity };
        const r = el.getBoundingClientRect();
        return { href: s.href, top: Math.abs(r.top - 110) };
      });
      offsets.sort((a, b) => a.top - b.top);
      if (offsets[0]) setActive(offsets[0].href);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    if (settings?.faviconUrl) {
      let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = settings.faviconUrl;
    }
  }, [settings?.faviconUrl]);

  const siteName = settings?.siteName || profile?.name || "Arya Dev";

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled
            ? "border-b border-border bg-background/80 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="#home" className="group flex items-center gap-2.5" aria-label={siteName}>
            {settings?.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt={siteName}
                className="size-9 rounded-lg border border-border object-cover transition-colors group-hover:border-primary/50"
              />
            ) : (
              <span className="flex size-9 items-center justify-center rounded-lg border border-border bg-card text-primary transition-colors group-hover:border-primary/50">
                <span className="text-base font-bold tracking-tight">
                  {siteName ? siteName.charAt(0).toUpperCase() : "S"}
                </span>
              </span>
            )}
            <span className="hidden text-sm font-semibold tracking-tight sm:block">
              {siteName}
            </span>
          </a>

          {/* desktop nav */}
          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {SECTIONS.map((s) => (
              <a
                key={s.href}
                href={s.href}
                className={cn(
                  "relative rounded-md px-3.5 py-2 text-sm font-medium transition-colors",
                  active === s.href
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {s.label}
                {active === s.href && (
                  <span className="absolute inset-x-3 -bottom-px h-px bg-primary" />
                )}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setOpen((o) => !o)}
              className="flex size-10 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:border-primary/50 md:hidden"
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* mobile dropdown */}
        {open && (
          <div className="border-t border-border bg-background/95 backdrop-blur-xl md:hidden">
            <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4" aria-label="Mobile">
              {SECTIONS.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                    active === s.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-card hover:text-foreground"
                  )}
                >
                  {s.label}
                </a>
              ))}
              <div className="mt-3 flex items-center justify-center gap-3 border-t border-border pt-3">
                {socials
                  .filter((s) => s.platform !== "whatsapp" && s.platform !== "email")
                  .slice(0, 5)
                  .map((s) => {
                    const Icon = getIcon(s.icon);
                    return (
                      <a
                        key={s.id}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.label}
                        className="flex size-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                      >
                        <Icon className="size-4" />
                      </a>
                    );
                  })}
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* mobile bottom navigation */}
      <nav
        className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur-xl md:hidden"
        aria-label="Mobile bottom"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="mx-auto flex max-w-md items-center justify-around px-2 py-1.5">
          {MOBILE_SECTIONS.map((s) => (
            <a
              key={s.href}
              href={s.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 rounded-lg px-2 py-1.5 text-[11px] font-medium transition-colors",
                active === s.href ? "text-primary" : "text-muted-foreground"
              )}
            >
              <span
                className={cn(
                  "h-0.5 w-6 rounded-full transition-colors",
                  active === s.href ? "bg-primary" : "bg-transparent"
                )}
              />
              {s.label}
            </a>
          ))}
        </div>
      </nav>
    </>
  );
}
