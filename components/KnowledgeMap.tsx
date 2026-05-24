"use client";

import { useCallback, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Node,
  Edge,
  NodeMouseHandler,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useGameStore } from "@/lib/store";
import { connections } from "@/lib/data";
import { KnowledgeNode } from "@/types";
import SphereNode from "./SphereNode";

const nodeTypes = { sphere: SphereNode };

export default function KnowledgeMap() {
  const { nodes: knowledgeNodes, selectedNodeId, setSelectedNode } = useGameStore();

  const flowNodes: Node[] = useMemo(
    () =>
      knowledgeNodes.map((kn: KnowledgeNode) => ({
        id: kn.id,
        type: "sphere",
        position: kn.position,
        data: {
          label: kn.title,
          status: kn.status,
          isExamFrequent: kn.isExamFrequent,
          isCenter: kn.id === "binary",
          selected: selectedNodeId === kn.id,
        },
        draggable: false,
      })),
    [knowledgeNodes, selectedNodeId]
  );

  const flowEdges: Edge[] = useMemo(
    () =>
      connections.map((c) => {
        const fromNode = knowledgeNodes.find((n) => n.id === c.fromNodeId);
        const toNode = knowledgeNodes.find((n) => n.id === c.toNodeId);

        const fromUnlocked = fromNode?.status !== "locked";
        const toUnlocked = toNode?.status !== "locked";
        const bothUnlocked = fromUnlocked && toUnlocked;
        const eitherUnlocked = fromUnlocked || toUnlocked;

        // 接続ライン色: dependency=シアン系、related=紫系
        const baseColor = c.relationType === "dependency" ? "#06b6d4" : "#818cf8";
        const dimColor = "#1e3a4a";

        return {
          id: `${c.fromNodeId}-${c.toNodeId}`,
          source: c.fromNodeId,
          target: c.toNodeId,
          type: "straight",
          animated: bothUnlocked,
          style: {
            stroke: eitherUnlocked ? baseColor : dimColor,
            strokeWidth: bothUnlocked ? 3 : eitherUnlocked ? 2 : 1,
            opacity: bothUnlocked ? 1 : eitherUnlocked ? 0.5 : 0.15,
            filter: bothUnlocked ? `drop-shadow(0 0 4px ${baseColor})` : "none",
          },
        };
      }),
    [knowledgeNodes]
  );

  const onNodeClick: NodeMouseHandler = useCallback(
    (_, node) => {
      const kn = knowledgeNodes.find((n) => n.id === node.id);
      if (kn && kn.status !== "locked") {
        setSelectedNode(node.id);
      }
    },
    [knowledgeNodes, setSelectedNode]
  );

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, [setSelectedNode]);

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        fitView
        fitViewOptions={{ padding: 0.12 }}
        minZoom={0.2}
        maxZoom={2.5}
        style={{ background: "transparent" }}
        proOptions={{ hideAttribution: true }}
      >
        {/* 星空っぽいドットグリッド */}
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
    </div>
  );
}
