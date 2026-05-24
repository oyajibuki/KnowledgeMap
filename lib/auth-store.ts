"use client";

import { create } from "zustand";
import type { User, Session } from "@supabase/supabase-js";
import { supabase, loadProgress, saveProgress } from "@/lib/supabase";

interface SyncPayload {
  node_statuses: Record<string, "locked" | "viewed" | "mastered">;
  exam_completed: boolean;
  exam_score: number;
  exam_passed: boolean;
  galaxy_completed: boolean;
}

interface AuthStore {
  user: User | null;
  session: Session | null;
  authModalOpen: boolean;
  syncing: boolean;
  init: () => Promise<void>;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  syncToSupabase: (payload: SyncPayload) => Promise<void>;
}

async function applyRemoteProgress(userId: string) {
  const row = await loadProgress(userId);
  if (!row) return;

  const { useGameStore } = await import("@/lib/store");
  const store = useGameStore.getState();

  const localMastered = store.nodes.filter((n) => n.status === "mastered").length;
  const remoteMastered = Object.values(row.node_statuses).filter(
    (s) => s === "mastered"
  ).length;

  // Supabaseの方が進んでいるかフラグが有効な場合に反映
  if (
    remoteMastered >= localMastered ||
    row.galaxy_completed ||
    row.exam_completed
  ) {
    store.loadFromRemote(row);
  }
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  session: null,
  authModalOpen: false,
  syncing: false,

  init: async () => {
    if (!supabase) return;

    const {
      data: { session },
    } = await supabase.auth.getSession();
    set({ user: session?.user ?? null, session });

    if (session?.user) {
      await applyRemoteProgress(session.user.id);
    }

    supabase.auth.onAuthStateChange(async (_event, session) => {
      const prevUser = get().user;
      set({ user: session?.user ?? null, session });
      if (session?.user && !prevUser) {
        // 新規ログイン → Supabaseから進捗をロード
        await applyRemoteProgress(session.user.id);
      }
    });
  },

  openAuthModal: () => set({ authModalOpen: true }),
  closeAuthModal: () => set({ authModalOpen: false }),

  signInWithGoogle: async () => {
    if (!supabase) return;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:
          typeof window !== "undefined"
            ? `${window.location.origin}/auth/callback`
            : undefined,
      },
    });
  },

  signOut: async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    set({ user: null, session: null });
  },

  syncToSupabase: async (payload) => {
    const { user } = get();
    if (!user) return;
    set({ syncing: true });
    await saveProgress(user.id, payload);
    set({ syncing: false });
  },
}));
