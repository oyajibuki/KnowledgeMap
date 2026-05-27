"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { NodeProps } from "@xyflow/react";

interface GroupBubbleData {
  label: string;
  radius: number;
  fillColor: string;
  strokeColor: string;
  isCompleted?: boolean;
  [key: string]: unknown;
}

/* ──────────────────────────────────────────
   資格情報テーブル
────────────────────────────────────────── */
interface ExamInfo {
  subtitle: string;
  difficulty: string;
  difficultyStars: number;
  time: string;
  questions: string;
  passing: string;
  color: string;
  icon: string;
}

const EXAM_INFO: Record<string, ExamInfo> = {
  ITパスポート: {
    subtitle: "IT基礎・活用（ストラテジ・マネジメント・テクノロジ）",
    difficulty: "入門〜初級",
    difficultyStars: 2,
    time: "120分",
    questions: "100問（4択式）",
    passing: "総合600点以上 ＋ 各分野300点以上（1000点満点）",
    color: "#fbbf24",
    icon: "⚡",
  },
  基本情報技術者: {
    subtitle: "IT専門技術（アルゴリズム・ソフトウェア・ハードウェア等）",
    difficulty: "初級〜中級",
    difficultyStars: 3,
    time: "科目A: 90分 ／ 科目B: 100分",
    questions: "科目A: 60問（多肢選択）／ 科目B: 20問（多肢選択）",
    passing: "各科目600点以上（1000点満点）",
    color: "#818cf8",
    icon: "💻",
  },
};

/* ──────────────────────────────────────────
   ポップアップモーダル（portal）
────────────────────────────────────────── */
function ExamInfoPopup({
  info,
  label,
  onClose,
}: {
  info: ExamInfo;
  label: string;
  onClose: () => void;
}) {
  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        background: "rgba(2,5,8,0.75)",
        backdropFilter: "blur(6px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "linear-gradient(135deg, #0d1a2e 0%, #0a1220 100%)",
          border: `1.5px solid ${info.color}55`,
          borderRadius: "20px",
          padding: "28px 28px 24px",
          width: "100%",
          maxWidth: "380px",
          boxShadow: `0 0 40px ${info.color}22, 0 20px 60px rgba(0,0,0,0.6)`,
          position: "relative",
        }}
      >
        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "14px",
            right: "14px",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "50%",
            width: "28px",
            height: "28px",
            color: "#64748b",
            fontSize: "14px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: 1,
          }}
        >
          ×
        </button>

        {/* ヘッダー */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
          <span style={{ fontSize: "28px" }}>{info.icon}</span>
          <div>
            <div style={{ fontSize: "17px", fontWeight: "800", color: info.color, letterSpacing: "0.02em" }}>
              {label}
            </div>
            <div style={{ fontSize: "10px", color: "#64748b", marginTop: "2px" }}>
              {info.subtitle}
            </div>
          </div>
        </div>

        {/* 区切り線 */}
        <div style={{ height: "1px", background: `linear-gradient(90deg, ${info.color}44, transparent)`, marginBottom: "16px" }} />

        {/* 詳細テーブル */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {[
            {
              label: "難易度",
              value: (
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  {"★".repeat(info.difficultyStars)}
                  <span style={{ color: "#334155" }}>{"★".repeat(5 - info.difficultyStars)}</span>
                  <span style={{ marginLeft: "4px", fontSize: "11px" }}>({info.difficulty})</span>
                </span>
              ),
            },
            { label: "試験時間", value: info.time },
            { label: "問題数", value: info.questions },
            { label: "合格基準", value: info.passing },
          ].map((row) => (
            <div
              key={row.label}
              style={{
                display: "flex",
                gap: "10px",
                background: "rgba(255,255,255,0.03)",
                borderRadius: "10px",
                padding: "9px 12px",
              }}
            >
              <span
                style={{
                  fontSize: "10px",
                  color: info.color + "cc",
                  fontWeight: "700",
                  minWidth: "60px",
                  flexShrink: 0,
                  paddingTop: "1px",
                }}
              >
                {row.label}
              </span>
              <span style={{ fontSize: "12px", color: "#cbd5e1", lineHeight: 1.5, fontWeight: "600" }}>
                {row.value}
              </span>
            </div>
          ))}
        </div>

        {/* フッター */}
        <div style={{ marginTop: "18px", textAlign: "center" }}>
          <button
            onClick={onClose}
            style={{
              padding: "8px 28px",
              borderRadius: "20px",
              background: `${info.color}18`,
              border: `1px solid ${info.color}44`,
              color: info.color,
              fontSize: "12px",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            閉じる
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

/* ──────────────────────────────────────────
   GroupBubble カスタムノード
────────────────────────────────────────── */
export default function GroupBubble({ data }: NodeProps) {
  const d = data as GroupBubbleData;
  const [showPopup, setShowPopup] = useState(false);
  const size = d.radius * 2;
  const info = EXAM_INFO[d.label];

  const borderColor = d.isCompleted
    ? "rgba(251,191,36,0.9)"
    : d.strokeColor;
  const borderWidth = d.isCompleted ? "2.5px" : "1.5px";
  const boxShadow = d.isCompleted
    ? "0 0 60px rgba(251,191,36,0.28), 0 0 120px rgba(251,191,36,0.12), inset 0 0 80px rgba(251,191,36,0.05)"
    : `0 0 60px ${d.fillColor}, inset 0 0 80px ${d.fillColor}`;
  const bgColor = d.isCompleted
    ? "rgba(251,191,36,0.04)"
    : d.fillColor;
  const labelColor = d.isCompleted
    ? "rgba(251,191,36,0.9)"
    : d.strokeColor;
  const labelShadow = d.isCompleted
    ? "0 0 20px rgba(251,191,36,0.5)"
    : `0 0 20px ${d.strokeColor}`;

  return (
    <>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: bgColor,
          border: `${borderWidth} solid ${borderColor}`,
          boxShadow,
          animation: d.isCompleted ? "glow-gold 2.5s ease-in-out infinite" : undefined,
          pointerEvents: "none",
          position: "relative",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          paddingTop: "28px",
        }}
      >
        {/* グループラベル — クリック可能 */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (info) setShowPopup(true);
          }}
          style={{
            fontSize: "19px",
            fontWeight: "800",
            color: labelColor,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            opacity: 0.88,
            pointerEvents: info ? "auto" : "none",
            userSelect: "none",
            textShadow: labelShadow,
            background: "transparent",
            border: "none",
            cursor: info ? "pointer" : "default",
            padding: "4px 10px",
            borderRadius: "20px",
            transition: "opacity 0.15s, text-shadow 0.15s",
            lineHeight: 1,
          }}
          onMouseEnter={(e) => {
            if (info) {
              e.currentTarget.style.opacity = "1";
              e.currentTarget.style.textShadow = `0 0 28px ${labelColor}, ${labelShadow}`;
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "0.88";
            e.currentTarget.style.textShadow = labelShadow;
          }}
        >
          {d.label}
          {d.isCompleted && " ✓"}
        </button>
      </div>

      {/* ポップアップ */}
      {showPopup && info && typeof document !== "undefined" && (
        <ExamInfoPopup
          info={info}
          label={d.label}
          onClose={() => setShowPopup(false)}
        />
      )}
    </>
  );
}
