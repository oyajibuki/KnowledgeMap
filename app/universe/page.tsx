"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useGameStore } from "@/lib/store";

const BG_STARS = [
  { id: 0, x: 5, y: 10, s: 1.5 }, { id: 1, x: 12, y: 38, s: 1.0 },
  { id: 2, x: 20, y: 72, s: 2.0 }, { id: 3, x: 28, y: 18, s: 1.2 },
  { id: 4, x: 35, y: 55, s: 1.7 }, { id: 5, x: 45, y: 88, s: 1.3 },
  { id: 6, x: 55, y: 22, s: 2.2 }, { id: 7, x: 63, y: 65, s: 1.5 },
  { id: 8, x: 72, y: 42, s: 1.8 }, { id: 9, x: 80, y: 80, s: 1.1 },
  { id: 10, x: 88, y: 15, s: 2.0 }, { id: 11, x: 93, y: 50, s: 1.4 },
  { id: 12, x: 8, y: 90, s: 1.6 }, { id: 13, x: 40, y: 5, s: 1.9 },
  { id: 14, x: 70, y: 95, s: 1.3 }, { id: 15, x: 97, y: 30, s: 2.1 },
];

export default function UniversePage() {
  const { galaxyCompleted, examScore, nodes } = useGameStore();
  const masteredITP = nodes.filter((n) => n.status === "mastered").length;

  type GalaxyStatus = "completed" | "current" | "available" | "coming-soon";

  const galaxies: {
    id: string;
    stratum: string;
    name: string;
    nameEn: string;
    icon: string;
    color: string;
    glowColor: string;
    borderColor: string;
    bgColor: string;
    href: string;
    status: GalaxyStatus;
    totalNodes: number;
    masteredNodes: number;
    score: number | null;
    description: string;
  }[] = [
    {
      id: "itp",
      stratum: "Stratum I",
      name: "ITパスポート",
      nameEn: "IT Passport",
      icon: "⚡",
      color: "#06b6d4",
      glowColor: "rgba(6,182,212,0.35)",
      borderColor: galaxyCompleted ? "rgba(251,191,36,0.5)" : "rgba(6,182,212,0.4)",
      bgColor: galaxyCompleted ? "rgba(251,191,36,0.06)" : "rgba(6,182,212,0.08)",
      href: "/",
      status: galaxyCompleted ? "completed" : "current",
      totalNodes: 31,
      masteredNodes: masteredITP,
      score: galaxyCompleted ? examScore : null,
      description: "IT基礎・ネットワーク・セキュリティ・経営",
    },
    {
      id: "fe",
      stratum: "Stratum II",
      name: "基本情報技術者",
      nameEn: "Fundamental IT Engineer",
      icon: "💻",
      color: "#818cf8",
      glowColor: "rgba(129,140,248,0.25)",
      borderColor: "rgba(129,140,248,0.3)",
      bgColor: "rgba(129,140,248,0.07)",
      href: "/fe",
      // 常にアクセス可能（プレビュー）、ただし完全版はITパスポート制覇後
      status: "available",
      totalNodes: 24,
      masteredNodes: 0,
      score: null,
      description: "アルゴリズム・データ構造・ソフトウェア設計",
    },
    {
      id: "pm",
      stratum: "Stratum III",
      name: "プロジェクトマネージャ",
      nameEn: "Project Manager",
      icon: "🗂️",
      color: "#a78bfa",
      glowColor: "rgba(167,139,250,0.2)",
      borderColor: "rgba(167,139,250,0.25)",
      bgColor: "rgba(167,139,250,0.06)",
      href: "/pm",
      status: "coming-soon",
      totalNodes: 20,
      masteredNodes: 0,
      score: null,
      description: "プロジェクト計画・リスク管理・チームマネジメント",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100dvh",
        background:
          "radial-gradient(ellipse 100% 80% at 50% 50%, #070318 0%, #030210 50%, #010107 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* 背景の星 */}
      {BG_STARS.map((star) => (
        <motion.div
          key={star.id}
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 3 + star.id * 0.3, repeat: Infinity }}
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

      {/* 回転リング */}
      {[700, 500, 320].map((size, i) => (
        <motion.div
          key={size}
          animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
          transition={{ duration: 40 + i * 15, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute",
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: "50%",
            border: `1px solid rgba(129,140,248,${0.03 + i * 0.01})`,
            pointerEvents: "none",
          }}
        />
      ))}

      {/* タイトル */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: "center", marginBottom: "40px", position: "relative" }}
      >
        <p style={{ fontSize: "10px", letterSpacing: "0.25em", color: "#475569", marginBottom: "8px", fontWeight: "700", textTransform: "uppercase" }}>
          Knowledge Universe
        </p>
        <h1
          style={{
            fontSize: "clamp(22px, 5vw, 36px)",
            fontWeight: "900",
            background: "linear-gradient(135deg, #e2e8f0, #94a3b8)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-0.02em",
            marginBottom: "8px",
          }}
        >
          🌌 知識の宇宙
        </h1>
        <p style={{ color: "#334155", fontSize: "13px" }}>
          資格の知識を銀河系として制覇していこう
        </p>
      </motion.div>

      {/* 銀河カード */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
          justifyContent: "center",
          maxWidth: "900px",
          width: "100%",
          position: "relative",
        }}
      >
        {galaxies.map((galaxy, i) => {
          const isClickable = galaxy.status !== "coming-soon";

          const card = (
            <motion.div
              key={galaxy.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.12, type: "spring", damping: 16 }}
            >
              <motion.div
                whileHover={isClickable ? { scale: 1.04, y: -4 } : { scale: 1.01 }}
                whileTap={isClickable ? { scale: 0.97 } : {}}
                animate={
                  galaxy.status === "completed"
                    ? {
                        boxShadow: [
                          `0 0 16px ${galaxy.glowColor}`,
                          `0 0 36px ${galaxy.glowColor}`,
                          `0 0 16px ${galaxy.glowColor}`,
                        ],
                      }
                    : {}
                }
                transition={{ duration: 3, repeat: Infinity }}
                style={{
                  width: "clamp(230px, 28vw, 270px)",
                  padding: "24px 20px",
                  borderRadius: "22px",
                  background: `radial-gradient(ellipse at 50% 0%, ${galaxy.bgColor}, transparent 70%)`,
                  border: `1px solid ${galaxy.borderColor}`,
                  cursor: isClickable ? "pointer" : "default",
                  textAlign: "center",
                  position: "relative",
                  overflow: "hidden",
                  backdropFilter: "blur(8px)",
                  transition: "border-color 0.3s",
                }}
              >
                {/* ステータスバッジ */}
                {galaxy.status === "completed" && (
                  <div style={{
                    position: "absolute", top: "10px", right: "10px",
                    padding: "2px 8px", borderRadius: "20px",
                    background: "rgba(251,191,36,0.15)", border: "1px solid rgba(251,191,36,0.4)",
                    color: "#fbbf24", fontSize: "10px", fontWeight: "700",
                  }}>
                    🏆 制覇
                  </div>
                )}
                {galaxy.status === "current" && (
                  <div style={{
                    position: "absolute", top: "10px", right: "10px",
                    padding: "2px 8px", borderRadius: "20px",
                    background: "rgba(6,182,212,0.12)", border: "1px solid rgba(6,182,212,0.3)",
                    color: "#22d3ee", fontSize: "10px", fontWeight: "700",
                  }}>
                    探索中
                  </div>
                )}
                {galaxy.status === "available" && (
                  <div style={{
                    position: "absolute", top: "10px", right: "10px",
                    padding: "2px 8px", borderRadius: "20px",
                    background: "rgba(129,140,248,0.12)", border: "1px solid rgba(129,140,248,0.3)",
                    color: "#a5b4fc", fontSize: "10px", fontWeight: "700",
                  }}>
                    プレビュー
                  </div>
                )}
                {galaxy.status === "coming-soon" && (
                  <div style={{
                    position: "absolute", top: "10px", right: "10px",
                    padding: "2px 8px", borderRadius: "20px",
                    background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.2)",
                    color: "#a78bfa", fontSize: "10px", fontWeight: "700",
                  }}>
                    準備中
                  </div>
                )}

                {/* アイコン */}
                <div style={{ fontSize: "40px", marginBottom: "10px" }}>
                  {galaxy.icon}
                </div>

                {/* ストラタム */}
                <p style={{
                  fontSize: "10px", color: galaxy.color, fontWeight: "700",
                  letterSpacing: "0.12em", marginBottom: "4px", textTransform: "uppercase",
                }}>
                  {galaxy.stratum}
                </p>

                {/* 名前 */}
                <h3 style={{
                  fontSize: "15px", fontWeight: "800", color: "#e2e8f0",
                  marginBottom: "4px", lineHeight: 1.3,
                }}>
                  {galaxy.name}
                </h3>
                <p style={{ fontSize: "10px", color: "#475569", marginBottom: "12px" }}>
                  {galaxy.nameEn}
                </p>

                {/* 説明 */}
                <p style={{
                  fontSize: "11px", color: "#334155", marginBottom: "14px",
                  lineHeight: 1.5, minHeight: "32px",
                }}>
                  {galaxy.description}
                </p>

                {/* 仕切り */}
                <div style={{ height: "1px", background: galaxy.borderColor, marginBottom: "14px" }} />

                {/* スコア / 進捗 */}
                {galaxy.status === "completed" ? (
                  <div>
                    <p style={{ fontSize: "10px", color: "#64748b", marginBottom: "3px" }}>過去問スコア</p>
                    <p style={{ fontSize: "28px", fontWeight: "900", color: "#fbbf24", lineHeight: 1 }}>
                      {galaxy.score}
                      <span style={{ fontSize: "13px", color: "#78716c" }}> / 100</span>
                    </p>
                  </div>
                ) : galaxy.status === "current" ? (
                  <div>
                    <p style={{ fontSize: "10px", color: "#64748b", marginBottom: "3px" }}>習得済み</p>
                    <p style={{ fontSize: "22px", fontWeight: "900", color: galaxy.color, lineHeight: 1 }}>
                      {galaxy.masteredNodes}
                      <span style={{ fontSize: "13px", color: "#475569" }}> / {galaxy.totalNodes}</span>
                    </p>
                    {/* 進捗バー */}
                    <div style={{ height: "4px", background: "#0f172a", borderRadius: "2px", marginTop: "8px", overflow: "hidden" }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.round((galaxy.masteredNodes / galaxy.totalNodes) * 100)}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        style={{ height: "100%", background: `linear-gradient(90deg, ${galaxy.color}, #a78bfa)`, borderRadius: "2px" }}
                      />
                    </div>
                  </div>
                ) : galaxy.status === "available" ? (
                  <div style={{
                    padding: "8px 10px", borderRadius: "10px",
                    background: "rgba(129,140,248,0.1)",
                    color: "#818cf8", fontSize: "12px", fontWeight: "700",
                  }}>
                    プレビューを見る →
                  </div>
                ) : (
                  <div style={{
                    padding: "8px 10px", borderRadius: "10px",
                    background: "rgba(15,23,42,0.5)",
                    color: "#334155", fontSize: "11px",
                  }}>
                    🚧 コンテンツ準備中
                  </div>
                )}
              </motion.div>
            </motion.div>
          );

          return isClickable ? (
            <Link key={galaxy.id} href={galaxy.href} style={{ textDecoration: "none" }}>
              {card}
            </Link>
          ) : (
            <div key={galaxy.id}>{card}</div>
          );
        })}
      </div>

      {/* フッターリンク */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        style={{ marginTop: "40px" }}
      >
        <Link href="/" style={{ color: "#334155", fontSize: "13px", textDecoration: "none" }}>
          ← ITパスポートマップに戻る
        </Link>
      </motion.div>
    </div>
  );
}
