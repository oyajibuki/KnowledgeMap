"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/lib/store";
import { questions } from "@/lib/data";
import { Question } from "@/types";

const EXAM_TOTAL = 100;
const EXAM_PASS = 70;
const EXAM_TIME = 7200; // 120 分

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ExamMode() {
  const { examMode, closeExam, finishExam } = useGameStore();

  // 100問をシャッフルして1度だけ生成
  const [examQuestions] = useState<Question[]>(() =>
    shuffle(questions).slice(0, EXAM_TOTAL)
  );

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(EXAM_TIME);
  const [finished, setFinished] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  // refで同期的に正解数を追跡（タイマーコールバック用）
  const correctRef = useRef(0);
  const finishedRef = useRef(false);

  const handleFinish = (score: number) => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setFinalScore(score);
    setFinished(true);
    finishExam(score);
  };

  // カウントダウンタイマー
  useEffect(() => {
    if (!examMode || finished) return;
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(id);
          handleFinish(correctRef.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examMode, finished]);

  if (!examMode) return null;

  const q = examQuestions[current];
  const minutes = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const timerColor =
    timeLeft < 300 ? "#ef4444" : timeLeft < 600 ? "#f59e0b" : "#34d399";
  const progress = (current / EXAM_TOTAL) * 100;
  const isCorrectNow = selected === q?.answer;

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
  };

  const handleNext = () => {
    const isCorrect = selected === q.answer;
    const newScore = correctRef.current + (isCorrect ? 1 : 0);
    correctRef.current = newScore;
    setCorrectCount(newScore);

    if (current + 1 >= EXAM_TOTAL) {
      handleFinish(newScore);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  // ─── 結果画面 ───────────────────────────────────────
  if (finished) {
    const passed = finalScore >= EXAM_PASS;
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 100,
          background: "rgba(2,5,8,0.98)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
        }}
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", delay: 0.2, damping: 14 }}
          style={{
            maxWidth: "480px",
            width: "100%",
            textAlign: "center",
            padding: "40px 28px",
            borderRadius: "24px",
            background: passed
              ? "radial-gradient(ellipse at top, rgba(251,191,36,0.12), transparent)"
              : "radial-gradient(ellipse at top, rgba(99,102,241,0.1), transparent)",
            border: `1px solid ${
              passed ? "rgba(251,191,36,0.35)" : "#1e293b"
            }`,
          }}
        >
          <div style={{ fontSize: "72px", marginBottom: "16px" }}>
            {passed ? "🏆" : "💫"}
          </div>
          <h2
            style={{
              fontSize: "30px",
              fontWeight: "900",
              marginBottom: "8px",
              background: passed
                ? "linear-gradient(135deg, #fbbf24, #f59e0b)"
                : "linear-gradient(135deg, #818cf8, #c084fc)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {passed ? "合格！" : "不合格"}
          </h2>
          <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "24px" }}>
            {passed
              ? "おめでとうございます！ITパスポート銀河系を制覇しました！"
              : `合格ライン ${EXAM_PASS} 点まであと ${EXAM_PASS - finalScore} 点。再挑戦しましょう！`}
          </p>

          <div
            style={{
              fontSize: "56px",
              fontWeight: "900",
              color: passed ? "#fbbf24" : "#64748b",
              margin: "8px 0 4px",
            }}
          >
            {finalScore}
            <span style={{ fontSize: "22px", color: "#475569" }}>
              {" "}/ {EXAM_TOTAL}
            </span>
          </div>
          <p style={{ color: "#334155", fontSize: "12px", marginBottom: "32px" }}>
            合格ライン {EXAM_PASS} 点以上
          </p>

          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={closeExam}
              style={{
                padding: "13px 20px",
                borderRadius: "12px",
                border: "1px solid #334155",
                background: "rgba(30,41,59,0.5)",
                color: "#94a3b8",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              マップに戻る
            </button>
            {passed && (
              <button
                onClick={() => (window.location.href = "/universe")}
                style={{
                  padding: "13px 24px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                  color: "#1a0500",
                  fontWeight: "800",
                  cursor: "pointer",
                  fontSize: "14px",
                  border: "none",
                  boxShadow: "0 4px 24px rgba(251,191,36,0.4)",
                }}
              >
                🌌 宇宙を探索する →
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    );
  }

  // ─── 試験画面 ────────────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(2,5,8,0.99)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* ヘッダー */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 16px",
          borderBottom: "1px solid #1e293b",
          flexShrink: 0,
          gap: "8px",
        }}
      >
        {/* 問題番号 */}
        <div style={{ fontSize: "13px", color: "#64748b", minWidth: "60px" }}>
          <span style={{ color: "#e2e8f0", fontWeight: "700" }}>
            {current + 1}
          </span>
          <span> / {EXAM_TOTAL}</span>
        </div>

        {/* タイマー */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            padding: "5px 12px",
            borderRadius: "20px",
            background: "rgba(15,23,42,0.8)",
            border: `1px solid ${timerColor}50`,
          }}
        >
          <span style={{ fontSize: "13px" }}>⏱</span>
          <span
            style={{
              fontWeight: "700",
              color: timerColor,
              fontVariantNumeric: "tabular-nums",
              fontSize: "15px",
              letterSpacing: "0.02em",
            }}
          >
            {String(minutes).padStart(2, "0")}:{String(secs).padStart(2, "0")}
          </span>
        </div>

        {/* スコア */}
        <div style={{ fontSize: "13px", minWidth: "60px", textAlign: "right" }}>
          <span style={{ color: "#22c55e", fontWeight: "700" }}>
            ✓ {correctCount}
          </span>
          <span style={{ color: "#475569" }}> / {current}</span>
        </div>
      </div>

      {/* プログレスバー */}
      <div style={{ height: "3px", background: "#0f172a", flexShrink: 0 }}>
        <motion.div
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
          style={{
            height: "100%",
            background: "linear-gradient(90deg, #4f46e5, #7c3aed, #a78bfa)",
          }}
        />
      </div>

      {/* 問題エリア */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px 16px 8px",
          maxWidth: "720px",
          width: "100%",
          margin: "0 auto",
          boxSizing: "border-box",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.18 }}
          >
            {/* 問題文 */}
            <div
              style={{
                padding: "16px",
                borderRadius: "14px",
                background: "rgba(30,41,59,0.35)",
                border: "1px solid #1e293b",
                marginBottom: "14px",
              }}
            >
              <p
                style={{
                  fontSize: "11px",
                  color: "#475569",
                  marginBottom: "6px",
                  fontWeight: "700",
                  letterSpacing: "0.05em",
                }}
              >
                問 {current + 1}
              </p>
              <p
                style={{
                  fontSize: "14px",
                  color: "#e2e8f0",
                  lineHeight: 1.75,
                }}
              >
                {q.question}
              </p>
            </div>

            {/* 選択肢 */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                marginBottom: "14px",
              }}
            >
              {q.choices.map((choice, idx) => {
                const isSel = selected === idx;
                const isAns = idx === q.answer;
                let border = "#1e293b";
                let bg = "rgba(15,23,42,0.5)";
                let color = "#cbd5e1";

                if (answered) {
                  if (isAns) {
                    border = "#22c55e";
                    bg = "rgba(34,197,94,0.09)";
                    color = "#86efac";
                  } else if (isSel && !isAns) {
                    border = "#ef4444";
                    bg = "rgba(239,68,68,0.09)";
                    color = "#fca5a5";
                  }
                } else if (isSel) {
                  border = "#6366f1";
                  bg = "rgba(99,102,241,0.1)";
                  color = "#a5b4fc";
                }

                return (
                  <motion.button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    whileHover={!answered ? { scale: 1.01 } : {}}
                    whileTap={!answered ? { scale: 0.98 } : {}}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "12px 14px",
                      borderRadius: "11px",
                      border: `1px solid ${border}`,
                      background: bg,
                      color,
                      cursor: answered ? "default" : "pointer",
                      fontSize: "13px",
                      lineHeight: 1.55,
                      transition: "border-color 0.15s, background 0.15s",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                    }}
                  >
                    <span
                      style={{
                        flexShrink: 0,
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        background:
                          answered && isAns
                            ? "#16a34a"
                            : answered && isSel
                            ? "#dc2626"
                            : isSel
                            ? "#4f46e5"
                            : "#1e293b",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "10px",
                        color: "#fff",
                        fontWeight: "700",
                        marginTop: "1px",
                      }}
                    >
                      {["ア", "イ", "ウ", "エ"][idx]}
                    </span>
                    <span style={{ flex: 1 }}>{choice}</span>
                    {answered && isAns && (
                      <span
                        style={{
                          marginLeft: "auto",
                          color: "#22c55e",
                          flexShrink: 0,
                        }}
                      >
                        ✓
                      </span>
                    )}
                    {answered && isSel && !isAns && (
                      <span
                        style={{
                          marginLeft: "auto",
                          color: "#ef4444",
                          flexShrink: 0,
                        }}
                      >
                        ✗
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* 解説 */}
            <AnimatePresence>
              {answered && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    padding: "12px 14px",
                    borderRadius: "11px",
                    background: isCorrectNow
                      ? "rgba(34,197,94,0.07)"
                      : "rgba(239,68,68,0.07)",
                    border: `1px solid ${
                      isCorrectNow ? "#166534" : "#991b1b"
                    }`,
                    marginBottom: "14px",
                  }}
                >
                  <p
                    style={{
                      fontSize: "11px",
                      fontWeight: "700",
                      marginBottom: "5px",
                      color: isCorrectNow ? "#86efac" : "#fca5a5",
                    }}
                  >
                    {isCorrectNow ? "✓ 正解！" : "✗ 不正解"}
                  </p>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#94a3b8",
                      lineHeight: 1.6,
                    }}
                  >
                    {q.explanation}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {answered && (
              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleNext}
                style={{
                  width: "100%",
                  padding: "15px",
                  borderRadius: "13px",
                  background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                  color: "white",
                  fontWeight: "700",
                  fontSize: "14px",
                  cursor: "pointer",
                  border: "none",
                  boxShadow: "0 4px 18px rgba(79,70,229,0.35)",
                }}
              >
                {current + 1 >= EXAM_TOTAL ? "結果を見る 🏆" : "次の問題へ →"}
              </motion.button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 中断ボタン */}
      <div
        style={{
          padding: "8px 16px 16px",
          textAlign: "center",
          flexShrink: 0,
        }}
      >
        <button
          onClick={closeExam}
          style={{
            padding: "6px 16px",
            borderRadius: "20px",
            background: "transparent",
            border: "1px solid #1e293b",
            color: "#334155",
            fontSize: "11px",
            cursor: "pointer",
          }}
        >
          試験を中断してマップに戻る
        </button>
      </div>
    </motion.div>
  );
}
