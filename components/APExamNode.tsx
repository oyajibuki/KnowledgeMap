"use client";

import { memo } from "react";
import { NodeProps } from "@xyflow/react";
import { useAPStore } from "@/lib/ap-store";
import { AP_BOSS_UNLOCK_THRESHOLD } from "@/lib/ap-data";

function APExamNode(_props: NodeProps) {
  const {
    nodes,
    examMode,
    examCompleted,
    examPassed,
    startExam,
  } = useAPStore();

  const masteredCount = nodes.filter((n) => n.status === "mastered").length;
  const isUnlocked = masteredCount >= AP_BOSS_UNLOCK_THRESHOLD;
  const pct = Math.min(100, Math.round((masteredCount / AP_BOSS_UNLOCK_THRESHOLD) * 100));
  const color = "#34d399";

  if (examMode) return <div style={{ width: 200, height: 130 }} />;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", width: 200 }}>
      {/* ラベル */}
      <div
        style={{
          padding: "3px 10px",
          borderRadius: "20px",
          background: isUnlocked ? "rgba(52,211,153,0.15)" : "rgba(9,11,20,0.9)",
          border: `1px solid ${isUnlocked ? "rgba(52,211,153,0.45)" : "#1e293b"}`,
          color: isUnlocked ? color : "#334155",
          fontSize: "9px", fontWeight: "700", textAlign: "center",
          backdropFilter: "blur(6px)", whiteSpace: "nowrap",
        }}
      >
        {isUnlocked
          ? "✨ 模擬試験 解放！"
          : `あと ${AP_BOSS_UNLOCK_THRESHOLD - masteredCount} 個で解放`}
      </div>

      {/* ボタン行 */}
      <div style={{ display: "flex", gap: "8px" }}>
        {/* 午前試験 */}
        <button
          onClick={isUnlocked ? () => startExam("gozen") : undefined}
          style={{
            width: "88px", height: "80px", borderRadius: "50%",
            cursor: isUnlocked ? "pointer" : "default",
            border: isUnlocked ? `2.5px solid ${color}bb` : "2px solid #334155",
            background: isUnlocked
              ? `radial-gradient(circle at 35% 30%, #d1fae5, ${color} 55%, #065f46)`
              : "radial-gradient(circle at 35% 30%, #1e2d45, #0f172a)",
            boxShadow: isUnlocked
              ? `0 0 20px ${color}55, inset 0 -4px 12px rgba(0,0,0,0.4)`
              : "inset 0 -4px 12px rgba(0,0,0,0.8)",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: "2px",
            position: "relative", overflow: "hidden",
            animation: isUnlocked ? "pulse-exam 2.4s ease-in-out infinite" : undefined,
          }}
          onMouseEnter={(e) => { if (isUnlocked) e.currentTarget.style.transform = "scale(1.08)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
        >
          {isUnlocked ? (
            <>
              <span style={{ fontSize: "20px" }}>📝</span>
              <span style={{ fontSize: "7px", color: "#ecfdf5", fontWeight: "800", textAlign: "center", lineHeight: 1.3 }}>
                午前<br />80問
              </span>
            </>
          ) : (
            <>
              <span style={{ fontSize: "18px" }}>🔒</span>
              <span style={{ fontSize: "9px", color: "#64748b", fontWeight: "700" }}>
                {masteredCount}/{AP_BOSS_UNLOCK_THRESHOLD}
              </span>
            </>
          )}
        </button>

        {/* 午後試験 */}
        <button
          onClick={isUnlocked ? () => startExam("gogo") : undefined}
          style={{
            width: "88px", height: "80px", borderRadius: "50%",
            cursor: isUnlocked ? "pointer" : "default",
            border: isUnlocked ? `2.5px solid #6ee7b7bb` : "2px solid #334155",
            background: isUnlocked
              ? "radial-gradient(circle at 35% 30%, #ecfdf5, #6ee7b7 55%, #064e3b)"
              : "radial-gradient(circle at 35% 30%, #1e2d45, #0f172a)",
            boxShadow: isUnlocked
              ? "0 0 20px rgba(110,231,183,0.4), inset 0 -4px 12px rgba(0,0,0,0.4)"
              : "inset 0 -4px 12px rgba(0,0,0,0.8)",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: "2px",
            position: "relative", overflow: "hidden",
            animation: isUnlocked ? "pulse-exam 2.4s ease-in-out infinite 0.6s" : undefined,
          }}
          onMouseEnter={(e) => { if (isUnlocked) e.currentTarget.style.transform = "scale(1.08)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
        >
          {isUnlocked ? (
            <>
              <span style={{ fontSize: "20px" }}>📋</span>
              <span style={{ fontSize: "7px", color: "#ecfdf5", fontWeight: "800", textAlign: "center", lineHeight: 1.3 }}>
                午後<br />20問選択
              </span>
            </>
          ) : (
            <>
              <span style={{ fontSize: "18px" }}>🔒</span>
              <span style={{ fontSize: "9px", color: "#64748b", fontWeight: "700" }}>
                {masteredCount}/{AP_BOSS_UNLOCK_THRESHOLD}
              </span>
            </>
          )}
        </button>
      </div>

      {/* プログレスバー */}
      {!isUnlocked && (
        <div style={{ width: "100px", height: "4px", borderRadius: "2px", background: "#1e293b", overflow: "hidden" }}>
          <div
            style={{
              width: `${pct}%`, height: "100%", borderRadius: "2px",
              background: "linear-gradient(90deg, #059669, #34d399)",
              transition: "width 0.6s ease-out",
            }}
          />
        </div>
      )}

      {/* 不合格バッジ */}
      {examCompleted && !examPassed && isUnlocked && (
        <div style={{
          fontSize: "9px", color: "#ef4444",
          background: "rgba(239,68,68,0.1)",
          border: "1px solid rgba(239,68,68,0.3)",
          borderRadius: "10px", padding: "2px 8px",
        }}>
          前回不合格
        </div>
      )}
    </div>
  );
}

export default memo(APExamNode);
