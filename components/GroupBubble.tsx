"use client";

import { NodeProps } from "@xyflow/react";

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
 */
export default function GroupBubble({ data }: NodeProps) {
  const d = data as GroupBubbleData;
  const size = d.radius * 2;

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
      {/* グループラベル */}
      <span
        style={{
          fontSize: "13px",
          fontWeight: "800",
          color: labelColor,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          opacity: 0.78,
          pointerEvents: "none",
          userSelect: "none",
          textShadow: labelShadow,
        }}
      >
        {d.label}
        {d.isCompleted && " ✓"}
      </span>
    </div>
  );
}
