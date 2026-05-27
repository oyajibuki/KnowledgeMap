"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuthStore } from "@/lib/auth-store";

/* 背景星 */
const STARS = [
  { id:0,x:8,y:12,s:1.8 },{id:1,x:15,y:55,s:1.2},{id:2,x:22,y:78,s:2.2},
  {id:3,x:30,y:25,s:1.5},{id:4,x:38,y:68,s:1.0},{id:5,x:48,y:10,s:2.0},
  {id:6,x:55,y:88,s:1.4},{id:7,x:63,y:40,s:1.8},{id:8,x:72,y:20,s:1.2},
  {id:9,x:80,y:72,s:2.4},{id:10,x:88,y:35,s:1.6},{id:11,x:93,y:60,s:1.0},
  {id:12,x:5,y:85,s:2.0},{id:13,x:42,y:48,s:1.3},{id:14,x:68,y:92,s:1.7},
  {id:15,x:97,y:18,s:1.5},{id:16,x:18,y:38,s:1.1},{id:17,x:52,y:62,s:2.1},
  {id:18,x:76,y:48,s:1.4},{id:19,x:35,y:5,s:1.9},
];

/* ミニ資格コンステレーション */
const NODES = [
  { icon:"⚡", color:"#06b6d4", size:42, x:48, y:38, delay:0.0, label:"IT"     },
  { icon:"💻", color:"#06b6d4", size:32, x:78, y:15, delay:0.1, label:"FE"     },
  { icon:"🔒", color:"#38bdf8", size:28, x:18, y:15, delay:0.2, label:"SG"     },
  { icon:"💰", color:"#10b981", size:30, x:5,  y:50, delay:0.3, label:"FP"     },
  { icon:"📊", color:"#818cf8", size:28, x:22, y:82, delay:0.4, label:"簿記"   },
  { icon:"🏠", color:"#f59e0b", size:30, x:92, y:60, delay:0.5, label:"宅建"   },
  { icon:"🔵", color:"#38bdf8", size:28, x:68, y:78, delay:0.6, label:"Cisco"  },
  { icon:"☁️", color:"#34d399", size:32, x:86, y:32, delay:0.7, label:"Cloud"  },
  { icon:"⚖️", color:"#f87171", size:26, x:38, y:90, delay:0.8, label:"法務"   },
  { icon:"🗂️", color:"#c084fc", size:30, x:62, y:60, delay:0.9, label:"PM"     },
  { icon:"🌍", color:"#60a5fa", size:26, x:32, y:20, delay:1.0, label:"文化"   },
  { icon:"🐧", color:"#fb923c", size:26, x:70, y:5,  delay:1.1, label:"Linux"  },
];

/* コンステレーション接続線（SVG用） */
const LINES = [
  [0,1],[0,2],[0,9],[0,7],[1,7],[0,4],[0,6],[9,6],
];

export default function LandingPage() {
  const router = useRouter();
  const { user, signInWithGoogle } = useAuthStore();

  useEffect(() => {
    if (user) router.replace("/itp");
  }, [user, router]);

  return (
    <div
      style={{
        minHeight: "100dvh",
        background:
          "radial-gradient(ellipse 100% 80% at 50% 40%, #0a1628 0%, #060a14 55%, #020508 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* 背景：同心円 */}
      <div
        style={{
          position: "fixed", inset: 0, pointerEvents: "none",
          backgroundImage: [
            "radial-gradient(circle at 50% 55%, transparent 18%, rgba(6,182,212,0.025) 18.5%, transparent 19%)",
            "radial-gradient(circle at 50% 55%, transparent 38%, rgba(6,182,212,0.018) 38.5%, transparent 39%)",
            "radial-gradient(circle at 50% 55%, transparent 60%, rgba(6,182,212,0.012) 60.5%, transparent 61%)",
          ].join(", "),
        }}
      />

      {/* 星 */}
      {STARS.map((s) => (
        <motion.div
          key={s.id}
          animate={{ opacity: [0.1, 0.5, 0.1] }}
          transition={{ duration: 3 + s.id * 0.2, repeat: Infinity }}
          style={{
            position: "absolute", left:`${s.x}%`, top:`${s.y}%`,
            width:`${s.s}px`, height:`${s.s}px`,
            borderRadius: "50%", background: "white", pointerEvents: "none",
          }}
        />
      ))}

      {/* ── メインコンテンツ ── */}
      <div style={{ position: "relative", width: "100%", maxWidth: "400px", textAlign: "center" }}>

        {/* ロゴ */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 14, delay: 0.1 }}
          style={{ fontSize: "64px", marginBottom: "14px" }}
        >
          🌌
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            fontSize: "clamp(26px, 7vw, 38px)",
            fontWeight: "900",
            letterSpacing: "-0.02em",
            marginBottom: "8px",
            background: "linear-gradient(135deg, #818cf8, #c084fc, #818cf8)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Knowledge Map
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          style={{ color: "#475569", fontSize: "13px", marginBottom: "28px", lineHeight: 1.6 }}
        >
          すべての資格を、ひとつの知識宇宙で管理しよう
        </motion.p>

        {/* ── コンステレーション ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            position: "relative",
            width: "100%",
            height: "170px",
            marginBottom: "28px",
          }}
        >
          {/* 接続線（SVG） */}
          <svg
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {LINES.map(([a, b], i) => (
              <motion.line
                key={i}
                x1={NODES[a].x} y1={NODES[a].y}
                x2={NODES[b].x} y2={NODES[b].y}
                stroke="rgba(129,140,248,0.18)"
                strokeWidth="0.4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: 0.8 + i * 0.06, duration: 0.6 }}
              />
            ))}
          </svg>

          {/* 資格スフィア */}
          {NODES.map((n, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: [0, i % 2 === 0 ? -5 : -8, 0],
              }}
              transition={{
                opacity: { delay: 0.5 + n.delay, duration: 0.4 },
                scale:   { delay: 0.5 + n.delay, duration: 0.4, type: "spring" },
                y: { delay: 1.2 + n.delay * 0.3, duration: 2.5 + i * 0.25, repeat: Infinity, ease: "easeInOut" },
              }}
              style={{
                position: "absolute",
                left: `${n.x}%`,
                top: `${n.y}%`,
                transform: "translate(-50%, -50%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "3px",
              }}
            >
              <div
                style={{
                  width: `${n.size}px`,
                  height: `${n.size}px`,
                  borderRadius: "50%",
                  background: `radial-gradient(circle at 32% 28%, ${n.color}30, ${n.color}08 70%, transparent 100%), radial-gradient(circle, #1a2234, #0c1018)`,
                  border: `1px solid ${n.color}40`,
                  boxShadow: `0 0 10px ${n.color}25, inset 0 -3px 8px rgba(0,0,0,0.6)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: `${n.size * 0.44}px`,
                }}
              >
                {n.icon}
              </div>
              {n.size >= 36 && (
                <span style={{ fontSize: "7px", color: n.color + "99", fontWeight: "700", letterSpacing: "0.04em" }}>
                  {n.label}
                </span>
              )}
            </motion.div>
          ))}

          {/* 資格数バッジ */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.6 }}
            style={{
              position: "absolute",
              bottom: "4px",
              right: "0px",
              padding: "3px 10px",
              borderRadius: "20px",
              background: "rgba(5,10,20,0.85)",
              border: "1px solid rgba(129,140,248,0.2)",
              fontSize: "9px",
              color: "#818cf8",
              fontWeight: "700",
              backdropFilter: "blur(8px)",
            }}
          >
            50+ 資格を収録
          </motion.div>
        </motion.div>

        {/* ── ボタン ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          style={{ display: "flex", flexDirection: "column", gap: "10px" }}
        >
          {/* Google ログイン */}
          <button
            onClick={signInWithGoogle}
            style={{
              width: "100%",
              padding: "15px",
              borderRadius: "14px",
              background: "white",
              border: "none",
              color: "#1a1a1a",
              fontWeight: "700",
              fontSize: "15px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              boxShadow: "0 2px 20px rgba(0,0,0,0.4)",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Googleでログイン（進捗クラウド保存）
          </button>

          {/* ゲスト */}
          <button
            onClick={() => router.push("/itp")}
            style={{
              width: "100%",
              padding: "15px",
              borderRadius: "14px",
              background: "rgba(129,140,248,0.1)",
              border: "1px solid rgba(129,140,248,0.28)",
              color: "#a5b4fc",
              fontWeight: "700",
              fontSize: "15px",
              cursor: "pointer",
            }}
          >
            まずはお試し（このデバイスに保存）
          </button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          style={{ color: "#334155", fontSize: "11px", marginTop: "18px", lineHeight: 1.6 }}
        >
          ゲストでも全機能が使えます。<br />
          後からGoogleログインで進捗を引き継げます。
        </motion.p>
      </div>
    </div>
  );
}
