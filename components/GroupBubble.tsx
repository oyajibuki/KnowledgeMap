"use client";

import { NodeProps } from "@xyflow/react";
import { EXAM_INFO } from "./ExamInfoPopup";

interface GroupBubbleData {
  label: string;
  radius: number;
  fillColor: string;
  strokeColor: string;
  isCompleted?: boolean;
  [key: string]: unknown;
}

/**
 * ReactFlow カスタムノード: 大きな半透明バブル円
 * ITパスポートクラスタ / 基本情報技術者クラスタ の背景に配置
 * isCompleted=true のとき ITP バブルが金色にグロー
 *
 * クリック処理は KnowledgeMap.tsx の onNodeClick で行う
 * （ReactFlow の .react-flow__node は pointer-events: all なので確実に捕捉できる）
 */
export default function GroupBubble({ data }: NodeProps) {
  const d = data as GroupBubbleData;
  const size = d.radius * 2;
  const hasInfo = !!EXAM_INFO[d.label];

  const borderColor = d.isCompleted ? "rgba(251,191,36,0.9)" : d.strokeColor;
  const borderWidth = d.isCompleted ? "2.5px" : "1.5px";
  const boxShadow = d.isCompleted
    ? "0 0 60px rgba(251,191,36,0.28), 0 0 120px rgba(251,191,36,0.12), inset 0 0 80px rgba(251,191,36,0.05)"
    : `0 0 60px ${d.fillColor}, inset 0 0 80px ${d.fillColor}`;
  const bgColor = d.isCompleted ? "rgba(251,191,36,0.04)" : d.fillColor;
  const labelColor = d.isCompleted ? "rgba(251,191,36,0.9)" : d.strokeColor;
  const labelShadow = d.isCompleted
    ? "0 0 20px rgba(251,191,36,0.5)"
    : `0 0 20px ${d.strokeColor}`;

  return (
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
      {/* グループラベル — クリックは ReactFlow wrapper が捕捉 */}
      <span
        style={{
          fontSize: "19px",
          fontWeight: "800",
          color: labelColor,
          letterSpacing: "0.12em",
          opacity: 0.88,
          pointerEvents: "none",
          userSelect: "none",
          textShadow: labelShadow,
          padding: "4px 10px",
          cursor: hasInfo ? "pointer" : "default",
        }}
      >
        {d.label}
        {d.isCompleted && " ✓"}
      </span>
    </div>
  );
}
