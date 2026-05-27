"use client";

import { memo } from "react";
import { NodeProps } from "@xyflow/react";
import { useGameStore } from "@/lib/store";
import { FE_BOSS_UNLOCK_THRESHOLD } from "@/lib/data";

function FEExamNode(_props: NodeProps) {
  const {
    nodes,
    feExamMode,
    feExamCompleted,
    feExamPassed,
    feExamScoreA,
    feExamScoreB,
    startFEExam,
  } = useGameStore();

  const feMastered = nodes.filter(
    (n) => n.status === "mastered" && n.topicId === "fe"
  ).length;
  const isUnlocked = feMastered >= FE_BOSS_UNLOCK_THRESHOLD;
  const canStart = isUnlocked;
  const pct = Math.min(100, Math.round((feMastered / FE_BOSS_UNLOCK_THRESHOLD) * 100));

  if (feExamMode) return <div style={{ width: 100, height: 120 }} />;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "5px",
        width: 100,
      }}
    >
      {/* ラベル */}
      <div
        style={{
          padding: "3px 8px",
          borderRadius: "20px",
          background: isUnlocked
            ? "rgba(129,140,248,0.15)"
            : "rgba(9,11,20,0.9)",
          border: isUnlocked
            ? "1px solid rgba(129,140,248,0.45)"
            : "1px solid #1e293b",
          color: isUnlocked ? "#818cf8" : "#334155",
          fontSize: "9px",
          fontWeight: "700",
          whiteSpace: "nowrap",
          textAlign: "center",
          backdropFilter: "blur(6px)",
        }}
      >
        {feExamCompleted && feExamPassed
          ? "🏆 FE合格済み"
          : feExamCompleted
          ? `A:${feExamScoreA} B:${feExamScoreB}`
          : isUnlocked
          ? "✨ FE模擬試験 解放！"
          : `あと ${FE_BOSS_UNLOCK_THRESHOLD - feMastered} 個で解放`}
      </div>

      {/* オーブ */}
      <button
        onClick={canStart ? startFEExam : undefined}
        style={{
          width: "86px",
          height: "86px",
          borderRadius: "50%",
          cursor: canStart ? "pointer" : "default",
          border: feExamCompleted && feExamPassed
            ? "2.5px solid #818cf8"
            : isUnlocked
            ? "2.5px solid rgba(129,140,248,0.7)"
            : "2px solid #334155",
          background: feExamCompleted && feExamPassed
            ? "radial-gradient(circle at 35% 30%, #c7d2fe, #6366f1 55%, #1e1b4b)"
            : isUnlocked
            ? "radial-gradient(circle at 35% 30%, #e0e7ff, #818cf8 55%, #312e81)"
            : "radial-gradient(circle at 35% 30%, #1e2d45, #0f172a)",
          boxShadow: isUnlocked
            ? "0 0 20px rgba(129,140,248,0.45), 0 0 44px rgba(129,140,248,0.2), inset 0 -4px 12px rgba(0,0,0,0.4)"
            : "inset 0 -4px 12px rgba(0,0,0,0.8)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "2px",
          position: "relative",
          overflow: "hidden",
          transition: "transform 0.15s, box-shadow 0.15s",
          animation: isUnlocked ? "pulse-exam 2.4s ease-in-out infinite" : undefined,
        }}
        onMouseEnter={(e) => {
          if (canStart) e.currentTarget.style.transform = "scale(1.08)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        {/* ハイライト */}
        <div
          style={{
            position: "absolute",
            top: "10%", left: "14%",
            width: "34%", height: "22%",
            borderRadius: "50%",
            background: isUnlocked
              ? "rgba(255,255,255,0.45)"
              : "rgba(255,255,255,0.04)",
            filter: "blur(2px)",
            pointerEvents: "none",
          }}
        />
        {/* 回転インナーリング */}
        {isUnlocked && (
          <div
            style={{
              position: "absolute",
              inset: "4px",
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.22)",
              animation: "spin-slow 8s linear infinite",
            }}
          />
        )}

        {feExamCompleted && feExamPassed ? (
          <>
            <span style={{ fontSize: "24px", position: "relative", zIndex: 1 }}>🏆</span>
            <span style={{ fontSize: "8px", color: "#e0e7ff", fontWeight: "800", textAlign: "center", lineHeight: 1.3, position: "relative", zIndex: 1 }}>
              再挑戦<br />する
            </span>
          </>
        ) : isUnlocked ? (
          <>
            <span style={{ fontSize: "22px", position: "relative", zIndex: 1 }}>💻</span>
            <span style={{ fontSize: "8px", color: "#e0e7ff", fontWeight: "800", textAlign: "center", lineHeight: 1.3, position: "relative", zIndex: 1 }}>
              FE<br />模擬試験
            </span>
          </>
        ) : (
          <>
            <span style={{ fontSize: "18px" }}>🔒</span>
            <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "700" }}>
              {feMastered}/{FE_BOSS_UNLOCK_THRESHOLD}
            </span>
          </>
        )}
      </button>

      {/* プログレスバー（ロック時） */}
      {!isUnlocked && (
        <div style={{ width: "72px", height: "4px", borderRadius: "2px", background: "#1e293b", overflow: "hidden" }}>
          <div
            style={{
              width: `${pct}%`,
              height: "100%",
              borderRadius: "2px",
              background: "linear-gradient(90deg, #4f46e5, #818cf8)",
              transition: "width 0.6s ease-out",
            }}
          />
        </div>
      )}

      {/* 前回不合格バッジ */}
      {feExamCompleted && !feExamPassed && isUnlocked && (
        <div style={{ fontSize: "9px", color: "#ef4444", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "10px", padding: "2px 8px", textAlign: "center" }}>
          {feExamScoreA < 600 && feExamScoreB < 600 ? "A・B不合格" : feExamScoreA < 600 ? "A科目不合格" : "B科目不合格"}
        </div>
      )}
    </div>
  );
}

export default memo(FEExamNode);
