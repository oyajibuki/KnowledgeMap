"use client";

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

  const galaxies = [
    {
      id: "itp",
      stratum: "Stratum I",
      name: "ITパスポート",
      nameEn: "IT Passport",
      icon: "⚡",
      color: "#06b6d4",
      glow: "rgba(6,182,212,0.4)",
      border: galaxyCompleted ? "rgba(251,191,36,0.5)" : "rgba(6,182,212,0.45)",
      bg: galaxyCompleted ? "rgba(251,191,36,0.06)" : "rgba(6,182,212,0.09)",
      href: "/itp",
      status: galaxyCompleted ? "completed" : "current",
      description: "IT基礎 / ネットワーク / セキュリティ / 経営",
      nodes: totalITP,
      mastered: masteredITP,
      score: galaxyCompleted ? examScore : null,
    },
    {
      id: "fe",
      stratum: "Stratum II",
      name: "基本情報技術者",
      nameEn: "Fundamental IT Engineer",
      icon: "💻",
      color: "#818cf8",
      glow: "rgba(129,140,248,0.3)",
      border: "rgba(129,140,248,0.35)",
      bg: "rgba(129,140,248,0.08)",
      href: "/fe",
      status: "preview",
      description: "アルゴリズム / データ構造 / ソフトウェア設計",
      nodes: 24,
      mastered: 0,
      score: null,
    },
    {
      id: "pm",
      stratum: "Stratum III",
      name: "プロジェクトマネージャ",
      nameEn: "Project Manager",
      icon: "🗂️",
      color: "#a78bfa",
      glow: "rgba(167,139,250,0.25)",
      border: "rgba(167,139,250,0.28)",
      bg: "rgba(167,139,250,0.07)",
      href: "/pm",
      status: "coming-soon",
      description: "プロジェクト計画 / リスク管理 / チームマネジメント",
      nodes: 20,
      mastered: 0,
      score: null,
    },
  ];

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
      {/* 同心円 */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: [
            "radial-gradient(circle at 50% 55%, transparent 22%, rgba(6,182,212,0.025) 22.5%, transparent 23%)",
            "radial-gradient(circle at 50% 55%, transparent 42%, rgba(129,140,248,0.02) 42.5%, transparent 43%)",
            "radial-gradient(circle at 50% 55%, transparent 64%, rgba(167,139,250,0.015) 64.5%, transparent 65%)",
          ].join(", "),
          pointerEvents: "none",
        }}
      />

      {/* 星屑 */}
      {BG_STARS.map((star) => (
        <motion.div
          key={star.id}
          animate={{ opacity: [0.15, 0.55, 0.15] }}
          transition={{ duration: 3 + star.id * 0.25, repeat: Infinity }}
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
          background: "rgba(6,10,20,0.7)",
          backdropFilter: "blur(12px)",
          flexShrink: 0,
        }}
      >
        {/* ロゴ */}
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
            Knowledge Map
          </span>
        </div>

        {/* ログインステータス */}
        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            {user.user_metadata?.avatar_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.user_metadata.avatar_url}
                alt=""
                style={{ width: "24px", height: "24px", borderRadius: "50%" }}
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
            <svg width="14" height="14" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            ログインして進捗を保存
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
          padding: "24px 16px 32px",
          position: "relative",
          zIndex: 2,
          overflowY: "auto",
        }}
      >
        {/* タイトル */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: "center", marginBottom: "32px" }}
        >
          <p
            style={{
              fontSize: "10px",
              letterSpacing: "0.25em",
              color: "#475569",
              marginBottom: "6px",
              fontWeight: "700",
              textTransform: "uppercase",
            }}
          >
            Knowledge Universe
          </p>
          <h1
            style={{
              fontSize: "clamp(20px, 5vw, 32px)",
              fontWeight: "900",
              background: "linear-gradient(135deg, #e2e8f0, #94a3b8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.02em",
            }}
          >
            銀河系を選んで挑戦しよう
          </h1>
        </motion.div>

        {/* 銀河カード */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            flexWrap: "wrap",
            justifyContent: "center",
            width: "100%",
            maxWidth: "880px",
          }}
        >
          {galaxies.map((g, i) => (
            // 外側: エントリーアニメーション
            <motion.div
              key={g.id}
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.12, type: "spring", damping: 18 }}
            >
            {/* 内側: ホバー・グロー・クリック */}
            <motion.div
              onClick={() => router.push(g.href)}
              whileHover={{ scale: 1.04, y: -4 }}
              whileTap={{ scale: 0.97 }}
              animate={
                g.status === "completed"
                  ? { boxShadow: [`0 0 16px ${g.glow}`, `0 0 40px ${g.glow}`, `0 0 16px ${g.glow}`] }
                  : {}
              }
              transition={{ duration: 3, repeat: Infinity }}
              style={{
                width: "clamp(240px, 28vw, 272px)",
                padding: "28px 22px 24px",
                borderRadius: "24px",
                background: `radial-gradient(ellipse at 50% 0%, ${g.bg}, transparent 70%), rgba(6,10,20,0.6)`,
                border: `1px solid ${g.border}`,
                cursor: "pointer",
                textAlign: "center",
                position: "relative",
                backdropFilter: "blur(8px)",
                userSelect: "none",
              }}
            >
              {/* ステータスバッジ */}
              <div
                style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  padding: "3px 8px",
                  borderRadius: "20px",
                  fontSize: "10px",
                  fontWeight: "700",
                  background:
                    g.status === "completed"
                      ? "rgba(251,191,36,0.15)"
                      : g.status === "current"
                      ? "rgba(6,182,212,0.12)"
                      : g.status === "preview"
                      ? "rgba(129,140,248,0.12)"
                      : "rgba(167,139,250,0.1)",
                  border: `1px solid ${
                    g.status === "completed"
                      ? "rgba(251,191,36,0.4)"
                      : g.status === "current"
                      ? "rgba(6,182,212,0.3)"
                      : g.status === "preview"
                      ? "rgba(129,140,248,0.3)"
                      : "rgba(167,139,250,0.2)"
                  }`,
                  color:
                    g.status === "completed"
                      ? "#fbbf24"
                      : g.status === "current"
                      ? "#22d3ee"
                      : g.status === "preview"
                      ? "#a5b4fc"
                      : "#a78bfa",
                }}
              >
                {g.status === "completed"
                  ? "🏆 制覇"
                  : g.status === "current"
                  ? "探索中"
                  : g.status === "preview"
                  ? "プレビュー"
                  : "🚧 準備中"}
              </div>

              {/* アイコン（グロー付き） */}
              <motion.div
                animate={
                  g.status === "completed" || g.status === "current"
                    ? { filter: [`drop-shadow(0 0 8px ${g.color}80)`, `drop-shadow(0 0 20px ${g.color}aa)`, `drop-shadow(0 0 8px ${g.color}80)`] }
                    : {}
                }
                transition={{ duration: 2.5, repeat: Infinity }}
                style={{ fontSize: "48px", marginBottom: "12px" }}
              >
                {g.icon}
              </motion.div>

              {/* ストラタム */}
              <p
                style={{
                  fontSize: "10px",
                  color: g.color,
                  fontWeight: "700",
                  letterSpacing: "0.12em",
                  marginBottom: "4px",
                  textTransform: "uppercase",
                }}
              >
                {g.stratum}
              </p>

              {/* 名前 */}
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: "800",
                  color: "#e2e8f0",
                  marginBottom: "4px",
                  lineHeight: 1.3,
                }}
              >
                {g.name}
              </h3>
              <p style={{ fontSize: "10px", color: "#475569", marginBottom: "12px" }}>
                {g.nameEn}
              </p>

              {/* 説明文 */}
              <p
                style={{
                  fontSize: "11px",
                  color: "#334155",
                  lineHeight: 1.5,
                  marginBottom: "16px",
                  minHeight: "34px",
                }}
              >
                {g.description}
              </p>

              {/* 区切り線 */}
              <div
                style={{ height: "1px", background: g.border, marginBottom: "16px" }}
              />

              {/* 下部：スコア or 進捗 */}
              {g.status === "completed" ? (
                <div>
                  <p style={{ fontSize: "10px", color: "#64748b", marginBottom: "3px" }}>
                    過去問スコア
                  </p>
                  <p
                    style={{
                      fontSize: "30px",
                      fontWeight: "900",
                      color: "#fbbf24",
                      lineHeight: 1,
                    }}
                  >
                    {g.score}
                    <span style={{ fontSize: "14px", color: "#78716c" }}> / 100</span>
                  </p>
                </div>
              ) : g.status === "current" ? (
                <div>
                  <p style={{ fontSize: "10px", color: "#64748b", marginBottom: "4px" }}>
                    習得進捗
                  </p>
                  <p
                    style={{
                      fontSize: "22px",
                      fontWeight: "900",
                      color: g.color,
                      lineHeight: 1,
                      marginBottom: "8px",
                    }}
                  >
                    {g.mastered}
                    <span style={{ fontSize: "13px", color: "#475569" }}>
                      {" "}/ {g.nodes}
                    </span>
                  </p>
                  <div
                    style={{
                      height: "4px",
                      background: "#0f172a",
                      borderRadius: "2px",
                      overflow: "hidden",
                    }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.round((g.mastered / g.nodes) * 100)}%`,
                      }}
                      transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
                      style={{
                        height: "100%",
                        background: `linear-gradient(90deg, ${g.color}, #a78bfa)`,
                        borderRadius: "2px",
                      }}
                    />
                  </div>
                  {/* 入る ボタン */}
                  <div
                    style={{
                      marginTop: "14px",
                      padding: "10px",
                      borderRadius: "12px",
                      background: `rgba(6,182,212,0.1)`,
                      color: g.color,
                      fontSize: "13px",
                      fontWeight: "700",
                    }}
                  >
                    マップを開く →
                  </div>
                </div>
              ) : g.status === "preview" ? (
                <div
                  style={{
                    padding: "10px",
                    borderRadius: "12px",
                    background: "rgba(129,140,248,0.1)",
                    color: "#818cf8",
                    fontSize: "13px",
                    fontWeight: "700",
                  }}
                >
                  プレビューを見る →
                </div>
              ) : (
                <div
                  style={{
                    padding: "10px",
                    borderRadius: "12px",
                    background: "rgba(15,23,42,0.5)",
                    color: "#334155",
                    fontSize: "12px",
                  }}
                >
                  🚧 コンテンツ準備中
                </div>
              )}
            </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
