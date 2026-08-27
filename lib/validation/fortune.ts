const templeIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$|^[a-z0-9]+(?:-[a-z0-9]+)*$/i;

export type DrawFortuneInput = {
  templeId: string;
};

export function parseDrawFortuneInput(value: unknown): DrawFortuneInput {
  if (!value || typeof value !== "object") {
    throw new Error("INVALID_BODY");
  }

  const templeId = (value as { templeId?: unknown }).templeId;
  if (typeof templeId !== "string" || !templeIdPattern.test(templeId)) {
    throw new Error("INVALID_TEMPLE_ID");
  }

  return { templeId };
}
