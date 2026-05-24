"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/lib/store";

// 固定の星データ（ランダムをコンポーネント外で生成してSSR安全に）
const STARS = [
  { id: 0, x: 8, y: 12, s: 2.1, d: 0.1 }, { id: 1, x: 18, y: 45, s: 1.5, d: 0.4 },
  { id: 2, x: 28, y: 78, s: 2.8, d: 0.8 }, { id: 3, x: 35, y: 22, s: 1.2, d: 0.2 },
  { id: 4, x: 42, y: 60, s: 2.3, d: 0.6 }, { id: 5, x: 52, y: 8, s: 1.8, d: 0.3 },
  { id: 6, x: 61, y: 88, s: 2.5, d: 0.9 }, { id: 7, x: 70, y: 35, s: 1.4, d: 0.5 },
  { id: 8, x: 80, y: 68, s: 2.0, d: 0.7 }, { id: 9, x: 90, y: 18, s: 1.7, d: 0.1 },
  { id: 10, x: 5, y: 55, s: 1.3, d: 1.0 }, { id: 11, x: 15, y: 90, s: 2.4, d: 0.3 },
  { id: 12, x: 25, y: 40, s: 1.6, d: 0.8 }, { id: 13, x: 38, y: 72, s: 2.2, d: 0.5 },
  { id: 14, x: 47, y: 30, s: 1.9, d: 0.2 }, { id: 15, x: 58, y: 50, s: 2.7, d: 0.9 },
  { id: 16, x: 65, y: 15, s: 1.1, d: 0.4 }, { id: 17, x: 75, y: 82, s: 2.3, d: 0.6 },
  { id: 18, x: 85, y: 44, s: 1.8, d: 0.1 }, { id: 19, x: 93, y: 70, s: 2.0, d: 0.7 },
  { id: 20, x: 12, y: 28, s: 1.5, d: 0.5 }, { id: 21, x: 22, y: 62, s: 2.6, d: 0.3 },
  { id: 22, x: 33, y: 95, s: 1.3, d: 0.8 }, { id: 23, x: 44, y: 48, s: 2.1, d: 0.2 },
  { id: 24, x: 55, y: 20, s: 1.7, d: 0.9 }, { id: 25, x: 66, y: 75, s: 2.4, d: 0.4 },
  { id: 26, x: 77, y: 10, s: 1.9, d: 0.6 }, { id: 27, x: 88, y: 58, s: 2.8, d: 0.1 },
  { id: 28, x: 96, y: 38, s: 1.4, d: 0.7 }, { id: 29, x: 3, y: 82, s: 2.2, d: 0.5 },
  { id: 30, x: 10, y: 5, s: 1.6, d: 0.3 }, { id: 31, x: 20, y: 33, s: 2.0, d: 0.8 },
  { id: 32, x: 30, y: 55, s: 1.2, d: 0.2 }, { id: 33, x: 40, y: 85, s: 2.5, d: 0.9 },
  { id: 34, x: 50, y: 42, s: 1.8, d: 0.4 }, { id: 35, x: 60, y: 95, s: 2.3, d: 0.6 },
  { id: 36, x: 72, y: 25, s: 1.5, d: 0.1 }, { id: 37, x: 82, y: 65, s: 2.7, d: 0.7 },
  { id: 38, x: 91, y: 48, s: 1.3, d: 0.5 }, { id: 39, x: 97, y: 20, s: 2.1, d: 0.3 },
];

export default function GalaxyComplete() {
  const { showGalaxyComplete, examScore, dismissGalaxyComplete } = useGameStore();
  const router = useRouter();

  return (
    <AnimatePresence>
      {showGalaxyComplete && (
        <motion.div
          key="galaxy-complete"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            background:
              "radial-gradient(ellipse 120% 100% at 50% 60%, #0a0420 0%, #020310 60%, #010108 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {/* 背景の星 */}
          {STARS.map((star) => (
            <motion.div
              key={star.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0.6, 1], scale: 1 }}
              transition={{
                delay: star.d * 0.8,
                duration: 1.2,
                repeat: Infinity,
                repeatDelay: 1.5 + star.d,
              }}
              style={{
                position: "absolute",
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.s}px`,
                height: `${star.s}px`,
                borderRadius: "50%",
                background: "white",
                pointerEvents: "none",
              }}
            />
          ))}

          {/* 回転するリング */}
          {[500, 360, 220].map((size, i) => (
            <motion.div
              key={size}
              animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
              transition={{
                duration: 20 + i * 8,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                position: "absolute",
                width: `${size}px`,
                height: `${size}px`,
                borderRadius: "50%",
                border: `1px solid rgba(251,191,36,${0.04 + i * 0.02})`,
                pointerEvents: "none",
              }}
            />
          ))}

          {/* コンテンツ */}
          <div
            style={{
              position: "relative",
              textAlign: "center",
              padding: "32px 24px",
              maxWidth: "480px",
              width: "100%",
            }}
          >
            {/* トロフィー */}
            <motion.div
              initial={{ scale: 0, rotate: -120 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", delay: 0.3, damping: 11 }}
              style={{ fontSize: "76px", marginBottom: "20px" }}
            >
              🏆
            </motion.div>

            {/* タイトル */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              style={{
                fontSize: "clamp(22px, 6vw, 36px)",
                fontWeight: "900",
                background:
                  "linear-gradient(135deg, #fbbf24, #fde68a, #f59e0b)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                marginBottom: "4px",
                letterSpacing: "-0.01em",
              }}
            >
              ITパスポート銀河系
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85 }}
              style={{
                fontSize: "clamp(28px, 7vw, 44px)",
                fontWeight: "900",
                background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                marginBottom: "28px",
              }}
            >
              制　覇！
            </motion.p>

            {/* スコア */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.05 }}
              style={{
                padding: "18px 36px",
                borderRadius: "18px",
                background: "rgba(251,191,36,0.1)",
                border: "1px solid rgba(251,191,36,0.3)",
                marginBottom: "28px",
                display: "inline-block",
              }}
            >
              <p
                style={{
                  color: "#78716c",
                  fontSize: "12px",
                  marginBottom: "4px",
                  letterSpacing: "0.08em",
                }}
              >
                過去問スコア
              </p>
              <p
                style={{
                  fontSize: "44px",
                  fontWeight: "900",
                  color: "#fbbf24",
                  lineHeight: 1,
                }}
              >
                {examScore}
                <span style={{ fontSize: "20px", color: "#92400e" }}>
                  {" "}
                  / 100
                </span>
              </p>
            </motion.div>

            {/* ボタン */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.25 }}
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => {
                  dismissGalaxyComplete();
                  router.push("/universe");  // 宇宙ビューへ
                }}
                style={{
                  padding: "14px 28px",
                  borderRadius: "14px",
                  background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                  color: "#1a0500",
                  fontWeight: "800",
                  fontSize: "15px",
                  cursor: "pointer",
                  border: "none",
                  boxShadow: "0 4px 24px rgba(251,191,36,0.45)",
                }}
              >
                🌌 宇宙を探索する
              </button>
              <button
                onClick={dismissGalaxyComplete}
                style={{
                  padding: "14px 20px",
                  borderRadius: "14px",
                  background: "transparent",
                  border: "1px solid #334155",
                  color: "#64748b",
                  fontWeight: "600",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                マップに戻る
              </button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
