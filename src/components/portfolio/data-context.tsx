"use client";

import * as React from "react";
import type { PublicData } from "@/lib/types";

const Ctx = React.createContext<PublicData | null>(null);

export function PortfolioDataProvider({
  data,
  children,
}: {
  data: PublicData;
  children: React.ReactNode;
}) {
  return <Ctx.Provider value={data}>{children}</Ctx.Provider>;
}

export function usePortfolio(): PublicData {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error("usePortfolio must be used within PortfolioDataProvider");
  return ctx;
}
