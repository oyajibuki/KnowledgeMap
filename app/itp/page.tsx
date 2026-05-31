"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import NodeDetail from "@/components/NodeDetail";
import APNodeDetail from "@/components/APNodeDetail";
import APExamMode from "@/components/APExamMode";
import GalaxyComplete from "@/components/GalaxyComplete";

const KnowledgeMap = dynamic(() => import("@/components/KnowledgeMap"), {
  ssr: false,
});
const ExamMode = dynamic(() => import("@/components/ExamMode"), {
  ssr: false,
});
const FEExamMode = dynamic(() => import("@/components/FEExamMode"), {
  ssr: false,
});

export default function ITPPage() {
  useEffect(() => {
    fetch(
      "https://script.google.com/macros/s/AKfycbznxYkj5ixnK_pHkGR8LUYhEYdvSYpaiF3x4LaZy964wlu068oak1X1uuIiyqCEtGWF/exec?page=KnowledgeMap"
    ).catch(() => {});
  }, []);

  return (
    <div
      className="flex flex-col"
      style={{
        width: "100vw",
        height: "100dvh",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* 深宇宙背景 */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, #0a1628 0%, #060a14 60%, #020508 100%)",
          zIndex: 0,
        }}
      />
      {/* 同心円 */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: [
            "radial-gradient(circle at 50% 55%, transparent 18%, rgba(6,182,212,0.03) 18.5%, transparent 19%)",
            "radial-gradient(circle at 50% 55%, transparent 34%, rgba(6,182,212,0.025) 34.5%, transparent 35%)",
            "radial-gradient(circle at 50% 55%, transparent 52%, rgba(6,182,212,0.02) 52.5%, transparent 53%)",
            "radial-gradient(circle at 50% 55%, transparent 72%, rgba(6,182,212,0.015) 72.5%, transparent 73%)",
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
            "radial-gradient(1px 1px at 60% 40%, rgba(255,255,255,0.11) 0%, transparent 100%)",
            "radial-gradient(1.5px 1.5px at 90% 85%, rgba(255,255,255,0.16) 0%, transparent 100%)",
          ].join(", "),
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      <Header />

      <main
        className="flex-1"
        style={{ paddingTop: "56px", position: "relative", zIndex: 2 }}
      >
        <KnowledgeMap />
      </main>

      <NodeDetail />
      <APNodeDetail />
      <ExamMode />
      <FEExamMode />
      <APExamMode />
      <GalaxyComplete />
    </div>
  );
}
