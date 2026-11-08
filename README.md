# nextjs-rls-starter

A Next.js App Router starter where Supabase authorization lives in Postgres
row-level security instead of in the UI. Pages call the same queries for every
user; the database decides which rows come back. Copy the pattern, drop the
demo table, keep the policy setup.

Built for the talk I give about RLS: the common failure mode is filtering on
the client and trusting it. Here the anon key is the only credential shipped to
the browser and the policies are the whole authorization model.

## Prerequisites

- Node.js 20+
- Docker (for the local Supabase stack)
- [Supabase CLI](https://supabase.com/docs/guides/cli)

## Install

```bash
npm install
cp .env.example .env.local
supabase start          # prints the local URL and anon key
supabase db reset       # applies supabase/migrations
npm run dev
```

Paste the values printed by `supabase start` into `.env.local`.

## Usage

1. Open http://localhost:3000/notes and sign in with a magic link (the link is
   printed by `supabase start`, not emailed).
2. Create notes from the SQL editor or wire up the API route from
   `app/api/notes`. Rows default to `shared = false`.
3. Flip `shared` to `true` on one row and reload in a second browser session:
   the shared note appears for both users, private ones stay put.

The typed helpers in `src/lib/data/notes.ts` never filter by `owner_id` on
select. That is deliberate: if you delete the policies, the queries start
returning everything.

## Layout

```
app/notes/page.tsx            server component, lists what RLS allows
src/lib/supabase/client.ts    browser client, memoised per tab
src/lib/supabase/server.ts    cookie-bound client for RSC and route handlers
src/lib/data/notes.ts         typed queries and mutations
src/lib/database.types.ts     hand-written Database type for the demo table
supabase/migrations/          schema plus policies
```

## Deploy

Deploy button placeholder: replace this line with your Vercel import URL once
you fork the repo. Set `NEXT_PUBLIC_SUPABASE_URL` and
`NEXT_PUBLIC_SUPABASE_ANON_KEY` in the host, then run `supabase db push`
against the linked project.

## License

MIT
