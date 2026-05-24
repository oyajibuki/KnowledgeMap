import { KnowledgeNode, Connection, Question } from "@/types";

// ボスノード解放の閾値（31ノード中）
export const BOSS_UNLOCK_THRESHOLD = 25;

// 中心を(700,700)に設定 — 上方向のアームが画面外に出ないよう調整
const CX = 700;
const CY = 700;

function polar(angleDeg: number, r: number): { x: number; y: number } {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: Math.round(CX + r * Math.cos(rad)), y: Math.round(CY + r * Math.sin(rad)) };
}

// ─────────────────────────────────────────────────────────
// 知識ノード  (令和8年春 ITパスポート 過去問対応)
// ─────────────────────────────────────────────────────────
export const initialNodes: KnowledgeNode[] = [

  // ── CENTER ──
  {
    id: "binary",
    topicId: "hardware",
    title: "2進数・16進数",
    description: "コンピュータが扱う数値表現の基本。0と1で全てを表す。",
    detail: "コンピュータは全情報を2進数（0と1）で処理します。\n\n**2進数** — 10進数の2→10、3→11、13→1101\n**16進数** — 2進数4桁を1桁で表現。A=10…F=15。#FF=255\n**ビットとバイト** — 1ビット=0か1。8ビット=1バイト。\n**文字コード** — 文字を数値に対応させた規則。UTF-8が主流。",
    difficulty: 1, importance: 5, isExamFrequent: true, status: "locked",
    position: { x: CX, y: CY },
    wikiUrl: "https://ja.wikipedia.org/wiki/2%E9%80%B2%E6%B3%95",
  },

  // ── ARM 1 (0°) : CPU → OS → プロセス ──
  {
    id: "cpu-basic",
    topicId: "hardware",
    title: "CPU",
    description: "コンピュータの頭脳。命令を取り出し・解読・実行する。",
    detail: "CPUはコンピュータの中核部品です。\n\n**演算装置(ALU)** — 四則演算・論理演算を実行\n**制御装置** — 命令の解読と各装置への指示\n**レジスタ** — CPU内部の超高速一時記憶\n**クロック周波数** — 1秒間の処理サイクル数。3GHz=30億回/秒\n**コア数** — 複数コアで並列処理が可能。マルチコアプロセッサ。",
    difficulty: 2, importance: 5, isExamFrequent: true, status: "locked",
    position: polar(0, 210),
    wikiUrl: "https://ja.wikipedia.org/wiki/%E4%B8%AD%E5%A4%AE%E5%87%A6%E7%90%86%E8%A3%85%E7%BD%AE",
  },
  {
    id: "os-basic",
    topicId: "software",
    title: "OS",
    description: "ハードウェアとアプリの橋渡し。Windows・macOS・Linux など。",
    detail: "OSはコンピュータ全体を管理するソフトウェアです。\n\n**プロセス管理** — 複数プログラムの実行制御\n**メモリ管理** — アプリへのRAM割り当て\n**ファイル管理** — ファイルの読み書き・整理\n**デバイス管理** — 周辺機器の制御\n**カーネル** — OSの中核。ハードウェアを直接制御。\n**ミドルウェア** — OSとアプリの中間に位置するソフトウェア。DBMSやWebサーバなど。",
    difficulty: 2, importance: 5, isExamFrequent: true, status: "locked",
    position: polar(0, 400),
    wikiUrl: "https://ja.wikipedia.org/wiki/%E3%82%AA%E3%83%9A%E3%83%AC%E3%83%BC%E3%83%86%E3%82%A3%E3%83%B3%E3%82%B0%E3%82%B7%E3%82%B9%E3%83%86%E3%83%A0",
  },
  {
    id: "process",
    topicId: "software",
    title: "プロセス管理",
    description: "複数のプログラムを同時に動かす仕組み。マルチタスク。",
    detail: "現代OSは複数プログラムを同時実行します。\n\n**プロセス** — 実行中プログラムの単位\n**マルチタスク** — CPUが高速に切替えることで「同時実行」に見せる\n**スケジューリング** — ラウンドロビン・優先度方式など\n**デッドロック** — 複数プロセスが互いに待ち合い停止する状態\n**スプーリング** — 低速I/Oとの速度差を吸収するバッファリング技術\n**仮想記憶** — RAMの不足をHDDで補う仕組み",
    difficulty: 3, importance: 4, isExamFrequent: true, status: "locked",
    position: polar(0, 590),
    wikiUrl: "https://ja.wikipedia.org/wiki/%E3%83%97%E3%83%AD%E3%82%BB%E3%82%B9_(%E3%82%B3%E3%83%B3%E3%83%94%E3%83%A5%E3%83%BC%E3%82%BF)",
  },

  // ── ARM 2 (-60°) : RAM → Storage → Cloud ──
  {
    id: "ram",
    topicId: "hardware",
    title: "メモリ・記憶装置",
    description: "CPUが直接アクセスする高速メモリとデータ保存装置の体系。",
    detail: "記憶装置には速度と容量のトレードオフがあります。\n\n**RAM（主記憶）** — 揮発性・高速・CPUの作業台。DRAM(主記憶)/SRAM(キャッシュ)。\n**VRAM** — 画面表示専用メモリ。GPUが使用。[問61]\n**キャッシュメモリ** — CPUとRAMの速度差を埋める高速バッファ。L1/L2/L3。\n**記憶階層** — レジスタ > キャッシュ > RAM > SSD/HDD の順で速度低下・容量増加",
    difficulty: 2, importance: 4, isExamFrequent: true, status: "locked",
    position: polar(-60, 210),
    wikiUrl: "https://ja.wikipedia.org/wiki/Random_access_memory",
  },
  {
    id: "storage",
    topicId: "hardware",
    title: "補助記憶装置",
    description: "電源OFFでもデータが消えない永続保存装置。HDD・SSD・NASなど。",
    detail: "補助記憶装置はデータを長期保存します。\n\n**HDD** — 磁気ディスク・安価・大容量・衝撃に弱い\n**SSD** — フラッシュメモリ・高速・耐衝撃・高価\n**NAS（Network Attached Storage）** — ネットワーク経由で複数端末が共有利用できる外部記憶装置 [問87]\n**RAID** — 複数ディスクで冗長性・高速化を実現する技術\n**USB・BD・磁気テープ** — その他の補助記憶媒体\n**dpi** — スキャナ・プリンタの解像度単位。1インチ当たりのドット数 [問99]",
    difficulty: 2, importance: 4, isExamFrequent: true, status: "locked",
    position: polar(-60, 400),
    wikiUrl: "https://ja.wikipedia.org/wiki/%E8%A3%9C%E5%8A%A9%E8%A8%98%E6%86%B6%E8%A3%85%E7%BD%AE",
  },
  {
    id: "cloud",
    topicId: "network",
    title: "クラウドコンピューティング",
    description: "インターネット経由でIT資源を利用するサービス形態。",
    detail: "クラウドはITリソースをネット経由で提供します。\n\n**IaaS** — インフラ（サーバ・NW）を提供。AWS EC2など。[問12]\n**PaaS** — 開発・実行環境を提供。Google App Engineなど。\n**SaaS** — アプリをサービスとして提供。Gmail・Office365など。\n**メリット** — 初期コスト削減・スケールアウト容易・場所を選ばない\n**デメリット** — インターネット依存・セキュリティリスク・通信コスト\n**ハイブリッドクラウド** — オンプレミスとクラウドを組み合わせた形態",
    difficulty: 2, importance: 5, isExamFrequent: true, status: "locked",
    position: polar(-60, 590),
    wikiUrl: "https://ja.wikipedia.org/wiki/%E3%82%AF%E3%83%A9%E3%82%A6%E3%83%89%E3%82%B3%E3%83%B3%E3%83%94%E3%83%A5%E3%83%BC%E3%83%86%E3%82%A3%E3%83%B3%E3%82%B0",
  },

  // ── ARM 3 (-120°) : IP → DNS → TCP/IP → HTTP ──
  {
    id: "ip",
    topicId: "network",
    title: "IPアドレス",
    description: "ネットワーク上の住所。インターネット通信の識別番号。",
    detail: "IPアドレスはネットワーク上の識別番号です。\n\n**IPv4** — 32ビット。192.168.1.1形式。約43億個。\n**IPv6** — 128ビット。IPv4枯渇問題を解決。\n**グローバルIP** — インターネット上でユニーク\n**プライベートIP** — 社内LANで使用（192.168.x.x など）\n**NAT** — プライベートIPとグローバルIPを変換する技術\n**サブネットマスク** — ネットワーク部とホスト部の境界を示す",
    difficulty: 3, importance: 5, isExamFrequent: true, status: "locked",
    position: polar(-120, 210),
    wikiUrl: "https://ja.wikipedia.org/wiki/IP%E3%82%A2%E3%83%89%E3%83%AC%E3%82%B9",
  },
  {
    id: "dns",
    topicId: "network",
    title: "DNS・DHCP",
    description: "ドメイン名をIPアドレスに変換する仕組みと、IP自動割り当て。",
    detail: "DNS・DHCPはネットワーク運用の基盤技術です。\n\n**DNS（Domain Name System）** — ドメイン名→IPアドレス変換（名前解決）。インターネットの電話帳 [問65]\n**DNSの仕組み** — ①URL入力 →②DNSサーバ問い合わせ →③IP取得 →④接続\n**DHCP** — ネットワーク接続時にIPアドレスを自動割り当てるプロトコル [問65解説]\n**プロキシサーバ** — クライアントの代理でWebサーバにアクセスする中継サーバ\n**FTPサーバ** — ファイル転送プロトコル(FTP)を使ってファイルを送受信するサーバ",
    difficulty: 3, importance: 4, isExamFrequent: true, status: "locked",
    position: polar(-120, 400),
    wikiUrl: "https://ja.wikipedia.org/wiki/Domain_Name_System",
  },
  {
    id: "tcp-ip",
    topicId: "network",
    title: "TCP/IP・プロトコル",
    description: "インターネット通信の標準ルール。信頼性のある通信を実現。",
    detail: "TCP/IPはインターネット通信の基盤プロトコル群です。\n\n**TCP** — 信頼性重視。到着確認あり。Web・メールに使用。\n**UDP** — 速度重視。確認なし。動画配信・ゲームに使用。\n**3ウェイハンドシェイク** — TCP接続確立: SYN → SYN-ACK → ACK\n**ポート番号** — HTTP=80、HTTPS=443、SMTP=25、POP3=110、IMAP4=143\n**メールプロトコル** — SMTP(送信)、POP3/IMAP4(受信) [問68]\n**Bcc** — 受信者に他の宛先を非表示で送信する機能 [問75]",
    difficulty: 3, importance: 5, isExamFrequent: true, status: "locked",
    position: polar(-120, 590),
    wikiUrl: "https://ja.wikipedia.org/wiki/TCP/IP",
  },
  {
    id: "http",
    topicId: "network",
    title: "HTTP/HTTPS・Web技術",
    description: "Webブラウザとサーバが通信するためのプロトコルとWeb技術の基礎。",
    detail: "HTTPはWebの基本プロトコルです。\n\n**HTTP** — WebブラウザとWebサーバ間の通信規格\n**HTTPS** — TLS/SSL暗号化を加えたHTTP。鍵マーク🔒\n**HTTPメソッド** — GET(取得)・POST(送信)・PUT(更新)・DELETE(削除)\n**ステータスコード** — 200(OK)・404(Not Found)・500(Server Error)\n**Cookie・セッション** — HTTPはステートレスなため、Cookieで状態保持\n**ウィザード** — 質問に答える対話形式で複雑な操作を誘導するUI [問66]",
    difficulty: 2, importance: 4, isExamFrequent: true, status: "locked",
    position: polar(-120, 780),
    wikiUrl: "https://ja.wikipedia.org/wiki/Hypertext_Transfer_Protocol",
  },

  // ── ARM 4 (180°) : 暗号化 → デジタル署名 → マルウェア ──
  {
    id: "encryption",
    topicId: "security",
    title: "暗号化・ハッシュ",
    description: "データを守る暗号技術。共通鍵・公開鍵・ハッシュ関数。",
    detail: "暗号化はデータを保護する基本技術です。\n\n**共通鍵暗号（対称暗号）** — 暗号化・復号に同じ鍵。高速。AES・DES。\n**公開鍵暗号（非対称暗号）** — 公開鍵で暗号化・秘密鍵で復号。RSA。[問7]\n**ハイブリッド暗号** — 公開鍵で共通鍵を交換し実通信は共通鍵。SSL/TLS。\n**ハッシュ関数** — 任意データ→固定長値。SHA-256/MD5。一方向性・改ざん検知。[問91]\n**機密性** — 権限ある者だけが情報にアクセスできる特性 [問77]",
    difficulty: 3, importance: 5, isExamFrequent: true, status: "locked",
    position: polar(180, 210),
    wikiUrl: "https://ja.wikipedia.org/wiki/%E6%9A%97%E5%8F%B7",
  },
  {
    id: "digital-signature",
    topicId: "security",
    title: "デジタル署名・PKI・認証",
    description: "送信者の正当性と改ざん検知を実現する技術とその基盤。",
    detail: "デジタル署名は電子的な印鑑です。\n\n**デジタル署名の仕組み** — ①秘密鍵で署名 ②公開鍵で検証\n**保証** — 認証（本人確認）・完全性（改ざんなし）・否認防止\n**PKI（公開鍵基盤）** — 認証局(CA)が電子証明書の正当性を保証する仕組み [問90]\n**電子証明書(SSL証明書)** — WebサイトのHTTPS通信に使用\n**リスクベース認証** — 普段と異なる環境からのログインで追加認証を求める [問71]\n**バイオメトリクス認証** — 指紋・虹彩・顔など生体情報で認証 [問80]",
    difficulty: 4, importance: 4, isExamFrequent: true, status: "locked",
    position: polar(180, 400),
    wikiUrl: "https://ja.wikipedia.org/wiki/%E3%83%87%E3%82%B8%E3%82%BF%E3%83%AB%E7%BD%B2%E5%90%8D",
  },
  {
    id: "malware",
    topicId: "security",
    title: "マルウェア・サイバー攻撃",
    description: "悪意あるソフトウェアの種類とサイバー攻撃の手口・対策。",
    detail: "マルウェアはMalicious Software（悪意のあるソフトウェア）です。\n\n**マルウェアの種類**\n- ウイルス：他ファイルに寄生して感染を広げる\n- ランサムウェア：ファイルを暗号化し身代金要求 [問63/11]\n- トロイの木馬：正規ソフトに偽装して侵入\n- スパイウェア：個人情報を密かに収集\n\n**攻撃手法**\n- フィッシング：偽サイトで情報を騙し取る\n- APT攻撃：特定組織への長期継続型サイバー攻撃 [問96]\n- SQLインジェクション：不正SQLでDB攻撃\n- DDoS攻撃：大量リクエストでサービス停止\n- ゼロデイ攻撃：未発見脆弱性の悪用\n\n**対策**\n- セキュリティパッチ適用（OSの脆弱性修正） [問83]\n- バックアップ取得",
    difficulty: 3, importance: 5, isExamFrequent: true, status: "locked",
    position: polar(180, 590),
    wikiUrl: "https://ja.wikipedia.org/wiki/%E3%83%9E%E3%83%AB%E3%82%A6%E3%82%A7%E3%82%A2",
  },

  // ── ARM 4.5 (150°) : ファイアウォール ──
  {
    id: "firewall",
    topicId: "security",
    title: "ファイアウォール・ゼロトラスト",
    description: "不正通信を遮断するネットワーク防御と、ゼロトラストセキュリティ。",
    detail: "ファイアウォールはネットワークの門番です。\n\n**ファイアウォール** — ルールに基づき内外の通信を許可・遮断 [問15]\n**DMZ（非武装地帯）** — 公開サーバを内外両ネットワークから切り離した中間ゾーン\n**WAF** — Webアプリへの攻撃（SQLインジェクション等）を防ぐ専用FW\n**サニタイジング** — ユーザー入力に含まれる有害文字列を無害に置換する処理 [問95]\n**脅威と脆弱性** — 脅威=情報資産に悪影響を及ぼす可能性のある原因、脆弱性=情報資産の弱点 [問89]\n**ゼロトラスト** — 「全アクセスを信頼しない」。社内外問わず常に認証・認可 [問92]",
    difficulty: 3, importance: 4, isExamFrequent: true, status: "locked",
    position: polar(150, 400),
    wikiUrl: "https://ja.wikipedia.org/wiki/%E3%83%95%E3%82%A1%E3%82%A4%E3%82%A2%E3%82%A6%E3%82%A9%E3%83%BC%E3%83%AB",
  },

  // ── ARM 5 (120°) : RDBMS → SQL → トランザクション ──
  {
    id: "rdbms",
    topicId: "database",
    title: "リレーショナルDB",
    description: "表形式でデータを管理するデータベース。Excelのような構造。",
    detail: "リレーショナルデータベース（RDB）は最もポピュラーなDB形式です。\n\n**テーブル** — Excelのシートのようなデータの表\n**主キー** — 各行を一意に識別する列\n**外部キー** — 他テーブルの主キーを参照する列。制約により参照整合性を保証 [問72]\n**正規化** — データの重複を排除し整合性を保つ設計技法 [問69]\n**代表的RDBMS** — MySQL・PostgreSQL・Oracle・SQL Server\n**ビュー** — 実データを持たない仮想的なテーブル",
    difficulty: 3, importance: 5, isExamFrequent: true, status: "locked",
    position: polar(120, 210),
    wikiUrl: "https://ja.wikipedia.org/wiki/%E9%96%A2%E4%BF%82%E3%83%87%E3%83%BC%E3%82%BF%E3%83%99%E3%83%BC%E3%82%B9%E7%AE%A1%E7%90%86%E3%82%B7%E3%82%B9%E3%83%86%E3%83%A0",
  },
  {
    id: "sql-basic",
    topicId: "database",
    title: "SQL基礎",
    description: "データベースを操作する言語。SELECT・INSERT・UPDATE・DELETE。",
    detail: "SQLはデータベース操作の標準言語です。\n\n**DML（データ操作言語）**\n```\nSELECT * FROM users WHERE age > 20 ORDER BY name;\nINSERT INTO users VALUES ('山田', 25);\nUPDATE users SET age=26 WHERE name='山田';\nDELETE FROM users WHERE name='山田';\n```\n**DDL** — CREATE/ALTER/DROP でテーブル定義を操作\n**JOIN** — INNER JOIN(両方一致)・LEFT JOIN(左テーブル全件)\n**GROUP BY・集計関数** — COUNT()・SUM()・AVG()・MAX()・MIN()",
    difficulty: 3, importance: 5, isExamFrequent: true, status: "locked",
    position: polar(120, 400),
    wikiUrl: "https://ja.wikipedia.org/wiki/SQL",
  },
  {
    id: "transaction",
    topicId: "database",
    title: "トランザクション・バックアップ",
    description: "DB整合性を保つトランザクション管理と障害対策バックアップ。",
    detail: "トランザクションはDBの整合性を守ります。\n\n**ACID特性**\n- 原子性(Atomicity)：全部成功 or 全部失敗 [問13]\n- 一貫性(Consistency)：常に整合性を保つ\n- 独立性(Isolation)：他のトランザクションの影響を受けない\n- 耐久性(Durability)：確定データは消えない\n\n**COMMIT/ROLLBACK** — 処理の確定/取り消し\n\n**バックアップ種類** [問86]\n- フルバックアップ：全データを毎回バックアップ\n- 差分バックアップ：前回フルバックアップからの変更分\n- 増分バックアップ：前回バックアップからの変更分\n\n**復旧** — 差分：フル＋最新差分の2ファイルで復元可能",
    difficulty: 4, importance: 4, isExamFrequent: true, status: "locked",
    position: polar(120, 590),
    wikiUrl: "https://ja.wikipedia.org/wiki/%E3%83%88%E3%83%A9%E3%83%B3%E3%82%B6%E3%82%AF%E3%82%B7%E3%83%A7%E3%83%B3_(%E3%83%87%E3%83%BC%E3%82%BF%E3%83%99%E3%83%BC%E3%82%B9)",
  },

  // ── ARM 6 (60°) : データ構造 → 整列 → 論理演算 ──
  {
    id: "data-structure",
    topicId: "algorithm",
    title: "データ構造",
    description: "データの格納・操作方法。配列・スタック・キュー・木構造。",
    detail: "データ構造はアルゴリズムの基盤です。\n\n**配列** — 順番に並んだデータ。添字でO(1)アクセス。\n**スタック(LIFO)** — 後入れ先出し。関数呼び出し管理に使用。\n**キュー(FIFO)** — 先入れ先出し。印刷スプーラに使用。\n**木構造(Tree)** — 階層的データ。2分探索木：左<親<右。\n**グラフ** — ノードとエッジの集合。地図・ネットワーク表現。\n**ハッシュテーブル** — キーから格納場所を計算。平均O(1)検索。",
    difficulty: 3, importance: 4, isExamFrequent: true, status: "locked",
    position: polar(60, 210),
    wikiUrl: "https://ja.wikipedia.org/wiki/%E3%83%87%E3%83%BC%E3%82%BF%E6%A7%8B%E9%80%A0",
  },
  {
    id: "sort",
    topicId: "algorithm",
    title: "整列・探索アルゴリズム",
    description: "データを並べ替える方法と目的データを見つける方法。",
    detail: "アルゴリズムの計算量を理解することが重要です。\n\n**整列（ソート）**\n- バブルソート：隣接要素を比較・交換。O(n²) [問67概念]\n- 選択ソート：最小値を先頭へ移動を繰り返す。O(n²)\n- クイックソート：ピボットで分割。平均O(n log n)\n- マージソート：分割して結合。O(n log n)・安定ソート\n\n**探索（サーチ）**\n- 線形探索：先頭から順番。O(n)\n- 2分探索：ソート済みデータを半分ずつ絞る。O(log n)\n\n**ビッグO記法** — O(1)<O(log n)<O(n)<O(n log n)<O(n²)",
    difficulty: 3, importance: 3, isExamFrequent: false, status: "locked",
    position: polar(60, 400),
    wikiUrl: "https://ja.wikipedia.org/wiki/%E3%82%BD%E3%83%BC%E3%83%88",
  },
  {
    id: "logic",
    topicId: "algorithm",
    title: "論理演算・プログラミング基礎",
    description: "AND・OR・NOTなどの論理演算とプログラムの基本構造。",
    detail: "論理演算はCPUとプログラムの基礎です。\n\n**基本論理演算**\n- AND(論理積)：両方1のとき1\n- OR(論理和)：どちらかが1のとき1\n- NOT(否定)：0→1、1→0\n- XOR(排他的論理和)：どちらかだけが1のとき1\n- NAND：ANDの否定\n\n**プログラムの基本構造** — 順次・分岐(if)・繰り返し(for/while)\n\n**演繹推論** — 一般的規則→個別結論（三段論法）[問84]\n**帰納推論** — 個別事例→一般規則\n\n**素数判定プログラム** — 2からnの平方根まで割り切れなければ素数 [問85概念]",
    difficulty: 3, importance: 3, isExamFrequent: false, status: "locked",
    position: polar(60, 590),
    wikiUrl: "https://ja.wikipedia.org/wiki/%E8%AB%96%E7%90%86%E6%BC%94%E7%AE%97",
  },

  // ── NEW: ISMS (165°, セキュリティとDBの中間) ──
  {
    id: "isms",
    topicId: "security",
    title: "ISMS・情報セキュリティ管理",
    description: "組織全体で情報セキュリティを管理するマネジメントシステム。",
    detail: "ISMSは情報セキュリティマネジメントシステムです。(ISO 27001)\n\n**ISMS活動の順序** [問93]\n1. 適用範囲の決定（最初に行う）\n2. リスクアセスメント（特定・分析・評価）\n3. リスク対応の実施\n4. 内部監査\n\n**CIAトライアド**\n- 機密性(Confidentiality)：権限者のみアクセス可\n- 完全性(Integrity)：改ざんされていない\n- 可用性(Availability)：必要時に使える\n\n**物理的対策** — 遠隔地バックアップ・入退室管理 [問94]\n**人的対策** — 教育・訓練\n**技術的対策** — ファイアウォール・暗号化\n\n**情報セキュリティインシデント管理** — 報告経路を事前に整備 [問70]\n**経営者の役割** — 自らリーダーシップを発揮してサイバー対策を推進 [問79]",
    difficulty: 3, importance: 4, isExamFrequent: true, status: "locked",
    position: polar(165, 560),
    wikiUrl: "https://ja.wikipedia.org/wiki/%E6%83%85%E5%A0%B1%E3%82%BB%E3%82%AD%E3%83%A5%E3%83%AA%E3%83%86%E3%82%A3%E3%83%9E%E3%83%8D%E3%82%B8%E3%83%A1%E3%83%B3%E3%83%88%E3%82%B7%E3%82%B9%E3%83%86%E3%83%A0",
  },

  // ── NEW: IoT (-90°, ネットワークの上側) ──
  {
    id: "iot",
    topicId: "network",
    title: "IoT・センサー・組込み",
    description: "モノのインターネット。センサーで物理世界とデジタルを接続。",
    detail: "IoT（Internet of Things）はあらゆる物がネット接続する概念です。\n\n**センサー** — 温度・光・音などの物理情報を電気信号に変換 [問78]\n**アクチュエーター** — 電気信号を受けて物理的に動作（モーター・バルブなど）\n**エッジコンピューティング** — IoTデバイス近くでデータを処理してクラウド負荷を軽減\n\n**IoT向け通信規格**\n- BLE（Bluetooth Low Energy）— Bluetooth規格の省電力版 [問81]\n- LPWA — 省電力・広範囲（数km〜数十km）。4Gより消費電力が少ない [問76]\n- キャリアアグリゲーション — 複数の周波数帯を束ねて高速化する技術 [問64]\n\n**組込みシステム** — 特定機能のために機器に組み込まれたコンピュータシステム",
    difficulty: 3, importance: 4, isExamFrequent: true, status: "locked",
    position: polar(-90, 450),
    wikiUrl: "https://ja.wikipedia.org/wiki/%E3%83%A2%E3%83%8E%E3%81%AE%E3%82%A4%E3%83%B3%E3%82%BF%E3%83%BC%E3%83%8D%E3%83%83%E3%83%88",
  },

  // ── NEW: AI・機械学習 (20°, CPUとデータ構造の間) ──
  {
    id: "ai-ml",
    topicId: "algorithm",
    title: "AI・機械学習",
    description: "人工知能と機械学習の仕組み。ニューラルネットワークと推論。",
    detail: "AIは人工知能、機械学習はその実現手法です。\n\n**機械学習の種類**\n- 教師あり学習：正解データから学習\n- 教師なし学習：データのパターンを自動発見\n- 強化学習：報酬を最大化する行動を学習\n\n**ニューラルネットワーク** — 脳の神経細胞を模した計算モデル\n**ディープラーニング** — 多層ニューラルネットワークによる深層学習\n**バックプロパゲーション（誤差逆伝搬法）** — 出力の誤差を逆向きに伝えながら各ノードの重みを調整する学習手法 [問82]\n\n**推論の種類** [問84]\n- 演繹推論：一般規則→個別結論（三段論法）\n- 帰納推論：個別事例→一般規則\n- 仮説形成：結論から仮説を推測\n\n**プロンプトエンジニアリング** — 生成AIから意図した回答を得るため、質問・指示を最適化する技術 [問98]",
    difficulty: 3, importance: 5, isExamFrequent: true, status: "locked",
    position: polar(20, 480),
    wikiUrl: "https://ja.wikipedia.org/wiki/%E6%A9%9F%E6%A2%B0%E5%AD%A6%E7%BF%92",
  },

  // ── NEW: OSS・ライセンス (-150°, ネットワークとセキュリティの間) ──
  {
    id: "oss",
    topicId: "software",
    title: "OSS・ソフトウェアライセンス",
    description: "オープンソースソフトウェアの定義・ライセンスと著作権の基礎。",
    detail: "OSSとライセンスはIT利用の法的基盤です。\n\n**OSS（オープンソースソフトウェア）** — ソースコードを公開・改変・再配布可能なソフトウェア\n\n**コピーレフト** — OSSを改変した派生ソフトも同じライセンスで公開しなければならない原則 [問73]\n**GPL** — コピーレフトを強制する代表的ライセンス\n**MITライセンス** — 条件が少なく商用利用も自由\n\n**著作権とAI** [問1概念]\n- 生成AIの生成物をインターネット公開→著作権者の許諾が必要な場合あり\n- 私的使用の複製→許諾不要\n\n**ベンチマークテスト** — 標準的な処理を実際のシステムで実行し性能を定量評価する手法 [問62]",
    difficulty: 3, importance: 3, isExamFrequent: false, status: "locked",
    position: polar(-150, 430),
    wikiUrl: "https://ja.wikipedia.org/wiki/%E3%82%AA%E3%83%BC%E3%83%97%E3%83%B3%E3%82%BD%E3%83%BC%E3%82%B9%E3%82%BD%E3%83%95%E3%83%88%E3%82%A6%E3%82%A7%E3%82%A2",
  },

  // ── ストラテジ系 ARM (-15°) : 経営戦略 → マーケティング → 法律 ──
  {
    id: "keiei",
    topicId: "strategy",
    title: "経営戦略・経営分析",
    description: "企業が競争優位を確立するための戦略立案手法。SWOT・PPM・BSCなど。",
    detail: "経営戦略は企業が長期的に競争優位を確立するための計画です。\n\n**SWOT分析** — 強み(S)・弱み(W)・機会(O)・脅威(T)で内外環境を分析\n**PPM（プロダクト・ポートフォリオ・マネジメント）** — 市場成長率×市場占有率で「花形」「金のなる木」「問題児」「負け犬」に分類\n**バランスドスコアカード（BSC）** — 財務・顧客・業務プロセス・学習と成長の4視点で戦略達成度を管理\n**コアコンピタンス** — 他社に真似されない自社固有の中核的な強み・能力\n**BCP（事業継続計画）** — 災害・緊急事態時に重要業務を継続するための計画\n**KPI** — 目標達成度を測定する重要業績評価指標",
    difficulty: 2, importance: 4, isExamFrequent: true, status: "locked",
    position: polar(-15, 420),
    wikiUrl: "https://ja.wikipedia.org/wiki/%E7%B5%8C%E5%96%B6%E6%88%A6%E7%95%A5",
  },
  {
    id: "marketing",
    topicId: "strategy",
    title: "マーケティング・流通",
    description: "顧客ニーズを把握し価値を届けるマーケティング活動の基礎。4P・CRM・EC。",
    detail: "マーケティングは顧客ニーズを見つけ価値を届ける活動全体です。\n\n**マーケティングミックス（4P）**\n- Product（製品）：何を売るか\n- Price（価格）：いくらで売るか\n- Place（流通）：どこで売るか\n- Promotion（プロモーション）：どう知らせるか\n\n**STP分析** — Segmentation（市場細分化）・Targeting（標的市場選択）・Positioning（位置付け）\n**CRM（顧客関係管理）** — 顧客情報を一元管理し長期関係を構築する戦略・システム\n**ロングテール** — 多数の少量販売品の売上合計がヒット商品を上回る現象。ECサイトで顕著。\n**eコマース** — インターネット上での商品・サービス売買",
    difficulty: 2, importance: 3, isExamFrequent: false, status: "locked",
    position: polar(-15, 620),
    wikiUrl: "https://ja.wikipedia.org/wiki/%E3%83%9E%E3%83%BC%E3%82%B1%E3%83%86%E3%82%A3%E3%83%B3%E3%82%B0",
  },
  {
    id: "houmu",
    topicId: "strategy",
    title: "法律・知的財産・コンプライアンス",
    description: "著作権・特許・個人情報保護法など企業活動に必要な法律知識。",
    detail: "企業活動に関わる法律・知的財産権・コンプライアンスの知識です。\n\n**著作権** — 創作物の創作時点で自動発生。登録不要。死後70年間保護。\n**産業財産権**\n- 特許権：発明の保護（存続期間20年）。出願・審査・登録が必要。\n- 実用新案権：物品の形状・構造に関する考案（10年）\n- 商標権：商品・サービスの識別マーク（10年・更新可）\n- 意匠権：物品のデザイン・外観（25年）\n\n**個人情報保護法** — 個人情報の取得・利用・安全管理を義務付け\n**不正競争防止法** — 営業秘密の不正取得・使用・開示等を禁止\n**コンプライアンス** — 法令・社内規則・社会規範の遵守\n**内部統制** — リスク管理と業務プロセスの適切な管理体制",
    difficulty: 3, importance: 4, isExamFrequent: true, status: "locked",
    position: polar(-15, 820),
    wikiUrl: "https://ja.wikipedia.org/wiki/%E7%9F%A5%E7%9A%84%E8%B2%A1%E7%94%A3%E6%A8%A9",
  },

  // ── マネジメント系 ARM (-35°) : プロジェクト管理 → システム開発 → サービス管理 ──
  {
    id: "pj-mgmt",
    topicId: "management",
    title: "プロジェクトマネジメント",
    description: "プロジェクトを成功させるための計画・実行・管理手法。PMBOK・WBS・ガントチャート。",
    detail: "プロジェクトマネジメントはプロジェクトを成功に導く知識・手法の体系です。\n\n**PMBOK** — PMIが策定したプロジェクトマネジメントの標準的な知識体系\n**WBS（Work Breakdown Structure）** — プロジェクト作業を階層的に分解した成果物ベースの構造図\n**ガントチャート** — 作業の開始・終了・進捗を横棒グラフで表示するスケジュール管理図\n**アロー図（PERT）** — 作業の依存関係を矢線で表したネットワーク図。最長経路を分析。\n**クリティカルパス** — 開始から終了までの最長経路。ここが遅れると全体が遅延する。\n**マイルストーン** — プロジェクトの重要な節目・中間目標地点\n\n**プロジェクトの3大制約** — スコープ（範囲）・コスト（費用）・スケジュール（時間）のバランス管理",
    difficulty: 3, importance: 4, isExamFrequent: true, status: "locked",
    position: polar(-35, 420),
    wikiUrl: "https://ja.wikipedia.org/wiki/%E3%83%97%E3%83%AD%E3%82%B8%E3%82%A7%E3%82%AF%E3%83%88%E3%83%9E%E3%83%8D%E3%82%B8%E3%83%A1%E3%83%B3%E3%83%88",
  },
  {
    id: "sys-dev",
    topicId: "management",
    title: "システム開発プロセス",
    description: "ソフトウェア開発の手法。ウォーターフォール・アジャイル・各種テスト技法。",
    detail: "システム開発プロセスはソフトウェアを構築する際の標準的な手順です。\n\n**開発プロセスモデル**\n- ウォーターフォール：要件定義→設計→実装→テスト→運用を順番に実施。手戻りは困難。\n- プロトタイプ：試作品を作り利用者の確認を繰り返す\n- スパイラル：リスク分析を繰り返しながら段階的に開発\n- アジャイル：短期反復（スプリント）でリリースを繰り返す。スクラム・XP等。変化に強い。\n\n**テスト技法**\n- ブラックボックステスト：内部構造を考慮せず入出力仕様からテストを設計\n- ホワイトボックステスト：内部ロジックを検証。命令網羅・分岐網羅。\n- リグレッションテスト：修正後に既存機能が壊れていないか再テスト\n\n**DevOps** — 開発(Dev)と運用(Ops)が連携し継続的にデリバリーする手法",
    difficulty: 3, importance: 4, isExamFrequent: true, status: "locked",
    position: polar(-35, 620),
    wikiUrl: "https://ja.wikipedia.org/wiki/%E3%82%BD%E3%83%95%E3%83%88%E3%82%A6%E3%82%A7%E3%82%A2%E9%96%8B%E7%99%BA%E3%83%97%E3%83%AD%E3%82%BB%E3%82%B9",
  },
  {
    id: "service-mgmt",
    topicId: "management",
    title: "サービスマネジメント・ITIL",
    description: "ITサービスの品質・可用性を継続管理するフレームワーク。ITIL・SLA・MTBF。",
    detail: "サービスマネジメントはITサービスの品質を継続的に維持・改善するための体系です。\n\n**ITIL（IT Infrastructure Library）** — ITサービスマネジメントのベストプラクティス集\n**SLA（Service Level Agreement）** — サービス提供者と利用者間でサービス品質水準を合意した文書\n\n**ITILの主要プロセス**\n- インシデント管理：発生した障害を迅速に復旧する（速度優先、根本原因は後回し）\n- 問題管理：インシデントの根本原因を特定・排除する（再発防止）\n- 変更管理：システム変更を計画的に管理しリスクを最小化\n- 構成管理：IT資産(CMDB)を正確に把握・管理\n\n**可用性・信頼性指標**\n- MTBF（平均故障間隔）= 稼働中の平均時間（大きいほど良い）\n- MTTR（平均修復時間）= 故障から復旧の平均時間（小さいほど良い）\n- 稼働率 = MTBF ÷ (MTBF + MTTR)\n\n**サービスデスク** — ITサービスの問い合わせ一元窓口（SPOC）",
    difficulty: 3, importance: 4, isExamFrequent: true, status: "locked",
    position: polar(-35, 820),
    wikiUrl: "https://ja.wikipedia.org/wiki/ITIL",
  },
];

// ─────────────────────────────────────────────────────────
// 接続定義
// ─────────────────────────────────────────────────────────
export const connections: Connection[] = [
  // Arm 1: CPU chain
  { fromNodeId: "binary",    toNodeId: "cpu-basic",  relationType: "dependency" },
  { fromNodeId: "cpu-basic", toNodeId: "os-basic",   relationType: "dependency" },
  { fromNodeId: "os-basic",  toNodeId: "process",    relationType: "dependency" },

  // Arm 2: Memory chain
  { fromNodeId: "binary",  toNodeId: "ram",     relationType: "dependency" },
  { fromNodeId: "ram",     toNodeId: "storage", relationType: "dependency" },
  { fromNodeId: "storage", toNodeId: "cloud",   relationType: "dependency" },

  // Arm 3: Network chain
  { fromNodeId: "binary", toNodeId: "ip",     relationType: "dependency" },
  { fromNodeId: "ip",     toNodeId: "dns",    relationType: "dependency" },
  { fromNodeId: "ip",     toNodeId: "tcp-ip", relationType: "dependency" },
  { fromNodeId: "tcp-ip", toNodeId: "http",   relationType: "dependency" },

  // Arm 4: Security chain
  { fromNodeId: "binary",      toNodeId: "encryption",        relationType: "dependency" },
  { fromNodeId: "encryption",  toNodeId: "digital-signature", relationType: "dependency" },
  { fromNodeId: "encryption",  toNodeId: "malware",           relationType: "dependency" },

  // Arm 4.5: Firewall
  { fromNodeId: "encryption", toNodeId: "firewall", relationType: "dependency" },

  // Arm 5: Database chain
  { fromNodeId: "binary",    toNodeId: "rdbms",       relationType: "dependency" },
  { fromNodeId: "rdbms",     toNodeId: "sql-basic",   relationType: "dependency" },
  { fromNodeId: "rdbms",     toNodeId: "transaction", relationType: "dependency" },

  // Arm 6: Algorithm chain
  { fromNodeId: "binary",         toNodeId: "data-structure", relationType: "dependency" },
  { fromNodeId: "data-structure", toNodeId: "sort",           relationType: "dependency" },
  { fromNodeId: "data-structure", toNodeId: "logic",          relationType: "dependency" },

  // New nodes
  { fromNodeId: "malware",   toNodeId: "isms",   relationType: "dependency" },
  { fromNodeId: "firewall",  toNodeId: "isms",   relationType: "related" },
  { fromNodeId: "ip",        toNodeId: "iot",    relationType: "dependency" },
  { fromNodeId: "cpu-basic", toNodeId: "ai-ml",  relationType: "dependency" },
  { fromNodeId: "os-basic",  toNodeId: "oss",    relationType: "dependency" },

  // 横断接続（スフィア盤らしい斜め線）
  { fromNodeId: "cpu-basic", toNodeId: "ram",            relationType: "related" },
  { fromNodeId: "ram",       toNodeId: "os-basic",       relationType: "related" },
  { fromNodeId: "http",      toNodeId: "encryption",     relationType: "related" },
  { fromNodeId: "os-basic",  toNodeId: "rdbms",          relationType: "related" },
  { fromNodeId: "cpu-basic", toNodeId: "data-structure", relationType: "related" },
  { fromNodeId: "firewall",  toNodeId: "ip",             relationType: "related" },
  { fromNodeId: "cloud",     toNodeId: "os-basic",       relationType: "related" },
  { fromNodeId: "iot",       toNodeId: "cloud",          relationType: "related" },
  { fromNodeId: "data-structure", toNodeId: "ai-ml",     relationType: "related" },

  // ストラテジ系 (-15° arm)
  { fromNodeId: "binary",    toNodeId: "keiei",        relationType: "dependency" },
  { fromNodeId: "keiei",     toNodeId: "marketing",    relationType: "dependency" },
  { fromNodeId: "keiei",     toNodeId: "houmu",        relationType: "dependency" },

  // マネジメント系 (-35° arm)
  { fromNodeId: "binary",    toNodeId: "pj-mgmt",      relationType: "dependency" },
  { fromNodeId: "pj-mgmt",   toNodeId: "sys-dev",      relationType: "dependency" },
  { fromNodeId: "sys-dev",   toNodeId: "service-mgmt", relationType: "dependency" },

  // 横断接続
  { fromNodeId: "keiei",        toNodeId: "pj-mgmt",      relationType: "related" },
  { fromNodeId: "houmu",        toNodeId: "isms",          relationType: "related" },
  { fromNodeId: "sys-dev",      toNodeId: "process",       relationType: "related" },
  { fromNodeId: "service-mgmt", toNodeId: "cloud",         relationType: "related" },
  { fromNodeId: "marketing",    toNodeId: "ai-ml",         relationType: "related" },
];

// ─────────────────────────────────────────────────────────
// 問題集  (令和8年春 ITパスポート 過去問に基づく)
// ─────────────────────────────────────────────────────────
export const questions: Question[] = [
  // ── binary ──
  {
    id: "q-bin1", nodeId: "binary",
    question: "10進数の「13」を2進数に変換するとどれか。",
    choices: ["1011", "1101", "1110", "1100"],
    answer: 1,
    explanation: "13 = 8+4+1 = 2³+2²+2⁰ = 1101（2進数）",
  },
  {
    id: "q-bin2", nodeId: "binary",
    question: "16進数の「FF」を10進数に変換するとどれか。",
    choices: ["240", "255", "256", "128"],
    answer: 1,
    explanation: "FF = 15×16 + 15 = 240 + 15 = 255",
  },
  {
    id: "q-bin3", nodeId: "binary",
    question: "2進数の1111を10進数に変換するとどれか。",
    choices: ["13", "14", "15", "16"],
    answer: 2,
    explanation: "1111 = 2³+2²+2¹+2⁰ = 8+4+2+1 = 15",
  },

  // ── cpu-basic ──
  {
    id: "q-cpu1", nodeId: "cpu-basic",
    question: "CPUの演算装置（ALU）が行う処理として正しいものはどれか。",
    choices: ["四則演算や論理演算を行う", "データを長期保存する", "ネットワークに接続する", "画面に映像を出力する"],
    answer: 0,
    explanation: "ALU（算術論理演算装置）は加算・減算などの算術演算とAND・ORなどの論理演算を行う。",
  },
  {
    id: "q-cpu2", nodeId: "cpu-basic",
    question: "クロック周波数が3GHzのCPUが1秒間に実行できる基本演算の回数はどれか。",
    choices: ["3百万回", "30百万回", "3億回", "30億回"],
    answer: 3,
    explanation: "1GHz=10億回/秒。3GHz=30億回/秒。クロック周波数が高いほどCPUの処理速度が速い。",
  },

  // ── ram ──
  {
    id: "q-ram1", nodeId: "ram",
    question: "主記憶装置（RAM）の特徴として正しいものはどれか。",
    choices: ["電源を切ってもデータが保持される", "補助記憶装置より低速", "電源を切るとデータが消える揮発性メモリ", "CPUより高速にアクセスできる"],
    answer: 2,
    explanation: "RAMは揮発性メモリで電源を切るとデータが消える。補助記憶装置(HDD/SSD)よりは高速。",
  },
  {
    id: "q-ram2", nodeId: "ram",
    question: "PCの画面表示に必要なデータを保持するために使われる画面表示専用メモリはどれか。（令和8年春 問61）",
    choices: ["EEPROM", "VRAM", "キャッシュメモリ", "フラッシュメモリ"],
    answer: 1,
    explanation: "VRAM（Video RAM）はGPUによる描画処理のため画像データを一時保存する専用メモリ。EEPROMは制御プログラム用、キャッシュメモリはCPU-RAM間の速度差補正用、フラッシュメモリはUSBメモリ等の長期保存用。",
  },

  // ── storage ──
  {
    id: "q-str1", nodeId: "storage",
    question: "NASの説明として適切なものはどれか。（令和8年春 問87）",
    choices: [
      "ネットワークに直接接続して複数端末が共有利用できる外部記憶装置",
      "求めるデータに直接アクセスできるファイル形式",
      "複数記憶装置でアクセスを高速化・冗長化するRAID技術",
      "無線LANのネットワーク識別に用いる文字列（SSID）",
    ],
    answer: 0,
    explanation: "NAS（Network Attached Storage）はネットワークに直接接続し、複数の端末がファイル共有できる外部記憶装置。RAIDはウ、SSIDはエの説明。",
  },
  {
    id: "q-str2", nodeId: "storage",
    question: "スキャナやプリンタの解像度を表す単位はどれか。（令和8年春 問99概念）",
    choices: ["bps", "dpi", "GHz", "MHz"],
    answer: 1,
    explanation: "dpi（dots per inch）は1インチ当たりのドット数を表す解像度の単位。値が大きいほど細かい印刷・読み取りが可能。",
  },

  // ── os-basic ──
  {
    id: "q-os1", nodeId: "os-basic",
    question: "OSの機能として正しくないものはどれか。",
    choices: ["プロセス管理", "メモリ管理", "四則演算の実行", "ファイル管理"],
    answer: 2,
    explanation: "四則演算はCPUのALUが行う処理。OSはプロセス管理、メモリ管理、ファイル管理、デバイス管理を担当する。",
  },
  {
    id: "q-os2", nodeId: "os-basic",
    question: "アプリケーションの操作で質問に答える対話形式によって煩雑な操作を簡単に行えるようにする機能はどれか。（令和8年春 問66）",
    choices: ["アーカイブ", "ウィザード", "オートコンプリート", "ポップアップウィンドウ"],
    answer: 1,
    explanation: "ウィザードは段階的な質問に答えることで複雑な操作を誘導するUI。OSの初回設定やソフトウェアインストール時に使われる。",
  },
  {
    id: "q-os3", nodeId: "os-basic",
    question: "OSSのライセンスにおけるコピーレフトの説明として適切なものはどれか。（令和8年春 問73）",
    choices: [
      "著作者がソフトウェアの著作権を放棄している",
      "利用者は金銭的な対価を支払わなければならない",
      "改変した派生ソフトウェアはソースコードを非公開のまま配布できる",
      "改変して派生ソフトウェアを配布する場合は元と同じライセンスを適用しなければならない",
    ],
    answer: 3,
    explanation: "コピーレフトはOSSを改変した派生ソフトウェアを配布する際に、同じライセンスを適用することを求める原則。GPLが代表的。",
  },

  // ── ip ──
  {
    id: "q-ip1", nodeId: "ip",
    question: "IPv4アドレスの説明として正しいものはどれか。",
    choices: ["128ビットで表現", "32ビットで表現され約43億個のアドレス", "64ビットで表現", "アドレス数は無限"],
    answer: 1,
    explanation: "IPv4は32ビットで表現され、約43億個(2の32乗)のアドレスが存在。アドレス枯渇問題からIPv6が登場。",
  },

  // ── dns ──
  {
    id: "q-dns1", nodeId: "dns",
    question: "DNSサーバの役割として適切なものはどれか。（令和8年春 問65）",
    choices: [
      "インターネット上のWebサーバへのリクエストを中継する",
      "PCへファイルを転送する要求を受け付けファイルを転送する",
      "PCに対してIPアドレスを自動で割り当てる",
      "ドメイン名をIPアドレスに変換、またはIPアドレスをドメイン名に変換する",
    ],
    answer: 3,
    explanation: "DNSは名前解決サーバ。ア=プロキシサーバ、イ=FTPサーバ、ウ=DHCPサーバの説明。",
  },
  {
    id: "q-dns2", nodeId: "dns",
    question: "DHCPの役割として正しいものはどれか。",
    choices: ["ドメイン名をIPアドレスに変換する", "端末にIPアドレスを自動的に割り当てる", "不正な通信を遮断する", "電子メールを配送する"],
    answer: 1,
    explanation: "DHCP（Dynamic Host Configuration Protocol）はネットワーク接続時にIPアドレスを自動割り当てするプロトコル。手動設定が不要になる。",
  },

  // ── tcp-ip ──
  {
    id: "q-tcp1", nodeId: "tcp-ip",
    question: "TCPとUDPの違いとして正しいものはどれか。",
    choices: [
      "TCPは速度重視、UDPは信頼性重視",
      "TCPは信頼性重視でデータ到着を確認し、UDPは速度重視で確認しない",
      "TCPはリアルタイム通信向き、UDPはファイル転送向き",
      "TCPとUDPの違いはない",
    ],
    answer: 1,
    explanation: "TCPは3ウェイハンドシェイクなどでデータ到着を確認する信頼性重視のプロトコル。UDPは確認なしで高速に送信する。",
  },
  {
    id: "q-tcp2", nodeId: "tcp-ip",
    question: "メールソフトが電子メールの送信に用いるプロトコルはどれか。（令和8年春 問68）",
    choices: ["FTP", "IMAP4", "POP3", "SMTP"],
    answer: 3,
    explanation: "SMTP（Simple Mail Transfer Protocol）はメール送信用プロトコル。POP3とIMAP4は受信用。FTPはファイル転送用。",
  },
  {
    id: "q-tcp3", nodeId: "tcp-ip",
    question: "電子メールのBcc欄に関する記述として適切なものはどれか。（令和8年春 問75）",
    choices: [
      "Bcc欄の宛先にはTo欄・Cc欄のアドレスは通知されない",
      "Bcc欄の宛先には自動的に暗号化されたメールが送信される",
      "Bcc欄の宛先には添付ファイルが削除されたメールが送信される",
      "To欄・Cc欄の宛先にはBcc欄のアドレスが通知されない",
    ],
    answer: 3,
    explanation: "Bcc（Blind Carbon Copy）で指定した宛先は他の受信者に非表示。暗号化や添付削除はBccの機能ではない。",
  },

  // ── encryption ──
  {
    id: "q-enc1", nodeId: "encryption",
    question: "公開鍵暗号方式の説明として正しいものはどれか。",
    choices: [
      "暗号化と復号に同じ鍵を使用する",
      "公開鍵で暗号化し対応する秘密鍵で復号する",
      "共通鍵暗号より処理が高速",
      "鍵を公開する必要がない",
    ],
    answer: 1,
    explanation: "公開鍵暗号方式では公開鍵で暗号化し、秘密鍵で復号する。鍵の受け渡しが安全だが共通鍵暗号より処理が遅い。",
  },
  {
    id: "q-enc2", nodeId: "encryption",
    question: "ハッシュ関数に関する記述として適切なものはどれか。（令和8年春 問91）",
    choices: [
      "ハッシュ値を入力することで元のデータを復元できる",
      "同じデータを異なるハッシュ関数に入力すると同じ値になる",
      "同じハッシュ関数に同じデータを入力すれば常に同じハッシュ値になる",
      "どのハッシュ関数にも逆関数が存在し元のデータを復元できる",
    ],
    answer: 2,
    explanation: "ハッシュ関数は決定性を持ち、同一入力に対して常に同じハッシュ値を生成する。一方向性があり逆計算は困難。異なる関数では異なる値になる。",
  },
  {
    id: "q-enc3", nodeId: "encryption",
    question: "虹彩認証装置への変更はCIAの情報セキュリティ要素のどれを高める対策か。（令和8年春 問77）",
    choices: ["可用性", "完全性", "機密性", "否認防止"],
    answer: 2,
    explanation: "機密性（Confidentiality）は権限ある者だけが情報にアクセスできる特性。虹彩認証は権限のない者の入室を防ぐため機密性を高める。",
  },

  // ── digital-signature ──
  {
    id: "q-sig1", nodeId: "digital-signature",
    question: "PKI（公開鍵基盤）の特徴として適切なものはどれか。（令和8年春 問90）",
    choices: [
      "共通鍵の所有者を確認する方法が提供されている",
      "知人が署名した鍵は信頼するという「信頼の輪」で公開鍵を確認する",
      "電子証明書の正当性を認証局が保証する",
      "秘密鍵を安全に公開する方法が提供されている",
    ],
    answer: 2,
    explanation: "PKIでは認証局(CA)が電子証明書を発行し公開鍵の正当性を保証する。ア=共通鍵は対象外、イ=PGPの仕組み、エ=秘密鍵は公開不可。",
  },
  {
    id: "q-sig2", nodeId: "digital-signature",
    question: "リスクベース認証の例として適切なものはどれか。（令和8年春 問71）",
    choices: [
      "普段と異なるPCからのログインで秘密の質問による追加認証を求めた",
      "一定時間操作がなかったので自動ログアウトして再ログインを求めた",
      "パスワードを連続して複数回間違えたのでアカウントをロックした",
      "パスワードが長期間変更されていなかったので変更を促した",
    ],
    answer: 0,
    explanation: "リスクベース認証は普段と異なる環境（IPアドレス・OS・ブラウザなど）からのアクセスで追加認証を求める方式。他はセッションタイムアウト、アカウントロック、パスワードポリシーの例。",
  },

  // ── malware ──
  {
    id: "q-mal1", nodeId: "malware",
    question: "ランサムウェアによる被害を低減させるための対策として適切なものはどれか。（令和8年春 問63）",
    choices: ["UPSの導入", "データの暗号化", "データのバックアップ", "ログインパスワードの変更"],
    answer: 2,
    explanation: "ランサムウェアはデータを暗号化し復元に金銭要求するマルウェア。身代金を払っても復旧保証がないため、日頃からのバックアップが最重要対策。",
  },
  {
    id: "q-mal2", nodeId: "malware",
    question: "マルウェア感染を防止するための対策として適切なものはどれか。（令和8年春 問83）",
    choices: [
      "OSのセキュリティパッチ（修正モジュール）の適用",
      "起動ドライブとなっているHDDへのパスワード設定",
      "複雑なログインパスワードの導入",
      "定期的なパスワード変更",
    ],
    answer: 0,
    explanation: "OSのセキュリティパッチは脆弱性を修正しマルウェアの侵入経路を塞ぐ。HDDパスワードやログインパスワードはPC紛失・不正ログイン対策であり、マルウェア感染防止とは直接関係しない。",
  },
  {
    id: "q-mal3", nodeId: "malware",
    question: "特定組織に対して複数の攻撃手法を使い長期間継続的に攻撃するサイバー攻撃はどれか。（令和8年春 問96）",
    choices: ["APT攻撃", "DDoS攻撃", "ゼロデイ攻撃", "パスワードリスト攻撃"],
    answer: 0,
    explanation: "APT攻撃（Advanced Persistent Threats）は特定組織・個人に対して複数の攻撃手法を組み合わせて長期間継続する高度な標的型攻撃。",
  },

  // ── firewall ──
  {
    id: "q-fw1", nodeId: "firewall",
    question: "ファイアウォールの主な目的として正しいものはどれか。",
    choices: [
      "ファイルを圧縮して転送速度を向上させる",
      "ウイルスをリアルタイムで駆除する",
      "設定されたルールに基づき不正な通信を遮断する",
      "パスワードを自動生成する",
    ],
    answer: 2,
    explanation: "ファイアウォールはIPアドレスやポート番号などのルールに基づいて、内部ネットワークへの不正なアクセスを遮断する。",
  },
  {
    id: "q-fw2", nodeId: "firewall",
    question: "SQLインジェクション対策などで用いられる、有害な文字列を無害に置き換える処理を何というか。（令和8年春 問95）",
    choices: ["MACアドレスフィルタリング", "サニタイジング", "ストライピング", "ソーシャルエンジニアリング"],
    answer: 1,
    explanation: "サニタイジングはWebアプリで、ユーザー入力に含まれる攻撃コード（HTMLやSQL特殊文字）を無害な文字列に置換する処理。SQLインジェクション・XSSの対策。",
  },
  {
    id: "q-fw3", nodeId: "firewall",
    question: "ゼロトラストセキュリティの考え方に基づいた情報セキュリティ対策の例として適切なものはどれか。（令和8年春 問92）",
    choices: [
      "インターネットと内部NWの境界にFWを配置し脅威を境界で遮断する",
      "内部・外部を問わずネットワーク上の資源へのアクセスには二要素認証を利用する",
      "脆弱性が発見されたセキュリティパッチを公開後直ちに適用する",
      "インターネットに接続するPCだけにマルウェア対策ソフトをインストールする",
    ],
    answer: 1,
    explanation: "ゼロトラストは「すべてのアクセスを信頼しない」モデル。社内外問わず常に認証・認可を実施する。境界防御（ア）とは根本的に異なるアプローチ。",
  },
  {
    id: "q-fw4", nodeId: "firewall",
    question: "守るべき情報資産に悪影響を及ぼす可能性のある原因を「脅威」、情報資産の弱点を何というか。（令和8年春 問89）",
    choices: ["インシデント", "脆弱性", "リスク", "影響"],
    answer: 1,
    explanation: "脅威=情報資産に損害を与える潜在的要因（マルウェア・サイバー攻撃など）、脆弱性=システムに内在する欠点（バグ・セキュリティホールなど）。",
  },

  // ── rdbms ──
  {
    id: "q-db1", nodeId: "rdbms",
    question: "関係データベースにおける正規化に関する記述として適切なものはどれか。（令和8年春 問69）",
    choices: [
      "データの重複を増やし検索を高速化する",
      "データの重複を排除し一貫性を維持して保守性を高めることが主な目的",
      "テーブルを結合して1つの大きなテーブルを作成する",
      "データの暗号化と圧縮を行う",
    ],
    answer: 1,
    explanation: "正規化の主な目的はデータの重複を排除し、一貫性（論理的・整合的な状態）を維持して保守性を高めること。定められたルールに従い1つの表を複数の表に分解する。",
  },
  {
    id: "q-db2", nodeId: "rdbms",
    question: "新たな顧客が口座開設と同時に入金するとき、顧客・口座・取引明細の3表にデータを追加する適切な順序はどれか。（令和8年春 問72）",
    choices: ["口座→顧客→取引明細", "顧客→口座→取引明細", "顧客→取引明細→口座", "取引明細→口座→顧客"],
    answer: 1,
    explanation: "外部キー制約により参照先のデータが先に存在しなければならない。取引明細は口座を参照し、口座は顧客を参照するため、顧客→口座→取引明細の順が正しい。",
  },

  // ── sql-basic ──
  {
    id: "q-sql1", nodeId: "sql-basic",
    question: "SQLでデータを取得するための命令はどれか。",
    choices: ["INSERT", "UPDATE", "SELECT", "DELETE"],
    answer: 2,
    explanation: "SELECT文はデータを取得するためのSQL命令。例：SELECT * FROM users WHERE age > 20;",
  },
  {
    id: "q-sql2", nodeId: "sql-basic",
    question: "複数のテーブルを結合する際、両テーブルに存在するデータのみ返すJOINの種類はどれか。",
    choices: ["FULL OUTER JOIN", "LEFT JOIN", "RIGHT JOIN", "INNER JOIN"],
    answer: 3,
    explanation: "INNER JOINは両テーブルに一致するデータのみを返す。LEFT JOINは左テーブル全件+右テーブルの一致分を返す。",
  },

  // ── transaction ──
  {
    id: "q-trn1", nodeId: "transaction",
    question: "トランザクションのACID特性のうち「原子性」の説明として正しいものはどれか。",
    choices: ["常に整合性を保つ", "全部成功か全部失敗かのどちらかである", "他のトランザクションの影響を受けない", "確定したデータは消えない"],
    answer: 1,
    explanation: "原子性（Atomicity）はトランザクション内の処理が全て成功するか全て失敗してロールバックされるかのどちらかであることを保証する性質。",
  },
  {
    id: "q-trn2", nodeId: "transaction",
    question: "毎週土曜日フルバックアップ、日〜金に差分バックアップを取得している。火曜日の業務終了時点に復旧するために最低限必要なファイルはどれか。（令和8年春 問86）",
    choices: [
      "日・月・火曜日の差分バックアップファイル",
      "火曜日の差分バックアップファイル",
      "土曜日のフルバックアップと日・月・火曜日の差分バックアップ",
      "土曜日のフルバックアップと火曜日の差分バックアップ",
    ],
    answer: 3,
    explanation: "差分バックアップは前回フルバックアップからの差分を記録する。火曜の差分は土曜フル以降の全変更を含むため、土曜フル+火曜差分の2ファイルで復旧可能。",
  },

  // ── data-structure ──
  {
    id: "q-ds1", nodeId: "data-structure",
    question: "スタックのデータ操作の特徴として正しいものはどれか。",
    choices: ["先に入れたデータが先に取り出される（FIFO）", "後に入れたデータが先に取り出される（LIFO）", "任意の位置のデータをランダムに取り出せる", "データの追加は先頭のみ可能"],
    answer: 1,
    explanation: "スタックはLIFO（Last In First Out）構造。後から積んだものから順に取り出す。皿の積み重ねをイメージ。",
  },

  // ── sort ──
  {
    id: "q-srt1", nodeId: "sort",
    question: "配列{3,5,1,2,4}を選択ソートで昇順並べ替えするとき、3回目の交換後の配列はどれか。（令和8年春 問67概念）",
    choices: ["1,2,3,4,5", "1,2,3,5,4", "1,5,3,2,4", "3,5,1,2,4"],
    answer: 1,
    explanation: "選択ソートは未整列部分から最小値を探して先頭に置く処理を繰り返す。3回の交換後は{1,2,3,5,4}となり、最小の3要素が正しい位置に移動している。",
  },
  {
    id: "q-srt2", nodeId: "sort",
    question: "2分探索の特徴として正しいものはどれか。",
    choices: ["未整列のデータにも適用できる", "先頭から順番に比較する", "ソート済みデータに適用し、毎回対象範囲を半分に絞る", "O(n²)の計算量が必要"],
    answer: 2,
    explanation: "2分探索はソート済みデータを前提に、毎回中央と比較して対象範囲を半分に絞る。O(log n)と高速。線形探索のO(n)より優れる。",
  },

  // ── logic ──
  {
    id: "q-lgc1", nodeId: "logic",
    question: "演繹推論の実行例として適切なものはどれか。（令和8年春 問84）",
    choices: [
      "HDDとSSDが記憶装置なら、HDDで容量が増えるならSSDでも増えると結論する",
      "HDDで容量が増える事実から記憶装置全般で容量が増えると推論し、HDDが記憶装置であると出力する",
      "HDDとSSDが記憶容量を持つ個別事例から全ての記憶装置が容量を持つと結論する",
      "「全ての記憶装置は容量を持つ」かつ「HDDは記憶装置」から「HDDは容量を持つ」と結論する",
    ],
    answer: 3,
    explanation: "演繹推論は一般規則から個別結論を導く三段論法。「全てのAはBである」「CはAである」「よってCはBである」の形式。",
  },

  // ── isms ──
  {
    id: "q-isms1", nodeId: "isms",
    question: "ISMSにおける実施項目のうち最初に行うものはどれか。（令和8年春 問93）",
    choices: ["ISMSの適用範囲の決定", "情報セキュリティリスクアセスメント", "情報セキュリティリスク対応", "内部監査"],
    answer: 0,
    explanation: "ISMSはまず適用範囲（管理対象の部門・業務・情報資産の境界）を決定することから始まる。その後リスクアセスメント→対応→監査の順で進む。",
  },
  {
    id: "q-isms2", nodeId: "isms",
    question: "情報セキュリティインシデントの管理に関する記述として適切なものはどれか。（令和8年春 問70）",
    choices: [
      "臨機応変な対応が求められるので事前に対応手順を文書化しない",
      "インシデントから得た知識は模倣を防ぐため管理策強化に使わない",
      "情報セキュリティ事象は評価を待たず報告時点でインシデントに分類する",
      "情報セキュリティ事象を速やかに報告するため、連絡経路と仕組みを事前に用意する",
    ],
    answer: 3,
    explanation: "インシデント管理では速やかな報告のために連絡経路を事前に整備することが重要。ア=文書化は必須、イ=知識は改善に使う、ウ=評価後に分類する。",
  },
  {
    id: "q-isms3", nodeId: "isms",
    question: "情報セキュリティ対策のうち物理的セキュリティ対策の例として適切なものはどれか。（令和8年春 問94）",
    choices: [
      "機密情報の取扱い規則を制定し定期的な教育を実施する",
      "遠隔地にバックアップシステムを用意して災害時にサービスを継続する",
      "サイバー攻撃対策の情報を従業員に周知する",
      "マルウェア対策ソフトを導入し定義ファイルを最新に保つ",
    ],
    answer: 1,
    explanation: "物理的セキュリティ対策は設備・拠点に関する物理的脅威への備え。遠隔地へのバックアップシステム設置が該当。ア・ウ=人的対策、エ=技術的対策。",
  },
  {
    id: "q-isms4", nodeId: "isms",
    question: "サイバーセキュリティリスク対策を推進する際の経営者に求められる役割として最も適切なものはどれか。（令和8年春 問79）",
    choices: [
      "IT部門のセキュリティ担当者に全て任せる",
      "CISOを任命し実行と判断を全て任せる",
      "実施方針の検討・予算と人材の割当・実施状況の確認を通じて自らリーダーシップを発揮する",
      "外部コンサルタントに権限と責任を委譲する",
    ],
    answer: 2,
    explanation: "経営者はセキュリティ対策でリーダーシップを発揮し、方針策定・リソース配分・実施確認を行う。CISOや外部への「丸投げ」は不適切。",
  },

  // ── iot ──
  {
    id: "q-iot1", nodeId: "iot",
    question: "IoTデバイスが外気温を計測してサーバへ送信するシステムで、外気温を電気信号に変換する役割を持つものはどれか。（令和8年春 問78）",
    choices: ["アクチュエーター", "エッジコンピューティング", "キャリアアグリゲーション", "センサー"],
    answer: 3,
    explanation: "センサーは温度・光・音などの物理情報を電気信号・デジタル情報に変換する部品。アクチュエーターは逆に電気信号を受けて物理動作を実行する。",
  },
  {
    id: "q-iot2", nodeId: "iot",
    question: "LPWAに分類される無線通信方式の特徴として適切なものはどれか。（令和8年春 問76）",
    choices: [
      "通信範囲が無線LANより狭く消費電力が4Gより多い",
      "通信範囲が無線LANより狭く消費電力が4Gより少ない",
      "通信範囲が無線LANより広く消費電力が4Gより多い",
      "通信範囲が無線LANより広く消費電力が4Gより少ない",
    ],
    answer: 3,
    explanation: "LPWA（Low Power Wide Area）は無線LANの約100mに比べて数km〜数十kmの広範囲通信が可能で、ボタン電池で数年稼働可能なほど消費電力が少ない。IoTデバイスに最適。",
  },
  {
    id: "q-iot3", nodeId: "iot",
    question: "複数の異なる周波数の電波を束ねることによって無線通信を高速化する技術はどれか。（令和8年春 問64）",
    choices: ["ハンドオーバー", "通信の暗号化", "キャリアアグリゲーション", "インフラストラクチャモード"],
    answer: 2,
    explanation: "キャリアアグリゲーションは複数の周波数帯の搬送波を同時に組み合わせてデータ通信を高速化する技術。LTE-Advancedから導入。",
  },
  {
    id: "q-iot4", nodeId: "iot",
    question: "Bluetooth規格に含まれ、デバイス間の省電力通信を実現するものはどれか。（令和8年春 問81）",
    choices: ["BLE", "LPWA", "LTE", "PLC"],
    answer: 0,
    explanation: "BLE（Bluetooth Low Energy）はBluetooth規格の一部で低消費電力に特化した通信方式。ボタン電池1個で数ヶ月〜数年稼働可能。LPWAはBluetooth規格ではない。",
  },

  // ── ai-ml ──
  {
    id: "q-ai1", nodeId: "ai-ml",
    question: "ニューラルネットワークの学習に用いられるバックプロパゲーションで行われていることはどれか。（令和8年春 問82）",
    choices: [
      "各ノードの重みを調整して誤差を小さくする",
      "各ノードの重みを調整して最適な活性化関数を選択する",
      "ノードの数を変更して誤差を小さくする",
      "ノードの数を変更して処理速度を高める",
    ],
    answer: 0,
    explanation: "バックプロパゲーション（誤差逆伝搬法）は出力層から入力層へ誤差を逆向きに伝えながら各ノードの重みを調整し、誤差を最小化する学習手法。",
  },
  {
    id: "q-ai2", nodeId: "ai-ml",
    question: "プロンプトエンジニアリングの説明として適切なものはどれか。（令和8年春 問98）",
    choices: [
      "AIが多数の事象から普遍的なルールを獲得すること",
      "AIへの質問が入力できる状態を画面上に示すこと",
      "意図した回答を得るためにAIへの質問・指示・情報提供・出力形式の指定などを工夫すること",
      "神経細胞のネットワークをコンピュータで模したAIの計算モデルのこと",
    ],
    answer: 2,
    explanation: "プロンプトエンジニアリングは生成AIから目的に合った回答を得るために、質問・命令・条件などの入力文を最適化する技術。指示の明確化・情報提供・出力例の提示などが基本要素。",
  },
  {
    id: "q-ai3", nodeId: "ai-ml",
    question: "演繹推論・帰納推論・仮説形成のうち演繹推論の説明として適切なものはどれか。（令和8年春 問84概念）",
    choices: [
      "個別の事例から一般的な規則を導く",
      "結論から原因となる仮説を推測する",
      "一般的な規則と前提から個別の結論を導く三段論法",
      "大量データから統計的パターンを発見する",
    ],
    answer: 2,
    explanation: "演繹推論は「全てのAはBである」「CはAである」「よってCはBである」という形式で一般規則から個別結論を論理的に導く。帰納は個別→一般、仮説形成は結論→仮説。",
  },

  // ── oss ──
  {
    id: "q-oss1", nodeId: "oss",
    question: "システムの性能評価におけるベンチマークテストに関する記述として適切なものはどれか。（令和8年春 問62）",
    choices: [
      "同じデータ・プログラムを疑似システム上で実行して性能を評価する",
      "システムの動作特性をモデル化して疑似システム上で実行して評価する",
      "プログラムステップ数やハードウェア性能を机上計算して性能を評価する",
      "標準的な処理を設定し評価用プログラムを実際のシステム上で実行して性能を評価する",
    ],
    answer: 3,
    explanation: "ベンチマークテストは標準的な処理を実際のシステム上で実行して性能を定量的に評価する。疑似システムや机上計算ではなく、実機での測定が特徴。",
  },

  // ── cloud ──
  {
    id: "q-cld1", nodeId: "cloud",
    question: "IaaS（Infrastructure as a Service）の説明として正しいものはどれか。",
    choices: [
      "アプリをサービスとして提供（例：Gmail）",
      "開発・実行環境をサービスとして提供",
      "サーバやネットワークなどインフラをサービスとして提供",
      "データベースのみをサービスとして提供",
    ],
    answer: 2,
    explanation: "IaaSはサーバー・ストレージ・ネットワークなどのインフラをクラウドで提供するサービスモデル。AWS EC2などが代表例。SaaSはア、PaaSはイ。",
  },

  // ── keiei ──
  {
    id: "q-kei1", nodeId: "keiei",
    question: "SWOT分析における内部環境の弱み（Weakness）に該当するものはどれか。",
    choices: ["競合他社が少ない成長市場の出現", "競合他社と比べて低い顧客満足度", "法改正による新たなビジネス機会", "急激な為替変動によるコスト増"],
    answer: 1,
    explanation: "SWOTのWeakness（弱み）は自社内部の改善すべき点。顧客満足度の低さは内部の弱み。ア=機会(O)、ウ=機会(O)、エ=脅威(T)。",
  },
  {
    id: "q-kei2", nodeId: "keiei",
    question: "PPMで「金のなる木」と分類される事業の特徴として適切なものはどれか。",
    choices: [
      "市場成長率が高く市場占有率も高い",
      "市場成長率が低く市場占有率も低い",
      "市場成長率が低く市場占有率が高い",
      "市場成長率が高く市場占有率が低い",
    ],
    answer: 2,
    explanation: "PPMの「金のなる木」は成長率の低い成熟市場で高シェアを誇り、安定した利益を生む事業。「花形」=ア、「負け犬」=イ、「問題児」=エ。",
  },
  {
    id: "q-kei3", nodeId: "keiei",
    question: "バランスドスコアカード（BSC）の4つの視点として正しい組合せはどれか。",
    choices: [
      "財務・顧客・内部プロセス・学習と成長",
      "財務・生産・販売・人事",
      "品質・コスト・納期・安全",
      "強み・弱み・機会・脅威",
    ],
    answer: 0,
    explanation: "BSCは財務・顧客・内部ビジネスプロセス・学習と成長の4視点で戦略達成状況を多角的に評価・管理するフレームワーク。エ=SWOT分析の要素。",
  },
  {
    id: "q-kei4", nodeId: "keiei",
    question: "BCP（事業継続計画）の目的として最も適切なものはどれか。",
    choices: [
      "市場シェアを拡大するための成長戦略を策定する",
      "大規模災害などの緊急事態が発生しても重要業務を継続できるよう備える",
      "IT投資の費用対効果を算出する",
      "新製品の開発プロセスを標準化する",
    ],
    answer: 1,
    explanation: "BCP（Business Continuity Plan）は地震・感染症などの緊急事態が発生しても、重要業務を継続・早期復旧させるための計画。",
  },

  // ── marketing ──
  {
    id: "q-mkt1", nodeId: "marketing",
    question: "マーケティングミックスの4Pのうち「Place」に該当するものはどれか。",
    choices: ["広告・宣伝活動", "販売価格の設定", "製品の機能・デザイン", "販売経路・流通チャネル"],
    answer: 3,
    explanation: "4PのPlace（場所・流通）は製品をどのチャネル（直販・卸売・EC等）で顧客に届けるかを決める要素。Promotion=ア、Price=イ、Product=ウ。",
  },
  {
    id: "q-mkt2", nodeId: "marketing",
    question: "CRM（顧客関係管理）の目的として適切なものはどれか。",
    choices: [
      "社内の業務プロセスを一元管理し効率化する",
      "顧客情報を一元管理し長期的な顧客関係を構築して顧客満足度・収益を向上させる",
      "製造工程の品質データを収集して不良品を削減する",
      "サプライチェーン全体の在庫・物流情報を最適化する",
    ],
    answer: 1,
    explanation: "CRM（Customer Relationship Management）は顧客情報を蓄積・分析し、個々の顧客に最適なアプローチで長期関係を強化する戦略・システム。ア=ERP、エ=SCM。",
  },
  {
    id: "q-mkt3", nodeId: "marketing",
    question: "ロングテール戦略に関する記述として適切なものはどれか。",
    choices: [
      "売れ筋の少数ヒット商品に集中して収益を最大化する戦略",
      "多数の少量販売商品の売上合計がヒット商品の合計を上回るという現象を活用した戦略",
      "価格を段階的に下げることで需要を最大化する価格戦略",
      "SNSのインフルエンサーを活用したプロモーション戦略",
    ],
    answer: 1,
    explanation: "ロングテールはECサイトのように在庫コストが低い環境で、多数のニッチ商品の累計売上がヒット商品を上回る現象。Amazonが代表例。",
  },

  // ── houmu ──
  {
    id: "q-hou1", nodeId: "houmu",
    question: "著作権に関する記述として正しいものはどれか。",
    choices: [
      "著作権は特許庁に出願・登録しなければ発生しない",
      "著作権は著作物を創作した時点で自動的に発生する",
      "著作権の保護期間は登録から10年間",
      "企業が作成した著作物には著作権が発生しない",
    ],
    answer: 1,
    explanation: "著作権は創作した時点で自動発生（無方式主義）。特許のような出願・登録は不要。個人の場合は著作者の死後70年間保護。",
  },
  {
    id: "q-hou2", nodeId: "houmu",
    question: "産業財産権のうち、物品のデザイン・外観を保護する権利はどれか。",
    choices: ["実用新案権", "商標権", "意匠権", "著作権"],
    answer: 2,
    explanation: "意匠権は物品の形状・模様・色彩などのデザイン・外観を保護する権利。特許庁への出願・登録が必要で保護期間は25年。著作権は産業財産権に含まれない。",
  },
  {
    id: "q-hou3", nodeId: "houmu",
    question: "個人情報保護法に関する記述として適切なものはどれか。",
    choices: [
      "個人情報とは氏名のみを指す",
      "個人情報を第三者に提供する際は原則として本人の同意が必要",
      "個人情報は利用目的を公表せずに収集してもよい",
      "従業員数100人以上の企業のみ対象となる法律",
    ],
    answer: 1,
    explanation: "個人情報保護法では、個人情報を第三者に提供するには原則として本人の事前同意が必要。個人情報は特定個人を識別できる情報全般で、事業者規模に関わらず適用される。",
  },

  // ── pj-mgmt ──
  {
    id: "q-pm1", nodeId: "pj-mgmt",
    question: "WBS（Work Breakdown Structure）に関する記述として適切なものはどれか。",
    choices: [
      "作業の開始日・終了日・進捗を横棒グラフで表したもの",
      "プロジェクトの成果物と作業を階層的に分解した構造図",
      "作業間の依存関係を矢線で表したネットワーク図",
      "要員のスキルと担当作業を対応付けた表",
    ],
    answer: 1,
    explanation: "WBSはプロジェクトの成果物と実施すべき作業を管理可能な単位に階層的に分解した構造図。プロジェクト計画の基礎となる。ア=ガントチャート、ウ=アロー図（PERT）。",
  },
  {
    id: "q-pm2", nodeId: "pj-mgmt",
    question: "クリティカルパスの説明として正しいものはどれか。",
    choices: [
      "プロジェクト全体でコストが最も高い作業の経路",
      "最も高いリスクを持つ作業を結んだ経路",
      "プロジェクト開始から終了までの最長の経路で、遅延するとプロジェクト全体が遅延する",
      "最も品質要求が厳しい作業を結んだ経路",
    ],
    answer: 2,
    explanation: "クリティカルパスはPERT/アロー図でプロジェクト全体の完了日を決定する最長経路。この経路上の作業が1日遅れるとプロジェクト全体の完了も1日遅れる。",
  },
  {
    id: "q-pm3", nodeId: "pj-mgmt",
    question: "ガントチャートの特徴として適切なものはどれか。",
    choices: [
      "作業間の依存関係（先行・後続）を視覚的に表現できる",
      "各作業の開始・終了時期と進捗状況を横棒グラフで一覧表示できる",
      "プロジェクト全体のクリティカルパスを算出できる",
      "作業ごとのコストと品質を詳細に管理できる",
    ],
    answer: 1,
    explanation: "ガントチャートは縦軸に作業、横軸に時間をとり、作業の開始・終了・進捗を棒グラフで表示する。スケジュール管理に広く使われる。作業間の依存関係の表現にはアロー図が適している。",
  },

  // ── sys-dev ──
  {
    id: "q-syd1", nodeId: "sys-dev",
    question: "アジャイル開発の特徴として最も適切なものはどれか。",
    choices: [
      "要件定義から本番稼働まで一方向に進め、途中での仕様変更は受け付けない",
      "短い反復（イテレーション）でソフトウェアをリリースし、顧客フィードバックに素早く対応する",
      "詳細な設計書を先に完成させてから実装を開始する",
      "リスク分析を各フェーズで行い、問題がなければ次のフェーズへ進む",
    ],
    answer: 1,
    explanation: "アジャイル開発は1〜4週間のスプリントを繰り返し、動くソフトウェアを継続的にリリースする。顧客フィードバックを素早く反映できる変化に強い手法。ア・ウ=ウォーターフォール、エ=スパイラルモデル。",
  },
  {
    id: "q-syd2", nodeId: "sys-dev",
    question: "ブラックボックステストの説明として正しいものはどれか。",
    choices: [
      "プログラムの内部ロジック（命令・分岐）を網羅するようテストを設計する",
      "プログラムの外部仕様（入出力）に基づきテストを設計し、内部構造は考慮しない",
      "本番環境で実際のデータを使って動作を確認するテスト",
      "修正後に既存機能が壊れていないかを確認するテスト",
    ],
    answer: 1,
    explanation: "ブラックボックステストは内部構造を無視し、仕様書に基づいて入力と期待出力を定義してテストする。同値分割・境界値分析が代表技法。ア=ホワイトボックステスト、エ=リグレッションテスト。",
  },
  {
    id: "q-syd3", nodeId: "sys-dev",
    question: "リグレッションテスト（回帰テスト）の目的として適切なものはどれか。",
    choices: [
      "新機能の仕様を網羅的に検証するため",
      "バグ修正や機能追加によって既存の正常動作していた機能が壊れていないかを確認するため",
      "プログラムの性能（レスポンス時間・スループット）を測定するため",
      "利用者が実際の業務手順で操作して受け入れ可否を判定するため",
    ],
    answer: 1,
    explanation: "リグレッションテストは変更（バグ修正・機能追加など）を加えた後、以前は正常だった機能が壊れていないことを確認する。デグレード（劣化）防止が目的。エ=受け入れテスト（UAT）。",
  },

  // ── http (追加) ──
  {
    id: "q-http1", nodeId: "http",
    question: "HTTPSとHTTPの主な違いとして正しいものはどれか。",
    choices: ["HTTPSはHTTPより通信速度が高速", "HTTPSはTLS/SSLによって通信内容を暗号化し盗聴・改ざんを防ぐ", "HTTPSは画像のみ送受信できる", "HTTPSはサーバとの接続を常時維持する"],
    answer: 1,
    explanation: "HTTPS（HTTP Secure）はHTTPにTLS/SSL暗号化を追加したプロトコル。通信内容を暗号化することで盗聴・改ざん・なりすましを防ぐ。ブラウザに🔒が表示される。",
  },
  {
    id: "q-http2", nodeId: "http",
    question: "HTTPステータスコード「404」の意味として正しいものはどれか。",
    choices: ["リクエスト成功", "サーバー内部エラー", "リクエストされたリソースが見つからない", "アクセス権限がない"],
    answer: 2,
    explanation: "404 Not Foundはリクエストしたページ・ファイル等がサーバ上に存在しない場合のHTTPステータスコード。200=成功、403=権限なし、500=サーバエラー。",
  },
  {
    id: "q-http3", nodeId: "http",
    question: "WebブラウザのCookieに関する説明として適切なものはどれか。",
    choices: ["WebページのHTMLを高速表示するためのキャッシュ", "サーバがブラウザに保存させる小データで、セッション管理・ログイン状態保持に使われる", "ブラウザの検索履歴", "フォームデータを暗号化する仕組み"],
    answer: 1,
    explanation: "CookieはWebサーバがブラウザに保存させる小さなデータ。HTTPはステートレスなため、Cookieを使ってログイン状態やカート情報を保持する。",
  },

  // ── process (追加) ──
  {
    id: "q-proc1", nodeId: "process",
    question: "デッドロックの説明として正しいものはどれか。",
    choices: ["CPUが過負荷でシステムが停止する状態", "複数プロセスが互いのリソース解放を待ち合い全て停止してしまう状態", "ネットワーク帯域不足でデータ転送が停止する状態", "メモリ不足でプログラムが強制終了される状態"],
    answer: 1,
    explanation: "デッドロックはプロセスAがリソースXを保持しYを待ち、プロセスBがYを保持しXを待つ状態。互いに永久に待ち続け処理が進まなくなる。解決策は資源の順序付け・タイムアウト設定など。",
  },
  {
    id: "q-proc2", nodeId: "process",
    question: "仮想記憶（仮想メモリ）に関する説明として適切なものはどれか。",
    choices: ["物理RAMの速度を仮想的に向上させる技術", "補助記憶装置（SSD/HDD）の一部を主記憶のように使い、実際のRAM容量より大きなメモリ空間を実現する技術", "複数CPUコアを一つとして統合する技術", "ネットワーク経由でメモリを共有する技術"],
    answer: 1,
    explanation: "仮想記憶はRAMが不足した際にHDD/SSDの一部（ページファイル/スワップ）をメモリとして使う技術。実際のRAMより大きなプログラムも実行可能になる。",
  },
  {
    id: "q-proc3", nodeId: "process",
    question: "スプーリング（Spooling）の目的として正しいものはどれか。",
    choices: ["CPUの処理速度向上のためのキャッシュ技術", "高速なCPUと低速なプリンタ等の速度差を吸収するため一時的にデータをバッファに蓄える技術", "複数プロセスに公平にCPU時間を割り当てる技術", "メモリ断片化を解消するガベージコレクション技術"],
    answer: 1,
    explanation: "スプーリングはCPUと低速I/O装置（プリンタ等）の速度差を埋めるためデータを一時的にディスクに蓄える技術。CPUをI/O待ちで停止させず効率的に利用できる。",
  },

  // ── data-structure (追加) ──
  {
    id: "q-ds2", nodeId: "data-structure",
    question: "キュー（Queue）のデータ操作の特徴として正しいものはどれか。",
    choices: ["後に入れたデータが先に取り出される（LIFO）", "先に入れたデータが先に取り出される（FIFO）", "任意の位置のデータをO(1)で取り出せる", "データは常にソート済みで管理される"],
    answer: 1,
    explanation: "キューはFIFO（First In First Out）構造。先に入れたデータが先に取り出される。銀行の待ち行列や印刷スプーラに使われる。スタック（LIFO）と混同しないよう注意。",
  },
  {
    id: "q-ds3", nodeId: "data-structure",
    question: "2分探索木の特徴として正しいものはどれか。",
    choices: ["全ノードが必ず2つの子を持つ", "左の子 < 親 < 右の子 を満たす木構造で効率的な検索が可能", "全ての葉が同じ深さにある完全平衡木", "データの挿入順に左から並べた木"],
    answer: 1,
    explanation: "2分探索木（BST）は各ノードで「左の子 < 親 < 右の子」の条件を満たす木。この性質でO(log n)の二分探索が可能。中順巡回でソート済みデータが得られる。",
  },

  // ── logic (追加) ──
  {
    id: "q-lgc2", nodeId: "logic",
    question: "排他的論理和（XOR）で「1 XOR 0」の結果はどれか。",
    choices: ["0", "1", "不定", "2"],
    answer: 1,
    explanation: "XOR（排他的論理和）は2つの入力が異なるとき1、同じとき0を出力する。1 XOR 0 = 1（異なる）、1 XOR 1 = 0（同じ）、0 XOR 0 = 0（同じ）。暗号化・誤り検出に利用される。",
  },
  {
    id: "q-lgc3", nodeId: "logic",
    question: "プログラムの3つの基本制御構造として正しい組み合わせはどれか。",
    choices: ["宣言・処理・終了", "入力・演算・出力", "順次・分岐・繰り返し", "定義・実行・デバッグ"],
    answer: 2,
    explanation: "プログラムの3基本構造は①順次（上から順に実行）②分岐（if/else）③繰り返し（for/while）。構造化定理によりこれらの組み合わせで全アルゴリズムを表現できる。",
  },

  // ── oss (追加) ──
  {
    id: "q-oss2", nodeId: "oss",
    question: "OSSを活用するメリットとして適切なものはどれか。",
    choices: ["常に商用ソフトより高品質が保証される", "ソースコードを自由に入手・確認・改変でき、ライセンス料を抑えてコストを削減できる", "バグ発生時に開発元が必ず有償サポートを提供する", "セキュリティ脆弱性が存在しない"],
    answer: 1,
    explanation: "OSSのメリット：①ライセンスコストが無料～低コスト②ソースコード公開による透明性③世界中のコミュニティによる継続的改善④カスタマイズ可能。一方でサポートは自己責任の場合が多い。",
  },
  {
    id: "q-oss3", nodeId: "oss",
    question: "GPLライセンスの特徴として適切なものはどれか。",
    choices: ["商用製品に組み込んでも派生物のソース公開義務はない", "個人利用のみ許可し商用利用は禁止", "改変・再配布時には同一ライセンス（GPL）での公開を義務付けるコピーレフト条項がある", "ソースコードの閲覧のみ許可し改変は禁止"],
    answer: 2,
    explanation: "GPL（GNU General Public License）はコピーレフト型ライセンスの代表。GPLのソフトを組み込んだ派生物を配布する場合、派生物もGPLで公開が必要。Linuxカーネルが採用。",
  },

  // ── cloud (追加) ──
  {
    id: "q-cld2", nodeId: "cloud",
    question: "SaaS（Software as a Service）の例として最も適切なものはどれか。",
    choices: ["仮想サーバーを時間課金で貸し出すサービス（AWS EC2）", "データベースやランタイム等の開発環境を提供するサービス", "メールやワープロ等のアプリをブラウザから利用するサービス（Gmail等）", "物理サーバー設置場所とネットワーク接続だけを提供するサービス"],
    answer: 2,
    explanation: "SaaSはソフトウェアをサービスとして提供するモデル。インストール不要でブラウザ等からアプリを利用できる。Gmail・Office 365・Salesforceなどが代表例。ア=IaaS、イ=PaaS。",
  },
  {
    id: "q-cld3", nodeId: "cloud",
    question: "ハイブリッドクラウドの説明として適切なものはどれか。",
    choices: ["複数のクラウド事業者のサービスを組み合わせる形態（マルチクラウド）", "自社のプライベートクラウドとパブリッククラウドを組み合わせて利用する形態", "一つのクラウドを複数企業が共有する形態（コミュニティクラウド）", "クラウドとAIを組み合わせたサービス形態"],
    answer: 1,
    explanation: "ハイブリッドクラウドは自社運用のプライベートクラウド（またはオンプレミス）とパブリッククラウドを組み合わせた形態。機密データは社内、処理能力が必要な場合はパブリックを活用できる。",
  },

  // ── ip (追加) ──
  {
    id: "q-ip2", nodeId: "ip",
    question: "プライベートIPアドレスに関する記述として正しいものはどれか。",
    choices: ["インターネット上でグローバルに使用できるIPアドレス", "組織内のLANで使用するIPアドレスで、インターネット上では直接通信できない", "IPv6のみで使用できるアドレス形式", "ISPから動的に割り当てられるIPアドレス"],
    answer: 1,
    explanation: "プライベートIPアドレス（192.168.x.x、10.x.x.x等）は組織内LANで使用し、インターネット上では直接通信できない。インターネット接続時にはNATでグローバルIPに変換する。",
  },
  {
    id: "q-ip3", nodeId: "ip",
    question: "NATの説明として適切なものはどれか。",
    choices: ["ドメイン名をIPアドレスに変換する技術", "プライベートIPアドレスとグローバルIPアドレスを相互に変換する技術", "MACアドレスをIPアドレスに変換する技術", "IPv4をIPv6に変換する技術"],
    answer: 1,
    explanation: "NAT（Network Address Translation）はルータ等でプライベートIPとグローバルIPを変換する技術。一つのグローバルIPで複数端末がインターネットに接続できる。",
  },

  // ── sort (追加) ──
  {
    id: "q-srt3", nodeId: "sort",
    question: "クイックソートの平均計算量として正しいものはどれか。",
    choices: ["O(n)", "O(n²)", "O(n log n)", "O(log n)"],
    answer: 2,
    explanation: "クイックソートの平均計算量はO(n log n)。最悪はO(n²)（ピボット選択が悪い場合）。定数係数が小さく実際には高速なため広く使われる。マージソートも平均O(n log n)だが安定ソート。",
  },

  // ── rdbms (追加) ──
  {
    id: "q-db3", nodeId: "rdbms",
    question: "リレーショナルDBにおけるビュー（View）の説明として正しいものはどれか。",
    choices: ["物理的なデータを格納する実テーブルの別名", "SELECT文の結果を仮想的なテーブルとして定義したもの。実データを持たない", "テーブルのバックアップコピー", "インデックスを利用した高速検索専用テーブル"],
    answer: 1,
    explanation: "ビューはSELECT文を元に作成される仮想テーブル。実データを持たず参照時に元のSELECT文が実行される。アクセス制御（特定列のみ公開）や複雑クエリの簡略化に使われる。",
  },

  // ── sql-basic (追加) ──
  {
    id: "q-sql3", nodeId: "sql-basic",
    question: "担当者ごとの売上合計を求めるSQLとして正しいものはどれか。",
    choices: [
      "SELECT 担当者, SUM(売上) FROM 売上 ORDER BY 担当者;",
      "SELECT 担当者, SUM(売上) FROM 売上 GROUP BY 担当者;",
      "SELECT 担当者, COUNT(売上) FROM 売上 WHERE 担当者;",
      "SELECT SUM(売上) FROM 売上 HAVING 担当者;",
    ],
    answer: 1,
    explanation: "GROUP BYで担当者ごとにグループ化し、SUM()集計関数で合計を求める。ORDER BYはソート（グループ化ではない）、HAVINGはGROUP BY後の絞り込み条件に使う。",
  },

  // ── malware (追加) ──
  {
    id: "q-mal4", nodeId: "malware",
    question: "ソーシャルエンジニアリングの手口として適切なものはどれか。",
    choices: ["システムの脆弱性を悪用してネットワークに不正侵入する", "大量のリクエストを送りサーバをダウンさせる", "電話でIT担当者になりすましてパスワードを聞き出す", "Webサーバにスクリプトを注入して不正動作させる（XSS）"],
    answer: 2,
    explanation: "ソーシャルエンジニアリングは技術的な攻撃ではなく人間の心理・信頼を悪用して機密情報を騙し取る手法。電話・なりすましメール・なりすまし訪問などが手口。対策は教育・規則の徹底。",
  },

  // ── transaction (追加) ──
  {
    id: "q-trn3", nodeId: "transaction",
    question: "トランザクションのACID特性のうち「独立性（Isolation）」の説明として正しいものはどれか。",
    choices: ["処理が全部成功か全部失敗かのどちらかであること", "トランザクション処理中は他のトランザクションの影響を受けないこと", "確定したデータは障害が起きても消えないこと", "処理前後でデータの整合性が保たれること"],
    answer: 1,
    explanation: "独立性（Isolation）は並行実行されるトランザクションが互いに干渉しないことを保証する性質。原子性=ア、耐久性=ウ、一貫性=エ。",
  },

  // ── sys-dev (追加) ──
  {
    id: "q-syd4", nodeId: "sys-dev",
    question: "ウォーターフォールモデルのデメリットとして適切なものはどれか。",
    choices: ["開発工程の管理が難しい", "前の工程に戻ることが困難で要件変更への対応に時間とコストがかかる", "設計書を作成しないため品質管理が難しい", "チームメンバーの役割分担が不明確になりやすい"],
    answer: 1,
    explanation: "ウォーターフォールは各工程を順番に進めるため、後の工程で要件変更が発生すると大きな手戻りが発生する。アジャイルはこの問題を解決するため変化に強い短期反復型を採用。",
  },

  // ── ram (追加) ──
  {
    id: "q-ram3", nodeId: "ram",
    question: "キャッシュメモリの役割として正しいものはどれか。",
    choices: ["プログラムの実行結果を永続保存する", "CPUと主記憶（RAM）の処理速度差を埋めるため、よく使うデータを高速メモリに一時保存する", "グラフィックス処理のために使われる専用メモリ（VRAM）", "SSD/HDDの書き込み回数を減らすためのバッファ"],
    answer: 1,
    explanation: "キャッシュメモリはCPUとRAMの速度差を補うための高速小容量メモリ（SRAM）。よく使うデータ・命令をキャッシュに保持することでCPUの待ち時間を短縮する。L1/L2/L3キャッシュがある。",
  },

  // ── storage (追加) ──
  {
    id: "q-str3", nodeId: "storage",
    question: "RAID（Redundant Array of Independent Disks）の主な目的として適切なものはどれか。",
    choices: ["単一ディスクを仮想的に複数に分割してコストを削減する", "複数のディスクを組み合わせて信頼性（冗長性）や性能を向上させる", "ディスクの回転速度を上げてアクセス速度を向上させる", "ディスクのデフラグを自動化する"],
    answer: 1,
    explanation: "RAIDは複数のHDD/SSDを組み合わせる技術。RAID 1はミラーリング（冗長化）、RAID 0はストライピング（高速化）、RAID 5はパリティによる冗長化。NASによく採用される。",
  },

  // ── pj-mgmt (追加) ──
  {
    id: "q-pm4", nodeId: "pj-mgmt",
    question: "プロジェクトマネジメントにおけるマイルストーンの説明として適切なものはどれか。",
    choices: ["プロジェクト全体にかかるコストの見積もり額", "プロジェクトの進捗を確認するための重要な節目・中間目標地点", "プロジェクトのリスクを評価する手法", "チームメンバーの役割分担を定義した文書（RACI）"],
    answer: 1,
    explanation: "マイルストーンはプロジェクトの重要な節目（設計完了・テスト開始等）を示す中間目標地点。ガントチャートでひし形（◆）で表示されることが多い。進捗管理の基準点として機能する。",
  },

  // ── keiei (追加) ──
  {
    id: "q-kei5", nodeId: "keiei",
    question: "コアコンピタンスの説明として適切なものはどれか。",
    choices: ["企業の主要な事業部門のこと", "競合他社には容易に真似できない自社固有の中核的な強みや能力", "企業の財務上の核心となる収益源", "製品ラインナップ中で最も売れ筋の商品"],
    answer: 1,
    explanation: "コアコンピタンスはプラハラード&ハメルが提唱。顧客に価値をもたらし、競合他社に真似されにくく、複数事業に応用できる自社固有の能力・技術・知識の集合体。",
  },

  // ── service-mgmt ──
  {
    id: "q-svc1", nodeId: "service-mgmt",
    question: "MTBF（平均故障間隔）の説明として正しいものはどれか。",
    choices: [
      "故障が発生してから復旧するまでの平均時間",
      "修復後の稼働開始から次の故障が発生するまでの平均稼働時間",
      "システムの稼働時間を全体の時間で割った比率",
      "1ヶ月間に発生する平均故障件数",
    ],
    answer: 1,
    explanation: "MTBF（Mean Time Between Failures）は修復後の稼働開始から次の故障発生までの平均時間。値が大きいほど信頼性が高い。ア=MTTR（Mean Time To Repair）の説明。",
  },
  {
    id: "q-svc2", nodeId: "service-mgmt",
    question: "SLA（Service Level Agreement）の説明として適切なものはどれか。",
    choices: [
      "ITサービスのベストプラクティスをまとめた書籍・フレームワーク",
      "サービス提供者と利用者の間でサービス品質水準を合意した文書（契約）",
      "システムの設計・開発・テスト・運用のプロセスを定めた規格",
      "インシデント対応手順を定めた内部ガイドライン",
    ],
    answer: 1,
    explanation: "SLA（Service Level Agreement）はITサービスの提供者と利用者間で、稼働率・応答時間・サポート時間などのサービス品質水準を数値で合意した協定書。ア=ITILの説明。",
  },
  {
    id: "q-svc3", nodeId: "service-mgmt",
    question: "ITILにおけるインシデント管理と問題管理の違いとして適切なものはどれか。",
    choices: [
      "インシデント管理は根本原因の特定が目的で、問題管理は迅速な復旧が目的",
      "インシデント管理は迅速な業務復旧が目的で、問題管理は根本原因の特定・再発防止が目的",
      "インシデント管理はハードウェア障害のみ、問題管理はソフトウェア障害のみを扱う",
      "インシデント管理と問題管理は同じ目的で呼び名が異なるだけ",
    ],
    answer: 1,
    explanation: "インシデント管理はサービス停止・低下を迅速に復旧させることを優先（根本原因特定は後回しでよい）。問題管理はインシデントの根本原因を分析し再発防止策を実施する。",
  },
];
