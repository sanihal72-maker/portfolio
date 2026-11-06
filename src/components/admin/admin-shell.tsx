"use client";

import * as React from "react";
import {
  ArrowLeft,
  Boxes,
  Briefcase,
  Cpu,
  FolderKanban,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Settings,
  Share2,
  Star,
  Tags,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { Admin } from "./lib";

export type NavItem = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

export type NavGroup = {
  title: string;
  items: NavItem[];
};

export const NAV_GROUPS: NavGroup[] = [
  {
    title: "Overview",
    items: [{ id: "dashboard", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    title: "Content",
    items: [
      { id: "profile", label: "Profile", icon: User },
      { id: "skills", label: "Skills", icon: Cpu },
      { id: "services", label: "Services", icon: Briefcase },
      { id: "solutions", label: "Solutions", icon: Boxes },
      { id: "projects", label: "Projects", icon: FolderKanban },
      { id: "categories", label: "Categories", icon: Tags },
      { id: "testimonials", label: "Testimonials", icon: Star },
    ],
  },
  {
    title: "Communication",
    items: [
      { id: "inquiries", label: "Inquiries", icon: Inbox },
      { id: "socials", label: "Social Links", icon: Share2 },
    ],
  },
  {
    title: "Site",
    items: [
      { id: "navigation", label: "Navigation", icon: Menu },
      { id: "seo", label: "SEO", icon: Search },
      { id: "settings", label: "Settings", icon: Settings },
    ],
  },
];

export function findNavItem(id: string): NavItem | undefined {
  for (const group of NAV_GROUPS) {
    const item = group.items.find((i) => i.id === id);
    if (item) return item;
  }
  return undefined;
}

export function AdminShell({
  active,
  setActive,
  admin,
  onLogout,
  onBackToSite,
  children,
}: {
  active: string;
  setActive: (id: string) => void;
  admin: Admin;
  onLogout: () => void;
  onBackToSite: () => void;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [loggingOut, setLoggingOut] = React.useState(false);

  const currentItem = findNavItem(active);
  const pageTitle = currentItem?.label ?? "Dashboard";

  function handleNav(id: string) {
    setActive(id);
    setMobileOpen(false);
  }

  function handleLogout() {
    setLoggingOut(true);
    onLogout();
  }

  const sidebarInner = (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center justify-between gap-2 border-b border-sidebar-border px-5 py-5">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold tracking-tight">Arya Dev</span>
            <Badge className="bg-primary/15 text-primary border border-primary/20">
              Admin
            </Badge>
          </div>
          <span className="text-xs text-muted-foreground">Control Center</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {NAV_GROUPS.map((group) => (
          <div key={group.title} className="mb-4">
            <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {group.title}
            </p>
            <ul className="flex flex-col gap-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = active === item.id;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => handleNav(item.id)}
                      className={cn(
                        "flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <Icon className="size-4" />
                      <span className="truncate">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <div className="mb-2 rounded-md bg-sidebar-accent/50 p-3">
          <p className="truncate text-sm font-medium">{admin.name}</p>
          <p className="truncate text-xs text-muted-foreground">{admin.email}</p>
        </div>
        <button
          type="button"
          onClick={onBackToSite}
          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to site
        </button>
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="size-4" />
          {loggingOut ? "Signing out..." : "Sign out"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-[260px] shrink-0 border-r border-sidebar-border md:block">
        {sidebarInner}
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[260px] border-sidebar-border p-0 sm:max-w-[260px]">
          <SheetTitle className="sr-only">Admin navigation</SheetTitle>
          {sidebarInner}
        </SheetContent>
      </Sheet>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border bg-background/80 px-4 backdrop-blur md:px-6">
          <div className="flex items-center gap-2">
            {/* Mobile trigger */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="size-5" />
              <span className="sr-only">Open navigation</span>
            </Button>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold tracking-tight md:text-lg">
                {pageTitle}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden flex-col text-right sm:flex">
              <span className="text-sm font-medium leading-tight">{admin.name}</span>
              <span className="text-xs text-muted-foreground">{admin.email}</span>
            </div>
            <div className="flex size-8 items-center justify-center rounded-full bg-primary/15 text-primary">
              <span className="text-xs font-semibold">
                {admin.name.slice(0, 1).toUpperCase()}
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
