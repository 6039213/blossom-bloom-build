
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

// Initialize Supabase client with environment variables
let supabaseClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  if (!supabaseClient) {
    // URL and key can be pulled from environment variables or use the ones from integrations
    const supabaseUrl = "https://oauckvkigfrunfohaqzk.supabase.co";
    const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hdWNrdmtpZ2ZydW5mb2hhcXprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4NDMwMDIsImV4cCI6MjA2MTQxOTAwMn0.K-hhlb103cSKpWtAtJwxT-y1TxXp1muQwqtbIrqT3EA";
    
    // Fixed type issue by using correct generic parameter
    supabaseClient = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    });
  }
  
  return supabaseClient;
}

// Export a convenient singleton instance for direct imports
export const supabase = getSupabaseClient();

// Export types for convenience
export type { Database };
