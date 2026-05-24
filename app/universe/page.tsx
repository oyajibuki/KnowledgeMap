"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/lib/store";
import { useAuthStore } from "@/lib/auth-store";

const BG_STARS = [
  { id: 0, x: 5, y: 10, s: 1.5 }, { id: 1, x: 12, y: 38, s: 1.0 },
  { id: 2, x: 20, y: 72, s: 2.0 }, { id: 3, x: 28, y: 18, s: 1.2 },
  { id: 4, x: 35, y: 55, s: 1.7 }, { id: 5, x: 45, y: 88, s: 1.3 },
  { id: 6, x: 55, y: 22, s: 2.2 }, { id: 7, x: 63, y: 65, s: 1.5 },
  { id: 8, x: 72, y: 42, s: 1.8 }, { id: 9, x: 80, y: 80, s: 1.1 },
  { id: 10, x: 88, y: 15, s: 2.0 }, { id: 11, x: 93, y: 50, s: 1.4 },
  { id: 12, x: 8, y: 90, s: 1.6 }, { id: 13, x: 40, y: 5, s: 1.9 },
  { id: 14, x: 70, y: 95, s: 1.3 }, { id: 15, x: 97, y: 30, s: 2.1 },
  { id: 16, x: 18, y: 30, s: 1.0 }, { id: 17, x: 50, y: 50, s: 1.5 },
  { id: 18, x: 82, y: 62, s: 1.2 }, { id: 19, x: 25, y: 93, s: 2.0 },
];

export default function UniversePage() {
  const router = useRouter();
  const { galaxyCompleted, examScore, nodes } = useGameStore();
  const { user, openAuthModal } = useAuthStore();
  const masteredITP = nodes.filter((n) => n.status === "mastered").length;
  const totalITP = nodes.length;

  // 画面幅に応じてレイアウト切り替え（横並び or 縦並び）
  const [isWide, setIsWide] = useState(false);
  useEffect(() => {
    const check = () => setIsWide(window.innerWidth >= 600);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const galaxies = [
    {
      id: "itp",
      name: "ITパスポート",
      icon: "⚡",
      // 制覇したらゴールド、それ以外はシアン
      color: galaxyCompleted ? "#fbbf24" : "#06b6d4",
      light: galaxyCompleted ? "#fde68a" : "#67e8f9",
      dark: galaxyCompleted ? "#b45309" : "#0369a1",
      glow: galaxyCompleted ? "rgba(251,191,36,0.45)" : "rgba(6,182,212,0.38)",
      href: "/itp",
      active: true,
      completed: galaxyCompleted,
      sub: galaxyCompleted
        ? `🏆 スコア ${examScore} / 100`
        : `${masteredITP} / ${totalITP} 習得`,
    },
    {
      id: "fe",
      name: "基本情報技術者",
      icon: "💻",
      color: "#818cf8",
      light: "#a5b4fc",
      dark: "#312e81",
      glow: "rgba(129,140,248,0.18)",
      href: "/fe",
      active: false,
      completed: false,
      sub: "🚧 準備中",
    },
    {
      id: "pm",
      name: "プロジェクトマネージャ",
      icon: "🗂️",
      color: "#a78bfa",
      light: "#c4b5fd",
      dark: "#4c1d95",
      glow: "rgba(167,139,250,0.15)",
      href: "/pm",
      active: false,
      completed: false,
      sub: "🚧 準備中",
    },
  ];

  const SPHERE_SIZE = isWide ? 140 : 118;

  return (
    <div
      style={{
        minHeight: "100dvh",
        background:
          "radial-gradient(ellipse 100% 80% at 50% 45%, #0a1628 0%, #060a14 55%, #020508 100%)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* 星屑 */}
      {BG_STARS.map((star) => (
        <motion.div
          key={star.id}
          animate={{ opacity: [0.12, 0.5, 0.12] }}
          transition={{ duration: 3 + star.id * 0.22, repeat: Infinity }}
          style={{
            position: "fixed",
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

      {/* ヘッダー */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 20px",
          borderBottom: "1px solid #1e293b",
          background: "rgba(6,10,20,0.75)",
          backdropFilter: "blur(12px)",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "18px" }}>🌌</span>
          <span
            style={{
              fontWeight: "800",
              fontSize: "15px",
              background: "linear-gradient(135deg, #818cf8, #c084fc)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Knowledge Universe
          </span>
        </div>

        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {user.user_metadata?.avatar_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.user_metadata.avatar_url}
                alt=""
                style={{ width: "26px", height: "26px", borderRadius: "50%", border: "1px solid #334155" }}
              />
            )}
            <span style={{ fontSize: "11px", color: "#22c55e", fontWeight: "700" }}>
              ☁️ 保存中
            </span>
          </div>
        ) : (
          <button
            onClick={openAuthModal}
            style={{
              padding: "6px 14px",
              borderRadius: "20px",
              background: "rgba(66,133,244,0.15)",
              border: "1px solid rgba(66,133,244,0.35)",
              color: "#93c5fd",
              fontSize: "11px",
              fontWeight: "700",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            ログイン
          </button>
        )}
      </div>

      {/* メインコンテンツ */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px 20px 40px",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* タイトル */}
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: "center", marginBottom: "44px" }}
        >
          <p
            style={{
              fontSize: "10px",
              letterSpacing: "0.28em",
              color: "#334155",
              marginBottom: "6px",
              fontWeight: "700",
              textTransform: "uppercase",
            }}
          >
            Knowledge Universe
          </p>
          <h1
            style={{
              fontSize: "clamp(18px, 4.5vw, 28px)",
              fontWeight: "900",
              background: "linear-gradient(135deg, #cbd5e1, #64748b)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.02em",
            }}
          >
            銀河系を選ぼう
          </h1>
        </motion.div>

        {/* スフィアマップ：3つのオーブ＋接続線 */}
        <div
          style={{
            display: "flex",
            flexDirection: isWide ? "row" : "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {galaxies.map((g, i) => (
            <div
              key={g.id}
              style={{
                display: "flex",
                flexDirection: isWide ? "row" : "column",
                alignItems: "center",
              }}
            >
              {/* 接続線（2番目・3番目の前に表示） */}
              {i > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 + i * 0.15 }}
                  style={{
                    position: "relative",
                    width: isWide ? "80px" : "2px",
                    height: isWide ? "2px" : "52px",
                    flexShrink: 0,
                    background: `linear-gradient(${isWide ? "90deg" : "180deg"}, ${galaxies[i - 1].color}50, ${g.color}30)`,
                    borderRadius: "1px",
                    overflow: "hidden",
                  }}
                >
                  {/* 流れるライト */}
                  <motion.div
                    animate={
                      isWide
                        ? { x: ["-100%", "200%"] }
                        : { y: ["-100%", "200%"] }
                    }
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "linear",
                      delay: i * 0.8,
                    }}
                    style={{
                      position: "absolute",
                      width: isWide ? "24px" : "2px",
                      height: isWide ? "2px" : "24px",
                      background: galaxies[i - 1].active
                        ? galaxies[i - 1].color
                        : "rgba(255,255,255,0.15)",
                      borderRadius: "1px",
                      top: 0,
                      left: 0,
                    }}
                  />
                </motion.div>
              )}

              {/* スフィアノード */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + i * 0.18, type: "spring", damping: 13, stiffness: 120 }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                {/* 球体ボタン */}
                <motion.button
                  onClick={() => router.push(g.href)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.92 }}
                  animate={
                    g.active
                      ? {
                          boxShadow: [
                            `0 0 24px ${g.glow}, 0 0 48px ${g.glow}`,
                            `0 0 40px ${g.glow}, 0 0 80px ${g.glow}`,
                            `0 0 24px ${g.glow}, 0 0 48px ${g.glow}`,
                          ],
                        }
                      : {}
                  }
                  transition={{ duration: 3, repeat: Infinity }}
                  style={{
                    width: `${SPHERE_SIZE}px`,
                    height: `${SPHERE_SIZE}px`,
                    borderRadius: "50%",
                    background: g.active
                      ? `radial-gradient(circle at 33% 30%, ${g.light}, ${g.color} 52%, ${g.dark} 100%)`
                      : `radial-gradient(circle at 33% 30%, #2a3040, #151c28 52%, #0c1018 100%)`,
                    border: `2px solid ${g.active ? g.color + "70" : "#1e293b"}`,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: `${Math.round(SPHERE_SIZE * 0.3)}px`,
                    position: "relative",
                    overflow: "hidden",
                    boxShadow: g.active
                      ? `0 0 24px ${g.glow}, 0 0 48px ${g.glow}, inset 0 -8px 24px rgba(0,0,0,0.35)`
                      : `inset 0 -8px 20px rgba(0,0,0,0.6), 0 0 0 1px #1e293b`,
                  }}
                >
                  {/* アイコン */}
                  <span style={{ position: "relative", zIndex: 2, filter: g.active ? `drop-shadow(0 0 6px ${g.color})` : "none" }}>
                    {g.icon}
                  </span>

                  {/* 光沢ハイライト */}
                  <div
                    style={{
                      position: "absolute",
                      top: "13%",
                      left: "20%",
                      width: "34%",
                      height: "22%",
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.22)",
                      filter: "blur(6px)",
                      pointerEvents: "none",
                      zIndex: 1,
                    }}
                  />

                  {/* 暗部シャドウ */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: "45%",
                      borderRadius: "0 0 50% 50%",
                      background: "rgba(0,0,0,0.25)",
                      pointerEvents: "none",
                      zIndex: 1,
                    }}
                  />
                </motion.button>

                {/* ラベル */}
                <div style={{ textAlign: "center" }}>
                  <p
                    style={{
                      fontSize: "13px",
                      fontWeight: "800",
                      color: g.active ? g.color : "#374151",
                      marginBottom: "3px",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {g.name}
                  </p>
                  <p
                    style={{
                      fontSize: "11px",
                      color: g.active ? "#64748b" : "#1f2937",
                      fontWeight: g.completed ? "700" : "400",
                    }}
                  >
                    {g.sub}
                  </p>
                </div>
              </motion.div>
            </div>
          ))}
        </div>

        {/* ヒント */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          style={{
            marginTop: "48px",
            fontSize: "11px",
            color: "#1e293b",
            textAlign: "center",
            letterSpacing: "0.02em",
          }}
        >
          タップして銀河系マップへ
        </motion.p>
      </div>
    </div>
  );
}
