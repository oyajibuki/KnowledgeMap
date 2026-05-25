"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function FEPage() {
  const topics = [
    { icon: "🔢", name: "アルゴリズム", desc: "探索・整列・計算量", status: "coming" },
    { icon: "💾", name: "データ構造", desc: "リスト・木・グラフ", status: "coming" },
    { icon: "⚙️", name: "ハードウェア詳細", desc: "マイクロアーキテクチャ", status: "coming" },
    { icon: "🌐", name: "ネットワーク詳細", desc: "TCP/IP・ルーティング", status: "coming" },
    { icon: "🗄️", name: "データベース詳細", desc: "トランザクション・SQL", status: "coming" },
    { icon: "🔐", name: "セキュリティ詳細", desc: "暗号・認証・PKI", status: "coming" },
    { icon: "📐", name: "ソフトウェア設計", desc: "UML・デザインパターン", status: "coming" },
    { icon: "🧪", name: "テスト技法", desc: "ホワイト/ブラックボックス", status: "coming" },
  ];

  return (
    <div
      style={{
        minHeight: "100dvh",
        background:
          "radial-gradient(ellipse 100% 80% at 50% 40%, #0d0820 0%, #050212 55%, #010108 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px 20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* 背景リング */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          border: "1px solid rgba(129,140,248,0.05)",
          pointerEvents: "none",
        }}
      />

      {/* ヘッダー */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: "center", marginBottom: "40px", position: "relative" }}
      >
        <p
          style={{
            fontSize: "10px",
            letterSpacing: "0.25em",
            color: "#475569",
            marginBottom: "8px",
            fontWeight: "700",
            textTransform: "uppercase",
          }}
        >
          Stratum II
        </p>
        <h1
          style={{
            fontSize: "clamp(22px, 5vw, 36px)",
            fontWeight: "900",
            background: "linear-gradient(135deg, #818cf8, #c084fc)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "10px",
          }}
        >
          💻 基本情報技術者
        </h1>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 16px",
            borderRadius: "20px",
            background: "rgba(129,140,248,0.1)",
            border: "1px solid rgba(129,140,248,0.25)",
            color: "#818cf8",
            fontSize: "12px",
            fontWeight: "700",
          }}
        >
          🚧 コンテンツ準備中
        </div>
      </motion.div>

      {/* ITパスポートからの引き継ぎ */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          maxWidth: "560px",
          width: "100%",
          padding: "20px",
          borderRadius: "16px",
          background: "rgba(6,182,212,0.07)",
          border: "1px solid rgba(6,182,212,0.2)",
          marginBottom: "32px",
        }}
      >
        <p
          style={{
            color: "#22d3ee",
            fontSize: "12px",
            fontWeight: "700",
            marginBottom: "6px",
          }}
        >
          ⚡ ITパスポートからの知識を引き継ぎ
        </p>
        <p style={{ color: "#64748b", fontSize: "13px", lineHeight: 1.6 }}>
          ITパスポートで習得した基礎知識（2進数・CPU・OS・ネットワーク・セキュリティ等）は、基本情報技術者でも活かせます。より深い技術知識を積み上げていきましょう。
        </p>
      </motion.div>

      {/* 予定トピック */}
      <div
        style={{
          maxWidth: "560px",
          width: "100%",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "12px",
          marginBottom: "40px",
        }}
      >
        {topics.map((topic, i) => (
          <motion.div
            key={topic.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.06 }}
            style={{
              padding: "16px",
              borderRadius: "14px",
              background: "rgba(15,23,42,0.6)",
              border: "1px solid #1e293b",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <span style={{ fontSize: "24px", opacity: 0.6 }}>{topic.icon}</span>
            <div>
              <p style={{ color: "#475569", fontSize: "13px", fontWeight: "700" }}>
                {topic.name}
              </p>
              <p style={{ color: "#334155", fontSize: "11px" }}>{topic.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ナビゲーション */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}
      >
        <Link
          href="/universe"
          style={{
            padding: "12px 24px",
            borderRadius: "12px",
            background: "rgba(30,41,59,0.5)",
            border: "1px solid #334155",
            color: "#94a3b8",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: "600",
          }}
        >
          ← Knowledge Map に戻る
        </Link>
        <Link
          href="/itp"
          style={{
            padding: "12px 24px",
            borderRadius: "12px",
            background: "rgba(6,182,212,0.1)",
            border: "1px solid rgba(6,182,212,0.25)",
            color: "#22d3ee",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: "600",
          }}
        >
          ⚡ ITパスポートマップ
        </Link>
      </motion.div>
    </div>
  );
}
