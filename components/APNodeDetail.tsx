"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAPStore } from "@/lib/ap-store";
import { apQuestions } from "@/lib/ap-data";
import { Question } from "@/types";

function APQuiz({ questions, onBack, onComplete }: { questions: Question[]; onBack: () => void; onComplete: () => void }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  if (questions.length === 0) return <p style={{ color: "#64748b" }}>この分野の問題はまだありません。</p>;

  const q = questions[current];

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === q.answer) setCorrectCount((c) => c + 1);
  };

  const handleNext = () => {
    if (current + 1 >= questions.length) {
      setFinished(true);
      if (correctCount + (selected === q.answer ? 1 : 0) >= Math.ceil(questions.length * 0.6)) onComplete();
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  if (finished) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-3">🎯</div>
        <p className="text-lg font-bold mb-2" style={{ color: "#f1f5f9" }}>
          {correctCount} / {questions.length} 正解
        </p>
        <button onClick={onBack} className="mt-4 px-6 py-2 rounded-xl text-sm font-semibold"
          style={{ background: "linear-gradient(135deg, #059669, #10b981)", color: "white" }}>
          解説に戻る
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <span className="text-xs" style={{ color: "#64748b" }}>問 {current + 1} / {questions.length}</span>
        <button onClick={onBack} className="text-xs" style={{ color: "#475569" }}>← 戻る</button>
      </div>
      <p className="text-sm font-medium mb-4" style={{ color: "#f1f5f9", lineHeight: 1.7 }}>{q.question}</p>
      <div className="space-y-2">
        {q.choices.map((choice, idx) => {
          let bg = "rgba(30,41,59,0.5)"; let border = "rgba(51,65,85,0.6)"; let color = "#cbd5e1";
          if (answered) {
            if (idx === q.answer) { bg = "rgba(16,185,129,0.15)"; border = "#10b981"; color = "#6ee7b7"; }
            else if (idx === selected) { bg = "rgba(239,68,68,0.15)"; border = "#ef4444"; color = "#fca5a5"; }
          } else if (selected === idx) { bg = "rgba(52,211,153,0.1)"; border = "#34d399"; color = "#f1f5f9"; }
          return (
            <button key={idx} onClick={() => handleSelect(idx)} className="w-full text-left px-3 py-2.5 rounded-lg text-xs transition-all"
              style={{ background: bg, border: `1px solid ${border}`, color }}>
              <span className="font-bold mr-1" style={{ color: "#64748b" }}>{["ア", "イ", "ウ", "エ"][idx]}．</span>
              {choice}
            </button>
          );
        })}
      </div>
      {answered && (
        <div className="mt-3 p-3 rounded-lg text-xs" style={{ background: "rgba(30,41,59,0.5)", color: "#94a3b8", lineHeight: 1.6 }}>
          <span className="font-bold mr-1" style={{ color: selected === q.answer ? "#34d399" : "#f87171" }}>
            {selected === q.answer ? "✓ 正解" : "✗ 不正解"}
          </span>
          {q.explanation}
        </div>
      )}
      {answered && (
        <button onClick={handleNext} className="mt-4 w-full py-2.5 rounded-xl text-sm font-semibold"
          style={{ background: "linear-gradient(135deg, #059669, #10b981)", color: "white" }}>
          {current + 1 >= questions.length ? "結果を見る" : "次の問題 →"}
        </button>
      )}
    </div>
  );
}

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

export default function APNodeDetail() {
  const {
    nodes,
    selectedNodeId,
    setSelectedNode,
    setShowQuiz,
    showQuiz,
    updateNodeStatus,
    unlockAdjacentNodes,
  } = useAPStore();
  const isMobile = useIsMobile();

  const node = nodes.find((n) => n.id === selectedNodeId);
  const nodeQuestions = apQuestions.filter((q) => q.nodeId === selectedNodeId);

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
            {isMobile && (
              <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
                <div className="w-10 h-1 rounded-full" style={{ background: "#334155" }} />
              </div>
            )}

            <div
              className="flex items-start justify-between p-5 md:p-6 pb-4 flex-shrink-0"
              style={{ borderBottom: "1px solid #1e293b" }}
            >
              <div className="flex-1 pr-4 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {node.isExamFrequent && (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap"
                      style={{ background: "rgba(52,211,153,0.15)", color: "#34d399", border: "1px solid #34d399" }}
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
                    textShadow: isMastered ? "0 0 16px #a78bfa" : "0 0 8px #34d399",
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

            <div className="flex-1 overflow-y-auto p-5 md:p-6">
              {!showQuiz ? (
                <>
                  <div
                    className="rounded-xl p-4 mb-4"
                    style={{ background: "rgba(30,41,59,0.5)", border: "1px solid #334155" }}
                  >
                    <p className="text-sm" style={{ color: "#94a3b8" }}>{node.description}</p>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: "#10b981" }}>
                      📖 詳細解説
                    </h3>
                    <div className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "#cbd5e1" }}>
                      {node.detail}
                    </div>
                  </div>

                  {node.wikiUrl && (
                    <div className="mb-4">
                      <a
                        href={node.wikiUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm"
                        style={{
                          color: "#38bdf8",
                          padding: "6px 12px",
                          borderRadius: "8px",
                          background: "rgba(56,189,248,0.08)",
                          border: "1px solid rgba(56,189,248,0.2)",
                        }}
                      >
                        Wikipedia で詳しく →
                      </a>
                    </div>
                  )}

                  {nodeQuestions.length > 0 && (
                    <div
                      className="rounded-xl p-4 mb-4"
                      style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}
                    >
                      <p className="text-xs" style={{ color: "#6ee7b7" }}>
                        この分野の過去問が {nodeQuestions.length} 問あります
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <APQuiz
                  questions={nodeQuestions}
                  onBack={() => setShowQuiz(false)}
                  onComplete={handleMastered}
                />
              )}
            </div>

            <div
              className="p-4 md:p-5 flex gap-3 flex-shrink-0"
              style={{ borderTop: "1px solid #1e293b" }}
            >
              {!showQuiz && nodeQuestions.length > 0 && (
                <button
                  onClick={() => setShowQuiz(true)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105 active:scale-95"
                  style={{
                    background: "linear-gradient(135deg, #059669, #10b981)",
                    color: "white",
                    boxShadow: "0 0 16px rgba(16,185,129,0.3)",
                  }}
                >
                  過去問を解く ({nodeQuestions.length}問)
                </button>
              )}
              {!isMastered && (
                <button
                  onClick={handleMastered}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105 active:scale-95"
                  style={{
                    background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                    color: "white",
                    boxShadow: "0 0 16px rgba(168,85,247,0.3)",
                  }}
                >
                  理解した ⭐
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
