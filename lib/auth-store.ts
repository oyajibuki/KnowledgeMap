import { create } from "zustand";
import type { User, Session } from "@supabase/supabase-js";
import { supabase, saveProgress } from "@/lib/supabase";

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
  authLoading: boolean;
  authError: string | null;
  init: () => Promise<void>;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  syncToSupabase: (payload: SyncPayload) => Promise<void>;
  clearAuthError: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  session: null,
  authModalOpen: false,
  syncing: false,
  authLoading: false,
  authError: null,

  init: async () => {
    if (!supabase) return;

    const { data: { session } } = await supabase.auth.getSession();
    set({ user: session?.user ?? null, session });

    supabase.auth.onAuthStateChange((_event, session) => {
      set({ user: session?.user ?? null, session });
    });
  },

  openAuthModal: () => set({ authModalOpen: true, authError: null }),
  closeAuthModal: () => set({ authModalOpen: false, authError: null }),
  clearAuthError: () => set({ authError: null }),

  signInWithGoogle: async () => {
    if (!supabase) return;
    set({ authLoading: true, authError: null });
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo:
            typeof window !== "undefined"
              ? `${window.location.origin}/auth/callback`
              : undefined,
        },
      });
      if (error) {
        set({ authError: error.message, authLoading: false });
      }
      // リダイレクトが始まるので authLoading は true のまま（画面遷移される）
    } catch (e) {
      set({
        authError: e instanceof Error ? e.message : "ログインに失敗しました",
        authLoading: false,
      });
    }
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
    try {
      await saveProgress(user.id, payload);
    } catch {
      // ネットワークエラーは静かに無視
    } finally {
      set({ syncing: false });
    }
  },
}));
