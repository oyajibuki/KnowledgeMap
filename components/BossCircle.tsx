"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/lib/store";
import { BOSS_UNLOCK_THRESHOLD } from "@/lib/data";

export default function BossCircle() {
  const {
    nodes,
    examMode,
    examCompleted,
    examPassed,
    galaxyCompleted,
    selectedNodeId,
    startExam,
  } = useGameStore();

  const masteredCount = nodes.filter((n) => n.status === "mastered").length;
  const isUnlocked = masteredCount >= BOSS_UNLOCK_THRESHOLD;
  const canStart = isUnlocked && !galaxyCompleted;
  const pct = Math.round((masteredCount / BOSS_UNLOCK_THRESHOLD) * 100);

  // Hide during exam or when a node detail is open (on mobile it blocks)
  if (examMode) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 30,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "6px",
        pointerEvents: "none",
      }}
    >
      {/* Floating label */}
      <AnimatePresence>
        {isUnlocked && !galaxyCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            style={{
              padding: "4px 12px",
              borderRadius: "20px",
              background: "rgba(251,191,36,0.15)",
              border: "1px solid rgba(251,191,36,0.4)",
              color: "#fbbf24",
              fontSize: "11px",
              fontWeight: "700",
              whiteSpace: "nowrap",
              pointerEvents: "none",
            }}
          >
            ✨ 過去問ボス解放！タップで挑戦
          </motion.div>
        )}
        {galaxyCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: "4px 12px",
              borderRadius: "20px",
              background: "rgba(251,191,36,0.15)",
              border: "1px solid rgba(251,191,36,0.4)",
              color: "#fbbf24",
              fontSize: "11px",
              fontWeight: "700",
              whiteSpace: "nowrap",
              pointerEvents: "none",
            }}
          >
            🏆 ITパスポート銀河系 制覇！
          </motion.div>
        )}
        {!isUnlocked && masteredCount > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              padding: "3px 10px",
              borderRadius: "20px",
              background: "rgba(15,23,42,0.7)",
              border: "1px solid #1e293b",
              color: "#475569",
              fontSize: "10px",
              whiteSpace: "nowrap",
              pointerEvents: "none",
            }}
          >
            あと {BOSS_UNLOCK_THRESHOLD - masteredCount} 個習得で解放
          </motion.div>
        )}
      </AnimatePresence>

      {/* Boss orb */}
      <motion.button
        onClick={canStart ? startExam : undefined}
        animate={
          canStart
            ? {
                boxShadow: [
                  "0 0 16px rgba(251,191,36,0.25)",
                  "0 0 36px rgba(251,191,36,0.55)",
                  "0 0 16px rgba(251,191,36,0.25)",
                ],
              }
            : {}
        }
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        whileHover={canStart ? { scale: 1.1 } : {}}
        whileTap={canStart ? { scale: 0.93 } : {}}
        style={{
          width: "84px",
          height: "84px",
          borderRadius: "50%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "2px",
          cursor: canStart ? "pointer" : "default",
          border: galaxyCompleted
            ? "2.5px solid #fbbf24"
            : isUnlocked
            ? "2.5px solid rgba(251,191,36,0.7)"
            : "2px solid #334155",
          background: galaxyCompleted
            ? "radial-gradient(circle at 35% 30%, #fef3c7, #f59e0b 55%, #92400e)"
            : isUnlocked
            ? "radial-gradient(circle at 35% 30%, #fef9c3, #fbbf24 55%, #b45309)"
            : "radial-gradient(circle at 35% 30%, #1e2d45, #0f172a)",
          pointerEvents: "auto",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Inner glow ring for unlocked */}
        {isUnlocked && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            style={{
              position: "absolute",
              inset: "4px",
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.25)",
            }}
          />
        )}

        {galaxyCompleted ? (
          <>
            <span style={{ fontSize: "28px", position: "relative" }}>🏆</span>
            <span style={{ fontSize: "9px", color: "#fef3c7", fontWeight: "800", position: "relative" }}>
              制覇！
            </span>
          </>
        ) : isUnlocked ? (
          <>
            <span style={{ fontSize: "26px", position: "relative" }}>⚡</span>
            <span
              style={{
                fontSize: "8px",
                color: "#fef3c7",
                fontWeight: "800",
                lineHeight: 1.2,
                textAlign: "center",
                position: "relative",
              }}
            >
              過去問<br />挑戦
            </span>
          </>
        ) : (
          <>
            <span style={{ fontSize: "20px" }}>🔒</span>
            <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "700" }}>
              {masteredCount}/{BOSS_UNLOCK_THRESHOLD}
            </span>
          </>
        )}
      </motion.button>

      {/* Progress arc when locked */}
      {!isUnlocked && (
        <div
          style={{
            width: "72px",
            height: "4px",
            borderRadius: "2px",
            background: "#1e293b",
            overflow: "hidden",
            pointerEvents: "none",
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              height: "100%",
              borderRadius: "2px",
              background: "linear-gradient(90deg, #4f46e5, #7c3aed)",
            }}
          />
        </div>
      )}

      {/* Retry badge if failed */}
      {examCompleted && !examPassed && !galaxyCompleted && isUnlocked && (
        <div
          style={{
            fontSize: "9px",
            color: "#ef4444",
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: "10px",
            padding: "2px 8px",
            pointerEvents: "none",
          }}
        >
          前回不合格 — 再挑戦
        </div>
      )}
    </div>
  );
}
