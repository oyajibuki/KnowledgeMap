import { create } from "zustand";
import { persist } from "zustand/middleware";
import { KnowledgeNode, NodeStatus } from "@/types";
import { initialNodes } from "@/lib/data";

interface GameStore {
  nodes: KnowledgeNode[];
  selectedNodeId: string | null;
  showQuiz: boolean;
  // 試験 & 銀河系
  examMode: boolean;
  examCompleted: boolean;
  examScore: number;
  examPassed: boolean;
  galaxyCompleted: boolean;
  showGalaxyComplete: boolean;
  // アクション
  setSelectedNode: (id: string | null) => void;
  setShowQuiz: (show: boolean) => void;
  updateNodeStatus: (id: string, status: NodeStatus) => void;
  unlockAdjacentNodes: (id: string) => void;
  getNode: (id: string) => KnowledgeNode | undefined;
  startExam: () => void;
  finishExam: (score: number) => void;
  closeExam: () => void;
  dismissGalaxyComplete: () => void;
}

const getInitialNodes = (): KnowledgeNode[] => {
  return initialNodes.map((node) =>
    node.id === "binary" ? { ...node, status: "viewed" as NodeStatus } : node
  );
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      nodes: getInitialNodes(),
      selectedNodeId: null,
      showQuiz: false,
      examMode: false,
      examCompleted: false,
      examScore: 0,
      examPassed: false,
      galaxyCompleted: false,
      showGalaxyComplete: false,

      setSelectedNode: (id) => set({ selectedNodeId: id, showQuiz: false }),
      setShowQuiz: (show) => set({ showQuiz: show }),

      updateNodeStatus: (id, status) =>
        set((state) => ({
          nodes: state.nodes.map((n) => (n.id === id ? { ...n, status } : n)),
        })),

      unlockAdjacentNodes: (id) => {
        import("@/lib/data").then(({ connections }) => {
          const adjacentIds = connections
            .filter((c) => c.fromNodeId === id)
            .map((c) => c.toNodeId);
          set((state) => ({
            nodes: state.nodes.map((n) =>
              adjacentIds.includes(n.id) && n.status === "locked"
                ? { ...n, status: "viewed" as NodeStatus }
                : n
            ),
          }));
        });
      },

      getNode: (id) => get().nodes.find((n) => n.id === id),

      startExam: () => set({ examMode: true }),

      finishExam: (score) => {
        const passed = score >= 70;
        set((state) => ({
          examMode: false,
          examCompleted: true,
          examScore: score,
          examPassed: passed,
          galaxyCompleted: passed ? true : state.galaxyCompleted,
          showGalaxyComplete: passed,
        }));
      },

      closeExam: () => set({ examMode: false }),

      dismissGalaxyComplete: () => set({ showGalaxyComplete: false }),
    }),
    {
      name: "knowledge-map-itp",
      partialize: (state) => ({
        nodes: state.nodes,
        examCompleted: state.examCompleted,
        examScore: state.examScore,
        examPassed: state.examPassed,
        galaxyCompleted: state.galaxyCompleted,
      }),
    }
  )
);
