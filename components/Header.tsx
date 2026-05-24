"use client";

import { useGameStore } from "@/lib/store";

export default function Header() {
  const { nodes } = useGameStore();
  const total = nodes.length;
  const mastered = nodes.filter((n) => n.status === "mastered").length;
  const viewed = nodes.filter((n) => n.status === "viewed").length;
  const progress = Math.round((mastered / total) * 100);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 md:px-6 py-3"
      style={{
        background: "rgba(9,11,20,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #1e293b",
      }}
    >
      {/* 左: タイトル + バッジ */}
      <div className="flex items-center gap-2 md:gap-3 min-w-0">
        <div
          className="text-base md:text-lg font-bold tracking-tight whitespace-nowrap"
          style={{
            background: "linear-gradient(135deg, #818cf8, #c084fc)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          ⚡ Knowledge Map
        </div>
        <span
          className="hidden sm:inline-block text-xs px-2 py-0.5 rounded-full whitespace-nowrap"
          style={{
            background: "rgba(79,70,229,0.15)",
            color: "#818cf8",
            border: "1px solid #4f46e5",
          }}
        >
          ITパスポート
        </span>
      </div>

      {/* 右: 統計 + 進捗バー */}
      <div className="flex items-center gap-3 md:gap-6">
        {/* 統計（md以上のみ表示） */}
        <div className="hidden md:flex items-center gap-4 text-xs" style={{ color: "#64748b" }}>
          <span>
            <span style={{ color: "#a78bfa" }}>⭐ {mastered}</span> 習得
          </span>
          <span>
            <span style={{ color: "#60a5fa" }}>👁 {viewed}</span> 閲覧
          </span>
          <span>
            <span style={{ color: "#64748b" }}>🔒 {total - mastered - viewed}</span> 未解放
          </span>
        </div>

        {/* モバイル: 小さなバッジのみ */}
        <div className="flex md:hidden items-center gap-2 text-xs">
          <span style={{ color: "#a78bfa" }}>⭐{mastered}</span>
          <span style={{ color: "#64748b" }}>/</span>
          <span style={{ color: "#64748b" }}>{total}</span>
        </div>

        {/* 進捗バー */}
        <div className="flex items-center gap-2">
          <div
            className="w-20 md:w-32 h-2 rounded-full overflow-hidden"
            style={{ background: "#1e293b" }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #4f46e5, #7c3aed, #a78bfa)",
                boxShadow: "0 0 8px #7c3aed",
              }}
            />
          </div>
          <span className="text-xs" style={{ color: "#a78bfa" }}>
            {progress}%
          </span>
        </div>
      </div>
    </header>
  );
}
