import { createClient } from "@/lib/supabase/server";

export async function getCurrentUserFortuneHistory() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { data: [], error: "AUTH_REQUIRED" as const };
  }

  const { data, error } = await supabase
    .from("fortune_history")
    .select("id, temple_id, fortune_number, language, created_at, temples(name_th, name_en)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return { data: [], error: "DATABASE_ERROR" as const };
  }

  return { data: data || [], error: null };
}
