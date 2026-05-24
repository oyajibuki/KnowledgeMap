import { create } from "zustand";
import { persist } from "zustand/middleware";
import { KnowledgeNode, NodeStatus } from "@/types";
import { initialNodes } from "@/lib/data";
import type { UserProgressRow } from "@/lib/supabase";

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
  // Supabaseリモート進捗の読み込み
  loadFromRemote: (row: UserProgressRow) => void;
  // Supabase同期用のスナップショット取得
  getSyncPayload: () => {
    node_statuses: Record<string, NodeStatus>;
    exam_completed: boolean;
    exam_score: number;
    exam_passed: boolean;
    galaxy_completed: boolean;
  };
}

const getInitialNodes = (): KnowledgeNode[] => {
  return initialNodes.map((node) =>
    node.id === "binary" ? { ...node, status: "viewed" as NodeStatus } : node
  );
};

// Supabaseへの保存をデバウンス（ノードを素早く連続更新しても1回にまとめる）
let syncDebounceTimer: ReturnType<typeof setTimeout> | null = null;
function scheduleSyncToSupabase(get: () => GameStore) {
  if (syncDebounceTimer) clearTimeout(syncDebounceTimer);
  syncDebounceTimer = setTimeout(async () => {
    try {
      const { useAuthStore } = await import("@/lib/auth-store");
      const authStore = useAuthStore.getState();
      if (!authStore.user) return;
      const payload = get().getSyncPayload();
      await authStore.syncToSupabase(payload);
    } catch {
      // ネットワークエラーは静かに無視
    }
  }, 1500);
}

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

      updateNodeStatus: (id, status) => {
        set((state) => ({
          nodes: state.nodes.map((n) => (n.id === id ? { ...n, status } : n)),
        }));
        scheduleSyncToSupabase(get);
      },

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
          scheduleSyncToSupabase(get);
        });
      },

      getNode: (id) => get().nodes.find((n) => n.id === id),

      startExam: () => set({ examMode: true }),

      finishExam: (score) => {
        const passed = score >= 70;
        // ※ examMode は false にしない — ExamMode が結果画面を表示し続け、
        // ユーザーのボタン操作で closeExam() が呼ばれたときに閉じる。
        set((state) => ({
          examCompleted: true,
          examScore: score,
          examPassed: passed,
          galaxyCompleted: passed ? true : state.galaxyCompleted,
          showGalaxyComplete: passed,
        }));
        scheduleSyncToSupabase(get);
      },

      closeExam: () => set({ examMode: false }),

      dismissGalaxyComplete: () => set({ showGalaxyComplete: false }),

      loadFromRemote: (row) => {
        // リモートのノードステータスをローカルノード配列に反映
        set((state) => ({
          nodes: state.nodes.map((n) => ({
            ...n,
            status: row.node_statuses[n.id] ?? n.status,
          })),
          examCompleted: row.exam_completed,
          examScore: row.exam_score,
          examPassed: row.exam_passed,
          galaxyCompleted: row.galaxy_completed,
          // 制覇フラグだけ復元（セレブレーションは再表示しない）
          showGalaxyComplete: false,
        }));
      },

      getSyncPayload: () => {
        const s = get();
        const node_statuses: Record<string, NodeStatus> = {};
        s.nodes.forEach((n) => {
          node_statuses[n.id] = n.status;
        });
        return {
          node_statuses,
          exam_completed: s.examCompleted,
          exam_score: s.examScore,
          exam_passed: s.examPassed,
          galaxy_completed: s.galaxyCompleted,
        };
      },
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
