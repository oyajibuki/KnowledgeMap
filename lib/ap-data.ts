import { KnowledgeNode, Connection } from "@/types";
import { apQuestions1 } from "./ap-questions-1";
import { apQuestions2 } from "./ap-questions-2";
import { apQuestions3 } from "./ap-questions-3";
import { apQuestions4 } from "./ap-questions-4";
import { apPMQuestions } from "./ap-pm-questions";

export const AP_BOSS_UNLOCK_THRESHOLD = 12;

// ─────────────────────────────────────────────────
// 同心円レイアウト
//   ITP  中心(700,700) R=950   ← 内側
//   FE   中心(700,700) R=1850  ← 中間
//   AP   中心(700,700) R=2750  ← 外側（AP ノードは R=2050〜2650 に配置）
// ─────────────────────────────────────────────────
const CX = 700;
const CY = 700;

function polar(angleDeg: number, r: number): { x: number; y: number } {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: Math.round(CX + r * Math.cos(rad)), y: Math.round(CY + r * Math.sin(rad)) };
}

// ─────────────────────────────────────────────────────────
// 応用情報技術者試験 知識ノード
// ─────────────────────────────────────────────────────────
export const apNodes: KnowledgeNode[] = [

  // ── CENTER ──
  {
    id: "ap-math",
    topicId: "ap-tech",
    title: "基礎理論・数学",
    description: "論理演算・二分法・統計など、ITの数学的基礎。",
    detail: "応用情報の基礎となる数学・論理の知識です。\n\n**論理演算** — AND/OR/NOT/含意。真理値表を正確に読む力が必要。[R7春 問1]\n**二分法** — 誤差を1/2ずつ縮小して近似解を求める数値計算法。繰り返し回数は2ⁿを基準に計算。[R7春 問2]\n**BNF記法** — 文法の形式的定義。コンパイラ理論の基礎。\n**情報量とエントロピー** — 発生確率が低いほど情報量は多い。シャノンの情報理論。\n**誤り検出・訂正** — パリティビット・ハミング符号。通信の信頼性を確保する手法。",
    difficulty: 3, importance: 4, isExamFrequent: true, status: "locked",
    position: { x: CX, y: CY },
    wikiUrl: "https://ja.wikipedia.org/wiki/%E8%AB%96%E7%90%86%E6%BC%94%E7%AE%97",
  },

  // ── ARM 1 (0°) : AI → アルゴリズム → アーキテクチャ ──
  {
    id: "ap-ai",
    topicId: "ap-tech",
    title: "AI・機械学習",
    description: "機械学習・ディープラーニング・過学習対策など。",
    detail: "近年出題頻度が上昇しているAI関連分野です。\n\n**機械学習の種類** — 教師あり学習・教師なし学習・強化学習\n**過学習（オーバーフィッティング）** — 訓練データに過剰適合し未知データに弱くなる状態。データ拡張・正則化・ドロップアウトで対策。[R7春 問3]\n**データ拡張** — 既存訓練データを加工して量を増やし汎化能力を高める手法。\n**ニューラルネットワーク** — 人間の神経回路を模倣した層構造モデル。深層学習はその多層版。\n**交差検証（クロスバリデーション）** — データを分割し複数回学習・検証を繰り返す評価手法。",
    difficulty: 3, importance: 4, isExamFrequent: true, status: "locked",
    position: polar(0, 2050),
    wikiUrl: "https://ja.wikipedia.org/wiki/%E6%A9%9F%E6%A2%B0%E5%AD%A6%E7%BF%92",
  },
  {
    id: "ap-algo",
    topicId: "ap-tech",
    title: "アルゴリズム・データ構造",
    description: "スタック・木構造・探索・ソート・再帰など。",
    detail: "プログラムの核となるアルゴリズムとデータ構造です。\n\n**スタック** — LIFO。出力順序の組み合わせ問題は「CBAは生成不可」などの例外に注意。[R7春 問5]\n**AVL木** — 平衡二分探索木。左右の高さの差が常に1以下。挿入時に回転操作で平衡を保つ。[R7春 問6]\n**再帰アルゴリズム** — 自分自身を呼び出す関数。階乗・ハノイの塔が典型例。基底条件（n=0のとき1）が重要。[R7春 問7]\n**ハッシュ法** — キーからハッシュ値を計算して直接アクセス。平均O(1)。衝突時はチェイン法・オープンアドレス法で解決。\n**時間計算量** — O(1) < O(log n) < O(n) < O(n log n) < O(n²)",
    difficulty: 4, importance: 5, isExamFrequent: true, status: "locked",
    position: polar(0, 2250),
    wikiUrl: "https://ja.wikipedia.org/wiki/%E3%82%A2%E3%83%AB%E3%82%B4%E3%83%AA%E3%82%BA%E3%83%A0",
  },
  {
    id: "ap-arch",
    topicId: "ap-tech",
    title: "コンピュータアーキテクチャ",
    description: "CPU・クロック・DMA・パイプラインなどのハードウェア構成。",
    detail: "コンピュータの内部動作と性能指標です。\n\n**CPI（Cycles Per Instruction）** — 1命令実行に必要な平均クロック数。処理時間=CPI×クロック周期×命令数。[R7春 問8]\n**DMAコントローラ** — CPU介在なしにメモリと入出力装置間でデータ転送。CPU負荷を大幅軽減。[R7春 問9]\n**パイプライン** — 命令をフェッチ・解読・実行に分割し並行処理。ハザード（データ・構造・制御）に注意。\n**命令セットアーキテクチャ** — RISC（少命令・高速）vs CISC（多命令・複雑処理）\n**キャッシュメモリ** — L1/L2/L3。局所性の原理（時間的・空間的）を活用。",
    difficulty: 4, importance: 4, isExamFrequent: true, status: "locked",
    position: polar(0, 2450),
    wikiUrl: "https://ja.wikipedia.org/wiki/%E3%82%B3%E3%83%B3%E3%83%94%E3%83%A5%E3%83%BC%E3%82%BF%E3%82%A2%E3%83%BC%E3%82%AD%E3%83%86%E3%82%AF%E3%83%81%E3%83%A3",
  },

  // ── ARM 2 (-60°) : システム構成 → OS → ハードウェア ──
  {
    id: "ap-sys",
    topicId: "ap-tech",
    title: "システム構成・評価",
    description: "稼働率・MTBF・MTTR・並列処理・冗長構成など。",
    detail: "システムの信頼性と性能を評価する指標と構成技術です。\n\n**稼働率** — MTBF/(MTBF+MTTR)。直列は掛け算、並列は1-(1-α)ⁿ。[R7春 問12,13]\n**アムダールの法則** — 並列化可能な割合rと台数nで高速化率を計算。E=1/(1-r+r/n)。[R7春 問11]\n**オブジェクトストレージ** — 一意IDでアクセス、フラットな階層、上書き不可、スケールアウト容易。[R7春 問10]\n**クラスタリング** — 複数サーバを連携させ高可用性・高性能を実現。フェイルオーバー自動化。\n**負荷分散** — ロードバランサが複数サーバにリクエストを振り分ける。セッション管理が課題。",
    difficulty: 4, importance: 5, isExamFrequent: true, status: "locked",
    position: polar(-60, 2050),
    wikiUrl: "https://ja.wikipedia.org/wiki/%E7%A8%BC%E5%83%8D%E7%8E%87",
  },
  {
    id: "ap-os",
    topicId: "ap-tech",
    title: "OS・仮想記憶",
    description: "プロセス管理・ページング・LRU・スケジューリングなど。",
    detail: "OSの内部動作とメモリ管理の詳細です。\n\n**プリエンプション** — 優先度の高いタスクがCPUを奪い取り、実行中タスクを「実行可能状態」に遷移させる。[R7春 問14]\n**LRU（Least Recently Used）** — 最も長く参照されていないページを置換するアルゴリズム。参照の局所性を活用。[R7春 問15]\n**ページング** — メモリを固定サイズのページに分割。ページフォルト時にスワップイン。\n**仮想記憶** — 物理RAM以上のメモリ空間をプロセスに提供。HDDをスワップ領域として使用。\n**スレッド** — プロセス内の実行単位。メモリを共有するため通信が高速。競合状態・デッドロックに注意。",
    difficulty: 4, importance: 4, isExamFrequent: true, status: "locked",
    position: polar(-60, 2250),
    wikiUrl: "https://ja.wikipedia.org/wiki/%E3%83%9A%E3%83%BC%E3%82%B8%E7%BD%AE%E6%8F%9B%E3%82%A2%E3%83%AB%E3%82%B4%E3%83%AA%E3%82%BA%E3%83%A0",
  },
  {
    id: "ap-hw",
    topicId: "ap-tech",
    title: "ハードウェア・論理回路",
    description: "デジタル回路・A/D変換・センサ・PLC・IoTデバイスなど。",
    detail: "組み込みシステムと電子回路の基礎です。\n\n**論理ゲート** — AND/OR/NOT/NAND/NOR/XOR。NAND・NORは万能ゲート（任意の論理を実現可能）。\n**フリップフロップ** — 1ビット記憶素子。SR/JK/D/T型。レジスタやカウンタの構成要素。\n**A/D変換器** — アナログ信号をデジタル値に変換。サンプリング定理：信号の最高周波数の2倍以上。\n**PLC（プログラマブルロジックコントローラ）** — 工場の制御機器。ラダー図でプログラム。\n**IoTセンサノード** — 省電力化のためスリープと間欠動作を組み合わせる。[R7春 問21]",
    difficulty: 3, importance: 3, isExamFrequent: false, status: "locked",
    position: polar(-60, 2450),
    wikiUrl: "https://ja.wikipedia.org/wiki/%E8%AB%96%E7%90%86%E5%9B%9E%E8%B7%AF",
  },

  // ── ARM 3 (-120°) : DB → ネットワーク → セキュリティ ──
  {
    id: "ap-db",
    topicId: "ap-tech",
    title: "データベース",
    description: "正規化・SQL・トランザクション・NoSQLなど。",
    detail: "データベース設計から運用まで幅広く出題される分野です。\n\n**第3正規形** — 非キー属性間の関数従属を排除。第2NF→第3NFは「非キー属性間の依存を分解」。[R7春 問26]\n**SQL CASCADE** — ON DELETE CASCADE で参照先削除時に参照元も自動削除。[R7春 問27]\n**ワイドカラム型DB** — 行ごとに異なる列数・複数値を持てる柔軟なNoSQLモデル。IoTデータに適合。[R7春 問24]\n**ACID特性** — 原子性(A)・一貫性(C)・独立性(I)・永続性(D)。トランザクション管理の基本。\n**2相コミット** — 分散DBでの整合性確保プロトコル。準備フェーズ→コミットフェーズ。",
    difficulty: 4, importance: 5, isExamFrequent: true, status: "locked",
    position: polar(-120, 2050),
    wikiUrl: "https://ja.wikipedia.org/wiki/%E3%83%87%E3%83%BC%E3%82%BF%E3%83%99%E3%83%BC%E3%82%B9%E3%81%AE%E6%AD%A3%E8%A6%8F%E5%8C%96",
  },
  {
    id: "ap-net",
    topicId: "ap-tech",
    title: "ネットワーク",
    description: "ルーティング・プロトコル・IPv6・ファイアウォールなど。",
    detail: "ネットワーク技術の応用的な知識が求められます。\n\n**最長一致（ロンゲストマッチ）** — ルータが複数ルート候補からプレフィックス長が最長のものを選択。[R7春 問31]\n**ウェルノウンポート** — HTTP:80、HTTPS:443、SMTP:25、POP3:110、IMAP4:143、DNS:53、FTP:21。[R7春 問33]\n**MTU（Maximum Transmission Unit）** — フレームが伝送できる最大データサイズ。フラグメンテーションの基準。[R7春 問30]\n**IPv6** — 128ビット。アドレス自動設定（SLAAC）・IPsec標準装備・マルチキャスト拡充。\n**VPN** — インターネット上に仮想的な専用線を構築。IPsec・SSL-VPN・L2TPが代表的。",
    difficulty: 4, importance: 4, isExamFrequent: true, status: "locked",
    position: polar(-120, 2250),
    wikiUrl: "https://ja.wikipedia.org/wiki/%E3%83%AB%E3%83%BC%E3%83%86%E3%82%A3%E3%83%B3%E3%82%B0",
  },
  {
    id: "ap-sec",
    topicId: "ap-tech",
    title: "セキュリティ",
    description: "暗号・攻撃手法・CRYPTREC・サイドチャネルなど。",
    detail: "セキュリティは応用情報で最も出題数が多い分野のひとつです。\n\n**CRYPTREC暗号リスト** — 電子政府推奨暗号リスト（利用推奨）・推奨候補・運用監視の3種。[R7春 問35]\n**OSコマンドインジェクション** — セミコロン(;)やパイプ(|)で悪意あるコマンドを実行させる攻撃。URLパラメータに「;cat /etc/passwd」など。[R7春 問36]\n**サイドチャネル攻撃** — 電磁波・電力消費・処理時間など非正規の物理的情報から秘密鍵を推定。[R7春 問37]\n**OCSP（Online Certificate Status Protocol）** — 証明書の失効状態をリアルタイムに確認するプロトコル。[R7春 問38]\n**SBOM（Software Bill of Materials）** — ソフトウェアを構成する部品リスト。脆弱性管理に活用。[R7春 問40]",
    difficulty: 4, importance: 5, isExamFrequent: true, status: "locked",
    position: polar(-120, 2450),
    wikiUrl: "https://ja.wikipedia.org/wiki/%E3%82%B5%E3%82%A4%E3%83%89%E3%83%81%E3%83%A3%E3%83%8D%E3%83%AB%E6%94%BB%E6%92%83",
  },

  // ── ARM 4 (180°) : UI・マルチメディア ──
  {
    id: "ap-ui",
    topicId: "ap-tech",
    title: "ヒューマンIF・マルチメディア",
    description: "ユーザビリティ評価・SVG・UX・アクセシビリティなど。",
    detail: "ユーザとシステムの接点に関する技術です。\n\n**ユーザビリティ評価** — 使いやすさの測定。ヒューリスティック評価・ユーザテスト・ウォークスルーなど。[R7春 問22]\n**SVG（Scalable Vector Graphics）** — XMLベースのベクター画像形式。拡大縮小しても劣化しない。[R7春 問23]\n**UX（User Experience）** — 製品の使用体験全体。UIだけでなく感情的満足度も含む。\n**アクセシビリティ** — 障害者・高齢者含む全ユーザが利用できる設計。Webは WCAG が国際規格。\n**インタラクションデザイン** — ユーザの行動とシステムの反応を設計する手法。ウィザード形式・直接操作など。",
    difficulty: 2, importance: 3, isExamFrequent: false, status: "locked",
    position: polar(180, 2050),
    wikiUrl: "https://ja.wikipedia.org/wiki/%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%93%E3%83%AA%E3%83%86%E3%82%A3",
  },

  // ── ARM 5 (120°) : ソフトウェア開発 → PM → 監査 ──
  {
    id: "ap-dev",
    topicId: "ap-mgmt",
    title: "ソフトウェア開発・手法",
    description: "アジャイル・XP・スクラム・テスト・設計レビューなど。",
    detail: "現代のソフトウェア開発プロセスと品質管理です。\n\n**XP（Extreme Programming）** — アジャイル手法の先駆け。ペアプログラミング・TDD・継続的インテグレーションが主要プラクティス。[R7春 問48]\n**スクラム** — スプリント（1〜4週間）単位でバックログを消化するアジャイルフレームワーク。[R7春 問50]\n**カオスエンジニアリング** — 本番環境に意図的に障害を注入してシステムの耐障害性を検証する手法。[R7春 問49]\n**デザインレビュー** — 設計段階で複数人がレビューして欠陥を早期発見するQA活動。[R7春 問45]\n**保守性指標** — 変更容量・サイクロマティック複雑度・結合度など。低結合・高凝集が目標。",
    difficulty: 3, importance: 4, isExamFrequent: true, status: "locked",
    position: polar(120, 2050),
    wikiUrl: "https://ja.wikipedia.org/wiki/%E3%82%A2%E3%82%B8%E3%83%A3%E3%82%A4%E3%83%AB%E3%82%BD%E3%83%95%E3%83%88%E3%82%A6%E3%82%A7%E3%82%A2%E9%96%8B%E7%99%BA",
  },
  {
    id: "ap-pm",
    topicId: "ap-mgmt",
    title: "プロジェクトマネジメント",
    description: "EVM・スケジュール・リスク・プロジェクト憲章など。",
    detail: "PMBOK準拠のプロジェクト管理手法です。\n\n**プロジェクト憲章** — プロジェクト正式認可文書。ビジネスニーズ・目標・PMの責任・権限を記載。立ち上げプロセスで作成。[R7春 問51]\n**EVM（アーンドバリュー管理）** — CPI=EV/AC（<1はコスト超過）、SPI=EV/PV（<1はスケジュール遅延）、TCPI=残作業/残予算。[R7春 問52]\n**クラッシング** — 資源追加でクリティカルパスを短縮。コスト増加を伴う。[R7春 問53]\n**クリティカルパス** — プロジェクト完了までの最長経路。ここの遅延が全体遅延に直結。\n**コンティンジェンシー予備費** — 特定リスク発生時のための予備コスト（マネジメント予備とは異なる）。",
    difficulty: 3, importance: 4, isExamFrequent: true, status: "locked",
    position: polar(120, 2250),
    wikiUrl: "https://ja.wikipedia.org/wiki/%E3%82%A2%E3%83%BC%E3%83%B3%E3%83%89%E3%83%90%E3%83%AA%E3%83%A5%E3%83%BC%E3%83%9E%E3%83%8D%E3%82%B8%E3%83%A1%E3%83%B3%E3%83%88",
  },
  {
    id: "ap-sm",
    topicId: "ap-mgmt",
    title: "サービスマネジメント",
    description: "ITIL・SLA・インシデント管理・変更管理など。",
    detail: "ITサービスの安定運用を支える管理フレームワークです。\n\n**ITIL（ITインフラストラクチャライブラリ）** — ITサービス管理のベストプラクティス集。\n**SLA（サービスレベル合意）** — 提供者と利用者間のサービス品質を定めた合意書。可用性・応答時間などを規定。\n**インシデント管理** — サービス障害を最短で復旧させることを目的。原因究明は問題管理が担当。\n**変更管理** — サービスへの変更を計画・承認・実施・レビューするプロセス。リスク評価が重要。\n**サービス継続的改善（CSI）** — Plan-Do-Check-Actサイクルでサービスを継続改善。[R7春 問57]",
    difficulty: 3, importance: 3, isExamFrequent: true, status: "locked",
    position: polar(120, 2450),
    wikiUrl: "https://ja.wikipedia.org/wiki/ITIL",
  },
  {
    id: "ap-audit",
    topicId: "ap-mgmt",
    title: "システム監査",
    description: "監査手続・ウォークスルー法・内部統制など。",
    detail: "ITシステムの適切性を第三者が検証する活動です。\n\n**ウォークスルー法** — データの生成から処理・出力まで一連のコントロールをプロセスに沿って追跡確認する手法。[R7春 問58]\n**インタビュー法** — 関係者に口頭で聞き取り・確認する手法。\n**テストデータ法** — テストデータを実際のシステムで処理し期待する結果が出るか検証。\n**ドキュメントレビュー** — 文書・資料を入手して内容を点検。\n**内部統制** — 組織が業務の有効性・信頼性・法令遵守を確保するための仕組み。COSOフレームワーク。",
    difficulty: 3, importance: 4, isExamFrequent: true, status: "locked",
    position: polar(120, 2650),
    wikiUrl: "https://ja.wikipedia.org/wiki/%E3%82%B7%E3%82%B9%E3%83%86%E3%83%A0%E7%9B%A3%E6%9F%BB",
  },

  // ── ARM 6 (60°) : 経営戦略 → 法務 → ビジネス ──
  {
    id: "ap-strategy",
    topicId: "ap-strategy",
    title: "経営戦略・システム戦略",
    description: "PPM・BSC・SWOT・DX認定・システム化計画など。",
    detail: "経営とITを結ぶ戦略的思考が求められる分野です。\n\n**PPM（プロダクトポートフォリオマネジメント）** — 市場成長率×相対市場シェアのマトリックスで事業を「花形・金のなる木・問題児・負け犬」に分類し資源配分を最適化。[R7春 問67]\n**BSC（バランスドスコアカード）** — 財務・顧客・業務プロセス・学習と成長の4視点で企業戦略を評価。\n**DX認定制度** — デジタルガバナンス・コードに基づきDXに取り組む事業者を国が認定。[R7春 問61]\n**プライスライニング** — あらかじめ設定した価格帯に製品ラインナップを揃える価格戦略。[R7春 問68]\n**フリーミアム** — 基本機能無料・高機能有料で大量ユーザを獲得するビジネスモデル。[R7春 問70]",
    difficulty: 3, importance: 4, isExamFrequent: true, status: "locked",
    position: polar(60, 2050),
    wikiUrl: "https://ja.wikipedia.org/wiki/%E3%83%97%E3%83%AD%E3%83%80%E3%82%AF%E3%83%88%E3%83%9D%E3%83%BC%E3%83%88%E3%83%95%E3%82%A9%E3%83%AA%E3%82%AA%E3%83%9E%E3%83%8D%E3%82%B8%E3%83%A1%E3%83%B3%E3%83%88",
  },
  {
    id: "ap-biz",
    topicId: "ap-strategy",
    title: "ビジネス・業務分析",
    description: "ビジネスモデルキャンバス・エッジAI・コンピテンシーなど。",
    detail: "ビジネスとITを結ぶ実践的な知識です。\n\n**ビジネスモデルキャンバス** — 9つのブロックでビジネスモデルを可視化するフレームワーク。顧客セグメント・価値提案・チャネル等。[R7春 問69]\n**エッジAI** — クラウドではなくデバイス側でAI処理を行う。低遅延・プライバシー保護に優れる。[R7春 問71]\n**マシンビジョン** — 画像センサとAIで製造工程の品質検査・計測を自動化するシステム。[R7春 問72]\n**コンピテンシーモデル** — 高業績者に共通する行動特性を体系化した人材評価モデル。[R7春 問73]\n**グルーピング（アフィニティ図法）** — KJ法の一種。付箋を親和性でグループ化して問題構造を発見。[R7春 問75]",
    difficulty: 2, importance: 3, isExamFrequent: true, status: "locked",
    position: polar(60, 2250),
    wikiUrl: "https://ja.wikipedia.org/wiki/%E3%83%93%E3%82%B8%E3%83%8D%E3%82%B9%E3%83%A2%E3%83%87%E3%83%AB%E3%82%AD%E3%83%A3%E3%83%B3%E3%83%90%E3%82%B9",
  },
  {
    id: "ap-legal",
    topicId: "ap-strategy",
    title: "法務・知的財産",
    description: "著作権法・不正アクセス禁止法・RoHS・個人情報保護法など。",
    detail: "IT関連の法令・規制に関する知識です。\n\n**著作権とAI** — 2018年著作権法改正でAI学習目的のデータ利用は原則許可。ただし生成物が既存著作物と類似・依拠性がある場合は侵害の可能性。[R7春 問78]\n**RoHS指令** — EUの電気電子製品に含まれる有害物質（鉛・水銀・カドミウムなど）の使用を制限する指令。環境・健康被害の最小化が目的。[R7春 問80]\n**不正アクセス禁止法** — アクセス権なしにコンピュータにログインする行為等を禁止。\n**個人情報保護法** — 個人情報の適切な取り扱いを定めた法律。改正により仮名加工・匿名加工の規定も整備。\n**特許権** — 発明を保護。出願から20年。業務上の発明（職務発明）は原則使用者に帰属。",
    difficulty: 2, importance: 4, isExamFrequent: true, status: "locked",
    position: polar(60, 2450),
    wikiUrl: "https://ja.wikipedia.org/wiki/%E4%B8%8D%E6%AD%A3%E3%82%A2%E3%82%AF%E3%82%BB%E3%82%B9%E7%A6%81%E6%AD%A2%E6%B3%95",
  },
];

export const apConnections: Connection[] = [
  // ── テクノロジ系（中心から放射）──
  { fromNodeId: "ap-math",     toNodeId: "ap-ai",       relationType: "related" },
  { fromNodeId: "ap-math",     toNodeId: "ap-algo",     relationType: "dependency" },
  { fromNodeId: "ap-math",     toNodeId: "ap-db",       relationType: "related" },
  { fromNodeId: "ap-math",     toNodeId: "ap-ui",       relationType: "related" },    // ★ ap-ui に入口
  { fromNodeId: "ap-math",     toNodeId: "ap-strategy", relationType: "related" },    // ★ ap-strategy に入口
  { fromNodeId: "ap-algo",     toNodeId: "ap-arch",     relationType: "related" },
  { fromNodeId: "ap-arch",     toNodeId: "ap-sys",      relationType: "dependency" },
  { fromNodeId: "ap-sys",      toNodeId: "ap-os",       relationType: "dependency" },
  { fromNodeId: "ap-os",       toNodeId: "ap-hw",       relationType: "related" },
  { fromNodeId: "ap-db",       toNodeId: "ap-net",      relationType: "related" },
  { fromNodeId: "ap-net",      toNodeId: "ap-sec",      relationType: "dependency" },
  { fromNodeId: "ap-ui",       toNodeId: "ap-dev",      relationType: "related" },
  { fromNodeId: "ap-sec",      toNodeId: "ap-dev",      relationType: "related" },
  // ── マネジメント系 ──
  { fromNodeId: "ap-dev",      toNodeId: "ap-pm",       relationType: "dependency" },
  { fromNodeId: "ap-strategy", toNodeId: "ap-pm",       relationType: "related" },
  { fromNodeId: "ap-pm",       toNodeId: "ap-sm",       relationType: "related" },
  { fromNodeId: "ap-sm",       toNodeId: "ap-audit",    relationType: "dependency" },
  { fromNodeId: "ap-dev",      toNodeId: "ap-audit",    relationType: "related" },
  // ── ストラテジ系 ──
  { fromNodeId: "ap-strategy", toNodeId: "ap-biz",      relationType: "dependency" },
  { fromNodeId: "ap-biz",      toNodeId: "ap-legal",    relationType: "related" },
];

// 午前問題プール（バッチ1〜4）
export const apGozenQuestions = [...apQuestions1, ...apQuestions2, ...apQuestions3, ...apQuestions4];
// 午後問題プール
export { apPMQuestions };
// 全問合算（互換性のため維持）
export const apQuestions = [...apGozenQuestions, ...apPMQuestions];

// ─────────────────────────────────────────────────────────
// 試験間クロス接続（ITP/FE ↔ AP の共通知識リンク）
// KnowledgeMap.tsx で視覚的な破線エッジとして描画する
// ─────────────────────────────────────────────────────────
export const crossExamLinks: { from: string; to: string }[] = [
  // ── テクノロジ系（ITP↔AP）──
  { from: "binary",            to: "ap-math"     }, // 2進数・数値表現
  { from: "cpu-basic",         to: "ap-arch"     }, // CPU・アーキテクチャ
  { from: "ram",               to: "ap-sys"      }, // メモリ・システム構成
  { from: "storage",           to: "ap-sys"      }, // 補助記憶装置
  { from: "os-basic",          to: "ap-os"       }, // OS
  { from: "process",           to: "ap-os"       }, // プロセス管理
  { from: "ip",                to: "ap-net"      }, // IPアドレス
  { from: "tcp-ip",            to: "ap-net"      }, // TCP/IP
  { from: "http",              to: "ap-net"      }, // HTTP/Web
  { from: "encryption",        to: "ap-sec"      }, // 暗号化
  { from: "digital-signature", to: "ap-sec"      }, // デジタル署名
  { from: "rdbms",             to: "ap-db"       }, // リレーショナルDB
  { from: "sql-basic",         to: "ap-db"       }, // SQL
  { from: "data-structure",    to: "ap-algo"     }, // データ構造
  { from: "sort",              to: "ap-algo"     }, // 整列アルゴリズム
  { from: "cloud",             to: "ap-sys"      }, // クラウド↔システム構成
  { from: "cloud",             to: "ap-strategy" }, // クラウド↔IT戦略
  // ── マネジメント・ストラテジ系（ITP↔AP）──
  { from: "encryption",        to: "ap-sm"       }, // 暗号化↔セキュリティ管理
  { from: "digital-signature", to: "ap-legal"    }, // 電子署名↔法務
  { from: "os-basic",          to: "ap-dev"      }, // OS↔ソフトウェア開発
  { from: "rdbms",             to: "ap-pm"       }, // DB管理↔プロジェクト管理
  { from: "storage",           to: "ap-sm"       }, // 記憶装置↔サービス管理（バックアップ）
];
