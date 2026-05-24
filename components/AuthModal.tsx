"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/lib/auth-store";
import { supabase } from "@/lib/supabase";

export default function AuthModal() {
  const { authModalOpen, closeAuthModal, signInWithGoogle, authLoading, authError } = useAuthStore();

  const isSupabaseConfigured = !!supabase;

  return (
    <AnimatePresence>
      {authModalOpen && (
        <>
          {/* バックドロップ */}
          <motion.div
            key="auth-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAuthModal}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 150,
              background: "rgba(0,0,0,0.7)",
              backdropFilter: "blur(4px)",
            }}
          />

          {/* モーダル */}
          <motion.div
            key="auth-modal"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 20 }}
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 151,
              width: "min(340px, calc(100vw - 32px))",
              padding: "32px 28px",
              borderRadius: "24px",
              background: "radial-gradient(ellipse at top, rgba(79,70,229,0.12), #0a0f1e)",
              border: "1px solid #1e293b",
              textAlign: "center",
            }}
          >
            {/* 閉じるボタン */}
            <button
              onClick={closeAuthModal}
              style={{
                position: "absolute",
                top: "14px",
                right: "16px",
                background: "transparent",
                border: "none",
                color: "#475569",
                fontSize: "18px",
                cursor: "pointer",
                lineHeight: 1,
              }}
            >
              ×
            </button>

            {/* ロゴ */}
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>⚡</div>

            <h2
              style={{
                fontSize: "20px",
                fontWeight: "800",
                background: "linear-gradient(135deg, #818cf8, #c084fc)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                marginBottom: "8px",
              }}
            >
              Knowledge Map
            </h2>

            <p style={{ color: "#64748b", fontSize: "13px", marginBottom: "28px", lineHeight: 1.6 }}>
              Googleアカウントでログインすると、<br />
              学習進捗がどのデバイスでも引き継がれます。
            </p>

            {/* 機能比較 */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "8px",
                marginBottom: "24px",
                textAlign: "left",
              }}
            >
              {[
                { label: "お試し（ゲスト）", features: ["このデバイスのみ保存", "全機能利用可能", "ログイン不要"], isGuest: true },
                { label: "Googleログイン", features: ["クラウド保存 ☁️", "全デバイス共有 📱", "将来のiOSアプリに対応"], isGuest: false },
              ].map((col) => (
                <div
                  key={col.label}
                  style={{
                    padding: "14px 12px",
                    borderRadius: "14px",
                    background: col.isGuest ? "rgba(30,41,59,0.4)" : "rgba(79,70,229,0.12)",
                    border: col.isGuest ? "1px solid #1e293b" : "1px solid rgba(79,70,229,0.3)",
                  }}
                >
                  <p
                    style={{
                      fontSize: "11px",
                      fontWeight: "800",
                      color: col.isGuest ? "#64748b" : "#818cf8",
                      marginBottom: "8px",
                    }}
                  >
                    {col.label}
                  </p>
                  {col.features.map((f) => (
                    <p key={f} style={{ fontSize: "11px", color: "#475569", marginBottom: "3px" }}>
                      {f}
                    </p>
                  ))}
                </div>
              ))}
            </div>

            {/* エラー表示 */}
            {authError && (
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: "10px",
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  color: "#fca5a5",
                  fontSize: "12px",
                  marginBottom: "12px",
                  lineHeight: 1.5,
                  textAlign: "left",
                }}
              >
                <p style={{ fontWeight: "700", marginBottom: "4px" }}>⚠️ ログインエラー</p>
                <p style={{ color: "#94a3b8" }}>{authError}</p>
                <p style={{ color: "#64748b", marginTop: "6px", fontSize: "11px" }}>
                  Google Cloud ConsoleでリダイレクトURIを確認してください：<br />
                  <span style={{ color: "#475569", wordBreak: "break-all" }}>
                    https://[project].supabase.co/auth/v1/callback
                  </span>
                </p>
              </div>
            )}

            {/* Googleログインボタン */}
            {isSupabaseConfigured ? (
              <button
                onClick={signInWithGoogle}
                disabled={authLoading}
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: "14px",
                  background: authLoading ? "#e2e8f0" : "white",
                  border: "none",
                  color: "#1a1a1a",
                  fontWeight: "700",
                  fontSize: "14px",
                  cursor: authLoading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  marginBottom: "12px",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
                  opacity: authLoading ? 0.7 : 1,
                }}
              >
                {authLoading ? (
                  <span style={{ fontSize: "14px" }}>⏳ リダイレクト中...</span>
                ) : (
                  <>
                    {/* Google G ロゴ */}
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Googleでログイン
                  </>
                )}
              </button>
            ) : (
              <div
                style={{
                  padding: "14px",
                  borderRadius: "14px",
                  background: "rgba(30,41,59,0.5)",
                  border: "1px solid #334155",
                  color: "#475569",
                  fontSize: "12px",
                  marginBottom: "12px",
                  lineHeight: 1.6,
                }}
              >
                🔧 Supabase未設定<br />
                <span style={{ color: "#334155" }}>
                  .env.local に SUPABASE_URL と SUPABASE_ANON_KEY を設定してください
                </span>
              </div>
            )}

            {/* ゲストとして続けるボタン */}
            <button
              onClick={closeAuthModal}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "12px",
                background: "transparent",
                border: "1px solid #1e293b",
                color: "#475569",
                fontWeight: "600",
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              ゲストとして続ける（このデバイスのみ保存）
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
