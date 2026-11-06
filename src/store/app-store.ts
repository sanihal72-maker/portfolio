import { create } from "zustand";
import type { DetailTarget } from "@/lib/types";

type View = "portfolio" | "admin";

type AppState = {
  view: View;
  detail: DetailTarget;
  setView: (v: View) => void;
  openDetail: (d: Exclude<DetailTarget, null>) => void;
  closeDetail: () => void;
};

export const useAppStore = create<AppState>((set) => ({
  view: "portfolio",
  detail: null,
  setView: (v) => set({ view: v }),
  openDetail: (d) => set({ detail: d }),
  closeDetail: () => set({ detail: null }),
}));
