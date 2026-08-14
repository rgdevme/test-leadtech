"use client";

import { create } from "zustand";

export type EditorSaveState = "clean" | "dirty" | "saving" | "failed" | "conflict";

export type EditorStoreShape = {
  saveState: EditorSaveState;
  lastSavedAt: string | null;
  setSaveState: (saveState: EditorSaveState) => void;
  setLastSavedAt: (lastSavedAt: string | null) => void;
  reset: () => void;
};

export const useEditorStore = create<EditorStoreShape>()((set) => ({
  saveState: "clean",
  lastSavedAt: null,
  setSaveState: (saveState) => set({ saveState }),
  setLastSavedAt: (lastSavedAt) => set({ lastSavedAt }),
  reset: () => set({ saveState: "clean", lastSavedAt: null }),
}));
