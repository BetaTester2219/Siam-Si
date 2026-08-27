import { randomInt } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { logServerError } from "@/lib/logger";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient as createServerSupabaseClient } from "@/lib/supabase/server";
import { parseDrawFortuneInput } from "@/lib/validation/fortune";
import type { Fortune, Locale } from "@/types/domain";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type DrawResponse =
  | {
      success: true;
      draw: {
        historyId: string;
        templeId: string;
        fortuneSetId: string;
        fortuneNumber: number;
        fortune: {
          id: string;
          originalText: string;
          interpretation: string | null;
          sourceReference: string | null;
        };
      };
    }
  | {
      success: false;
      error: {
        code: string;
        message: string;
      };
    };

function json(body: DrawResponse, status = 200) {
  return NextResponse.json(body, { status });
}

function publicError(code: string, message: string, status: number) {
  return json({ success: false, error: { code, message } }, status);
}

function languageFromRequest(request: NextRequest): Locale {
  const explicit = request.headers.get("x-preferred-language");
  if (explicit === "th" || explicit === "en" || explicit === "zh") return explicit;

  const acceptLanguage = request.headers.get("accept-language") || "";
  if (acceptLanguage.toLowerCase().startsWith("en")) return "en";
  return "th";
}

function localizeFortune(fortune: Fortune, language: Locale) {
  if (language === "en") {
    return {
      originalText: fortune.original_text_en || fortune.original_text_th,
      interpretation: fortune.interpretation_en || fortune.interpretation_th,
    };
  }
  if (language === "zh") {
    return {
      originalText: fortune.original_text_zh || fortune.original_text_en || fortune.original_text_th,
      interpretation: fortune.interpretation_zh || fortune.interpretation_en || fortune.interpretation_th,
    };
  }
  return {
    originalText: fortune.original_text_th,
    interpretation: fortune.interpretation_th,
  };
}

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return publicError("AUTH_REQUIRED", "Please sign in before drawing a fortune.", 401);
  }

  let input;
  try {
    input = parseDrawFortuneInput(await request.json());
  } catch {
    return publicError("INVALID_REQUEST", "Invalid fortune draw request.", 400);
  }

  try {
    const admin = createAdminClient();

    const templeQuery = admin.from("temples").select("id, is_active");
    const { data: temple, error: templeError } = uuidPattern.test(input.templeId)
      ? await templeQuery.eq("id", input.templeId).single()
      : await templeQuery.eq("slug", input.templeId).single();

    if (templeError || !temple) {
      logServerError("FORTUNE_DRAW_FAILED", { reason: "TEMPLE_NOT_FOUND", templeId: input.templeId });
      return publicError("TEMPLE_NOT_FOUND", "Temple not found.", 404);
    }

    if (!temple.is_active) {
      return publicError("TEMPLE_UNAVAILABLE", "This temple is not available for fortune drawing.", 409);
    }

    const { data: fortuneSet, error: fortuneSetError } = await admin
      .from("fortune_sets")
      .select("id, total_fortunes")
      .eq("temple_id", temple.id)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (fortuneSetError || !fortuneSet || fortuneSet.total_fortunes < 1) {
      logServerError("FORTUNE_SET_NOT_FOUND", { templeId: temple.id });
      return publicError("FORTUNE_SET_NOT_FOUND", "Fortune set is unavailable.", 404);
    }

    const fortuneNumber = randomInt(1, fortuneSet.total_fortunes + 1);

    const { data: fortune, error: fortuneError } = await admin
      .from("fortunes")
      .select(
        "id, fortune_set_id, number, original_text_th, interpretation_th, original_text_en, interpretation_en, original_text_zh, interpretation_zh, source_url, source_reference, content_status, created_at, updated_at"
      )
      .eq("fortune_set_id", fortuneSet.id)
      .eq("number", fortuneNumber)
      .single();

    if (fortuneError || !fortune) {
      logServerError("FORTUNE_DRAW_FAILED", {
        reason: "FORTUNE_NUMBER_MISSING",
        fortuneSetId: fortuneSet.id,
        fortuneNumber,
      });
      return publicError("FORTUNE_NOT_FOUND", "Fortune result is unavailable.", 404);
    }

    const language = languageFromRequest(request);
    const { data: history, error: historyError } = await admin
      .from("fortune_history")
      .insert({
        user_id: user.id,
        temple_id: temple.id,
        fortune_set_id: fortuneSet.id,
        fortune_id: fortune.id,
        fortune_number: fortuneNumber,
        language,
      })
      .select("id")
      .single();

    if (historyError || !history) {
      logServerError("DATABASE_ERROR", { reason: "HISTORY_INSERT_FAILED", templeId: temple.id });
      return publicError("HISTORY_SAVE_FAILED", "Could not save fortune history.", 500);
    }

    const localized = localizeFortune(fortune, language);
    return json({
      success: true,
      draw: {
        historyId: history.id,
        templeId: temple.id,
        fortuneSetId: fortuneSet.id,
        fortuneNumber,
        fortune: {
          id: fortune.id,
          originalText: localized.originalText,
          interpretation: localized.interpretation,
          sourceReference: fortune.source_reference,
        },
      },
    });
  } catch (error) {
    logServerError("FORTUNE_DRAW_FAILED", { reason: error instanceof Error ? error.message : "UNKNOWN" });
    return publicError("SERVER_ERROR", "Could not draw fortune at this time.", 500);
  }
}
