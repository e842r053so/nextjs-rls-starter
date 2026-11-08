import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "../database.types";

/**
 * Browser client. `createBrowserClient` already memoises per tab, so import
 * this from client components instead of constructing your own.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
