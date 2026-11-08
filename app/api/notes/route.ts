import { NextResponse } from "next/server";
import { createNote, listNotes } from "@/lib/data/notes";
import { createClient } from "@/lib/supabase/server";
import { parseNoteInput } from "@/lib/validate-note";

export async function GET() {
  const supabase = await createClient();
  const notes = await listNotes(supabase);
  return NextResponse.json({ notes });
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "body must be JSON" }, { status: 400 });
  }

  const input = parseNoteInput(payload);
  if ("error" in input) {
    return NextResponse.json({ error: input.error }, { status: 422 });
  }

  const supabase = await createClient();
  try {
    const note = await createNote(supabase, input);
    return NextResponse.json({ note }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "createNote failed";
    // RLS rejects inserts without a session; nothing here decides ownership.
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
