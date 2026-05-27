import { Question } from "@/types";

/**
 * 基本情報技術者試験 科目B — アルゴリズム・プログラミング問題 20問
 * FE 試験の擬似言語スタイルに準拠した穴埋め・トレース問題
 */
export const feExamBQuestions: Question[] = [
  {
    id: "fq-b01",
    nodeId: "fe-prog",
    question: `以下の擬似コードを実行したとき、出力される値はどれか。

　result ← 0
　i ← 1
　while (i ≦ 5)
　　result ← result + i
　　i ← i + 1
　end while
　出力(result)`,
    choices: ["10", "12", "15", "20"],
    answer: 2,
    explanation:
      "i=1から5まで順に加算。1+2+3+4+5=15。while ループは i=6 で条件 i≦5 が偽となり終了。",
  },
  {
    id: "fq-b02",
    nodeId: "fe-prog",
    question: `以下の擬似コードを実行したとき、出力される値はどれか。

　a ← 17
　b ← 5
　while (a ≧ b)
　　a ← a - b
　end while
　出力(a)`,
    choices: ["1", "2", "3", "4"],
    answer: 1,
    explanation:
      "17−5=12, 12−5=7, 7−5=2。a=2 のとき 2≧5 が偽となりループ終了。出力は 2。この処理は 17 mod 5 = 2 に相当する。",
  },
  {
    id: "fq-b03",
    nodeId: "fe-algo",
    question: `配列 a = {5, 3, 8, 1, 6} に対して以下の擬似コードを実行したとき、出力される値はどれか。

　max ← a[1]
　for i: 2 to 5
　　if (a[i] > max)
　　　max ← a[i]
　　end if
　end for
　出力(max)`,
    choices: ["5", "6", "7", "8"],
    answer: 3,
    explanation:
      "max=5から開始。a[2]=3(変化なし), a[3]=8→max=8, a[4]=1(変化なし), a[5]=6(変化なし)。最大値は 8。",
  },
  {
    id: "fq-b04",
    nodeId: "fe-prog",
    question: `以下の再帰関数 f を f(4) で呼び出したとき、返り値はどれか。

　f(n):
　　if (n = 0)
　　　return 0
　　end if
　　return n + f(n − 1)`,
    choices: ["6", "8", "10", "12"],
    answer: 2,
    explanation:
      "f(4)=4+f(3)=4+3+f(2)=4+3+2+f(1)=4+3+2+1+f(0)=10。1 から n までの総和を求める再帰関数。",
  },
  {
    id: "fq-b05",
    nodeId: "fe-ds",
    question: `スタック S（初期状態：空）に対して以下の操作を順に行ったとき、最終的なスタックの先頭（top）の値はどれか。

　push(S, 2)
　push(S, 8)
　push(S, 4)
　x ← pop(S)
　push(S, x + 1)`,
    choices: ["4", "5", "8", "9"],
    answer: 1,
    explanation:
      "push後: [2,8,4]。pop()→x=4, push(5)→[2,8,5]。先頭(top)は 5。",
  },
  {
    id: "fq-b06",
    nodeId: "fe-ds",
    question: `キュー Q（初期状態：空）に対して以下の操作を順に行ったとき、先頭（front）の値はどれか。

　enqueue(Q, 10)
　enqueue(Q, 20)
　enqueue(Q, 30)
　x ← dequeue(Q)
　enqueue(Q, x * 2)`,
    choices: ["10", "20", "30", "40"],
    answer: 1,
    explanation:
      "enqueue後: [10,20,30]。dequeue()→x=10, キュー:[20,30]。enqueue(20)→[20,30,20]。先頭(front)は 20。",
  },
  {
    id: "fq-b07",
    nodeId: "fe-algo",
    question: `配列 a = {5, 2, 8, 1, 9} に対してバブルソートの1パスを実行したとき、a[1] の値はどれか。

　for i: 1 to 4
　　if (a[i] > a[i+1])
　　　tmp ← a[i]
　　　a[i] ← a[i+1]
　　　a[i+1] ← tmp
　　end if
　end for`,
    choices: ["1", "2", "5", "8"],
    answer: 1,
    explanation:
      "i=1: 5>2→交換→{2,5,8,1,9}。i=2: 5<8→変化なし。i=3: 8>1→交換→{2,5,1,8,9}。i=4: 8<9→変化なし。a[1]=2。",
  },
  {
    id: "fq-b08",
    nodeId: "fe-algo",
    question: `以下の擬似コードを実行したとき、出力される count の値はどれか。

　count ← 0
　for i: 1 to 4
　　for j: 1 to i
　　　count ← count + 1
　　end for
　end for
　出力(count)`,
    choices: ["8", "10", "12", "16"],
    answer: 1,
    explanation:
      "i=1:内側1回, i=2:2回, i=3:3回, i=4:4回。合計=1+2+3+4=10。",
  },
  {
    id: "fq-b09",
    nodeId: "fe-algo",
    question: `以下の擬似コードはユークリッドの互除法で最大公約数を求める。a=36, b=24 のとき出力される値はどれか。

　while (b ≠ 0)
　　tmp ← b
　　b ← a mod b
　　a ← tmp
　end while
　出力(a)`,
    choices: ["6", "8", "12", "24"],
    answer: 2,
    explanation:
      "1回目: tmp=24, b=36 mod 24=12, a=24。2回目: tmp=12, b=24 mod 12=0, a=12。b=0でループ終了。GCD(36,24)=12。",
  },
  {
    id: "fq-b10",
    nodeId: "fe-algo",
    question: `配列 a = {−3, 5, −1, 2, −7, 4} に対して以下の擬似コードを実行したとき、出力される count の値はどれか。

　count ← 0
　for i: 1 to 6
　　if (a[i] < 0)
　　　count ← count + 1
　　end if
　end for
　出力(count)`,
    choices: ["2", "3", "4", "5"],
    answer: 1,
    explanation: "負の値: −3, −1, −7 の 3 個。count=3。",
  },
  {
    id: "fq-b11",
    nodeId: "fe-algo",
    question: `以下の擬似コードを実行したとき、出力される result の値はどれか。

　base ← 2
　result ← 1
　for i: 1 to 6
　　result ← result * base
　end for
　出力(result)`,
    choices: ["32", "64", "96", "128"],
    answer: 1,
    explanation:
      "result は 2 を 6 回掛けたもの。2¹=2, 2²=4, …, 2⁶=64。",
  },
  {
    id: "fq-b12",
    nodeId: "fe-prog",
    question: `以下の擬似コードを実行した後、x + y の値はどれか。

　x ← 5
　y ← 12
　x ← x + y
　y ← x − y`,
    choices: ["17", "22", "24", "29"],
    answer: 1,
    explanation:
      "x=5+12=17, y=17−12=5。x+y=17+5=22。tmp を使わずに 2 変数の値を入れ替えようとしているコードの途中状態。",
  },
  {
    id: "fq-b13",
    nodeId: "fe-algo",
    question: `以下の再帰関数 fib を fib(6) で呼び出したとき、返り値はどれか。

　fib(n):
　　if (n ≦ 1)
　　　return n
　　end if
　　return fib(n − 1) + fib(n − 2)`,
    choices: ["5", "8", "11", "13"],
    answer: 1,
    explanation:
      "fib(0)=0, fib(1)=1, fib(2)=1, fib(3)=2, fib(4)=3, fib(5)=5, fib(6)=8。フィボナッチ数列の第 6 項は 8。",
  },
  {
    id: "fq-b14",
    nodeId: "fe-algo",
    question: `配列 a = {7, 2, 9, 3, 5} の最小値のインデックスを求める以下の擬似コードを実行したとき、出力される minIdx はどれか（インデックスは 1 始まり）。

　min ← a[1]
　minIdx ← 1
　for i: 2 to 5
　　if (a[i] < min)
　　　min ← a[i]
　　　minIdx ← i
　　end if
　end for
　出力(minIdx)`,
    choices: ["1", "2", "3", "4"],
    answer: 1,
    explanation:
      "min=7(idx=1)。a[2]=2<7→min=2, idx=2。a[3]=9, a[4]=3(3>2), a[5]=5 変化なし。最小値 2 は index 2。",
  },
  {
    id: "fq-b15",
    nodeId: "fe-algo",
    question: `配列 a = {1, 2, 3, 4, 5} に対して以下の擬似コードを実行したとき、a[2] の値はどれか（n / 2 は整数除算）。

　n ← 5
　for i: 1 to n / 2
　　tmp ← a[i]
　　a[i] ← a[n − i + 1]
　　a[n − i + 1] ← tmp
　end for`,
    choices: ["2", "3", "4", "5"],
    answer: 2,
    explanation:
      "n/2=2。i=1: a[1]とa[5]交換→{5,2,3,4,1}。i=2: a[2]とa[4]交換→{5,4,3,2,1}。a[2]=4。配列を逆順にするアルゴリズム。",
  },
  {
    id: "fq-b16",
    nodeId: "fe-algo",
    question: `ソート済み配列 a = {1, 3, 5, 7, 9, 11, 13, 15}（1 始まり）から target=11 を 2 分探索する。何回の反復で発見されるか（mid の計算は整数除算）。

　lo ← 1; hi ← 8; count ← 0
　while (lo ≦ hi)
　　mid ← (lo + hi) / 2
　　count ← count + 1
　　if (a[mid] = target) break
　　else if (a[mid] < target) lo ← mid + 1
　　else hi ← mid − 1
　end while
　出力(count)`,
    choices: ["1", "2", "3", "4"],
    answer: 1,
    explanation:
      "1回目: mid=4, a[4]=7<11→lo=5。2回目: mid=6, a[6]=11=target→break。count=2。",
  },
  {
    id: "fq-b17",
    nodeId: "fe-prog",
    question: `以下の擬似コードを実行したとき、出力される i の値はどれか。

　result ← 1
　i ← 1
　while (result < 100)
　　i ← i + 1
　　result ← result * i
　end while
　出力(i)`,
    choices: ["4", "5", "6", "7"],
    answer: 1,
    explanation:
      "i=2:result=2, i=3:result=6, i=4:result=24, i=5:result=120≥100→ループ終了。出力 i=5。",
  },
  {
    id: "fq-b18",
    nodeId: "fe-algo",
    question: `以下の擬似コードは n の約数の個数を求める。n=12 のとき出力される count の値はどれか。

　n ← 12
　count ← 0
　for i: 1 to n
　　if (n mod i = 0)
　　　count ← count + 1
　　end if
　end for
　出力(count)`,
    choices: ["4", "5", "6", "8"],
    answer: 2,
    explanation:
      "12 の約数: 1, 2, 3, 4, 6, 12 の 6 個。count=6。",
  },
  {
    id: "fq-b19",
    nodeId: "fe-algo",
    question: `配列 a = {2, 5, 1, 8, 3, 6} に対して以下の擬似コードを実行したとき、出力される sum の値はどれか。

　sum ← 0
　for i: 1 to 6
　　if (a[i] mod 2 = 0)
　　　sum ← sum + a[i]
　　end if
　end for
　出力(sum)`,
    choices: ["14", "16", "18", "20"],
    answer: 1,
    explanation:
      "偶数の要素: 2, 8, 6。sum=2+8+6=16。",
  },
  {
    id: "fq-b20",
    nodeId: "fe-algo",
    question: `配列 a = {4, 7, 2, 9, 5} の 2 番目に大きい値を求める以下の擬似コードを実行したとき、出力される max2 はどれか。

　max1 ← a[1]
　max2 ← −9999
　for i: 2 to 5
　　if (a[i] > max1)
　　　max2 ← max1
　　　max1 ← a[i]
　　else if (a[i] > max2)
　　　max2 ← a[i]
　　end if
　end for
　出力(max2)`,
    choices: ["5", "7", "8", "9"],
    answer: 1,
    explanation:
      "max1=4, max2=−9999。i=2: 7>4→max2=4, max1=7。i=3: 2<7かつ2>4?→No。i=4: 9>7→max2=7, max1=9。i=5: 5<9かつ5>7?→No。max2=7。",
  },
];
