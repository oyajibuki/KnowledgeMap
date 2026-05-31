import { create } from "zustand";
import { persist } from "zustand/middleware";
import { KnowledgeNode, NodeStatus } from "@/types";
import { apNodes, apConnections } from "@/lib/ap-data";

interface APStore {
  nodes: KnowledgeNode[];
  selectedNodeId: string | null;
  showQuiz: boolean;
  examMode: boolean;
  examModeType: "gozen" | "gogo"; // 午前 or 午後
  examCompleted: boolean;
  examScore: number;
  examPassed: boolean;

  setSelectedNode: (id: string | null) => void;
  setShowQuiz: (show: boolean) => void;
  updateNodeStatus: (id: string, status: NodeStatus) => void;
  unlockAdjacentNodes: (id: string) => void;
  getNode: (id: string) => KnowledgeNode | undefined;
  startExam: (mode?: "gozen" | "gogo") => void;
  finishExam: (score: number) => void;
  closeExam: () => void;
}

const getInitialNodes = (): KnowledgeNode[] =>
  apNodes.map((node) =>
    node.id === "ap-math" ? { ...node, status: "viewed" as NodeStatus } : node
  );

export const useAPStore = create<APStore>()(
  persist(
    (set, get) => ({
      nodes: getInitialNodes(),
      selectedNodeId: null,
      showQuiz: false,
      examMode: false,
      examModeType: "gozen",
      examCompleted: false,
      examScore: 0,
      examPassed: false,

      setSelectedNode: (id) => set({ selectedNodeId: id, showQuiz: false }),
      setShowQuiz: (show) => set({ showQuiz: show }),

      updateNodeStatus: (id, status) =>
        set((state) => ({
          nodes: state.nodes.map((n) => (n.id === id ? { ...n, status } : n)),
        })),

      unlockAdjacentNodes: (id) => {
        const adjacentIds = apConnections
          .filter((c) => c.fromNodeId === id)
          .map((c) => c.toNodeId);
        set((state) => ({
          nodes: state.nodes.map((n) =>
            adjacentIds.includes(n.id) && n.status === "locked"
              ? { ...n, status: "viewed" as NodeStatus }
              : n
          ),
        }));
      },

      getNode: (id) => get().nodes.find((n) => n.id === id),

      startExam: (mode = "gozen") => set({ examMode: true, examModeType: mode }),

      finishExam: (score) =>
        set({
          examCompleted: true,
          examScore: score,
          examPassed: score >= 70,
        }),

      closeExam: () => set({ examMode: false }),
    }),
    {
      name: "knowledge-map-ap",
      partialize: (state) => ({
        nodes: state.nodes,
        examCompleted: state.examCompleted,
        examScore: state.examScore,
        examPassed: state.examPassed,
      }),
      merge: (persistedState: unknown, currentState: APStore) => {
        const persisted = persistedState as Partial<APStore> | null;
        if (!persisted?.nodes) return currentState;

        const savedIds = new Set(persisted.nodes.map((n) => n.id));
        const missingNodes = apNodes
          .filter((n) => !savedIds.has(n.id))
          .map((n) =>
            n.id === "ap-math" ? { ...n, status: "viewed" as NodeStatus } : n
          );

        // position は常にコードの最新値を使う（localStorage の古い座標を無視）
        const latestPositions = new Map(apNodes.map((n) => [n.id, n.position]));

        let merged = [...persisted.nodes, ...missingNodes].map((node) => ({
          ...node,
          position: latestPositions.get(node.id) ?? node.position,
        }));

        const unlockedIds = new Set(
          merged.filter((n) => n.status !== "locked").map((n) => n.id)
        );
        merged = merged.map((node) => {
          if (node.status !== "locked") return node;
          const hasUnlockedPrereq = apConnections.some(
            (c) => c.toNodeId === node.id && unlockedIds.has(c.fromNodeId)
          );
          return hasUnlockedPrereq
            ? { ...node, status: "viewed" as NodeStatus }
            : node;
        });

        return { ...currentState, ...persisted, nodes: merged };
      },
    }
  )
);
