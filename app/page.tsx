"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuthStore } from "@/lib/auth-store";
import { supabase } from "@/lib/supabase";

const STARS = [
  { id: 0, x: 8, y: 12, s: 1.8 }, { id: 1, x: 15, y: 55, s: 1.2 },
  { id: 2, x: 22, y: 78, s: 2.2 }, { id: 3, x: 30, y: 25, s: 1.5 },
  { id: 4, x: 38, y: 68, s: 1.0 }, { id: 5, x: 48, y: 10, s: 2.0 },
  { id: 6, x: 55, y: 88, s: 1.4 }, { id: 7, x: 63, y: 40, s: 1.8 },
  { id: 8, x: 72, y: 20, s: 1.2 }, { id: 9, x: 80, y: 72, s: 2.4 },
  { id: 10, x: 88, y: 35, s: 1.6 }, { id: 11, x: 93, y: 60, s: 1.0 },
  { id: 12, x: 5, y: 85, s: 2.0 }, { id: 13, x: 42, y: 48, s: 1.3 },
  { id: 14, x: 68, y: 92, s: 1.7 }, { id: 15, x: 97, y: 18, s: 1.5 },
  { id: 16, x: 18, y: 38, s: 1.1 }, { id: 17, x: 52, y: 62, s: 2.1 },
  { id: 18, x: 76, y: 48, s: 1.4 }, { id: 19, x: 35, y: 5, s: 1.9 },
];

const GALAXIES = [
  { icon: "⚡", name: "ITパスポート", color: "#06b6d4", delay: 0.6 },
  { icon: "💻", name: "基本情報技術者", color: "#818cf8", delay: 0.75 },
  { icon: "🗂️", name: "PM", color: "#a78bfa", delay: 0.9 },
];

export default function LandingPage() {
  const router = useRouter();
  const { user, signInWithGoogle } = useAuthStore();
  const isSupabaseReady = !!supabase;

  // ログイン済みなら宇宙ページへスキップ
  useEffect(() => {
    if (user) router.replace("/universe");
  }, [user, router]);

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
        padding: "24px 20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* 背景：同心円 */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: [
            "radial-gradient(circle at 50% 55%, transparent 18%, rgba(6,182,212,0.03) 18.5%, transparent 19%)",
            "radial-gradient(circle at 50% 55%, transparent 38%, rgba(6,182,212,0.02) 38.5%, transparent 39%)",
            "radial-gradient(circle at 50% 55%, transparent 60%, rgba(6,182,212,0.015) 60.5%, transparent 61%)",
          ].join(", "),
          pointerEvents: "none",
        }}
      />

      {/* 星 */}
      {STARS.map((star) => (
        <motion.div
          key={star.id}
          animate={{ opacity: [0.15, 0.6, 0.15] }}
          transition={{ duration: 3 + star.id * 0.2, repeat: Infinity }}
          style={{
            position: "absolute",
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.s}px`,
            height: `${star.s}px`,
            borderRadius: "50%",
            background: "white",
            pointerEvents: "none",
          }}
        />
      ))}

      {/* メインコンテンツ */}
      <div style={{ position: "relative", width: "100%", maxWidth: "400px", textAlign: "center" }}>

        {/* ロゴ */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 14, delay: 0.1 }}
          style={{ fontSize: "72px", marginBottom: "16px" }}
        >
          🌌
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            fontSize: "clamp(26px, 7vw, 40px)",
            fontWeight: "900",
            letterSpacing: "-0.02em",
            marginBottom: "8px",
            background: "linear-gradient(135deg, #818cf8, #c084fc, #818cf8)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Knowledge Map
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          style={{ color: "#475569", fontSize: "14px", marginBottom: "32px", lineHeight: 1.6 }}
        >
          資格の知識を銀河系として攻略しよう
        </motion.p>

        {/* 銀河プレビュー */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "16px",
            marginBottom: "36px",
          }}
        >
          {GALAXIES.map((g) => (
            <motion.div
              key={g.name}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: g.delay, type: "spring" }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.1), rgba(0,0,0,0))`,
                  border: `1px solid ${g.color}50`,
                  boxShadow: `0 0 16px ${g.color}30`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "22px",
                }}
              >
                {g.icon}
              </div>
              <span style={{ fontSize: "9px", color: g.color, fontWeight: "700", letterSpacing: "0.05em" }}>
                {g.name.length > 6 ? g.name.slice(0, 6) + "…" : g.name}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* ログイン選択 */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95 }}
          style={{ display: "flex", flexDirection: "column", gap: "10px" }}
        >
          {/* Google ログインボタン */}
          {isSupabaseReady ? (
            <button
              onClick={signInWithGoogle}
              style={{
                width: "100%",
                padding: "15px",
                borderRadius: "14px",
                background: "white",
                border: "none",
                color: "#1a1a1a",
                fontWeight: "700",
                fontSize: "15px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                boxShadow: "0 2px 20px rgba(0,0,0,0.4)",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Googleでログイン（進捗クラウド保存）
            </button>
          ) : (
            <div
              style={{
                padding: "14px",
                borderRadius: "14px",
                background: "rgba(30,41,59,0.5)",
                border: "1px solid #334155",
                color: "#475569",
                fontSize: "13px",
                textAlign: "center",
              }}
            >
              🔧 Googleログインは設定中です
            </div>
          )}

          {/* ゲストとして試す */}
          <button
            onClick={() => router.push("/universe")}
            style={{
              width: "100%",
              padding: "15px",
              borderRadius: "14px",
              background: "rgba(129,140,248,0.12)",
              border: "1px solid rgba(129,140,248,0.3)",
              color: "#a5b4fc",
              fontWeight: "700",
              fontSize: "15px",
              cursor: "pointer",
            }}
          >
            まずはお試し（このデバイスに保存）
          </button>
        </motion.div>

        {/* 補足 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          style={{
            color: "#334155",
            fontSize: "11px",
            marginTop: "20px",
            lineHeight: 1.6,
          }}
        >
          ゲストでも全機能が使えます。<br />
          後からGoogleログインで進捗を引き継げます。
        </motion.p>
      </div>
    </div>
  );
}
