import { listNotes } from "@/lib/data/notes";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function NotesPage() {
  const supabase = await createClient();
  const notes = await listNotes(supabase);

  return (
    <main>
      <h1>Notes</h1>
      <p>
        Showing {notes.length} row{notes.length === 1 ? "" : "s"}. Private rows
        are your own; shared rows come from anyone.
      </p>
      <ul>
        {notes.map((note) => (
          <li key={note.id}>
            <h2>{note.title}</h2>
            {note.body ? <p>{note.body}</p> : null}
            <small>
              {note.shared ? "shared" : "private"} &middot;{" "}
              <time dateTime={note.created_at}>{note.created_at}</time>
            </small>
          </li>
        ))}
      </ul>
    </main>
  );
}
