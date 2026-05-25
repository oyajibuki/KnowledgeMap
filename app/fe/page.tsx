"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

/* ─────────────────────────────────────────
   型定義
───────────────────────────────────────── */
interface FEQuestion {
  id: string;
  q: string;
  choices: string[];
  answer: number;
  exp: string;
}

interface FETopic {
  id: string;
  icon: string;
  name: string;
  sub: string;
  color: string;
  detail: string;
  questions: FEQuestion[];
}

/* ─────────────────────────────────────────
   学習コンテンツ定義
───────────────────────────────────────── */
const FE_TOPICS: FETopic[] = [
  {
    id: "algorithm",
    icon: "🔢",
    name: "アルゴリズムと計算量",
    sub: "O記法・整列・探索・再帰",
    color: "#818cf8",
    detail: `**計算量（O記法）**
アルゴリズムの効率を入力サイズ n の関数で評価します。
・O(1) — 定数時間：配列のインデックスアクセス
・O(log n) — 対数時間：2分探索
・O(n) — 線形時間：線形探索
・O(n log n) — クイックソート・マージソートの平均
・O(n²) — バブルソート・選択ソートの最悪

**主な整列アルゴリズム**
・バブルソート：隣接要素を比較交換。O(n²)。安定。
・選択ソート：最小値を先頭に配置を繰り返す。O(n²)。不安定。
・挿入ソート：要素を正しい位置に挿入。O(n²)だが小データには速い。安定。
・クイックソート：ピボットで分割。平均O(n log n)、最悪O(n²)。不安定。
・マージソート：分割して結合。常にO(n log n)。安定。メモリ使用大。
・ヒープソート：ヒープ構造を利用。O(n log n)。不安定。

**再帰アルゴリズム**
再帰は関数が自分自身を呼び出す手法です。
・終了条件（基底ケース）が必須
・スタックオーバーフローに注意
・フィボナッチ数列：F(n) = F(n-1) + F(n-2)、F(0)=0、F(1)=1
・ハノイの塔：移動回数 = 2ⁿ - 1

**探索アルゴリズム**
・線形探索：先頭から順に比較。O(n)。
・2分探索：ソート済み配列で中央値と比較し範囲を半分に絞る。O(log n)。
・ハッシュ探索：ハッシュ関数でデータの格納先を計算。平均O(1)。`,
    questions: [
      {
        id: "fe-alg1",
        q: "クイックソートの平均計算量として正しいものはどれか。",
        choices: ["O(n)", "O(log n)", "O(n log n)", "O(n²)"],
        answer: 2,
        exp: "クイックソートの平均計算量はO(n log n)。ピボット選択が最悪の場合はO(n²)になる。マージソートは常にO(n log n)を保証する。",
      },
      {
        id: "fe-alg2",
        q: "安定なソートアルゴリズムはどれか。",
        choices: ["クイックソート", "選択ソート", "ヒープソート", "マージソート"],
        answer: 3,
        exp: "安定なソートは同じ値の要素の相対順序が変わらない。マージソート・バブルソート・挿入ソートが代表。クイックソート・選択ソート・ヒープソートは不安定。",
      },
      {
        id: "fe-alg3",
        q: "n=1から始まり、1ステップごとに2倍するアルゴリズムが終了するまでの計算量はどれか。n個の要素を処理する場合。",
        choices: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        answer: 1,
        exp: "2倍ずつ増えるステップ数はlog₂(n)回。このパターンはO(log n)。2分探索も同様に毎回半分に絞るためO(log n)となる。",
      },
      {
        id: "fe-alg4",
        q: "ハノイの塔でn枚の円盤を移動するのに必要な最小手数はどれか。",
        choices: ["n²", "2ⁿ - 1", "n × log n", "n!"],
        answer: 1,
        exp: "ハノイの塔の最小移動回数はT(n) = 2T(n-1)+1 より T(n) = 2ⁿ - 1。n=3なら7回、n=10なら1023回。",
      },
    ],
  },
  {
    id: "data-structure",
    icon: "🌳",
    name: "データ構造詳細",
    sub: "木・グラフ・ヒープ・ハッシュ",
    color: "#34d399",
    detail: `**木構造（Tree）**
・根（Root）：最上位ノード
・葉（Leaf）：子を持たないノード
・深さ（Depth）：根からのエッジ数
・高さ（Height）：根から最も遠い葉までの距離

**2分探索木（BST）**
左の子 < 親 < 右の子 の性質を常に保つ木。
・探索：O(log n) ～ O(n)（バランスによる）
・挿入・削除：O(log n) 平均
・中順走査（In-order traversal）でソート済みリストを取得

**木の走査**
・前順（Pre-order）：根→左→右
・中順（In-order）：左→根→右（BST では昇順）
・後順（Post-order）：左→右→根

**ヒープ（Heap）**
完全2分木で、親が常に子より大きい（最大ヒープ）または小さい（最小ヒープ）。
・最大要素の取得：O(1)
・挿入・削除：O(log n)
・ヒープソートに利用

**グラフ（Graph）**
・有向グラフ：エッジに向きがある
・無向グラフ：向きなし
・重み付きグラフ：エッジに重みがある
・隣接行列：O(V²) の空間、エッジの有無確認 O(1)
・隣接リスト：O(V+E) の空間

**グラフ探索**
・BFS（幅優先探索）：キューを使用。最短経路に適する。
・DFS（深さ優先探索）：スタックまたは再帰を使用。連結成分の検出に適する。

**ハッシュテーブル**
キーをハッシュ関数で変換しインデックスに対応させる。
・衝突解決：チェイン法（リンクリスト）、オープンアドレス法（線形探索）
・平均探索時間：O(1)`,
    questions: [
      {
        id: "fe-ds1",
        q: "2分探索木の中順走査（In-order traversal）を行うと結果はどうなるか。",
        choices: ["ランダムな順序で出力される", "降順（大→小）に出力される", "昇順（小→大）に出力される", "ルートから順に出力される"],
        answer: 2,
        exp: "2分探索木の中順走査（左→根→右）は昇順でデータを出力する。BST の性質（左＜根＜右）があるため必ず昇順になる。",
      },
      {
        id: "fe-ds2",
        q: "ヒープデータ構造の特性として正しいものはどれか。",
        choices: [
          "任意の要素へのO(1)アクセスが可能",
          "親ノードは常に子ノードより大きい（または小さい）",
          "中順走査でソート済みデータを取得できる",
          "データの挿入は常にO(1)で行える",
        ],
        answer: 1,
        exp: "ヒープの性質は「親 ≥ 子（最大ヒープ）または親 ≤ 子（最小ヒープ）」。最大/最小値の取得はO(1)だが、任意アクセスはO(n)。",
      },
      {
        id: "fe-ds3",
        q: "BFS（幅優先探索）に適したデータ構造はどれか。",
        choices: ["スタック（Stack）", "キュー（Queue）", "優先度キュー", "ハッシュテーブル"],
        answer: 1,
        exp: "BFSはレベル順に探索するためキュー（FIFO）を使用する。DFSはスタック（LIFO）または再帰を使用する。",
      },
      {
        id: "fe-ds4",
        q: "ハッシュテーブルで衝突が発生した際の解決手法「チェイン法」の説明として正しいものはどれか。",
        choices: [
          "衝突が起きたら隣のスロットに格納する",
          "同じハッシュ値の要素をリンクリストでつなげる",
          "ハッシュ関数を変えて再計算する",
          "衝突した要素を削除する",
        ],
        answer: 1,
        exp: "チェイン法（Separate Chaining）は同じハッシュ値の要素をリンクリストで連結する。オープンアドレス法は別スロットを探す方法。",
      },
    ],
  },
  {
    id: "computer",
    icon: "💻",
    name: "コンピュータ構成",
    sub: "パイプライン・割り込み・DMA・キャッシュ",
    color: "#60a5fa",
    detail: `**パイプライン処理**
複数の命令を並列に実行する技術。各命令を段階（フェッチ→デコード→実行→書き戻し）に分割し、異なる命令が同時に異なる段階を実行する。
・スループット向上：複数命令を同時処理
・ハザード：データ依存・制御依存・構造ハザードが発生する場合がある
・パイプライン深度：段数が多いほど高スループットだが、ハザード時のペナルティも大きい

**キャッシュメモリ**
・L1キャッシュ：CPU最近傍。最高速。数KB〜数十KB。
・L2キャッシュ：L1より大容量・低速。数百KB。
・L3キャッシュ：複数コアで共有。数MB〜数十MB。
・ヒット率：アクセスのうちキャッシュから取得できた割合
・実効アクセス時間 = ヒット率 × キャッシュ時間 + (1-ヒット率) × 主記憶時間

**割り込み（Interrupt）**
CPU の通常処理を中断し、優先度の高い処理を行う仕組み。
・ハードウェア割り込み：外部デバイス（キーボード・タイマー等）
・ソフトウェア割り込み：例外・システムコール
・割り込みハンドラ（ISR）：割り込み時に実行されるルーティン
・多重割り込み：割り込み中に別の割り込みを受け付ける

**DMA（Direct Memory Access）**
CPUを介さずにメモリと入出力装置が直接データ転送する仕組み。
・CPUの負荷を減らし全体効率向上
・転送中はCPUは他の処理を実行可能
・転送完了時に割り込みでCPUに通知

**仮想記憶とページング**
・ページング：仮想アドレスを固定サイズのページに分割
・TLB（Translation Lookaside Buffer）：ページテーブルのキャッシュ
・ページフォルト：アクセスしたページがRAMにない場合に発生→スワップから読み込み
・スラッシング：ページフォルトが頻発しパフォーマンスが著しく低下する状態`,
    questions: [
      {
        id: "fe-cpu1",
        q: "パイプライン処理の目的として最も適切なものはどれか。",
        choices: [
          "メモリ使用量を削減する",
          "複数の命令をオーバーラップさせ実行効率を向上させる",
          "クロック周波数を自動調整する",
          "キャッシュヒット率を向上させる",
        ],
        answer: 1,
        exp: "パイプラインは複数命令をフェッチ・デコード・実行の各段階で並行処理することでスループット（単位時間当たりの処理命令数）を向上させる。",
      },
      {
        id: "fe-cpu2",
        q: "キャッシュのヒット率が0.9、キャッシュアクセス時間が10ns、主記憶アクセス時間が100nsのとき実効アクセス時間はどれか。",
        choices: ["10ns", "19ns", "55ns", "91ns"],
        answer: 1,
        exp: "実効アクセス時間 = 0.9×10 + 0.1×100 = 9 + 10 = 19ns。ヒット時はキャッシュ時間のみ、ミス時は主記憶時間がかかる。",
      },
      {
        id: "fe-cpu3",
        q: "DMA（Direct Memory Access）の説明として正しいものはどれか。",
        choices: [
          "CPUが全データ転送を直接制御する方式",
          "CPUを介さずメモリとI/O機器が直接データ転送を行う方式",
          "キャッシュメモリを高速化する技術",
          "仮想記憶のページ管理を行う機能",
        ],
        answer: 1,
        exp: "DMAはCPUの代わりにDMAコントローラがメモリとI/O装置間のデータ転送を担う。CPUはその間他の処理が可能になりシステム効率が向上する。",
      },
      {
        id: "fe-cpu4",
        q: "TLB（Translation Lookaside Buffer）の説明として適切なものはどれか。",
        choices: [
          "ページングで仮想アドレス→物理アドレス変換のキャッシュ",
          "L1キャッシュの別名",
          "ディスクの読み書きを高速化するバッファ",
          "割り込みハンドラのアドレスを格納するテーブル",
        ],
        answer: 0,
        exp: "TLBはページテーブル（仮想→物理アドレス変換表）のキャッシュ。TLBヒット時はメモリアクセス1回でアドレス変換可能になり高速化される。",
      },
    ],
  },
  {
    id: "network",
    icon: "🌐",
    name: "ネットワーク詳細",
    sub: "OSI参照モデル・サブネット・ルーティング",
    color: "#38bdf8",
    detail: `**OSI参照モデル（7層）**
第7層（応用層）：HTTP・FTP・SMTP・DNS
第6層（プレゼンテーション層）：データ形式変換・暗号化
第5層（セッション層）：通信セッション管理
第4層（トランスポート層）：TCP・UDP。ポート番号。信頼性制御。
第3層（ネットワーク層）：IP。ルーティング。
第2層（データリンク層）：MACアドレス。フレーム。スイッチ。
第1層（物理層）：ビット転送。ケーブル・ハブ。

**サブネット計算**
・サブネットマスク：ネットワーク部とホスト部を分ける
・例：192.168.1.0/24 → ホスト部8ビット → 256アドレス（254台が使用可能）
・CIDR表記：/24 = 255.255.255.0
・ホスト数 = 2^(ホストビット数) - 2（ネットワークアドレスとブロードキャスト除く）

**ルーティングプロトコル**
・RIP（Routing Information Protocol）：ホップ数で経路選択。最大15ホップ。
・OSPF（Open Shortest Path First）：コストで経路選択。大規模NWに適す。
・BGP（Border Gateway Protocol）：ISP間の経路交換。インターネットの基盤。

**VLANと無線LAN**
・VLAN（仮想LAN）：物理的なLANを論理的に分割。セキュリティとブロードキャスト域制御。
・タグVLAN（802.1Q）：スイッチ間でVLAN情報をタグで伝送
・SSID：無線LANのネットワーク識別子
・WPA3：現在最も安全な無線LAN認証規格

**QoSとフロー制御**
・QoS（Quality of Service）：優先トラフィックを保証する仕組み
・TCPのフロー制御：スライディングウィンドウ方式
・輻輳制御：ネットワーク混雑を防ぐTCP制御機能`,
    questions: [
      {
        id: "fe-net1",
        q: "OSI参照モデルの第4層（トランスポート層）の役割として正しいものはどれか。",
        choices: [
          "IPアドレスによるルーティング",
          "MACアドレスによるフレーム転送",
          "TCPやUDPによるエンドツーエンドの通信制御",
          "HTTPなどアプリケーションプロトコルの処理",
        ],
        answer: 2,
        exp: "トランスポート層（第4層）はTCP・UDP。エンドツーエンドの信頼性制御・フロー制御・ポート番号による多重化を担当。ルーティングは第3層、フレームは第2層。",
      },
      {
        id: "fe-net2",
        q: "IPアドレス 192.168.10.0/24のサブネットで使用可能なホスト数はどれか。",
        choices: ["254台", "255台", "256台", "253台"],
        answer: 0,
        exp: "/24はホスト部が8ビット。2⁸=256アドレス中、ネットワークアドレス（.0）とブロードキャスト（.255）を除く254台が使用可能。",
      },
      {
        id: "fe-net3",
        q: "VLANの目的として正しいものはどれか。",
        choices: [
          "物理的なLANのケーブルを削減する",
          "論理的にネットワークを分割しセキュリティとブロードキャスト制御を実現する",
          "ネットワーク速度を向上させる",
          "IPアドレスを自動割り当てする",
        ],
        answer: 1,
        exp: "VLANは同じスイッチに接続した機器を論理的に異なるLANに分割する技術。部門間の通信制御（セキュリティ）とブロードキャストドメインの分割が主目的。",
      },
      {
        id: "fe-net4",
        q: "BGP（Border Gateway Protocol）の主な用途はどれか。",
        choices: [
          "企業内LANのルーティング",
          "インターネット上の自律システム（AS）間での経路情報交換",
          "DHCPによるIPアドレス自動割り当て",
          "DNSによる名前解決",
        ],
        answer: 1,
        exp: "BGPはインターネットサービスプロバイダ（ISP）などの自律システム間で経路情報を交換するプロトコル。インターネット全体の経路制御の基盤となっている。",
      },
    ],
  },
  {
    id: "database",
    icon: "🗄️",
    name: "データベース詳細",
    sub: "SQL高度・正規化手順・並行制御",
    color: "#f59e0b",
    detail: `**SQL応用**
・サブクエリ：SELECT文の中にSELECT文を記述
  例：SELECT * FROM emp WHERE sal > (SELECT AVG(sal) FROM emp);
・相関サブクエリ：外側クエリの行を参照するサブクエリ
・HAVING句：GROUP BY後の集計結果に条件を付ける
  例：SELECT dept, COUNT(*) FROM emp GROUP BY dept HAVING COUNT(*) > 5;
・UNION：複数SELECT結果を統合（重複除去）
・UNION ALL：重複を含めて統合

**正規化の手順**
・第1正規形（1NF）：繰り返し項目を排除。1セルに1値。
・第2正規形（2NF）：主キーの一部への部分関数従属を排除。複合キーの全体に従属させる。
・第3正規形（3NF）：推移的関数従属を排除。非キー属性から別の非キー属性への依存を除去。
・ボイス-コッド正規形（BCNF）：全ての決定子が候補キー。

**ロック制御（並行制御）**
・共有ロック（S-ロック）：READ操作。複数トランザクション同時保持可。
・排他ロック（X-ロック）：WRITE操作。他のロックと競合。
・デッドロック：T1がAをロックしBを待ち、T2がBをロックしAを待つ状態
・デッドロック回避：資源の順序取得、タイムアウト設定

**MVCC（Multi-Version Concurrency Control）**
データの更新時に新バージョンを作成し、読み取りは古いバージョンを参照する。
PostgreSQL・MySQLのInnoDBが採用。読み取りがブロックされない。

**インデックス**
・B+木インデックス：ほとんどのRDBMSの標準。範囲検索に有効。
・ハッシュインデックス：等値検索に最速。範囲検索不可。
・複合インデックス：複数列でインデックスを作成。カラム順が重要。`,
    questions: [
      {
        id: "fe-db1",
        q: "第3正規形（3NF）の条件として正しいものはどれか。",
        choices: [
          "繰り返し項目が除去されている（第1NF）",
          "部分関数従属が排除されている（第2NF）",
          "推移的関数従属が排除されている",
          "全ての行が主キーで一意に識別できる",
        ],
        answer: 2,
        exp: "第3正規形は第2正規形を満たした上で、非キー属性が他の非キー属性に依存する「推移的関数従属」を排除した状態。",
      },
      {
        id: "fe-db2",
        q: "部門ごとの従業員数を求め、従業員数が5名を超える部門のみ表示するSQLはどれか。",
        choices: [
          "SELECT dept, COUNT(*) FROM emp WHERE COUNT(*) > 5 GROUP BY dept;",
          "SELECT dept, COUNT(*) FROM emp GROUP BY dept HAVING COUNT(*) > 5;",
          "SELECT dept, COUNT(*) FROM emp HAVING COUNT(*) > 5;",
          "SELECT dept, COUNT(*) FROM emp GROUP BY dept WHERE COUNT(*) > 5;",
        ],
        answer: 1,
        exp: "HAVING句はGROUP BY後の集計結果に対する条件。WHERE句はグループ化前の行に対する条件。集計関数を条件にする場合はHAVINGを使う。",
      },
      {
        id: "fe-db3",
        q: "デッドロックの説明として正しいものはどれか。",
        choices: [
          "データベースへの接続がタイムアウトする状態",
          "2つ以上のトランザクションが互いのロック解放を永久に待ち合う状態",
          "SQL文の構文エラーが発生した状態",
          "ディスク容量が不足した状態",
        ],
        answer: 1,
        exp: "デッドロックはトランザクションAがリソースXを保持しYを待ち、BがYを保持しXを待つ循環待ち。回避策：資源を決まった順序でロック、タイムアウト設定。",
      },
      {
        id: "fe-db4",
        q: "B+木インデックスの特徴として正しいものはどれか。",
        choices: [
          "等値検索のみに最適化されている",
          "ハッシュインデックスより常に高速",
          "範囲検索（BETWEEN、<、>）に適しており、ほとんどのRDBMSで採用",
          "データの挿入・削除時にパフォーマンスが著しく低下する",
        ],
        answer: 2,
        exp: "B+木インデックスは葉ノードがリンクリストで連結されており範囲検索に優れる。MySQLのInnoDB・PostgreSQLなどで採用。ハッシュは等値検索のみ。",
      },
    ],
  },
  {
    id: "security",
    icon: "🔐",
    name: "セキュリティ詳細",
    sub: "PKI・攻撃手法・セキュリティ設計",
    color: "#ef4444",
    detail: `**PKI（公開鍵基盤）の詳細**
・CA（Certificate Authority/認証局）：電子証明書を発行する第三者機関
・ルートCA：信頼の起点。OSやブラウザが事前に信頼リストに保持。
・中間CA：ルートCAから委任を受け証明書を発行
・証明書の検証：証明書チェーンを辿りルートCAまで検証
・CRL（Certificate Revocation List）：失効した証明書のリスト
・OCSP：リアルタイムで証明書の失効状態を確認するプロトコル

**主要な攻撃手法**
・SQLインジェクション：入力にSQLを混入しDBを不正操作。対策：プリペアドステートメント。
・XSS（クロスサイトスクリプティング）：WebページにJSを埋め込む。対策：エスケープ処理。
・CSRF：正規ユーザを騙して意図しないリクエストを送らせる。対策：CSRFトークン。
・ディレクトリトラバーサル：相対パスでシステムファイルへアクセス。対策：パス検証。
・バッファオーバーフロー：バッファを溢れさせ不正コードを実行。対策：入力長チェック。
・中間者攻撃（MITM）：通信を傍受・改ざん。対策：TLS/HTTPS。

**暗号化アルゴリズム**
・AES（Advanced Encryption Standard）：共通鍵暗号。128/192/256ビット鍵。
・RSA：公開鍵暗号。大きな素数の積の因数分解困難性に基づく。
・楕円曲線暗号（ECC）：RSAより短い鍵長で同等の安全性。
・SHA-256/SHA-3：ハッシュ関数。256ビットのダイジェスト値を生成。

**セキュリティ設計原則**
・最小権限の原則：必要最小限の権限のみ付与
・多層防御（Defense in Depth）：複数の防御層を設ける
・フェイルセーフ：障害時に安全側に倒す設計
・インシデント対応：検知→分析→封じ込め→根絶→復旧→事後分析`,
    questions: [
      {
        id: "fe-sec1",
        q: "CSRF（Cross-Site Request Forgery）攻撃の対策として最も適切なものはどれか。",
        choices: [
          "入力値のエスケープ処理",
          "プリペアドステートメントの使用",
          "CSRFトークンをフォームに埋め込み検証する",
          "HTTPS通信の使用",
        ],
        answer: 2,
        exp: "CSRFは正規ユーザのセッションを悪用した不正リクエスト。対策はサーバが発行したランダムなCSRFトークンをフォームに埋め込み、リクエスト時に検証する。エスケープはXSS対策。",
      },
      {
        id: "fe-sec2",
        q: "SQLインジェクション攻撃を防ぐ最も効果的な対策はどれか。",
        choices: [
          "入力文字数の制限",
          "WAFの導入のみ",
          "プリペアドステートメント（パラメータ化クエリ）の使用",
          "パスワードの複雑化",
        ],
        answer: 2,
        exp: "プリペアドステートメントはSQL文の構造を事前に確定させ、入力値は必ずパラメータとして処理する。これによりSQLの改ざんが不可能になる。最も根本的な対策。",
      },
      {
        id: "fe-sec3",
        q: "CRL（Certificate Revocation List）の説明として正しいものはどれか。",
        choices: [
          "有効な証明書の一覧リスト",
          "失効した電子証明書のシリアル番号リスト",
          "ルートCA一覧",
          "TLS対応サーバのリスト",
        ],
        answer: 1,
        exp: "CRLは有効期限前に失効した証明書のシリアル番号リスト。CAが定期的に公開する。リアルタイム確認はOCSP（Online Certificate Status Protocol）を使用する。",
      },
      {
        id: "fe-sec4",
        q: "多層防御（Defense in Depth）の考え方として正しいものはどれか。",
        choices: [
          "最も強固な1つの防御策に集中投資する",
          "ファイアウォールのみで全ての攻撃を防ぐ",
          "ネットワーク・OS・アプリ・運用など複数の層で独立した対策を重ねる",
          "外部からの攻撃のみを考慮した設計",
        ],
        answer: 2,
        exp: "多層防御は1つの防御が突破されても次の層が守る設計思想。境界防御（FW）＋内部対策（EDR）＋データ暗号化＋監視ログ等を組み合わせる。",
      },
    ],
  },
  {
    id: "software-design",
    icon: "📐",
    name: "ソフトウェア設計",
    sub: "UML・デザインパターン・設計原則",
    color: "#a78bfa",
    detail: `**UML図の種類**
構造図（静的）：
・クラス図：クラス・属性・操作・関係を表す。最も重要。
・コンポーネント図：システムの物理的な構造
・配置図（デプロイメント図）：ハードウェア・ソフトウェアの配置

振る舞い図（動的）：
・シーケンス図：オブジェクト間の時系列メッセージ交換
・ユースケース図：システムとアクター間の機能関係
・アクティビティ図：処理フロー（フローチャートに類似）
・状態機械図（ステートマシン図）：オブジェクトの状態遷移

**オブジェクト指向の3大原則**
・カプセル化：データと操作を1つのクラスに封じ、外部からのアクセスを制御
・継承：親クラスの属性・操作を子クラスが引き継ぐ
・ポリモーフィズム（多態性）：同じメッセージに対して異なるクラスが異なる振る舞いをする

**SOLID原則**
・S：単一責任の原則（1クラス1責任）
・O：開放閉鎖の原則（拡張に開いて修正に閉じる）
・L：リスコフの置換原則（サブクラスは親クラスと置換可能）
・I：インタフェース分離の原則
・D：依存性逆転の原則

**主要デザインパターン（GoF）**
生成パターン：
・Singleton：インスタンスを1つに制限
・Factory Method：サブクラスがオブジェクト生成を担う

構造パターン：
・Adapter：インタフェースを変換して互換性を持たせる
・Decorator：機能を動的に追加

振る舞いパターン：
・Observer：状態変化を他のオブジェクトに通知
・Strategy：アルゴリズムを差し替え可能にする`,
    questions: [
      {
        id: "fe-sw1",
        q: "UMLのシーケンス図が表現するものはどれか。",
        choices: [
          "クラス間の継承・関連関係",
          "システムの物理的な配置",
          "オブジェクト間のメッセージ交換の時系列",
          "アクターとシステムの機能関係",
        ],
        answer: 2,
        exp: "シーケンス図は時間軸に沿ってオブジェクト間のメッセージの送受信を表現する動的図。クラス図は静的構造、ユースケース図はアクターとの関係、配置図はハードウェア構成を表す。",
      },
      {
        id: "fe-sw2",
        q: "Singleton（シングルトン）パターンの目的として正しいものはどれか。",
        choices: [
          "オブジェクトの生成を禁止する",
          "クラスのインスタンスが1つだけ存在することを保証する",
          "複数のオブジェクトを効率よく管理する",
          "インタフェースの互換性を確保する",
        ],
        answer: 1,
        exp: "Singletonパターンはクラスのインスタンスを1つに制限し、グローバルなアクセスポイントを提供するデザインパターン。設定管理・DBコネクションプールなどに使用。",
      },
      {
        id: "fe-sw3",
        q: "オブジェクト指向の「ポリモーフィズム（多態性）」の説明として正しいものはどれか。",
        choices: [
          "クラス内のデータを外部から隠蔽する性質",
          "親クラスの属性・操作を子クラスが引き継ぐ性質",
          "同じメッセージに対して異なるクラスが異なる振る舞いをする性質",
          "クラスのインスタンスを複数作れる性質",
        ],
        answer: 2,
        exp: "ポリモーフィズムは同名のメソッドが呼び出されたとき、オブジェクトの実際の型によって異なる処理が実行される性質。仮想関数やメソッドオーバーライドで実現する。",
      },
      {
        id: "fe-sw4",
        q: "Adapterパターンの主な目的はどれか。",
        choices: [
          "オブジェクトの生成を1つに制限する",
          "既存クラスのインタフェースを別のインタフェースに変換し互換性を持たせる",
          "オブジェクトの状態変化を他のオブジェクトに通知する",
          "アルゴリズムの実装をクラスから分離して差し替え可能にする",
        ],
        answer: 1,
        exp: "Adapterパターンは互換性のない2つのインタフェースを繋ぐ「変換器」の役割。既存コードを修正せずに新しいインタフェースに対応させたい場合に使用する。",
      },
    ],
  },
  {
    id: "testing",
    icon: "🧪",
    name: "テスト技法・品質管理",
    sub: "ホワイト/ブラックボックス・品質指標",
    color: "#fb7185",
    detail: `**ブラックボックステスト技法**
内部構造を考慮せず、仕様書に基づいて入出力の観点からテストを設計する。
・同値分割法：入力を「有効クラス」「無効クラス」に分類し各代表値でテスト
  例：年齢0〜120を有効、負数・121以上を無効クラスとする
・境界値分析：クラスの境界上の値（直前・ちょうど・直後）でテスト
  例：0, 1, 120, 121 をテスト
・デシジョンテーブル：複数条件の組み合わせを表で網羅
・状態遷移テスト：状態機械に基づくテスト

**ホワイトボックステスト技法**
内部ロジック（コード）を検証する。
・命令網羅（C0）：全命令を1回以上実行。最も基本。
・分岐網羅（C1）：全分岐（true/false）を1回以上通過。
・条件網羅（C2）：全条件の真偽を1回以上テスト。
・複合条件網羅（MC/DC）：安全クリティカルシステム向け。

**テストの種類と順序**
・単体テスト（Unit Test）：個々のモジュールを独立してテスト
・結合テスト（Integration Test）：モジュール間のインタフェースをテスト
  - トップダウン：上位モジュールから。スタブ（仮下位モジュール）を使用。
  - ボトムアップ：下位モジュールから。ドライバ（仮上位モジュール）を使用。
・システムテスト：システム全体を要件と照合
・受入テスト（UAT）：ユーザが実業務環境でシステムを確認

**品質指標**
・バグ検出率：発見バグ数 / 埋め込みバグ推定数
・テストカバレッジ（網羅率）：テストしたコード/全コード
・MTTF（Mean Time To Failure）：初回故障までの平均時間
・欠陥密度：LOC（行数）1000行あたりのバグ数

**回帰テスト（リグレッションテスト）**
修正後に既存機能が壊れていないかを確認するテスト。CI/CDで自動化が一般的。`,
    questions: [
      {
        id: "fe-tst1",
        q: "境界値分析で年齢の有効範囲が「1以上120以下」の場合、最も重要なテストケースはどれか。",
        choices: [
          "50と70の2点",
          "0, 1, 120, 121の4点",
          "10, 50, 100の3点",
          "1と120の2点のみ",
        ],
        answer: 1,
        exp: "境界値分析は境界の内側・ちょうど・外側をテストする技法。1と120（境界上）、0と121（境界外、無効クラス）の合計4点が最重要。",
      },
      {
        id: "fe-tst2",
        q: "ホワイトボックステストにおける「分岐網羅（C1）」の説明として正しいものはどれか。",
        choices: [
          "全ての命令を1回以上実行する",
          "if文の真・偽それぞれのパスを1回以上通過する",
          "全ての条件の組み合わせをテストする",
          "ランダムな入力でテストする",
        ],
        answer: 1,
        exp: "分岐網羅（C1）はプログラム内の全分岐（if文のtrue/false）を少なくとも1回ずつ通過するようテストケースを設計する。命令網羅（C0）より網羅性が高い。",
      },
      {
        id: "fe-tst3",
        q: "結合テストのボトムアップテストで使用するテスト用コンポーネントはどれか。",
        choices: [
          "スタブ（Stub）",
          "ドライバ（Driver）",
          "モック（Mock）",
          "フィクスチャ（Fixture）",
        ],
        answer: 1,
        exp: "ボトムアップテストは下位モジュールから順にテストするため、未完成の上位モジュールの代わりに「ドライバ（テスト用の上位モジュール）」を使用する。トップダウンでは「スタブ（仮の下位モジュール）」を使用。",
      },
      {
        id: "fe-tst4",
        q: "回帰テスト（リグレッションテスト）の実施タイミングとして最も適切なものはどれか。",
        choices: [
          "システム開発の最初のフェーズ",
          "本番リリース後1ヶ月経過時",
          "バグ修正や機能追加の変更を加えた後",
          "受入テスト合格直前のみ",
        ],
        answer: 2,
        exp: "回帰テストはソフトウェアに変更（バグ修正・機能追加・リファクタリング等）を加えるたびに、既存機能が壊れていないかを確認するために実施する。CI/CDで自動化が推奨される。",
      },
    ],
  },
  {
    id: "programming",
    icon: "⚙️",
    name: "プログラミング基礎",
    sub: "擬似言語・再帰・オブジェクト指向",
    color: "#10b981",
    detail: `**FE試験の擬似言語**
基本情報技術者試験では独自の擬似言語を使ってアルゴリズム問題を出題します。

主な記述形式：
・if（条件）→ 分岐
・while（条件）→ 繰り返し
・for（変数：開始 to 終了）→ 繰り返し
・配列：a[i] のように表記
・手続き（関数）：proc 名前（引数）

**再帰の読み方**
再帰プログラムは実行の追跡が重要です。
例：factorial(n) の場合
・n=0 なら 1 を返す（終了条件）
・それ以外は n × factorial(n-1) を返す

n=3 の場合：
factorial(3) = 3 × factorial(2) = 3 × 2 × factorial(1) = 3 × 2 × 1 = 6

**オブジェクト指向**
・クラス：オブジェクトの設計図（属性＋メソッド）
・インスタンス：クラスから生成された実体
・コンストラクタ：インスタンス生成時に呼ばれる特殊メソッド
・継承（extends）：親クラスの機能を引き継ぐ
・オーバーライド：継承したメソッドを再定義
・オーバーロード：同名メソッドを引数の型・数で区別

**代表的なプログラミングパラダイム**
・手続き型：処理を順番に記述（C言語等）
・オブジェクト指向：データと操作をクラスにまとめる（Java・Python等）
・関数型：副作用のない純粋関数で処理（Haskell・Scala等）
・宣言型：「何を」を記述（SQL・HTML等）

**変数のスコープ**
・局所変数（ローカル変数）：関数内で宣言。関数が終わると消える。
・大域変数（グローバル変数）：プログラム全体でアクセス可。多用は危険。`,
    questions: [
      {
        id: "fe-prg1",
        q: "次の再帰関数 f(n) = n × f(n-1)、f(0) = 1 で f(5) を計算した結果はどれか。",
        choices: ["100", "120", "60", "24"],
        answer: 1,
        exp: "f(5) = 5 × f(4) = 5 × 4 × f(3) = 5 × 4 × 3 × f(2) = 5 × 4 × 3 × 2 × f(1) = 5 × 4 × 3 × 2 × 1 = 120。これは5!（5の階乗）を計算する再帰関数。",
      },
      {
        id: "fe-prg2",
        q: "オブジェクト指向の「オーバーライド（override）」の説明として正しいものはどれか。",
        choices: [
          "同名のメソッドを引数の型や数を変えて複数定義する",
          "親クラスのメソッドを子クラスで再定義する",
          "クラスの属性を外部から隠蔽する",
          "インスタンス生成時に自動的に呼ばれるメソッド",
        ],
        answer: 1,
        exp: "オーバーライドは継承した親クラスのメソッドを子クラスで独自の実装に置き換えること。ポリモーフィズムを実現する。オーバーロードは同名メソッドの引数違いによる多重定義。",
      },
      {
        id: "fe-prg3",
        q: "配列の線形探索で目的の値が最後にある場合の計算量はどれか。",
        choices: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        answer: 2,
        exp: "線形探索は先頭から順に比較するため、最悪（目的値が最後）は n 回の比較が必要でO(n)。最良（先頭）はO(1)。平均はO(n/2)つまりO(n)。",
      },
    ],
  },
];

/* ─────────────────────────────────────────
   クイズコンポーネント
───────────────────────────────────────── */
function QuizPanel({ questions, color }: { questions: FEQuestion[]; color: string }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = questions[current];

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === q.answer) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (current + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
    }
  };

  const handleReset = () => {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ textAlign: "center", padding: "24px 0" }}
      >
        <div style={{ fontSize: "48px", marginBottom: "12px" }}>
          {pct >= 80 ? "🏆" : pct >= 60 ? "⭐" : "📚"}
        </div>
        <p style={{ fontSize: "28px", fontWeight: "900", color, marginBottom: "4px" }}>
          {score}/{questions.length}
        </p>
        <p style={{ color: "#94a3b8", fontSize: "13px", marginBottom: "20px" }}>
          {pct >= 80 ? "完璧！" : pct >= 60 ? "良い調子！" : "もう一度復習しよう"}
        </p>
        <button
          onClick={handleReset}
          style={{
            padding: "10px 24px",
            borderRadius: "12px",
            background: `${color}22`,
            border: `1px solid ${color}66`,
            color,
            fontWeight: "700",
            fontSize: "13px",
            cursor: "pointer",
          }}
        >
          もう一度チャレンジ
        </button>
      </motion.div>
    );
  }

  return (
    <div>
      {/* 進捗バー */}
      <div style={{ display: "flex", gap: "4px", marginBottom: "16px" }}>
        {questions.map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: "3px",
              borderRadius: "2px",
              background: i < current ? color : i === current ? `${color}88` : "#1e293b",
            }}
          />
        ))}
      </div>

      <p style={{ fontSize: "11px", color: "#64748b", marginBottom: "10px" }}>
        問 {current + 1} / {questions.length}
      </p>

      <p style={{ color: "#e2e8f0", fontSize: "14px", lineHeight: 1.7, marginBottom: "16px", fontWeight: "600" }}>
        {q.q}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {q.choices.map((choice, idx) => {
          let bg = "rgba(15,23,42,0.6)";
          let border = "#1e293b";
          let textColor = "#94a3b8";

          if (selected !== null) {
            if (idx === q.answer) {
              bg = "rgba(34,197,94,0.12)";
              border = "rgba(34,197,94,0.5)";
              textColor = "#4ade80";
            } else if (idx === selected && selected !== q.answer) {
              bg = "rgba(239,68,68,0.1)";
              border = "rgba(239,68,68,0.4)";
              textColor = "#f87171";
            }
          } else if (idx === selected) {
            bg = `${color}22`;
            border = `${color}66`;
            textColor = color;
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              style={{
                padding: "10px 14px",
                borderRadius: "10px",
                background: bg,
                border: `1px solid ${border}`,
                color: textColor,
                fontSize: "13px",
                textAlign: "left",
                cursor: selected !== null ? "default" : "pointer",
                transition: "all 0.15s",
              }}
            >
              {String.fromCharCode(65 + idx)}. {choice}
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginTop: "14px",
            padding: "12px 14px",
            borderRadius: "10px",
            background: "rgba(15,23,42,0.8)",
            border: "1px solid #1e293b",
          }}
        >
          <p style={{ fontSize: "11px", color: "#64748b", marginBottom: "4px" }}>💡 解説</p>
          <p style={{ color: "#94a3b8", fontSize: "12px", lineHeight: 1.6 }}>{q.exp}</p>
        </motion.div>
      )}

      {selected !== null && (
        <button
          onClick={handleNext}
          style={{
            marginTop: "14px",
            width: "100%",
            padding: "12px",
            borderRadius: "12px",
            background: color,
            border: "none",
            color: "#fff",
            fontWeight: "700",
            fontSize: "13px",
            cursor: "pointer",
          }}
        >
          {current + 1 >= questions.length ? "結果を見る →" : "次の問題 →"}
        </button>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   トピックカード
───────────────────────────────────────── */
function TopicCard({
  topic,
  masteredTopics,
  onToggleMastered,
}: {
  topic: FETopic;
  masteredTopics: Set<string>;
  onToggleMastered: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [mode, setMode] = useState<"detail" | "quiz">("detail");
  const isMastered = masteredTopics.has(topic.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        borderRadius: "18px",
        background: "rgba(15,23,42,0.7)",
        border: `1px solid ${expanded ? topic.color + "44" : "#1e293b"}`,
        overflow: "hidden",
        transition: "border-color 0.2s",
      }}
    >
      {/* ヘッダー */}
      <div
        onClick={() => setExpanded((e) => !e)}
        style={{
          padding: "18px 20px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "14px",
        }}
      >
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "12px",
            background: `${topic.color}18`,
            border: `1px solid ${topic.color}33`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "22px",
            flexShrink: 0,
          }}
        >
          {topic.icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ color: "#e2e8f0", fontWeight: "700", fontSize: "15px", marginBottom: "2px" }}>
            {topic.name}
          </p>
          <p style={{ color: "#475569", fontSize: "12px" }}>{topic.sub}</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
          {isMastered && (
            <span style={{ fontSize: "16px" }}>⭐</span>
          )}
          <div
            style={{
              color: "#475569",
              fontSize: "18px",
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
            }}
          >
            ▼
          </div>
        </div>
      </div>

      {/* 展開コンテンツ */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: "hidden" }}
          >
            <div
              style={{
                borderTop: `1px solid ${topic.color}22`,
                padding: "20px",
              }}
            >
              {/* タブ切り替え */}
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  marginBottom: "20px",
                }}
              >
                {(["detail", "quiz"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    style={{
                      padding: "7px 18px",
                      borderRadius: "20px",
                      background: mode === m ? topic.color : "transparent",
                      border: `1px solid ${mode === m ? topic.color : "#334155"}`,
                      color: mode === m ? "#fff" : "#64748b",
                      fontSize: "12px",
                      fontWeight: "700",
                      cursor: "pointer",
                    }}
                  >
                    {m === "detail" ? "📖 解説" : "✏️ 演習"}
                  </button>
                ))}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleMastered(topic.id);
                  }}
                  style={{
                    marginLeft: "auto",
                    padding: "7px 14px",
                    borderRadius: "20px",
                    background: isMastered ? "rgba(251,191,36,0.15)" : "transparent",
                    border: `1px solid ${isMastered ? "rgba(251,191,36,0.4)" : "#334155"}`,
                    color: isMastered ? "#fbbf24" : "#64748b",
                    fontSize: "11px",
                    fontWeight: "700",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  {isMastered ? "⭐ 習得済み" : "習得済みにする"}
                </button>
              </div>

              {/* 詳細テキスト */}
              {mode === "detail" && (
                <div
                  style={{
                    color: "#94a3b8",
                    fontSize: "13px",
                    lineHeight: 1.8,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {topic.detail.split("\n").map((line, i) => {
                    if (line.startsWith("**") && line.endsWith("**")) {
                      return (
                        <p key={i} style={{ color: topic.color, fontWeight: "700", marginTop: "16px", marginBottom: "4px" }}>
                          {line.replace(/\*\*/g, "")}
                        </p>
                      );
                    }
                    if (line.startsWith("・")) {
                      return (
                        <p key={i} style={{ paddingLeft: "12px", marginBottom: "2px" }}>
                          {line}
                        </p>
                      );
                    }
                    return line ? <p key={i} style={{ marginBottom: "2px" }}>{line}</p> : <br key={i} />;
                  })}
                </div>
              )}

              {/* クイズ */}
              {mode === "quiz" && (
                <QuizPanel questions={topic.questions} color={topic.color} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   メインページ
───────────────────────────────────────── */
export default function FEPage() {
  const [masteredTopics, setMasteredTopics] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("fe-mastered") || "[]");
      setMasteredTopics(new Set(saved));
    } catch {
      // ignore
    }
  }, []);

  const toggleMastered = (id: string) => {
    setMasteredTopics((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      localStorage.setItem("fe-mastered", JSON.stringify([...next]));
      return next;
    });
  };

  const progress = Math.round((masteredTopics.size / FE_TOPICS.length) * 100);

  return (
    <div
      style={{
        minHeight: "100dvh",
        background:
          "radial-gradient(ellipse 100% 80% at 50% 30%, #0d0b1e 0%, #060410 55%, #010108 100%)",
        color: "#e2e8f0",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* ヘッダー */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(6,4,16,0.9)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #1e293b",
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <Link
          href="/universe"
          style={{
            color: "#64748b",
            textDecoration: "none",
            fontSize: "13px",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          🌌 マップ
        </Link>
        <span style={{ color: "#334155", fontSize: "12px" }}>/</span>
        <span style={{ fontSize: "13px", color: "#818cf8", fontWeight: "700" }}>
          💻 基本情報技術者
        </span>
        <div style={{ flex: 1 }} />
        {/* 進捗バー */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "12px", color: "#818cf8", fontWeight: "700" }}>
            ⭐{masteredTopics.size}/{FE_TOPICS.length}
          </span>
          <div
            style={{
              width: "80px",
              height: "4px",
              borderRadius: "2px",
              background: "#1e293b",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                background: "linear-gradient(90deg, #818cf8, #c084fc)",
                borderRadius: "2px",
                transition: "width 0.4s",
              }}
            />
          </div>
          <span style={{ fontSize: "11px", color: "#818cf8" }}>{progress}%</span>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "32px 16px 80px" }}>
        {/* タイトルセクション */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: "center", marginBottom: "40px" }}
        >
          <p
            style={{
              fontSize: "10px",
              letterSpacing: "0.25em",
              color: "#475569",
              marginBottom: "8px",
              fontWeight: "700",
              textTransform: "uppercase",
            }}
          >
            Stratum II
          </p>
          <h1
            style={{
              fontSize: "clamp(24px, 5vw, 38px)",
              fontWeight: "900",
              background: "linear-gradient(135deg, #818cf8, #c084fc)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "12px",
            }}
          >
            💻 基本情報技術者
          </h1>

          {/* ITパスポートからの継続 */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 18px",
              borderRadius: "20px",
              background: "rgba(6,182,212,0.08)",
              border: "1px solid rgba(6,182,212,0.2)",
              marginBottom: "24px",
            }}
          >
            <span style={{ fontSize: "12px", color: "#22d3ee", fontWeight: "700" }}>
              ⚡ ITパスポートの知識を土台に深化
            </span>
          </div>

          <p style={{ color: "#64748b", fontSize: "13px", lineHeight: 1.7, maxWidth: "500px", margin: "0 auto" }}>
            アルゴリズム・ネットワーク詳細・データベース・セキュリティ・ソフトウェア設計などの
            高度な技術知識を体系的に学習します。
          </p>
        </motion.div>

        {/* トピック一覧 */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {FE_TOPICS.map((topic, i) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <TopicCard
                topic={topic}
                masteredTopics={masteredTopics}
                onToggleMastered={toggleMastered}
              />
            </motion.div>
          ))}
        </div>

        {/* ナビゲーション */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={{
            marginTop: "48px",
            display: "flex",
            gap: "12px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/universe"
            style={{
              padding: "12px 24px",
              borderRadius: "14px",
              background: "rgba(30,41,59,0.5)",
              border: "1px solid #334155",
              color: "#94a3b8",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            ← Knowledge Map に戻る
          </Link>
          <Link
            href="/itp"
            style={{
              padding: "12px 24px",
              borderRadius: "14px",
              background: "rgba(6,182,212,0.1)",
              border: "1px solid rgba(6,182,212,0.25)",
              color: "#22d3ee",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            ⚡ ITパスポートへ
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
