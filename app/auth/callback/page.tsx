"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handle = async () => {
      if (!supabase) {
        router.replace("/");
        return;
      }

      // PKCE フロー: ブラウザの localStorage に code_verifier があるので
      // クライアントサイドで exchangeCodeForSession を呼ぶ必要がある
      const code = new URLSearchParams(window.location.search).get("code");
      if (code) {
        try {
          await supabase.auth.exchangeCodeForSession(code);
        } catch {
          // エラーは無視してホームへ
          router.replace("/");
          return;
        }
      }

      // セッション確立後、宇宙ページへ
      router.replace("/universe");
    };

    handle();
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
        gap: "20px",
      }}
    >
      <div style={{ fontSize: "56px" }}>🌌</div>
      <p
        style={{
          color: "#818cf8",
          fontSize: "16px",
          fontWeight: "600",
          letterSpacing: "0.04em",
        }}
      >
        ログイン処理中...
      </p>
      <div
        style={{
          width: "40px",
          height: "4px",
          borderRadius: "2px",
          background: "rgba(129,140,248,0.2)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(90deg, #818cf8, #c084fc)",
            animation: "slide 1.2s ease-in-out infinite",
            borderRadius: "2px",
          }}
        />
      </div>
      <style>{`
        @keyframes slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}
