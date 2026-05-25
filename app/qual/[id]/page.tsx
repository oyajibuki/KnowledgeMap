"use client";

import { useRouter, useParams } from "next/navigation";

// 資格名マップ（idから表示名を引く）
const QUAL_NAMES: Record<string, { label: string; icon: string; sub: string }> = {
  sg:       { label: "情報セキュリティマネジメント", icon: "🔒", sub: "IPA国家試験" },
  fe:       { label: "基本情報技術者",              icon: "💻", sub: "IPA国家試験" },
  ap:       { label: "応用情報技術者",              icon: "🔬", sub: "IPA国家試験" },
  nw:       { label: "ネットワークスペシャリスト",   icon: "🌐", sub: "IPA国家試験" },
  db:       { label: "データベーススペシャリスト",   icon: "🗄️", sub: "IPA国家試験" },
  sc:       { label: "情報処理安全確保支援士",       icon: "🛡️", sub: "IPA国家試験" },
  ipast:    { label: "ITストラテジスト",            icon: "🎯", sub: "IPA高度" },
  ipapm:    { label: "プロジェクトマネージャ試験",  icon: "🗂️", sub: "IPA高度" },
  ccna:     { label: "CCNA",                       icon: "🔵", sub: "Cisco認定" },
  ccnp:     { label: "CCNP",                       icon: "🔵", sub: "Cisco認定" },
  ccie:     { label: "CCIE",                       icon: "🏆", sub: "Cisco最高位" },
  az900:    { label: "Microsoft AZ-900",           icon: "☁️", sub: "Azure基礎" },
  aws:      { label: "AWS Solutions Architect",    icon: "☁️", sub: "AWS認定" },
  gcp:      { label: "Google Cloud ACE",           icon: "☁️", sub: "GCP認定" },
  az104:    { label: "Microsoft AZ-104",           icon: "🪟", sub: "Azure管理者" },
  ms900:    { label: "MS-900",                     icon: "🪟", sub: "Microsoft 365基礎" },
  mos:      { label: "MOS",                        icon: "📄", sub: "Officeスペシャリスト" },
  lpic1:    { label: "LPIC-1",                     icon: "🐧", sub: "Linux基礎" },
  lpic2:    { label: "LPIC-2",                     icon: "🐧", sub: "Linux応用" },
  oracle:   { label: "Oracle Database認定",        icon: "🔶", sub: "Oracle認定" },
  fp3:      { label: "ファイナンシャルプランナー 3級", icon: "💰", sub: "FP" },
  fp2:      { label: "ファイナンシャルプランナー 2級", icon: "💰", sub: "FP" },
  fp1:      { label: "ファイナンシャルプランナー 1級", icon: "🏅", sub: "FP" },
  takken:   { label: "宅地建物取引士",             icon: "🏠", sub: "不動産" },
  chintai:  { label: "賃貸不動産経営管理士",        icon: "🏢", sub: "不動産" },
  kangyou:  { label: "管理業務主任者",              icon: "🔑", sub: "不動産" },
  denkou:   { label: "電気工事士 第2種",           icon: "⚡", sub: "電気工事" },
  gyosei:   { label: "行政書士",                   icon: "⚖️", sub: "法務" },
  sharoshi: { label: "社会保険労務士",              icon: "📋", sub: "社労士" },
  shiho:    { label: "司法書士",                   icon: "📜", sub: "法務" },
  bengoshi: { label: "弁護士",                     icon: "⚖️", sub: "法務" },
  boki3:    { label: "日商簿記 3級",               icon: "📊", sub: "会計" },
  boki2:    { label: "日商簿記 2級",               icon: "📊", sub: "会計" },
  boki1:    { label: "日商簿記 1級",               icon: "📊", sub: "会計" },
  zeirishi: { label: "税理士",                     icon: "🧾", sub: "税務" },
  cpa:      { label: "公認会計士",                 icon: "🏦", sub: "会計最高位" },
  chusho:   { label: "中小企業診断士",             icon: "📈", sub: "経営" },
  pmp:      { label: "PMP",                        icon: "🎖️", sub: "PMI認定" },
  cbap:     { label: "CBAP",                       icon: "📋", sub: "ビジネス分析" },
  hoiku:    { label: "保育士",                     icon: "👶", sub: "医療/福祉" },
  eiyo:     { label: "管理栄養士",                 icon: "🥗", sub: "医療/福祉" },
  kaigo:    { label: "介護福祉士",                 icon: "🤝", sub: "医療/福祉" },
  seka4:    { label: "世界遺産検定 4級",           icon: "🌍", sub: "文化" },
  seka3:    { label: "世界遺産検定 3級",           icon: "🌏", sub: "文化" },
  seka2:    { label: "世界遺産検定 2級",           icon: "🗺️", sub: "文化" },
  seka1:    { label: "世界遺産検定 1級",           icon: "🏛️", sub: "文化" },
  hisho:    { label: "秘書検定",                   icon: "📁", sub: "ライフスタイル" },
  shikisai: { label: "色彩検定",                   icon: "🎨", sub: "ライフスタイル" },
  kanji:    { label: "漢字能力検定",               icon: "漢", sub: "ライフスタイル" },
};

const COMING_SOON_SECTIONS = [
  { icon: "🗺️", title: "知識マップ",    desc: "ノードをたどって知識を体系的に習得" },
  { icon: "📖", title: "学習コンテンツ", desc: "重要用語・概念をわかりやすく解説" },
  { icon: "📝", title: "過去問演習",    desc: "本番形式で実力を確かめる" },
  { icon: "📊", title: "進捗トラッキング", desc: "習得状況をビジュアルで確認" },
];

export default function QualPage() {
  const router = useRouter();
  const params = useParams();
  const id = (params?.id as string) ?? "";
  const qual = QUAL_NAMES[id];

  return (
    <div
      style={{
        minHeight: "100dvh",
        background:
          "radial-gradient(ellipse 100% 80% at 50% 30%, #0a1628 0%, #060a14 60%, #020508 100%)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ヘッダー */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "12px 16px",
          borderBottom: "1px solid #1e293b",
          background: "rgba(5,10,20,0.9)",
          backdropFilter: "blur(12px)",
        }}
      >
        <button
          onClick={() => router.back()}
          style={{
            background: "transparent",
            border: "none",
            color: "#475569",
            fontSize: "18px",
            cursor: "pointer",
            padding: "4px 8px",
            borderRadius: "8px",
          }}
        >
          ←
        </button>
        <span
          style={{
            fontWeight: "800",
            fontSize: "13px",
            background: "linear-gradient(135deg, #818cf8, #c084fc)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Knowledge Map
        </span>
      </div>

      {/* コンテンツ */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "40px 20px",
          maxWidth: "480px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        {/* 資格ヘッダー */}
        <div style={{ fontSize: "64px", marginBottom: "12px" }}>
          {qual?.icon ?? "📚"}
        </div>
        <h1
          style={{
            fontSize: "20px",
            fontWeight: "900",
            color: "#e2e8f0",
            textAlign: "center",
            marginBottom: "4px",
          }}
        >
          {qual?.label ?? "Unknown Qualification"}
        </h1>
        <p style={{ color: "#475569", fontSize: "12px", marginBottom: "32px" }}>
          {qual?.sub ?? ""}
        </p>

        {/* 準備中バナー */}
        <div
          style={{
            padding: "20px",
            borderRadius: "16px",
            background: "rgba(129,140,248,0.06)",
            border: "1px solid rgba(129,140,248,0.18)",
            marginBottom: "28px",
            textAlign: "center",
            width: "100%",
          }}
        >
          <div style={{ fontSize: "36px", marginBottom: "10px" }}>🚧</div>
          <p style={{ fontWeight: "800", fontSize: "14px", color: "#818cf8", marginBottom: "6px" }}>
            コンテンツ準備中
          </p>
          <p style={{ fontSize: "11px", color: "#475569", lineHeight: 1.65 }}>
            この資格の学習コンテンツは現在制作中です。<br />
            まずはITパスポートで学習スタイルを体験してみてください。
          </p>
        </div>

        {/* 準備中セクション */}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "10px", marginBottom: "28px" }}>
          {COMING_SOON_SECTIONS.map((s) => (
            <div
              key={s.title}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                padding: "14px 16px",
                borderRadius: "14px",
                background: "rgba(15,23,42,0.6)",
                border: "1px solid #1e293b",
                opacity: 0.55,
              }}
            >
              <span style={{ fontSize: "20px" }}>{s.icon}</span>
              <div>
                <p style={{ fontSize: "12px", fontWeight: "700", color: "#64748b", marginBottom: "2px" }}>
                  {s.title}
                </p>
                <p style={{ fontSize: "10px", color: "#334155" }}>{s.desc}</p>
              </div>
              <span style={{ marginLeft: "auto", fontSize: "10px", color: "#1e293b", fontWeight: "700" }}>
                準備中
              </span>
            </div>
          ))}
        </div>

        {/* CTAボタン */}
        <button
          onClick={() => router.push("/itp")}
          style={{
            width: "100%",
            padding: "15px",
            borderRadius: "14px",
            background: "linear-gradient(135deg, rgba(129,140,248,0.2), rgba(192,132,252,0.2))",
            border: "1px solid rgba(129,140,248,0.35)",
            color: "#a5b4fc",
            fontWeight: "700",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          ⚡ ITパスポートを学ぶ →
        </button>
      </div>
    </div>
  );
}
