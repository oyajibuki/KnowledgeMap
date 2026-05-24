"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useGameStore } from "@/lib/store";

const BG_STARS = [
  { id: 0, x: 5, y: 10, s: 1.5, o: 0.4 }, { id: 1, x: 12, y: 38, s: 1.0, o: 0.3 },
  { id: 2, x: 20, y: 72, s: 2.0, o: 0.5 }, { id: 3, x: 28, y: 18, s: 1.2, o: 0.2 },
  { id: 4, x: 35, y: 55, s: 1.7, o: 0.4 }, { id: 5, x: 45, y: 88, s: 1.3, o: 0.3 },
  { id: 6, x: 55, y: 22, s: 2.2, o: 0.5 }, { id: 7, x: 63, y: 65, s: 1.5, o: 0.3 },
  { id: 8, x: 72, y: 42, s: 1.8, o: 0.4 }, { id: 9, x: 80, y: 80, s: 1.1, o: 0.2 },
  { id: 10, x: 88, y: 15, s: 2.0, o: 0.5 }, { id: 11, x: 93, y: 50, s: 1.4, o: 0.3 },
  { id: 12, x: 8, y: 90, s: 1.6, o: 0.4 }, { id: 13, x: 40, y: 5, s: 1.9, o: 0.3 },
  { id: 14, x: 70, y: 95, s: 1.3, o: 0.2 }, { id: 15, x: 97, y: 30, s: 2.1, o: 0.4 },
];

export default function UniversePage() {
  const { galaxyCompleted, examScore, nodes } = useGameStore();
  const masteredITP = nodes.filter((n) => n.status === "mastered").length;

  const galaxies = [
    {
      id: "itp",
      stratum: "Stratum I",
      name: "ITパスポート",
      nameEn: "IT Passport",
      icon: "⚡",
      color: "#06b6d4",
      glowColor: "rgba(6,182,212,0.35)",
      borderColor: "rgba(6,182,212,0.45)",
      bgColor: "rgba(6,182,212,0.08)",
      href: "/",
      status: galaxyCompleted ? "completed" : "current",
      nodes: 31,
      masteredNodes: masteredITP,
      score: galaxyCompleted ? examScore : null,
    },
    {
      id: "fe",
      stratum: "Stratum II",
      name: "基本情報技術者",
      nameEn: "Fundamental IT Engineer",
      icon: "💻",
      color: "#818cf8",
      glowColor: "rgba(129,140,248,0.3)",
      borderColor: "rgba(129,140,248,0.35)",
      bgColor: "rgba(129,140,248,0.07)",
      href: "/fe",
      status: galaxyCompleted ? "available" : "locked",
      nodes: 24,
      masteredNodes: 0,
      score: null,
    },
    {
      id: "pm",
      stratum: "Stratum III",
      name: "プロジェクトマネージャ",
      nameEn: "Project Manager",
      icon: "🗂️",
      color: "#94a3b8",
      glowColor: "rgba(148,163,184,0.1)",
      borderColor: "#1e293b",
      bgColor: "rgba(15,23,42,0.4)",
      href: "#",
      status: "locked",
      nodes: 20,
      masteredNodes: 0,
      score: null,
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
          animate={{ opacity: [star.o, star.o * 1.8, star.o] }}
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

      {/* 巨大な回転リング */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute",
          width: "700px",
          height: "700px",
          borderRadius: "50%",
          border: "1px solid rgba(129,140,248,0.04)",
          pointerEvents: "none",
        }}
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          border: "1px solid rgba(6,182,212,0.035)",
          pointerEvents: "none",
        }}
      />

      {/* タイトル */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: "center", marginBottom: "48px", position: "relative" }}
      >
        <p
          style={{
            fontSize: "11px",
            letterSpacing: "0.25em",
            color: "#475569",
            marginBottom: "10px",
            fontWeight: "700",
            textTransform: "uppercase",
          }}
        >
          Knowledge Universe
        </p>
        <h1
          style={{
            fontSize: "clamp(24px, 6vw, 40px)",
            fontWeight: "900",
            background: "linear-gradient(135deg, #e2e8f0, #94a3b8)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-0.02em",
            marginBottom: "10px",
          }}
        >
          🌌 知識の宇宙
        </h1>
        <p style={{ color: "#334155", fontSize: "14px" }}>
          習得した知識が次の銀河系へとつながる
        </p>
      </motion.div>

      {/* 銀河カード */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          justifyContent: "center",
          maxWidth: "960px",
          width: "100%",
          position: "relative",
        }}
      >
        {galaxies.map((galaxy, i) => {
          const isClickable =
            galaxy.status === "completed" || galaxy.status === "available" || galaxy.status === "current";

          return (
            <motion.div
              key={galaxy.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.15, type: "spring", damping: 16 }}
            >
              <Link
                href={isClickable ? galaxy.href : "#"}
                style={{ textDecoration: "none" }}
                onClick={(e) => !isClickable && e.preventDefault()}
              >
                <motion.div
                  whileHover={isClickable ? { scale: 1.04, y: -5 } : {}}
                  whileTap={isClickable ? { scale: 0.97 } : {}}
                  animate={
                    galaxy.status === "completed"
                      ? {
                          boxShadow: [
                            `0 0 20px ${galaxy.glowColor}`,
                            `0 0 40px ${galaxy.glowColor}`,
                            `0 0 20px ${galaxy.glowColor}`,
                          ],
                        }
                      : {}
                  }
                  transition={{ duration: 3, repeat: Infinity }}
                  style={{
                    width: "260px",
                    padding: "28px 22px 24px",
                    borderRadius: "24px",
                    background:
                      galaxy.status !== "locked"
                        ? `radial-gradient(ellipse at 50% 0%, ${galaxy.bgColor}, transparent 70%)`
                        : "rgba(9,11,20,0.6)",
                    border: `1px solid ${galaxy.borderColor}`,
                    boxShadow:
                      galaxy.status === "completed"
                        ? `0 0 24px ${galaxy.glowColor}`
                        : "none",
                    cursor: isClickable ? "pointer" : "default",
                    textAlign: "center",
                    position: "relative",
                    overflow: "hidden",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  {/* 完了バッジ */}
                  {galaxy.status === "completed" && (
                    <div
                      style={{
                        position: "absolute",
                        top: "12px",
                        right: "12px",
                        padding: "3px 10px",
                        borderRadius: "20px",
                        background: "rgba(6,182,212,0.15)",
                        border: "1px solid rgba(6,182,212,0.4)",
                        color: "#22d3ee",
                        fontSize: "10px",
                        fontWeight: "700",
                      }}
                    >
                      制覇 ✓
                    </div>
                  )}

                  {/* 現在地バッジ */}
                  {galaxy.status === "current" && (
                    <div
                      style={{
                        position: "absolute",
                        top: "12px",
                        right: "12px",
                        padding: "3px 10px",
                        borderRadius: "20px",
                        background: "rgba(6,182,212,0.1)",
                        border: "1px solid rgba(6,182,212,0.3)",
                        color: "#67e8f9",
                        fontSize: "10px",
                        fontWeight: "700",
                      }}
                    >
                      探索中
                    </div>
                  )}

                  {/* 鍵アイコン */}
                  {galaxy.status === "locked" && (
                    <div
                      style={{
                        position: "absolute",
                        top: "12px",
                        right: "14px",
                        fontSize: "16px",
                        opacity: 0.5,
                      }}
                    >
                      🔒
                    </div>
                  )}

                  {/* アイコン */}
                  <div
                    style={{
                      fontSize: "44px",
                      marginBottom: "10px",
                      opacity: galaxy.status === "locked" ? 0.35 : 1,
                    }}
                  >
                    {galaxy.icon}
                  </div>

                  {/* ストラタム */}
                  <p
                    style={{
                      fontSize: "10px",
                      color: galaxy.status !== "locked" ? galaxy.color : "#334155",
                      fontWeight: "700",
                      letterSpacing: "0.15em",
                      marginBottom: "5px",
                      textTransform: "uppercase",
                    }}
                  >
                    {galaxy.stratum}
                  </p>

                  {/* 名前 */}
                  <h3
                    style={{
                      fontSize: "16px",
                      fontWeight: "800",
                      color:
                        galaxy.status !== "locked" ? "#e2e8f0" : "#334155",
                      marginBottom: "6px",
                      lineHeight: 1.3,
                    }}
                  >
                    {galaxy.name}
                  </h3>
                  <p
                    style={{
                      fontSize: "11px",
                      color:
                        galaxy.status !== "locked" ? "#475569" : "#1e293b",
                      marginBottom: "16px",
                    }}
                  >
                    {galaxy.nameEn}
                  </p>

                  {/* 仕切り線 */}
                  <div
                    style={{
                      height: "1px",
                      background:
                        galaxy.status !== "locked" ? galaxy.borderColor : "#0f172a",
                      marginBottom: "14px",
                    }}
                  />

                  {/* ノード数 / スコア */}
                  {galaxy.status === "completed" ? (
                    <div>
                      <p
                        style={{
                          fontSize: "11px",
                          color: "#475569",
                          marginBottom: "4px",
                        }}
                      >
                        過去問スコア
                      </p>
                      <p
                        style={{
                          fontSize: "28px",
                          fontWeight: "900",
                          color: "#fbbf24",
                        }}
                      >
                        {galaxy.score}
                        <span style={{ fontSize: "14px", color: "#78716c" }}>
                          {" "}
                          / 100
                        </span>
                      </p>
                    </div>
                  ) : galaxy.status === "current" ? (
                    <div>
                      <p
                        style={{
                          fontSize: "11px",
                          color: "#475569",
                          marginBottom: "6px",
                        }}
                      >
                        習得済み
                      </p>
                      <p
                        style={{
                          fontSize: "22px",
                          fontWeight: "900",
                          color: galaxy.color,
                        }}
                      >
                        {galaxy.masteredNodes}
                        <span
                          style={{ fontSize: "13px", color: "#475569" }}
                        >
                          {" "}
                          / {galaxy.nodes}
                        </span>
                      </p>
                    </div>
                  ) : galaxy.status === "available" ? (
                    <div
                      style={{
                        padding: "8px 12px",
                        borderRadius: "10px",
                        background: `rgba(129,140,248,0.1)`,
                        color: "#818cf8",
                        fontSize: "12px",
                        fontWeight: "700",
                      }}
                    >
                      探索する →
                    </div>
                  ) : (
                    <div
                      style={{
                        padding: "8px 12px",
                        borderRadius: "10px",
                        background: "rgba(15,23,42,0.5)",
                        color: "#1e293b",
                        fontSize: "11px",
                      }}
                    >
                      前の銀河系制覇で解放
                    </div>
                  )}
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* つながりを示す矢印（デスクトップ向け、カード間） */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        style={{ marginTop: "48px", position: "relative" }}
      >
        <Link
          href="/"
          style={{ color: "#334155", fontSize: "13px", textDecoration: "none" }}
        >
          ← マップに戻る
        </Link>
      </motion.div>
    </div>
  );
}
