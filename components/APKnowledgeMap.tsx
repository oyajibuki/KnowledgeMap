"use client";

import { useCallback, useEffect, useState } from "react";
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
import { useAPStore } from "@/lib/ap-store";
import { apConnections } from "@/lib/ap-data";
import { KnowledgeNode } from "@/types";
import SphereNode from "./SphereNode";
import GroupBubble from "./GroupBubble";

const nodeTypes = {
  sphere: SphereNode,
  groupBubble: GroupBubble,
};

const AP_CX = 700, AP_CY = 700, AP_R = 1050;

function buildGroupNode(): Node {
  return {
    id: "__group-ap",
    type: "groupBubble",
    position: { x: AP_CX - AP_R, y: AP_CY - AP_R },
    data: {
      label: "応用情報技術者",
      radius: AP_R,
      fillColor: "rgba(52,211,153,0.03)",
      strokeColor: "rgba(52,211,153,0.28)",
    },
    draggable: false,
    selectable: false,
    focusable: false,
    zIndex: -10,
  };
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
      isCenter: kn.id === "ap-math",
      selected: selectedNodeId === kn.id,
      bouncing,
    },
    draggable: true,
    zIndex: 1,
  };
}

function makeEdges(): Edge[] {
  return apConnections.map((c) => ({
    id: `${c.fromNodeId}-${c.toNodeId}`,
    source: c.fromNodeId,
    target: c.toNodeId,
    style: {
      stroke: c.relationType === "dependency"
        ? "rgba(6,182,212,0.5)"
        : "rgba(100,116,139,0.35)",
      strokeWidth: c.relationType === "dependency" ? 2 : 1.5,
      strokeDasharray: c.relationType === "related" ? "5 4" : undefined,
    },
    animated: false,
  }));
}

export default function APKnowledgeMap() {
  const { nodes: znodes, selectedNodeId, setSelectedNode, examCompleted } = useAPStore();
  const [droppedId, setDroppedId] = useState<string | null>(null);

  const [rfNodes, setRfNodes, onNodesChange] = useNodesState([
    buildGroupNode(),
    ...znodes.map((kn) => makeFlowNode(kn, null, false)),
  ]);

  const edges = makeEdges();

  useEffect(() => {
    setRfNodes((prev) =>
      prev.map((n) => {
        if (n.type !== "sphere") return n;
        const kn = znodes.find((k) => k.id === n.id);
        if (!kn) return n;
        return {
          ...n,
          data: {
            ...n.data,
            status: kn.status,
            selected: selectedNodeId === n.id,
            bouncing: droppedId === n.id,
          },
        };
      })
    );
  }, [znodes, selectedNodeId, droppedId, setRfNodes]);

  const onNodeDragStop: NodeMouseHandler = useCallback((_, node) => {
    if (node.type !== "sphere") return;
    setDroppedId(node.id);
    setTimeout(() => setDroppedId(null), 700);
  }, []);

  const onNodeClick: NodeMouseHandler = useCallback(
    (_, node) => {
      if (node.type !== "sphere") return;
      setSelectedNode(node.id);
    },
    [setSelectedNode]
  );

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ReactFlow
        nodes={rfNodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onNodeClick={onNodeClick}
        onNodeDragStop={onNodeDragStop}
        nodeTypes={nodeTypes}
        defaultViewport={{ x: -200, y: -100, zoom: 0.55 }}
        minZoom={0.2}
        maxZoom={2}
        fitViewOptions={{ padding: 0.15 }}
      >
        <Background variant={BackgroundVariant.Dots} gap={40} size={1} color="rgba(255,255,255,0.04)" />
        <Controls
          style={{
            background: "rgba(10,22,40,0.85)",
            border: "1px solid rgba(6,182,212,0.2)",
            borderRadius: 8,
          }}
        />
      </ReactFlow>

      {/* 試験完了バッジ */}
      {examCompleted && (
        <div
          style={{
            position: "absolute",
            bottom: 24,
            right: 24,
            background: "rgba(52,211,153,0.15)",
            border: "1px solid rgba(52,211,153,0.4)",
            borderRadius: 12,
            padding: "8px 16px",
            color: "#6ee7b7",
            fontSize: 13,
            fontWeight: 600,
            backdropFilter: "blur(8px)",
          }}
        >
          ✓ 模擬試験クリア済
        </div>
      )}
    </div>
  );
}
