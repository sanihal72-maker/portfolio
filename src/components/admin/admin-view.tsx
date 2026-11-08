"use client";

import * as React from "react";

import { useAppStore } from "@/store/app-store";
import { fetchJson, type Admin } from "./lib";
import { AdminShell } from "./admin-shell";
import { LoginScreen } from "./login";
import { CenteredLoading } from "./shared";

import { DashboardModule } from "./modules/dashboard";
import { ProfileModule } from "./modules/profile";
import { SkillsModule } from "./modules/skills";
import { ServicesModule } from "./modules/services";
import { SolutionsModule } from "./modules/solutions";
import { ProjectsModule } from "./modules/projects";
import { CategoriesModule } from "./modules/categories";
import { TestimonialsModule } from "./modules/testimonials";
import { SocialsModule } from "./modules/socials";
import { InquiriesModule } from "./modules/inquiries";
import { SeoModule } from "./modules/seo";
import { NavigationModule } from "./modules/navigation";
import { SettingsModule } from "./modules/settings";

export type AdminModule =
  | "dashboard"
  | "profile"
  | "skills"
  | "services"
  | "solutions"
  | "projects"
  | "categories"
  | "testimonials"
  | "inquiries"
  | "socials"
  | "navigation"
  | "seo"
  | "settings";

type AuthState =
  | { status: "loading" }
  | { status: "unauthenticated" }
  | { status: "authenticated"; admin: Admin };

export function AdminView() {
  const setView = useAppStore((s) => s.setView);
  const [active, setActive] = React.useState<AdminModule>("dashboard");
  const [auth, setAuth] = React.useState<AuthState>({ status: "loading" });

  const checkAuth = React.useCallback(async () => {
    try {
      const res = await fetchJson<{ admin: Admin }>("/api/admin/me");
      setAuth({ status: "authenticated", admin: res.admin });
    } catch {
      setAuth({ status: "unauthenticated" });
    }
  }, []);

  React.useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  function handleLogout() {
    fetch("/api/admin/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .catch(() => {
        /* ignore */
      })
      .finally(() => {
        setAuth({ status: "unauthenticated" });
      });
  }

  function handleBackToSite() {
    setView("portfolio");
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  }

  if (auth.status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <CenteredLoading label="Verifying session..." />
      </div>
    );
  }

  if (auth.status === "unauthenticated") {
    return (
      <LoginScreen
        onLoggedIn={(admin) => setAuth({ status: "authenticated", admin })}
        onBackToSite={handleBackToSite}
      />
    );
  }

  return (
    <AdminShell
      active={active}
      setActive={(id) => setActive(id as AdminModule)}
      admin={auth.admin}
      onLogout={handleLogout}
      onBackToSite={handleBackToSite}
    >
      <ModuleRouter active={active} setActive={setActive} />
    </AdminShell>
  );
}

function ModuleRouter({
  active,
  setActive,
}: {
  active: AdminModule;
  setActive: (id: AdminModule) => void;
}) {
  switch (active) {
    case "dashboard":
      return <DashboardModule onNavigate={(id) => setActive(id as AdminModule)} />;
    case "profile":
      return <ProfileModule />;
    case "skills":
      return <SkillsModule />;
    case "services":
      return <ServicesModule />;
    case "solutions":
      return <SolutionsModule />;
    case "projects":
      return <ProjectsModule />;
    case "categories":
      return <CategoriesModule />;
    case "testimonials":
      return <TestimonialsModule />;
    case "inquiries":
      return <InquiriesModule />;
    case "socials":
      return <SocialsModule />;
    case "navigation":
      return <NavigationModule />;
    case "seo":
      return <SeoModule />;
    case "settings":
      return <SettingsModule />;
    default:
      return <DashboardModule onNavigate={(id) => setActive(id as AdminModule)} />;
  }
}

export default AdminView;
