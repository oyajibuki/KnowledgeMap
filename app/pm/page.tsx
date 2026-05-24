"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function PMPage() {
  return (
    <div
      style={{
        minHeight: "100dvh",
        background:
          "radial-gradient(ellipse 100% 80% at 50% 40%, #0e0720 0%, #060412 55%, #010108 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* 回転リング */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          border: "1px solid rgba(167,139,250,0.06)",
          pointerEvents: "none",
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", damping: 14 }}
        style={{ textAlign: "center", maxWidth: "440px", position: "relative" }}
      >
        <div style={{ fontSize: "64px", marginBottom: "16px" }}>🗂️</div>

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
          Stratum III
        </p>

        <h1
          style={{
            fontSize: "clamp(20px, 5vw, 32px)",
            fontWeight: "900",
            background: "linear-gradient(135deg, #a78bfa, #c4b5fd)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "8px",
          }}
        >
          プロジェクトマネージャ
        </h1>
        <p style={{ color: "#475569", fontSize: "13px", marginBottom: "28px" }}>
          Project Manager Examination
        </p>

        <div
          style={{
            padding: "20px",
            borderRadius: "18px",
            background: "rgba(167,139,250,0.08)",
            border: "1px solid rgba(167,139,250,0.2)",
            marginBottom: "28px",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 16px",
              borderRadius: "20px",
              background: "rgba(167,139,250,0.15)",
              border: "1px solid rgba(167,139,250,0.3)",
              color: "#a78bfa",
              fontSize: "12px",
              fontWeight: "700",
              marginBottom: "14px",
            }}
          >
            🚧 コンテンツ準備中
          </div>
          <p
            style={{
              color: "#475569",
              fontSize: "13px",
              lineHeight: 1.7,
            }}
          >
            プロジェクト計画・リスク管理・スケジュール管理・チームマネジメントなどを収録予定です。
          </p>
        </div>

        {/* 予定トピック */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8px",
            marginBottom: "28px",
            textAlign: "left",
          }}
        >
          {[
            { icon: "📋", name: "WBS・スコープ管理" },
            { icon: "⏱️", name: "スケジュール管理" },
            { icon: "💰", name: "コスト管理" },
            { icon: "⚠️", name: "リスク管理" },
            { icon: "👥", name: "チームマネジメント" },
            { icon: "🔄", name: "アジャイル手法" },
          ].map((t) => (
            <div
              key={t.name}
              style={{
                padding: "10px 12px",
                borderRadius: "10px",
                background: "rgba(15,23,42,0.6)",
                border: "1px solid #1e293b",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span style={{ fontSize: "16px", opacity: 0.5 }}>{t.icon}</span>
              <span style={{ fontSize: "11px", color: "#334155" }}>{t.name}</span>
            </div>
          ))}
        </div>

        <Link
          href="/universe"
          style={{
            display: "inline-block",
            padding: "12px 28px",
            borderRadius: "14px",
            background: "rgba(30,41,59,0.5)",
            border: "1px solid #334155",
            color: "#64748b",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: "600",
          }}
        >
          ← 銀河系マップに戻る
        </Link>
      </motion.div>
    </div>
  );
}
