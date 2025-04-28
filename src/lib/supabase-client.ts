import { createClient } from '@supabase/supabase-js';

// The client is initialized lazily to ensure we're in a browser context
let supabaseClient: ReturnType<typeof createClient> | null = null;

// Default values - replace these with your real Supabase credentials when ready
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const getSupabaseClient = () => {
  if (!supabaseClient) {
    try {
      supabaseClient = createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
      );
      
      // If we're using placeholder credentials, log a warning
      if (SUPABASE_URL.includes('placeholder')) {
        console.warn(
          'Using placeholder Supabase credentials. To use real authentication, please set up your Supabase project and update the environment variables.'
        );
      }
    } catch (error) {
      console.error('Failed to create Supabase client:', error);
      throw error;
    }
  }
  
  return supabaseClient;
};

// Mock authentication for development without actual Supabase credentials
export async function isLoggedIn() {
  const supabase = getSupabaseClient();
  
  // If we're using placeholder credentials, we'll pretend the user is not logged in
  if (SUPABASE_URL.includes('placeholder')) {
    return false;
  }
  
  // Otherwise, check with the real Supabase
  const { data, error } = await supabase.auth.getSession();
  return !!data.session && !error;
}
