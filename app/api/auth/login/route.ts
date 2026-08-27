import { NextResponse, type NextRequest } from "next/server";
import { logServerError } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";
import { parseLoginInput } from "@/lib/validation/auth";

export async function POST(request: NextRequest) {
  let input;
  try {
    input = parseLoginInput(await request.json());
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: error instanceof Error ? error.message : "INVALID_REQUEST" } },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });

  if (error || !data.user) {
    logServerError("AUTH_LOGIN_FAILED", { reason: error?.message || "LOGIN_FAILED" });
    return NextResponse.json({ success: false, error: { code: "LOGIN_FAILED" } }, { status: 401 });
  }

  return NextResponse.json({
    success: true,
    user: {
      id: data.user.id,
      email: data.user.email,
    },
  });
}
