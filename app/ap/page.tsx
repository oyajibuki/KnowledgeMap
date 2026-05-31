"use client";

import dynamic from "next/dynamic";
import Header from "@/components/Header";
import APNodeDetail from "@/components/APNodeDetail";
import APExamMode from "@/components/APExamMode";
import { useAPStore } from "@/lib/ap-store";

const APKnowledgeMap = dynamic(() => import("@/components/APKnowledgeMap"), {
  ssr: false,
});

export default function APPage() {
  const { startExam } = useAPStore();

  return (
    <div
      className="flex flex-col"
      style={{ width: "100vw", height: "100dvh", overflow: "hidden", position: "relative" }}
    >
      {/* 深宇宙背景 */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, #061a10 0%, #040d08 60%, #020508 100%)",
          zIndex: 0,
        }}
      />
      {/* 同心円（グリーン系） */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: [
            "radial-gradient(circle at 50% 55%, transparent 18%, rgba(52,211,153,0.03) 18.5%, transparent 19%)",
            "radial-gradient(circle at 50% 55%, transparent 34%, rgba(52,211,153,0.025) 34.5%, transparent 35%)",
            "radial-gradient(circle at 50% 55%, transparent 52%, rgba(52,211,153,0.02) 52.5%, transparent 53%)",
            "radial-gradient(circle at 50% 55%, transparent 72%, rgba(52,211,153,0.015) 72.5%, transparent 73%)",
          ].join(", "),
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
      {/* 星屑 */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: [
            "radial-gradient(1px 1px at 15% 25%, rgba(255,255,255,0.18) 0%, transparent 100%)",
            "radial-gradient(1px 1px at 75% 15%, rgba(255,255,255,0.12) 0%, transparent 100%)",
            "radial-gradient(1px 1px at 40% 70%, rgba(255,255,255,0.14) 0%, transparent 100%)",
            "radial-gradient(1px 1px at 85% 60%, rgba(255,255,255,0.10) 0%, transparent 100%)",
            "radial-gradient(1px 1px at 25% 80%, rgba(255,255,255,0.08) 0%, transparent 100%)",
            "radial-gradient(1.5px 1.5px at 60% 35%, rgba(255,255,255,0.11) 0%, transparent 100%)",
          ].join(", "),
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      <Header />

      {/* 試験ボタン */}
      <div
        style={{
          position: "fixed",
          bottom: 28,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 20,
        }}
      >
        <button
          onClick={() => startExam("gozen")}
          className="px-6 py-3 rounded-2xl text-sm font-bold transition-all hover:scale-105 active:scale-95"
          style={{
            background: "linear-gradient(135deg, #059669, #10b981)",
            color: "white",
            boxShadow: "0 0 24px rgba(16,185,129,0.4)",
            border: "1px solid rgba(52,211,153,0.4)",
          }}
        >
          🎯 模擬試験を開始（{Math.min(50, 50)}問）
        </button>
      </div>

      <main
        className="flex-1"
        style={{ paddingTop: "56px", position: "relative", zIndex: 2 }}
      >
        <APKnowledgeMap />
      </main>

      <APNodeDetail />
      <APExamMode />
    </div>
  );
}
