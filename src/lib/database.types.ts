/**
 * Hand-written subset of the generated Supabase types, trimmed to the demo
 * table. Regenerate with:
 *
 *   supabase gen types typescript --local > src/lib/database.types.ts
 */
export type Database = {
  public: {
    Tables: {
      notes: {
        Row: {
          id: string;
          owner_id: string;
          title: string;
          body: string;
          shared: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          title: string;
          body?: string;
          shared?: boolean;
          created_at?: string;
        };
        Update: {
          title?: string;
          body?: string;
          shared?: boolean;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
