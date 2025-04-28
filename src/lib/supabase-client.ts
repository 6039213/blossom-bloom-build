
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://oauckvkigfrunfohaqzk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hdWNrdmtpZ2ZydW5mb2hhcXprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4NDMwMDIsImV4cCI6MjA2MTQxOTAwMn0.K-hhlb103cSKpWtAtJwxT-y1TxXp1muQwqtbIrqT3EA";

let supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const getSupabaseClient = () => {
  return supabaseClient;
};

export async function isLoggedIn() {
  const { data, error } = await supabaseClient.auth.getSession();
  return !!data.session && !error;
}
