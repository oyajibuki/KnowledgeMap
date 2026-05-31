"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAPStore } from "@/lib/ap-store";
import { apGozenQuestions, apPMQuestions } from "@/lib/ap-data";
import { Question } from "@/types";

// 午前: 80問・150分（合格60%以上）
// 午後: 20問・150分（合格60%以上）
const EXAM_PASS = 60;
const EXAM_TIME_GOZEN = 9000; // 150分
const EXAM_TIME_GOGO  = 9000; // 150分

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const gozenPool = apGozenQuestions;

// ── 午後問題プール構成 ────────────────────────────────
// 実際の AP 午後試験: 11問、問1必須+問2〜11から4問選択 = 5問を解答
// 本クイズ: 問1(セキュリティ)から5問必須 + 選択4グループから各4問 = 合計20問
function buildGogoExam(): Question[] {
  // 問1（セキュリティ必須）: sec問題からランダム5問
  const secPool = apPMQuestions.filter((q) => q.id.includes("-sec"));
  const secQ    = shuffle(secPool).slice(0, Math.min(5, secPool.length));

  // 問2〜11（選択）: それ以外を topic グループ別に分けてランダム4グループ×4問
  const otherPool = apPMQuestions.filter((q) => !q.id.includes("-sec"));
  // グループ化（id の接頭辞 ap-pm?-xxx で判定）
  const groups: Map<string, Question[]> = new Map();
  for (const q of otherPool) {
    const m = q.id.match(/ap-pm\d-([a-z]+)\d/);
    const key = m ? m[1] : "other";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(q);
  }
  // グループをシャッフルして4グループ選択、各グループから4問
  const groupKeys = shuffle([...groups.keys()]);
  const selectedGroups = groupKeys.slice(0, 4);
  const otherQ = selectedGroups.flatMap((k) =>
    shuffle(groups.get(k)!).slice(0, 4)
  );

  return [...secQ, ...otherQ];
}

export default function APExamMode() {
  const { examMode, examModeType, closeExam, finishExam } = useAPStore();

  const isGozen = examModeType === "gozen";
  const EXAM_TIME = isGozen ? EXAM_TIME_GOZEN : EXAM_TIME_GOGO;

  const [examQuestions, setExamQuestions] = useState<Question[]>(() =>
    isGozen
      ? shuffle(gozenPool).slice(0, Math.min(80, gozenPool.length))
      : buildGogoExam()
  );
  const EXAM_TOTAL = examQuestions.length;
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(EXAM_TIME);
  const [finished, setFinished] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const correctRef = useRef(0);
  const totalQ = examQuestions.length;

  useEffect(() => {
    if (!examMode) {
      setExamQuestions(
        isGozen
          ? shuffle(gozenPool).slice(0, Math.min(80, gozenPool.length))
          : buildGogoExam()
      );
      setCurrent(0);
      setSelected(null);
      setAnswered(false);
      setCorrectCount(0);
      correctRef.current = 0;
      setTimeLeft(EXAM_TIME);
      setFinished(false);
      setFinalScore(0);
    }
  }, [examMode]);

  useEffect(() => {
    if (!examMode || finished) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          const score = Math.round((correctRef.current / totalQ) * 100);
          setFinalScore(score);
          setFinished(true);
          finishExam(score);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [examMode, finished, totalQ, finishExam]);

  if (!examMode) return null;

  const q = examQuestions[current];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((current + (answered ? 1 : 0)) / totalQ) * 100;

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === q.answer) {
      correctRef.current += 1;
      setCorrectCount((c) => c + 1);
    }
  };

  const handleNext = () => {
    if (current + 1 >= totalQ) {
      const score = Math.round((correctRef.current / totalQ) * 100);
      setFinalScore(score);
      setFinished(true);
      finishExam(score);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  const passed = finalScore >= EXAM_PASS;

  return (
    <AnimatePresence>
      {examMode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
        >
          <motion.div
            initial={{ scale: 0.92, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl overflow-hidden"
            style={{
              background: "linear-gradient(180deg, #0f172a 0%, #080d1a 100%)",
              border: "1px solid rgba(52,211,153,0.25)",
              boxShadow: "0 0 40px rgba(52,211,153,0.1)",
            }}
          >
            {/* ヘッダー */}
            <div
              className="flex items-center justify-between px-6 py-4 flex-shrink-0"
              style={{ borderBottom: "1px solid #1e293b" }}
            >
              <div>
                <span className="text-xs font-semibold" style={{ color: "#34d399" }}>
                  応用情報 {isGozen ? "午前" : "午後"} 模擬試験
                </span>
                <div className="text-xs mt-0.5" style={{ color: "#475569" }}>
                  問 {current + 1} / {totalQ}（{isGozen ? "全80問・150分・60%合格" : "問1必須+選択4問・計20問・150分"}）
                </div>
              </div>
              <div
                className="text-lg font-mono font-bold"
                style={{ color: timeLeft < 300 ? "#ef4444" : "#94a3b8" }}
              >
                {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
              </div>
            </div>

            {/* プログレスバー */}
            <div style={{ height: 3, background: "#1e293b" }}>
              <div
                style={{
                  height: "100%",
                  width: `${progress}%`,
                  background: "linear-gradient(90deg, #059669, #34d399)",
                  transition: "width 0.3s",
                }}
              />
            </div>

            {/* コンテンツ */}
            <div className="flex-1 overflow-y-auto p-6">
              {!finished ? (
                <>
                  <p className="text-base md:text-lg font-medium mb-6" style={{ color: "#f1f5f9", lineHeight: 1.7 }}>
                    {q.question}
                  </p>

                  <div className="space-y-3">
                    {q.choices.map((choice, idx) => {
                      let bg = "rgba(30,41,59,0.5)";
                      let border = "rgba(51,65,85,0.6)";
                      let color = "#cbd5e1";
                      if (answered) {
                        if (idx === q.answer) { bg = "rgba(16,185,129,0.15)"; border = "#10b981"; color = "#6ee7b7"; }
                        else if (idx === selected) { bg = "rgba(239,68,68,0.15)"; border = "#ef4444"; color = "#fca5a5"; }
                      } else if (selected === idx) {
                        bg = "rgba(52,211,153,0.1)"; border = "#34d399"; color = "#f1f5f9";
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelect(idx)}
                          className="w-full text-left px-4 py-3 rounded-xl text-sm transition-all"
                          style={{ background: bg, border: `1px solid ${border}`, color }}
                        >
                          <span className="font-bold mr-2" style={{ color: "#64748b" }}>
                            {["ア", "イ", "ウ", "エ"][idx]}．
                          </span>
                          {choice}
                        </button>
                      );
                    })}
                  </div>

                  {answered && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-4 rounded-xl text-sm"
                      style={{
                        background: selected === q.answer ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)",
                        border: `1px solid ${selected === q.answer ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
                        color: "#94a3b8",
                        lineHeight: 1.7,
                      }}
                    >
                      <span className="font-bold mr-1" style={{ color: selected === q.answer ? "#34d399" : "#f87171" }}>
                        {selected === q.answer ? "✓ 正解" : "✗ 不正解"}
                      </span>
                      {q.explanation}
                    </motion.div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="text-5xl mb-4">{passed ? "🏆" : "📚"}</div>
                  <h2 className="text-2xl font-bold mb-2" style={{ color: passed ? "#34d399" : "#94a3b8" }}>
                    {passed ? "合格！" : "不合格"}
                  </h2>
                  <p className="text-4xl font-bold mb-4" style={{ color: "#f1f5f9" }}>
                    {finalScore}<span className="text-xl text-gray-400">点</span>
                  </p>
                  <p className="text-sm mb-6" style={{ color: "#64748b" }}>
                    正解 {correctRef.current} 問 / {totalQ} 問中（合格ライン: {EXAM_PASS}点）
                  </p>
                  <button
                    onClick={closeExam}
                    className="px-8 py-3 rounded-xl font-semibold transition-all hover:scale-105"
                    style={{
                      background: "linear-gradient(135deg, #059669, #10b981)",
                      color: "white",
                    }}
                  >
                    マップに戻る
                  </button>
                </div>
              )}
            </div>

            {/* フッター */}
            {!finished && (
              <div className="px-6 py-4 flex justify-between items-center flex-shrink-0"
                style={{ borderTop: "1px solid #1e293b" }}
              >
                <button
                  onClick={closeExam}
                  className="text-sm px-4 py-2 rounded-lg transition-colors"
                  style={{ color: "#475569", background: "rgba(71,85,105,0.1)" }}
                >
                  中止
                </button>
                {answered && (
                  <motion.button
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={handleNext}
                    className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105"
                    style={{
                      background: "linear-gradient(135deg, #059669, #10b981)",
                      color: "white",
                    }}
                  >
                    {current + 1 >= totalQ ? "結果を見る" : "次の問題 →"}
                  </motion.button>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
