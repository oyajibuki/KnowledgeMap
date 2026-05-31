"use client";

import { useCallback, useMemo, useEffect, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Node,
  Edge,
  NodeMouseHandler,
  BackgroundVariant,
  useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useGameStore } from "@/lib/store";
import { useAPStore } from "@/lib/ap-store";
import { connections, initialNodes } from "@/lib/data";
import { apNodes, apConnections, crossExamLinks } from "@/lib/ap-data";
import { KnowledgeNode } from "@/types";
import SphereNode from "./SphereNode";
import GroupBubble from "./GroupBubble";
import ExamNode from "./ExamNode";
import FEExamNode from "./FEExamNode";
import APExamNode from "./APExamNode";
import LabelNode from "./LabelNode";
import { ExamInfoPopup, EXAM_INFO } from "./ExamInfoPopup";

const nodeTypes = {
  sphere: SphereNode,
  groupBubble: GroupBubble,
  examNode: ExamNode,
  apExamNode: APExamNode,
  feExamNode: FEExamNode,
  labelNode: LabelNode,
};

/* ──────────────────────────────────────────
   グループバブル設定

   Venn図レイアウト:
   ITP: 中心 (700,700) 半径950 — 薄い黄色
   FE:  中心 (1600,700) 半径1000 — 薄いインディゴ
   ※ 二つが x≈700〜1650 で大きく重なる
      重なり部分に binary・cpu・メモリ等の共通知識が入る
   ※ FE 固有ノード (fe-*) は x≈1800 以降に配置
────────────────────────────────────────── */
const ITP_CX = 700,  ITP_CY = 700,  ITP_R = 950;
const FE_CX  = 1600, FE_CY  = 700,  FE_R  = 1200;
const AP_CX  = 3300, AP_CY  = 700,  AP_R  = 1400; // APはFEより大きいバブル

/* 過去問ノード（ITP バブル内・下部）*/
const EXAM_NODE: Node = {
  id: "__exam",
  type: "examNode",
  position: { x: ITP_CX - 45, y: 1430 }, // ITP 下部に配置（中心 y=700+730≈1430 ← r=950 内）
  data: {},
  draggable: false,
  selectable: false,
  focusable: false,
  zIndex: 5,
};

/* FE 模擬試験ノード（FE バブル内・下部）*/
const FE_EXAM_NODE: Node = {
  id: "__fe-exam",
  type: "feExamNode",
  position: { x: FE_CX - 50, y: 1750 }, // FE 下部（FE_CY+1050=1750 ← r=1200 内）
  data: {},
  draggable: false,
  selectable: false,
  focusable: false,
  zIndex: 5,
};

/* AP 模擬試験ノード（AP バブル内・下部）*/
const AP_EXAM_NODE: Node = {
  id: "__ap-exam",
  type: "apExamNode",
  position: { x: AP_CX - 100, y: AP_CY + 1200 },
  data: {},
  draggable: false,
  selectable: false,
  focusable: false,
  zIndex: 5,
};

/* ──────────────────────────────────────────
   バブルラベルノード（独立・zIndex:10）
   GroupBubble(zIndex:-10) より必ず上に来るため
   クリックが確実にラベルに届く。
   ITP ラベルは FE バブル(x:400〜2800) より左側 x<400 に配置して
   FE Wrapper との重なりによる誤クリックを完全回避。
────────────────────────────────────────── */
const ITP_LABEL_NODE: Node = {
  id: "__label-itp",
  type: "labelNode",
  // ITP バブル上部・中央寄り（zIndex:10 で FE wrapper より上に来るので重なりは問題なし）
  position: { x: ITP_CX - 75, y: ITP_CY - ITP_R + 18 }, // x=625, y=-232
  data: { label: "ITパスポート" },
  draggable: false,
  selectable: false,
  focusable: false,
  zIndex: 10,
};

const FE_LABEL_NODE: Node = {
  id: "__label-fe",
  type: "labelNode",
  // FE バブル上部・右寄り（FE 固有エリア）に配置
  position: { x: FE_CX + 60, y: FE_CY - FE_R + 18 }, // x=1660, y=-482
  data: { label: "基本情報技術者" },
  draggable: false,
  selectable: false,
  focusable: false,
  zIndex: 10,
};

const AP_LABEL_NODE: Node = {
  id: "__label-ap",
  type: "labelNode",
  position: { x: AP_CX + 100, y: AP_CY - AP_R + 18 },
  data: { label: "応用情報技術者" },
  draggable: false,
  selectable: false,
  focusable: false,
  zIndex: 10,
};

function buildGroupBubbleNodes(galaxyCompleted: boolean, apExamCompleted: boolean): Node[] {
  return [
    {
      id: "__group-itp",
      type: "groupBubble",
      position: { x: ITP_CX - ITP_R, y: ITP_CY - ITP_R },
      data: {
        label: "ITパスポート",
        radius: ITP_R,
        fillColor: "rgba(251,191,36,0.035)",
        strokeColor: "rgba(251,191,36,0.28)",
        isCompleted: galaxyCompleted,
      },
      draggable: false, selectable: false, focusable: false, zIndex: -10,
    },
    {
      id: "__group-fe",
      type: "groupBubble",
      position: { x: FE_CX - FE_R, y: FE_CY - FE_R },
      data: {
        label: "基本情報技術者",
        radius: FE_R,
        fillColor: "rgba(129,140,248,0.04)",
        strokeColor: "rgba(129,140,248,0.28)",
      },
      draggable: false, selectable: false, focusable: false, zIndex: -10,
    },
    {
      id: "__group-ap",
      type: "groupBubble",
      position: { x: AP_CX - AP_R, y: AP_CY - AP_R },
      data: {
        label: "応用情報技術者",
        radius: AP_R,
        fillColor: "rgba(52,211,153,0.03)",
        strokeColor: "rgba(52,211,153,0.28)",
        isCompleted: apExamCompleted,
      },
      draggable: false, selectable: false, focusable: false, zIndex: -10,
    },
  ];
}

function makeFlowNode(kn: KnowledgeNode, selectedNodeId: string | null, bouncing: boolean): Node {
  return {
    id: kn.id,
    type: "sphere",
    position: kn.position,
    data: {
      label: kn.title,
      status: kn.status,
      isExamFrequent: kn.isExamFrequent,
      isCenter: kn.id === "binary",
      selected: selectedNodeId === kn.id,
      bouncing,
    },
    draggable: true,
    zIndex: 1,
  };
}

// AP ノード：球体サイズを 68px（ITP:56px より大きく、中心:80px より小さい）
function makeAPFlowNode(kn: KnowledgeNode, selectedNodeId: string | null, bouncing: boolean): Node {
  return {
    id: kn.id,
    type: "sphere",
    position: kn.position,
    data: {
      label: kn.title,
      status: kn.status,
      isExamFrequent: kn.isExamFrequent,
      isCenter: kn.id === "ap-math",
      selected: selectedNodeId === kn.id,
      bouncing,
      size: kn.id === "ap-math" ? 88 : 68, // AP 中心:88px, 通常:68px
    },
    draggable: true,
    zIndex: 1,
  };
}

export default function KnowledgeMap() {
  const { nodes: znodes, selectedNodeId, setSelectedNode, galaxyCompleted } = useGameStore();
  const { nodes: apZnodes, selectedNodeId: apSelectedNodeId, setSelectedNode: apSetSelectedNode, examCompleted: apExamCompleted } = useAPStore();
  const [droppedId, setDroppedId] = useState<string | null>(null);
  const [activeExamLabel, setActiveExamLabel] = useState<string | null>(null);

  /* ──────────────────────────
     ReactFlow ノード初期化
     （マウント時に1度だけ計算）
  ────────────────────────── */
  const [rfNodes, setRfNodes, onNodesChange] = useNodesState([
    ...buildGroupBubbleNodes(galaxyCompleted, apExamCompleted),
    EXAM_NODE,
    FE_EXAM_NODE,
    AP_EXAM_NODE,
    ITP_LABEL_NODE,
    FE_LABEL_NODE,
    AP_LABEL_NODE,
    ...znodes.map((kn) => makeFlowNode(kn, null, false)),
    ...apZnodes.map((kn) => makeAPFlowNode(kn, null, false)),
  ]);

  /* ──────────────────────────
     Zustand のステータス/選択変更を
     ReactFlow ノードへ反映（位置は変えない）
  ────────────────────────── */
  useEffect(() => {
    setRfNodes((prev) =>
      prev.map((n) => {
        // バブル完了グロー更新
        if (n.id === "__group-itp") return { ...n, data: { ...n.data, isCompleted: galaxyCompleted } };
        if (n.id === "__group-ap")  return { ...n, data: { ...n.data, isCompleted: apExamCompleted } };
        if (n.type !== "sphere") return n;

        // ITP/FE ノード
        const kn = znodes.find((k) => k.id === n.id);
        if (kn) {
          return {
            ...n,
            data: {
              ...n.data,
              status: kn.status,
              selected: selectedNodeId === n.id,
              bouncing: droppedId === n.id,
            },
          };
        }
        // AP ノード
        const apKn = apZnodes.find((k) => k.id === n.id);
        if (apKn) {
          return {
            ...n,
            data: {
              ...n.data,
              status: apKn.status,
              selected: apSelectedNodeId === n.id,
              bouncing: droppedId === n.id,
            },
          };
        }
        return n;
      })
    );
  }, [znodes, selectedNodeId, apZnodes, apSelectedNodeId, droppedId, setRfNodes, galaxyCompleted, apExamCompleted]);

  /* ──────────────────────────
     ドロップ時にバウンス演出
  ────────────────────────── */
  const onNodeDragStop: NodeMouseHandler = useCallback(
    (_, node) => {
      if (node.type !== "sphere") return;
      setDroppedId(node.id);
      setTimeout(() => setDroppedId(null), 700);
    },
    []
  );

  /* ──────────────────────────
     位置リセット（全ノードを初期位置へ）
  ────────────────────────── */
  const handleReset = useCallback(() => {
    setRfNodes((prev) =>
      prev.map((n) => {
        if (n.type !== "sphere") return n;
        const orig = znodes.find((k) => k.id === n.id);
        if (!orig) return n;
        return { ...n, position: orig.position };
      })
    );
  }, [znodes, setRfNodes]);

  /* ──────────────────────────
     エッジ（接続線）
  ────────────────────────── */
  const flowEdges: Edge[] = useMemo(() => {
    const allNodes = [...znodes, ...initialNodes.filter((n) => !znodes.find((z) => z.id === n.id))];

    // ITP/FE 内部エッジ
    const itpEdges = connections.map((c) => {
      const fromNode = allNodes.find((n) => n.id === c.fromNodeId);
      const toNode   = allNodes.find((n) => n.id === c.toNodeId);
      const fromUnlocked = fromNode?.status !== "locked";
      const toUnlocked   = toNode?.status   !== "locked";
      const bothUnlocked = fromUnlocked && toUnlocked;
      const eitherUnlocked = fromUnlocked || toUnlocked;
      const isCross = (fromNode?.topicId === "fe") !== (toNode?.topicId === "fe");
      const baseColor = isCross ? "#a78bfa" : c.relationType === "dependency" ? "#06b6d4" : "#818cf8";
      return {
        id: `${c.fromNodeId}-${c.toNodeId}`,
        source: c.fromNodeId, target: c.toNodeId, type: "straight",
        animated: bothUnlocked,
        style: {
          stroke: eitherUnlocked ? baseColor : "#1e3a4a",
          strokeWidth: bothUnlocked ? (isCross ? 1.5 : 3) : eitherUnlocked ? 1.5 : 1,
          opacity: bothUnlocked ? (isCross ? 0.55 : 1) : eitherUnlocked ? 0.4 : 0.12,
          filter: bothUnlocked && !isCross ? `drop-shadow(0 0 4px ${baseColor})` : "none",
          strokeDasharray: isCross ? "5 4" : undefined,
        },
      };
    });

    // AP 内部エッジ
    const apEdges = apConnections.map((c) => {
      const fromNode = apZnodes.find((n) => n.id === c.fromNodeId);
      const toNode   = apZnodes.find((n) => n.id === c.toNodeId);
      const bothUnlocked = fromNode?.status !== "locked" && toNode?.status !== "locked";
      const eitherUnlocked = fromNode?.status !== "locked" || toNode?.status !== "locked";
      const baseColor = c.relationType === "dependency" ? "#34d399" : "#6ee7b7";
      return {
        id: `ap-${c.fromNodeId}-${c.toNodeId}`,
        source: c.fromNodeId, target: c.toNodeId, type: "straight",
        animated: bothUnlocked,
        style: {
          stroke: eitherUnlocked ? baseColor : "#1a3a2a",
          strokeWidth: bothUnlocked ? 2.5 : eitherUnlocked ? 1.5 : 1,
          opacity: bothUnlocked ? 0.9 : eitherUnlocked ? 0.4 : 0.12,
          filter: bothUnlocked ? `drop-shadow(0 0 4px ${baseColor})` : "none",
          strokeDasharray: c.relationType === "related" ? "5 4" : undefined,
        },
      };
    });

    // クロスエグザムリンク（ITP/FE ↔ AP の共通知識：細い緑破線）
    const crossEdges = crossExamLinks.map((link) => {
      const fromItpNode = allNodes.find((n) => n.id === link.from);
      const toApNode    = apZnodes.find((n) => n.id === link.to);
      const bothVisible = fromItpNode?.status !== "locked" && toApNode?.status !== "locked";
      return {
        id: `cross-${link.from}-${link.to}`,
        source: link.from, target: link.to, type: "straight",
        animated: false,
        style: {
          stroke: "#34d399",
          strokeWidth: 1,
          opacity: bothVisible ? 0.3 : 0.06,
          strokeDasharray: "6 6",
        },
      };
    });

    return [...itpEdges, ...apEdges, ...crossEdges];
  }, [znodes, apZnodes]);

  /* ──────────────────────────
     クリックハンドラ
  ────────────────────────── */
  const onNodeClick: NodeMouseHandler = useCallback(
    (_, node) => {
      // ラベルノードのクリック → 資格情報ポップアップ
      if (node.type === "labelNode") {
        const label = node.data.label as string;
        if (EXAM_INFO[label]) setActiveExamLabel(label);
        return;
      }
      if (node.type !== "sphere") return;

      // AP ノードの判定（IDが "ap-" で始まる）
      if (node.id.startsWith("ap-")) {
        const apKn = apZnodes.find((n) => n.id === node.id);
        if (apKn && apKn.status !== "locked") {
          setSelectedNode(null);          // ITP 選択を解除
          apSetSelectedNode(node.id);
        }
        return;
      }

      // ITP/FE ノード
      const allNodes = [...znodes, ...initialNodes.filter((n) => !znodes.find((z) => z.id === n.id))];
      const kn = allNodes.find((n) => n.id === node.id);
      if (kn && kn.status !== "locked") {
        apSetSelectedNode(null);          // AP 選択を解除
        setSelectedNode(node.id);
      }
    },
    [znodes, apZnodes, setSelectedNode, apSetSelectedNode]
  );

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, [setSelectedNode]);

  return (
    <div className="w-full h-full relative">
      <ReactFlow
        nodes={rfNodes}
        edges={flowEdges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onNodeClick={onNodeClick}
        onNodeDragStop={onNodeDragStop}
        onPaneClick={onPaneClick}
        fitView
        fitViewOptions={{ padding: 0.08 }}
        minZoom={0.1}
        maxZoom={2.5}
        style={{ background: "transparent" }}
        proOptions={{ hideAttribution: true }}
        nodesDraggable
        elementsSelectable={false}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={48}
          size={1.2}
          color="#1e2d40"
        />
        <Controls
          style={{
            background: "rgba(9,11,20,0.8)",
            border: "1px solid #1e293b",
            borderRadius: "10px",
            backdropFilter: "blur(8px)",
          }}
        />
      </ReactFlow>

      {/* 資格情報ポップアップ */}
      {activeExamLabel && (
        <ExamInfoPopup
          label={activeExamLabel}
          onClose={() => setActiveExamLabel(null)}
        />
      )}

      {/* 配置リセットボタン */}
      <button
        onClick={handleReset}
        title="全ノードを初期位置に戻す"
        style={{
          position: "absolute",
          bottom: "16px",
          right: "16px",
          zIndex: 20,
          padding: "7px 14px",
          borderRadius: "12px",
          background: "rgba(9,11,20,0.85)",
          border: "1px solid #334155",
          color: "#64748b",
          fontSize: "11px",
          fontWeight: "700",
          cursor: "pointer",
          backdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          gap: "5px",
          transition: "all 0.15s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "#94a3b8";
          e.currentTarget.style.borderColor = "#475569";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "#64748b";
          e.currentTarget.style.borderColor = "#334155";
        }}
      >
        🔄 配置リセット
      </button>
    </div>
  );
}
