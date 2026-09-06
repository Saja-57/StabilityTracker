import { createClient, processLock } from "@supabase/supabase-js";

import {
  requireSupabasePublicEnvironment,
  type SupabasePublicEnvironment,
} from "./environment";

export interface MobileSessionStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

export function createSupabaseMobileClient(
  environment: SupabasePublicEnvironment,
  secureSessionStorage: MobileSessionStorage,
) {
  const { url, anonKey } = requireSupabasePublicEnvironment(environment);

  return createClient(url, anonKey, {
    auth: {
      storage: secureSessionStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      lock: processLock,
    },
  });
}
