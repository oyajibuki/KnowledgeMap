"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/lib/store";
import { questions } from "@/lib/data";

interface QuizProps {
  nodeId: string;
  onBack: () => void;
}

export default function Quiz({ nodeId, onBack }: QuizProps) {
  const nodeQuestions = questions.filter((q) => q.nodeId === nodeId);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const { updateNodeStatus, unlockAdjacentNodes, nodes } = useGameStore();

  const q = nodeQuestions[current];
  const isCorrect = selected === q?.answer;

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === q.answer) setCorrectCount((c) => c + 1);
  };

  const handleNext = () => {
    if (current + 1 >= nodeQuestions.length) {
      setFinished(true);
      const totalCorrect = isCorrect ? correctCount : correctCount;
      const finalScore = isCorrect ? correctCount + 1 : correctCount;
      if (finalScore >= Math.ceil(nodeQuestions.length * 0.6)) {
        const node = nodes.find((n) => n.id === nodeId);
        if (node && node.status !== "mastered") {
          updateNodeStatus(nodeId, "mastered");
          unlockAdjacentNodes(nodeId);
        }
      }
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  if (!q) return null;

  if (finished) {
    const finalScore = isCorrect ? correctCount : correctCount;
    const total = nodeQuestions.length;
    const passed = finalScore >= Math.ceil(total * 0.6);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <div
          className="text-6xl mb-4"
          style={{ filter: passed ? "drop-shadow(0 0 16px #fbbf24)" : "none" }}
        >
          {passed ? "🌟" : "💫"}
        </div>
        <h3
          className="text-2xl font-bold mb-2"
          style={{ color: passed ? "#fbbf24" : "#64748b" }}
        >
          {passed ? "クリア！" : "もう少し！"}
        </h3>
        <p className="text-lg mb-6" style={{ color: "#94a3b8" }}>
          {finalScore} / {total} 正解
        </p>
        {passed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl p-4 mb-6"
            style={{
              background: "rgba(124,58,237,0.15)",
              border: "1px solid #7c3aed",
            }}
          >
            <p className="text-sm" style={{ color: "#c4b5fd" }}>
              ⭐ このノードを習得しました！<br />
              隣接ノードが解放されました。
            </p>
          </motion.div>
        )}
        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="flex-1 py-3 rounded-xl font-semibold transition-all hover:scale-105"
            style={{
              background: "rgba(30,41,59,0.5)",
              color: "#94a3b8",
              border: "1px solid #334155",
            }}
          >
            解説に戻る
          </button>
          {!passed && (
            <button
              onClick={() => {
                setCurrent(0);
                setSelected(null);
                setAnswered(false);
                setCorrectCount(0);
                setFinished(false);
              }}
              className="flex-1 py-3 rounded-xl font-semibold transition-all hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                color: "white",
                boxShadow: "0 4px 16px rgba(79,70,229,0.3)",
              }}
            >
              もう一度挑戦
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <div>
      {/* 進捗 */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="text-sm transition-colors"
          style={{ color: "#64748b" }}
        >
          ← 解説に戻る
        </button>
        <span className="text-sm" style={{ color: "#64748b" }}>
          {current + 1} / {nodeQuestions.length}
        </span>
      </div>

      {/* プログレスバー */}
      <div
        className="w-full h-1 rounded-full mb-6"
        style={{ background: "#1e293b" }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: "linear-gradient(90deg, #4f46e5, #7c3aed)" }}
          animate={{ width: `${((current + 1) / nodeQuestions.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* 問題文 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <div
            className="rounded-xl p-4 mb-6"
            style={{
              background: "rgba(30,41,59,0.5)",
              border: "1px solid #334155",
            }}
          >
            <p className="text-sm font-medium" style={{ color: "#e2e8f0" }}>
              Q{current + 1}. {q.question}
            </p>
          </div>

          {/* 選択肢 */}
          <div className="space-y-3 mb-6">
            {q.choices.map((choice, idx) => {
              const isSelected = selected === idx;
              const isAnswer = idx === q.answer;
              let borderColor = "#334155";
              let bgColor = "rgba(30,41,59,0.3)";
              let textColor = "#cbd5e1";

              if (answered) {
                if (isAnswer) {
                  borderColor = "#22c55e";
                  bgColor = "rgba(34,197,94,0.1)";
                  textColor = "#86efac";
                } else if (isSelected && !isAnswer) {
                  borderColor = "#ef4444";
                  bgColor = "rgba(239,68,68,0.1)";
                  textColor = "#fca5a5";
                }
              } else if (isSelected) {
                borderColor = "#4f46e5";
                bgColor = "rgba(79,70,229,0.15)";
              }

              return (
                <motion.button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  whileHover={!answered ? { scale: 1.01 } : {}}
                  whileTap={!answered ? { scale: 0.99 } : {}}
                  className="w-full text-left rounded-xl p-4 transition-all duration-200"
                  style={{
                    background: bgColor,
                    border: `1px solid ${borderColor}`,
                    color: textColor,
                    cursor: answered ? "default" : "pointer",
                  }}
                >
                  <span className="text-sm">
                    {["ア", "イ", "ウ", "エ"][idx]}. {choice}
                  </span>
                  {answered && isAnswer && (
                    <span className="ml-2 text-green-400">✓</span>
                  )}
                  {answered && isSelected && !isAnswer && (
                    <span className="ml-2 text-red-400">✗</span>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* 解説 */}
          <AnimatePresence>
            {answered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl p-4 mb-6"
                style={{
                  background: isCorrect
                    ? "rgba(34,197,94,0.08)"
                    : "rgba(239,68,68,0.08)",
                  border: `1px solid ${isCorrect ? "#16a34a" : "#dc2626"}`,
                }}
              >
                <p
                  className="text-xs font-semibold mb-1"
                  style={{ color: isCorrect ? "#86efac" : "#fca5a5" }}
                >
                  {isCorrect ? "✓ 正解！" : "✗ 不正解"}
                </p>
                <p className="text-sm" style={{ color: "#94a3b8" }}>
                  {q.explanation}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {answered && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={handleNext}
              className="w-full py-4 rounded-xl font-bold transition-all hover:scale-105 active:scale-95"
              style={{
                background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                color: "white",
                boxShadow: "0 4px 24px rgba(79,70,229,0.4)",
              }}
            >
              {current + 1 >= nodeQuestions.length ? "結果を見る ✨" : "次の問題へ →"}
            </motion.button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
