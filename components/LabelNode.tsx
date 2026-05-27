"use client";

import { memo } from "react";
import { NodeProps } from "@xyflow/react";
import { useGameStore } from "@/lib/store";
import { EXAM_INFO } from "./ExamInfoPopup";

/**
 * バブルラベル専用ノード
 * - zIndex: 10 で GroupBubble (zIndex: -10) より必ず上に来る
 * - 文字サイズだけがクリック領域 → ポインターカーソル表示
 * - クリックは KnowledgeMap.tsx の onNodeClick で捕捉
 */
function LabelNode({ data }: NodeProps) {
  const label = data.label as string;
  const { galaxyCompleted } = useGameStore();
  const info = EXAM_INFO[label];

  const isItpLabel = label === "ITパスポート";
  const isCompleted = isItpLabel && galaxyCompleted;

  const color = isCompleted ? "rgba(251,191,36,0.92)" : (info?.color ?? "#888");
  const shadow = isCompleted
    ? "0 0 20px rgba(251,191,36,0.55)"
    : info
    ? `0 0 20px ${info.color}88`
    : "none";

  return (
    // nodrag: ドラッグ開始してもノード移動しない（draggable:false と合わせて確実に）
    // nopan は付けない → ラベル上からでもキャンバスパン可能
    <div
      className="nodrag"
      style={{
        fontSize: "19px",
        fontWeight: "800",
        color,
        letterSpacing: "0.12em",
        textShadow: shadow,
        userSelect: "none",
        whiteSpace: "nowrap",
        cursor: "pointer",
        padding: "4px 10px",
        lineHeight: 1.2,
        // hover 視覚フィードバックは CSS で付けられないためインラインで
        // (onMouseEnter / onMouseLeave で対応)
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.opacity = "1";
        e.currentTarget.style.textShadow = `0 0 28px ${color}, ${shadow}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = "0.88";
        e.currentTarget.style.textShadow = shadow;
      }}
    >
      {label}
      {isCompleted && " ✓"}
    </div>
  );
}

export default memo(LabelNode);
