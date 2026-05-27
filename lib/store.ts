import { create } from "zustand";
import { persist } from "zustand/middleware";
import { KnowledgeNode, NodeStatus } from "@/types";
import { initialNodes, connections } from "@/lib/data";
import type { UserProgressRow } from "@/lib/supabase";

interface GameStore {
  nodes: KnowledgeNode[];
  selectedNodeId: string | null;
  showQuiz: boolean;
  // ITP 試験 & 銀河系
  examMode: boolean;
  examCompleted: boolean;
  examScore: number;
  examPassed: boolean;
  galaxyCompleted: boolean;
  showGalaxyComplete: boolean;
  // FE 試験
  feExamMode: boolean;
  feExamCompleted: boolean;
  feExamScoreA: number; // 科目A スコア (0-1000)
  feExamScoreB: number; // 科目B スコア (0-1000)
  feExamPassed: boolean; // 両科目 600 以上
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
  startFEExam: () => void;
  finishFEExam: (scoreA: number, scoreB: number) => void;
  closeFEExam: () => void;
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
      feExamMode: false,
      feExamCompleted: false,
      feExamScoreA: 0,
      feExamScoreB: 0,
      feExamPassed: false,

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

      startFEExam: () => set({ feExamMode: true }),

      finishFEExam: (scoreA, scoreB) => {
        const passed = scoreA >= 600 && scoreB >= 600;
        set({
          feExamCompleted: true,
          feExamScoreA: scoreA,
          feExamScoreB: scoreB,
          feExamPassed: passed,
        });
        scheduleSyncToSupabase(get);
      },

      closeFEExam: () => set({ feExamMode: false }),

      loadFromRemote: (row) => {
        // リモートのノードステータスをローカルノード配列に反映
        set((state) => {
          // Step 1: state にないノードを initialNodes から補完
          const stateIds = new Set(state.nodes.map((n) => n.id));
          const missingNodes = initialNodes
            .filter((n) => !stateIds.has(n.id))
            .map((n) =>
              n.id === "binary" ? { ...n, status: "viewed" as NodeStatus } : n
            );

          // Step 2: Supabase のステータスを適用
          let nodes = [...state.nodes, ...missingNodes].map((n) => ({
            ...n,
            status: row.node_statuses[n.id] ?? n.status,
          }));

          // Step 3: 整合性補正 — 解放済みノードの隣接は必ずアンロック
          // （Supabase に古い "locked" が保存されていても正しく解放する）
          const unlockedIds = new Set(
            nodes.filter((n) => n.status !== "locked").map((n) => n.id)
          );
          nodes = nodes.map((node) => {
            if (node.status !== "locked") return node;
            const hasUnlockedPrereq = connections.some(
              (c) => c.toNodeId === node.id && unlockedIds.has(c.fromNodeId)
            );
            return hasUnlockedPrereq
              ? { ...node, status: "viewed" as NodeStatus }
              : node;
          });

          return {
            nodes,
            examCompleted: row.exam_completed,
            examScore: row.exam_score,
            examPassed: row.exam_passed,
            galaxyCompleted: row.galaxy_completed,
            // 制覇フラグだけ復元（セレブレーションは再表示しない）
            showGalaxyComplete: false,
          };
        });
        // 補正後のステータスを Supabase に書き戻す
        scheduleSyncToSupabase(get);
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
        feExamCompleted: state.feExamCompleted,
        feExamScoreA: state.feExamScoreA,
        feExamScoreB: state.feExamScoreB,
        feExamPassed: state.feExamPassed,
      }),
      // 保存データに新ノードが追加されたとき・完了済みノードの隣接を自動解放
      merge: (persistedState: unknown, currentState: GameStore) => {
        const persisted = persistedState as Partial<GameStore> | null;
        if (!persisted?.nodes) return currentState;

        // Step 1: localStorage にないノードを initialNodes から補完
        const savedIds = new Set(persisted.nodes.map((n) => n.id));
        const missingNodes = initialNodes
          .filter((n) => !savedIds.has(n.id))
          .map((n) =>
            n.id === "binary" ? { ...n, status: "viewed" as NodeStatus } : n
          );

        let merged = [...persisted.nodes, ...missingNodes];

        // Step 2: 既に解放済みのノードから隣接ノードを自動アンロック（進捗補完）
        const unlockedIds = new Set(
          merged.filter((n) => n.status !== "locked").map((n) => n.id)
        );
        merged = merged.map((node) => {
          if (node.status !== "locked") return node;
          const hasUnlockedPrereq = connections.some(
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
