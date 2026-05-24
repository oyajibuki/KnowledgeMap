"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/lib/store";
import { questions } from "@/lib/data";
import Quiz from "./Quiz";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

export default function NodeDetail() {
  const { nodes, selectedNodeId, setSelectedNode, setShowQuiz, showQuiz, updateNodeStatus, unlockAdjacentNodes } =
    useGameStore();
  const isMobile = useIsMobile();

  const node = nodes.find((n) => n.id === selectedNodeId);
  const nodeQuestions = questions.filter((q) => q.nodeId === selectedNodeId);

  if (!node) return null;

  const handleClose = () => {
    setSelectedNode(null);
    setShowQuiz(false);
  };

  const handleMastered = () => {
    if (node.status === "mastered") return;
    updateNodeStatus(node.id, "mastered");
    unlockAdjacentNodes(node.id);
  };

  const isMastered = node.status === "mastered";

  return (
    <AnimatePresence>
      {node && (
        <>
          {/* モバイル用: 背景オーバーレイ */}
          {isMobile && (
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40"
              style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(2px)" }}
              onClick={handleClose}
            />
          )}

          <motion.div
            key={selectedNodeId}
            initial={isMobile ? { y: "100%" } : { x: 400, opacity: 0 }}
            animate={isMobile ? { y: 0 } : { x: 0, opacity: 1 }}
            exit={isMobile ? { y: "100%" } : { x: 400, opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className={
              isMobile
                ? "fixed inset-x-0 bottom-0 z-50 flex flex-col rounded-t-2xl overflow-hidden"
                : "fixed right-0 top-0 h-full w-full max-w-md z-50 flex flex-col"
            }
            style={
              isMobile
                ? {
                    background: "linear-gradient(180deg, #0f172a 0%, #0a0f1e 100%)",
                    borderTop: "1px solid #334155",
                    height: "82vh",
                    maxHeight: "82vh",
                    boxShadow: "0 -12px 40px rgba(0,0,0,0.7)",
                  }
                : {
                    background: "linear-gradient(180deg, #0f172a 0%, #0a0f1e 100%)",
                    borderLeft: "1px solid #1e293b",
                    boxShadow: "-8px 0 32px rgba(0,0,0,0.6)",
                  }
            }
          >
            {/* モバイル: ドラッグハンドル */}
            {isMobile && (
              <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
                <div className="w-10 h-1 rounded-full" style={{ background: "#334155" }} />
              </div>
            )}

            {/* ヘッダー */}
            <div
              className="flex items-start justify-between p-5 md:p-6 pb-4 flex-shrink-0"
              style={{ borderBottom: "1px solid #1e293b" }}
            >
              <div className="flex-1 pr-4 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {node.isExamFrequent && (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap"
                      style={{ background: "rgba(251,191,36,0.15)", color: "#fbbf24", border: "1px solid #fbbf24" }}
                    >
                      試験頻出
                    </span>
                  )}
                  <span
                    className="text-xs px-2 py-0.5 rounded-full whitespace-nowrap"
                    style={{
                      background: isMastered ? "rgba(124,58,237,0.2)" : "rgba(29,78,216,0.2)",
                      color: isMastered ? "#a78bfa" : "#60a5fa",
                      border: `1px solid ${isMastered ? "#7c3aed" : "#1d4ed8"}`,
                    }}
                  >
                    {isMastered ? "⭐ 理解済み" : "👁 閲覧済み"}
                  </span>
                </div>
                <h2
                  className="text-lg md:text-xl font-bold"
                  style={{
                    color: "#f1f5f9",
                    textShadow: isMastered ? "0 0 16px #a78bfa" : "0 0 8px #3b82f6",
                  }}
                >
                  {node.title}
                </h2>
                <p className="text-xs md:text-sm mt-1" style={{ color: "#64748b" }}>
                  難易度: {"★".repeat(node.difficulty)}{"☆".repeat(5 - node.difficulty)}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-white transition-colors text-xl p-1 flex-shrink-0"
              >
                ✕
              </button>
            </div>

            {/* コンテンツ (スクロール可能) */}
            <div className="flex-1 overflow-y-auto p-5 md:p-6">
              {!showQuiz ? (
                <>
                  {/* 概要 */}
                  <div
                    className="rounded-xl p-4 mb-4"
                    style={{ background: "rgba(30,41,59,0.5)", border: "1px solid #334155" }}
                  >
                    <p className="text-sm" style={{ color: "#94a3b8" }}>{node.description}</p>
                  </div>

                  {/* 詳細解説 */}
                  <div className="mb-4">
                    <h3 className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: "#4f46e5" }}>
                      📖 詳細解説
                    </h3>
                    <div className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "#cbd5e1" }}>
                      {node.detail}
                    </div>
                  </div>

                  {/* 外部リンク */}
                  {node.wikiUrl && (
                    <div className="mb-4">
                      <h3 className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: "#334155" }}>
                        🔗 参考リンク
                      </h3>
                      <a
                        href={node.wikiUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm transition-all hover:scale-105 active:scale-95"
                        style={{
                          color: "#38bdf8",
                          textDecoration: "none",
                          padding: "6px 12px",
                          borderRadius: "8px",
                          background: "rgba(14,165,233,0.08)",
                          border: "1px solid rgba(14,165,233,0.2)",
                        }}
                      >
                        <span>Wikipedia</span>
                        <span style={{ fontSize: 10, opacity: 0.7 }}>↗</span>
                      </a>
                    </div>
                  )}

                  {/* ボタン群 */}
                  <div className="flex flex-col gap-3 mt-5">
                    {nodeQuestions.length > 0 && !isMastered && (
                      <button
                        onClick={() => setShowQuiz(true)}
                        className="w-full py-4 rounded-xl font-bold text-base transition-all duration-200 active:scale-95"
                        style={{
                          background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                          color: "white",
                          boxShadow: "0 4px 24px rgba(79,70,229,0.4)",
                        }}
                      >
                        ⚔️ 問題演習に挑戦 ({nodeQuestions.length}問)
                      </button>
                    )}
                    {nodeQuestions.length > 0 && isMastered && (
                      <button
                        onClick={() => setShowQuiz(true)}
                        className="w-full py-3 rounded-xl font-semibold text-sm transition-all active:scale-95"
                        style={{
                          background: "rgba(30,41,59,0.5)",
                          color: "#64748b",
                          border: "1px solid #334155",
                        }}
                      >
                        📝 問題を再挑戦
                      </button>
                    )}

                    {!isMastered ? (
                      <button
                        onClick={handleMastered}
                        className="w-full py-4 rounded-xl font-bold text-base transition-all duration-200 active:scale-95"
                        style={{
                          background: "linear-gradient(135deg, #0ea5e9, #0284c7)",
                          color: "white",
                          boxShadow: "0 4px 24px rgba(14,165,233,0.35)",
                        }}
                      >
                        ✅ 理解した！次へ進む
                      </button>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full py-3 rounded-xl text-center text-sm font-semibold"
                        style={{
                          background: "rgba(124,58,237,0.1)",
                          border: "1px solid #7c3aed",
                          color: "#a78bfa",
                        }}
                      >
                        ⭐ このノードは習得済みです
                      </motion.div>
                    )}
                  </div>
                </>
              ) : (
                <Quiz nodeId={node.id} onBack={() => setShowQuiz(false)} />
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
