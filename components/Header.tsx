"use client";

import Link from "next/link";
import { useGameStore } from "@/lib/store";
import { useAuthStore } from "@/lib/auth-store";

export default function Header() {
  const { nodes, galaxyCompleted } = useGameStore();
  const { user, openAuthModal, signOut } = useAuthStore();

  const total = nodes.length;
  const mastered = nodes.filter((n) => n.status === "mastered").length;
  const viewed = nodes.filter((n) => n.status === "viewed").length;
  const progress = Math.round((mastered / total) * 100);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-3 md:px-6 py-2.5"
      style={{
        background: "rgba(9,11,20,0.88)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #1e293b",
        gap: "8px",
      }}
    >
      {/* 左: タイトル + バッジ */}
      <div className="flex items-center gap-1.5 md:gap-3 min-w-0 flex-shrink-0">
        <Link
          href="/"
          style={{ textDecoration: "none" }}
          className="text-sm md:text-base font-bold tracking-tight whitespace-nowrap"
        >
          <span
            style={{
              background: "linear-gradient(135deg, #818cf8, #c084fc)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            ⚡ Knowledge Map
          </span>
        </Link>
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

      {/* 中央: 宇宙ナビ（常時表示） */}
      <Link
        href="/universe"
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full transition-all hover:scale-105"
        style={{
          background: galaxyCompleted
            ? "rgba(251,191,36,0.12)"
            : "rgba(129,140,248,0.08)",
          border: `1px solid ${galaxyCompleted ? "rgba(251,191,36,0.35)" : "rgba(129,140,248,0.2)"}`,
          textDecoration: "none",
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: "13px" }}>🌌</span>
        <span
          className="hidden sm:inline"
          style={{
            fontSize: "11px",
            fontWeight: "700",
            color: galaxyCompleted ? "#fbbf24" : "#818cf8",
            whiteSpace: "nowrap",
          }}
        >
          宇宙
        </span>
        {galaxyCompleted && (
          <span style={{ fontSize: "10px", color: "#fbbf24" }}>✓</span>
        )}
      </Link>

      {/* 右: 統計 + プログレスバー + ログイン */}
      <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
        {/* 統計（md以上のみ） */}
        <div className="hidden md:flex items-center gap-3 text-xs" style={{ color: "#64748b" }}>
          <span><span style={{ color: "#a78bfa" }}>⭐ {mastered}</span> 習得</span>
          <span><span style={{ color: "#60a5fa" }}>👁 {viewed}</span> 閲覧</span>
        </div>

        {/* モバイル: ⭐X/31 */}
        <div className="flex md:hidden items-center gap-1 text-xs flex-shrink-0">
          <span style={{ color: "#a78bfa" }}>⭐{mastered}</span>
          <span style={{ color: "#475569" }}>/</span>
          <span style={{ color: "#475569" }}>{total}</span>
        </div>

        {/* 進捗バー */}
        <div className="flex items-center gap-1.5">
          <div
            className="w-16 md:w-28 h-1.5 rounded-full overflow-hidden"
            style={{ background: "#1e293b" }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #4f46e5, #7c3aed, #a78bfa)",
                boxShadow: "0 0 6px #7c3aed",
              }}
            />
          </div>
          <span className="text-xs hidden sm:inline" style={{ color: "#a78bfa" }}>
            {progress}%
          </span>
        </div>

        {/* ログインボタン */}
        {user ? (
          <button
            onClick={signOut}
            title={user.email || "ログアウト"}
            className="flex items-center gap-1.5 px-2 py-1 rounded-full transition-all hover:opacity-80"
            style={{
              background: "rgba(34,197,94,0.1)",
              border: "1px solid rgba(34,197,94,0.3)",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            {user.user_metadata?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.user_metadata.avatar_url}
                alt="avatar"
                style={{ width: "18px", height: "18px", borderRadius: "50%" }}
              />
            ) : (
              <span style={{ fontSize: "14px" }}>👤</span>
            )}
            <span style={{ fontSize: "10px", color: "#22c55e", fontWeight: "700" }}>
              <span className="hidden sm:inline">保存中</span>
              <span className="sm:hidden">●</span>
            </span>
          </button>
        ) : (
          <button
            onClick={openAuthModal}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full transition-all hover:opacity-90 active:scale-95"
            style={{
              background: "rgba(66,133,244,0.15)",
              border: "1px solid rgba(66,133,244,0.35)",
              color: "#93c5fd",
              fontSize: "11px",
              fontWeight: "700",
              cursor: "pointer",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: "13px" }}>G</span>
            <span className="hidden sm:inline">ログイン</span>
          </button>
        )}
      </div>
    </header>
  );
}
