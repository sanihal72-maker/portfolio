"use client";

import { useAppStore } from "@/store/app-store";
import { PortfolioView } from "@/components/portfolio/portfolio-view";
import { AdminView } from "@/components/admin/admin-view";

export default function Home() {
  const view = useAppStore((s) => s.view);

  if (view === "admin") {
    return <AdminView />;
  }

  return <PortfolioView />;
}
