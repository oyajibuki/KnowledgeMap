"use client";

import { useMemo, useState, useCallback, useEffect } from "react";
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
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/lib/store";
import { useAuthStore } from "@/lib/auth-store";

/* ─── ノードデータ型 ──────────────────────────────────── */
type QualData = {
  label: string;
  icon: string;
  color: string;
  light: string;
  dark: string;
  glow: string;
  active: boolean;
  completed?: boolean;
  certified?: boolean;
  sub: string;
  href: string;   // "/itp" = 遷移, "" = ポップアップ
  wiki: string;
  qualId: string; // ノードIDをクリック時にセット
  [key: string]: unknown;
};

/* ─── カテゴリーカラー ────────────────────────────────── */
const CAT = {
  it:       { color: "#06b6d4", light: "#67e8f9", dark: "#0369a1", glow: "rgba(6,182,212,0.48)" },
  fp:       { color: "#10b981", light: "#6ee7b7", dark: "#065f46", glow: "rgba(16,185,129,0.4)"  },
  realty:   { color: "#f59e0b", light: "#fcd34d", dark: "#92400e", glow: "rgba(245,158,11,0.4)"  },
  electric: { color: "#facc15", light: "#fef08a", dark: "#854d0e", glow: "rgba(250,204,21,0.38)" },
  law:      { color: "#f87171", light: "#fca5a5", dark: "#7f1d1d", glow: "rgba(248,113,113,0.32)"},
  boki:     { color: "#818cf8", light: "#a5b4fc", dark: "#312e81", glow: "rgba(129,140,248,0.36)"},
  heritage: { color: "#60a5fa", light: "#93c5fd", dark: "#1e3a5f", glow: "rgba(96,165,250,0.3)" },
  pm:       { color: "#c084fc", light: "#e9d5ff", dark: "#581c87", glow: "rgba(192,132,252,0.36)"},
  cisco:    { color: "#38bdf8", light: "#7dd3fc", dark: "#0c4a6e", glow: "rgba(56,189,248,0.34)" },
  cloud:    { color: "#34d399", light: "#6ee7b7", dark: "#064e3b", glow: "rgba(52,211,153,0.34)" },
  linux:    { color: "#fb923c", light: "#fdba74", dark: "#7c2d12", glow: "rgba(251,146,60,0.32)" },
  ms:       { color: "#93c5fd", light: "#bfdbfe", dark: "#1e3a5f", glow: "rgba(147,197,253,0.3)" },
  medical:  { color: "#f9a8d4", light: "#fce7f3", dark: "#831843", glow: "rgba(249,168,212,0.32)"},
  lifestyle:{ color: "#fbbf24", light: "#fde68a", dark: "#92400e", glow: "rgba(251,191,36,0.3)" },
};

const SPHERE = 64;

/* ─── モジュールレベル イベント ──────────────────────── */
// ReactFlowのカスタムノードからUniversePageのstateを更新するための仕組み
let globalSelectQual: ((d: QualData) => void) | null = null;

/* ─── 資格ポップアップ ───────────────────────────────── */
function QualModal({
  qual,
  onClose,
  isCertified,
  onToggle,
}: {
  qual: QualData;
  onClose: () => void;
  isCertified: boolean;
  onToggle: (id: string) => void;
}) {
  const router = useRouter();

  return (
    <>
      <motion.div
        key="qual-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 500,
          background: "rgba(0,0,0,0.65)",
          backdropFilter: "blur(5px)",
        }}
      />
      <div style={{
        position: "fixed", inset: 0, zIndex: 501,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "16px", pointerEvents: "none",
      }}>
        <motion.div
          key="qual-modal"
          initial={{ opacity: 0, scale: 0.88, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.88, y: 10 }}
          transition={{ type: "spring", damping: 22, stiffness: 300 }}
          style={{
            pointerEvents: "all",
            width: "min(320px, 100%)",
            padding: "24px",
            borderRadius: "22px",
            background: `radial-gradient(ellipse at top, ${qual.color}12, #090e1c 60%)`,
            border: `1px solid ${qual.color}35`,
            boxShadow: `0 24px 60px rgba(0,0,0,0.75), 0 0 0 1px ${qual.color}18`,
            position: "relative",
          }}
        >
          {/* 閉じる */}
          <button
            onClick={onClose}
            style={{
              position: "absolute", top: "12px", right: "14px",
              background: "transparent", border: "none",
              color: "#475569", fontSize: "22px", cursor: "pointer", lineHeight: 1,
            }}
          >×</button>

          {/* スフィア + ラベル */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px" }}>
            <div style={{
              width: "54px", height: "54px", borderRadius: "50%", flexShrink: 0,
              background: `radial-gradient(circle at 32% 28%, ${qual.light}, ${qual.color} 54%, ${qual.dark} 100%)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "22px",
              boxShadow: `0 0 18px ${qual.glow}, inset 0 -4px 10px rgba(0,0,0,0.4)`,
            }}>
              {qual.icon}
            </div>
            <div>
              <p style={{ fontWeight: "800", fontSize: "15px", color: qual.color, marginBottom: "2px" }}>
                {qual.label}
              </p>
              <p style={{ fontSize: "11px", color: "#475569" }}>{qual.sub}</p>
            </div>
          </div>

          {/* 準備中バナー */}
          <div style={{
            padding: "8px 12px", borderRadius: "10px", marginBottom: "14px",
            background: "rgba(30,41,59,0.6)", border: "1px solid #1e293b",
            fontSize: "10px", color: "#475569", textAlign: "center",
          }}>
            🚧 知識コンテンツは現在準備中です
          </div>

          {/* 資格取得済みトグル */}
          <button
            onClick={() => onToggle(qual.qualId)}
            style={{
              width: "100%", padding: "11px", marginBottom: "10px",
              borderRadius: "12px",
              background: isCertified ? "rgba(251,191,36,0.15)" : "rgba(30,41,59,0.5)",
              border: isCertified ? "1px solid rgba(251,191,36,0.45)" : "1px solid #1e293b",
              color: isCertified ? "#fbbf24" : "#64748b",
              fontWeight: "700", fontSize: "13px", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "7px",
              transition: "all 0.2s",
            }}
          >
            {isCertified ? "⭐ 資格取得済み" : "○ 資格取得済みにする"}
          </button>

          {/* ボタン行 */}
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => { onClose(); router.push(`/qual/${qual.qualId}`); }}
              style={{
                flex: 1, padding: "10px",
                borderRadius: "12px",
                background: `${qual.color}18`,
                border: `1px solid ${qual.color}35`,
                color: qual.color, fontWeight: "700", fontSize: "12px", cursor: "pointer",
              }}
            >
              📚 知識ページへ
            </button>
            {qual.wiki && (
              <a
                href={qual.wiki}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1, padding: "10px",
                  borderRadius: "12px",
                  background: "rgba(30,41,59,0.5)",
                  border: "1px solid #1e293b",
                  color: "#64748b", fontWeight: "700", fontSize: "12px",
                  textDecoration: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                🌐 Wikipedia
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
}

/* ─── カスタムノードコンポーネント ──────────────────── */
function QualNode({ data, id }: NodeProps) {
  const router = useRouter();
  const d = data as QualData;

  const handleClick = useCallback(() => {
    if (d.href) {
      router.push(d.href);
    } else {
      globalSelectQual?.({ ...d, qualId: id });
    }
  }, [d, id, router]);

  const isActive    = d.active;
  const isCertified = !!d.certified;
  const isDim       = !d.active && !d.completed && !isCertified;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Handle type="target" position={Position.Top}    style={{ opacity: 0, width: 1, height: 1 }} />
      <Handle type="target" position={Position.Left}   style={{ opacity: 0, width: 1, height: 1 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0, width: 1, height: 1 }} />
      <Handle type="source" position={Position.Right}  style={{ opacity: 0, width: 1, height: 1 }} />

      <div style={{ position: "relative" }}>
        <motion.div
          onClick={handleClick}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.9 }}
          animate={
            isActive
              ? {
                  boxShadow: [
                    `0 0 14px ${d.glow}, 0 0 28px ${d.glow}`,
                    `0 0 26px ${d.glow}, 0 0 52px ${d.glow}`,
                    `0 0 14px ${d.glow}, 0 0 28px ${d.glow}`,
                  ],
                }
              : {}
          }
          transition={{ duration: 3, repeat: Infinity }}
          style={{
            width: SPHERE,
            height: SPHERE,
            borderRadius: "50%",
            background: isActive
              ? `radial-gradient(circle at 32% 28%, ${d.light}, ${d.color} 54%, ${d.dark} 100%)`
              : isCertified
              ? `radial-gradient(circle at 32% 28%, #fde68a, #fbbf24 54%, #b45309 100%)`
              : d.completed
              ? `radial-gradient(circle at 32% 28%, #fde68a, #fbbf24 54%, #b45309 100%)`
              : `radial-gradient(circle at 32% 28%, ${d.color}18, ${d.color}08 54%, transparent 100%), radial-gradient(circle, #1a2234, #0c1018)`,
            border: `1.5px solid ${isActive ? d.color + "90" : isCertified ? "#fbbf2460" : d.color + "30"}`,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
            position: "relative",
            overflow: "hidden",
            boxShadow: isActive
              ? `0 0 14px ${d.glow}, 0 0 28px ${d.glow}, inset 0 -5px 12px rgba(0,0,0,0.4)`
              : isCertified
              ? `0 0 12px rgba(251,191,36,0.4), inset 0 -5px 12px rgba(0,0,0,0.4)`
              : `inset 0 -5px 12px rgba(0,0,0,0.7), 0 0 0 1px ${d.color}18`,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "11%", left: "17%",
              width: "30%", height: "18%",
              borderRadius: "50%",
              background: isActive || isCertified ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.05)",
              filter: "blur(3px)",
              pointerEvents: "none",
            }}
          />
          <span
            style={{
              position: "relative", zIndex: 2,
              filter: isActive ? `drop-shadow(0 0 3px ${d.color})` : "none",
              opacity: isDim ? 0.4 : 1,
            }}
          >
            {d.icon}
          </span>
        </motion.div>

        {/* 資格取得バッジ */}
        {isCertified && (
          <div style={{
            position: "absolute", top: "-5px", right: "-5px",
            fontSize: "14px", pointerEvents: "none", zIndex: 10,
          }}>
            ⭐
          </div>
        )}
      </div>

      {/* ラベル */}
      <div style={{ marginTop: "6px", textAlign: "center", pointerEvents: "none", maxWidth: "84px" }}>
        <p style={{
          fontSize: "9.5px",
          fontWeight: isActive ? "800" : "600",
          color: isActive ? d.color : isCertified ? "#fbbf24" : isDim ? d.color + "55" : d.color + "88",
          lineHeight: 1.3, marginBottom: "1px",
        }}>
          {d.label}
        </p>
        <p style={{ fontSize: "8px", color: "#1e293b", lineHeight: 1.2 }}>{d.sub}</p>
      </div>
    </div>
  );
}

const nodeTypes = { qual: QualNode };

/* ─── ノード定義 ──────────────────────────────────── */
function buildNodes(itpCompleted: boolean): Node[] {
  const itpC = itpCompleted
    ? { color: "#fbbf24", light: "#fde68a", dark: "#b45309", glow: "rgba(251,191,36,0.52)" }
    : CAT.it;

  return [
    // ══════ IT 国家試験 ══════
    { id:"itp",  type:"qual", position:{x:920,y:240},   data:{label:"ITパスポート",       icon:"⚡",  sub:"IT基礎",       href:"/itp", active:true,  completed:itpCompleted, wiki:"https://ja.wikipedia.org/wiki/ITパスポート試験",            qualId:"itp",  ...itpC} },
    { id:"sg",   type:"qual", position:{x:660,y:40},    data:{label:"情報セキュリティMgt", icon:"🔒",  sub:"SG",           href:"",     active:false, wiki:"https://ja.wikipedia.org/wiki/情報セキュリティマネジメント試験", qualId:"sg",   ...CAT.it} },
    { id:"fe",   type:"qual", position:{x:1180,y:40},   data:{label:"基本情報技術者",      icon:"💻",  sub:"FE",           href:"/fe",  active:false, wiki:"https://ja.wikipedia.org/wiki/基本情報技術者試験",             qualId:"fe",   ...CAT.it} },
    { id:"ap",   type:"qual", position:{x:920,y:460},   data:{label:"応用情報技術者",      icon:"🔬",  sub:"AP",           href:"",     active:false, wiki:"https://ja.wikipedia.org/wiki/応用情報技術者試験",             qualId:"ap",   ...CAT.it} },
    { id:"nw",   type:"qual", position:{x:660,y:660},   data:{label:"NW スペシャリスト",   icon:"🌐",  sub:"NW",           href:"",     active:false, wiki:"https://ja.wikipedia.org/wiki/ネットワークスペシャリスト試験",  qualId:"nw",   ...CAT.it} },
    { id:"db",   type:"qual", position:{x:920,y:720},   data:{label:"DB スペシャリスト",   icon:"🗄️",  sub:"DB",           href:"",     active:false, wiki:"https://ja.wikipedia.org/wiki/データベーススペシャリスト試験",  qualId:"db",   ...CAT.it} },
    { id:"sc",   type:"qual", position:{x:1180,y:660},  data:{label:"安全確保支援士",      icon:"🛡️",  sub:"SC",           href:"",     active:false, wiki:"https://ja.wikipedia.org/wiki/情報処理安全確保支援士試験",     qualId:"sc",   ...CAT.it} },
    { id:"ipast",type:"qual", position:{x:1120,y:840},  data:{label:"ITストラテジスト",    icon:"🎯",  sub:"IPA高度",      href:"",     active:false, wiki:"https://ja.wikipedia.org/wiki/ITストラテジスト試験",           qualId:"ipast",...CAT.it} },

    // ══════ Cisco ══════
    { id:"ccna", type:"qual", position:{x:400,y:440},   data:{label:"CCNA",               icon:"🔵",  sub:"Cisco/NW",    href:"",     active:false, wiki:"https://ja.wikipedia.org/wiki/CCNA",                          qualId:"ccna",  ...CAT.cisco} },
    { id:"ccnp", type:"qual", position:{x:200,y:600},   data:{label:"CCNP",               icon:"🔵",  sub:"Cisco/NW",    href:"",     active:false, wiki:"https://ja.wikipedia.org/wiki/CCNP",                          qualId:"ccnp",  ...CAT.cisco} },
    { id:"ccie", type:"qual", position:{x:60,y:800},    data:{label:"CCIE",               icon:"🏆",  sub:"Cisco最高位", href:"",     active:false, wiki:"https://ja.wikipedia.org/wiki/CCIE",                          qualId:"ccie",  ...CAT.cisco} },

    // ══════ クラウド ══════
    { id:"az900",type:"qual", position:{x:1440,y:140},  data:{label:"AZ-900",             icon:"☁️",  sub:"Azure基礎",   href:"",     active:false, wiki:"https://ja.wikipedia.org/wiki/Microsoft_Azure",               qualId:"az900", ...CAT.cloud} },
    { id:"aws",  type:"qual", position:{x:1640,y:140},  data:{label:"AWS SAA",            icon:"☁️",  sub:"AWS",         href:"",     active:false, wiki:"https://ja.wikipedia.org/wiki/アマゾン・ウェブ・サービス",     qualId:"aws",   ...CAT.cloud} },
    { id:"gcp",  type:"qual", position:{x:1540,y:340},  data:{label:"GCP ACE",            icon:"☁️",  sub:"Google Cloud", href:"",    active:false, wiki:"https://ja.wikipedia.org/wiki/Google_Cloud",                 qualId:"gcp",   ...CAT.cloud} },

    // ══════ Microsoft ══════
    { id:"az104",type:"qual", position:{x:1740,y:340},  data:{label:"AZ-104",             icon:"🪟",  sub:"Azure管理者", href:"",     active:false, wiki:"https://ja.wikipedia.org/wiki/Microsoft_Azure",               qualId:"az104", ...CAT.ms} },
    { id:"ms900",type:"qual", position:{x:1840,y:520},  data:{label:"MS-900",             icon:"🪟",  sub:"M365基礎",    href:"",     active:false, wiki:"https://ja.wikipedia.org/wiki/Microsoft_365",                qualId:"ms900", ...CAT.ms} },
    { id:"mos",  type:"qual", position:{x:1700,y:660},  data:{label:"MOS",                icon:"📄",  sub:"Officeスペシャ", href:"",   active:false, wiki:"https://ja.wikipedia.org/wiki/マイクロソフトオフィススペシャリスト", qualId:"mos", ...CAT.ms} },

    // ══════ Linux ══════
    { id:"lpic1",type:"qual", position:{x:1440,y:540},  data:{label:"LPIC-1",             icon:"🐧",  sub:"Linux基礎",   href:"",     active:false, wiki:"https://ja.wikipedia.org/wiki/LPI",                           qualId:"lpic1", ...CAT.linux} },
    { id:"lpic2",type:"qual", position:{x:1640,y:700},  data:{label:"LPIC-2",             icon:"🐧",  sub:"Linux応用",   href:"",     active:false, wiki:"https://ja.wikipedia.org/wiki/LPI",                           qualId:"lpic2", ...CAT.linux} },

    // ══════ Oracle ══════
    { id:"oracle",type:"qual",position:{x:1260,y:820},  data:{label:"Oracle DB",          icon:"🔶",  sub:"Oracle認定",  href:"",     active:false, wiki:"https://ja.wikipedia.org/wiki/Oracle_Database",              qualId:"oracle",...CAT.linux} },

    // ══════ FP ══════
    { id:"fp3",  type:"qual", position:{x:60,y:60},     data:{label:"FP 3級",             icon:"💰",  sub:"ファイナンス", href:"",     active:false, wiki:"https://ja.wikipedia.org/wiki/ファイナンシャル・プランナー",   qualId:"fp3",   ...CAT.fp} },
    { id:"fp2",  type:"qual", position:{x:60,y:280},    data:{label:"FP 2級",             icon:"💰",  sub:"ファイナンス", href:"",     active:false, wiki:"https://ja.wikipedia.org/wiki/ファイナンシャル・プランナー",   qualId:"fp2",   ...CAT.fp} },
    { id:"fp1",  type:"qual", position:{x:60,y:500},    data:{label:"FP 1級",             icon:"🏅",  sub:"ファイナンス", href:"",     active:false, wiki:"https://ja.wikipedia.org/wiki/ファイナンシャル・プランナー",   qualId:"fp1",   ...CAT.fp} },

    // ══════ 不動産 ══════
    { id:"takken",  type:"qual",position:{x:1940,y:80},  data:{label:"宅建士",            icon:"🏠",  sub:"不動産",      href:"",     active:false, wiki:"https://ja.wikipedia.org/wiki/宅地建物取引士",                qualId:"takken",  ...CAT.realty} },
    { id:"chintai", type:"qual",position:{x:1940,y:300}, data:{label:"賃貸管理士",        icon:"🏢",  sub:"不動産",      href:"",     active:false, wiki:"https://ja.wikipedia.org/wiki/賃貸不動産経営管理士",           qualId:"chintai", ...CAT.realty} },
    { id:"kangyou", type:"qual",position:{x:1940,y:520}, data:{label:"管理業務主任者",    icon:"🔑",  sub:"不動産",      href:"",     active:false, wiki:"https://ja.wikipedia.org/wiki/管理業務主任者",                qualId:"kangyou", ...CAT.realty} },

    // ══════ 電工 ══════
    { id:"denkou",  type:"qual",position:{x:1840,y:-80}, data:{label:"電気工事士 2種",    icon:"⚡",  sub:"電気",        href:"",     active:false, wiki:"https://ja.wikipedia.org/wiki/電気工事士",                    qualId:"denkou",  ...CAT.electric} },

    // ══════ 法務 ══════
    { id:"gyosei",  type:"qual",position:{x:1540,y:940},  data:{label:"行政書士",         icon:"⚖️",  sub:"法務",        href:"",     active:false, wiki:"https://ja.wikipedia.org/wiki/行政書士",                      qualId:"gyosei",  ...CAT.law} },
    { id:"sharoshi",type:"qual",position:{x:1340,y:1060}, data:{label:"社会保険労務士",   icon:"📋",  sub:"社労士",      href:"",     active:false, wiki:"https://ja.wikipedia.org/wiki/社会保険労務士",                qualId:"sharoshi",...CAT.law} },
    { id:"shiho",   type:"qual",position:{x:1740,y:1100}, data:{label:"司法書士",         icon:"📜",  sub:"法務",        href:"",     active:false, wiki:"https://ja.wikipedia.org/wiki/司法書士",                      qualId:"shiho",   ...CAT.law} },
    { id:"bengoshi",type:"qual",position:{x:1540,y:1280}, data:{label:"弁護士",           icon:"⚖️",  sub:"法務",        href:"",     active:false, wiki:"https://ja.wikipedia.org/wiki/弁護士",                        qualId:"bengoshi",...CAT.law} },

    // ══════ 簿記 ══════
    { id:"boki3",type:"qual", position:{x:200,y:860},   data:{label:"簿記 3級",           icon:"📊",  sub:"会計",        href:"",     active:false, wiki:"https://ja.wikipedia.org/wiki/日本商工会議所簿記検定試験",     qualId:"boki3", ...CAT.boki} },
    { id:"boki2",type:"qual", position:{x:380,y:1040},  data:{label:"簿記 2級",           icon:"📊",  sub:"会計",        href:"",     active:false, wiki:"https://ja.wikipedia.org/wiki/日本商工会議所簿記検定試験",     qualId:"boki2", ...CAT.boki} },
    { id:"boki1",type:"qual", position:{x:180,y:1220},  data:{label:"簿記 1級",           icon:"📊",  sub:"会計",        href:"",     active:false, wiki:"https://ja.wikipedia.org/wiki/日本商工会議所簿記検定試験",     qualId:"boki1", ...CAT.boki} },
    { id:"zeirishi",type:"qual",position:{x:560,y:1220},data:{label:"税理士",             icon:"🧾",  sub:"税務",        href:"",     active:false, wiki:"https://ja.wikipedia.org/wiki/税理士",                        qualId:"zeirishi",...CAT.boki} },
    { id:"cpa",  type:"qual", position:{x:60,y:1400},   data:{label:"公認会計士",         icon:"🏦",  sub:"最上位会計",  href:"",     active:false, wiki:"https://ja.wikipedia.org/wiki/公認会計士",                    qualId:"cpa",   ...CAT.boki} },

    // ══════ PM / ビジネス ══════
    { id:"chusho",type:"qual",position:{x:700,y:920},   data:{label:"中小企業診断士",     icon:"📈",  sub:"経営",        href:"",     active:false, wiki:"https://ja.wikipedia.org/wiki/中小企業診断士",                qualId:"chusho",...CAT.pm} },
    { id:"ipapm",type:"qual", position:{x:760,y:1060},  data:{label:"PM試験",             icon:"🗂️",  sub:"IPA高度/PM",  href:"",     active:false, wiki:"https://ja.wikipedia.org/wiki/プロジェクトマネージャ試験",    qualId:"ipapm", ...CAT.pm} },
    { id:"pmp",  type:"qual", position:{x:960,y:1040},  data:{label:"PMP",                icon:"🎖️",  sub:"PMI認定",     href:"",     active:false, wiki:"https://ja.wikipedia.org/wiki/PMP",                           qualId:"pmp",   ...CAT.pm} },
    { id:"cbap", type:"qual", position:{x:1160,y:1160}, data:{label:"CBAP (BABOK)",       icon:"📋",  sub:"ビジネス分析", href:"",     active:false, wiki:"https://ja.wikipedia.org/wiki/国際ビジネス分析者協会",         qualId:"cbap",  ...CAT.pm} },

    // ══════ 医療 / 福祉 ══════
    { id:"hoiku", type:"qual",position:{x:-100,y:860},  data:{label:"保育士",             icon:"👶",  sub:"医療/福祉",   href:"",     active:false, wiki:"https://ja.wikipedia.org/wiki/保育士",                        qualId:"hoiku",  ...CAT.medical} },
    { id:"eiyo",  type:"qual",position:{x:-100,y:1080}, data:{label:"管理栄養士",         icon:"🥗",  sub:"医療/福祉",   href:"",     active:false, wiki:"https://ja.wikipedia.org/wiki/管理栄養士",                    qualId:"eiyo",   ...CAT.medical} },
    { id:"kaigo", type:"qual",position:{x:-100,y:1300}, data:{label:"介護福祉士",         icon:"🤝",  sub:"医療/福祉",   href:"",     active:false, wiki:"https://ja.wikipedia.org/wiki/介護福祉士",                    qualId:"kaigo",  ...CAT.medical} },

    // ══════ 世界遺産検定 ══════
    { id:"seka4",type:"qual", position:{x:1060,y:1280}, data:{label:"世界遺産 4級",       icon:"🌍",  sub:"文化",        href:"",     active:false, wiki:"https://ja.wikipedia.org/wiki/世界遺産検定",                  qualId:"seka4", ...CAT.heritage} },
    { id:"seka3",type:"qual", position:{x:1260,y:1440}, data:{label:"世界遺産 3級",       icon:"🌏",  sub:"文化",        href:"",     active:false, wiki:"https://ja.wikipedia.org/wiki/世界遺産検定",                  qualId:"seka3", ...CAT.heritage} },
    { id:"seka2",type:"qual", position:{x:1060,y:1600}, data:{label:"世界遺産 2級",       icon:"🗺️",  sub:"文化",        href:"",     active:false, wiki:"https://ja.wikipedia.org/wiki/世界遺産検定",                  qualId:"seka2", ...CAT.heritage} },
    { id:"seka1",type:"qual", position:{x:1260,y:1760}, data:{label:"世界遺産 1級",       icon:"🏛️",  sub:"文化",        href:"",     active:false, wiki:"https://ja.wikipedia.org/wiki/世界遺産検定",                  qualId:"seka1", ...CAT.heritage} },

    // ══════ ライフスタイル ══════
    { id:"hisho",    type:"qual",position:{x:420,y:1380},data:{label:"秘書検定",          icon:"📁",  sub:"ライフスタイル",href:"",    active:false, wiki:"https://ja.wikipedia.org/wiki/秘書検定",                      qualId:"hisho",    ...CAT.lifestyle} },
    { id:"shikisai", type:"qual",position:{x:600,y:1520},data:{label:"色彩検定",          icon:"🎨",  sub:"ライフスタイル",href:"",    active:false, wiki:"https://ja.wikipedia.org/wiki/色彩検定",                      qualId:"shikisai", ...CAT.lifestyle} },
    { id:"kanji",    type:"qual",position:{x:220,y:1500},data:{label:"漢字検定",          icon:"漢",  sub:"ライフスタイル",href:"",    active:false, wiki:"https://ja.wikipedia.org/wiki/漢字能力検定",                  qualId:"kanji",    ...CAT.lifestyle} },
  ];
}

/* ─── エッジ定義 ─────────────────────────────────── */
function buildEdges(): Edge[] {
  const e = (id: string, s: string, t: string, color: string, dashed = false): Edge => ({
    id, source: s, target: t,
    type: "smoothstep",
    style: {
      stroke: color, strokeWidth: 1.2,
      opacity: 0.38,
      strokeDasharray: dashed ? "5 5" : undefined,
    },
  });

  return [
    // IT 国家試験
    e("itp-sg",   "itp",  "sg",    CAT.it.color),
    e("itp-fe",   "itp",  "fe",    CAT.it.color),
    e("sg-ap",    "sg",   "ap",    CAT.it.color),
    e("fe-ap",    "fe",   "ap",    CAT.it.color),
    e("ap-nw",    "ap",   "nw",    CAT.it.color),
    e("ap-db",    "ap",   "db",    CAT.it.color),
    e("ap-sc",    "ap",   "sc",    CAT.it.color),
    e("ap-ipast", "ap",   "ipast", CAT.it.color),

    // IT → Cisco
    e("nw-ccna",   "nw",   "ccna",  CAT.cisco.color),
    e("ccna-ccnp", "ccna", "ccnp",  CAT.cisco.color),
    e("ccnp-ccie", "ccnp", "ccie",  CAT.cisco.color),

    // IT → クラウド
    e("fe-az900",    "fe",    "az900", CAT.cloud.color),
    e("az900-aws",   "az900", "aws",   CAT.cloud.color),
    e("az900-gcp",   "az900", "gcp",   CAT.cloud.color),
    e("az900-az104", "az900", "az104", CAT.ms.color),
    e("az104-ms900", "az104", "ms900", CAT.ms.color),
    e("az104-mos",   "az104", "mos",   CAT.ms.color),
    e("sc-aws",      "sc",    "aws",   CAT.cloud.color, true),

    // IT → Linux
    e("fe-lpic1",    "fe",    "lpic1", CAT.linux.color),
    e("lpic1-lpic2", "lpic1", "lpic2", CAT.linux.color),

    // IT → Oracle
    e("db-oracle", "db", "oracle", CAT.linux.color),

    // FP 系列
    e("fp3-fp2", "fp3", "fp2", CAT.fp.color),
    e("fp2-fp1", "fp2", "fp1", CAT.fp.color),

    // 不動産 系列
    e("tak-chin", "takken", "chintai", CAT.realty.color),
    e("tak-kan",  "takken", "kangyou", CAT.realty.color),

    // 法務 系列
    e("gyo-shi",  "gyosei",  "shiho",    CAT.law.color),
    e("shi-ben",  "shiho",   "bengoshi", CAT.law.color),
    e("gyo-sha",  "gyosei",  "sharoshi", CAT.law.color, true),

    // 簿記 系列
    e("b3-b2",    "boki3",   "boki2",    CAT.boki.color),
    e("b2-b1",    "boki2",   "boki1",    CAT.boki.color),
    e("b2-zei",   "boki2",   "zeirishi", CAT.boki.color, true),
    e("b1-cpa",   "boki1",   "cpa",      CAT.boki.color),

    // PM 系列
    e("ap-ipapm", "ap",     "ipapm", CAT.pm.color),
    e("chu-pmp",  "chusho", "pmp",   CAT.pm.color),
    e("pmp-cbap", "pmp",    "cbap",  CAT.pm.color),
    e("ipapm-pmp","ipapm",  "pmp",   CAT.pm.color, true),

    // 世界遺産 系列
    e("sk4-sk3", "seka4", "seka3", CAT.heritage.color),
    e("sk3-sk2", "seka3", "seka2", CAT.heritage.color),
    e("sk2-sk1", "seka2", "seka1", CAT.heritage.color),

    // クロスリンク（破線）
    e("fp3-b3",  "fp3",    "boki3",   "#4b5563", true), // FP3 ↔ 簿記3（同レベル）
    e("b1-chu",  "boki1",  "chusho",  "#4b5563", true), // 簿記 → 中小診断士
    e("gyo-chu", "gyosei", "chusho",  "#4b5563", true), // 行政書士 → 中小診断士
    e("sha-chu", "sharoshi","chusho", "#4b5563", true), // 社労士 → 中小診断士
    e("ipast-ipapm","ipast","ipapm",  "#4b5563", true), // IPA高度 クロス
  ];
}

/* ─── カテゴリー凡例 ─────────────────────────────── */
const LEGEND = [
  { color: CAT.it.color,       label: "IT国家試験" },
  { color: CAT.cisco.color,    label: "Cisco" },
  { color: CAT.cloud.color,    label: "クラウド" },
  { color: CAT.linux.color,    label: "Linux/Oracle" },
  { color: CAT.ms.color,       label: "Microsoft" },
  { color: CAT.fp.color,       label: "FP" },
  { color: CAT.realty.color,   label: "不動産" },
  { color: CAT.electric.color, label: "電気" },
  { color: CAT.law.color,      label: "法務/社労士" },
  { color: CAT.boki.color,     label: "簿記/会計" },
  { color: CAT.pm.color,       label: "PM/経営" },
  { color: CAT.medical.color,  label: "医療/福祉" },
  { color: CAT.heritage.color, label: "文化" },
  { color: CAT.lifestyle.color,label: "ライフスタイル" },
];

/* ─── メインページ ──────────────────────────────── */
export default function UniversePage() {
  const { galaxyCompleted } = useGameStore();
  const { user, openAuthModal } = useAuthStore();
  const [selectedQual, setSelectedQual] = useState<QualData | null>(null);

  // 資格取得済みの管理（localStorage永続化）
  const [certifiedQuals, setCertifiedQuals] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set();
    try {
      const saved = localStorage.getItem("certifiedQuals");
      return saved ? new Set(JSON.parse(saved) as string[]) : new Set();
    } catch {
      return new Set();
    }
  });

  const toggleCertified = useCallback((qualId: string) => {
    setCertifiedQuals((prev) => {
      const next = new Set(prev);
      if (next.has(qualId)) next.delete(qualId);
      else next.add(qualId);
      try { localStorage.setItem("certifiedQuals", JSON.stringify([...next])); } catch {}
      return next;
    });
  }, []);

  // モジュールレベルのコールバックを登録
  globalSelectQual = setSelectedQual;

  const flowNodes = useMemo(() => {
    const nodes = buildNodes(galaxyCompleted);
    return nodes.map((n) => ({
      ...n,
      data: { ...n.data, certified: certifiedQuals.has(n.id) },
    }));
  }, [galaxyCompleted, certifiedQuals]);

  const flowEdges = useMemo(() => buildEdges(), []);

  return (
    <div style={{
      width: "100%", height: "100dvh",
      display: "flex", flexDirection: "column",
      background: "#050a14", overflow: "hidden",
    }}>
      {/* ── ヘッダー ── */}
      <div style={{
        flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "11px 18px",
        borderBottom: "1px solid #1e293b",
        background: "rgba(5,10,20,0.88)",
        backdropFilter: "blur(14px)",
        zIndex: 20,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "16px" }}>🌌</span>
          <span style={{
            fontWeight: "800", fontSize: "14px",
            background: "linear-gradient(135deg, #818cf8, #c084fc)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            Knowledge Universe
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
            <span style={{ fontSize: "10px", color: "#22c55e", fontWeight: "700" }}>☁️ 保存中</span>
          </div>
        ) : (
          <button
            onClick={openAuthModal}
            style={{
              padding: "5px 12px", borderRadius: "20px",
              background: "rgba(66,133,244,0.15)",
              border: "1px solid rgba(66,133,244,0.35)",
              color: "#93c5fd", fontSize: "10px", fontWeight: "700",
              cursor: "pointer", display: "flex", alignItems: "center", gap: "5px",
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

      {/* ── ReactFlow ── */}
      <div style={{ flex: 1, position: "relative" }}>
        <ReactFlow
          nodes={flowNodes}
          edges={flowEdges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.1 }}
          minZoom={0.12}
          maxZoom={2.5}
          panOnDrag
          zoomOnScroll
          zoomOnPinch
          style={{ background: "transparent" }}
        >
          <Background variant={BackgroundVariant.Dots} color="#0f172a" gap={26} size={1} />
        </ReactFlow>

        {/* 凡例 */}
        <div style={{
          position: "absolute", bottom: "12px", left: "50%",
          transform: "translateX(-50%)",
          pointerEvents: "none", zIndex: 10,
          display: "flex", gap: "6px", flexWrap: "wrap",
          justifyContent: "center", maxWidth: "min(96vw, 640px)", padding: "0 8px",
        }}>
          {LEGEND.map((cat) => (
            <div key={cat.label} style={{
              display: "flex", alignItems: "center", gap: "4px",
              padding: "3px 8px", borderRadius: "10px",
              background: "rgba(5,10,20,0.82)",
              border: `1px solid ${cat.color}28`,
              backdropFilter: "blur(8px)",
            }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: cat.color, opacity: 0.75 }} />
              <span style={{ fontSize: "8.5px", color: cat.color + "99", fontWeight: "600" }}>{cat.label}</span>
            </div>
          ))}
        </div>

        {/* ヒント */}
        <div style={{
          position: "absolute", top: "10px", right: "10px",
          pointerEvents: "none",
          background: "rgba(5,10,20,0.7)", border: "1px solid #1e293b",
          borderRadius: "10px", padding: "6px 10px",
          fontSize: "9px", color: "#334155", backdropFilter: "blur(8px)",
        }}>
          ピンチ/スクロールでズーム・ドラッグで移動
        </div>
      </div>

      {/* ── 資格ポップアップ ── */}
      <AnimatePresence>
        {selectedQual && (
          <QualModal
            qual={selectedQual}
            onClose={() => setSelectedQual(null)}
            isCertified={certifiedQuals.has(selectedQual.qualId)}
            onToggle={toggleCertified}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
