import { NextResponse } from "next/server";
import { logServerError } from "@/lib/logger";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ success: false, error: { code: "AUTH_REQUIRED" } }, { status: 401 });
  }

  try {
    const admin = createAdminClient();
    const { data: history, error: historyError } = await admin
      .from("fortune_history")
      .select("id, temple_id, fortune_set_id, fortune_id, fortune_number, language, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (historyError) {
      logServerError("DATABASE_ERROR", { reason: "HISTORY_QUERY_FAILED" });
      return NextResponse.json({ success: false, error: { code: "HISTORY_QUERY_FAILED" } }, { status: 500 });
    }

    const templeIds = Array.from(new Set((history || []).map((item) => item.temple_id)));
    const { data: temples } = templeIds.length
      ? await admin.from("temples").select("id, name_th, name_en").in("id", templeIds)
      : { data: [] };
    const templeMap = new Map((temples || []).map((temple) => [temple.id, temple]));

    return NextResponse.json({
      success: true,
      history: (history || []).map((item) => {
        const temple = templeMap.get(item.temple_id);
        return {
          id: item.id,
          templeId: item.temple_id,
          fortuneSetId: item.fortune_set_id,
          fortuneId: item.fortune_id,
          fortuneNumber: item.fortune_number,
          language: item.language,
          createdAt: item.created_at,
          templeName: {
            th: temple?.name_th || "",
            en: temple?.name_en || "",
          },
        };
      }),
    });
  } catch (error) {
    logServerError("DATABASE_ERROR", { reason: error instanceof Error ? error.message : "HISTORY_ROUTE_FAILED" });
    return NextResponse.json({ success: false, error: { code: "SERVER_ERROR" } }, { status: 500 });
  }
}
