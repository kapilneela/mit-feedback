import { createClient } from '@supabase/supabase-js';

// Default Supabase project credentials for MIT-WPU FY Engineering
const DEFAULT_SUPABASE_URL = 'https://gnwhigxywondejqroeiq.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_17UjgZlwT_njAZEtqbKpzw_mwZ6ZSK1';

const STORAGE_KEY_URL = 'mitwpu_supabase_url';
const STORAGE_KEY_KEY = 'mitwpu_supabase_anon_key';

export function getSupabaseCredentials() {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

  const storedUrl = localStorage.getItem(STORAGE_KEY_URL) || envUrl;
  const storedKey = localStorage.getItem(STORAGE_KEY_KEY) || envKey;

  return { 
    url: (storedUrl || DEFAULT_SUPABASE_URL).trim(), 
    key: (storedKey || DEFAULT_SUPABASE_ANON_KEY).trim() 
  };
}

export function saveSupabaseCredentials(url, key) {
  if (url) localStorage.setItem(STORAGE_KEY_URL, url.trim());
  else localStorage.removeItem(STORAGE_KEY_URL);

  if (key) localStorage.setItem(STORAGE_KEY_KEY, key.trim());
  else localStorage.removeItem(STORAGE_KEY_KEY);
  
  // Re-init client
  initSupabaseClient();
}

let supabaseInstance = null;

export function initSupabaseClient() {
  const { url, key } = getSupabaseCredentials();
  if (url && key && url.startsWith('http')) {
    try {
      supabaseInstance = createClient(url, key);
      return supabaseInstance;
    } catch (e) {
      console.warn('Supabase initialization failed, falling back to local database mode:', e);
      supabaseInstance = null;
      return null;
    }
  }
  supabaseInstance = null;
  return null;
}

export function getSupabase() {
  if (!supabaseInstance) {
    initSupabaseClient();
  }
  return supabaseInstance;
}

export function isSupabaseConnected() {
  const { url, key } = getSupabaseCredentials();
  return Boolean(url && key && url.startsWith('http'));
}
