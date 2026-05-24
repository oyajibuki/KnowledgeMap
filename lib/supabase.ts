import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// env が設定されていない場合は null を返す（お試しモードで動作させるため）
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// ─── 型定義 ───────────────────────────────────────────
export interface UserProgressRow {
  id: string; // user_id
  node_statuses: Record<string, "locked" | "viewed" | "mastered">;
  exam_completed: boolean;
  exam_score: number;
  exam_passed: boolean;
  galaxy_completed: boolean;
  updated_at: string;
}

// ─── CRUD ─────────────────────────────────────────────

/** ユーザーの進捗をロード */
export async function loadProgress(userId: string): Promise<UserProgressRow | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("user_progress")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) return null;
  return data as UserProgressRow;
}

/** ユーザーの進捗を保存（UPSERT） */
export async function saveProgress(
  userId: string,
  payload: Omit<UserProgressRow, "id" | "updated_at">
): Promise<void> {
  if (!supabase) return;
  await supabase.from("user_progress").upsert({
    id: userId,
    ...payload,
    updated_at: new Date().toISOString(),
  });
}
