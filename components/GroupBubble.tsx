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
 * ReactFlow カスタムノード: 大きな半透明バブル円（ラベルなし・完全非インタラクティブ）
 * ラベルは LabelNode として別ノードで管理（zIndex: 10）
 */
export default function GroupBubble({ data }: NodeProps) {
  const d = data as GroupBubbleData;
  const size = d.radius * 2;

  const borderColor = d.isCompleted ? "rgba(251,191,36,0.9)" : d.strokeColor;
  const borderWidth = d.isCompleted ? "2.5px" : "1.5px";
  const boxShadow = d.isCompleted
    ? "0 0 60px rgba(251,191,36,0.28), 0 0 120px rgba(251,191,36,0.12), inset 0 0 80px rgba(251,191,36,0.05)"
    : `0 0 60px ${d.fillColor}, inset 0 0 80px ${d.fillColor}`;
  const bgColor = d.isCompleted ? "rgba(251,191,36,0.04)" : d.fillColor;

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
      }}
    />
  );
}
