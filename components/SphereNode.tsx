"use client";

import { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { NodeStatus } from "@/types";

interface SphereNodeData {
  label: string;
  status: NodeStatus;
  isExamFrequent: boolean;
  isCenter: boolean;
  selected: boolean;
  [key: string]: unknown;
}

const SPHERE_CONFIG: Record<NodeStatus, {
  outerRing: string;
  innerGlow: string;
  sphereGrad: string;
  textColor: string;
  ringOpacity: number;
}> = {
  locked: {
    outerRing: "#2a3040",
    innerGlow: "none",
    sphereGrad: "radial-gradient(circle at 35% 30%, #3a4155, #1a2030, #0d1020)",
    textColor: "#3a4560",
    ringOpacity: 0.3,
  },
  viewed: {
    outerRing: "#0ea5e9",
    innerGlow: "0 0 20px #38bdf8, 0 0 40px #0284c7",
    sphereGrad: "radial-gradient(circle at 35% 30%, #bae6fd, #38bdf8, #0369a1, #082f49)",
    textColor: "#7dd3fc",
    ringOpacity: 0.9,
  },
  mastered: {
    outerRing: "#a855f7",
    innerGlow: "0 0 24px #c084fc, 0 0 48px #9333ea, 0 0 72px #6b21a8",
    sphereGrad: "radial-gradient(circle at 35% 30%, #f3e8ff, #d8b4fe, #9333ea, #3b0764)",
    textColor: "#e9d5ff",
    ringOpacity: 1,
  },
};

function SphereNode({ data }: NodeProps) {
  const d = data as SphereNodeData;
  const cfg = SPHERE_CONFIG[d.status];
  const isLocked = d.status === "locked";
  const size = d.isCenter ? 80 : 56;
  const ringSize = size + 14;

  return (
    <div
      className="flex flex-col items-center select-none"
      style={{ width: 90, cursor: isLocked ? "not-allowed" : "pointer" }}
    >
      {/* ハンドルを球体中心に固定 → straight エッジがノード中心から描画される */}
      <Handle
        type="target"
        position={Position.Top}
        style={{ opacity: 0, width: 0, height: 0, top: Math.round(ringSize / 2), left: 45 }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ opacity: 0, width: 0, height: 0, top: Math.round(ringSize / 2), left: 45 }}
      />

      <div className="relative flex items-center justify-center" style={{ width: ringSize, height: ringSize }}>

        {/* 試験頻出：金色の回転リング */}
        {d.isExamFrequent && !isLocked && (
          <div
            className="absolute"
            style={{
              width: ringSize + 12,
              height: ringSize + 12,
              borderRadius: "50%",
              border: "1.5px solid transparent",
              borderTopColor: "#fbbf24",
              borderRightColor: "#f59e0b",
              animation: "spin-slow 4s linear infinite",
              boxShadow: "0 0 8px #fbbf24",
            }}
          />
        )}

        {/* 選択時：オレンジ外輪 */}
        {d.selected && (
          <div
            className="absolute"
            style={{
              width: ringSize + 18,
              height: ringSize + 18,
              borderRadius: "50%",
              border: "2px solid #f97316",
              boxShadow: "0 0 16px #f97316, 0 0 32px #ea580c",
              animation: "pulse-select 1.5s ease-in-out infinite",
            }}
          />
        )}

        {/* 外側リング（ベゼル） */}
        <div
          className="absolute inset-0"
          style={{
            borderRadius: "50%",
            border: `2px solid ${cfg.outerRing}`,
            boxShadow: cfg.innerGlow !== "none" ? cfg.innerGlow : undefined,
            opacity: cfg.ringOpacity,
          }}
        />

        {/* 内側リング（二重ベゼル） */}
        <div
          className="absolute"
          style={{
            width: size + 4,
            height: size + 4,
            borderRadius: "50%",
            border: `1px solid ${cfg.outerRing}`,
            opacity: cfg.ringOpacity * 0.4,
          }}
        />

        {/* メイン球体 */}
        <div
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
            background: cfg.sphereGrad,
            position: "relative",
            overflow: "hidden",
            boxShadow: cfg.innerGlow !== "none"
              ? `inset 0 -6px 16px rgba(0,0,0,0.5), ${cfg.innerGlow}`
              : "inset 0 -6px 16px rgba(0,0,0,0.9)",
          }}
        >
          {/* 光沢ハイライト（大） */}
          <div
            style={{
              position: "absolute",
              top: "8%",
              left: "12%",
              width: "38%",
              height: "28%",
              borderRadius: "50%",
              background: isLocked
                ? "rgba(255,255,255,0.05)"
                : "rgba(255,255,255,0.5)",
              transform: "rotate(-25deg)",
              filter: "blur(2px)",
            }}
          />
          {/* 光沢ハイライト（小） */}
          <div
            style={{
              position: "absolute",
              top: "16%",
              left: "58%",
              width: "14%",
              height: "10%",
              borderRadius: "50%",
              background: isLocked
                ? "rgba(255,255,255,0.03)"
                : "rgba(255,255,255,0.7)",
              filter: "blur(1px)",
            }}
          />

          {/* アイコン */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isLocked ? (
              <span style={{ fontSize: size > 60 ? 20 : 14, opacity: 0.35 }}>🔒</span>
            ) : d.status === "mastered" ? (
              <span
                style={{
                  fontSize: size > 60 ? 22 : 16,
                  filter: "drop-shadow(0 0 6px #fbbf24)",
                }}
              >
                ★
              </span>
            ) : d.isCenter ? (
              <span
                style={{
                  fontSize: 24,
                  color: "rgba(255,255,255,0.9)",
                  textShadow: "0 0 8px #38bdf8",
                }}
              >
                ◆
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {/* ラベル */}
      <div
        style={{
          marginTop: 6,
          fontSize: 10,
          fontWeight: 600,
          color: cfg.textColor,
          textAlign: "center",
          lineHeight: 1.3,
          maxWidth: 90,
          textShadow: isLocked ? "none" : `0 0 8px ${cfg.outerRing}80`,
          letterSpacing: "0.03em",
        }}
      >
        {d.label}
      </div>
    </div>
  );
}

export default memo(SphereNode);
