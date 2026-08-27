type LogCode =
  | "AUTH_LOGIN_FAILED"
  | "FORTUNE_DRAW_FAILED"
  | "FORTUNE_SET_NOT_FOUND"
  | "INVALID_NFC_TOKEN"
  | "DATABASE_ERROR";

type LogContext = Record<string, string | number | boolean | null | undefined>;

export function logServerError(code: LogCode, context: LogContext = {}) {
  const safeContext = Object.fromEntries(
    Object.entries(context).filter(([key]) => !/password|token|secret|key|authorization/i.test(key))
  );
  console.error(JSON.stringify({ code, ...safeContext }));
}
