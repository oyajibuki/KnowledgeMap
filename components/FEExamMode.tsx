"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/lib/store";
import { feQuestions } from "@/lib/fe-questions";
import { feExamBQuestions } from "@/lib/fe-exam-b-questions";
import { Question } from "@/types";

// ─── 定数 ────────────────────────────────────────────
const A_TOTAL = 60;
const B_TOTAL = 20;
const A_TIME  = 5400; // 90分
const B_TIME  = 6000; // 100分
const PASS_SCORE = 600; // 0-1000スケール

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function rawToScaled(raw: number, total: number): number {
  return Math.round((raw / total) * 1000);
}

// ─── 型 ──────────────────────────────────────────────
type Phase = "start" | "a" | "between" | "b" | "result";

// ─── スコアゲージ ─────────────────────────────────────
function ScoreGauge({ score, label }: { score: number; label: string }) {
  const passed = score >= PASS_SCORE;
  const pct = Math.min(100, score / 10);
  return (
    <div style={{ marginBottom: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
        <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "700" }}>{label}</span>
        <span style={{ fontSize: "18px", fontWeight: "900", color: passed ? "#818cf8" : "#64748b" }}>
          {score}
          <span style={{ fontSize: "11px", color: "#475569" }}>/1000</span>
        </span>
      </div>
      <div style={{ height: "8px", background: "#0f172a", borderRadius: "4px", overflow: "hidden", position: "relative" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          style={{
            height: "100%",
            borderRadius: "4px",
            background: passed
              ? "linear-gradient(90deg, #4f46e5, #818cf8)"
              : "linear-gradient(90deg, #374151, #4b5563)",
          }}
        />
        {/* 600点ライン */}
        <div style={{ position: "absolute", top: 0, left: "60%", height: "100%", width: "1px", background: "rgba(251,191,36,0.6)" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
        <span style={{ fontSize: "9px", color: "#334155" }}>0</span>
        <span style={{ fontSize: "9px", color: "rgba(251,191,36,0.6)" }}>合格ライン 600</span>
        <span style={{ fontSize: "9px", color: "#334155" }}>1000</span>
      </div>
      <div style={{ marginTop: "6px", display: "flex", alignItems: "center", gap: "5px" }}>
        <span style={{
          fontSize: "10px",
          fontWeight: "700",
          padding: "2px 8px",
          borderRadius: "10px",
          background: passed ? "rgba(99,102,241,0.15)" : "rgba(239,68,68,0.1)",
          color: passed ? "#818cf8" : "#ef4444",
          border: `1px solid ${passed ? "rgba(99,102,241,0.3)" : "rgba(239,68,68,0.25)"}`,
        }}>
          {passed ? "✓ 合格" : "✗ 不合格"}
        </span>
      </div>
    </div>
  );
}

// ─── 問題UI (科目A / 科目B 共通) ────────────────────────
function QuestionView({
  q,
  current,
  total,
  timeLeft,
  correctCount,
  phase,
  onSelect,
  onNext,
  onAbort,
}: {
  q: Question;
  current: number;
  total: number;
  timeLeft: number;
  correctCount: number;
  phase: "a" | "b";
  onSelect: (idx: number) => void;
  onNext: () => void;
  onAbort: () => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  // 問題が変わったらリセット
  useEffect(() => {
    setSelected(null);
    setAnswered(false);
  }, [current]);

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    onSelect(idx);
  };

  const minutes = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const timerColor = timeLeft < 300 ? "#ef4444" : timeLeft < 600 ? "#f59e0b" : "#34d399";
  const progress = (current / total) * 100;
  const isCorrectNow = selected === q.answer;
  const subjectColor = phase === "a" ? "#06b6d4" : "#818cf8";
  const subjectLabel = phase === "a" ? "科目A" : "科目B";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(2,5,8,0.99)", display: "flex", flexDirection: "column", overflow: "hidden" }}
    >
      {/* ヘッダー */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", borderBottom: "1px solid #1e293b", flexShrink: 0, gap: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: "80px" }}>
          <span style={{ fontSize: "10px", fontWeight: "800", padding: "2px 8px", borderRadius: "10px", background: `${subjectColor}20`, color: subjectColor, border: `1px solid ${subjectColor}40` }}>
            {subjectLabel}
          </span>
          <span style={{ fontSize: "13px", color: "#64748b" }}>
            <span style={{ color: "#e2e8f0", fontWeight: "700" }}>{current + 1}</span>/{total}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "5px", padding: "5px 12px", borderRadius: "20px", background: "rgba(15,23,42,0.8)", border: `1px solid ${timerColor}50` }}>
          <span style={{ fontSize: "13px" }}>⏱</span>
          <span style={{ fontWeight: "700", color: timerColor, fontVariantNumeric: "tabular-nums", fontSize: "15px" }}>
            {String(minutes).padStart(2, "0")}:{String(secs).padStart(2, "0")}
          </span>
        </div>
        <div style={{ fontSize: "13px", minWidth: "80px", textAlign: "right" }}>
          <span style={{ color: "#22c55e", fontWeight: "700" }}>✓ {correctCount}</span>
          <span style={{ color: "#475569" }}> / {current}</span>
        </div>
      </div>

      {/* プログレスバー */}
      <div style={{ height: "3px", background: "#0f172a", flexShrink: 0 }}>
        <motion.div
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
          style={{ height: "100%", background: phase === "a" ? "linear-gradient(90deg, #0891b2, #06b6d4)" : "linear-gradient(90deg, #4f46e5, #818cf8)" }}
        />
      </div>

      {/* 問題エリア */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 8px", maxWidth: "720px", width: "100%", margin: "0 auto", boxSizing: "border-box" }}>
        <AnimatePresence mode="wait">
          <motion.div key={current} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.18 }}>
            {/* 問題文 */}
            <div style={{ padding: "16px", borderRadius: "14px", background: "rgba(30,41,59,0.35)", border: "1px solid #1e293b", marginBottom: "14px" }}>
              <p style={{ fontSize: "11px", color: "#475569", marginBottom: "6px", fontWeight: "700" }}>問 {current + 1}</p>
              <p style={{ fontSize: "14px", color: "#e2e8f0", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{q.question}</p>
            </div>

            {/* 選択肢 */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "14px" }}>
              {q.choices.map((choice, idx) => {
                const isSel = selected === idx;
                const isAns = idx === q.answer;
                let border = "#1e293b", bg = "rgba(15,23,42,0.5)", color = "#cbd5e1";
                if (answered) {
                  if (isAns)           { border = "#22c55e"; bg = "rgba(34,197,94,0.09)"; color = "#86efac"; }
                  else if (isSel)      { border = "#ef4444"; bg = "rgba(239,68,68,0.09)"; color = "#fca5a5"; }
                } else if (isSel)      { border = "#6366f1"; bg = "rgba(99,102,241,0.1)"; color = "#a5b4fc"; }
                return (
                  <motion.button key={idx} onClick={() => handleSelect(idx)} whileHover={!answered ? { scale: 1.01 } : {}} whileTap={!answered ? { scale: 0.98 } : {}}
                    style={{ width: "100%", textAlign: "left", padding: "12px 14px", borderRadius: "11px", border: `1px solid ${border}`, background: bg, color, cursor: answered ? "default" : "pointer", fontSize: "13px", lineHeight: 1.55, transition: "border-color 0.15s, background 0.15s", display: "flex", alignItems: "flex-start", gap: "10px" }}>
                    <span style={{ flexShrink: 0, width: "20px", height: "20px", borderRadius: "50%", background: answered && isAns ? "#16a34a" : answered && isSel ? "#dc2626" : isSel ? "#4f46e5" : "#1e293b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", color: "#fff", fontWeight: "700", marginTop: "1px" }}>
                      {["ア", "イ", "ウ", "エ"][idx]}
                    </span>
                    <span style={{ flex: 1 }}>{choice}</span>
                    {answered && isAns && <span style={{ marginLeft: "auto", color: "#22c55e", flexShrink: 0 }}>✓</span>}
                    {answered && isSel && !isAns && <span style={{ marginLeft: "auto", color: "#ef4444", flexShrink: 0 }}>✗</span>}
                  </motion.button>
                );
              })}
            </div>

            {/* 解説 */}
            <AnimatePresence>
              {answered && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  style={{ padding: "12px 14px", borderRadius: "11px", background: isCorrectNow ? "rgba(34,197,94,0.07)" : "rgba(239,68,68,0.07)", border: `1px solid ${isCorrectNow ? "#166534" : "#991b1b"}`, marginBottom: "14px" }}>
                  <p style={{ fontSize: "11px", fontWeight: "700", marginBottom: "5px", color: isCorrectNow ? "#86efac" : "#fca5a5" }}>
                    {isCorrectNow ? "✓ 正解！" : "✗ 不正解"}
                  </p>
                  <p style={{ fontSize: "13px", color: "#94a3b8", lineHeight: 1.6 }}>{q.explanation}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {answered && (
              <motion.button initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} onClick={onNext}
                style={{ width: "100%", padding: "15px", borderRadius: "13px", background: phase === "a" ? "linear-gradient(135deg, #0891b2, #0e7490)" : "linear-gradient(135deg, #4f46e5, #7c3aed)", color: "white", fontWeight: "700", fontSize: "14px", cursor: "pointer", border: "none", boxShadow: "0 4px 18px rgba(79,70,229,0.35)" }}>
                {current + 1 >= total ? (phase === "a" ? "科目A 終了 →" : "結果を見る 🏆") : "次の問題へ →"}
              </motion.button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 中断ボタン */}
      <div style={{ padding: "8px 16px 16px", textAlign: "center", flexShrink: 0 }}>
        <button onClick={onAbort} style={{ padding: "6px 16px", borderRadius: "20px", background: "transparent", border: "1px solid #1e293b", color: "#334155", fontSize: "11px", cursor: "pointer" }}>
          試験を中断してマップに戻る
        </button>
      </div>
    </motion.div>
  );
}

// ─── メインコンポーネント ───────────────────────────────
export default function FEExamMode() {
  const { feExamMode, closeFEExam, finishFEExam } = useGameStore();

  // 問題セット（マウント時に生成）
  const questionsA = useMemo(() => shuffle(feQuestions).slice(0, A_TOTAL), []);
  const questionsB = useMemo(() => shuffle(feExamBQuestions).slice(0, B_TOTAL), []);

  const [phase, setPhase] = useState<Phase>("start");
  const [currentA, setCurrentA] = useState(0);
  const [currentB, setCurrentB] = useState(0);
  const [correctA, setCorrectA] = useState(0);
  const [correctB, setCorrectB] = useState(0);
  const [timeLeftA, setTimeLeftA] = useState(A_TIME);
  const [timeLeftB, setTimeLeftB] = useState(B_TIME);
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);

  // ref で同期値を持つ（タイマーコールバック用）
  const correctARef = useRef(0);
  const correctBRef = useRef(0);

  // タイマー（科目A）
  useEffect(() => {
    if (phase !== "a") return;
    const id = setInterval(() => setTimeLeftA((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(id);
  }, [phase]);

  // タイムアップ A
  useEffect(() => {
    if (timeLeftA === 0 && phase === "a") finishPhaseA(correctARef.current);
  }, [timeLeftA, phase]); // eslint-disable-line

  // タイマー（科目B）
  useEffect(() => {
    if (phase !== "b") return;
    const id = setInterval(() => setTimeLeftB((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(id);
  }, [phase]);

  // タイムアップ B
  useEffect(() => {
    if (timeLeftB === 0 && phase === "b") finishPhaseB(correctBRef.current);
  }, [timeLeftB, phase]); // eslint-disable-line

  // feExamMode リセット
  useEffect(() => {
    if (!feExamMode) {
      setPhase("start");
      setCurrentA(0); setCurrentB(0);
      setCorrectA(0); setCorrectB(0);
      setTimeLeftA(A_TIME); setTimeLeftB(B_TIME);
      setScoreA(0); setScoreB(0);
      correctARef.current = 0; correctBRef.current = 0;
    }
  }, [feExamMode]);

  if (!feExamMode) return null;

  // ─── フェーズ遷移ハンドラ ─────────────────────────────

  const finishPhaseA = (raw: number) => {
    const s = rawToScaled(raw, A_TOTAL);
    setScoreA(s);
    setPhase("between");
  };

  const finishPhaseB = (raw: number) => {
    const s = rawToScaled(raw, B_TOTAL);
    setScoreB(s);
    finishFEExam(scoreA, s); // scoreA はこの時点でセット済み
    setPhase("result");
  };

  const handleSelectA = (idx: number) => {
    const isCorrect = idx === questionsA[currentA].answer;
    if (isCorrect) {
      correctARef.current += 1;
      setCorrectA((c) => c + 1);
    }
  };

  const handleNextA = () => {
    if (currentA + 1 >= A_TOTAL) {
      finishPhaseA(correctARef.current);
    } else {
      setCurrentA((c) => c + 1);
    }
  };

  const handleSelectB = (idx: number) => {
    const isCorrect = idx === questionsB[currentB].answer;
    if (isCorrect) {
      correctBRef.current += 1;
      setCorrectB((c) => c + 1);
    }
  };

  const handleNextB = () => {
    if (currentB + 1 >= B_TOTAL) {
      finishPhaseB(correctBRef.current);
    } else {
      setCurrentB((c) => c + 1);
    }
  };

  // ─── スタート画面 ────────────────────────────────────
  if (phase === "start") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(2,5,8,0.99)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 16 }}
          style={{ maxWidth: "500px", width: "100%", padding: "40px 32px", borderRadius: "24px", background: "radial-gradient(ellipse at top, rgba(129,140,248,0.12), rgba(2,5,8,0.97))", border: "1px solid rgba(129,140,248,0.3)" }}
        >
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div style={{ fontSize: "52px", marginBottom: "12px" }}>💻</div>
            <h2 style={{ fontSize: "24px", fontWeight: "900", background: "linear-gradient(135deg, #818cf8, #c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "8px" }}>
              基本情報技術者<br />模擬試験
            </h2>
            <p style={{ color: "#475569", fontSize: "12px" }}>CBT方式 / IPA 試験準拠</p>
          </div>

          {/* 科目情報 */}
          {[
            { label: "科目A", color: "#06b6d4", questions: `${A_TOTAL}問`, time: "90分", desc: "テクノロジ・マネジメント・ストラテジ" },
            { label: "科目B", color: "#818cf8", questions: `${B_TOTAL}問`, time: "100分", desc: "アルゴリズム・擬似コードトレース" },
          ].map((s) => (
            <div key={s.label} style={{ padding: "14px 18px", borderRadius: "12px", background: "rgba(15,23,42,0.6)", border: `1px solid ${s.color}30`, marginBottom: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <span style={{ fontSize: "12px", fontWeight: "800", color: s.color }}>{s.label}</span>
                <span style={{ fontSize: "11px", color: "#475569" }}>{s.questions} · {s.time}</span>
              </div>
              <p style={{ fontSize: "11px", color: "#64748b" }}>{s.desc}</p>
            </div>
          ))}

          <div style={{ padding: "10px 14px", borderRadius: "10px", background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.2)", marginBottom: "24px" }}>
            <p style={{ fontSize: "11px", color: "rgba(251,191,36,0.8)", textAlign: "center" }}>
              ⚡ 合格基準：科目A・科目B それぞれ <strong>600点/1000点</strong> 以上
            </p>
          </div>

          <button
            onClick={() => setPhase("a")}
            style={{ width: "100%", padding: "16px", borderRadius: "14px", background: "linear-gradient(135deg, #4f46e5, #818cf8)", color: "white", fontWeight: "800", fontSize: "16px", cursor: "pointer", border: "none", boxShadow: "0 4px 24px rgba(99,102,241,0.4)" }}
          >
            科目A から開始 →
          </button>
          <button
            onClick={closeFEExam}
            style={{ width: "100%", marginTop: "10px", padding: "10px", borderRadius: "12px", background: "transparent", border: "1px solid #1e293b", color: "#334155", fontSize: "13px", cursor: "pointer" }}
          >
            マップに戻る
          </button>
        </motion.div>
      </motion.div>
    );
  }

  // ─── 科目A ───────────────────────────────────────────
  if (phase === "a") {
    return (
      <QuestionView
        q={questionsA[currentA]}
        current={currentA}
        total={A_TOTAL}
        timeLeft={timeLeftA}
        correctCount={correctA}
        phase="a"
        onSelect={handleSelectA}
        onNext={handleNextA}
        onAbort={closeFEExam}
      />
    );
  }

  // ─── 科目A → 科目B 中間画面 ──────────────────────────
  if (phase === "between") {
    const aPassed = scoreA >= PASS_SCORE;
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(2,5,8,0.99)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 16 }}
          style={{ maxWidth: "420px", width: "100%", padding: "36px 28px", borderRadius: "24px", background: "radial-gradient(ellipse at top, rgba(6,182,212,0.1), rgba(2,5,8,0.97))", border: "1px solid rgba(6,182,212,0.25)" }}
        >
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <div style={{ fontSize: "40px", marginBottom: "8px" }}>✅</div>
            <h3 style={{ fontSize: "20px", fontWeight: "900", color: "#06b6d4", marginBottom: "4px" }}>科目A 完了</h3>
            <p style={{ color: "#475569", fontSize: "12px" }}>次は科目B（アルゴリズム）です</p>
          </div>

          <ScoreGauge score={scoreA} label="科目A スコア" />

          <div style={{ padding: "12px 16px", borderRadius: "12px", background: "rgba(129,140,248,0.07)", border: "1px solid rgba(129,140,248,0.2)", marginBottom: "20px" }}>
            <p style={{ fontSize: "11px", color: "#818cf8", fontWeight: "700", marginBottom: "4px" }}>📋 科目B について</p>
            <p style={{ fontSize: "11px", color: "#64748b", lineHeight: 1.6 }}>
              擬似コードのトレース問題 {B_TOTAL} 問（100分）。<br />
              コードを手で追いながら値を求めましょう。
            </p>
          </div>

          {!aPassed && (
            <div style={{ padding: "10px 14px", borderRadius: "10px", background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)", marginBottom: "16px" }}>
              <p style={{ fontSize: "11px", color: "#f87171", textAlign: "center" }}>
                ⚠️ 科目A が合格ラインに届いていませんが、科目B に進めます
              </p>
            </div>
          )}

          <button
            onClick={() => setPhase("b")}
            style={{ width: "100%", padding: "15px", borderRadius: "13px", background: "linear-gradient(135deg, #4f46e5, #818cf8)", color: "white", fontWeight: "700", fontSize: "15px", cursor: "pointer", border: "none", boxShadow: "0 4px 18px rgba(79,70,229,0.35)", marginBottom: "10px" }}
          >
            科目B を開始 →
          </button>
          <button
            onClick={closeFEExam}
            style={{ width: "100%", padding: "10px", borderRadius: "12px", background: "transparent", border: "1px solid #1e293b", color: "#334155", fontSize: "12px", cursor: "pointer" }}
          >
            ここで終了してマップに戻る
          </button>
        </motion.div>
      </motion.div>
    );
  }

  // ─── 科目B ───────────────────────────────────────────
  if (phase === "b") {
    return (
      <QuestionView
        q={questionsB[currentB]}
        current={currentB}
        total={B_TOTAL}
        timeLeft={timeLeftB}
        correctCount={correctB}
        phase="b"
        onSelect={handleSelectB}
        onNext={handleNextB}
        onAbort={closeFEExam}
      />
    );
  }

  // ─── 最終結果画面 ─────────────────────────────────────
  if (phase === "result") {
    const passed = scoreA >= PASS_SCORE && scoreB >= PASS_SCORE;
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          position: "fixed", inset: 0, zIndex: 100,
          background: passed
            ? "radial-gradient(ellipse 120% 100% at 50% 60%, #0a0420 0%, #020310 60%, #010108 100%)"
            : "rgba(2,5,8,0.98)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", overflow: "hidden",
        }}
      >
        {/* 合格時：背景の星 */}
        {passed && (
          <>
            {[{x:10,y:15},{x:25,y:70},{x:40,y:20},{x:60,y:80},{x:75,y:30},{x:85,y:60},{x:50,y:10},{x:90,y:85},{x:15,y:50},{x:70,y:45}].map((s, i) => (
              <motion.div key={i}
                animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 2 + i * 0.3, repeat: Infinity }}
                style={{ position: "absolute", left: `${s.x}%`, top: `${s.y}%`, width: "3px", height: "3px", borderRadius: "50%", background: "#818cf8", pointerEvents: "none" }}
              />
            ))}
          </>
        )}

        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", delay: 0.2, damping: 14 }}
          style={{
            maxWidth: "480px", width: "100%", textAlign: "center",
            padding: "36px 28px", borderRadius: "24px",
            background: passed
              ? "radial-gradient(ellipse at top, rgba(129,140,248,0.15), rgba(2,5,8,0.95))"
              : "radial-gradient(ellipse at top, rgba(99,102,241,0.08), rgba(2,5,8,0.98))",
            border: `1px solid ${passed ? "rgba(129,140,248,0.4)" : "#1e293b"}`,
          }}
        >
          <motion.div initial={{ scale: 0, rotate: -120 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", delay: 0.3, damping: 12 }}
            style={{ fontSize: "64px", marginBottom: "12px" }}>
            {passed ? "🏆" : "💫"}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            style={{ fontSize: "28px", fontWeight: "900", marginBottom: "6px", background: passed ? "linear-gradient(135deg, #818cf8, #c084fc)" : "linear-gradient(135deg, #475569, #64748b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
          >
            {passed ? "合格！🎉" : scoreA >= PASS_SCORE || scoreB >= PASS_SCORE ? "一部合格" : "不合格"}
          </motion.h2>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            style={{ color: "#64748b", fontSize: "12px", marginBottom: "24px", lineHeight: 1.6 }}
          >
            {passed
              ? "おめでとうございます！\n基本情報技術者試験を突破しました！"
              : "合格ライン（各科目600点）に向けて\n苦手分野を復習しましょう！"}
          </motion.p>

          {/* スコアゲージ */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
            style={{ textAlign: "left", marginBottom: "20px" }}>
            <ScoreGauge score={scoreA} label="科目A" />
            <ScoreGauge score={scoreB} label="科目B" />
          </motion.div>

          {/* 総合判定 */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
            style={{ padding: "10px 16px", borderRadius: "12px", background: passed ? "rgba(99,102,241,0.12)" : "rgba(239,68,68,0.07)", border: `1px solid ${passed ? "rgba(99,102,241,0.3)" : "rgba(239,68,68,0.2)"}`, marginBottom: "20px" }}
          >
            <p style={{ fontSize: "13px", fontWeight: "700", color: passed ? "#818cf8" : "#64748b" }}>
              {passed ? "✓ 総合判定：合格" : `✗ 総合判定：不合格${scoreA < PASS_SCORE ? "（科目A）" : ""}${scoreB < PASS_SCORE ? "（科目B）" : ""}`}
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}
            style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={closeFEExam}
              style={{ padding: "12px 20px", borderRadius: "12px", border: "1px solid #334155", background: "rgba(30,41,59,0.5)", color: "#94a3b8", fontWeight: "600", cursor: "pointer", fontSize: "14px" }}
            >
              マップに戻る
            </button>
            {passed && (
              <button
                onClick={closeFEExam}
                style={{ padding: "12px 24px", borderRadius: "12px", background: "linear-gradient(135deg, #4f46e5, #818cf8)", color: "white", fontWeight: "800", cursor: "pointer", fontSize: "14px", border: "none", boxShadow: "0 4px 24px rgba(99,102,241,0.4)" }}
              >
                🌌 マップへ戻る
              </button>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }

  return null;
}
