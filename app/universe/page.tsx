"use client";

import { useMemo } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  type Node,
  type Edge,
  type NodeProps,
  Handle,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/lib/store";
import { useAuthStore } from "@/lib/auth-store";

/* ─── 資格ノードのデータ型 ─────────────────────────────── */
type QualData = {
  label: string;       // 表示名
  icon: string;        // 絵文字アイコン
  color: string;       // カテゴリーカラー
  light: string;       // ハイライト色
  dark: string;        // 影色
  glow: string;        // グロー色
  active: boolean;     // 現在プレイ可能か
  completed?: boolean; // クリア済みか
  sub: string;         // サブラベル
  href: string;        // ナビゲート先
  [key: string]: unknown;
};

const SPHERE = 68; // ノードの直径

/* ─── カスタムノードコンポーネント ─────────────────────── */
function QualNode({ data }: NodeProps) {
  const router = useRouter();
  const d = data as QualData;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Handle type="target" position={Position.Top} style={{ opacity: 0, width: 1, height: 1 }} />
      <Handle type="target" position={Position.Left} style={{ opacity: 0, width: 1, height: 1 }} />

      <motion.div
        onClick={() => router.push(d.href)}
        whileHover={{ scale: 1.14 }}
        whileTap={{ scale: 0.92 }}
        animate={
          d.active
            ? {
                boxShadow: [
                  `0 0 16px ${d.glow}, 0 0 32px ${d.glow}`,
                  `0 0 28px ${d.glow}, 0 0 56px ${d.glow}`,
                  `0 0 16px ${d.glow}, 0 0 32px ${d.glow}`,
                ],
              }
            : {}
        }
        transition={{ duration: 3, repeat: Infinity }}
        style={{
          width: SPHERE,
          height: SPHERE,
          borderRadius: "50%",
          background: d.active
            ? `radial-gradient(circle at 33% 30%, ${d.light}, ${d.color} 52%, ${d.dark} 100%)`
            : d.completed
            ? `radial-gradient(circle at 33% 30%, #fde68a, #fbbf24 52%, #b45309 100%)`
            : `radial-gradient(circle at 33% 30%, #1e2534, ${d.color}22 60%, #0c1018 100%)`,
          border: `2px solid ${d.active ? d.color + "90" : d.color + "28"}`,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "22px",
          position: "relative",
          boxShadow: d.active
            ? `0 0 16px ${d.glow}, 0 0 32px ${d.glow}, inset 0 -6px 14px rgba(0,0,0,0.4)`
            : `inset 0 -6px 14px rgba(0,0,0,0.6), 0 0 0 1px ${d.color}15`,
        }}
      >
        {/* 光沢 */}
        <div
          style={{
            position: "absolute",
            top: "12%",
            left: "18%",
            width: "32%",
            height: "20%",
            borderRadius: "50%",
            background: d.active
              ? "rgba(255,255,255,0.25)"
              : "rgba(255,255,255,0.06)",
            filter: "blur(4px)",
            pointerEvents: "none",
          }}
        />
        <span
          style={{
            position: "relative",
            zIndex: 2,
            filter: d.active ? `drop-shadow(0 0 4px ${d.color})` : "none",
            opacity: d.active ? 1 : 0.45,
          }}
        >
          {d.icon}
        </span>
      </motion.div>

      {/* ラベル */}
      <div
        style={{
          marginTop: "6px",
          textAlign: "center",
          pointerEvents: "none",
          maxWidth: "90px",
        }}
      >
        <p
          style={{
            fontSize: "10px",
            fontWeight: d.active ? "800" : "600",
            color: d.active ? d.color : d.color + "66",
            lineHeight: 1.3,
            marginBottom: "1px",
          }}
        >
          {d.label}
        </p>
        <p style={{ fontSize: "8.5px", color: "#1e293b", lineHeight: 1.2 }}>
          {d.sub}
        </p>
      </div>

      <Handle type="source" position={Position.Bottom} style={{ opacity: 0, width: 1, height: 1 }} />
      <Handle type="source" position={Position.Right} style={{ opacity: 0, width: 1, height: 1 }} />
    </div>
  );
}

const nodeTypes = { qual: QualNode };

/* ─── カテゴリーカラー定義 ─────────────────────────────── */
const CAT = {
  it:       { color: "#06b6d4", light: "#67e8f9", dark: "#0369a1", glow: "rgba(6,182,212,0.45)" },
  fp:       { color: "#10b981", light: "#6ee7b7", dark: "#065f46", glow: "rgba(16,185,129,0.38)" },
  realty:   { color: "#f59e0b", light: "#fcd34d", dark: "#92400e", glow: "rgba(245,158,11,0.38)" },
  electric: { color: "#facc15", light: "#fef08a", dark: "#854d0e", glow: "rgba(250,204,21,0.35)" },
  boki:     { color: "#818cf8", light: "#a5b4fc", dark: "#312e81", glow: "rgba(129,140,248,0.35)" },
  admin:    { color: "#f87171", light: "#fca5a5", dark: "#7f1d1d", glow: "rgba(248,113,113,0.28)" },
  heritage: { color: "#60a5fa", light: "#93c5fd", dark: "#1e3a5f", glow: "rgba(96,165,250,0.28)" },
};

/* ─── ノード定義（座標は ReactFlow の論理座標） ─────────── */
function buildNodes(itpActive: boolean, itpCompleted: boolean): Node[] {
  const itColor = itpCompleted
    ? { color: "#fbbf24", light: "#fde68a", dark: "#b45309", glow: "rgba(251,191,36,0.5)" }
    : CAT.it;

  return [
    /* ═══ IT系 ══════════════════════════════ */
    {
      id: "itp", type: "qual",
      position: { x: 540, y: 220 },
      data: { label: "ITパスポート", icon: "⚡", sub: "IT基礎", href: "/itp",
              active: itpActive, completed: itpCompleted, ...itColor },
    },
    {
      id: "sg", type: "qual",
      position: { x: 280, y: 30 },
      data: { label: "情報セキュリティMgt", icon: "🔒", sub: "SG", href: "/itp", active: false, ...CAT.it },
    },
    {
      id: "fe", type: "qual",
      position: { x: 800, y: 30 },
      data: { label: "基本情報技術者", icon: "💻", sub: "FE", href: "/fe", active: false, ...CAT.it },
    },
    {
      id: "ap", type: "qual",
      position: { x: 540, y: 460 },
      data: { label: "応用情報技術者", icon: "🔬", sub: "AP", href: "/itp", active: false, ...CAT.it },
    },
    {
      id: "nw", type: "qual",
      position: { x: 280, y: 660 },
      data: { label: "NWスペシャリスト", icon: "🌐", sub: "NW", href: "/itp", active: false, ...CAT.it },
    },
    {
      id: "db", type: "qual",
      position: { x: 540, y: 700 },
      data: { label: "DBスペシャリスト", icon: "🗄️", sub: "DB", href: "/itp", active: false, ...CAT.it },
    },
    {
      id: "sc", type: "qual",
      position: { x: 800, y: 660 },
      data: { label: "安全確保支援士", icon: "🛡️", sub: "SC", href: "/itp", active: false, ...CAT.it },
    },

    /* ═══ FP ══════════════════════════════ */
    {
      id: "fp3", type: "qual",
      position: { x: -50, y: 60 },
      data: { label: "FP3級", icon: "💰", sub: "ファイナンス", href: "/itp", active: false, ...CAT.fp },
    },
    {
      id: "fp2", type: "qual",
      position: { x: -50, y: 280 },
      data: { label: "FP2級", icon: "💰", sub: "ファイナンス", href: "/itp", active: false, ...CAT.fp },
    },
    {
      id: "fp1", type: "qual",
      position: { x: -50, y: 500 },
      data: { label: "FP1級", icon: "🏅", sub: "ファイナンス", href: "/itp", active: false, ...CAT.fp },
    },

    /* ═══ 不動産 ══════════════════════════ */
    {
      id: "takken", type: "qual",
      position: { x: 1140, y: 60 },
      data: { label: "宅建士", icon: "🏠", sub: "不動産", href: "/itp", active: false, ...CAT.realty },
    },
    {
      id: "chintai", type: "qual",
      position: { x: 1140, y: 280 },
      data: { label: "賃貸不動産管理士", icon: "🏢", sub: "不動産", href: "/itp", active: false, ...CAT.realty },
    },
    {
      id: "kangyou", type: "qual",
      position: { x: 1140, y: 500 },
      data: { label: "管理業務主任者", icon: "🔑", sub: "不動産", href: "/itp", active: false, ...CAT.realty },
    },

    /* ═══ 電気 ═══════════════════════════ */
    {
      id: "denkou", type: "qual",
      position: { x: 1000, y: -80 },
      data: { label: "電気工事士2種", icon: "⚡", sub: "電気", href: "/itp", active: false, ...CAT.electric },
    },

    /* ═══ 簿記 ═══════════════════════════ */
    {
      id: "boki3", type: "qual",
      position: { x: 80, y: 900 },
      data: { label: "簿記3級", icon: "📊", sub: "会計", href: "/itp", active: false, ...CAT.boki },
    },
    {
      id: "boki2", type: "qual",
      position: { x: 260, y: 1060 },
      data: { label: "簿記2級", icon: "📊", sub: "会計", href: "/itp", active: false, ...CAT.boki },
    },
    {
      id: "boki1", type: "qual",
      position: { x: 60, y: 1220 },
      data: { label: "簿記1級", icon: "📊", sub: "会計", href: "/itp", active: false, ...CAT.boki },
    },

    /* ═══ 行政書士 ════════════════════════ */
    {
      id: "gyosei", type: "qual",
      position: { x: 950, y: 940 },
      data: { label: "行政書士", icon: "⚖️", sub: "法務", href: "/itp", active: false, ...CAT.admin },
    },

    /* ═══ 世界遺産検定 ═══════════════════ */
    {
      id: "sekaken4", type: "qual",
      position: { x: 500, y: 970 },
      data: { label: "世界遺産検定4級", icon: "🌍", sub: "文化", href: "/itp", active: false, ...CAT.heritage },
    },
    {
      id: "sekaken3", type: "qual",
      position: { x: 680, y: 1140 },
      data: { label: "世界遺産検定3級", icon: "🌏", sub: "文化", href: "/itp", active: false, ...CAT.heritage },
    },
  ];
}

/* ─── エッジ定義 ──────────────────────────────────────── */
function buildEdges(): Edge[] {
  const itStyle = { stroke: CAT.it.color, strokeWidth: 1.2, opacity: 0.35 };
  const fpStyle = { stroke: CAT.fp.color, strokeWidth: 1.2, opacity: 0.3 };
  const realtyStyle = { stroke: CAT.realty.color, strokeWidth: 1.2, opacity: 0.3 };
  const bokiStyle = { stroke: CAT.boki.color, strokeWidth: 1.2, opacity: 0.3 };
  const heritageStyle = { stroke: CAT.heritage.color, strokeWidth: 1.2, opacity: 0.3 };

  return [
    // IT系
    { id: "itp-sg",  source: "itp", target: "sg",  style: itStyle, type: "straight" },
    { id: "itp-fe",  source: "itp", target: "fe",  style: itStyle, type: "straight" },
    { id: "fe-ap",   source: "fe",  target: "ap",  style: itStyle, type: "straight" },
    { id: "sg-ap",   source: "sg",  target: "ap",  style: itStyle, type: "straight" },
    { id: "ap-nw",   source: "ap",  target: "nw",  style: itStyle, type: "straight" },
    { id: "ap-db",   source: "ap",  target: "db",  style: itStyle, type: "straight" },
    { id: "ap-sc",   source: "ap",  target: "sc",  style: itStyle, type: "straight" },
    // FP
    { id: "fp3-fp2", source: "fp3", target: "fp2", style: fpStyle, type: "straight" },
    { id: "fp2-fp1", source: "fp2", target: "fp1", style: fpStyle, type: "straight" },
    // 不動産
    { id: "takken-chintai",  source: "takken", target: "chintai",  style: realtyStyle, type: "straight" },
    { id: "takken-kangyou",  source: "takken", target: "kangyou",  style: realtyStyle, type: "straight" },
    // 簿記
    { id: "boki3-boki2", source: "boki3", target: "boki2", style: bokiStyle, type: "straight" },
    { id: "boki2-boki1", source: "boki2", target: "boki1", style: bokiStyle, type: "straight" },
    // 世界遺産
    { id: "seka4-seka3", source: "sekaken4", target: "sekaken3", style: heritageStyle, type: "straight" },
    // クロスリンク（関連資格）
    { id: "fp3-boki3", source: "fp3", target: "boki3", style: { stroke: "#475569", strokeWidth: 0.8, opacity: 0.2, strokeDasharray: "4 4" }, type: "straight" },
  ];
}

/* ─── メインページ ──────────────────────────────────────── */
export default function UniversePage() {
  const { galaxyCompleted, nodes } = useGameStore();
  const { user, openAuthModal } = useAuthStore();
  const masteredITP = nodes.filter((n) => n.status === "mastered").length;

  const flowNodes = useMemo(
    () => buildNodes(true, galaxyCompleted),
    [galaxyCompleted]
  );
  const flowEdges = useMemo(() => buildEdges(), []);

  return (
    <div
      style={{
        width: "100%",
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        background: "#050a14",
        overflow: "hidden",
      }}
    >
      {/* ─── ヘッダー ─────────────────────────── */}
      <div
        style={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 18px",
          borderBottom: "1px solid #1e293b",
          background: "rgba(5,10,20,0.85)",
          backdropFilter: "blur(12px)",
          zIndex: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "16px" }}>🌌</span>
          <span
            style={{
              fontWeight: "800",
              fontSize: "14px",
              background: "linear-gradient(135deg, #818cf8, #c084fc)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Knowledge Universe
          </span>
          <span style={{ fontSize: "10px", color: "#334155", fontWeight: "600" }}>
            — {masteredITP}/{nodes.length} 習得
          </span>
        </div>

        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            {user.user_metadata?.avatar_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.user_metadata.avatar_url}
                alt=""
                style={{ width: "24px", height: "24px", borderRadius: "50%", border: "1px solid #334155" }}
              />
            )}
            <span style={{ fontSize: "10px", color: "#22c55e", fontWeight: "700" }}>
              ☁️ 保存中
            </span>
          </div>
        ) : (
          <button
            onClick={openAuthModal}
            style={{
              padding: "5px 12px",
              borderRadius: "20px",
              background: "rgba(66,133,244,0.15)",
              border: "1px solid rgba(66,133,244,0.35)",
              color: "#93c5fd",
              fontSize: "10px",
              fontWeight: "700",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            ログイン
          </button>
        )}
      </div>

      {/* ─── ReactFlow キャンバス ──────────────── */}
      <div style={{ flex: 1, position: "relative" }}>
        <ReactFlow
          nodes={flowNodes}
          edges={flowEdges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.18 }}
          minZoom={0.25}
          maxZoom={2}
          panOnDrag
          zoomOnScroll
          zoomOnPinch
          style={{ background: "transparent" }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            color="#1e293b"
            gap={28}
            size={1}
          />
        </ReactFlow>

        {/* ヒントオーバーレイ */}
        <div
          style={{
            position: "absolute",
            bottom: "16px",
            left: "50%",
            transform: "translateX(-50%)",
            pointerEvents: "none",
            zIndex: 10,
            display: "flex",
            gap: "16px",
            alignItems: "center",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {[
            { color: CAT.it.color, label: "IT系" },
            { color: CAT.fp.color, label: "FP" },
            { color: CAT.realty.color, label: "不動産" },
            { color: CAT.electric.color, label: "電気" },
            { color: CAT.boki.color, label: "簿記" },
            { color: CAT.admin.color, label: "法務" },
            { color: CAT.heritage.color, label: "文化" },
          ].map((cat) => (
            <div
              key={cat.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "4px 10px",
                borderRadius: "12px",
                background: "rgba(5,10,20,0.75)",
                border: `1px solid ${cat.color}30`,
                backdropFilter: "blur(8px)",
              }}
            >
              <div
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  background: cat.color,
                  opacity: 0.7,
                }}
              />
              <span style={{ fontSize: "9px", color: cat.color + "aa", fontWeight: "600" }}>
                {cat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
