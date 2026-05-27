"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";

/**
 * OAuth コールバックページ
 *
 * Supabase JS v2 は createClient 時に detectSessionInUrl: true (デフォルト) で
 * URL の ?code= を自動検出し exchangeCodeForSession を実行する。
 * ここで手動に exchangeCodeForSession を呼ぶと「コードの二重利用」になり
 * 必ず一方が失敗してトップページへループする。
 *
 * → 手動交換は行わず、auth-store の onAuthStateChange が発火して
 *   user が設定されるのを待ってリダイレクトする。
 */
export default function AuthCallbackPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  // user が設定されたら ITマップへ
  useEffect(() => {
    if (user) {
      router.replace("/itp");
    }
  }, [user, router]);

  // タイムアウト: 12秒後もログインできなければトップへ
  useEffect(() => {
    const t = setTimeout(() => {
      if (!useAuthStore.getState().user) {
        router.replace("/");
      }
    }, 12000);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <div
      style={{
        minHeight: "100dvh",
        background:
          "radial-gradient(ellipse 100% 80% at 50% 40%, #0a1628 0%, #060a14 55%, #020508 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "24px",
      }}
    >
      <div style={{ fontSize: "60px" }}>🌌</div>
      <p
        style={{
          color: "#818cf8",
          fontSize: "16px",
          fontWeight: "700",
          letterSpacing: "0.05em",
        }}
      >
        ログイン処理中...
      </p>
      <div style={{ display: "flex", gap: "8px" }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: "9px",
              height: "9px",
              borderRadius: "50%",
              background: "#818cf8",
              animation: `dot 1.4s ease-in-out ${i * 0.24}s infinite`,
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes dot {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.75); }
          40% { opacity: 1; transform: scale(1.25); }
        }
      `}</style>
    </div>
  );
}
