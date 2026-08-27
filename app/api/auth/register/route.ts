import { NextResponse, type NextRequest } from "next/server";
import { logServerError } from "@/lib/logger";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { parseRegisterInput } from "@/lib/validation/auth";

export async function POST(request: NextRequest) {
  let input;
  try {
    input = parseRegisterInput(await request.json());
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: error instanceof Error ? error.message : "INVALID_REQUEST" } },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: {
        display_name: input.displayName,
        preferred_language: input.preferredLanguage,
      },
    },
  });

  if (error || !data.user) {
    logServerError("AUTH_LOGIN_FAILED", { reason: error?.message || "REGISTER_FAILED" });
    return NextResponse.json({ success: false, error: { code: "REGISTER_FAILED" } }, { status: 400 });
  }

  try {
    const admin = createAdminClient();
    await admin.from("profiles").upsert({
      id: data.user.id,
      display_name: input.displayName,
      preferred_language: input.preferredLanguage,
    });
  } catch (error) {
    logServerError("DATABASE_ERROR", { reason: error instanceof Error ? error.message : "PROFILE_UPSERT_FAILED" });
  }

  return NextResponse.json({
    success: true,
    user: {
      id: data.user.id,
      email: data.user.email,
      displayName: input.displayName,
    },
  });
}
