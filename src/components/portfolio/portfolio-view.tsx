"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import type { PublicData } from "@/lib/types";
import { PortfolioDataProvider } from "./data-context";
import { Navbar } from "./navbar";
import { Hero } from "./hero";
import { About } from "./about";
import { Technologies } from "./technologies";
import { Services } from "./services";
import { Solutions } from "./solutions";
import { Projects } from "./projects";
import { WhyMe } from "./why-me";
import { Testimonials } from "./testimonials";
import { Contact } from "./contact";
import { Footer } from "./footer";
import { DetailModal } from "./detail-modal";

async function fetchPublic(): Promise<PublicData> {
  const res = await fetch("/api/public", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load portfolio data");
  return res.json();
}

function LoadingState() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="h-16" />
      <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="space-y-4">
          <div className="h-6 w-24 animate-pulse rounded bg-card" />
          <div className="h-16 w-3/4 animate-pulse rounded bg-card" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-card" />
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 animate-pulse rounded-2xl bg-card" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function PortfolioView() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["public-data"],
    queryFn: fetchPublic,
  });

  if (isLoading) return <LoadingState />;
  if (isError || !data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-sm text-muted-foreground">
          Something went wrong while loading the portfolio.
        </p>
        <button
          onClick={() => refetch()}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <PortfolioDataProvider data={data}>
      <div className="flex min-h-screen flex-col overflow-x-hidden w-full">
        <Navbar />
        <main className="flex-1 pb-16 md:pb-0 overflow-x-hidden w-full">
          <Hero />
          <About />
          <Technologies />
          <Services />
          <Solutions />
          <Projects />
          <WhyMe />
          <Testimonials />
          <Contact />
        </main>
        <Footer />
        <DetailModal />
      </div>
    </PortfolioDataProvider>
  );
}
