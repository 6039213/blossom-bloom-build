
import { createClient } from '@supabase/supabase-js';

// The client is initialized lazily to ensure we're in a browser context
let supabaseClient: ReturnType<typeof createClient> | null = null;

export const getSupabaseClient = () => {
  // We're checking for existence of environmental variables to provide helpful error messages
  if (!import.meta.env.VITE_SUPABASE_URL) {
    console.error('VITE_SUPABASE_URL environment variable is not set');
    throw new Error('Supabase URL not configured');
  }

  if (!import.meta.env.VITE_SUPABASE_ANON_KEY) {
    console.error('VITE_SUPABASE_ANON_KEY environment variable is not set');
    throw new Error('Supabase Anon Key not configured');
  }
  
  if (!supabaseClient) {
    try {
      supabaseClient = createClient(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_ANON_KEY
      );
    } catch (error) {
      console.error('Failed to create Supabase client:', error);
      throw error;
    }
  }
  
  return supabaseClient;
};

// Typed helper for checking Supabase authentication status
export async function isLoggedIn() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.getSession();
  return !!data.session && !error;
}
