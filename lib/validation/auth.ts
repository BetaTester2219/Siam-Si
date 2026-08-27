const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type RegisterInput = {
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
  preferredLanguage: "th" | "en" | "zh";
};

export type LoginInput = {
  email: string;
  password: string;
};

function asRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object") {
    throw new Error("INVALID_BODY");
  }
  return value as Record<string, unknown>;
}

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function language(value: unknown): "th" | "en" | "zh" {
  return value === "en" || value === "zh" ? value : "th";
}

export function parseRegisterInput(value: unknown): RegisterInput {
  const record = asRecord(value);
  const displayName = asString(record.display_name || record.displayName);
  const email = asString(record.email).toLowerCase();
  const password = typeof record.password === "string" ? record.password : "";
  const confirmPassword = typeof record.confirm_password === "string" ? record.confirm_password : "";

  if (!displayName || !email || !password || !confirmPassword) {
    throw new Error("REQUIRED_FIELDS");
  }
  if (!emailPattern.test(email)) {
    throw new Error("INVALID_EMAIL");
  }
  if (password.length < 8) {
    throw new Error("WEAK_PASSWORD");
  }
  if (password !== confirmPassword) {
    throw new Error("PASSWORD_MISMATCH");
  }

  return {
    displayName,
    email,
    password,
    confirmPassword,
    preferredLanguage: language(record.preferred_language || record.preferredLanguage),
  };
}

export function parseLoginInput(value: unknown): LoginInput {
  const record = asRecord(value);
  const email = asString(record.email).toLowerCase();
  const password = typeof record.password === "string" ? record.password : "";

  if (!email || !password) {
    throw new Error("REQUIRED_FIELDS");
  }
  if (!emailPattern.test(email)) {
    throw new Error("INVALID_EMAIL");
  }

  return { email, password };
}
