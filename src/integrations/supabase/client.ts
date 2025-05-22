
// Re-export from our lib file to maintain compatibility
import { supabase, getSupabaseClient, Database } from '@/lib/supabase-client';

export { supabase, getSupabaseClient };
export type { Database };
