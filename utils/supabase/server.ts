// server.ts - server-only Supabase client
import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseServerClient: SupabaseClient | null = null;

/**
 * Returns a Supabase client that uses the SERVICE ROLE KEY.
 * Important: only import/usage from server code (API routes, getServerSideProps)
 */
export function createClient(): SupabaseClient {
  if (supabaseServerClient) return supabaseServerClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error('Missing SUPABASE environment variables. Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.');
  }

  supabaseServerClient = createSupabaseClient(url, serviceKey, {
    // optional: set global fetch to node-fetch if needed by your runtime
    // For next.js serverless Node runtime the default is fine.
  });

  return supabaseServerClient;
}