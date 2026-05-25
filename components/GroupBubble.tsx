"use client";

import { NodeProps } from "@xyflow/react";

interface GroupBubbleData {
  label: string;
  radius: number;
  fillColor: string;
  strokeColor: string;
  [key: string]: unknown;
}

/**
 * ReactFlow カスタムノード: 大きな半透明バブル円
 * ITパスポートクラスタ / 基本情報技術者クラスタ の背景に配置
 */
export default function GroupBubble({ data }: NodeProps) {
  const d = data as GroupBubbleData;
  const size = d.radius * 2;

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: d.fillColor,
        border: `1.5px solid ${d.strokeColor}`,
        boxShadow: `0 0 60px ${d.fillColor}, inset 0 0 80px ${d.fillColor}`,
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
          color: d.strokeColor,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          opacity: 0.75,
          pointerEvents: "none",
          userSelect: "none",
          textShadow: `0 0 20px ${d.strokeColor}`,
        }}
      >
        {d.label}
      </span>
    </div>
  );
}
