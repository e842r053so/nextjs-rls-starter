import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../database.types";

export type Note = Pick<
  Database["public"]["Tables"]["notes"]["Row"],
  "id" | "title" | "body" | "shared" | "created_at"
>;

type Client = SupabaseClient<Database>;

/**
 * No `owner_id` filter here on purpose: the select policies return the caller's
 * private notes plus every shared note. If this starts leaking rows, the
 * policies are wrong, not the query.
 */
export async function listNotes(supabase: Client, limit = 50): Promise<Note[]> {
  const { data, error } = await supabase
    .from("notes")
    .select("id, title, body, shared, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(`listNotes failed: ${error.message}`);
  return data ?? [];
}

export async function createNote(
  supabase: Client,
  input: { title: string; body?: string; shared?: boolean },
): Promise<Note> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) throw new Error("createNote requires a signed-in user");

  const { data, error } = await supabase
    .from("notes")
    .insert({
      owner_id: user.id,
      title: input.title.trim(),
      body: input.body?.trim() ?? "",
      shared: input.shared ?? false,
    })
    .select("id, title, body, shared, created_at")
    .single();

  if (error) throw new Error(`createNote failed: ${error.message}`);
  return data;
}

/** Only the owner can update; the update policy enforces it. */
export async function setNoteShared(
  supabase: Client,
  id: string,
  shared: boolean,
): Promise<void> {
  const { error } = await supabase.from("notes").update({ shared }).eq("id", id);
  if (error) throw new Error(`setNoteShared failed: ${error.message}`);
}

export async function deleteNote(supabase: Client, id: string): Promise<void> {
  const { error } = await supabase.from("notes").delete().eq("id", id);
  if (error) throw new Error(`deleteNote failed: ${error.message}`);
}
