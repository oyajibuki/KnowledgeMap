import { create } from "zustand";
import { KnowledgeNode, NodeStatus } from "@/types";
import { initialNodes } from "@/lib/data";

interface GameStore {
  nodes: KnowledgeNode[];
  selectedNodeId: string | null;
  showQuiz: boolean;
  setSelectedNode: (id: string | null) => void;
  setShowQuiz: (show: boolean) => void;
  updateNodeStatus: (id: string, status: NodeStatus) => void;
  unlockAdjacentNodes: (id: string) => void;
  getNode: (id: string) => KnowledgeNode | undefined;
}

// 最初のノードだけ解放済みにする
const getInitialNodes = (): KnowledgeNode[] => {
  return initialNodes.map((node) =>
    node.id === "binary" ? { ...node, status: "viewed" as NodeStatus } : node
  );
};

export const useGameStore = create<GameStore>((set, get) => ({
  nodes: getInitialNodes(),
  selectedNodeId: null,
  showQuiz: false,

  setSelectedNode: (id) => set({ selectedNodeId: id, showQuiz: false }),
  setShowQuiz: (show) => set({ showQuiz: show }),

  updateNodeStatus: (id, status) =>
    set((state) => ({
      nodes: state.nodes.map((n) => (n.id === id ? { ...n, status } : n)),
    })),

  unlockAdjacentNodes: (id) => {
    // connections は import しないで store 内で解決
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
}));
