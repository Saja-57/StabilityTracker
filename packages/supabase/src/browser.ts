import { createBrowserClient } from "@supabase/ssr";

import {
  requireSupabasePublicEnvironment,
  type SupabasePublicEnvironment,
} from "./environment";

export function createSupabaseBrowserClient(
  environment: SupabasePublicEnvironment,
) {
  const { url, anonKey } = requireSupabasePublicEnvironment(environment);
  return createBrowserClient(url, anonKey);
}
