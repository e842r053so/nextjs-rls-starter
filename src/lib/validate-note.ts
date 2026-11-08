/**
 * Request validation for the notes API. Mirrors the column constraints in
 * supabase/migrations so bad payloads fail with 422 before Postgres sees them.
 */
export type NoteInput = {
  title: string;
  body: string;
  shared: boolean;
};

export const MAX_TITLE_LENGTH = 120;
export const MAX_BODY_LENGTH = 4000;

export function parseNoteInput(value: unknown): NoteInput | { error: string } {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return { error: "payload must be a JSON object" };
  }

  const record = value as Record<string, unknown>;
  const title = typeof record.title === "string" ? record.title.trim() : "";
  const body = typeof record.body === "string" ? record.body.trim() : "";

  if (title.length === 0) return { error: "title is required" };
  if (title.length > MAX_TITLE_LENGTH) {
    return { error: `title exceeds ${MAX_TITLE_LENGTH} characters` };
  }
  if (body.length > MAX_BODY_LENGTH) {
    return { error: `body exceeds ${MAX_BODY_LENGTH} characters` };
  }
  if (record.shared !== undefined && typeof record.shared !== "boolean") {
    return { error: "shared must be a boolean" };
  }

  return { title, body, shared: record.shared ?? false };
}
