"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/auth-store";
import { useGameStore } from "@/lib/store";
import { loadProgress } from "@/lib/supabase";
import AuthModal from "@/components/AuthModal";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const init = useAuthStore((s) => s.init);
  const user = useAuthStore((s) => s.user);
  const loadFromRemote = useGameStore((s) => s.loadFromRemote);

  // Supabase セッション初期化
  useEffect(() => {
    init();
  }, [init]);

  // ログイン時：Supabaseから進捗をロードしてゲームストアに反映
  useEffect(() => {
    if (!user) return;
    loadProgress(user.id).then((row) => {
      if (row) loadFromRemote(row);
    });
  }, [user, loadFromRemote]);

  return (
    <>
      {children}
      <AuthModal />
    </>
  );
}
