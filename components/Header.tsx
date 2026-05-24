"use client";

import Link from "next/link";
import { useGameStore } from "@/lib/store";
import { useAuthStore } from "@/lib/auth-store";

export default function Header() {
  const { nodes, galaxyCompleted } = useGameStore();
  const { user, openAuthModal, signOut } = useAuthStore();

  const total = nodes.length;
  const mastered = nodes.filter((n) => n.status === "mastered").length;
  const progress = Math.round((mastered / total) * 100);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-3 md:px-5 py-2.5"
      style={{
        background: "rgba(6,10,20,0.88)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #1e293b",
        gap: "8px",
        height: "52px",
      }}
    >
      {/* 左: 銀河系に戻る */}
      <Link
        href="/universe"
        style={{ textDecoration: "none", flexShrink: 0 }}
        className="flex items-center gap-1.5"
      >
        <span style={{ fontSize: "16px" }}>🌌</span>
        <span
          className="hidden sm:inline"
          style={{
            fontSize: "11px",
            color: "#475569",
            fontWeight: "600",
            whiteSpace: "nowrap",
          }}
        >
          銀河系
        </span>
        <span
          className="hidden sm:inline"
          style={{ fontSize: "11px", color: "#334155" }}
        >
          /
        </span>
        <span
          className="hidden sm:inline"
          style={{
            fontSize: "11px",
            color: "#06b6d4",
            fontWeight: "700",
            whiteSpace: "nowrap",
          }}
        >
          ⚡ ITパスポート
        </span>
      </Link>

      {/* モバイル: ⚡ のみ */}
      <Link
        href="/universe"
        className="flex sm:hidden items-center gap-1"
        style={{ textDecoration: "none" }}
      >
        <span style={{ fontSize: "14px" }}>🌌</span>
        <span style={{ fontSize: "10px", color: "#475569" }}>/</span>
        <span style={{ fontSize: "13px" }}>⚡</span>
      </Link>

      {/* 右: 進捗 + ログイン */}
      <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
        {/* 統計（md以上） */}
        <div
          className="hidden md:flex items-center gap-3 text-xs"
          style={{ color: "#64748b" }}
        >
          <span>
            <span style={{ color: "#a78bfa" }}>⭐ {mastered}</span> 習得
          </span>
          <span style={{ color: "#475569" }}>/ {total}</span>
        </div>

        {/* モバイル: ⭐X/31 */}
        <div
          className="flex md:hidden items-center gap-1 text-xs flex-shrink-0"
        >
          <span style={{ color: "#a78bfa" }}>⭐{mastered}</span>
          <span style={{ color: "#334155" }}>/{total}</span>
        </div>

        {/* 進捗バー */}
        <div className="flex items-center gap-1.5">
          <div
            className="w-16 md:w-24 h-1.5 rounded-full overflow-hidden"
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
          <span
            className="text-xs"
            style={{ color: "#a78bfa", minWidth: "28px" }}
          >
            {progress}%
          </span>
        </div>

        {/* ログインボタン */}
        {user ? (
          <button
            onClick={signOut}
            title={`${user.email} (タップでログアウト)`}
            className="flex items-center gap-1.5 px-2 py-1 rounded-full"
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
                alt=""
                style={{ width: "18px", height: "18px", borderRadius: "50%" }}
              />
            ) : (
              <span style={{ fontSize: "14px" }}>👤</span>
            )}
            <span
              className="hidden sm:inline"
              style={{ fontSize: "10px", color: "#22c55e", fontWeight: "700" }}
            >
              保存中
            </span>
          </button>
        ) : (
          <button
            onClick={openAuthModal}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full"
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
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              style={{ flexShrink: 0 }}
            >
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="hidden sm:inline">ログイン</span>
          </button>
        )}
      </div>
    </header>
  );
}
