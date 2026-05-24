"use client";

import dynamic from "next/dynamic";
import Header from "@/components/Header";
import NodeDetail from "@/components/NodeDetail";

const KnowledgeMap = dynamic(() => import("@/components/KnowledgeMap"), {
  ssr: false,
});

export default function Home() {
  return (
    <div
      className="flex flex-col"
      style={{
        width: "100vw",
        /* iOS Safari アドレスバーによる 100vh 問題を dvh で解消 */
        height: "100dvh",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* 深宇宙 + 石板テクスチャ風の背景 */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: [
            "radial-gradient(ellipse 80% 60% at 50% 50%, #0a1628 0%, #060a14 60%, #020508 100%)",
          ].join(", "),
          zIndex: 0,
        }}
      />

      {/* 薄い同心円 — マップの雰囲気を演出 */}
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
    </div>
  );
}
